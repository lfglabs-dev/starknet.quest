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
    return await response.json();
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
    return await response.json();
  } catch (err) {
    console.log("Error while fetching leaderboard ranks", err);
  }
};

export const getBoosts = async () => {
  try {
    const response = await fetch(`${baseurl}/boost/get_boosts`);
    return await response.json();
  } catch (err) {
    console.log("Error while fetching boosts", err);
  }
};

export const getQuestsInBoost = async (id: string) => {
  try {
    const response = await fetch(`${baseurl}/boost/get_quests?boost_id=${id}`);
    return await response.json();
  } catch (err) {
    console.log("Error while fetching quests in boost", err);
  }
};

export const getBoostById = async (id: string) => {
  try {
    const response = await fetch(`${baseurl}/boost/get_boost?id=${id}`);
    return await response.json();
  } catch (err) {
    console.log("Error while fetching boost data", err);
  }
};

export const getQuestParticipants = async (id: number) => {
  try {
    const response = await fetch(
      `${baseurl}/get_quest_participants?quest_id=${id}`
    );
    return await response.json();
  } catch (err) {
    console.log("Error while fetching total participants", err);
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
    return await response.json();
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
    return await response.json();
  } catch (err) {
    console.log("Error while fetching trending quests", err);
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
    return await response.json();
  } catch (err) {
    console.log("Error while getting boosted quests", err);
  }
};

export const getQuestActivityData = async (id: number) => {
  try {
    const response = await fetch(
      `${baseurl}/analytics/get_quest_activity?id=${id}`
    );
    return await response.json();
  } catch (err) {
    console.log("Error while fetching quest data", err);
  }
};

export const getQuestsParticipation = async (id: number) => {
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
    return await response.json();
  } catch (err) {
    console.log("Error while fetching unique visitor count", err);
  }
};

export const updateUniqueVisitors = async (id: string) => {
  try {
    const response = await fetch(`${baseurl}/unique_page_visit?page_id=${id}`);
    return await response.json();
  } catch (err) {
    console.log("Error while fetching unique visitor count", err);
  }
};
