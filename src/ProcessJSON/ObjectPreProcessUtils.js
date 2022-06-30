export function processJSON(config) {
  return config.map((item) => {
    const { Id: id, Type, Value: value, Children, Members } = item;
    let temp = { id };
    if (value) temp.value = value;
    switch (Type) {
      case "Block":
        temp.type = "GROUP";
        temp.members = Members.split(", ");
        break;
      case "DAG":
        temp.type = "FIELD";
        temp.subType = "OPTIONS";
        temp.label = `Label: ${id}`;
        temp.options = Object.keys(Children).map((temp) => ({
          value: temp,
          label: `Label: ${temp} ${Children[temp]}`,
          child: Children[temp]
        }));
        break;
      case "Leaf":
        temp.type = "FIELD";
        temp.label = `Label: ${id}`;
        break;
      default:
        return null;
    }
    return temp;
  });
}
