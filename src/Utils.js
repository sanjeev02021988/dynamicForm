export function processFormConfig(nodes = []) {
  const initialValues = {};
  const validationMap = {};
  const nodeMap = nodes.reduce((nodeMap, node) => {
    const {
      id,
      required,
      regex,
      ValidationMsg = "Invalid Input",
      size = "M"
    } = node;
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
    nodeMap[node.id] = { ...node, size };
    node.value && (initialValues[node.id] = node.value);
    return nodeMap;
  }, {});

  const groups = [];
  nodes.forEach((node) => {
    const { id: nodeId, order, options = [], members = [], dependsOn } = node;
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
    members.forEach((member) => {
      nodeMap[member].groupId = nodeId;
    });
    if (!nodeMap[nodeId].groupId) {
      groups.push({
        id: nodeId,
        order,
        members: node.members || [nodeId],
        conditions: nodeMap[nodeId].conditions
      });
    }
  });

  return {
    groups: groups.sort((a, b) => a.order - b.order),
    nodeMap,
    initialValues,
    validate: validationMap
  };
}

function isVisible(conditions, visibleMap, form) {
  if (conditions) {
    return conditions.some(
      ({ key, value }) => visibleMap[key] && form[key] === value
    );
  } else {
    return true;
  }
}

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
