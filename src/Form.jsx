import { useCallback, useMemo, useState } from "react";
import { Button, Alert } from "@mantine/core";
import { useForm } from "@mantine/form";
import { AlertCircle, CircleCheck } from 'tabler-icons-react';
import { Type } from "./consts";
import { processFormConfig, getVisibleMap } from "./Utils";
import Group from "./Group";

function Form({ config } ) {
  const [isInvalid, setInvalid] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  // Process config object to get Groups to render and maps for nodes, validation & initial Values.
  const { groups, nodeMap, validate, initialValues } = useMemo(
    () => processFormConfig(config),
    [config]
  );
  // Set form object using the initial values and validations.
  const form = useForm({ initialValues, validate });
  // Required to check if the field should be visible or not.
  const isVisibleMap = useMemo(
    () => getVisibleMap(nodeMap, form.values, groups), 
    [nodeMap, form.values, groups]
  );
  // Method to be called on submit of the form.
  const onSubmit = useCallback(() => {
    const values = {};
    // Get and validate values for visible fields.
    form.clearErrors();
    for(let key in isVisibleMap) {
      // Only process fields which are visible.
      if (isVisibleMap[key] && nodeMap[key].type !== Type.GROUP) {
        values[key] = form.values[key] || null;
        const validation = form.validateField?.(key);
        // Skip further processing if validation failed.
        if (validation.hasError) {
          setInvalid(true);
          setValidationMessage("Invalid Form State!");
          return;
        }
      }
    }
    setInvalid(false);
    setValidationMessage("Form Submitted Successfully!");
    // form.reset();
    console.log(values);
  }, [form.values, isVisibleMap, nodeMap]);

  const alertProps = useMemo(() => ({
    className: "WithoutDesp",
     icon: isInvalid ? <AlertCircle size={16} /> : <CircleCheck size={16} />,
    title: validationMessage,
    color: isInvalid ? "red" : "green"
  }), [isInvalid, validationMessage]);

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
      <div className="Footer">
        <Button className={"Submit"} onClick={onSubmit}>Submit</Button>
        {validationMessage && <Alert {...alertProps} />}
      </div>
    </div>
  );
}

export default Form;
