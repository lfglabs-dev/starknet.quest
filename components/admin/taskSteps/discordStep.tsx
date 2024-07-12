import React, { FunctionComponent } from "react";
import TextInput from "../textInput";

type DiscordStepProps = {
  handleTasksInputChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => void;
  step: StepMap;
  index: number;
};

const DiscordStep: FunctionComponent<DiscordStepProps> = ({
  handleTasksInputChange,
  step,
  index,
}) => {
  return (
    <div className="flex flex-col gap-4 pt-2">
      <TextInput
        onChange={(e) => handleTasksInputChange(e, index)}
        value={step.data.dc_name}
        name="dc_name"
        label="Name"
        placeholder="Name"
      />
      <TextInput
        onChange={(e) => handleTasksInputChange(e, index)}
        value={step.data.dc_desc}
        name="dc_desc"
        label="Description"
        placeholder="Description"
        multiline={4}
      />
      <TextInput
        onChange={(e) => handleTasksInputChange(e, index)}
        value={step.data.dc_guild_id}
        name="dc_guild_id"
        label="Guild ID"
        placeholder="Discord ID"
      />
      <TextInput
        onChange={(e) => handleTasksInputChange(e, index)}
        value={step.data.dc_invite_link}
        name="dc_invite_link"
        label="Discord invite link"
        placeholder="Invite Link"
      />
    </div>
  );
};

export default DiscordStep;
