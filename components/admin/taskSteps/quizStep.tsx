import React, { FunctionComponent, useCallback } from "react";
import TextInput from "../textInput";
import { QuizQuestionDefaultInput } from "@constants/admin";
import styles from "@styles/admin.module.css";

type QuizStepProps = {
  handleTasksInputChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => void;
  step: StepMap;
  index: number;
  steps: StepMap[];
  setSteps: React.Dispatch<React.SetStateAction<StepMap[]>>;
};

const QuizStep: FunctionComponent<QuizStepProps> = ({
  handleTasksInputChange,
  step,
  index,
  steps,
  setSteps,
}) => {
  const handleQuestionChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, questionIndex: number) => {
      const updatedSteps = steps.map((step, i) => {
        if (i === index && step.type === "Quiz") {
          const updatedQuestions = step.data.questions.map(
            (questionObj: typeof QuizQuestionDefaultInput, qIndex: number) => {
              if (qIndex === questionIndex) {
                return {
                  ...questionObj,
                  question: e.target.value,
                };
              }
              return questionObj;
            }
          );

          return {
            ...step,
            data: {
              ...step.data,
              questions: updatedQuestions,
            },
          };
        }
        return step;
      });

      setSteps(updatedSteps);
    },
    [steps]
  );

  const handleOptionChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement>,
      optionIndex: number,
      questionIndex: number
    ) => {
      const updatedSteps = steps.map((step, i) => {
        if (i === index && step.type === "Quiz") {
          const updatedQuestions = step.data.questions.map(
            (questionObj: typeof QuizQuestionDefaultInput, qIndex: number) => {
              if (qIndex === questionIndex) {
                const updatedOptions = questionObj.options.map(
                  (option, oIndex) => {
                    if (oIndex === optionIndex) {
                      return e.target.value;
                    }
                    return option;
                  }
                );
                return {
                  ...questionObj,
                  options: updatedOptions,
                };
              }
              return questionObj;
            }
          );

          return {
            ...step,
            data: {
              ...step.data,
              questions: updatedQuestions,
            },
          };
        }
        return step;
      });

      setSteps(updatedSteps);
    },
    [steps]
  );

  const handleCorrectAnswer = useCallback(
    (optionIndex: number, questionIndex: number) => {
      const updatedSteps = steps.map((step, i) => {
        if (i === index && step.type === "Quiz") {
          const updatedQuestions = step.data.questions.map(
            (questionObj: typeof QuizQuestionDefaultInput, qIndex: number) => {
              if (qIndex === questionIndex) {
                return {
                  ...questionObj,
                  correct_answers: [optionIndex],
                };
              }
              return questionObj;
            }
          );

          return {
            ...step,
            data: {
              ...step.data,
              questions: updatedQuestions,
            },
          };
        }
        return step;
      });
      setSteps(updatedSteps);
    },
    [steps]
  );

  return (
    <div className="flex flex-col gap-8 pt-2">
      <TextInput
        onChange={(e) => handleTasksInputChange(e, index)}
        value={step.data.quiz_name}
        name="quiz_name"
        label="Quiz Name"
        placeholder="Quiz Name"
      />
      <TextInput
        onChange={(e) => handleTasksInputChange(e, index)}
        value={step.data.quiz_desc}
        name="quiz_desc"
        label="Quiz Description"
        placeholder="Quiz Description"
      />
      <TextInput
        onChange={(e) => handleTasksInputChange(e, index)}
        value={step.data.quiz_intro}
        name="quiz_intro"
        label="Quiz Introduction"
        placeholder="Help URL"
      />
      <TextInput
        onChange={(e) => handleTasksInputChange(e, index)}
        value={step.data.quiz_cta}
        name="quiz_cta"
        label="Call To Action"
        placeholder="Call To Action"
      />
      <TextInput
        onChange={(e) => handleTasksInputChange(e, index)}
        value={step.data.quiz_help_link}
        name="quiz_help_link"
        label="Help URL"
        placeholder="Help URL"
      />

      <div className="flex flex-col gap-8">
        {step.data.questions?.map(
          (
            eachQuestion: typeof QuizQuestionDefaultInput,
            questionIndex: number
          ) => (
            <>
              <TextInput
                onChange={(e) => handleQuestionChange(e, questionIndex)}
                value={eachQuestion.question}
                name="question"
                label={`Question ${questionIndex + 1}`}
                placeholder={`Question ${questionIndex + 1}`}
              />
              {eachQuestion.options.map((option, optionIndex) => (
                <div
                  key={"option-" + optionIndex}
                  className="flex flex-row gap-4 justify-between w-full items-center"
                >
                  <div className="flex flex-col w-full gap-2">
                    <label htmlFor={"option"}>Option {optionIndex + 1}</label>
                    <div className="flex flex-row gap-2 items-center">
                      <div className="w-3/4">
                        <input
                          name={"option"}
                          value={option}
                          onChange={(e) =>
                            handleOptionChange(e, optionIndex, questionIndex)
                          }
                          placeholder={`Option ${optionIndex + 1}`}
                          className={`${styles.input} w-full`}
                          type={"text"}
                        />
                      </div>
                      <div className="flex flex-row gap-2 justify-end">
                        <input
                          onChange={() =>
                            handleCorrectAnswer(optionIndex, questionIndex)
                          }
                          className="w-6 h-6 rounded-full"
                          type="radio"
                          name={`correct_option-${questionIndex}+${optionIndex}}`}
                          value={optionIndex}
                          checked={
                            optionIndex ===
                            step.data.questions[questionIndex]
                              .correct_answers[0]
                          }
                        />
                        <div>Correct Answer</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )
        )}
        <div
          onClick={() => {
            const updatedSteps = steps.map((step, i) => {
              if (i === index && step.type === "Quiz") {
                return {
                  ...step,
                  data: {
                    ...step.data,
                    questions: [
                      ...step.data.questions,
                      QuizQuestionDefaultInput,
                    ],
                  },
                };
              }
              return step;
            });

            setSteps(updatedSteps);
          }}
          className="flex w-full justify-center modified-cursor-pointer"
        >
          + Add question
        </div>
      </div>
    </div>
  );
};

export default QuizStep;
