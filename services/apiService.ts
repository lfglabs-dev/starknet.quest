import {
  AchievementsDocument,
  CompletedDocument,
  DeployedTime,
  QueryError,
  UserTask,
  QuestCategoryDocument,
  QuestDocument,
  BoostedQuests,
  QuestParticipation,
  QuizDocument,
  QuestActivityData,
  UniqueVisitorCount,
  LeaderboardRankings,
  LeaderboardToppersData,
  QuestParticipantsDocument,
  UniquePageVisit,
  PendingBoostClaim,
} from "types/backTypes";

export type LeaderboardTopperParams = {
  addr: string;
  duration: "week" | "month" | "all";
};

export type LeaderboardRankingParams = {
  addr: string;
  page_size: number;
  shift: number;
  duration: "week" | "month" | "all";
};

const baseurl = process.env.NEXT_PUBLIC_API_LINK;

export const fetchLeaderboardToppers = async (
  params: LeaderboardTopperParams
) => {
  try {
    const { addr, duration } = params;
    const response = await fetch(
      `${baseurl}/leaderboard/get_static_info?addr=${addr}&duration=${duration}`
    );
    return (await response.json()) as LeaderboardToppersData;
  } catch (err) {
    console.log("Error while fetching leaderboard position", err);
  }
};

export const fetchLeaderboardRankings = async (
  params: LeaderboardRankingParams
) => {
  try {
    const { addr, page_size, shift, duration } = params;
    const response = await fetch(
      `${baseurl}/leaderboard/get_ranking?addr=${addr}&page_size=${page_size}&shift=${shift}&duration=${duration}`
    );
    return (await response.json()) as LeaderboardRankings;
  } catch (err) {
    console.log("Error while fetching leaderboard ranks", err);
  }
};

export const getBoosts = async () => {
  try {
    const response = await fetch(`${baseurl}/boost/get_boosts`);
    const data: Boost[] | QueryError = await response.json();
    return data as Boost[];
  } catch (err) {
    console.log("Error while fetching boosts", err);
  }
};

export const getQuestsInBoost = async (id: string) => {
  try {
    const response = await fetch(`${baseurl}/boost/get_quests?boost_id=${id}`);
    const data: QuestDocument[] | QueryError = await response.json();
    return data as QuestDocument[];
  } catch (err) {
    console.log("Error while fetching quests in boost", err);
  }
};

export const getBoostById = async (id: string) => {
  try {
    const response = await fetch(`${baseurl}/boost/get_boost?id=${id}`);
    const data: Boost | QueryError = await response.json();
    return data as Boost;
  } catch (err) {
    console.log("Error while fetching boost data", err);
  }
};

export const getQuestParticipants = async (id: number | string) => {
  try {
    const response = await fetch(
      `${baseurl}/get_quest_participants?quest_id=${id}`
    );
    const data: QuestParticipantsDocument | QueryError = await response.json();
    return data as QuestParticipantsDocument;
  } catch (err) {
    console.log("Error while fetching total participants", err);
    return err as QueryError;
  }
};

export const getQuestBoostClaimParams = async (id: number, addr: string) => {
  try {
    const response = await fetch(
      `${baseurl}/boost/get_claim_params?boost_id=${id}&addr=${addr}`
    );
    return await response.json();
  } catch (err) {
    console.log("Error while fetching claim signature", err);
  }
};

export const getPendingBoostClaims = async (addr: string) => {
  try {
    const response = await fetch(
      `${baseurl}/boost/get_pending_claims?addr=${addr}`
    );
    return (await response.json()) as PendingBoostClaim[];
  } catch (err) {
    console.log("Error while fetching pending claims", err);
  }
};

export const getCompletedBoosts = async (addr: string) => {
  try {
    const response = await fetch(
      `${baseurl}/boost/get_completed_boosts?addr=${addr}`
    );
    return await response.json();
  } catch (err) {
    console.log("Error while fetching completed boosts", err);
  }
};

export const getQuests = async () => {
  try {
    const response = await fetch(`${baseurl}/get_quests`);
    return await response.json();
  } catch (err) {
    console.log("Error while fetching trending quests", err);
  }
};

export const getTrendingQuests = async (addr = "") => {
  try {
    const response = await fetch(
      `${baseurl}/get_trending_quests${addr ? `?addr=${addr}` : ""}`
    );
    const data: QuestDocument[] = await response.json();
    return data;
  } catch (err) {
    console.log("Error while fetching trending quests", err);
    return {
      error: "Error While Fetching Trending Quests",
    } as QueryError;
  }
};

export const getCompletedQuests = async (addr: string) => {
  try {
    const response = await fetch(
      `${baseurl}/get_completed_quests?addr=${addr}`
    );
    return await response.json();
  } catch (err) {
    console.log("Error while fetching completed quests", err);
  }
};

export const getBoostedQuests = async () => {
  try {
    const response = await fetch(`${baseurl}/get_boosted_quests`);
    const boostedQuests: BoostedQuests | QueryError = await response.json();
    return boostedQuests;
  } catch (err) {
    console.log("Error while getting boosted quests", err);
  }
};

