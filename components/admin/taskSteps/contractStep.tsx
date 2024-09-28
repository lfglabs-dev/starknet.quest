import React, { FunctionComponent } from "react";
import TextInput from "../textInput";

type ContractStepProps = {
  handleTasksInputChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => void;
  step: StepMap;
  index: number;
};

const ContractStep: FunctionComponent<ContractStepProps> = ({
  handleTasksInputChange,
  step,
  index,
}) => {
  return (
    <div className="flex flex-col gap-4 pt-2">
      <TextInput
        onChange={(e) => handleTasksInputChange(e, index)}
        value={step.data.contract_name || ""}
        name="contract_name"
        label="Name"
        placeholder="Name"
      />
      <TextInput
        onChange={(e) => handleTasksInputChange(e, index)}
        value={step.data.contract_desc || ""}
        name="contract_desc"
        label="Description"
        placeholder="Description"
        multiline={4}
      />
      <TextInput
        onChange={(e) => handleTasksInputChange(e, index)}
        value={step.data.contract_href || ""}
        name="contract_href"
        label="URL"
        placeholder="URL"
      />
      <TextInput
        onChange={(e) => handleTasksInputChange(e, index)}
        value={step.data.contract_cta || ""}
        name="contract_cta"
        label="CTA"
        placeholder="CTA"
      />
      <TextInput
        onChange={(e) => handleTasksInputChange(e, index)}
        value={step.data.calls || ""}
        name="calls"
        label="Calls (JSON)"
        placeholder='e.g., {"function": "transfer", "params": {"to": "0x...", "value": "1000"}}'
        multiline={4}
      />
    </div>
  );
};

export default ContractStep;
