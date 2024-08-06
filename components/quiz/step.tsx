import React, { FunctionComponent, useEffect, useState } from "react";
import QuizControls from "./quizControls";
import QuestionRouter from "./questionRouter";
import styles from "@styles/components/quests/quiz.module.css";
import CheckMarkIcon from "@components/UI/iconsComponents/icons/checkMarkIcon";
import NftIssuer from "@components/quests/nftIssuer";
import { CDNImg } from "@components/cdn/image";
import Typography from "@components/UI/typography/typography";
import { TEXT_TYPE } from "@constants/typography";
import ProgressBar from "@components/UI/progressBar";

type StepProps = {
  setStep: (s: number) => void;
  step: number;
  questions: Array<QuizQuestion>;
  issuer: Issuer;
  setAnswers: (a: number[][]) => void;
  answers: number[][];
};

const Step: FunctionComponent<StepProps> = ({
  setStep,
  step,
  questions,
  issuer,
  setAnswers,
  answers,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [selected, setSelected] = useState<boolean>(false);
  const question = questions[step];

  useEffect(() => {
    setSelected(false);
  }, [step]);

  const handleNext = () => {
    if (answers[step]) {
      setAnswers(
        answers.map((item, index) => {
          if (index === step) return selectedOptions;
          else return item;
        })
      );
      setStep(step + 1);
      setSelectedOptions(answers[step]);
    } else {
      setAnswers([...answers, selectedOptions]);
      setStep(step + 1);
      setSelectedOptions([]);
    }
  };

  useEffect(() => {
    if (!question) return;
    if (question.kind === "ordering") return;
    if (selectedOptions.length > 1)
      setSelectedOptions(selectedOptions.slice(1));
  }, [question, selectedOptions]);

  useEffect(() => {
    if (answers[step]) {
      setSelectedOptions(answers[step]);
      setSelected(true);
    } else {
      setSelectedOptions([]);
      setSelected(false);
    }
  }, [step, answers]);

  const layoutElements =
    question && question.layout === "illustrated_left" ? (
      <div className={styles.leftIllustration}>
        <CDNImg src={question.image_for_layout as string} alt="illustration" />
      </div>
    ) : null;

  return (
    <>
      <ProgressBar doneSteps={step} totalSteps={questions.length} />
      {question ? (
        <section className={styles.contentContainer}>
          {layoutElements}
          <div className={styles.content}>
            <div className={styles.issuer}>
              <NftIssuer issuer={issuer} />
            </div>
            <Typography type={TEXT_TYPE.H1} className={styles.questionTitle}>
              {question.question}
            </Typography>
            <QuestionRouter
              setSelected={setSelected}
              setSelectedOptions={setSelectedOptions}
              selectedOptions={selectedOptions}
              question={question}
            />
            {layoutElements}
            <div className={styles.okButtonContainer}>
              <button
                onClick={() => selected && handleNext()}
                className={selected ? "" : styles.disabled}
              >
                OK <CheckMarkIcon width="24" />
              </button>
            </div>
          </div>
        </section>
      ) : null}
      <QuizControls step={step} setStep={setStep} />
    </>
  );
};

export default Step;
