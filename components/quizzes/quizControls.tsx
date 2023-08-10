import React, { Dispatch, FunctionComponent, SetStateAction } from "react";
import styles from "../../styles/components/quests/quizzes.module.css";

type QuizControlsProps = {
  setStep: Dispatch<SetStateAction<number>>;
};

const QuizControls: FunctionComponent<QuizControlsProps> = ({ setStep }) => {
  return (
    <div className={styles.controls}>
      <button onClick={() => setStep((step) => step - 1)}>
        <svg
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
        Back
      </button>
      <button onClick={() => setStep(-2)}>Cancel</button>
    </div>
  );
};

export default QuizControls;
