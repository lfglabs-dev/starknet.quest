"use client";

import React, { useCallback, useEffect, useState } from "react";
import styles from "@styles/admin.module.css";
import { useRouter } from "next/navigation";
import { AdminService } from "@services/authService";
import ProgressBar from "@components/quiz/progressBar";
import InputCard from "@components/admin/InputCard";
import {
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
  TextField,
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "@components/UI/button";
import { TOKEN_ADDRESS_MAP, TOKEN_DECIMAL_MAP } from "@constants/common";
import { getCurrentNetwork } from "@utils/network";

const CATEGORY_OPTIONS = [
  "Defi",
  "Dapps",
  "NFTs",
  "Gaming",
  "Starknet Pro Score by Braavos",
];

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

type QuestInput = typeof questDefaultInput;

export default function Page() {
  const network = getCurrentNetwork();
  console.log(network);
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [questInput, setQuestInput] = useState<QuestInput>(questDefaultInput);
  const [headingText, setHeadingText] = useState("Set up");
  const [showBoost, setShowBoost] = useState(false);
  const [boostInput, setBoostInput] = useState(boostDefaultInput);

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
      setHeadingText("Set up rewards");
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
              <TextField
                required
                fullWidth
                sx={{ backgroundColor: "#1F1F25", borderRadius: "8px" }}
                onChange={handleQuestInputChange}
                value={questInput.name}
                name="name"
                focused
                label="Title"
                variant="filled"
              />
              <TextField
                required
                fullWidth
                sx={{ backgroundColor: "#1F1F25", borderRadius: "8px" }}
                onChange={handleQuestInputChange}
                value={questInput.desc}
                name="desc"
                focused
                label="Description"
                variant="filled"
              />
              <div className="w-full flex justify-between">
                <div className="flex-1">
                  <DatePicker
                    showIcon
                    selected={questInput.start_time}
                    onChange={(date) =>
                      setQuestInput((prev) => ({ ...prev, start_time: date }))
                    }
                  />
                </div>
                <div className="flex-1">
                  <DatePicker
                    showIcon
                    selected={questInput.start_time}
                    onChange={(date) =>
                      setQuestInput((prev) => ({ ...prev, start_time: date }))
                    }
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

          <Button onClick={() => handlePagination("Next")}>
            <p>Confirm Next</p>
          </Button>
        </>
      ) : currentPage === 2 ? (
        <>
          <InputCard>
            <div className="flex flex-col gap-8 w-full">
              <p className={styles.cardHeading}>{headingText}</p>
              <TextField
                required
                fullWidth
                sx={{ backgroundColor: "#1F1F25", borderRadius: "8px" }}
                onChange={handleQuestInputChange}
                value={questInput.rewards_nfts}
                name="Rewards Title"
                focused
                label="NFT Name"
                variant="filled"
              />
              <TextField
                required
                fullWidth
                sx={{ backgroundColor: "#1F1F25", borderRadius: "8px" }}
                onChange={handleQuestInputChange}
                value={questInput.rewards_nfts}
                name="NFT Name"
                focused
                label="NFT Name"
                variant="filled"
              />
              <TextField
                required
                fullWidth
                sx={{ backgroundColor: "#1F1F25", borderRadius: "8px" }}
                onChange={handleQuestInputChange}
                value={questInput.nft_image}
                name="NFT Image path"
                focused
                label="NFT Image path"
                variant="filled"
              />
              <TextField
                required
                fullWidth
                sx={{ backgroundColor: "#1F1F25", borderRadius: "8px" }}
                onChange={handleQuestInputChange}
                value={questInput.logo}
                name="Issuer Logo Path"
                focused
                label="Issuer Logo Path"
                variant="filled"
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
                <TextField
                  required
                  fullWidth
                  sx={{ backgroundColor: "#1F1F25", borderRadius: "8px" }}
                  onChange={handleBoostInputChange}
                  value={boostInput.num_of_winners}
                  name="num_of_winners"
                  focused
                  label="Number of winners"
                  variant="filled"
                />
                <Select
                  fullWidth
                  sx={{ backgroundColor: "#1F1F25", borderRadius: "8px" }}
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
                <TextField
                  required
                  fullWidth
                  sx={{ backgroundColor: "#1F1F25", borderRadius: "8px" }}
                  onChange={handleBoostInputChange}
                  value={boostInput.amount}
                  name="amount"
                  focused
                  label="Amount"
                  variant="filled"
                />
              </div>
            ) : null}
          </InputCard>

          <Button onClick={() => handlePagination("Next")}>
            <p>Confirm Next</p>
          </Button>
        </>
      ) : currentPage === 3 ? (
        <></>
      ) : null}
    </div>
  );
}
