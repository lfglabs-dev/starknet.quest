import {
  fetchQuestCategoryData,
  fetchLeaderboardToppers,
  fetchLeaderboardRankings,
  getBoostById,
  getBoosts,
  getQuizById,
  fetchLeaderboardRankings,
  getTrendingQuests,
  getQuestsInBoost,
  getQuestActivityData,
  getUniqueVisitorCount,
  getTasksByQuestId,
  getDeployedTimeByAddress,
  getQuestParticipants,
  getBoostedQuests,
  getQuestsParticipation,
  updateUniqueVisitors,
  getPendingBoostClaims,
} from "@services/apiService";

const API_URL = process.env.NEXT_PUBLIC_API_LINK;

global.fetch = jest.fn();

describe("fetchQuestCategoryData function", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it("should fetch and return data for a valid category name", async () => {
    const mockData = {
      name: "Quest Name",
      title: "Quest title",
      desc: "Quests description.",
      img_url: "braavos/category.webp",
    };
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await fetchQuestCategoryData("Quest Name");
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_quest_category?name=Quest Name`
    );
    expect(result).toEqual(mockData);
  });

  it("should handle fetch errors gracefully", async () => {
    const mockResponse = "Category not found";
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await fetchQuestCategoryData("InvalidCategory");
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_quest_category?name=InvalidCategory`
    );
    expect(result).toEqual(mockResponse);
  });
});

describe("getBoostedQuests function", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it("should fetch and return all boosted quests", async () => {
    const mockData = [23, 104, 24, 105, 106, 26, 27];

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await getBoostedQuests();

    expect(fetch).toHaveBeenCalledWith(`${API_URL}/get_boosted_quests`);
    expect(result).toEqual(mockData);
  });

  it("should handle fetch with empty response", async () => {
    const mockData = [];

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await getBoostedQuests();

    expect(fetch).toHaveBeenCalledWith(`${API_URL}/get_boosted_quests`);
    expect(result).toEqual(result);
  });

  it("should handle unexpected reesponse", async () => {
    const mockData = {
      error: 000,
      message: "Error querying boosts",
      data: {},
    };

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await getBoostedQuests();

    expect(fetch).toHaveBeenCalledWith(`${API_URL}/get_boosted_quests`);
    expect(result).toEqual(result);
  });
});

describe("getQuestsParticipation", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it("should fetch and return data for a valid id", async () => {
    const mockData = [
      {
        name: "Register a stark domain",
        desc: "In order to create a Starknet Profile, you need a Stark Domain ! This domain will represent you on-chain and is integrated in all the major Starknet apps. You can use it to send & receive money on with Braavos and ArgentX, Access to all the Starknet Quest, being recognized on Starkscan or access to the Stark Name holder's advantages.",
        participants: 3,
      },
      {
        name: "Follow Starknet Quest on Twitter",
        desc: "Follow Starknet Quest on Twitter to get updated on their news and rewards for domain holders.",
        participants: 4,
      },
      {
        name: "Starknet ID Tribe Quiz",
        desc: "Take part in our Starknet ID Tribe Quiz to test your knowledge, and you'll have a chance to win an exclusive Starknet ID Tribe NFT as your reward.",
        quiz_name: "starknetid",
        participants: 3,
      },
      {
        name: "Verify your Twitter & Discord",
        desc: "Verify your social media on your Starknet ID will permit you to access future quests, be careful you need to verify them on the Starknet ID of your domain.",
        participants: 5,
      },
    ];

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await getQuestsParticipation(1);
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/analytics/get_quest_participation?id=1`
    );
    expect(result).toEqual(mockData);
  });

  it("should handle fetch with empty response", async () => {
    const mockResponse = [];

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getQuestsParticipation(0);
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/analytics/get_quest_participation?id=0`
    );
    expect(result).toEqual(mockResponse);
  });

  it("should handle unexpected response", async () => {
    const mockResponse = {
      error: 500,
      message: "Error while fetching quest participation",
      data: {},
    };

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getQuestsParticipation();

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/analytics/get_quest_participation?id=undefined`
    );
    expect(result).toEqual(result);
  });

  it("should handle no response", async () => {
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(undefined),
    });

    const result = await getQuestsParticipation(1);
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/analytics/get_quest_participation?id=1`
    );
    expect(result).toBeUndefined();
  });
});

