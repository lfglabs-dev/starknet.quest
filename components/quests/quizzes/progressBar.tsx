import React, { FunctionComponent } from "react";
import styles from "../../../styles/components/quests/progressBar.module.css";
import CheckMarkIcon from "../../UI/iconsComponents/icons/checkMarkIcon";

type ProgressBarProps = {
  currentStep: number;
  totalSteps: number;
};

const ProgressBar: FunctionComponent<ProgressBarProps> = ({
  currentStep,
  totalSteps,
}) => {
  return (
    <div className={styles.progressBarContainer}>
      {[...Array(totalSteps)].map((_, index) => {
        return (
          <div
            data-completed={index < currentStep}
            data-current={index === currentStep}
            className={styles.progressBarStep}
            key={index}
          >
            <div className={styles.stepIcon}>
              {index < currentStep ? (
                <CheckMarkIcon width="20" />
              ) : (
                <p>{index + 1}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProgressBar;
