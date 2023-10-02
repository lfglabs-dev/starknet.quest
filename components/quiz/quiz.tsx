import React from "next";
import StartScreen from "./startScreen";
import styles from "../../styles/components/quests/quiz.module.css";
import { FunctionComponent, ReactNode, useEffect, useState } from "react";
import Step from "./step";
import EndScreen from "./endScreen";
import QuizLoading from "../../components/quiz/quizLoading";
import { useAccount } from "@starknet-react/core";
import { hexToDecimal } from "../../utils/feltService";

type QuizProps = {
  setShowQuiz: (menu: ReactNode) => void;
  setIsVerified: (isVerified: boolean) => void;
  quizId: string;
  issuer: Issuer;
  verifyEndpoint: string;
};

const Quiz: FunctionComponent<QuizProps> = ({
  setShowQuiz,
  setIsVerified,
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
    const documentBody = document.querySelector("body");
    const footer = document.querySelector("footer");
    const navbar = document.getElementById("nav");
    // Mount
    if (documentBody) documentBody.style.overflow = "hidden";
    if (footer) footer.style.display = "none";
    if (navbar) navbar.style.display = "none";
    // Unmount
    return () => {
      if (documentBody) documentBody.style.removeProperty("overflow");
      if (footer) footer.style.removeProperty("display");
      if (navbar) navbar.style.removeProperty("display");
    };
  }, []);

  useEffect(() => {
    setIsVerified(passed === true);
  }, [passed]);

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
      fetch(`${process.env.NEXT_PUBLIC_API_LINK}/${verifyEndpoint}`, {
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

  return (
    <div className={styles.mainContainer}>
      {loading ? (
        <QuizLoading />
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
          answers={answers}
        />
      )}
    </div>
  );
};

export default Quiz;