describe("fetchLeaderboardToppers", () => {
  afterEach(() => {
    fetch.mockClear();
  });

  it("fetches leaderboard toppers correctly for a valid duration", async () => {
    const mockResponse = {
      best_users: [
        {
          address: "0x1234567890abcdef",
          xp: 1000,
          achievements: 8,
        },
        {
          address: "0x1234567890abcefg",
          xp: 900,
          achievements: 7,
        },
      ],
      total_users: 2,
    };
    const validDurations = ["week", "month", "all"];
    for (const duration of validDurations) {
      const params = { addr: "0x12345988hhnnef", duration };
      fetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockResponse),
      });
      const response = await fetchLeaderboardToppers(params);
      expect(fetch).toHaveBeenCalledWith(
        `${API_URL}/leaderboard/get_static_info?addr=${params.addr}&duration=${params.duration}`
      );
      expect(response).toEqual(mockResponse);
    }
  });

  it("handles fetch with empty duration", async () => {
    const params = { addr: "0x0iuh8999", duration: " " };
    const mockResponse = "Invalid Duration";
    fetch.mockResolvedValueOnce({ json: () => Promise.resolve(mockResponse) });
    const result = await fetchLeaderboardToppers(params);
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/leaderboard/get_static_info?addr=${params.addr}&duration=${params.duration}`
    );
    expect(result).toEqual(mockResponse);
  });

  it("handles fetch with null duration", async () => {
    const params = { addr: "0xo8hb98y89y9", duration: null };
    const mockResponse = "Invalid Duration";
    fetch.mockResolvedValueOnce({ json: () => Promise.resolve(mockResponse) });
    const result = await fetchLeaderboardToppers(params);
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/leaderboard/get_static_info?addr=${params.addr}&duration=${params.duration}`
    );
    expect(result).toEqual(mockResponse);
  });

  it("handles fetch with undefined duration", async () => {
    const params = { addr: "exampleAddr", duration: undefined };
    const mockResponse = "Invalid Duration";
    fetch.mockResolvedValueOnce({ json: () => Promise.resolve(mockResponse) });
    const result = await fetchLeaderboardToppers(params);
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/leaderboard/get_static_info?addr=${params.addr}&duration=${params.duration}`
    );
    expect(result).toEqual(mockResponse);
  });
});

describe("getTasksByQuestId function", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it("should handle when api returns no response", async () => {
    const mockResponse = null;
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getTasksByQuestId({ questId: "1", address: "2" });
    expect(result).toEqual(mockResponse);
  });

  it("should handle when api return response in unexpected format", async () => {
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve("Unexpected Format"),
    });

    const result = await getTasksByQuestId({ questId: "1", address: "2" });
    expect(result).not.toEqual(expect.any(Array));
  });

  it("should handle undefined values", async () => {
    const mockResponse =
      "Failed to deserialize query string: invalid character";

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    });

    let result = await getTasksByQuestId({
      questId: undefined,
      address: undefined,
    });
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_tasks?quest_id=undefined&addr=undefined`
    );
    expect(result).toEqual(mockResponse);
  });

  it("should handle an undefined value", async () => {
    const mockResponse =
      "Failed to deserialize query string: invalid digit found in string";

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    });

    let result = await getTasksByQuestId({ questId: undefined, address: 2 });
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_tasks?quest_id=undefined&addr=2`
    );
    expect(result).toEqual(mockResponse);
  });

  it("should handle null values", async () => {
    const mockResponse =
      "Failed to deserialize query string: invalid digit found in string";

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    });

    let result = await getTasksByQuestId({ questId: null, address: 2 });
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_tasks?quest_id=null&addr=2`
    );
    expect(result).toEqual(mockResponse);
  });

  it("should fetch and return data for a valid task", async () => {
    const mockData = [
      {
        id: 56,
        quest_id: 1,
        name: "Starknet Tribe",
        href: "https://docs.starknet.id/",
        cta: "Start Starknet Tribe Quiz",
        verify_endpoint: "quests/verify_quiz",
        verify_endpoint_type: "quiz",
        verify_redirect: null,
        desc: "Task Description",
        completed: false,
        quiz_name: null,
      },
    ];
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await getTasksByQuestId({ questId: "1", address: "2" });
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_tasks?quest_id=1&addr=2`
    );
    expect(result).toEqual(mockData);
  });
});

describe("fetchLeaderboardRankings function", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it("should fetch and return data for valid parameters", async () => {
    const mockData = {
      rankings: [
        { address: "0x123abc", xp: 100, achievements: 5 },
        { address: "0x456def", xp: 80, achievements: 3 },
        { address: "0x789ghi", xp: 120, achievements: 7 },
      ],
      first_elt_position: 1,
    };

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const params = { addr: "", page_size: 10, shift: 0, duration: "week" };
    const result = await fetchLeaderboardRankings(params);

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/leaderboard/get_ranking?addr=&page_size=10&shift=0&duration=week`
    );
    expect(result).toEqual(mockData);
  });

  it("should handle API returning no response", async () => {
    const mockResponse = undefined;

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    });

    const params = {
      addr: "invalidAddr",
      page_size: -1,
      shift: 0,
      duration: "string",
    };

    const result = await fetchLeaderboardRankings(params);

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/leaderboard/get_ranking?addr=invalidAddr&page_size=-1&shift=0&duration=string`
    );
    expect(result).toBeUndefined();
  });

  it("should handle API returning response in unexpected format", async () => {
    const mockResponsePageSize = "Error querying ranks";
    const mockResponseDuration = "Invalid duration";

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponsePageSize),
    });

    const paramsPageSize = {
      addr: "sampleAddr",
      page_size: -1,
      shift: 0,
      duration: "week",
    };
    const resultPageSize = await fetchLeaderboardRankings(paramsPageSize);

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/leaderboard/get_ranking?addr=sampleAddr&page_size=-1&shift=0&duration=week`
    );
    expect(resultPageSize).toEqual(mockResponsePageSize);

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponseDuration),
    });

    const paramsDuration = {
      addr: "sampleAddr",
      page_size: 10,
      shift: 0,
      duration: "string",
    };
    const resultDuration = await fetchLeaderboardRankings(paramsDuration);

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/leaderboard/get_ranking?addr=sampleAddr&page_size=10&shift=0&duration=string`
    );
    expect(resultDuration).toEqual(mockResponseDuration);
  });

  it("should handle undefined cases in parameters", async () => {
    const mockData = {
      rankings: [
        { address: "0x123abc", xp: 100, achievements: 5 },
        { address: "0x456def", xp: 80, achievements: 3 },
        { address: "0x789ghi", xp: 120, achievements: 7 },
      ],
      first_elt_position: 1,
    };

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const params1 = {
      addr: undefined,
      page_size: -1,
      shift: 0,
      duration: "string",
    };
    const result1 = await fetchLeaderboardRankings(params1);

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/leaderboard/get_ranking?addr=undefined&page_size=-1&shift=0&duration=string`
    );
    expect(result1).toEqual(mockData);
  });

  it("should handle null cases in parameters", async () => {
    const mockData = {
      rankings: [
        { address: "0x123abc", xp: 100, achievements: 5 },
        { address: "0x456def", xp: 80, achievements: 3 },
        { address: "0x789ghi", xp: 120, achievements: 7 },
      ],
      first_elt_position: 1,
    };

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const params2 = { addr: null, page_size: -1, shift: 0, duration: "string" };
    const result2 = await fetchLeaderboardRankings(params2);

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/leaderboard/get_ranking?addr=null&page_size=-1&shift=0&duration=string`
    );
    expect(result2).toEqual(mockData);
  });
});

describe("getBoostById function", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it("should fetch and return data for a valid boost id", async () => {
    const mockData = {
      amount: 1000,
      expiry: 1718052414000,
      hidden: false,
      id: 9,
      img_url: "/nostra/cigar.webp",
      name: "nostra - Stake and Win",
      num_of_winners: 4,
      quests: [27],
      token:
        "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
      token_decimals: 18,
      winner: null,
    };
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await getBoostById("boost-id");
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/boost/get_boost?id=boost-id`
    );
    expect(result).toEqual(mockData);
  });

  it("should handle when API returns no response", async () => {
    const mockData = undefined;

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await getBoostById("boost-id");
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/boost/get_boost?id=boost-id`
    );
    expect(result).toBeUndefined();
  });
  it("should handle when API returns response in unexpected format", async () => {
    const mockData = "Unexpected response format";
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await getBoostById("boost-id");
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/boost/get_boost?id=boost-id`
    );
    expect(result).toEqual(mockData);
  });

  it("should handle undefined cases in parameters", async () => {
    const mockData =
      "Failed to deserialize query string: invalid digit found in string";
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await getBoostById(undefined);
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/boost/get_boost?id=undefined`
    );
    expect(result).toEqual(mockData);
  });

  it("should handle null cases in parameters", async () => {
    const mockData =
      "Failed to deserialize query string: invalid digit found in string";

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await getBoostById(null);
    expect(fetch).toHaveBeenCalledWith(`${API_URL}/boost/get_boost?id=null`);
    expect(result).toEqual(mockData);
  });

  it("should handle fetch errors gracefully", async () => {
    const mockResponse = "Error while fetching boost data";
    fetch.mockResolvedValueOnce({
      json: () => Promise.reject(mockResponse),
    });
    const result = await getBoostById("invalid-id");
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/boost/get_boost?id=invalid-id`
    );
    expect(result).toBeUndefined();
  });
});

