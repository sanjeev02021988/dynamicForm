import { Input, InputWrapper, NumberInput } from "@mantine/core";
import { DatePicker } from '@mantine/dates';
import { Calendar } from 'tabler-icons-react';
import { Sizes, SizeMap, FeidlSubType } from "./consts";
import SelectWrapper from "./SelectWrapper";

const FieldWrapper = ({ fieldData, form, fullWidth }) => {
  const { id, label, description, required, subType, size, placeholder } = fieldData;
  const { error } = form?.getInputProps(id);
  // If field subtype is OPTIONS then return SelectWrapper.
  if (subType === FeidlSubType.OPTIONS) {
    return <SelectWrapper fieldData={fieldData} form={form} fullWidth={fullWidth} />;
  }

  const fieldJSX = () => {
    const fieldProps = {
      id: `field-${id}`,
      placeholder,
      ...form?.getInputProps(id)
    };
    switch (subType) {
      case FeidlSubType.NUMBER: 
        return <NumberInput {...fieldProps} error={null} />;
      case FeidlSubType.DATE: 
        return <DatePicker {...fieldProps} error={null} icon={<Calendar />}/>;
      default:
        return <Input {...fieldProps}/>;
    }
  };

  return (
    <InputWrapper
      id={id}
      required={required}
      label={label}
      description={description}
      className={"InputWrapper"}
      style={{ width: SizeMap[fullWidth ? Sizes.XL : size] }}
      error={error}
    >
      {fieldJSX()}
    </InputWrapper>
  );
};

export default FieldWrapper;
