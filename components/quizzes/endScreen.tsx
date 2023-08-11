import React, { Dispatch, FunctionComponent, SetStateAction } from "react";
import ScreenLayout from "./screenLayout";
import styles from "../../styles/components/quests/quizzes.module.css";
import Button from "../UI/button";

type EndScreenProps = {
  setStep: Dispatch<SetStateAction<number>>;
};

const EndScreen: FunctionComponent<EndScreenProps> = ({ setStep }) => {
  return (
    <>
      <div className={styles.contentContainer}>
        <ScreenLayout
          title="Well done !"
          actionBar={
            <Button onClick={() => setStep(-2)}>Go back to the quest</Button>
          }
          highlightTitle={false}
        >
          <p>
            You passed the quiz. Congratulations on your efforts and progress!
            Keep up the good work and continue to explore new challenges.
          </p>
          <img src="/icons/success.svg" alt="success" width="255" />
        </ScreenLayout>
      </div>
    </>
  );
};

export default EndScreen;
