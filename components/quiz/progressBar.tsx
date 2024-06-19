import React, { FunctionComponent } from "react";
import styles from "@styles/components/quests/progressBar.module.css";
import CheckMarkIcon from "@components/UI/iconsComponents/icons/checkMarkIcon";
import Typography from "@components/UI/typography/typography";
import { TEXT_TYPE } from "@constants/typography";

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
                <Typography type={TEXT_TYPE.BODY_DEFAULT}>{index + 1}</Typography>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProgressBar;
