import React, { FunctionComponent, useCallback } from "react";
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
  const container =
    totalSteps === 1
      ? `${styles.container} ${styles.single_step}`
      : styles.container;
  const calculateRightDistance = useCallback(
    (doneSteps: number, totalSteps: number) => {
      return doneSteps >= totalSteps
        ? 8
        : `${((totalSteps - doneSteps - 1) / (totalSteps - 1)) * 100}%`;
    },
    []
  );
  return (
    <div className={container}>
      {Array.from(Array(totalSteps).keys()).map((_, index) => {
        return index + 1 <= doneSteps ? (
          <div
            key={"progressbar-" + index}
            className={`${styles.checked_milestone} relative`}
          >
            <CheckMarkIcon width="20" />
          </div>
        ) : (
          <div
            key={"progressbar-empty-" + index}
            className={styles.empty_milestone}
          >
            {index + 1}
          </div>
        );
      })}
      <div className={styles.base_line} />
      {totalSteps > 0 ? (
        <div
          className={styles.colored_line}
          style={{
            right: calculateRightDistance(doneSteps, totalSteps),
          }}
        />
      ) : null}
    </div>
  );
};

export default ProgressBar;
