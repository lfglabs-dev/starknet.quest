import React, { FunctionComponent } from "react";
import TextInput from "../textInput";

type BalanceStepProps = {
  handleTasksInputChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => void;
  step: StepMap;
  index: number;
};

const BalanceStep: FunctionComponent<BalanceStepProps> = ({
  handleTasksInputChange,
  step,
  index,
}) => {
  return (
    <div className="flex flex-col gap-4 pt-2">
      <TextInput
        onChange={(e) => handleTasksInputChange(e, index)}
        value={step.data.balance_name}
        name="balance_name"
        label="Name"
        placeholder="Name"
      />
      <TextInput
        onChange={(e) => handleTasksInputChange(e, index)}
        value={step.data.balance_desc}
        name="balance_desc"
        label="Description"
        placeholder="Description"
        multiline={4}
      />
      <TextInput
        onChange={(e) => handleTasksInputChange(e, index)}
        value={step.data.balance_href}
        name="balance_href"
        label="URL"
        placeholder="URL"
      />
      <TextInput
        onChange={(e) => handleTasksInputChange(e, index)}
        value={step.data.balance_cta}
        name="balance_cta"
        label="CTA"
        placeholder="CTA"
      />
      <TextInput
        onChange={(e) => handleTasksInputChange(e, index)}
        value={step.data.balance_contracts}
        name="balance_contracts"
        label="Contracts (comma separated)"
        placeholder="Contracts"
      />
    </div>
  );
};

export default BalanceStep;
