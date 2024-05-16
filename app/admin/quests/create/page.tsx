"use client";

import React, { useCallback, useEffect, useState } from "react";
import styles from "@styles/admin.module.css";
import { useRouter } from "next/navigation";
import { AdminService } from "@services/authService";
import ProgressBar from "@components/quiz/progressBar";
import InputCard from "@components/admin/InputCard";
import { MenuItem, Select, SelectChangeEvent, Switch } from "@mui/material";
import "react-datepicker/dist/react-datepicker.css";
import Button from "@components/UI/button";
import { TOKEN_ADDRESS_MAP, TOKEN_DECIMAL_MAP } from "@constants/common";
import { getCurrentNetwork } from "@utils/network";
import Textinput from "@components/admin/Textinput";
import Dateinput from "@components/admin/DateInput";

const CATEGORY_OPTIONS = [
  "Defi",
  "Dapps",
  "NFTs",
  "Gaming",
  "Starknet Pro Score by Braavos",
];

const TASK_OPTIONS = ["Quiz", "Twitter", "Discord", "Custom"];

const TWITTER_OPTIONS = ["Follow on Twitter", "Retweet on Twitter"];

const NUMBER_OF_QUESTIONS = 3;

const questDefaultInput = {
  name: "",
  desc: "",
  category: "Defi",
  logo: "",
  rewards_title: "loading",
  rewards_nfts: "",
  nft_image: "",
  disabled: false,
  start_time: parseInt(Date.now().toString()),
  expiry: null,
};

const boostDefaultInput = {
  amount: 0,
  token: TOKEN_ADDRESS_MAP[getCurrentNetwork()].USDC,
  num_of_winners: 0,
  token_decimals: TOKEN_DECIMAL_MAP.USDC,
  expiry: 0,
  name: "",
  img_url: "",
  quest_id: 0,
};

const QuizQuestionDefaultInput = {
  question: "",
  options: ["", "", "", ""],
  correct_option: "",
};

const QuizDefaultInput = {
  help_url: "",
  cta: "",
  questions: [QuizQuestionDefaultInput],
};

const TwitterFwInput = {
  title: "",
  description: "",
  username: "",
};

const TwitterRwInput = {
  title: "",
  description: "",
  post_url: "",
};

const DiscordInput = {
  title: "",
  description: "",
  discord_id: "",
};

const CustomInput = {
  title: "",
  description: "",
  url: "",
  endpoint: "",
};

type QuestInput = typeof questDefaultInput;
type TaskType = "Quiz" | "Twitter" | "Discord" | "Custom";
type TwitterTaskType = "Follow on Twitter" | "Retweet on Twitter";

