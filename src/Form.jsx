import Group from "./Group";
import { processFormConfig } from "./Utils";
import { Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useCallback, useMemo } from "react";
import { getVisibleMap } from "./Utils";

// JSON
// Array: describes the layout of the fields
// Select: Contains dropdown options, where a option can contain array of fields to be shown if that option is selected.
// Layout Props: Contains if the field size: S, L, XL or display: INLINE, BLOCK

// CODE
// Field Wrapper: Will analyse layout props and will see if the dropdown options need to rendered.
// Will check for validations as well. Will collate the field values as well and pass it to parent.
// Form Wrapper: Will collect the field values from all the childrens.

// Can have a look at useForm and Form implementation of mantine
// group , multiple conditions, disable

function Form(props) {
  const { config } = props;
  const { groups, nodeMap, validate, initialValues } = useMemo(
    () => processFormConfig(config),
    [config]
  );
  const form = useForm({ initialValues, validate });
  const isVisibleMap = useMemo(() => {
    return getVisibleMap(nodeMap, form.values, groups);
  }, [nodeMap, form.values, groups]);

  const onSubmit = useCallback(() => {
    const values = {};
    Object.keys(form.values).forEach((key) => {
      if (isVisibleMap[key] && form.values[key]) {
        values[key] = form.values[key];
      }
    });
    console.log(values);
  }, [form.values, isVisibleMap]);

  return (
    <div className={"Form"}>
      {groups.map((group) => (
        <Group
          key={group.id}
          group={group}
          form={form}
          nodeMap={nodeMap}
          isVisibleMap={isVisibleMap}
        />
      ))}
      <Button onClick={onSubmit}>Submit</Button>
    </div>
  );
}

export default Form;
