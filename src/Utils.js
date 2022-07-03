// Function to process nodes and to generate groups and maps for nodes, initial values and validations.
export function processFormConfig(nodes = []) {
  const initialValues = {};
  const validationMap = {};
  // Step 1: Iterate nodes to create map for nodes, initial values and validations.
  const nodeMap = nodes.reduce((nodeMap, node) => {
    const { id, required, regex, ValidationMsg = "Invalid Input" } = node;
    let { size } = node;

    // Populate validation map.
    if (regex) {
      let regExp = new RegExp(regex);
      validationMap[id] = (val) =>
        val
          ? regExp.test(val)
            ? null
            : ValidationMsg
          : required && "Required Field";
    } else if (required) {
      validationMap[id] = (val) => (val ? null : "Required Field");
    }
    // Population nodes map and initial values.
    nodeMap[node.id] = { ...node, size };
    node.value && (initialValues[node.id] = node.value);
    return nodeMap;
  }, {});

  // Step 2: Generate groups to be rendered.
  const groups = generateGroups(nodes, nodeMap);

  return {
    groups: groups.sort((a, b) => a.order - b.order),
    nodeMap,
    initialValues,
    validate: validationMap
  };
}

// Function to generate groups
function generateGroups(nodes, nodeMap) {
  const groups = [];
  nodes.forEach((node) => {
    const { id: nodeId, order, options = [], members = [], dependsOn } = node;
    // Iterate options to populate conditions in dependent nodes.
    if (!dependsOn) {
      options.forEach((option) => {
        const { child } = option;
        if (child) {
          if (nodeMap[child]) {
            if (!nodeMap[child].conditions) {
              nodeMap[child].conditions = [];
            }
            nodeMap[child].conditions.push({
              key: nodeId,
              value: option.value
            });
          } else {
            console.error(`Node Missing ${child}`);
          }
        }
      });
    }
    // Add groupId to the child nodes.
    members.forEach((member) => {
      nodeMap[member].groupId = nodeId;
    });
    // Add groups or single nodes as groups to the groups array.
    if (!nodeMap[nodeId].groupId) {
      groups.push({
        id: nodeId,
        order,
        size: nodeMap[nodeId].size,
        // label: nodeMap[nodeId].label,
        members: node.members || [nodeId],
        conditions: nodeMap[nodeId].conditions
      });
    }
  });
  return groups;
}

// Function to check if the node is visible or not.
function isVisible(conditions, visibleMap, form) {
  if (conditions) {
    return conditions.some(
      ({ key, value }) => visibleMap[key] && form[key] === value
    );
  } else {
    return true;
  }
}

// Function to get map to check if the nodes are visible or not.
export function getVisibleMap(nodeMap, form, groups) {
  const visibleMap = {};
  groups.forEach(({ id, members }) => {
    visibleMap[id] = isVisible(nodeMap[id].conditions, visibleMap, form);
    members.forEach((mem) => {
      visibleMap[mem] =
        visibleMap[id] && isVisible(nodeMap[mem].conditions, visibleMap, form);
    });
  });
  return visibleMap;
}

// Function to get options for select component.
export const getOptions = (options, dependsOn, form) =>
  dependsOn ? (options ? options[form[dependsOn]] : []) : options || [];
