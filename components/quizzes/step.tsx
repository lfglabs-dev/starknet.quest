import React, { Dispatch, FunctionComponent, SetStateAction } from "react";
import QuizControls from "./quizControls";
import styles from "../../styles/components/quests/quizzes.module.css";
import ProgressBar from "./progressBar";

type StepProps = {
  setStep: Dispatch<SetStateAction<number>>;
  step: number;
  questions: Array<QuizQuestion>;
};

const Step: FunctionComponent<StepProps> = ({ setStep, step, questions }) => {
  return (
    <>
      <ProgressBar currentStep={step} totalSteps={questions.length} />
      <div className={styles.content}>
        <button onClick={() => setStep((step) => step + 1)}>Ok</button>
      </div>
      <QuizControls setStep={setStep} />
    </>
  );
};

export default Step;
