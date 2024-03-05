"use client";

import React, { useCallback, useEffect, useState } from "react";
import styles from "@styles/questboost.module.css";
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
import { getQuestActivityData, getQuestById } from "@services/apiService";
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
          count: data.count,
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

  useEffect(() => {
    fetchQuestData();
    fetchGraphData();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.backButton}>
        <BackButton onClick={() => router.back()} />
      </div>
      <h1 className={styles.title}>{questData.name}</h1>
      <div className=" w-full flex h-full justify-center items-center">
        <ResponsiveContainer width="80%" height={400}>
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
              interval={"preserveStartEnd"}
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
              dataKey="count"
              stroke="#8884d8"
              fill="#8884d8"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
