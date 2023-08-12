import React, {
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import QuizControls from "./quizControls";
import ProgressBar from "./progressBar";
import QuestionRouter from "./questionRouter";
import styles from "../../styles/components/quests/quizzes.module.css";
import CheckMarkIcon from "../UI/iconsComponents/icons/checkMarkIcon";
import NftIssuer from "../quests/nftIssuer";

type StepProps = {
  setStep: Dispatch<SetStateAction<number>>;
  step: number;
  questions: Array<QuizQuestion>;
  issuer: Issuer;
};

const Step: FunctionComponent<StepProps> = ({
  setStep,
  step,
  questions,
  issuer,
}) => {
  const [selected, setSelected] = useState<boolean>(false);
  const question = questions[step];

  useEffect(() => {
    setSelected(false);
  }, [step]);

  return (
    <>
      <ProgressBar currentStep={step} totalSteps={questions.length} />
      {question ? (
        <section className={styles.contentContainer}>
          <div className={styles.content}>
            <div className={styles.issuer}>
              <NftIssuer issuer={issuer} />
            </div>
            <h1 className={styles.questionTitle}>{question.question}</h1>
            <QuestionRouter setSelected={setSelected} question={question} />
            <div className={styles.okButtonContainer}>
              <button
                onClick={() => selected && setStep((step) => step + 1)}
                className={selected ? "" : styles.disabled}
              >
                OK <CheckMarkIcon width="24" />
              </button>
            </div>
          </div>
        </section>
      ) : null}
      <QuizControls setStep={setStep} />
    </>
  );
};

export default Step;
