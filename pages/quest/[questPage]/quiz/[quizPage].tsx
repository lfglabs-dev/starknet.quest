import React, { NextPage } from "next";
import { useRouter } from "next/router";
import HomeScreen from "../../../../components/quests/quizzes/homeScreen";
import styles from "../../../../styles/components/quests/quizzes.module.css";
import { useEffect } from "react";
import Step from "../../../../components/quests/quizzes/step";
import EndScreen from "../../../../components/quests/quizzes/endScreen";

const Quiz: NextPage = () => {
  const router = useRouter();
  const { questPage: questId, quizPage: quizId, step } = router.query;

  // TODO: Load data dynamically
  const steps: Array<QuizStep> = [{}, {}, {}, {}];

  useEffect(() => {
    if (questId === undefined || quizId === undefined) return;
    if (step === undefined)
      router.push(`/quest/${questId}/quiz/${quizId}?step=-1`);
  }, [questId, quizId, step]);

  const quit = () => router.push(`/quest/${questId}`);

  const move = (direction = 1) => {
    const nextStep = parseInt(step as string) + direction;
    if (nextStep < -1) quit();
    else {
      router.query.step = nextStep.toString();
      router.replace(router);
    }
  };

  return (
    <div className={styles.mainContainer}>
      {step === "-1" ? (
        <HomeScreen move={move} quit={quit} />
      ) : step === steps.length.toString() ? (
        <EndScreen quit={quit} />
      ) : (
        <Step move={move} quit={quit} step={step as string} steps={steps} />
      )}
    </div>
  );
};

export default Quiz;
