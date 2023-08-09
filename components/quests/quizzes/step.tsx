import { FunctionComponent } from "react";
import QuizControls from "./quizControls";
import styles from "../../../styles/components/quests/quizzes.module.css";
import ProgressBar from "./progressBar";

type StepProps = {
  move: (direction?: number) => void;
  quit: () => void;
  step: string;
  steps: Array<QuizStep>;
};

const Step: FunctionComponent<StepProps> = ({ move, quit, step, steps }) => {
  return (
    <>
      <ProgressBar currentStep={parseInt(step)} totalSteps={steps.length} />
      <div className={styles.content}>
        <button onClick={() => move()}>Ok</button>
      </div>
      <QuizControls move={move} quit={quit} />
    </>
  );
};

export default Step;