export default function Page() {
  const network = getCurrentNetwork();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [questInput, setQuestInput] = useState<QuestInput>(questDefaultInput);
  const [headingText, setHeadingText] = useState("Set up");
  const [showBoost, setShowBoost] = useState(false);
  const [boostInput, setBoostInput] = useState(boostDefaultInput);
  const [steps, setSteps] = useState([]);
  const [numberOfSteps, setNumberOfSteps] = useState(1);
  const [currentTaskType, setCurrentTaskType] = useState<TaskType | "">("");
  const [currentTwitterTaskType, setCurrentTwitterTaskType] =
    useState<TwitterTaskType>("Follow on Twitter");

  const [quiz, setQuiz] = useState(QuizDefaultInput);
  const [twitterfw, setTwitterFw] = useState(TwitterFwInput);
  const [twitterRw, setTwitterRw] = useState(TwitterRwInput);
  const [discord, setDiscord] = useState(DiscordInput);
  const [custom, setCustom] = useState(CustomInput);

  const handleCreateQuest = useCallback(async () => {
    try {
      const response = await AdminService.createQuest(questInput);
      router.push("/admin/quests");
    } catch (error) {
      console.log("Error while creating quest", error);
    }
  }, [questInput]);

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
                onChange={handleQuestInputChange}
                value={questInput.name}
                name="name"
                label="Quest Name"
                placeholder="Quest Name"
              />
              <Textinput
                onChange={handleQuestInputChange}
                value={questInput.desc}
                name="desc"
                label="Description"
                placeholder="Quest Description"
                multiline={4}
              />
              <div className="w-full flex justify-between gap-4">
                <div className="flex-1 w-full">
                  <Dateinput
                    onChange={(e) => {
                      setQuestInput((prev) => ({
                        ...prev,
                        start_time: parseInt(e.target.value),
                      }));
                    }}
                    value={questInput.start_time.toString()}
                    label="Start Date"
                    placeholder="Start Date"
                    name="start_time"
                  />
                </div>
                <div className="flex-1 w-full">
                  <Dateinput
                    onChange={(e) => {
                      setQuestInput((prev) => ({
                        ...prev,
                        start_time: parseInt(e.target.value),
                      }));
                    }}
                    value={questInput.start_time.toString()}
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
                onChange={handleQuestInputChange}
                value={questInput.rewards_nfts}
                name="rewards_nfts"
                label="NFT Name"
                placeholder="NFT Name"
              />
              <Textinput
                onChange={handleQuestInputChange}
                value={questInput.nft_image}
                name="nft_image"
                label="NFT Image Path"
                placeholder="NFT Image Path"
              />
              <Textinput
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
                <Textinput
                  onChange={handleBoostInputChange}
                  value={boostInput.num_of_winners}
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
                  value={boostInput.token}
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
              <Button onClick={() => handlePagination("Next")}>
                <p>Confirm Next</p>
              </Button>
            </div>
          </div>
        </>
      ) : currentPage === 3 ? (
        <div className="flex flex-col gap-8 w-full">
          <p className={styles.cardHeading}>{headingText}</p>
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col gap-8">
              <div>hey</div>
            </div>
          ))}

          <InputCard>
            <div className="flex gap-8">
              <div className="flex flex-row w-full gap-2 bg-gray-300 p-2 rounded-xl">
                {TASK_OPTIONS.map((category) => (
                  <div
                    onClick={() => {
                      setCurrentTaskType(category as TaskType);
                    }}
                    key={category}
                    className="py-3 px-5 rounded-xl w-fit"
                    style={{
                      cursor: "pointer",
                      backgroundColor:
                        currentTaskType === category ? "#ffffff" : "#29282B",
                      color:
                        currentTaskType === category ? "#29282B" : "#ffffff",
                    }}
                  >
                    <p className={styles.tagText}>{category}</p>
                  </div>
                ))}
              </div>
            </div>
            {currentTaskType === "Quiz" ? (
              <div className="flex flex-col gap-8 pt-2">
                <Textinput
                  onChange={handleQuestInputChange}
                  value={questInput.rewards_nfts}
                  name="rewards_nfts"
                  label="Quiz Name"
                  placeholder="Quiz Name"
                />
                <Textinput
                  onChange={handleQuestInputChange}
                  value={questInput.nft_image}
                  name="nft_image"
                  label="Quiz Description"
                  placeholder="Quiz Description"
                />
                <Textinput
                  onChange={handleQuestInputChange}
                  value={questInput.logo}
                  name="logo"
                  label="Call To Action"
                  placeholder="Call To Action"
                />
                <Textinput
                  onChange={handleQuestInputChange}
                  value={questInput.logo}
                  name="logo"
                  label="Help URL"
                  placeholder="Help URL"
                />
                {new Array(NUMBER_OF_QUESTIONS).fill(0).map((_, index) => (
                  <div key={index} className="flex flex-col gap-8">
                    {quiz.questions.map((eachQuestion) => (
                      <>
                        <Textinput
                          onChange={handleQuestInputChange}
                          value={eachQuestion.question}
                          name="question"
                          label={`Question ${index + 1}`}
                          placeholder={`Question ${index + 1}`}
                        />
                        {eachQuestion.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className="flex flex-row gap-4 justify-between w-full items-center"
                          >
                            <div className="w-full">
                              <Textinput
                                onChange={handleQuestInputChange}
                                value={option}
                                name="option"
                                label={`Option ${optionIndex + 1}`}
                                placeholder={`Option ${optionIndex + 1}`}
                              />
                            </div>
                            <div className="flex flex-row gap-4 items-center justify-center">
                              <input
                                className="w-6 h-6 rounded-full"
                                type="radio"
                                name="correct_option"
                                value={option}
                              />
                            </div>
                          </div>
                        ))}
                      </>
                    ))}
                  </div>
                ))}
              </div>
            ) : currentTaskType === "Discord" ? (
              <div className="flex flex-col gap-8 pt-2">
                <Textinput
                  onChange={handleQuestInputChange}
                  value={discord.title}
                  name="title"
                  label="Name"
                  placeholder="Name"
                />
                <Textinput
                  onChange={handleQuestInputChange}
                  value={discord.description}
                  name="description"
                  label="Description"
                  placeholder="Description"
                  multiline={4}
                />
                <Textinput
                  onChange={handleQuestInputChange}
                  value={discord.discord_id}
                  name="discord_id"
                  label="ID"
                  placeholder="Discord ID"
                />
              </div>
            ) : currentTaskType === "Twitter" ? (
              <div className="flex flex-col gap-8 pt-8">
                <div className="flex flex-row w-full gap-2 bg-gray-300 p-2 rounded-xl">
                  {TWITTER_OPTIONS.map((category) => (
                    <div
                      onClick={() => {
                        setCurrentTwitterTaskType(category as TwitterTaskType);
                      }}
                      key={category}
                      className="py-3 px-5 rounded-xl w-fit"
                      style={{
                        cursor: "pointer",
                        backgroundColor:
                          currentTwitterTaskType === category
                            ? "#ffffff"
                            : "#29282B",
                        color:
                          currentTwitterTaskType === category
                            ? "#29282B"
                            : "#ffffff",
                      }}
                    >
                      <p className={styles.tagText}>{category}</p>
                    </div>
                  ))}
                </div>
                {currentTwitterTaskType === "Follow on Twitter" ? (
                  <>
                    <Textinput
                      onChange={handleQuestInputChange}
                      value={discord.title}
                      name="title"
                      label="Name"
                      placeholder="Name"
                    />
                    <Textinput
                      onChange={handleQuestInputChange}
                      value={discord.description}
                      name="description"
                      label="Description"
                      placeholder="Description"
                      multiline={4}
                    />
                    <Textinput
                      onChange={handleQuestInputChange}
                      value={discord.discord_id}
                      name="discord_id"
                      label="ID"
                      placeholder="Username"
                    />
                  </>
                ) : currentTwitterTaskType === "Retweet on Twitter" ? (
                  <>
                    <Textinput
                      onChange={handleQuestInputChange}
                      value={discord.title}
                      name="title"
                      label="Name"
                      placeholder="Name"
                    />
                    <Textinput
                      onChange={handleQuestInputChange}
                      value={discord.description}
                      name="description"
                      label="Description"
                      placeholder="Description"
                      multiline={4}
                    />
                    <Textinput
                      onChange={handleQuestInputChange}
                      value={discord.discord_id}
                      name="discord_id"
                      label="Post URL"
                      placeholder="Post URL"
                    />
                  </>
                ) : null}
              </div>
            ) : currentTaskType === "Custom" ? (
              <div className="flex flex-col gap-8 pt-2">
                <Textinput
                  onChange={handleQuestInputChange}
                  value={discord.title}
                  name="title"
                  label="Name"
                  placeholder="Name"
                />
                <Textinput
                  onChange={handleQuestInputChange}
                  value={discord.description}
                  name="description"
                  label="Description"
                  placeholder="Description"
                  multiline={4}
                />
                <Textinput
                  onChange={handleQuestInputChange}
                  value={discord.discord_id}
                  name="discord_id"
                  label="API Endpoint"
                  placeholder="API Endpoint"
                />
                <Textinput
                  onChange={handleQuestInputChange}
                  value={discord.discord_id}
                  name="discord_id"
                  label="URL"
                  placeholder="URL"
                />
              </div>
            ) : null}

            {currentTaskType !== "" ? (
              <div className="w-full items-center justify-center flex">
                <div className="w-fit">
                  <Button onClick={() => setNumberOfSteps((prev) => prev + 1)}>
                    <p>Add Task</p>
                  </Button>
                </div>
              </div>
            ) : null}
          </InputCard>
        </div>
      ) : null}
    </div>
  );
}
