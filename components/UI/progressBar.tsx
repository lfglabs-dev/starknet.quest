import React, { FunctionComponent } from "react";
import styles from "@styles/components/progressBar.module.css";
import CheckMarkIcon from "@components/UI/iconsComponents/icons/checkMarkIcon";

type ProgressBarProps = {
  doneSteps: number;
  totalSteps: number;
};

const ProgressBar: FunctionComponent<ProgressBarProps> = ({
  doneSteps,
  totalSteps,
}) => {
  return (
    <div className={styles.progressContainer}>
      <div className={styles.baseLine} />
      <div
        className={styles.coloredLine}
        style={{
          width: `calc(${(doneSteps / (totalSteps - 1)) * 100}% - 16px)`,
        }}
      />
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={styles.milestone}
          style={{
            left: `calc(${(index / (totalSteps - 1)) * 100}%)`,
          }}
        >
          {index < doneSteps ? (
            <div className={styles.checkedMilestone}>
              <CheckMarkIcon width="20" />
            </div>
          ) : (
            <div className={styles.emptyMilestone}>{index + 1}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProgressBar;
