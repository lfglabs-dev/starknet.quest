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
  getQuestById,
} from "@services/apiService";
import { getMonthName } from "@utils/stringService";
import {
  QuestDocument,
  QuestParticipation,
  QuestParticipantsDocument,
} from "../../../types/backTypes";
import { numberWithCommas } from "@utils/numberService";
import { CDNImg } from "@components/cdn/image";
import { useMediaQuery } from "@mui/material";
import { QuestDefault } from "@constants/common";
import Typography from "@components/UI/typography/typography";
import { TEXT_TYPE } from "@constants/typography";
import {
  QuestHeaderSkeleton,
  MetricCardSkeleton,
  GraphSkeleton,
  TasksSkeleton,
} from "@components/skeletons/allAnalysticQuestSkeleton";

type BoostQuestPageProps = {
  params: {
    questId: string;
  };
};

export default function Page({ params }: BoostQuestPageProps) {
  const router = useRouter();

  const { questId } = params;

  const [isQuestLoading, setIsQuestLoading] = useState<boolean>(true);
  const [isGraphLoading, setIsGraphLoading] = useState<boolean>(true);
  const [isParticipationLoading, setIsParticipationLoading] =
    useState<boolean>(true);
  const [isParticipantsLoading, setIsParticipantsLoading] =
    useState<boolean>(true);
  const [isVisitorsLoading, setIsVisitorsLoading] = useState<boolean>(true);

  const [graphData, setGraphData] = useState<
    { _id: string; participants: number }[]
  >([]);
  const [questParticipationData, setQuestParticipationData] =
    useState<QuestParticipation>();
  const [questParticipants, setQuestParticipants] = useState(0);
  const [uniqueVisitors, setUniqueVisitors] = useState<number | undefined>(0);
  const isMobile = useMediaQuery("(max-width:768px)");
  const [questData, setQuestData] = useState<QuestDocument>(QuestDefault);

  const fetchGraphData = useCallback(async () => {
    setIsGraphLoading(true);
    try {
      const res = await getQuestActivityData(parseInt(questId));
      if (!res) return [];
      const formattedData = res?.map(
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
      return formattedData;
    } catch (error) {
      console.log("Error while fetching graph data", error);
      return [];
    } finally {
      setIsGraphLoading(false);
    }
  }, [questId]);

  const fetchQuestById = useCallback(async () => {
    setIsQuestLoading(true);
    try {
      const res = await getQuestById(questId);
      if (!res || "error" in res) {
        return QuestDefault;
      } else {
        return res;
      }
    } catch (error) {
      console.log("Error while fetching quest data", error);
      return QuestDefault;
    } finally {
      setIsQuestLoading(false);
    }
  }, [questId]);

  const fetchQuestParticipation = useCallback(async () => {
    setIsParticipationLoading(true);
    try {
      const res = await getQuestsParticipation(parseInt(questId));
      return res;
    } catch (error) {
      console.log("Error while fetching quest data", error);
      return undefined;
    } finally {
      setIsParticipationLoading(false);
    }
  }, [questId]);

  const fetchQuestParticipants = useCallback(async () => {
    setIsParticipantsLoading(true);
    try {
      const res = (await getQuestParticipants(
        parseInt(questId)
      )) as QuestParticipantsDocument;
      return Number(res.count);
    } catch (error) {
      console.log("Error while fetching quest data", error);
      return 0;
    } finally {
      setIsParticipantsLoading(false);
    }
  }, [questId]);

  const fetchUniqueVisitorCount = useCallback(async () => {
    setIsVisitorsLoading(true);
    try {
      const res = await getUniqueVisitorCount(parseInt(questId));
      return res;
    } catch (error) {
      console.log("Error while fetching unique visitor count", error);
      return undefined;
    } finally {
      setIsVisitorsLoading(false);
    }
  }, [questId]);

  const computePercentage = useCallback(
    (num: number) => {
      if (uniqueVisitors === 0 || uniqueVisitors === undefined) return "NA";
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

  const fetchAllData = useCallback(async () => {
    const [quest, graph, participation, participants, visitors] =
      await Promise.all([
        fetchQuestById(),
        fetchGraphData(),
        fetchQuestParticipation(),
        fetchQuestParticipants(),
        fetchUniqueVisitorCount(),
      ]);

    setQuestData(quest);
    setGraphData(graph);
    setQuestParticipationData(participation);
    setQuestParticipants(participants);
    setUniqueVisitors(visitors);
  }, [
    fetchQuestById,
    fetchGraphData,
    fetchQuestParticipation,
    fetchQuestParticipants,
    fetchUniqueVisitorCount,
  ]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return (
    <div className={analyticsStyles.container}>
      <div className={styles.backButton}>
        <BackButton onClick={() => router.back()} />
      </div>
      <div className="flex flex-col items-center justify-center mb-16">
        {isQuestLoading ? (
          <QuestHeaderSkeleton />
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 mb-16">
            {questData ? (
              <>
                <div>
                  <div className={analyticsStyles.tag}>
                    <CDNImg width={20} src={questData?.logo} />
                    <Typography type={TEXT_TYPE.BODY_DEFAULT} color="white">
                      {questData?.issuer}
                    </Typography>
                  </div>
                </div>
                <Typography
                  type={TEXT_TYPE.H1}
                  className={`${analyticsStyles.title}`}
                  color="transparent"
                >
                  {questData?.name}
                </Typography>
                <Typography type={TEXT_TYPE.BODY_DEFAULT} color="white">
                  {questData?.expired ? "Finished" : "Ongoing"}
                </Typography>
              </>
            ) : null}
          </div>
        )}

        <div className="w-full flex max-w-[950px]">
          <div className="flex flex-col w-full gap-8 sm:flex-row">
            {isVisitorsLoading ? (
              <MetricCardSkeleton />
            ) : (
              <div className={analyticsStyles.dataCard}>
                <div className="flex flex-col items-center justify-center w-full h-full">
                  <Typography
                    type={TEXT_TYPE.BODY_SMALL}
                    color="textGray"
                    className={analyticsStyles.metricName}
                  >
                    Unique users
                  </Typography>
                  <Typography
                    type={TEXT_TYPE.BODY_NORMAL}
                    className={analyticsStyles.counterText}
                  >
                    {uniqueVisitors && uniqueVisitors > 0
                      ? numberWithCommas(uniqueVisitors)
                      : "NA"}
                  </Typography>
                </div>
              </div>
            )}

            {isParticipantsLoading ? (
              <MetricCardSkeleton />
            ) : (
              <div className={analyticsStyles.dataCard}>
                <Typography
                  type={TEXT_TYPE.BODY_SMALL}
                  color="textGray"
                  className={analyticsStyles.metricName}
                >
                  Users that finished the quest
                </Typography>
                <Typography
                  type={TEXT_TYPE.BODY_NORMAL}
                  className={analyticsStyles.counterText}
                >
                  {questParticipants > 0
                    ? numberWithCommas(questParticipants)
                    : "NA"}
                </Typography>
                {uniqueVisitors && uniqueVisitors > 0 ? (
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className={analyticsStyles.highlightedText}>
                      {uniqueVisitors > 0
                        ? `${computePercentage(questParticipants)}%`
                        : "NA"}
                    </span>
                    <span className={analyticsStyles.normalText}>
                      of unique users
                    </span>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center mb-16">
        {isGraphLoading ? (
          <GraphSkeleton isMobile={isMobile} />
        ) : (
          <div className={`${analyticsStyles.dataCard} max-w-[950px]`}>
            {graphData?.length > 0 ? (
              <>
                <div className="flex flex-col w-full gap-1 mb-6">
                  <Typography
                    type={TEXT_TYPE.BODY_SMALL}
                    color="textGray"
                    className={analyticsStyles.metricName}
                  >
                    User Progress Visualization
                  </Typography>
                  <Typography
                    type={TEXT_TYPE.BODY_NORMAL}
                    className={analyticsStyles.counterText}
                  >
                    Quests Completion over time
                  </Typography>
                </div>
                <ResponsiveContainer width="100%" height={isMobile ? 200 : 300}>
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
                      <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
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
                      tickFormatter={(value) => formatYAxis(value)}
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
                className="flex items-center justify-center w-full"
                style={{
                  // we need to dynamically change graph height
                  height: isMobile ? "200px" : "300px",
                }}
              >
                <Typography
                  type={TEXT_TYPE.BODY_NORMAL}
                  className={analyticsStyles.counterText}
                >
                  NA
                </Typography>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-center">
        {isParticipationLoading ? (
          <TasksSkeleton />
        ) : (
          <div className={analyticsStyles.tasksContainer}>
            <div className="flex flex-col w-full gap-1">
              <Typography
                type={TEXT_TYPE.BODY_SMALL}
                color="textGray"
                className={analyticsStyles.metricName}
              >
                People who completed
              </Typography>
              <Typography
                type={TEXT_TYPE.BODY_NORMAL}
                className={analyticsStyles.counterText}
              >
                Tasks
              </Typography>
            </div>

            <div className="flex flex-wrap justify-center w-full gap-6">
              {questParticipationData && questParticipationData?.length > 0 ? (
                questParticipationData?.map(
                  (eachParticipation, index: number) => (
                    <div
                      key={index}
                      className="flex w-full max-w-none sm:max-w-[245px]"
                    >
                      <div className={analyticsStyles.dataCard}>
                        <Typography
                          type={TEXT_TYPE.BODY_SMALL}
                          color="textGray"
                          className={analyticsStyles.metricName}
                        >
                          {eachParticipation.name}
                        </Typography>
                        <Typography
                          type={TEXT_TYPE.BODY_NORMAL}
                          className={analyticsStyles.counterText}
                        >
                          {numberWithCommas(eachParticipation.count)}
                        </Typography>
                        {uniqueVisitors && uniqueVisitors > 0 ? (
                          <div className="flex flex-wrap items-baseline gap-2">
                            <span className={analyticsStyles.highlightedText}>
                              {uniqueVisitors > 0
                                ? `${computePercentage(
                                    eachParticipation.count
                                  )}%`
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
                  className="flex items-center justify-center w-full"
                  style={{
                    height: isMobile ? "200px" : "300px",
                  }}
                >
                  <Typography
                    type={TEXT_TYPE.BODY_NORMAL}
                    className={analyticsStyles.counterText}
                  >
                    NA
                  </Typography>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
