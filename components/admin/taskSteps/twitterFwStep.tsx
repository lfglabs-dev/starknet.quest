import React, { FunctionComponent } from "react";
import TextInput from "../textInput";

type TwitterFwStepProps = {
  handleTasksInputChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => void;
  step: StepMap;
  index: number;
};

const TwitterFwStep: FunctionComponent<TwitterFwStepProps> = ({
  handleTasksInputChange,
  step,
  index,
}) => {
  return (
    <div className="flex flex-col gap-4 pt-2">
      <TextInput
        onChange={(e) => handleTasksInputChange(e, index)}
        value={step.data.twfw_name}
        name="twfw_name"
        label="Name"
        placeholder="Name"
      />
      <TextInput
        onChange={(e) => handleTasksInputChange(e, index)}
        value={step.data.twfw_desc}
        name="twfw_desc"
        label="Description"
        placeholder="Description"
        multiline={4}
      />
      <TextInput
        onChange={(e) => handleTasksInputChange(e, index)}
        value={step.data.twfw_username}
        name="twfw_username"
        label="Twitter Username"
        placeholder="Username"
      />
    </div>
  );
};

export default TwitterFwStep;
