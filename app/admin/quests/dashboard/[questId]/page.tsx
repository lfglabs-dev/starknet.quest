"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "@styles/admin.module.css";
import { useRouter } from "next/navigation";
import { AdminService } from "@services/authService";
import ProgressBar from "@components/quiz/progressBar";
import InputCard from "@components/admin/InputCard";
import { MenuItem, Select, SelectChangeEvent, Switch } from "@mui/material";
import Button from "@components/UI/button";
import {
  QuestDefault,
  TOKEN_ADDRESS_MAP,
  TOKEN_DECIMAL_MAP,
} from "@constants/common";
import { getCurrentNetwork } from "@utils/network";
import Textinput from "@components/admin/Textinput";
import Dateinput from "@components/admin/DateInput";
import QuizControls from "@components/quiz/quizControls";
import {
  CATEGORY_OPTIONS,
  TASK_OPTIONS,
  TWITTER_OPTIONS,
  nft_uri,
  QuizQuestionDefaultInput,
  getDefaultValues,
} from "@constants/admin";
import {
  NFTUri,
  UpdateBoost,
  UpdateQuest,
  UserTask,
} from "../../../../../types/backTypes";
import { useInfoBar } from "@context/useInfobar";
import AdminQuestDetails from "@components/admin/QuestDetails";

type AddressOrDomainProps = {
  params: {
    questId: string;
  };
};

// Define discriminated union types
type StepMap =
  | { type: "Quiz"; data: QuizInputType }
  | { type: "TwitterFw"; data: TwitterFwInputType }
  | { type: "TwitterRw"; data: TwitterRwInputType }
  | { type: "Discord"; data: DiscordInputType }
  | { type: "Custom"; data: CustomInputType }
  | { type: "Domain"; data: DomainInputType }
  | { type: "None"; data: object };

