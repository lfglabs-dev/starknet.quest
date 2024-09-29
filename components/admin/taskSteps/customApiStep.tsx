import React, { FunctionComponent } from "react";
import TextInput from "../textInput";

type CustomApiStepProps = {
    handleTasksInputChange: (
      e: React.ChangeEvent<HTMLInputElement>,
      index: number
    ) => void;
    step: StepMap;
    index: number;
};

const CustomApiStep: FunctionComponent<CustomApiStepProps> = ({
    handleTasksInputChange,
    step,
    index,
}) => {
    return(
    <div className="flex flex-col gap-4 pt-2">
        <TextInput
            onChange={(e) => handleTasksInputChange(e, index)}
            value={step.data.api_name}
            name="api_name"
            label="Name"
            placeholder="Name"
        />
        <TextInput
            onChange={(e) => handleTasksInputChange(e, index)}
            value={step.data.api_desc}
            name="api_desc"
            label="Description"
            placeholder="Description"
            multiline={4}
        />
        <TextInput
            onChange={(e) => handleTasksInputChange(e, index)}
            value={step.data.api_href}
            name="api_href"
            label="URL"
            placeholder="URL"
        />
        <TextInput
            onChange={(e) => handleTasksInputChange(e, index)}
            value={step.data.api_url}
            name="api_url"
            label="Custom URL"
            placeholder="Custom URL"
        />
        <TextInput
            onChange={(e) => handleTasksInputChange(e, index)}
            value={step.data.api_cta}
            name="api_cta"
            label="CTA"
            placeholder="CTA"
        />
        <TextInput
            onChange={(e) => handleTasksInputChange(e, index)}
            value={step.data.api_regex}
            name="api_regex"
            label="Regex"
            placeholder="e.g /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/"
        />

    </div>
    );
}

export default CustomApiStep;