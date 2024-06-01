import VerticalBar from "@components/shapes/verticalBar";
import OnScrollIntoView from "@components/animations/onScrollIntoView";
import styles from "@styles/components/steps.module.css";
import React, { FunctionComponent } from "react";
import { CDNImg } from "@components/cdn/image";
import Typography from "../typography/typography";
import type { TEXT_TYPE } from "@constants/typography";

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
              <Typography key={`step_${index}_title`} type={TEXT_TYPE.H1} color="secondary" className={styles.title} >
                {step.title}
              </Typography>
              <Typography type={TEXT_TYPE.H2} color="primary" key={`step_${index}_subtitle`} className={styles.subtitle}>
                {step.subtitle}
              </Typography>
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
