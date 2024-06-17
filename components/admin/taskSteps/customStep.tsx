import React, { FunctionComponent } from "react";
import TextInput from "../textInput";

type CustomStepProps = {
  handleTasksInputChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => void;
  step: StepMap;
  index: number;
};

const CustomStep: FunctionComponent<CustomStepProps> = ({
  handleTasksInputChange,
  step,
  index,
}) => {
  return (
    <div className="flex flex-col gap-8 pt-2">
      <TextInput
        onChange={(e) => handleTasksInputChange(e, index)}
        value={step.data.custom_name}
        name="custom_name"
        label="Name"
        placeholder="Name"
      />
      <TextInput
        onChange={(e) => handleTasksInputChange(e, index)}
        value={step.data.custom_desc}
        name="custom_desc"
        label="Description"
        placeholder="Description"
        multiline={4}
      />
      <TextInput
        onChange={(e) => handleTasksInputChange(e, index)}
        value={step.data.custom_href}
        name="custom_href"
        label="API Endpoint"
        placeholder="API Endpoint"
      />
      <TextInput
        onChange={(e) => handleTasksInputChange(e, index)}
        value={step.data.custom_cta}
        name="custom_cta"
        label="URL"
        placeholder="URL"
      />
    </div>
  );
};

export default CustomStep;
