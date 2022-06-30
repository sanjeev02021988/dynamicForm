import FieldWrapper from "./FieldWrapper";

function Group({ group, form, nodeMap, isVisibleMap }) {
  const { members, label = "", id } = group;

  if (!isVisibleMap[id]) {
    return null;
  }
  const visibleMembers = members
    .filter((member) => isVisibleMap[member])
    .sort((a, b) => nodeMap[a].order - nodeMap[b].order);
  if (visibleMembers.length === 0) {
    return null;
  }
  const singleChild = visibleMembers.length === 1;
  return (
    <div className={`GroupWrapper ${label && "WithLabel"}`}>
      {label && <div className={"Label"}>{label}</div>}
      <div className={"Group"}>
        {visibleMembers.map((memberKey) => (
          <>
            <FieldWrapper
              key={memberKey}
              fieldData={nodeMap[memberKey]}
              form={form}
              singleChild={singleChild}
            />
          </>
        ))}
      </div>
    </div>
  );
}
export default Group;
