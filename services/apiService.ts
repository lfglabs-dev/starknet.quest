type LeaderboardTopperParams = {
  addr: string;
};

type LeaderboardRankingParams = {
  addr: string;
  page_size: number;
  shift: number;
  start_timestamp: number;
  end_timestamp: number;
};

const baseurl = process.env.NEXT_PUBLIC_API_LINK;

export const fetchLeaderboardToppers = async (
  params: LeaderboardTopperParams
) => {
  try {
    const { addr } = params;
    const response = await fetch(
      `${baseurl}/leaderboard/get_static_info?addr=${addr}`
    );
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

export const fetchLeaderboardRankings = async (
  params: LeaderboardRankingParams
) => {
  try {
    const { addr, page_size, shift, start_timestamp, end_timestamp } = params;
    const response = await fetch(
      `${baseurl}/leaderboard/get_ranking?addr=${addr}&page_size=${page_size}&shift=${shift}&start_timestamp=${start_timestamp}&end_timestamp=${end_timestamp}`
    );
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

export const getCompletedQuestsOfUser = async (address: string) => {
  try {
    const response = await fetch(
      `${baseurl}/get_completed_quests?addr=${address}`
    );
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

export const getBoosts = async () => {
  try {
    const response = await fetch(`${baseurl}/boost/get_boosts`);
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

export const getQuestsInBoost = async (id: string) => {
  try {
    const response = await fetch(`${baseurl}/boost/get_quests?boost_id=${id}`);
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

export const getBoostById = async (id: string) => {
  try {
    const response = await fetch(`${baseurl}/boost/get_boost?id=${id}`);
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

export const getQuestParticipants = async (id: number) => {
  try {
    const response = await fetch(
      `${baseurl}/get_quest_participants?quest_id=${id}`
    );
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

export const getQuestBoostClaimParams = async (id: number) => {
  try {
    const response = await fetch(
      `${baseurl}/boost/get_claim_params?boost_id=${id}`
    );
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

export const updateQuestBoostClaimStatus = async (
  id: number,
  value: boolean
) => {
  try {
    const response = await fetch(
      `${baseurl}/boost/update_claim_status?boost_id=${id}&status=${value}`
    );
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};
