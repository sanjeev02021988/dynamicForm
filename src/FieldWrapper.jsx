import { Input, InputWrapper } from "@mantine/core";
import SelectWrapper from "./SelectWrapper";
import { SizeMap } from "./consts";

const FieldWrapper = ({ fieldData, form, singleChild }) => {
  const { id, label, description, required, value, subType, size } = fieldData;
  const { error } = form?.getInputProps(id);
  if (subType === "OPTIONS") {
    return (
      <SelectWrapper
        fieldData={fieldData}
        form={form}
        singleChild={singleChild}
      />
    );
  }

  const fieldJSX = () => {
    switch (subType) {
      default:
        return (
          <Input
            id={`field-${id}`}
            value={value}
            {...form?.getInputProps(id)}
          />
        );
    }
  };

  return (
    <InputWrapper
      id={id}
      required={required}
      label={label}
      description={description}
      className={"InputWrapper"}
      style={{ width: SizeMap[singleChild ? "XL" : size] }}
      error={error}
    >
      {fieldJSX()}
    </InputWrapper>
  );
};

export default FieldWrapper;
