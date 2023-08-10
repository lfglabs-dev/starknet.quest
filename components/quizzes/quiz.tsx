import React from "next";
import HomeScreen from "./homeScreen";
import styles from "../../styles/components/quests/quizzes.module.css";
import { FunctionComponent, ReactNode, useEffect, useState } from "react";
import Step from "./step";
import EndScreen from "./endScreen";

type QuizProps = {
  setMenu: (menu: ReactNode) => void;
  name: string;
};

const Quiz: FunctionComponent<QuizProps> = ({ setMenu, name }) => {
  const [step, setStep] = useState<number>(-1);

  // TODO: Load data dynamically using quiz name
  const steps: Array<QuizStep> = [{}, {}, {}, {}];

  useEffect(() => {
    if (step === -2) setMenu(null);
  }, [step]);

  return (
    <div className={styles.mainContainer}>
      {step === -1 ? (
        <HomeScreen setStep={setStep} />
      ) : step === steps.length ? (
        <EndScreen setStep={setStep} />
      ) : (
        <Step setStep={setStep} step={step} steps={steps} />
      )}
    </div>
  );
};

export default Quiz;
