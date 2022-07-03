import { useState, useEffect } from "react";
import { InputWrapper, Select, RadioGroup, Radio } from "@mantine/core";
import { SizeMap, Sizes } from "./consts";
import { getOptions } from "./Utils";
import OptionService from "./OptionService";

const SelectWrapper = ({ fieldData, form, fullWidth }) => {
  const {
    id,
    label,
    description,
    required,
    options,
    size,
    dependsOn,
    url,
    placeholder
  } = fieldData;
  const [fOptions, setFOptions] = useState(
    getOptions(options, dependsOn, form.values)
  );
  useEffect(() => {
    // If options are provided then set options depending on the values of dependsOn form field value.
    if (options) {
      setFOptions(getOptions(options, dependsOn, form.values));
    } else if (url) {
      // If url is provided then fetch options.
      OptionService(url, dependsOn, form.values).then((resp) => {
        setFOptions(resp);
      });
    }
  }, [options, dependsOn, form.values, url]);

  const fieldProps = {
    id: `field-${id}`,
    placeholder,
    ...form?.getInputProps(id)
  };
  const fieldWrapperProps = {
    id,
    required,
    label,
    description,
    className: "InputWrapper",
    style: { width: SizeMap[fullWidth ? Sizes.XL : size] }
  };
  // If there are only two options then return a radio group.
  if (fOptions.length === 2) {
    return (
      <RadioGroup {...fieldProps} {...fieldWrapperProps} size="sm">
        {fOptions.map(option => <Radio key={option.value} value={option.value} label={option.label} />)}
      </RadioGroup>
    );
  }
  return (
    <InputWrapper {...fieldWrapperProps}>
      <Select {...fieldProps} data={fOptions} />
    </InputWrapper>
  );
};

export default SelectWrapper;
