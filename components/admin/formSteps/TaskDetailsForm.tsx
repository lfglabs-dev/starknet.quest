import {
  TASK_OPTIONS,
  TWITTER_OPTIONS,
  getDefaultValues,
} from "@constants/admin";
import React, { FunctionComponent, useState } from "react";
import styles from "@styles/admin.module.css";
import Button from "@components/UI/button";
import QuizStep from "../taskSteps/quizStep";
import DiscordStep from "../taskSteps/discordStep";
import TwitterFwStep from "../taskSteps/twitterFwStep";
import CustomStep from "../taskSteps/customStep";
import TwitterRwStep from "../taskSteps/twitterRwStep";
import DomainStep from "../taskSteps/domainStep";
import Typography from "@components/UI/typography/typography";
import { TEXT_TYPE } from "@constants/typography";

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
  deleteTasks: (index: number) => void;
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
  deleteTasks,
}) => {
  const [currentTask, setCurrenTask] = useState(0);
  const renderTask = () => {
    const step = steps[currentTask];

    if (step?.type === "Quiz") {
      return (
        <QuizStep
          handleTasksInputChange={handleTasksInputChange}
          step={step}
          steps={steps}
          setSteps={setSteps}
          index={currentTask}
        />
      );
    } else if (step?.type === "Discord") {
      return (
        <DiscordStep
          handleTasksInputChange={handleTasksInputChange}
          index={currentTask}
          step={step}
        />
      );
    } else if (step?.type === "TwitterFw") {
      return (
        <TwitterFwStep
          handleTasksInputChange={handleTasksInputChange}
          index={currentTask}
          step={step}
        />
      );
    } else if (step?.type === "Domain") {
      return (
        <DomainStep
          handleTasksInputChange={handleTasksInputChange}
          index={currentTask}
          step={step}
        />
      );
    } else if (step?.type === "TwitterRw") {
      return (
        <TwitterRwStep
          handleTasksInputChange={handleTasksInputChange}
          index={currentTask}
          step={step}
        />
      );
    } else if (step?.type === "Custom") {
      return (
        <CustomStep
          handleTasksInputChange={handleTasksInputChange}
          index={currentTask}
          step={step}
        />
      );
    }
  };
  return (
    <div>
      <div className="flex w-full gap-2 py-3 justify-between flex-col-reverse sm:flex-row">
        <div className="flex gap-4 items-center w-full flex-col sm:flex-row">
          {Object.keys(steps).map((_, index) => (
            <div
              onClick={() => {
                setCurrenTask(index);
              }}
              key={"twitteroption+" + index}
              className="py-3 px-5 rounded-xl sm:w-fit w-full"
              style={{
                cursor: "pointer",
                backgroundColor: index === currentTask ? "#ffffff" : "#29282B",
                color: index === currentTask ? "#29282B" : "#ffffff",
              }}
            >
              <p className={styles.tagText}>Task {index + 1}</p>
            </div>
          ))}
        </div>
        <div className="sm:w-1/3 w-full">
          <Button
            onClick={() => {
              setSteps((prev) => {
                const newArr = [...prev];
                newArr.push({ type: "None", data: {} });
                return newArr;
              });
            }}
          >
            Add Step
          </Button>
        </div>
      </div>

      <div key={"tasks-" + currentTask} className="flex gap-4 flex-col">
        <div className="flex gap-2 flex-col">
          <div className="flex flex-row w-full gap-2 px-4 py-3 rounded-xl border-[1px] border-[#f4faff4d] flex-wrap">
            <>
              {TASK_OPTIONS.map((category) => (
                <div
                  onClick={() => {
                    if (category === "Twitter") {
                      setShowTwitterOption(currentTask);
                      return;
                    }
                    setShowTwitterOption(-1);
                    setSteps((prev) => {
                      const newArr = [...prev];
                      newArr[currentTask] = {
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
                    backgroundColor: steps[currentTask]?.type?.includes(
                      category
                    )
                      ? "#ffffff"
                      : "#29282B",
                    color: steps[currentTask]?.type?.includes(category)
                      ? "#29282B"
                      : "#ffffff",
                  }}
                >
                  <p className={styles.tagText}>{category}</p>
                </div>
              ))}
            </>
          </div>
          <Typography type={TEXT_TYPE.BODY_MICRO} color="textGray">
            Select a template to guide you in structuring your personalized
            quest tasks.
          </Typography>
        </div>
        {showTwitterOption === currentTask ? (
          <div className="flex flex-row w-full gap-2 px-4 py-3 rounded-xl border-[1px] border-[#f4faff4d]">
            {Object.keys(TWITTER_OPTIONS).map((category) => (
              <div
                onClick={() => {
                  setSteps((prev) => {
                    const newArr = [...prev];
                    newArr[currentTask] = {
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
                    steps[currentTask]?.type ===
                    TWITTER_OPTIONS[category as keyof typeof TWITTER_OPTIONS]
                      ? "#ffffff"
                      : "#29282B",
                  color:
                    steps[currentTask]?.type ===
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

        {renderTask()}
      </div>

      <div className="flex flex-row gap-4">
        <div className="w-fit pt-4">
          <Button
            loading={buttonLoading}
            onClick={async () => await onSubmit()}
            disabled={isButtonDisabled}
          >
            <p>Save All Tasks</p>
          </Button>
        </div>
        <div className="w-fit pt-4">
          <Button
            loading={buttonLoading}
            onClick={async () => {
              await deleteTasks(currentTask);
              setCurrenTask(0);
            }}
            disabled={isButtonDisabled}
          >
            <p>Delete Task</p>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsForm;