export const getUserAchievements = async (address = "0") => {
  try {
    const response = await fetch(
      `${baseurl}/achievements/fetch?addr=${address}`
    );
    const data: AchievementsDocument[] | QueryError = await response.json();
    return data as AchievementsDocument[];
  } catch (err) {
    console.log("Error while fetching user achievements", err);
  }
};

export const getUserAchievementByCategory = async ({
  category,
  address,
  categoryId,
}: {
  category: string;
  address: string;
  categoryId: number;
}) => {
  try {
    const response = await fetch(
      `${baseurl}/achievements/${category}?addr=${address}&category_id=${categoryId}`
    );
    const data: CompletedDocument | QueryError = await response.json();
    return data as CompletedDocument;
  } catch (err) {
    console.log("Error while fetching user achievement by category", err);
  }
};

export const verifyUserAchievement = async ({
  verifyType,
  address,
  achievementId,
}: {
  verifyType: string;
  address: string;
  achievementId: number;
}) => {
  try {
    const response = await fetch(
      `${baseurl}/achievements/verify_${verifyType}?addr=${address}&id=${achievementId}`
    );
    const data: CompletedDocument | QueryError = await response.json();
    return data as CompletedDocument;
  } catch (err) {
    console.log("Error while verifying user achievement by category", err);
  }
};

export const fetchBuildings = async (filteredAssets: number[]) => {
  try {
    const response = await fetch(
      `${baseurl}/achievements/fetch_buildings?ids=${filteredAssets.join(",")}`
    );
    return (await response.json()) as BuildingsInfo[];
  } catch (err) {
    console.log("Error while fetching buildings data", err);
  }
};

export const getQuizById = async (
  quizId: string,
  address = "0"
): Promise<Quiz | undefined> => {
  try {
    const response = await fetch(
      `${baseurl}/get_quiz?id=${quizId}&addr=${address}`
    );
    const data: QuizDocument | QueryError = await response.json();
    return data as Quiz;
  } catch (err) {
    console.log("Error while fetching quiz data by Id", err);
  }
};

export const getTasksByQuestId = async ({
  questId,
  address,
}: {
  questId: string;
  address: string;
}) => {
  try {
    const response = await fetch(
      `${baseurl}/get_tasks?quest_id=${questId}&addr=${address}`
    );
    const data: UserTask[] | QueryError = await response.json();
    return data as UserTask[];
  } catch (err) {
    console.log("Error while fetching tasks by quest Id", err);
  }
};

export const getDeployedTimeByAddress = async (address: string) => {
  try {
    const response = await fetch(
      `${baseurl}/get_deployed_time?addr=${address}`
    );
    const data: DeployedTime | QueryError = await response.json();
    return data as DeployedTime;
  } catch (err) {
    console.log("Error while fetching deployed time by address", err);
  }
};

export const getEligibleRewards = async ({
  rewardEndpoint,
  address,
}: {
  rewardEndpoint: string;
  address: string;
}) => {
  try {
    const response = await fetch(
      `${baseurl}/${rewardEndpoint}?addr=${address}`
    );
    return await response.json();
  } catch (err) {
    console.log("Error while fetching eligible rewards", err);
  }
};

export const getQuestActivityData = async (id: number) => {
  try {
    const response = await fetch(
      `${baseurl}/analytics/get_quest_activity?id=${id}`
    );
    return (await response.json()) as QuestActivityData[];
  } catch (err) {
    console.log("Error while fetching quest data", err);
  }
};

export const getQuestsParticipation = async (
  id: number
): Promise<QuestParticipation | undefined> => {
  try {
    const response = await fetch(
      `${baseurl}/analytics/get_quest_participation?id=${id}`
    );
    return await response.json();
  } catch (err) {
    console.log("Error while fetching quest participation", err);
  }
};

export const getUniqueVisitorCount = async (id: number) => {
  try {
    const response = await fetch(
      `${baseurl}/analytics/get_unique_visitors?id=${id}`
    );
    return (await response.json()) as UniqueVisitorCount;
  } catch (err) {
    console.log("Error while fetching unique visitor count", err);
  }
};

export async function getQuestById(questId: string | number) {
  const response = await fetch(`${baseurl}/get_quest?id=${questId}`);
  const data: QuestDocument | QueryError = await response.json();
  return data as QuestDocument;
}

export async function fetchQuestCategoryData(name: string) {
  const response = await fetch(`${baseurl}/get_quest_category?name=${name}`);
  const data: QuestCategoryDocument | QueryError = await response.json();
  return data as QuestCategoryDocument;
}

export const updateUniqueVisitors = async (id: string) => {
  try {
    const response = await fetch(`${baseurl}/unique_page_visit?page_id=${id}`);
    return (await response.json()) as UniquePageVisit;
  } catch (err) {
    console.log("Error while fetching unique visitor count", err);
  }
};