describe("getQuestActivityData function", () => {
  beforeEach(() => {
    fetch.mockClear();
  });
  it("should fetch and return data for a valid id", async () => {
    //mock data for successful response
    const mockData = [{ date: "2024-04-04 04", participants: 2 }];
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });
    const result = await getQuestActivityData(1);
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/analytics/get_quest_activity?id=1`
    );
    expect(result).toEqual(mockData);
  });
  it("should handle API returning no response", async () => {
    // Mock fetch response with no data
    const mockResponse = undefined;
    fetch.mockResolvedValueOnce({ json: () => Promise.resolve(mockResponse) });

    const result = await getQuestActivityData("invalidId");
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/analytics/get_quest_activity?id=invalidId`
    );
    expect(result).toBeUndefined();
  });

  it("should handle unexpected response format", async () => {
    // Mock fetch response with unexpected data format
    const mockResponse = [];
    fetch.mockResolvedValueOnce({ json: () => Promise.resolve(mockResponse) });
    const result = await getQuestActivityData(10);
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/analytics/get_quest_activity?id=10`
    );
    expect(result).toEqual(mockResponse);
  });

  it("should handle null cases in parameters", async () => {
    // mock fetch response with null parameters
    const mockResponse =
      "Failed to deserialize query string: invalid digit found in string";
    fetch.mockResolvedValueOnce({ json: () => Promise.resolve(mockResponse) });
    const result = await getQuestActivityData("");
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/analytics/get_quest_activity?id=`
    );
    expect(result).toEqual(mockResponse);
  });

  it("should handle undefined cases in parameters", async () => {
    // mock fetch response with undefined parameters
    const mockResponse = undefined;
    fetch.mockResolvedValueOnce({ json: () => Promise.resolve(mockResponse) });
    const result = await getQuestActivityData(undefined);
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/analytics/get_quest_activity?id=undefined`
    );
    expect(result).toEqual(mockResponse);
  });

  it("should handle fetch errors gracefully", async () => {
    const mockResponse = "Error while fetching quest data";

    fetch.mockResolvedValueOnce({
      json: () => Promise.reject(mockResponse),
    });

    const result = await getQuestActivityData("invalid-id");
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/analytics/get_quest_activity?id=invalid-id`
    );
    expect(result).toBeUndefined();
  });
});

