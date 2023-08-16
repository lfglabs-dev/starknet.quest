import React, { Dispatch, FunctionComponent, SetStateAction } from "react";
import ScreenLayout from "./screenLayout";
import styles from "../../styles/components/quests/quizzes.module.css";
import Button from "../UI/button";
import Loading from "../UI/loading";
import wrongAnimation from "../../public/visuals/wrongLottie.json";
import successAnimation from "../../public/visuals/verifiedLottie.json";
import Lottie from "lottie-react";

type EndScreenProps = {
  setStep: Dispatch<SetStateAction<number>>;
  setRestart: Dispatch<SetStateAction<boolean>>;
  passed: "loading" | boolean;
};

const EndScreen: FunctionComponent<EndScreenProps> = ({
  setStep,
  setRestart,
  passed,
}) => {
  return passed === "loading" ? (
    <Loading />
  ) : (
    <div className={styles.contentContainer}>
      {passed ? (
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
          <div className={styles.successLottie}>
            <Lottie animationData={successAnimation} loop={false} />
          </div>
        </ScreenLayout>
      ) : (
        <ScreenLayout
          title="Too bad ! "
          actionBar={
            <>
              <div className={styles.soft}>
                <Button onClick={() => setStep(-2)}>
                  Go back to the quest
                </Button>
              </div>
              <div>
                <Button onClick={() => setRestart(true)}>
                  Restart the quiz
                </Button>
              </div>
            </>
          }
          highlightTitle={false}
        >
          <p>
            You didn&apos;t pass the quiz. You can try again or go back to the
            quest.
          </p>
          <div className={styles.wrongLottie}>
            <Lottie animationData={wrongAnimation} loop={false} />
          </div>
        </ScreenLayout>
      )}
    </div>
  );
};

export default EndScreen;
