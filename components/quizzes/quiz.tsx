import React from "next";
import StartScreen from "./startScreen";
import styles from "../../styles/components/quests/quizzes.module.css";
import { FunctionComponent, ReactNode, useEffect, useState } from "react";
import Step from "./step";
import EndScreen from "./endScreen";
import Loading from "../UI/loading";
import { useAccount } from "@starknet-react/core";
import { hexToDecimal } from "../../utils/feltService";

type QuizProps = {
  setShowQuiz: (menu: ReactNode) => void;
  quizId: string;
  issuer: Issuer;
  verifyEndpoint: string;
};

const Quiz: FunctionComponent<QuizProps> = ({
  setShowQuiz,
  quizId,
  issuer,
  verifyEndpoint,
}) => {
  const { address } = useAccount();
  const [step, setStep] = useState<number>(-1);
  const [quiz, setQuiz] = useState<Quiz>({
    name: "",
    description: "",
    questions: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [answers, setAnswers] = useState<number[][]>([]);
  const [passed, setPassed] = useState<"loading" | boolean>("loading");
  const [restart, setRestart] = useState<boolean>(false);

  useEffect(() => {
    if (restart) return setRestart(false);
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_LINK}/get_quiz?id=${quizId}&addr=0`)
      .then((res) => res.json())
      .then((data) => {
        const quizObj: Quiz = {
          name: data.name,
          description: data.desc,
          questions: data.questions,
        };
        setAnswers([]);
        setQuiz(quizObj);
        setStep(-1);
        setLoading(false);
      });
  }, [quizId, restart]);

  useEffect(() => {
    if (step === -2) setShowQuiz(null);
  }, [step]);

  useEffect(() => {
    if (step === -1) return;
    if (answers.length !== quiz.questions.length) return;
    const load = () => {
      setPassed("loading");
      fetch(verifyEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_answers_list: answers.map((answer) =>
            answer.map((value) => value.toString())
          ),
          quiz_name: quizId,
          addr: hexToDecimal(address),
        }),
      })
        .then((res) => setPassed(res.status === 200))
        .catch(load);
    };
    load();
  }, [answers, step, quiz]);

  const moveBack = () => {
    setStep(step - 1);
    if (step === -1) return;
    setAnswers(answers.slice(0, answers.length - 1));
  };

  return (
    <div className={styles.mainContainer}>
      {loading ? (
        <Loading />
      ) : step === -1 ? (
        <StartScreen
          setStep={setStep}
          name={quiz.name}
          description={quiz.description}
          step={step}
        />
      ) : step === quiz?.questions.length ? (
        <EndScreen setStep={setStep} passed={passed} setRestart={setRestart} />
      ) : (
        <Step
          setStep={setStep}
          step={step}
          questions={quiz?.questions}
          issuer={issuer}
          setAnswers={setAnswers}
          moveBack={moveBack}
          answers={answers}
        />
      )}
    </div>
  );
};

export default Quiz;