describe("getDeployedTimeByAddress function", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it("should fetch and return data for a valid address or domain", async () => {
    const mockData = {
      timestamp: 9843327487,
    };

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await getDeployedTimeByAddress(
      "0x02baedbff795949d6aa1ebc0dead2b2ba5d34e97ae1c4aee6cd0796d6ad33b52"
    );
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_deployed_time?addr=0x02baedbff795949d6aa1ebc0dead2b2ba5d34e97ae1c4aee6cd0796d6ad33b52`
    );
    expect(result).toEqual(mockData);
  });

  it("should handle when API returns no response", async () => {
    const mockData = undefined;

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await getDeployedTimeByAddress(
      "0x02baedbff795949d6aa1ebc0dead2b2ba5d34e97ae1c4aee6cd0796d6ad33b52"
    );
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_deployed_time?addr=0x02baedbff795949d6aa1ebc0dead2b2ba5d34e97ae1c4aee6cd0796d6ad33b52`
    );
    expect(result).toBeUndefined();
  });

  it("should handle undefined cases in parameters", async () => {
    const mockData = "Failed to deserialize query string: invalid character";
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await getTrendingQuests("kasjcaakjhasdajhd");
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_trending_quests?addr=kasjcaakjhasdajhd`
    );
    expect(result).toEqual(mockData);
  });

  it("should handle null cases in parameters", async () => {
    const mockData = "Failed to deserialize query string: invalid character";

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await getDeployedTimeByAddress(null);
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_deployed_time?addr=null`
    );
    expect(result).toEqual(mockData);
  });

  it("should handle fetch errors gracefully", async () => {
    const mockResponse = "Error while fetching deployed time";

    fetch.mockResolvedValueOnce({
      json: () => Promise.reject(mockResponse),
    });

    const result = await getDeployedTimeByAddress("invalid-address");
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_deployed_time?addr=invalid-address`
    );
    expect(result).toBeUndefined();
  });
});

describe("getUniqueVisitorCount function", () => {
  beforeEach(() => {
    fetch.mockClear();
  });
  it("should return data for valid page id", async () => {
    const mockResponse = 14;
    fetch.mockResolvedValueOnce({ json: () => Promise.resolve(mockResponse) });
    const result = await getUniqueVisitorCount(1);
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/analytics/get_unique_visitors?id=1`
    );
    expect(result).toEqual(mockResponse);
  });
  it("should handle errors gracefully", async () => {
    const mockResponse = "Error while fetching unique visitor count";
    fetch.mockResolvedValueOnce({ json: () => Promise.reject(mockResponse) });
    const result = await getUniqueVisitorCount("invalid-id");
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/analytics/get_unique_visitors?id=invalid-id`
    );
    expect(result).toBeUndefined();
  });
  it("should handle null cases in parameters", async () => {
    const mockResponse =
      "Failed to deserialize query string: invalid digit found in string";
    fetch.mockResolvedValueOnce({ json: () => Promise.resolve(mockResponse) });
    const result = await getUniqueVisitorCount(null);
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/analytics/get_unique_visitors?id=null`
    );
    expect(result).toEqual(mockResponse);
  });
  it("should handle undefined cases in parameters", async () => {
    const mockResponse =
      "Failed to deserialize query string: invalid digit found in string";
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getUniqueVisitorCount(undefined);
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/analytics/get_unique_visitors?id=undefined`
    );
    expect(result).toEqual(mockResponse);
  });
  it("should handle when API returns no response", async () => {
    const mockResponse = undefined;
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getUniqueVisitorCount("page-id");
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/analytics/get_unique_visitors?id=page-id`
    );
    expect(result).toBeUndefined();
  });
  it("should handle when API returns response in unexpected format", async () => {
    const mockResponse = 0;
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getUniqueVisitorCount(10);
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/analytics/get_unique_visitors?id=10`
    );
    expect(result).toEqual(mockResponse);
  });
});

describe("getTrendingQuests function", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it("should fetch and return data for a valid addr", async () => {
    const mockData = [
      {
        id: 20,
        name: "Nostra - LaFamiglia Rose",
        desc: "Nostra, is a versatile liquidity protocol for lending and borrowing, built on Starknet",
        additional_desc: null,
        issuer: "Nostra",
        category: "deFi",
        rewards_endpoint: "quests/nostra/claimable",
        logo: "/nostra/favicon.ico",
        rewards_img: "/nostra/rose.webp",
        rewards_title: "1 NFT",
        rewards_description: null,
        rewards_nfts: [
          {
            img: "/nostra/rose.webp",
            level: 1,
          },
        ],
        img_card: "/nostra/rose.webp",
        title_card: "Nostra - LaFamiglia Rose",
        hidden: false,
        disabled: false,
        expiry: null,
        expiry_timestamp: null,
        mandatory_domain: "root",
        expired: false,
        experience: 10,
      },
    ];
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await getTrendingQuests("1145");
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_trending_quests?addr=1145`
    );
    expect(result).toEqual(mockData);
  });

  it("should handle when API returns empty array", async () => {
    const mockData = [];
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await getTrendingQuests("1145");
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_trending_quests?addr=1145`
    );
    expect(result).toHaveLength(0);
  });

  it("should handle when wrong address given in parameters", async () => {
    const mockData = "Failed to deserialize query string: invalid character";

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await getTrendingQuests("kasjcaakjhasdajhd");
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_trending_quests?addr=kasjcaakjhasdajhd`
    );
    expect(result).toEqual(mockData);
  });

  it("should handle undefined cases in parameters", async () => {
    const mockData = [];
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await getTrendingQuests();
    expect(fetch).toHaveBeenCalledWith(`${API_URL}/get_trending_quests`);
    expect(result).toHaveLength(0);
  });

  it("should handle null cases in parameters", async () => {
    const mockData = [];
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await getTrendingQuests(null);
    expect(fetch).toHaveBeenCalledWith(`${API_URL}/get_trending_quests`);
    expect(result).toHaveLength(0);
  });
});

