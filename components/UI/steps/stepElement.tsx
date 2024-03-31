import VerticalBar from "@components/shapes/verticalBar";
import OnScrollIntoView from "@components/animations/onScrollIntoView";
import styles from "@styles/components/steps.module.css";
import React, { FunctionComponent } from "react";
import { CDNImg } from "@components/cdn/image";

type StepElementProps = {
  index: number;
  step: Step;
  subTitleBefore?: boolean;
  steps: Step[];
};

const StepElement: FunctionComponent<StepElementProps> = ({
  index,
  step,
  subTitleBefore = false,
  steps,
}) => {
  return (
    <div className={styles.cardContainer}>
      <div className={styles.barsContainer}>
        <CDNImg className={styles.icon} src={step.icon} loading="lazy" />
        {index !== steps.length - 1 && (
          <div className={styles.verticalBarContainer}>
            <VerticalBar />
          </div>
        )}
      </div>
      <OnScrollIntoView animation="slideInFromTop">
        <div key={"step_card_" + index} className={styles.card}>
          <div>
            <div className={(subTitleBefore && styles.subTitleBefore) || ""}>
              <h1 key={`step_${index}_title`} className={styles.title}>
                {step.title}
              </h1>
              <h2 key={`step_${index}_subtitle`} className={styles.subtitle}>
                {step.subtitle}
              </h2>
            </div>
            <p className={styles.description}>{step.description}</p>
          </div>
          {step.overlay ? (
            <div className={styles.overlay}>{step.overlay}</div>
          ) : null}
          <div>
            <CDNImg className={styles.banner} src={step.banner} loading="lazy"/>
          </div>
        </div>
      </OnScrollIntoView>
    </div>
  );
};

export default StepElement;
