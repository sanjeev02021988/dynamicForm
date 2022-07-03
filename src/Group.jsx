import FieldWrapper from "./FieldWrapper";

function Group({ group, form, nodeMap, isVisibleMap }) {
  const { members, label = "", id } = group;

  // Render group only if it is visible.
  if (!isVisibleMap[id]) {
    return null;
  }
  // Get visible members of a group in a sorted order.
  const visibleMembers = members
    .filter((member) => isVisibleMap[member])
    .sort((a, b) => nodeMap[a].order - nodeMap[b].order);
  // Render group only if contains a visible field.
  if (visibleMembers.length === 0) {
    return null;
  }
  // Single child should occupy the whole available width of the group.
  const singleChild = visibleMembers.length === 1;
  return (
    <div className={`GroupWrapper ${label && "WithLabel"}`}>
      {label && <div className={"Label"}>{label}</div>}
      <div className={"Group"}>
        {visibleMembers.map((key) => (
          <FieldWrapper key={key} fieldData={nodeMap[key]} form={form} fullWidth={singleChild} />
        ))}
      </div>
    </div>
  );
}
export default Group;
