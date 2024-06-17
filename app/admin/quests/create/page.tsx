"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import styles from "@styles/admin.module.css";
import { useRouter } from "next/navigation";
import { AdminService } from "@services/authService";
import ProgressBar from "@components/UI/progressBar";
import InputCard from "@components/admin/inputCard";
import { SelectChangeEvent, Switch } from "@mui/material";
import Button from "@components/UI/button";
import {
  QuestDefault,
  TOKEN_ADDRESS_MAP,
  TOKEN_DECIMAL_MAP,
} from "@constants/common";
import { getCurrentNetwork } from "@utils/network";
import TextInput from "@components/admin/textInput";
import DateInput from "@components/admin/dateInput";
import QuizControls from "@components/quiz/quizControls";
import {
  CATEGORY_OPTIONS,
  TASK_OPTIONS,
  TWITTER_OPTIONS,
  boostDefaultInput,
  nft_uri,
  questDefaultInput,
  QuizQuestionDefaultInput,
  getDefaultValues,
} from "@constants/admin";
import { CreateQuest, NFTUri } from "../../../../types/backTypes";
import AdminQuestDetails from "@components/admin/questDetails";
import { useNotification } from "@context/NotificationProvider";
import Dropdown from "@components/UI/dropdown";
import { getTokenName } from "@utils/tokenService";
import { getExpireTimeFromJwt, getUserFromJwt } from "@utils/jwt";

// Define discriminated union types
type StepMap =
  | { type: "Quiz"; data: QuizInputType }
  | { type: "TwitterFw"; data: TwitterFwInputType }
  | { type: "TwitterRw"; data: TwitterRwInputType }
  | { type: "Discord"; data: DiscordInputType }
  | { type: "Custom"; data: CustomInputType }
  | { type: "None"; data: object }
  | { type: "Domain"; data: DomainInputType };

