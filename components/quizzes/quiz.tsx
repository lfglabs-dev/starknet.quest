import React from "next";
import StartScreen from "./startScreen";
import styles from "../../styles/components/quests/quizzes.module.css";
import { FunctionComponent, ReactNode, useEffect, useState } from "react";
import Step from "./step";
import EndScreen from "./endScreen";
import Loading from "../UI/loading";

type QuizProps = {
  setShowQuiz: (menu: ReactNode) => void;
  quizId: string;
  issuer: Issuer;
};

const Quiz: FunctionComponent<QuizProps> = ({
  setShowQuiz,
  quizId,
  issuer,
}) => {
  const [step, setStep] = useState<number>(-1);
  const [quiz, setQuiz] = useState<Quiz>({
    name: "",
    description: "",
    questions: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [answers, setAnswers] = useState<string[][]>([]);

  useEffect(() => {
    setLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_API_LINK}/get_quiz?id=${quizId}&addr=0`
    ).then(async (res) => {
      const data = await res.json();
      const quizObj: Quiz = {
        name: data.name,
        description: data.description,
        questions: data.questions,
      };
      setQuiz(quizObj);
      setLoading(false);
    });
  }, [quizId]);

  useEffect(() => {
    if (step === -2) setShowQuiz(null);
  }, [step]);

  return (
    <div className={styles.mainContainer}>
      {loading ? (
        <Loading />
      ) : step === -1 ? (
        <StartScreen
          setStep={setStep}
          name={quiz.name}
          description={quiz.description}
        />
      ) : step === quiz?.questions.length ? (
        <EndScreen setStep={setStep} />
      ) : (
        <Step
          setStep={setStep}
          step={step}
          questions={quiz?.questions}
          issuer={issuer}
          setAnswers={setAnswers}
        />
      )}
    </div>
  );
};

export default Quiz;
