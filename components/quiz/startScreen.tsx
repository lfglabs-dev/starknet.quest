import React, { FunctionComponent } from "react";
import QuizControls from "./quizControls";
import ScreenLayout from "./screenLayout";
import styles from "@styles/components/quests/quiz.module.css";
import Button from "@components/UI/button";
import Typography from "@components/UI/typography/typography";
import { TEXT_TYPE } from "@constants/typography";

type StartScreenProps = {
  setStep: (s: number) => void;
  name: string;
  description: string;
  step: number;
};

const StartScreen: FunctionComponent<StartScreenProps> = ({
  setStep,
  name,
  description,
  step,
}) => {
  return (
    <>
      <div className={styles.contentContainer}>
        <ScreenLayout
          title={name}
          actionBar={
            <Button onClick={() => setStep(step + 1)}>
              <span className="desktop-text">Start Quiz</span>
              <span className="mobile-text">Quiz</span>
            </Button>
          }
        >
          <Typography type={TEXT_TYPE.BODY_DEFAULT}>{description}</Typography>
        </ScreenLayout>
      </div>
      <QuizControls step={step} setStep={setStep} />
    </>
  );
};

export default StartScreen;
