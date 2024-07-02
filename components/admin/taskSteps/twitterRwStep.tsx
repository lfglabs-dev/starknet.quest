import React, { FunctionComponent } from "react";
import TextInput from "../textInput";

type TwitterRwStepProps = {
  handleTasksInputChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => void;
  step: StepMap;
  index: number;
};

const TwitterRwStep: FunctionComponent<TwitterRwStepProps> = ({
  handleTasksInputChange,
  step,
  index,
}) => {
  return (
    <div className="flex flex-col gap-4 pt-2">
      <TextInput
        onChange={(e) => handleTasksInputChange(e, index)}
        value={step.data.twrw_name}
        name="twrw_name"
        label="Name"
        placeholder="Name"
      />
      <TextInput
        onChange={(e) => handleTasksInputChange(e, index)}
        value={step.data.twrw_desc}
        name="twrw_desc"
        label="Description"
        placeholder="Description"
        multiline={4}
      />
      <TextInput
        onChange={(e) => handleTasksInputChange(e, index)}
        value={step.data.twrw_post_link}
        name="twrw_post_link"
        label="Post URL"
        placeholder="Post URL"
      />
    </div>
  );
};

export default TwitterRwStep;
