import React from "react";
import styles from "../../../styles/components/steps.module.css";
import StepElement from "./stepElement";

const Steps = ({
  subTitleBefore = false,
  steps,
}: {
  subTitleBefore?: boolean;
  steps: Step[];
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.cards}>
        {steps.map((step, index) => (
          <StepElement
            index={index}
            step={step}
            subTitleBefore={subTitleBefore}
            key={"step_" + index}
            steps={steps}
          />
        ))}
      </div>
    </div>
  );
};

export default Steps;
