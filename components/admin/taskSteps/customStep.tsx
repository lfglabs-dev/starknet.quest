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
    <div className="flex flex-col gap-4 pt-2">
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
        label="URL"
        placeholder="URL"
      />
      <TextInput
        onChange={(e) => handleTasksInputChange(e, index)}
        value={step.data.custom_cta}
        name="custom_cta"
        label="CTA"
        placeholder="CTA"
      />
      <TextInput
        onChange={(e) => handleTasksInputChange(e, index)}
        value={step.data.custom_api}
        name="custom_api"
        label="API Endpoint"
        placeholder="API Endpoint"
      />
    </div>
  );
};

export default CustomStep;
