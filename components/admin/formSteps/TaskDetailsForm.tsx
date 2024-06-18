import {
  TASK_OPTIONS,
  TWITTER_OPTIONS,
  getDefaultValues,
} from "@constants/admin";
import React, { FunctionComponent } from "react";
import styles from "@styles/admin.module.css";
import InputCard from "../inputCard";
import Button from "@components/UI/button";
import QuizStep from "../taskSteps/quizStep";
import DiscordStep from "../taskSteps/discordStep";
import TwitterFwStep from "../taskSteps/twitterFwStep";
import CustomStep from "../taskSteps/customStep";
import TwitterRwStep from "../taskSteps/twitterRwStep";
import DomainStep from "../taskSteps/domainStep";

type TaskDetailsFormProps = {
  steps: StepMap[];
  setShowTwitterOption: React.Dispatch<React.SetStateAction<number>>;
  setSteps: React.Dispatch<React.SetStateAction<StepMap[]>>;
  showTwitterOption: number;
  handleTasksInputChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => void;
  buttonLoading: boolean;
  onSubmit: () => void;
  isButtonDisabled: boolean;
};

const TaskDetailsForm: FunctionComponent<TaskDetailsFormProps> = ({
  steps,
  setShowTwitterOption,
  setSteps,
  showTwitterOption,
  handleTasksInputChange,
  buttonLoading,
  onSubmit,
  isButtonDisabled,
}) => {
  return (
    <div>
      {steps.map((step, index) => (
        <InputCard key={"input-" + index}>
          <div className="flex gap-8">
            <div className="flex flex-row w-full gap-2 px-4 py-3 rounded-xl border-[1px] border-[#f4faff4d]">
              <>
                {TASK_OPTIONS.map((category) => (
                  <div
                    onClick={() => {
                      if (category === "Twitter") {
                        setShowTwitterOption(index);
                        return;
                      }
                      setShowTwitterOption(-1);
                      setSteps((prev) => {
                        const newArr = [...prev];
                        newArr[index] = {
                          type: category as TaskType,
                          data: getDefaultValues(category as TaskType),
                        };
                        return newArr;
                      });
                    }}
                    key={"taskcategory-" + category}
                    className="py-3 px-5 rounded-xl w-fit"
                    style={{
                      cursor: "pointer",
                      backgroundColor: step?.type.includes(category)
                        ? "#ffffff"
                        : "#29282B",
                      color: step?.type.includes(category)
                        ? "#29282B"
                        : "#ffffff",
                    }}
                  >
                    <p className={styles.tagText}>{category}</p>
                  </div>
                ))}
              </>
            </div>
          </div>
          {showTwitterOption === index ? (
            <div className="flex flex-row w-full gap-2 px-4 py-3 rounded-xl border-[1px] border-[#f4faff4d]">
              {Object.keys(TWITTER_OPTIONS).map((category) => (
                <div
                  onClick={() => {
                    setSteps((prev) => {
                      const newArr = [...prev];
                      newArr[index] = {
                        type: TWITTER_OPTIONS[
                          category as keyof typeof TWITTER_OPTIONS
                        ] as TaskType,
                        data: getDefaultValues(
                          TWITTER_OPTIONS[
                            category as keyof typeof TWITTER_OPTIONS
                          ] as TaskType
                        ),
                      };
                      return newArr;
                    });
                  }}
                  key={"twitteroption+" + category}
                  className="py-3 px-5 rounded-xl w-fit"
                  style={{
                    cursor: "pointer",
                    backgroundColor:
                      step?.type ===
                      TWITTER_OPTIONS[category as keyof typeof TWITTER_OPTIONS]
                        ? "#ffffff"
                        : "#29282B",
                    color:
                      step?.type ===
                      TWITTER_OPTIONS[category as keyof typeof TWITTER_OPTIONS]
                        ? "#29282B"
                        : "#ffffff",
                  }}
                >
                  <p className={styles.tagText}>{category}</p>
                </div>
              ))}
            </div>
          ) : null}

          {step.type === "Quiz" ? (
            <QuizStep
              handleTasksInputChange={handleTasksInputChange}
              step={step}
              steps={steps}
              setSteps={setSteps}
              index={index}
            />
          ) : step.type === "Discord" ? (
            <DiscordStep
              handleTasksInputChange={handleTasksInputChange}
              index={index}
              step={step}
            />
          ) : step.type === "TwitterFw" ? (
            <TwitterFwStep
              handleTasksInputChange={handleTasksInputChange}
              index={index}
              step={step}
            />
          ) : step?.type === "Domain" ? (
            <DomainStep
              handleTasksInputChange={handleTasksInputChange}
              index={index}
              step={step}
            />
          ) : step.type === "TwitterRw" ? (
            <TwitterRwStep
              handleTasksInputChange={handleTasksInputChange}
              index={index}
              step={step}
            />
          ) : step.type === "Custom" ? (
            <CustomStep
              handleTasksInputChange={handleTasksInputChange}
              index={index}
              step={step}
            />
          ) : null}
        </InputCard>
      ))}

      <div
        onClick={() => {
          setSteps((prev) => {
            const newArr = [...prev];
            newArr.push({ type: "None", data: {} });
            return newArr;
          });
        }}
        className="flex w-full justify-center modified-cursor-pointer"
      >
        + Add Step
      </div>
      {steps.length > 1 ? (
        <div className="w-full items-center justify-center flex">
          <div className="w-fit">
            <Button
              loading={buttonLoading}
              onClick={onSubmit}
              disabled={isButtonDisabled}
            >
              <p>Save Tasks</p>
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default TaskDetailsForm;