export default function Page() {
  const network = getCurrentNetwork();
  const getCurrentUser = getUserFromJwt();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [questId, setQuestId] = useState<number>(0);
  const [questInput, setQuestInput] = useState<CreateQuest>(questDefaultInput);
  const [nfturi, setNftUri] = useState<NFTUri>(nft_uri);
  const [headingText, setHeadingText] = useState("Set up");
  const [showBoost, setShowBoost] = useState(false);
  const [boostInput, setBoostInput] = useState(boostDefaultInput);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [showTwitterOption, setShowTwitterOption] = useState(-1);
  const [steps, setSteps] = useState<StepMap[]>([
    {
      type: "None",
      data: {},
    },
  ]);
  const { showNotification } = useNotification();
  const [finalQuestData, setFinalQuestData] =
    useState<typeof QuestDefault>(QuestDefault);
  const [buttonLoading, setButtonLoading] = useState(false);

  useEffect(() => {
    const tokenExpiryTime = getExpireTimeFromJwt();
    if (!tokenExpiryTime || tokenExpiryTime < new Date().getTime()) return;
    router.push("/admin/quests");
  }, []);

  const isButtonDisabled = useMemo(() => {
    const boostInputValid =
      !boostInput.amount || !boostInput.num_of_winners || !boostInput.token;

    const nftUriValid = !nfturi.name || !nfturi.image;

    const questInputValid =
      !questInput.name ||
      !questInput.desc ||
      !questInput.start_time ||
      !questInput.expiry ||
      !questInput.category;

    const questRewardValid = !questInput.rewards_title || !questInput.logo;

    if (currentPage === 1) {
      return questInputValid;
    } else if (currentPage === 2) {
      return (showBoost && boostInputValid) || nftUriValid || questRewardValid;
    }
    if (currentPage === 3) {
      return steps.some((step) => step.type === "None");
    }
    return false;
  }, [currentPage, questInput, nfturi, steps, showBoost, boostInput]);

  const fetchQuestData = useCallback(async () => {
    try {
      const res = await AdminService.getQuestById(questId);
      if (!res) return;
      setFinalQuestData(res);
    } catch (error) {
      console.log("Error while fetching quests", error);
    }
  }, [questId]);

  useEffect(() => {
    if (currentPage !== 4) return;
    fetchQuestData();
  }, [currentPage]);

  const handleCreateQuest = useCallback(async () => {
    try {
      const response = await AdminService.createQuest(questInput);
      if (!response) return;
      setQuestId(Number(response.id));
      return Number(response.id);
    } catch (error) {
      console.log("Error while creating quest", error);
    }
  }, [questInput]);

  const handleCreateNftUri = useCallback(
    async (questId: number) => {
      try {
        const response = await AdminService.createNftUri({
          questId,
          name: nfturi.name,
          description: nfturi.description,
          image: nfturi.image,
        });
        if (!response) return;
        return Number(response.id);
      } catch (error) {
        console.log("Error while creating quest", error);
      }
    },
    [questInput, nfturi]
  );

  const handleCreateBoost = useCallback(
    async (quest_id: number) => {
      try {
        if (!showBoost) return;
        const response = await AdminService.createBoost({
          ...boostInput,
          quest_id: quest_id,
          amount: Number(boostInput.amount),
          num_of_winners: Number(boostInput.num_of_winners),
        });
        if (!response) return;
      } catch (error) {
        console.log("Error while creating boost", error);
      }
    },
    [questId, boostInput]
  );

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
      showNotification("Start time cannot be less than current time", "info");
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
      showNotification("End time cannot be less than start time", "info");
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
        id: questId,
        disabled: value,
      });
      await fetchQuestData();
    },
    [questId]
  );

  const handleQuestImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
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
    },
    []
  );

  const handleQuestAndBoostCreate = useCallback(async () => {
    setButtonLoading(true);
    const id = await handleCreateQuest();
    if (!id) return;
    await handleCreateBoost(id);
    await handleCreateNftUri(id);
    await setButtonLoading(false);
    handlePagination("Next");
  }, [questInput, boostInput]);

  const handleCreateTask = useCallback(async () => {
    setButtonLoading(true);
    steps.map(async (step) => {
      if (step.type === "Quiz") {
        if (
          step.data.quiz_name?.length === 0 ||
          step.data.quiz_desc?.length === 0 ||
          step.data.quiz_intro?.length === 0 ||
          step.data.quiz_cta?.length === 0 ||
          step.data.quiz_help_link?.length === 0
        ) {
          showNotification("Please fill all fields for Quiz", "info");
          return;
        }
        const response = await AdminService.createQuiz({
          quest_id: questId,
          name: step.data.quiz_name,
          desc: step.data.quiz_desc,
          intro: step.data.quiz_intro,
          cta: step.data.quiz_cta,
          help_link: step.data.quiz_help_link,
        });
        await Promise.all(
          step.data.questions.map(
            async (question: typeof QuizQuestionDefaultInput) => {
              await AdminService.createQuizQuestion({
                quiz_id: response.id,
                question: question.question,
                options: question.options,
                correct_answers: question.correct_answers,
              });
            }
          )
        );
      }
      if (step.type === "TwitterFw") {
        if (
          step.data.twfw_name?.length === 0 ||
          step.data.twfw_desc?.length === 0 ||
          step.data.twfw_username?.length === 0
        ) {
          showNotification("Please fill all fields for Twitter Follow", "info");
          return;
        }
        await AdminService.createTwitterFw({
          quest_id: questId,
          name: step.data.twfw_name,
          desc: step.data.twfw_desc,
          username: step.data.twfw_username,
        });
      } else if (step.type === "TwitterRw") {
        if (
          step.data.twrw_name?.length === 0 ||
          step.data.twrw_desc?.length === 0 ||
          step.data.twrw_post_link?.length === 0
        ) {
          showNotification(
            "Please fill all fields for Twitter Retweet",
            "info"
          );
          return;
        }
        await AdminService.createTwitterRw({
          quest_id: questId,
          name: step.data.twrw_name,
          desc: step.data.twrw_desc,
          post_link: step.data.twrw_post_link,
        });
      } else if (step.type === "Discord") {
        if (
          step.data.dc_name?.length === 0 ||
          step.data.dc_desc?.length === 0 ||
          step.data.dc_invite_link?.length === 0 ||
          step.data.dc_guild_id?.length === 0
        ) {
          showNotification("Please fill all fields for Discord", "info");
          return;
        }
        await AdminService.createDiscord({
          quest_id: questId,
          name: step.data.dc_name,
          desc: step.data.dc_desc,
          invite_link: step.data.dc_invite_link,
          guild_id: step.data.dc_guild_id,
        });
      } else if (step.type === "Custom") {
        if (
          step.data.custom_name?.length === 0 ||
          step.data.custom_desc?.length === 0 ||
          step.data.custom_cta?.length === 0 ||
          step.data.custom_href?.length === 0
        ) {
          showNotification("Please fill all fields for Discord", "info");
          return;
        }
        await AdminService.createCustom({
          quest_id: questId,
          name: step.data.custom_name,
          desc: step.data.custom_desc,
          cta: step.data.custom_cta,
          href: step.data.custom_href,
        });
      } else if (step.type === "Domain") {
        await AdminService.createDomain({
          quest_id: questId,
          name: step.data.domain_name,
          desc: step.data.domain_desc,
        });
      }
    });
    setButtonLoading(false);
    setCurrentPage((prev) => prev + 1);
  }, [steps]);

  return (
    <div className={styles.layout_screen}>
      <div className=" w-full max-w-[985px] relative">
        <ProgressBar doneSteps={currentPage - 1} totalSteps={4} />
      </div>
      <p className={styles.screenHeadingText}>Create a new quest</p>
      {currentPage === 1 ? (
        <>
          <InputCard>
            <div className="flex flex-col gap-8 w-full">
              <p className={styles.cardHeading}>{headingText}</p>
              <TextInput
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
                value={questInput.name}
                name="name"
                label="Quest Name"
                placeholder="Quest Name"
              />
              <TextInput
                onChange={handleQuestInputChange}
                value={questInput.title_card ?? ""}
                name="title_card"
                label="Quest Title Card"
                placeholder="Quest Title"
              />
              {getCurrentUser === "super_user" ? (
                <TextInput
                  onChange={handleQuestInputChange}
                  value={questInput.issuer ?? ""}
                  name="issuer"
                  label="Quest Issuer"
                  placeholder="Issuer name"
                />
              ) : null}

              <TextInput
                onChange={handleQuestInputChange}
                value={questInput.desc}
                name="desc"
                label="Description"
                placeholder="Quest Description"
                multiline={4}
              />
              <div className="w-full flex justify-between gap-4">
                <div className="flex-1 w-full">
                  <DateInput
                    onChange={(value) => {
                      setStartTime(value.toString());
                    }}
                    value={startTime}
                    label="Start Date"
                    placeholder="Start Date"
                    name="start_time"
                  />
                </div>
                <div className="flex-1 w-full">
                  <DateInput
                    onChange={(value) => {
                      setEndTime(value.toString());
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
                    key={"category" + category}
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
              <Button
                loading={buttonLoading}
                disabled={isButtonDisabled}
                onClick={() => handlePagination("Next")}
              >
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
              <TextInput
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
              <TextInput
                onChange={handleQuestInputChange}
                value={questInput.rewards_title}
                name="rewards_title"
                label="Rewards Title"
                placeholder="NFT Name"
              />
              <TextInput
                onChange={handleQuestImageChange}
                value={nfturi.image}
                name="nft_image"
                label="NFT Image Path"
                placeholder="NFT Image Path"
              />

              <TextInput
                onChange={(e) => {
                  setNftUri((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }));
                }}
                value={nfturi.description ?? ""}
                name="nft_image"
                label="NFT Description"
                placeholder="NFT Description"
              />
              <TextInput
                onChange={handleQuestInputChange}
                value={questInput.logo}
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
                <TextInput
                  onChange={handleBoostInputChange}
                  value={boostInput.num_of_winners}
                  name="num_of_winners"
                  label="Number of winners"
                  placeholder="Number of winners"
                />
                <Dropdown
                  value={getTokenName(boostInput.token)}
                  backgroundColor="#29282B"
                  textColor="#fff"
                  handleChange={(event: SelectChangeEvent) => {
                    setBoostInput((prev) => ({
                      ...prev,
                      token: event.target.value,
                      // token decimals is a value which has different tokens which we support and use their decimals here
                      token_decimals:
                        TOKEN_DECIMAL_MAP[
                          event.target.value as keyof typeof TOKEN_DECIMAL_MAP
                        ],
                    }));
                  }}
                  options={Object.keys(TOKEN_ADDRESS_MAP[network]).map(
                    (eachItem) => {
                      return {
                        value: eachItem,
                        label: eachItem,
                      };
                    }
                  )}
                />
                <TextInput
                  onChange={handleBoostInputChange}
                  value={boostInput.amount}
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
                loading={buttonLoading}
                onClick={async () => {
                  await handleQuestAndBoostCreate();
                }}
                disabled={isButtonDisabled}
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
          {steps.map((step, index) => (
            <InputCard key={"input-" + index}>
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
                      key={"twitteroption+" + category}
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

              {step.type === "Quiz" ? (
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
                              key={"option-" + optionIndex}
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
                                      onChange={() => {
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
              ) : step.type === "Discord" ? (
                <div className="flex flex-col gap-8 pt-2">
                  <TextInput
                    onChange={(e) => handleTasksInputChange(e, index)}
                    value={step.data.dc_name}
                    name="dc_name"
                    label="Name"
                    placeholder="Name"
                  />
                  <TextInput
                    onChange={(e) => handleTasksInputChange(e, index)}
                    value={step.data.dc_desc}
                    name="dc_desc"
                    label="Description"
                    placeholder="Description"
                    multiline={4}
                  />
                  <TextInput
                    onChange={(e) => handleTasksInputChange(e, index)}
                    value={step.data.dc_guild_id}
                    name="dc_guild_id"
                    label="Guild ID"
                    placeholder="Discord ID"
                  />
                  <TextInput
                    onChange={(e) => handleTasksInputChange(e, index)}
                    value={step.data.dc_invite_link}
                    name="dc_invite_link"
                    label="Discord invite link"
                    placeholder="Invite Link"
                  />
                </div>
              ) : step.type === "TwitterFw" ? (
                <div className="flex flex-col gap-8 pt-8">
                  <TextInput
                    onChange={(e) => handleTasksInputChange(e, index)}
                    value={step.data.twfw_name}
                    name="twfw_name"
                    label="Name"
                    placeholder="Name"
                  />
                  <TextInput
                    onChange={(e) => handleTasksInputChange(e, index)}
                    value={step.data.twfw_desc}
                    name="twfw_desc"
                    label="Description"
                    placeholder="Description"
                    multiline={4}
                  />
                  <TextInput
                    onChange={(e) => handleTasksInputChange(e, index)}
                    value={step.data.twfw_username}
                    name="twfw_username"
                    label="Twitter Username"
                    placeholder="Username"
                  />
                </div>
              ) : step?.type === "Domain" ? (
                <div className="flex flex-col gap-8 pt-8">
                  <TextInput
                    onChange={(e) => handleTasksInputChange(e, index)}
                    value={step.data.domain_name}
                    name="domain_name"
                    label="Name"
                    placeholder="Name"
                  />
                  <TextInput
                    onChange={(e) => handleTasksInputChange(e, index)}
                    value={step.data.domain_desc}
                    name="domain_desc"
                    label="Description"
                    placeholder="Description"
                    multiline={4}
                  />
                </div>
              ) : step.type === "TwitterRw" ? (
                <div className="flex flex-col gap-8 pt-8">
                  <TextInput
                    onChange={(e) => handleTasksInputChange(e, index)}
                    value={step.data.twrw_name}
                    name="twrw_name"
                    label="Name"
                    placeholder="Name"
                  />
                  <TextInput
                    onChange={(e) => handleTasksInputChange(e, index)}
                    value={step.data.twrw_desc}
                    name="twrw_desc"
                    label="Description"
                    placeholder="Description"
                    multiline={4}
                  />
                  <TextInput
                    onChange={(e) => handleTasksInputChange(e, index)}
                    value={step.data.twrw_post_link}
                    name="twrw_post_link"
                    label="Post URL"
                    placeholder="Post URL"
                  />
                </div>
              ) : step.type === "Custom" ? (
                <div className="flex flex-col gap-8 pt-2">
                  <TextInput
                    onChange={(e) => handleTasksInputChange(e, index)}
                    value={step.data.custom_name}
                    name="custom_name"
                    label="Name"
                    placeholder="Name"
                  />
                  <TextInput
                    onChange={(e) => handleTasksInputChange(e, index)}
                    value={step.data.custom_desc}
                    name="custom_desc"
                    label="Description"
                    placeholder="Description"
                    multiline={4}
                  />
                  <TextInput
                    onChange={(e) => handleTasksInputChange(e, index)}
                    value={step.data.custom_href}
                    name="custom_href"
                    label="API Endpoint"
                    placeholder="API Endpoint"
                  />
                  <TextInput
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
          {steps.length > 1 ? (
            <div className="w-full items-center justify-center flex">
              <div className="w-fit">
                <Button
                  loading={buttonLoading}
                  onClick={async () => {
                    await handleCreateTask();
                  }}
                  disabled={isButtonDisabled}
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
            quest={finalQuestData}
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            setShowDomainPopup={() => {}}
            hasRootDomain={false}
            rewardButtonTitle={finalQuestData.disabled ? "Enable" : "Disable"}
            onRewardButtonClick={async () => {
              await handlePublishQuest(!finalQuestData.disabled);
            }}
            overrideDisabledState={false}
          />
        </>
      ) : null}
    </div>
  );
}