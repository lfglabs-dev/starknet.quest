import React, { FunctionComponent, useCallback } from "react";
import TextInput from "../textInput";
import { QuizQuestionDefaultInput } from "@constants/admin";
import styles from "@styles/admin.module.css";
import Typography from "@components/UI/typography/typography";
import { TEXT_TYPE } from "@constants/typography";
import InputCard from "../inputCard";
import Dropdown from "@components/UI/dropdown";
import { SelectChangeEvent } from "@mui/material";

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

  const handleAddQuestion = useCallback(() => {
    const updatedSteps = steps.map((step, i) => {
      if (i === index && step.type === "Quiz") {
        return {
          ...step,
          data: {
            ...step.data,
            questions: [...step.data.questions, QuizQuestionDefaultInput],
          },
        };
      }
      return step;
    });

    setSteps(updatedSteps);
  }, [steps]);

  return (
    <div className="flex flex-col gap-8 pt-2">
      <div className="flex flex-col gap-1">
        <TextInput
          onChange={(e) => handleTasksInputChange(e, index)}
          value={step.data.quiz_name}
          name="quiz_name"
          label="Title"
          placeholder="Title for the quiz"
        />
        <Typography type={TEXT_TYPE.BODY_MICRO} color="textGray">
          Enter the title for this task.
        </Typography>
      </div>

      <div className="flex flex-col gap-1">
        <TextInput
          onChange={(e) => handleTasksInputChange(e, index)}
          value={step.data.quiz_desc}
          name="quiz_desc"
          label="Description"
          placeholder="Description for the quiz"
        />
        <Typography type={TEXT_TYPE.BODY_MICRO} color="textGray">
          Provide a brief description this current task.
        </Typography>
      </div>

      <div className="flex flex-col gap-1">
        <TextInput
          onChange={(e) => handleTasksInputChange(e, index)}
          value={step.data.quiz_intro}
          name="quiz_intro"
          label="Introduction"
          placeholder="An introduction to the quiz"
        />
        <Typography type={TEXT_TYPE.BODY_MICRO} color="textGray">
          Provide an introduction to the quiz.
        </Typography>
      </div>

      <div className="flex flex-col gap-1">
        <TextInput
          onChange={(e) => handleTasksInputChange(e, index)}
          value={step.data.quiz_cta}
          name="quiz_cta"
          label="Call To Action"
          placeholder="Text for Call To Action"
        />
        <Typography type={TEXT_TYPE.BODY_MICRO} color="textGray">
          Display a button to prompt users to start the quiz.
        </Typography>
      </div>

      <div className="flex flex-col gap-1">
        <TextInput
          onChange={(e) => handleTasksInputChange(e, index)}
          value={step.data.quiz_help_link}
          name="quiz_help_link"
          label="Help Link"
          placeholder="Help URL"
        />
        <Typography type={TEXT_TYPE.BODY_MICRO} color="textGray">
          Provide a URL where users can find assistance in successfully
          completing the quest.
        </Typography>
      </div>

      <div className="flex flex-col gap-8">
        {step.data.questions?.map(
          (
            eachQuestion: typeof QuizQuestionDefaultInput,
            questionIndex: number
          ) => (
            <InputCard key={"questionCategory-" + questionIndex}>
              <div className="flex flex-col gap-1">
                <TextInput
                  onChange={(e) => handleQuestionChange(e, questionIndex)}
                  value={eachQuestion.question}
                  name="question"
                  label={`Describe your question`}
                  placeholder={`Question ${questionIndex + 1}`}
                />
                <Typography type={TEXT_TYPE.BODY_MICRO} color="textGray">
                  Write the question&apos;s description.
                </Typography>
              </div>
              <div className="flex flex-col w-full gap-2 px-4 py-3 rounded-xl justify-center items-center border-[1px] border-[#f4faff4d]">
                <div className="pt-4 py-6">
                  <Typography type={TEXT_TYPE.H4} color="secondary">
                    Set Options
                  </Typography>
                </div>
                <div className="flex gap-4 flex-col w-full">
                  {eachQuestion.options.map((option, optionIndex) => (
                    <div
                      key={"option-" + optionIndex}
                      className="flex flex-row justify-between w-full items-center"
                    >
                      <div className="flex flex-col w-full gap-1">
                        <label htmlFor={"option"}>
                          Option {optionIndex + 1}
                        </label>
                        <div className="flex flex-row items-center">
                          <div className="w-full">
                            <input
                              name={"option"}
                              value={option}
                              onChange={(e) =>
                                handleOptionChange(
                                  e,
                                  optionIndex,
                                  questionIndex
                                )
                              }
                              placeholder={`Option ${optionIndex + 1}`}
                              className={`${styles.input} w-full`}
                              type={"text"}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <Dropdown
                  value={
                    step.data.questions[questionIndex].correct_answers[0] ?? 1
                  }
                  backgroundColor="#101012"
                  textColor="#fff"
                  handleChange={(event: SelectChangeEvent) => {
                    handleCorrectAnswer(
                      parseInt(event.target.value),
                      questionIndex
                    );
                  }}
                  options={["1", "2", "3", "4"].map((eachItem) => {
                    return {
                      value: eachItem,
                      label: eachItem,
                    };
                  })}
                />
                <Typography type={TEXT_TYPE.BODY_MICRO} color="textGray">
                  Specify the correct answer to the question.
                </Typography>
              </div>
            </InputCard>
          )
        )}
        <div
          onClick={handleAddQuestion}
          className={`${styles.addQuestion} modified-cursor-pointer`}
        >
          + Add question
        </div>
      </div>
    </div>
  );
};

export default QuizStep;