export default function Page({ params }: AddressOrDomainProps) {
  const network = getCurrentNetwork();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const questId = useRef(parseInt(params.questId));
  const [questInput, setQuestInput] = useState<UpdateQuest>({
    id: Number(params.questId),
  });
  const [nfturi, setNftUri] = useState<NFTUri>(nft_uri);
  const [headingText, setHeadingText] = useState("Set up");
  const [showBoost, setShowBoost] = useState(false);
  const [boostInput, setBoostInput] = useState<UpdateBoost>({
    id: 0,
  });
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [showTwitterOption, setShowTwitterOption] = useState(-1);
  const [steps, setSteps] = useState<StepMap[]>([
    {
      type: "None",
      data: {},
    },
  ]);
  const { showMessage } = useInfoBar();
  const [questData, setQuestData] = useState<typeof QuestDefault>(QuestDefault);

  const fetchPageData = useCallback(async () => {
    try {
      const quest_details = await AdminService.getQuestById(questId.current);
      const nft_uri_data = await AdminService.getNftUriByQuestId({
        id: questId.current,
      });
      const quest_tasks = await AdminService.getTasksByQuestId(questId.current);
      const formatted_steps = await tasksFormatter(quest_tasks);
      setSteps(formatted_steps);
      if (!quest_details) return;
      setStartTime(
        new Date(quest_details.start_time).toISOString().split("T")[0]
      );
      setNftUri(nft_uri_data);
      setBoostInput(quest_details.boosts[0]);
      setEndTime(new Date(quest_details.expiry).toISOString().split("T")[0]);
      setQuestInput(quest_details);
      setQuestData(quest_details);
      // setSteps(res);
    } catch (error) {
      console.log("Error while fetching quests", error);
    }
  }, [questId.current]);

  useEffect(() => {
    console.log({ steps });
  }, [steps]);

  const tasksFormatter = useCallback(async (tasks_details: UserTask[]) => {
    const taskPromises = tasks_details.map(async (task: UserTask) => {
      if (task.task_type === "quiz") {
        if (!task.quiz_name) return;
        const res = await AdminService.getQuizDetails({
          id: task.quiz_name,
        });
        return {
          type: "Quiz",
          data: {
            quiz_name: res.name,
            quiz_desc: res.desc,
            quiz_intro: res.intro,
            quiz_cta: task.cta,
            quiz_help_link: res.help_link,
            questions: res.questions.map(
              (question: typeof QuizQuestionDefaultInput) => {
                return {
                  question: question.question,
                  options: question.options,
                  correct_answers: question.correct_answers,
                };
              }
            ),
          },
        };
      } else if (task.task_type === "twitter_fw") {
        return {
          type: "TwitterFw",
          data: {
            twfw_name: task.name,
            twfw_desc: task.desc,
            twfw_username: task?.verify_redirect?.split("=")[1] ?? "",
          },
        };
      } else if (task.task_type === "twitter_rw") {
        return {
          type: "TwitterRw",
          data: {
            twrw_name: task.name,
            twrw_desc: task.desc,
            twrw_post_link: task.verify_redirect,
          },
        };
      } else if (task.task_type === "discord") {
        return {
          type: "Discord",
          data: {
            dc_name: task.name,
            dc_desc: task.desc,
            dc_guild_id: task.discord_guild_id,
            dc_invite_link: task.href,
          },
        };
      } else if (task.task_type === "Custom") {
        return {
          type: "Custom",
          data: {
            custom_name: task.name,
            custom_desc: task.desc,
            custom_href: task.href,
            custom_cta: task.cta,
          },
        };
      } else if (task.task_type === "domain") {
        return {
          type: "Domain",
          data: {
            domain_name: task.name,
            domain_desc: task.desc,
          },
        };
      }
    });

    const res = await Promise.all(taskPromises);
    return res as StepMap[];
  }, []);

  // check for updates in quest data

  useEffect(() => {
    fetchPageData();
  }, []);

  const handleUpdateQuest = useCallback(async () => {
    try {
      if (!questId.current) return;
      const response = await AdminService.updateQuest(questInput);
      if (!response) return;
    } catch (error) {
      console.log("Error while creating quest", error);
    }
  }, [questInput]);

  const handleUpdateBoost = useCallback(async () => {
    try {
      if (!showBoost) return;
      const response = await AdminService.updateBoost({
        ...boostInput,
      });
      if (!response) return;
    } catch (error) {
      console.log("Error while creating quest", error);
    }
  }, [questId, boostInput]);

  const handlePagination = useCallback((type: "Next" | "Back") => {
    if (type === "Next") {
      setCurrentPage((prev) => prev + 1);
    } else {
      setCurrentPage((prev) => prev - 1);
    }
  }, []);

  useEffect(() => {
    if (currentPage === 1) {
      setHeadingText("Set up");
    } else if (currentPage === 2) {
      setHeadingText("Set up rewards");
    } else if (currentPage === 3) {
      setHeadingText("Create Tasks");
    } else if (currentPage === 4) {
      setHeadingText("Set up rewards");
    }
  }, [currentPage]);

  const handleQuestInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setQuestInput((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleBoostInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setBoostInput((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleTasksInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const { name, value } = e.target;
      setSteps((prev) => {
        const newArr = [...prev];
        const new_obj = { ...newArr[index] };
        new_obj.data = { ...new_obj.data, [name]: value };
        newArr[index] = new_obj;
        return newArr;
      });
    },
    []
  );

  useEffect(() => {
    //check if start time is less than current time
    if (new Date(startTime).getTime() < new Date().getTime()) {
      showMessage("Start time cannot be less than current time");
      return;
    }

    setQuestInput((prev) => ({
      ...prev,
      start_time: new Date(startTime).getTime(),
    }));
  }, [startTime]);

  useEffect(() => {
    // check if start_time is less than end_time
    if (new Date(endTime).getTime() < new Date(startTime).getTime()) {
      showMessage("End time cannot be less than start time");
      return;
    }
    setQuestInput((prev) => ({
      ...prev,
      expiry: new Date(endTime).getTime(),
    }));
    setBoostInput((prev) => ({
      ...prev,
      expiry: new Date(endTime).getTime(),
    }));
  }, [endTime]);

  const handlePublishQuest = useCallback(
    async (value: boolean) => {
      await AdminService.updateQuest({
        id: questId.current,
        disabled: value,
      });
    },
    [questId]
  );

  return (
    <div className={styles.layout_screen}>
      <ProgressBar currentStep={currentPage} totalSteps={4} />
      <p className={styles.screenHeadingText}>Create a new quest</p>
      {currentPage === 1 ? (
        <>
          <InputCard>
            <div className="flex flex-col gap-8 w-full">
              <p className={styles.cardHeading}>{headingText}</p>
              <Textinput
                onChange={(e) => {
                  setQuestInput((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }));
                  setBoostInput((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }));
                }}
                value={questInput.name ?? ""}
                name="name"
                label="Quest Name"
                placeholder="Quest Name"
              />
              <Textinput
                onChange={handleQuestInputChange}
                value={questInput.desc ?? ""}
                name="desc"
                label="Description"
                placeholder="Quest Description"
                multiline={4}
              />
              <div className="w-full flex justify-between gap-4">
                <div className="flex-1 w-full">
                  <Dateinput
                    onChange={(e) => {
                      setStartTime(e.target.value);
                    }}
                    value={startTime}
                    label="Start Date"
                    placeholder="Start Date"
                    name="start_time"
                  />
                </div>
                <div className="flex-1 w-full">
                  <Dateinput
                    onChange={(e) => {
                      setEndTime(e.target.value);
                    }}
                    value={endTime}
                    label="End Date"
                    placeholder="End Date"
                    name="expiry"
                  />
                </div>
              </div>
              <div className="flex flex-row w-full gap-2 bg-gray-300 p-2 rounded-xl">
                {CATEGORY_OPTIONS.map((category) => (
                  <div
                    onClick={() => {
                      setQuestInput((prev) => ({ ...prev, category }));
                    }}
                    key={category}
                    className="py-3 px-5 rounded-xl w-fit"
                    style={{
                      cursor: "pointer",
                      backgroundColor:
                        questInput.category === category
                          ? "#ffffff"
                          : "#29282B",
                      color:
                        questInput.category === category
                          ? "#29282B"
                          : "#ffffff",
                    }}
                  >
                    <p className={styles.tagText}>{category}</p>
                  </div>
                ))}
              </div>
            </div>
          </InputCard>

          <div className="w-full items-center justify-center flex">
            <div className="w-fit">
              <Button onClick={() => handlePagination("Next")}>
                <p>Confirm Next</p>
              </Button>
            </div>
          </div>
        </>
      ) : currentPage === 2 ? (
        <>
          <InputCard>
            <div className="flex flex-col gap-8 w-full">
              <p className={styles.cardHeading}>{headingText}</p>
              <Textinput
                onChange={(e) => {
                  setNftUri((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }));
                }}
                value={nfturi.name}
                name="rewards_nfts"
                label="NFT Name"
                placeholder="NFT Name"
              />
              <Textinput
                onChange={handleQuestInputChange}
                value={questInput.rewards_title ?? ""}
                name="rewards_title"
                label="Rewards Title"
                placeholder="NFT Name"
              />
              <Textinput
                onChange={(e) => {
                  setQuestInput((prev) => ({
                    ...prev,
                    rewards_img: e.target.value,
                  }));
                  setNftUri((prev) => ({
                    ...prev,
                    image: e.target.value,
                  }));
                  setBoostInput((prev) => ({
                    ...prev,
                    img_url: e.target.value,
                  }));
                }}
                value={nfturi.image}
                name="nft_image"
                label="NFT Image Path"
                placeholder="NFT Image Path"
              />

              <Textinput
                onChange={(e) => {
                  setNftUri((prev) => ({
                    ...prev,
                    desc: e.target.value,
                  }));
                }}
                value={nfturi.description}
                name="nft_image"
                label="NFT Description"
                placeholder="NFT Description"
              />
              <Textinput
                onChange={handleQuestInputChange}
                value={questInput.logo ?? ""}
                name="logo"
                label="Issuer Logo"
                placeholder="Issuer logo"
              />
              <div className="flex gap-2 items-center">
                <p>Boost this quest</p>
                <Switch
                  name="Boost this Quest"
                  value={showBoost}
                  onChange={() => setShowBoost((prev) => !prev)}
                />
              </div>
            </div>
            {showBoost ? (
              <div className="flex flex-col w-full gap-8">
                <Textinput
                  onChange={handleBoostInputChange}
                  value={boostInput?.num_of_winners ?? ""}
                  name="num_of_winners"
                  label="Number of winners"
                  placeholder="Number of winners"
                />
                <Select
                  fullWidth
                  sx={{
                    backgroundColor: "#1F1F25",
                    borderRadius: "8px",
                  }}
                  value={boostInput?.token}
                  label="Token"
                  onChange={(event: SelectChangeEvent) => {
                    setBoostInput((prev) => ({
                      ...prev,
                      token: event.target.value,
                      token_decimals:
                        TOKEN_DECIMAL_MAP[
                          event.target.value as keyof typeof TOKEN_DECIMAL_MAP
                        ],
                    }));
                  }}
                >
                  {Object.keys(TOKEN_ADDRESS_MAP[network]).map(
                    (token, index) => (
                      <MenuItem
                        sx={{ backgroundColor: "#1F1F25" }}
                        key={index}
                        value={token}
                      >
                        {token}
                      </MenuItem>
                    )
                  )}
                </Select>
                <Textinput
                  onChange={handleBoostInputChange}
                  value={boostInput?.amount ?? ""}
                  name="amount"
                  label="Amount"
                  placeholder="Amount"
                />
              </div>
            ) : null}
          </InputCard>

          <div className="w-full items-center justify-center flex">
            <div className="w-fit">
              <Button
                onClick={async () => {
                  handlePagination("Next");
                }}
              >
                <p>Confirm Next</p>
              </Button>
            </div>
          </div>
          <QuizControls
            step={currentPage}
            setStep={setCurrentPage}
            onCancel={() => router.push("/admin/quests")}
          />
        </>
      ) : currentPage === 3 ? (
        <div className="flex flex-col gap-8 w-full">
          <p className={styles.cardHeading}>{headingText}</p>
          {steps?.map((step, index) => (
            <InputCard key={index}>
              <div className="flex gap-8">
                <div className="flex flex-row w-full gap-2 bg-gray-300 p-4 rounded-xl">
                  <>
                    {TASK_OPTIONS.map((category) => (
                      <div
                        onClick={() => {
                          if (
                            category === "Twitter" ||
                            category === "Twitter"
                          ) {
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
                        key={category}
                        className="py-3 px-5 rounded-xl w-fit"
                        style={{
                          cursor: "pointer",
                          backgroundColor: step?.type?.includes(category)
                            ? "#ffffff"
                            : "#29282B",
                          color: step?.type?.includes(category)
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
              {step?.type?.includes("twitter") ? (
                <div className="flex flex-row w-full gap-2 bg-gray-300 p-4 rounded-xl">
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
                      key={category}
                      className="py-3 px-5 rounded-xl w-fit"
                      style={{
                        cursor: "pointer",
                        backgroundColor:
                          step?.type ===
                          TWITTER_OPTIONS[
                            category as keyof typeof TWITTER_OPTIONS
                          ]
                            ? "#ffffff"
                            : "#29282B",
                        color:
                          step?.type ===
                          TWITTER_OPTIONS[
                            category as keyof typeof TWITTER_OPTIONS
                          ]
                            ? "#29282B"
                            : "#ffffff",
                      }}
                    >
                      <p className={styles.tagText}>{category}</p>
                    </div>
                  ))}
                </div>
              ) : null}

              {step?.type === "Quiz" ? (
                <div className="flex flex-col gap-8 pt-2">
                  <Textinput
                    onChange={(e) => handleTasksInputChange(e, index)}
                    value={step.data.quiz_name}
                    name="quiz_name"
                    label="Quiz Name"
                    placeholder="Quiz Name"
                  />
                  <Textinput
                    onChange={(e) => handleTasksInputChange(e, index)}
                    value={step.data.quiz_desc}
                    name="quiz_desc"
                    label="Quiz Description"
                    placeholder="Quiz Description"
                  />
                  <Textinput
                    onChange={(e) => handleTasksInputChange(e, index)}
                    value={step.data.quiz_intro}
                    name="quiz_intro"
                    label="Quiz Introduction"
                    placeholder="Help URL"
                  />
                  <Textinput
                    onChange={(e) => handleTasksInputChange(e, index)}
                    value={step.data.quiz_cta}
                    name="quiz_cta"
                    label="Call To Action"
                    placeholder="Call To Action"
                  />
                  <Textinput
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
                          <Textinput
                            onChange={(e) => {
                              const updatedSteps = steps.map((step, i) => {
                                if (i === index && step.type === "Quiz") {
                                  const updatedQuestions =
                                    step.data.questions.map(
                                      (
                                        questionObj: typeof QuizQuestionDefaultInput,
                                        qIndex: number
                                      ) => {
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
                            }}
                            value={eachQuestion.question}
                            name="question"
                            label={`Question ${questionIndex + 1}`}
                            placeholder={`Question ${questionIndex + 1}`}
                          />
                          {eachQuestion.options.map((option, optionIndex) => (
                            <div
                              key={optionIndex}
                              className="flex flex-row gap-4 justify-between w-full items-center"
                            >
                              <div className="flex flex-col w-full gap-2">
                                <label htmlFor={"option"}>
                                  Option {optionIndex + 1}
                                </label>
                                <div className="flex flex-row gap-2 items-center">
                                  <div className="w-3/4">
                                    <input
                                      name={"option"}
                                      value={option}
                                      onChange={(e) => {
                                        const updatedSteps = steps.map(
                                          (step, i) => {
                                            if (
                                              i === index &&
                                              step.type === "Quiz"
                                            ) {
                                              const updatedQuestions =
                                                step.data.questions.map(
                                                  (
                                                    questionObj: typeof QuizQuestionDefaultInput,
                                                    qIndex: number
                                                  ) => {
                                                    if (
                                                      qIndex === questionIndex
                                                    ) {
                                                      const updatedOptions =
                                                        questionObj.options.map(
                                                          (option, oIndex) => {
                                                            if (
                                                              oIndex ===
                                                              optionIndex
                                                            ) {
                                                              return e.target
                                                                .value;
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
                                          }
                                        );

                                        setSteps(updatedSteps);
                                      }}
                                      placeholder={`Option ${optionIndex + 1}`}
                                      className={`${styles.input} w-full`}
                                      type={"text"}
                                    />
                                  </div>
                                  <div className="flex flex-row gap-2 justify-end">
                                    <input
                                      onChange={(e) => {
                                        const updatedSteps = steps.map(
                                          (step, i) => {
                                            if (
                                              i === index &&
                                              step.type === "Quiz"
                                            ) {
                                              const updatedQuestions =
                                                step.data.questions.map(
                                                  (
                                                    questionObj: typeof QuizQuestionDefaultInput,
                                                    qIndex: number
                                                  ) => {
                                                    if (
                                                      qIndex === questionIndex
                                                    ) {
                                                      return {
                                                        ...questionObj,
                                                        correct_answers: [
                                                          optionIndex,
                                                        ],
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
                                          }
                                        );
                                        setSteps(updatedSteps);
                                      }}
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
              ) : step?.type === "Discord" ? (
                <div className="flex flex-col gap-8 pt-2">
                  <Textinput
                    onChange={(e) => handleTasksInputChange(e, index)}
                    value={step.data.dc_name}
                    name="dc_name"
                    label="Name"
                    placeholder="Name"
                  />
                  <Textinput
                    onChange={(e) => handleTasksInputChange(e, index)}
                    value={step.data.dc_desc}
                    name="dc_desc"
                    label="Description"
                    placeholder="Description"
                    multiline={4}
                  />
                  <Textinput
                    onChange={(e) => handleTasksInputChange(e, index)}
                    value={step.data.dc_guild_id}
                    name="dc_guild_id"
                    label="Guild ID"
                    placeholder="Discord ID"
                  />
                  <Textinput
                    onChange={(e) => handleTasksInputChange(e, index)}
                    value={step.data.dc_invite_link}
                    name="dc_invite_link"
                    label="Discord invite link"
                    placeholder="Invite Link"
                  />
                </div>
              ) : step?.type === "TwitterFw" ? (
                <div className="flex flex-col gap-8 pt-8">
                  <Textinput
                    onChange={(e) => handleTasksInputChange(e, index)}
                    value={step.data.twfw_name}
                    name="twfw_name"
                    label="Name"
                    placeholder="Name"
                  />
                  <Textinput
                    onChange={(e) => handleTasksInputChange(e, index)}
                    value={step.data.twfw_desc}
                    name="twfw_desc"
                    label="Description"
                    placeholder="Description"
                    multiline={4}
                  />
                  <Textinput
                    onChange={(e) => handleTasksInputChange(e, index)}
                    value={step.data.twfw_username}
                    name="twfw_username"
                    label="Twitter Username"
                    placeholder="Username"
                  />
                </div>
              ) : step?.type === "Domain" ? (
                <div className="flex flex-col gap-8 pt-8">
                  <Textinput
                    onChange={(e) => handleTasksInputChange(e, index)}
                    value={step.data.domain_name}
                    name="twfw_name"
                    label="Name"
                    placeholder="Name"
                  />
                  <Textinput
                    onChange={(e) => handleTasksInputChange(e, index)}
                    value={step.data.domain_desc}
                    name="twfw_desc"
                    label="Description"
                    placeholder="Description"
                    multiline={4}
                  />
                </div>
              ) : step?.type === "TwitterRw" ? (
                <div className="flex flex-col gap-8 pt-8">
                  <Textinput
                    onChange={(e) => handleTasksInputChange(e, index)}
                    value={step.data.twrw_name}
                    name="twrw_name"
                    label="Name"
                    placeholder="Name"
                  />
                  <Textinput
                    onChange={(e) => handleTasksInputChange(e, index)}
                    value={step.data.twrw_desc}
                    name="twrw_desc"
                    label="Description"
                    placeholder="Description"
                    multiline={4}
                  />
                  <Textinput
                    onChange={(e) => handleTasksInputChange(e, index)}
                    value={step.data.twrw_post_link}
                    name="twrw_post_link"
                    label="Post URL"
                    placeholder="Post URL"
                  />
                </div>
              ) : step?.type === "Custom" ? (
                <div className="flex flex-col gap-8 pt-2">
                  <Textinput
                    onChange={(e) => handleTasksInputChange(e, index)}
                    value={step.data.custom_name}
                    name="custom_name"
                    label="Name"
                    placeholder="Name"
                  />
                  <Textinput
                    onChange={(e) => handleTasksInputChange(e, index)}
                    value={step.data.custom_desc}
                    name="custom_desc"
                    label="Description"
                    placeholder="Description"
                    multiline={4}
                  />
                  <Textinput
                    onChange={(e) => handleTasksInputChange(e, index)}
                    value={step.data.custom_href}
                    name="custom_href"
                    label="API Endpoint"
                    placeholder="API Endpoint"
                  />
                  <Textinput
                    onChange={(e) => handleTasksInputChange(e, index)}
                    value={step.data.custom_cta}
                    name="custom_cta"
                    label="URL"
                    placeholder="URL"
                  />
                </div>
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
          {steps?.length > 1 ? (
            <div className="w-full items-center justify-center flex">
              <div className="w-fit">
                <Button
                  onClick={async () => {
                    // await handleCreateTask();
                    setCurrentPage((prev) => prev + 1);
                  }}
                >
                  <p>Save Tasks</p>
                </Button>
              </div>
            </div>
          ) : null}
          <QuizControls
            step={currentPage}
            setStep={setCurrentPage}
            onCancel={() => router.push("/admin/quests")}
          />
        </div>
      ) : currentPage === 4 ? (
        <>
          <AdminQuestDetails
            quest={questData}
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            setShowDomainPopup={() => {}}
            hasRootDomain={false}
            rewardButtonTitle={questData.disabled ? "Enable" : "Disable"}
            onRewardButtonClick={async () => {
              await handlePublishQuest(!questData.disabled);
            }}
            overrideDisabledState={false}
          />
        </>
      ) : null}
    </div>
  );
}
