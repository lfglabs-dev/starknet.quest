import {
  AchievementsDocument,
  BoostClaimParams,
  BoostedQuests,
  CompletedDocument,
  CompletedQuests,
  DeployedTime,
  LeaderboardRankings,
  LeaderboardToppersData,
  PendingBoostClaim,
  QueryError,
  QuestActivityData,
  QuestCategoryDocument,
  QuestDocument,
  QuestParticipantsDocument,
  QuestParticipation,
  QuizDocument,
  UniquePageVisit,
  UniqueVisitorCount,
  UserTask,
  QuestList,
  LeaderboardTopperParams,
  LeaderboardRankingParams,
  derivateStats,
  altProtocolStats,
  pairStats,
  lendStats,
  Call,
} from "types/backTypes";

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
    return (await response.json()) as BoostClaimParams;
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
    return (await response.json()) as number[];
  } catch (err) {
    console.log("Error while fetching completed boosts", err);
    return err as QueryError;
  }
};

export const getQuests = async () => {
  try {
    const response = await fetch(`${baseurl}/get_quests`);
    const quests: QuestList = await response.json();
    return quests;
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
    const data: CompletedQuests = await response.json();
    return data as CompletedQuests;
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
  quizId: number,
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
  quest_id,
}: {
  rewardEndpoint: string;
  address: string;
  quest_id: number;
}) => {
  try {
    const response = await fetch(
      `${baseurl}${rewardEndpoint}?addr=${address}&quest_id=${quest_id}`
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

export async function getQuestById(id: string) {
  try {
    const response = await fetch(`${baseurl}/get_quest?id=${id}`);
    const data: QuestDocument = await response.json();
    return data as QuestDocument;
  } catch (error) {
    console.log("Error parsing quest data:", error);
    return null;
  }
}

export async function fetchQuestCategoryData(name: string) {
  try {
    const response = await fetch(`${baseurl}/get_quest_category?name=${name}`);

    // Check if the response is in JSON format
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const textResponse = await response.text();
      console.log(`Non-JSON response: ${textResponse}`);
      return null; // or handle accordingly
    }

    const data: QuestCategoryDocument | QueryError = await response.json();

    if ((data as QueryError).error) {
      return null;
    }
    return data as QuestCategoryDocument;
  } catch (error) {
    console.log("Error fetching or parsing quest data:", error);
    return null;
  }
}

export const updateUniqueVisitors = async (id: string) => {
  try {
    const response = await fetch(`${baseurl}/unique_page_visit?page_id=${id}`);
    return (await response.json()) as UniquePageVisit;
  } catch (err) {
    console.log("Error while fetching unique visitor count", err);
  }
};

export const getDerivatesStats = async (): Promise<derivateStats | null> => {
  try {
    const response = await fetch(
      `${baseurl}/discover/defi/get_derivatives_stats`
    );
    return await response.json();
  } catch (err) {
    console.log("Error while fetching derivatives stats", err);
    return null;
  }
};

export const getLendingStats = async (): Promise<lendStats | null> => {
  try {
    const response = await fetch(`${baseurl}/discover/defi/get_lend_stats`);
    return await response.json();
  } catch (err) {
    console.log("Error while fetching lending stats", err);
    return null;
  }
};

export const getPairingStats = async (): Promise<pairStats | null> => {
  try {
    const response = await fetch(`${baseurl}/discover/defi/get_pair_stats`);
    return await response.json();
  } catch (err) {
    console.log("Error while fetching pairing stats", err);
    return null;
  }
};

export const getAltProtocolStats =
  async (): Promise<altProtocolStats | null> => {
    try {
      const response = await fetch(
        `${baseurl}/discover/defi/get_alt_protocol_stats`
      );
      return await response.json();
    } catch (err) {
      console.log("Error while fetching alt protocol stats", err);
      return null;
    }
  };

export const getRewards = async (address: string) => {
  try {
    const response = await fetch(`${baseurl}/defi/rewards?addr=${address}`);
    const data = await response.json();
    const rewards = data.rewards;
    const calls = data.calls;
    const parsedCalls = calls.map((call: Call) => {
      return {
        contractAddress: call.contractaddress,
        entrypoint: call.entrypoint,
        calldata: call.calldata,
      };
    });
    return { rewards, calls: parsedCalls };
  } catch (err) {
    console.log("Error while fetching rewards", err);
    return null;
  }
};
