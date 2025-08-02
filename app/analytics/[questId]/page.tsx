"use client";

import React, { useCallback, useEffect, useState } from "react";
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
import { ExpiredIcon } from "@components/UI/iconsComponents/icons/expiredIcon";
import { OngoingIcon } from "@components/UI/iconsComponents/icons/ongoingIcon";
import ProfilPurpleIcon from "@components/UI/iconsComponents/icons/profileIconPurple";
import styles from  "@styles/analytics.module.css";

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
    <div className="px-4 py-4 mt-32 sm:px-6 lg:px-0">
      <div className="mb-6 fixed left-32 hidden lg:flex">
        <BackButton onClick={() => router.back()} />
      </div>

      <div className="flex flex-col items-center justify-center mb-16 text-center">
        {isQuestLoading ? (
          <QuestHeaderSkeleton />
        ) : (
          <>
            <div className="bg-gray-300 flex items-center gap-3 rounded-lg py-2 px-4">
              <CDNImg width={20} src={questData?.logo} />
              <Typography type={TEXT_TYPE.BODY_DEFAULT} color="#F4FAFF">
                {questData?.issuer}
              </Typography>
            </div>

            <Typography
              type={TEXT_TYPE.H1}
              className="text-[#F4FAFF] text-[36px] sm:text-[48px] font-bold"
            >
              {questData?.name}
            </Typography>

            <Typography type={TEXT_TYPE.BODY_DEFAULT} color="white">
              <div className="flex gap-1 justify-center items-center">
                {questData?.expired ? (
                  <>
                    Ongoing <OngoingIcon />
                  </>
                ) : (
                  <>
                    Finished <ExpiredIcon />
                  </>
                )}
              </div>
            </Typography>
          </>
        )}
      </div>

      <div className="max-w-[950px] mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
        <div className={`bg-darkCard border-2 border-transparent shadow-greenGlow rounded-md p-4 flex justify-between items-center ${styles.borderConicGradient}`}>
          <div>
            <Typography type={TEXT_TYPE.BODY_SMALL} color="white50">
              Unique users
            </Typography>
            <Typography
              type={TEXT_TYPE.BODY_NORMAL}
              className="text-lg sm:text-xl2_5 font-bold text-white py-2"
            >
              {typeof uniqueVisitors === "number" && uniqueVisitors > 0
                ? numberWithCommas(uniqueVisitors)
                : "NA"}
            </Typography>
          </div>
          <div className="bg-white10 rounded-full h-14 w-14 flex items-center justify-center">
            <ProfilPurpleIcon />
          </div>
        </div>

        <div className={`bg-darkCard border-2 border-transparent shadow-blueGlow  rounded-md p-4 flex justify-between items-center ${styles.borderConicGradientBlue}`}>
          <div>
            <Typography type={TEXT_TYPE.BODY_SMALL} color="textGray">
              Users that finished the quest
            </Typography>
            <Typography
              type={TEXT_TYPE.BODY_NORMAL}
              className="text-lg sm:text-xl2_5 font-bold text-white py-2"
            >
              {questParticipants > 0
                ? numberWithCommas(questParticipants)
                : "NA"}
            </Typography>
            {typeof uniqueVisitors === "number" && uniqueVisitors > 0 && (
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-primary font-semibold">
                  {computePercentage(questParticipants)}%
                </span>
                <span className="text-secondary text-sm">of unique users</span>
              </div>
            )}
          </div>
          <div className="bg-white10 rounded-full h-14 w-14 flex items-center justify-center">
            <OngoingIcon />
          </div>
        </div>
      </div>

      <div className="flex justify-center mb-16">
        {isGraphLoading ? (
          <GraphSkeleton isMobile={isMobile} />
        ) : (
          <div className="w-full max-w-[950px] bg-gray-300 rounded-md px-4 py-6 sm:px-6 sm:py-4">
            {graphData?.length > 0 ? (
              <>
                <div>
                  <Typography type={TEXT_TYPE.BODY_SMALL} color="textGray">
                    User Progress Visualization
                  </Typography>
                  <Typography
                    type={TEXT_TYPE.BODY_NORMAL}
                    className="text-lg sm:text-2xl mb-10 font-bold text-white"
                  >
                    Quest Completion Over Time
                  </Typography>
                </div>

                <div className="w-full h-[200px] sm:h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={graphData}
                      margin={{ top: 10, right: 20, left: 0, bottom: 40 }}
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
                            offset="0%"
                            stopColor="#6AFFAF"
                            stopOpacity={1}
                          />
                          <stop
                            offset="100%"
                            stopColor="#5CE3FE"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>

                      <XAxis
                        dataKey="_id"
                        interval="preserveEnd"
                        allowDuplicatedCategory={false}
                        tickMargin={30}
                        minTickGap={5}
                        tick={{
                          fill: "#F4FAFF",
                          fontSize: 10,
                          fontFamily: "Sora",
                        }}
                      />

                      <YAxis
                        axisLine={false}
                        tickMargin={30}
                        tickFormatter={(value) => formatYAxis(value)}
                        tick={{
                          fill: "#F4FAFF",
                          fontSize: 10,
                          fontFamily: "Sora",
                        }}
                      />

                      <Tooltip
                        contentStyle={{
                          backgroundColor: "black",
                          borderRadius: "10px",
                          opacity: 0.8,
                          borderColor: "grey",
                        }}
                        itemStyle={{
                          textTransform: "capitalize",
                          color: "#F4FAFF",
                        }}
                      />

                      <Area
                        type="monotone"
                        dataKey="participants"
                        stroke="#6AFFAF"
                        fill="url(#colorPv)"
                        strokeWidth={2}
                        connectNulls
                      />

                      <CartesianGrid
                        vertical={false}
                        strokeDasharray="5 5"
                        stroke="#F4FAFF"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center w-full h-[200px] sm:h-[300px]">
                <Typography type={TEXT_TYPE.BODY_NORMAL} className="text-white">
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
          <div className="w-full sm:max-w-[980px] px-4">
            <Typography
              type={TEXT_TYPE.BODY_NORMAL}
              className="flex flex-col  sm:flex-row gap-2 mb-6 font-bold sm:flex text-2xl sm:text-2xl text-gray-400 sm:text-white"
            >
              <span className="text-sm sm:text-2xl font-bold text-gray-400 sm:text-white">
                People who completed
              </span>
              <span className="text-white">Task</span>
            </Typography>

            {Array.isArray(questParticipationData) &&
            questParticipationData.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {questParticipationData.map((eachParticipation, index) => (
                  <div
                    key={index}
                    className="bg-gray-300 rounded-md p-6 w-full"
                  >
                    <Typography type={TEXT_TYPE.BODY_SMALL} color="textGray">
                      {eachParticipation.name}
                    </Typography>
                    <Typography
                      type={TEXT_TYPE.BODY_NORMAL}
                      className="text-lg sm:text-xl2_5 font-bold text-white py-2"
                    >
                      {numberWithCommas(eachParticipation.count)}
                    </Typography>
                    {typeof uniqueVisitors === "number" &&
                      uniqueVisitors > 0 && (
                        <div className="flex flex-wrap items-baseline gap-2 mt-1">
                          <span className="text-primary font-semibold">
                            {computePercentage(eachParticipation.count)}%
                          </span>
                          <span className="text-secondary text-sm">
                            of unique users
                          </span>
                        </div>
                      )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center w-full h-[300px]">
                <Typography type={TEXT_TYPE.BODY_NORMAL} className="text-white">
                  NA
                </Typography>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
