import React, { Dispatch, FunctionComponent, SetStateAction } from "react";
import QuizControls from "./quizControls";
import ScreenLayout from "./screenLayout";
import styles from "../../styles/components/quests/quizzes.module.css";
import Button from "../UI/button";

type StartScreenProps = {
  setStep: Dispatch<SetStateAction<number>>;
  name: string;
  description: string;
};

const StartScreen: FunctionComponent<StartScreenProps> = ({
  setStep,
  name,
  description,
}) => {
  console.log(description);
  return (
    <>
      <div className={styles.contentContainer}>
        <ScreenLayout
          title={name}
          actionBar={
            <Button onClick={() => setStep((step) => step + 1)}>
              Start Quiz
            </Button>
          }
        >
          <p>{description}</p>
        </ScreenLayout>
      </div>
      <QuizControls setStep={setStep} />
    </>
  );
};

export default StartScreen;
