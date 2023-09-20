import React, { FunctionComponent } from "react";
import styles from "../../styles/components/quests/quiz.module.css";
import BackButton from "../UI/backButton";

type QuizControlsProps = {
  setStep: (s: number) => void;
  step: number;
};

const QuizControls: FunctionComponent<QuizControlsProps> = ({
  setStep,
  step,
}) => {
  return (
    <div className={styles.controls}>
      <BackButton onClick={() => setStep(step - 1)} />
      <button onClick={() => setStep(-2)}>Cancel</button>
    </div>
  );
};

export default QuizControls;