describe("getQuestParticipants function", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it("should handle when endpoint returns no response", async () => {
    let mockData;

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    let id = 212;
    const result = await getQuestParticipants(id);
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_quest_participants?quest_id=${id}`
    );
    expect(result).toEqual(mockData);
  });

  it("should handle when endpoint returns response with unexpected format", async () => {
    const unexpectedFormat = {
      length: 2,
      partcipants: ["alice", "bob"],
    };
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(unexpectedFormat),
    });

    let id = 212;
    const result = await getQuestParticipants(id);
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_quest_participants?quest_id=${id}`
    );
    expect(result).toEqual(unexpectedFormat);
  });

  it("should handle when endpoint returns null or undefined", async () => {
    let nullValue = null;
    let undefinedValue = undefined;
    let id = 212;

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(nullValue),
    });

    let result = await getQuestParticipants(id);
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_quest_participants?quest_id=${id}`
    );
    expect(result).toEqual(nullValue);

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(undefinedValue),
    });

    result = await getQuestParticipants(id);
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_quest_participants?quest_id=${id}`
    );
    expect(result).toEqual(undefinedValue);
  });

  it("should handle a successful response", async () => {
    const successfulResponse = {
      count: 2,
      firstParticipants: [
        "2743904720129156746180181293311338667551775614259360553548717267834876683107",
        "2024382663004519338288950797130096007097807197019480655109492638824315612165",
      ],
    };
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(successfulResponse),
    });

    let id = 1;
    const result = await getQuestParticipants(id);
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_quest_participants?quest_id=${id}`
    );
    expect(result).toEqual(successfulResponse);
  });
});

describe("getBoosts function", () => {
  beforeEach(() => {
    fetch.mockClear();
  });
  it("should fetch and return all boosts", async () => {
    const mockData = [
      [
        {
          amount: 1500,
          token:
            "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8",
          expiry: 1705708740000,
          quests: [23],
          winner: [
            "0x061b6c0a78f9edf13cea17b50719f3344533fadd470b8cb29c2b4318014f52d3",
            "0x03a1647831175f2abd4acfbcbca2ce6b8eef6c568ddb1e1174d1640ac8574580",
            "0x0664c36dc97e14d74fabfb5d1ad77258f8340fdf711b836734a0aa90e704ba8a",
            "0x019d081186f939258032ab321be2cef29816374b0d782d4a782e2d834799abad",
            "0x06862090fb4e5764650cf06653526bfb33fc8b3a8687dcf440d227fe28f927ad",
            "0x035fbd8b6170edd66bc31fc312f21626a995c4e91855e2fb2c747b0e2516045f",
          ],
          id: 5,
          img_url: "/rango/bridge.webp",
          name: "The Rango Boost",
          hidden: false,
          num_of_winners: 6,
          token_decimals: 6,
        },
        {
          amount: 900,
          token:
            "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8",
          expiry: 1705708799000,
          quests: [104],
          winner: [
            "0x034f3c16e4a0b7f4557ed0f70f6c4e7599e5da72f5fd6836516efbf9b71de0a0",
            "0x022c2dd075059467bac7452afee146ecb17384506cb80174ecf69d2430f9fb4a",
            "0x07327df3c5215fb607d84fb72aab70b49050c8a438c3fccee4f681ef88d296c7",
            "0x02f06e4e2c320fbfdcba4b94ebc6d5c30002c5400e138ff0eedcae3409dae791",
            "0x04e56b7a9d280392aa64aa66b8c51748f2eb7bd5dface86a42fb156ed49bcec8",
            "0x01291b5e9812b2adf6755eaab3037b0b72c67cbd6c189831fc6f52bcfc4fde51",
            "0x00bfceb15cf13814aadf3337e73c7f9330c080a4507fcd1d00a8e152eea911bb",
            "0x01b1b07e0e51b8f07c2b9ddabe3da194f512cdc026167a8972b829c30d62f3ec",
            "0x012cf82361433496f77ccd8644c5498743ac11dad073d3012b793bde44357630",
          ],
          id: 6,
          img_url: "/braavos/pyramid.webp",
          name: "Starknet Pro Score by Braavos quests",
          hidden: false,
          num_of_winners: 9,
          token_decimals: 6,
        },
        {
          amount: 2500,
          token:
            "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8",
          expiry: 1706054399000,
          quests: [24],
          winner: [
            "0x06bed3897230f50a12f0ee3f1b7a2a9df92309c8afa071aa019f8157b79e1e37",
            "0x0796e9acd4c73145bc08d0c4ac0b8a501f8dc361fef2769264a28f8a454afe42",
            "0x05c520565cd3e5e257515915d817f82c052ff4fc8f347e30ea403ae207d3411e",
            "0x059a316d82b65b89477980144790dcb7f3951c3c90dac6c4bf90003f5158edc5",
            "0x07fd007fa58d4f3e2eba7505dfc29a212fd8a3d4c3da7784fa9cf76bbe04c4aa",
            "0x03775f9d24928a5089cd28cfffc7208bc19644e3cf1d606f0746aa6736de314a",
            "0x0001292e1d8426bf004a62f2010950e5ce8c0e6ea0e9c36d1a32de7b5268e8c6",
            "0x0309ac800cb25cfa10f5254d0f86d127f6510f1eebf6f36470a6fe0cc06530f6",
            "0x042512c2366989fccd92e10ca4c49b016d8ad9717ad8dc4f04d6fdb99f553154",
            "0x03e4318725f1a9987645d4e2c13260fc87a3e513b754145c9724212e0e8ac89a",
            "0x013539e0445e2ec6d86cc9a3cb6cbb229ebb708bd69ff10db422446ef06da94f",
            "0x03e43899ccae89f7dc69f6d090eaa115a438813072b14b309ebd264b01a0de0b",
            "0x01d33fd6c987951a33e96cb59008f849913203c481861c0bdab9cf32f2555d9c",
            "0x077912a4271093294b74030df361915f2f26581ba4ae6510b5fbb838134da8be",
            "0x01e8d357063ac3ce667abb39149771988232f40ad1efa6d66b63d315f0825fe4",
            "0x01865f2ec620c829430d4676316d40211ac5392b75728bb6b8e3713dd8d63ee4",
            "0x05d1522161b0161f7906f8e004141ab16e712745d17b590b4c30cbd9b7d174fb",
            "0x07787e1ed65eafae1e25dafcd73df74aa444de026426ef7b88d2f769f77eb8c9",
            "0x0238b62a0d058904c652919c54dd93a7af72f344e3f26e4116c2c7157cfd1e0d",
            "0x05c8b99d75b2badc274702f2231b57221c2c9113bc1bcc27fd6cf2a5b737ef47",
          ],
          id: 3,
          img_url: "/rhino/silverRhino.webp",
          name: "The Rhino Charge",
          hidden: false,
          num_of_winners: 25,
          token_decimals: 6,
        },
        {
          amount: 500,
          token:
            "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8",
          expiry: 1706633876113,
          quests: [105],
          winner: [
            "0x06c3fd41bdb9c3b6714fe2acf5646b57174ae097ed5cad8c4147b8599296a632",
            "0x07744cf63af0d8cef4a08e1676673fb283a6015ff9f4c02bc6cf4ff2c0d16aac",
            "0x0086aaaa5bcbe11d73210fd9a20090640b707385409138917666e1c708deba21",
            "0x052a8ff207b30fe16e870ab8bceb20f4fd7cb1c7fa7830b668788b6905f16aa8",
            "0x0432d7ff8a01715d65b8fd3d1e1f4bdb8731963f2b592a56b43d61e9c2d947ae",
          ],
          id: 4,
          img_url: "/braavos/zklend.webp",
          name: "Starknet Pro Score by Braavos quests",
          hidden: false,
          num_of_winners: 5,
          token_decimals: 6,
        },
        {
          amount: 2000,
          token:
            "0x0124aeb495b947201f5fac96fd1138e326ad86195b98df6dec9009158a533b49",
          expiry: 1708473540000,
          quests: [106],
          winner: [
            "0x062143769394e802f7c92406ac8e3d1adc28bbb814adab74247c972c4a98f31b",
            "0x045af7e51358e8cbb74ef76fc3ac72c855dbf89be871d99bca828ca34b448d75",
            "0x031865bcf526873197e475593e5e96f3ed940c6b218d61056fd287117b4ba3fb",
            "0x0693acd3391bf88dd600e1cbda74dac07080e14a848c2329271112701d88f03b",
            "0x013b1ac09f61edd28a7f360e8783e1738961ae76d06627f39177d184f04412be",
            "0x01e297a56404fecf26be5902a73b6a6321dec2ab77afbc2e576e8155033eb706",
            "0x06806e997ec25cbd3d03ecb7becc9ced140e4c2eef8b8e37d9fcf6d7763cd18f",
            "0x02188bd706f9ec09ffd9fc065b9e9ac47799264ef268f3822900da004be5f9f3",
            "0x03b9f58b3f4d57e9e0c1c5f6a9e6c7ef91682292bd0c4dce412f2315da3f1530",
            "0x077ab923cf41443f98cfa63cc3b30e86dc47f11f8d0a9f879bc29417dd3e3164",
          ],
          id: 7,
          img_url: "/braavos/realms.webp",
          name: "Starknet Pro Score by Braavos quests",
          hidden: false,
          num_of_winners: 12,
          token_decimals: 18,
        },
        {
          amount: 1000,
          token:
            "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
          expiry: 1718052414000,
          quests: [27],
          winner: null,
          id: 9,
          img_url: "/nostra/cigar.webp",
          name: "Nostra - Stake and Win",
          hidden: false,
          num_of_winners: 4,
          token_decimals: 18,
        },
      ],
    ];

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await getBoosts();
    expect(fetch).toHaveBeenCalledWith(`${API_URL}/boost/get_boosts`);

    expect(result).toEqual(mockData);
  });

  it("should handle when API returns empty array", async () => {
    const mockData = [];

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await getBoosts();
    expect(fetch).toHaveBeenCalledWith(`${API_URL}/boost/get_boosts`);
    expect(result).toHaveLength(0);
  });

  it("should handle when API returns no response", async () => {
    const mockData = undefined;

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await getBoosts();
    expect(fetch).toHaveBeenCalledWith(`${API_URL}/boost/get_boosts`);
    expect(result).toBeUndefined();
  });

  it("should handle when API returns response in unexpected format", async () => {
    const mockData = "Random unexpected response format";

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await getBoosts();
    expect(fetch).toHaveBeenCalledWith(`${API_URL}/boost/get_boosts`);

    expect(result).toEqual(mockData);
  });

  it("should handle fetch errors gracefully", async () => {
    const mockResponse = "Error while fetching boosts";
    fetch.mockResolvedValueOnce({
      json: () => Promise.reject(mockResponse),
    });

    const result = await getBoosts();
    expect(fetch).toHaveBeenCalledWith(`${API_URL}/boost/get_boosts`);
    expect(result).toBeUndefined();
  });
});

describe("getQuizById function", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it("should fetch and return data for a valid quiz id", async () => {
    const mockData = {
      name: "Nostra Quiz",
      desc: "Take part in our Quiz to test your knowledge about Nostra, and you'll have a chance to win an exclusive LaFamiglia Rose NFT as your reward.",
      questions: [
        {
          kind: "text_choice",
          layout: "default",
          question: "Which network is Nostra built on?",
          options: ["Scroll", "Starknet", "Binance Smart Chain", "zkSync"],
          image_for_layout: null,
        },
        {
          kind: "text_choice",
          layout: "default",
          question: "How many sub-accounts can a user open on Nostra?",
          options: ["10", "100", "255", "Unlimited"],
          image_for_layout: null,
        },
        {
          kind: "text_choice",
          layout: "default",
          question: "What is the minimum borrow amount for USDC on Nostra?",
          options: [
            "500 USDC",
            "100 USDC.",
            "3000 USDC.",
            "There is no minimum amount",
          ],
          image_for_layout: null,
        },
      ],
    };

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await getQuizById("nostra");
    expect(fetch).toHaveBeenCalledWith(`${API_URL}/get_quiz?id=nostra&addr=0`);
    expect(result).toEqual(mockData);
  });

  it("should handle when API returns no response", async () => {
    const mockData = undefined;

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await getQuizById("nostra");
    expect(fetch).toHaveBeenCalledWith(`${API_URL}/get_quiz?id=nostra&addr=0`);
    expect(result).toBeUndefined();
  });

  it("should handle undefined cases in parameters", async () => {
    const mockData = "Failed to deserialize query string: invalid character";

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await getQuizById(undefined);
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_quiz?id=undefined&addr=0`
    );
    expect(result).toEqual(mockData);
  });

  it("should handle null cases in parameters", async () => {
    const mockData = "Failed to deserialize query string: invalid character";

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await getQuizById(null, null);
    expect(fetch).toHaveBeenCalledWith(`${API_URL}/get_quiz?id=null&addr=null`);

    expect(result).toEqual(mockData);
  });

  it("should handle fetch errors gracefully", async () => {
    const mockResponse = "Quiz not found";

    fetch.mockResolvedValueOnce({
      json: () => Promise.reject(mockResponse),
    });

    const result = await getQuizById("invalid-id");
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_quiz?id=invalid-id&addr=0`
    );
    expect(result).toBeUndefined();
  });
});

describe("getQuestsInBoost function", () => {
  it("should handle unexpected params format", async () => {
    const mockResponse =
      "Failed to deserialize query string: invalid digit found in string";
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getQuestsInBoost("my-test-id");

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/boost/get_quests?boost_id=my-test-id`
    );

    expect(result).toEqual(mockResponse);
  });

  it("should handle empty params", async () => {
    const mockResponse =
      "Failed to deserialize query string: cannot parse integer from empty string";
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getQuestsInBoost("");

    expect(fetch).toHaveBeenCalledWith(`${API_URL}/boost/get_quests?boost_id=`);

    expect(result).toEqual(mockResponse);
  });

  it("should handle no quests in boost", async () => {
    const mockResponse = [];
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getQuestsInBoost("444");

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/boost/get_quests?boost_id=444`
    );

    expect(result).toEqual(mockResponse);
  });

  it("should fetch and return data for a valid boost id", async () => {
    const mockResponse = [
      {
        id: 78,
        name: "Ethereal Odyssey - Crossroads of Ether",
        desc: "Embark on an ethereal journey through the Crossroads of Ether, where the boundaries between realms blur.",
        additional_desc:
          "Unravel mysteries and forge alliances in this mystical quest.",
        issuer: "Ethereal Ventures",
        category: "Fantasy",
        rewards_endpoint: "quests/ethereal/claimable",
        logo: "/ethereal/favicon.ico",
        rewards_img: "/ethereal/ether_crossroads.webp",
        rewards_title: "Ethereal Amulet",
        rewards_description:
          "Obtain a powerful Ethereal Amulet upon completion.",
        rewards_nfts: [
          {
            img: "/ethereal/ether_crossroads.webp",
            level: 5,
          },
        ],
        img_card: "/ethereal/ether_crossroads.webp",
        title_card: "Ethereal Odyssey - Crossroads of Ether",
        hidden: false,
        disabled: false,
        expiry: 1794553600000,
        expiry_timestamp: null,
        mandatory_domain: "ethereal",
        expired: false,
        experience: 25,
        start_time: 1687862400000,
      },
    ];

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getQuestsInBoost("13");

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/boost/get_quests?boost_id=13`
    );
    expect(result).toEqual(mockResponse);
  });
});

