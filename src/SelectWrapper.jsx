import { useState, useEffect } from "react";
import OptionService from "./OptionService";
import { InputWrapper, Select } from "@mantine/core";
import { SizeMap } from "./consts";

const getOptions = (options, dependsOn, form) =>
  dependsOn ? (options ? options[form[dependsOn]] : []) : options;

const SelectWrapper = ({ fieldData, form }) => {
  const {
    id,
    label,
    description,
    required,
    options,
    size,
    dependsOn,
    url
  } = fieldData;
  const [fOptions, setFOptions] = useState(
    getOptions(options, dependsOn, form.values)
  );
  useEffect(() => {
    if (options) {
      setFOptions(getOptions(options, dependsOn, form.values));
    } else if (url) {
      OptionService(url, dependsOn, form.values).then((resp) => {
        setFOptions(resp);
      });
    }
  }, [options, dependsOn, form.values, url]);
  return (
    <InputWrapper
      id={id}
      required={required}
      label={label}
      description={description}
      className={"InputWrapper"}
      style={{ width: SizeMap[size] }}
    >
      <Select id={`field-${id}`} data={fOptions} {...form?.getInputProps(id)} />
    </InputWrapper>
  );
};

export default SelectWrapper;
