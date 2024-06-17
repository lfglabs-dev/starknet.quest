import React, { FunctionComponent } from "react";
import ScreenLayout from "./screenLayout";
import styles from "@styles/components/quests/quiz.module.css";
import Button from "@components/UI/button";
import QuizLoading from "@components/quiz/quizLoading";
import wrongAnimation from "@public/visuals/wrongLottie.json";
import successAnimation from "@public/visuals/verifiedLottie.json";
import Lottie from "lottie-react";
import Typography from "@components/UI/typography/typography";
import { TEXT_TYPE } from "@constants/typography";

type EndScreenProps = {
  setStep: (s: number) => void;
  setRestart: (r: boolean) => void;
  passed: "loading" | boolean;
};

const EndScreen: FunctionComponent<EndScreenProps> = ({
  setStep,
  setRestart,
  passed,
}) => {
  return passed === "loading" ? (
    <QuizLoading />
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
          <Typography type={TEXT_TYPE.BODY_DEFAULT}>
            You passed the quiz. Congratulations on your efforts and progress!
            Keep up the good work and continue to explore new challenges.
          </Typography>
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
          <Typography type={TEXT_TYPE.BODY_DEFAULT}>
            You didn&apos;t pass the quiz. You can try again or go back to the
            quest.
          </Typography>
          <div className={styles.wrongLottie}>
            <Lottie animationData={wrongAnimation} loop={false} />
          </div>
        </ScreenLayout>
      )}
    </div>
  );
};

export default EndScreen;