describe("updateUniqueVisitors function", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it("should fetch unique visitor count", async () => {
    const mockData = {
      res: "true",
    };
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await updateUniqueVisitors("1");
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/unique_page_visit?page_id=1`
    );
    expect(result).toEqual(mockData);
  });

  it("should handle fetch errors gracefully", async () => {
    const mockResponse =
      "Failed to deserialize query string: missing field `page_id`";
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await updateUniqueVisitors();
    expect(result).toEqual(mockResponse);
  });
});

describe("getPendingBoostClaims function", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it("should fetch and return data for a valid address", async () => {
    const mockData = [
      {
        amount: 1500,
        token:
          "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8",
        expiry: 1705708740000,
        quests: [23],
        winner:
          "0x0610febaa5e58043927c8758edfaa3525ef59bac1f0b60e7b52b022084536363",
        img_url: "/rango/bridge.webp",
        id: 5,
        name: "The Rango Boost",
        num_of_winners: 6,
        token_decimals: 6,
      },
    ];
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await getPendingBoostClaims(
      "0x0610FebaA5E58043927c8758EdFAa3525Ef59bAC1f0b60E7b52b022084536363"
    );
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/boost/get_pending_claims?addr=0x0610FebaA5E58043927c8758EdFAa3525Ef59bAC1f0b60E7b52b022084536363`
    );
    expect(result).toEqual(mockData);
  });

  it("should handle undefined cases in parameters", async () => {
    const mockData =
      "Failed to deserialize query string: invalid digit found in string";
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await getPendingBoostClaims(undefined);
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/boost/get_pending_claims?addr=undefined`
    );
    expect(result).toEqual(mockData);
  });

  it("should handle null cases in parameters", async () => {
    const mockData = "Failed to deserialize query string: invalid character";
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await getPendingBoostClaims(null);
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/boost/get_pending_claims?addr=null`
    );
    expect(result).toEqual(mockData);
  });

  it("should handle fetch errors gracefully", async () => {
    const mockResponse =
      "Failed to deserialize query string: missing field `addr`";
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getPendingBoostClaims();
    expect(result).toEqual(mockResponse);
  });
});
