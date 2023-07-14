import React from "react";
import styles from "../../styles/components/steps.module.css";
import shapeStyles from "../../styles/components/shapes.module.css";
import VerticalBar from "../shapes/verticalBar";
import OnScrollIntoView from "../animations/onScrollIntoView";

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
          <div key={"step_icon_" + index}>
            <div className={styles.barsContainer}>
              <img className={styles.icon} src={step.icon} />
              {index !== steps.length - 1 && (
                <div
                  className={[
                    styles.verticalBarContainer,
                    index % 2 && shapeStyles.even,
                  ].join(" ")}
                >
                  <VerticalBar />
                </div>
              )}
            </div>
            <OnScrollIntoView animation="slideInFromTop">
              <div
                key={"step_card_" + index}
                className={[styles.card, index % 2 && styles.even].join(" ")}
              >
                <div
                  className={(subTitleBefore && styles.subTitleBefore) || ""}
                >
                  {[
                    <h1 key={`step_${index}_title`} className={styles.title}>
                      {step.title}
                    </h1>,
                    <h2
                      key={`step_${index}_subtitle`}
                      className={styles.subtitle}
                    >
                      {step.subtitle}
                    </h2>,
                  ].sort(() => (subTitleBefore ? -1 : 1))}
                  <p className={styles.description}>{step.description}</p>
                </div>
                <div className={styles.overlay}>
                  {step.overlay ? step.overlay : null}
                </div>
                <div>
                  <img className={styles.banner} src={step.banner} />
                </div>
              </div>
            </OnScrollIntoView>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Steps;
