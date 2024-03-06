"use client";

import React, { useCallback, useEffect, useState } from "react";
import styles from "@styles/questboost.module.css";
import analyticsStyles from "@styles/analytics.module.css";
import { useRouter } from "next/navigation";
import BackButton from "@components/UI/backButton";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  getQuestActivityData,
  getQuestById,
  getQuestParticipants,
  getQuestsParticipation,
} from "@services/apiService";
import { getMonthName } from "@utils/stringService";
import { QuestDocument } from "../../../types/backTypes";

type BoostQuestPageProps = {
  params: {
    questId: string;
  };
};

export default function Page({ params }: BoostQuestPageProps) {
  const router = useRouter();

  const { questId } = params;
  const [graphData, setGraphData] = useState([]);
  const [questParticipationData, setQuestParticipationData] = useState([]);
  const [questParticipants, setQuestParticipants] = useState(0);
  const [questData, setQuestData] = useState<QuestDocument>({
    id: 0,
    name: "loading",
    desc: "loading",
    issuer: "loading",
    category: "loading",
    rewards_endpoint: "",
    logo: "",
    rewards_img: "",
    rewards_title: "loading",
    rewards_nfts: [],
    img_card: "",
    title_card: "",
    hidden: false,
    disabled: false,
    expiry_timestamp: "loading",
    mandatory_domain: null,
    expired: false,
    rewards_description: null,
    additional_desc: null,
  });

  const fetchGraphData = useCallback(async () => {
    try {
      const res = await getQuestActivityData(parseInt(questId));
      const formattedData = res.map((data: any) => {
        const dateString = data._id.split(" ")[0];
        const month = getMonthName(parseInt(dateString.split("-")[1]));
        const day = dateString.split("-")[2];
        return {
          _id: day + " " + month,
          participants: data.participants,
        };
      });
      setGraphData(formattedData);
    } catch (error) {
      console.log("Error while fetching graph data", error);
    }
  }, []);

  const fetchQuestData = useCallback(async () => {
    try {
      const res = await getQuestById(parseInt(questId));
      setQuestData(res);
    } catch (error) {
      console.log("Error while fetching quest data", error);
    }
  }, []);

  const fetchQuestParticipation = useCallback(async () => {
    try {
      const res = await getQuestsParticipation(parseInt(questId));
      setQuestParticipationData(res);
    } catch (error) {
      console.log("Error while fetching quest data", error);
    }
  }, []);

  const fetchQuestParticipants = useCallback(async () => {
    try {
      const res = await getQuestParticipants(parseInt(questId));
      setQuestParticipants(res.count);
    } catch (error) {
      console.log("Error while fetching quest data", error);
    }
  }, []);

  useEffect(() => {
    fetchQuestData();
    fetchGraphData();
    fetchQuestParticipation();
    fetchQuestParticipants();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.backButton}>
        <BackButton onClick={() => router.back()} />
      </div>
      <h1 className={`${styles.title} mb-16`}>{questData.name}</h1>
      <div className="flex justify-center mb-16">
        <div className="flex flex-row gap-8 w-full max-w-[950px]">
          <div className={analyticsStyles.dataCard}>
            <div className="flex w-full items-center flex-col h-full justify-center">
              <p className={analyticsStyles.metricName}>Unique users</p>
              <p className={analyticsStyles.counterText}>{questParticipants}</p>
            </div>
          </div>
          <div className={analyticsStyles.dataCard}>
            <p className={analyticsStyles.metricName}>
              Users that finished the quest
            </p>
            <p className={analyticsStyles.counterText}>{questParticipants}</p>
            <div className="flex flex-wrap gap-2 items-baseline">
              <span className={analyticsStyles.highlightedText}>84%</span>
              <span className={analyticsStyles.normalText}>
                of unique users
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mb-16">
        <div className={`${analyticsStyles.dataCard} max-w-[950px]`}>
          <div className="flex flex-col gap-1 w-full mb-6">
            <p className={analyticsStyles.metricName}>
              User Progress Visualization
            </p>
            <p className={analyticsStyles.counterText}>
              Quest Completion Over Time
            </p>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart
              width={500}
              height={400}
              data={graphData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <XAxis
                interval={"preserveEnd"}
                type="category"
                dataKey="_id"
                allowDuplicatedCategory={false}
                tickMargin={10}
                minTickGap={50}
              />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="participants"
                stroke="#6AFFAF"
                fill="#6AFFAF"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="w-full p-8 bg-[#1F1F25] flex flex-col justify-center items-center gap-4 max-w-[950px]">
          <div className="flex flex-col gap-1 w-full">
            <p className={analyticsStyles.metricName}>People who completed</p>
            <p className={analyticsStyles.counterText}>Tasks</p>
          </div>

          <div className="flex flex-wrap gap-6 w-full">
            {questParticipationData.map(
              (eachParticipation: any, index: number) => (
                <div key={index} className="flex w-full max-w-[245px]">
                  <div className={analyticsStyles.dataCard}>
                    <p className={analyticsStyles.metricName}>
                      {eachParticipation.name}
                    </p>
                    <p className={analyticsStyles.counterText}>
                      {eachParticipation.participants}
                    </p>
                    <div className="flex flex-wrap gap-2 items-baseline">
                      <span className={analyticsStyles.highlightedText}></span>
                      <span className={analyticsStyles.normalText}></span>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
