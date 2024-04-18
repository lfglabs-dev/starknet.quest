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
  CartesianGrid,
} from "recharts";
import {
  getQuestActivityData,
  getQuestParticipants,
  getQuestsParticipation,
  getUniqueVisitorCount,
  getQuestById
} from "@services/apiService";
import { getMonthName } from "@utils/stringService";
import { QuestDocument } from "../../../types/backTypes";
import { numberWithCommas } from "@utils/numberService";
import { CDNImg } from "@components/cdn/image";
import { useMediaQuery } from "@mui/material";
import AnalyticsSkeleton from "@components/skeletons/analyticsSkeleton";
import { QuestDefault } from "@constants/common";


type BoostQuestPageProps = {
  params: {
    questId: string;
  };
};

export default function Page({ params }: BoostQuestPageProps) {
  const router = useRouter();

  const { questId } = params;
  const [loading, setLoading] = useState<boolean>(true);
  const [graphData, setGraphData] = useState([]);
  const [questParticipationData, setQuestParticipationData] = useState([]);
  const [questParticipants, setQuestParticipants] = useState(0);
  const [uniqueVisitors, setUniqueVisitors] = useState(0);
  const isMobile = useMediaQuery("(max-width:768px)");
  const [questData, setQuestData] = useState<QuestDocument>(QuestDefault);

  const fetchGraphData = useCallback(async () => {
    try {
      const res = await getQuestActivityData(parseInt(questId));
      const formattedData = res.map(
        (data: { date: string; participants: number }) => {
          const dateString = data.date.split(" ")[0];
          const month = getMonthName(parseInt(dateString.split("-")[1]));
          const day = dateString.split("-")[2];
          return {
            _id: day + " " + month,
            participants: data.participants,
          };
        }
      );
      setGraphData(formattedData);
    } catch (error) {
      console.log("Error while fetching graph data", error);
    }
  }, []);

  const fetchQuestById = useCallback(async () => {
    try {
      const res = await getQuestById(questId);
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

  const fetchUniqueVisitorCount = useCallback(async () => {
    try {
      const res = await getUniqueVisitorCount(parseInt(questId));
      setUniqueVisitors(res);
    } catch (error) {
      console.log("Error while fetching unique visitor count", error);
    }
  }, []);

  const computePercentage = useCallback(
    (num: number) => {
      if (uniqueVisitors === 0) return "NA";
      return ((num / uniqueVisitors) * 100).toFixed(2);
    },
    [uniqueVisitors]
  );

  const formatYAxis = useCallback((tickItem: string) => {
    const num = parseInt(tickItem);
    if (num > 1000) {
      return num / 1000 + "k";
    }
    return tickItem;
  }, []);

  const fetchPageData = useCallback(async () => {
    setLoading(true);
    await fetchQuestById();
    await fetchGraphData();
    await fetchQuestParticipation();
    await fetchQuestParticipants();
    await fetchUniqueVisitorCount();
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPageData();
  }, []);

  return (
    <div className={analyticsStyles.container}>
      <div className={styles.backButton}>
        <BackButton onClick={() => router.back()} />
      </div>

      {loading ? (
        <div className="w-full flex justify-center items-center ">
          <div className="w-full flex flex-col max-w-[950px]">
            <AnalyticsSkeleton />
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col justify-center items-center mb-16">
            <div className="flex flex-col justify-center items-center mb-16 gap-4">
              {questData ? (
                <>
                  <div>
                    <div className={analyticsStyles.tag}>
                      <CDNImg width={20} src={questData?.logo} />
                      <p className="text-white">{questData?.issuer}</p>
                    </div>
                  </div>
                  <h1 className={`${analyticsStyles.title}`}>
                    {questData?.name}
                  </h1>
                  <p className="text-white">
                    {questData?.expired ? "Finished" : "Ongoing"}
                  </p>
                </>
              ) : null}
            </div>
            <div className="w-full flex max-w-[950px]">
              <div className="flex flex-col sm:flex-row gap-8 w-full">
                <div className={analyticsStyles.dataCard}>
                  <div className="flex w-full items-center flex-col h-full justify-center">
                    <p className={analyticsStyles.metricName}>Unique users</p>
                    <p className={analyticsStyles.counterText}>
                      {uniqueVisitors > 0
                        ? numberWithCommas(uniqueVisitors)
                        : "NA"}
                    </p>
                  </div>
                </div>
                <div className={analyticsStyles.dataCard}>
                  <p className={analyticsStyles.metricName}>
                    Users that finished the quest
                  </p>
                  <p className={analyticsStyles.counterText}>
                    {questParticipants > 0
                      ? numberWithCommas(questParticipants)
                      : "NA"}
                  </p>
                  {uniqueVisitors > 0 ? (
                    <div className="flex flex-wrap gap-2 items-baseline">
                      <span className={analyticsStyles.highlightedText}>
                        {uniqueVisitors > 0
                          ? computePercentage(questParticipants)
                          : "NA"}
                      </span>
                      <span className={analyticsStyles.normalText}>
                        of unique users
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mb-16">
            <div className={`${analyticsStyles.dataCard} max-w-[950px]`}>
              {graphData?.length > 0 ? (
                <>
                  <div className="flex flex-col gap-1 w-full mb-6">
                    <p className={analyticsStyles.metricName}>
                      User Progress Visualization
                    </p>
                    <p className={analyticsStyles.counterText}>
                      Tasks Completion Over Time
                    </p>
                  </div>
                  <ResponsiveContainer
                    width="100%"
                    height={isMobile ? 200 : 300}
                  >
                    <AreaChart
                      width={500}
                      height={300}
                      data={graphData}
                      margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <defs>
                        <linearGradient
                          id="colorPv"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="50%"
                            stopColor="#6AFFAF"
                            stopOpacity={1}
                          />
                          <stop
                            offset="95%"
                            stopColor="#5CE3FE"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis
                        interval={"preserveEnd"}
                        type="category"
                        dataKey="_id"
                        allowDuplicatedCategory={false}
                        tickMargin={10}
                        minTickGap={50}
                      />
                      <YAxis
                        axisLine={false}
                        tickFormatter={(value, _) => formatYAxis(value)}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "black",
                          borderRadius: "10px",
                          opacity: 0.8,
                          borderColor: "grey",
                        }}
                        itemStyle={{ textTransform: "capitalize" }}
                      />
                      <Area
                        type="monotone"
                        dataKey="participants"
                        stroke="#6AFFAF"
                        fill="url(#colorPv)"
                        strokeWidth={2}
                        connectNulls={true}
                      />
                      <CartesianGrid
                        vertical={false}
                        strokeDasharray="5 5"
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </>
              ) : (
                <div
                  className="w-full flex justify-center items-center"
                  style={{
                    // we need to dynamically change graph height
                    height: isMobile ? "200px" : "300px",
                  }}
                >
                  <p className={analyticsStyles.counterText}>NA</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center">
            <div className={analyticsStyles.tasksContainer}>
              <div className="flex flex-col gap-1 w-full">
                <p className={analyticsStyles.metricName}>
                  People who completed
                </p>
                <p className={analyticsStyles.counterText}>Tasks</p>
              </div>

              <div className="flex flex-wrap justify-center gap-6 w-full">
                {questParticipationData?.length > 0 ? (
                  questParticipationData?.map(
                    (
                      eachParticipation: {
                        name: string;
                        desc: string;
                        count: number;
                      },
                      index: number
                    ) => (
                      <div
                        key={index}
                        className="flex w-full max-w-none sm:max-w-[245px]"
                      >
                        <div className={analyticsStyles.dataCard}>
                          <p className={analyticsStyles.metricName}>
                            {eachParticipation.name}
                          </p>
                          <p className={analyticsStyles.counterText}>
                            {numberWithCommas(eachParticipation.count)}
                          </p>
                          {uniqueVisitors > 0 ? (
                            <div className="flex flex-wrap gap-2 items-baseline">
                              <span className={analyticsStyles.highlightedText}>
                                {uniqueVisitors > 0
                                  ? computePercentage(
                                      eachParticipation.count
                                    )
                                  : "NA"}
                              </span>
                              <span className={analyticsStyles.normalText}>
                                of unique users
                              </span>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    )
                  )
                ) : (
                  <div
                    className="w-full flex justify-center items-center"
                    style={{
                      height: isMobile ? "200px" : "300px",
                    }}
                  >
                    <p className={analyticsStyles.counterText}>NA</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
