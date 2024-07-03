import React, { FunctionComponent } from "react";
import TextInput from "../textInput";

type DomainStepProps = {
  handleTasksInputChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => void;
  step: StepMap;
  index: number;
};

const DomainStep: FunctionComponent<DomainStepProps> = ({
  handleTasksInputChange,
  step,
  index,
}) => {
  return (
    <div className="flex flex-col gap-4 pt-2">
      <TextInput
        onChange={(e) => handleTasksInputChange(e, index)}
        value={step.data.domain_name}
        name="domain_name"
        label="Name"
        placeholder="Name"
      />
      <TextInput
        onChange={(e) => handleTasksInputChange(e, index)}
        value={step.data.domain_desc}
        name="domain_desc"
        label="Description"
        placeholder="Description"
        multiline={4}
      />
    </div>
  );
};

export default DomainStep;
