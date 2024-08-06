import {
  fetchQuestCategoryData,
  fetchLeaderboardToppers,
  fetchLeaderboardRankings,
  getQuestById,
  getBoostById,
  getBoosts,
  getQuizById,
  getTrendingQuests,
  getQuestsInBoost,
  getQuestActivityData,
  getUniqueVisitorCount,
  getTasksByQuestId,
  getDeployedTimeByAddress,
  getCompletedQuests,
  getQuestParticipants,
  getBoostedQuests,
  getQuestsParticipation,
  updateUniqueVisitors,
  getPendingBoostClaims,
  getQuestBoostClaimParams,
  getQuests,
  getCompletedBoosts,
  getLendingStats,
  getPairingStats,
  getAltProtocolStats,
  fetchBuildings,
  verifyUserAchievement,
  getDerivatesStats,
  getEligibleRewards
} from "@services/apiService";
import { describe } from "node:test";

const API_URL = process.env.NEXT_PUBLIC_API_LINK;

global.fetch = jest.fn();
console.log = jest.fn();

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

describe("getQuests", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it("should fetch and return quests data", async () => {
    const mockData = {
      "onboarding": [
        {
          "id": 1,
          "name": "Create your Starknet profile",
          "desc": "Onboard on Starknet by registering your Stark Name and verifying your social medias.",
          "additional_desc": null,
          "issuer": "Starknet ID",
          "category": "onboarding",
          "rewards_endpoint": "quests/starknetid/claimable",
          "logo": "/starknetid/favicon.ico",
          "rewards_img": "/starknetid/favicon.ico",
          "rewards_title": "1 NFT",
          "rewards_description": null,
          "rewards_nfts": [
            {
              "img": "/starknetid/nft1.webp",
              "level": 1
            }
          ],
          "img_card": "/starknetid/nft1.webp",
          "title_card": "Starknet Profile",
          "hidden": false,
          "disabled": false,
          "expiry": null,
          "expiry_timestamp": null,
          "mandatory_domain": "none",
          "expired": false,
          "experience": 50
        },
        {
          "id": 13,
          "name": "Starknet Giga Brain Quiz",
          "desc": "Starknet Quest Quiz Rounds: Quizzes for Starknet ecosystem enthusiasts, offering educational quizzes on Starknet-related topics with a chance to win exclusive NFTs, catering to all knowledge levels.",
          "additional_desc": null,
          "issuer": "Starknet Knowledge",
          "category": "onboarding",
          "rewards_endpoint": "quests/starknet/gigabrain/claimable",
          "logo": "/starknet/favicon.ico",
          "rewards_img": "/starknet/gigabrain.webp",
          "rewards_title": "1 NFT",
          "rewards_description": null,
          "rewards_nfts": [
            {
              "img": "/starknet/gigabrain.webp",
              "level": 1
            }
          ],
          "img_card": "/starknet/gigabrain.webp",
          "title_card": "Starknet Giga Brain Quiz",
          "hidden": false,
          "disabled": false,
          "expiry": null,
          "expiry_timestamp": null,
          "mandatory_domain": null,
          "expired": false,
          "experience": 10
        },
        {
          "id": 14,
          "name": "Account Abstraction Mastery Quiz",
          "desc": "Starknet Quest Quiz Rounds: Quizzes for Starknet ecosystem enthusiasts, offering educational quizzes on Starknet-related topics with a chance to win exclusive NFTs, catering to all knowledge levels.",
          "additional_desc": null,
          "issuer": "Starknet Knowledge",
          "category": "onboarding",
          "rewards_endpoint": "quests/starknet/aa_mastery/claimable",
          "logo": "/starknet/favicon.ico",
          "rewards_img": "/starknet/aa.webp",
          "rewards_title": "1 NFT",
          "rewards_description": null,
          "rewards_nfts": [
            {
              "img": "/starknet/aa.webp",
              "level": 1
            }
          ],
          "img_card": "/starknet/aa.webp",
          "title_card": "Account Abstraction Mastery Quiz",
          "hidden": false,
          "disabled": false,
          "expiry": null,
          "expiry_timestamp": null,
          "mandatory_domain": null,
          "expired": false,
          "experience": 10
        }
      ],
      "Nfts": [
        {
          "id": 15,
          "name": "Attentiveness Tree Quest.",
          "desc": "Focus Tree is a Starknet DApp that shields against digital distractions, helping users control their attention for healthier relationships with tech",
          "additional_desc": null,
          "issuer": "Focus Tree",
          "category": "Nfts",
          "rewards_endpoint": "quests/focustree/claimable",
          "logo": "/focustree/favicon.ico",
          "rewards_img": "/focustree/focustree.webp",
          "rewards_title": "1 NFT",
          "rewards_description": null,
          "rewards_nfts": [
            {
              "img": "/focustree/focustree.webp",
              "level": 1
            }
          ],
          "img_card": "/focustree/focustree.webp",
          "title_card": "Focus Tree - Attentiveness Tree Quest.",
          "hidden": false,
          "disabled": false,
          "expiry": null,
          "expiry_timestamp": null,
          "mandatory_domain": null,
          "expired": false,
          "experience": 10
        }
      ],
      "deFi": [
        {
          "id": 2,
          "name": "Starknet Padawan",
          "desc": "Become a Starknet Padawan by using the most popular decentralized exchange of Starknet.",
          "additional_desc": null,
          "issuer": "JediSwap",
          "category": "deFi",
          "rewards_endpoint": "quests/jediswap/claimable",
          "logo": "/jediswap/favicon.ico",
          "rewards_img": "/jediswap/favicon.ico",
          "rewards_title": "1 NFT",
          "rewards_description": null,
          "rewards_nfts": [
            {
              "img": "/jediswap/padawan.webp",
              "level": 1
            }
          ],
          "img_card": "/jediswap/padawan.webp",
          "title_card": "Starknet Padawan",
          "hidden": false,
          "disabled": false,
          "expiry": null,
          "expiry_timestamp": null,
          "mandatory_domain": null,
          "expired": false,
          "experience": 10
        },
        {
          "id": 9,
          "name": "Ekubo Concentration",
          "desc": "Ekubo, a next-gen AMM with concentrated liquidity on Starknet for great swapper execution and liquidity provider returns",
          "additional_desc": null,
          "issuer": "Ekubo",
          "category": "deFi",
          "rewards_endpoint": "quests/ekubo/claimable",
          "logo": "/ekubo/favicon.ico",
          "rewards_img": "/ekubo/favicon.ico",
          "rewards_title": "1 NFT",
          "rewards_description": null,
          "rewards_nfts": [
            {
              "img": "/ekubo/concentration.webp",
              "level": 1
            }
          ],
          "img_card": "/ekubo/concentration.webp",
          "title_card": "Ekubo Concentration",
          "hidden": false,
          "disabled": false,
          "expiry": null,
          "expiry_timestamp": null,
          "mandatory_domain": null,
          "expired": false,
          "experience": 10
        },
        {
          "id": 20,
          "name": "Nostra - LaFamiglia Rose",
          "desc": "Nostra, is a versatile liquidity protocol for lending and borrowing, built on Starknet",
          "additional_desc": null,
          "issuer": "Nostra",
          "category": "deFi",
          "rewards_endpoint": "quests/nostra/claimable",
          "logo": "/nostra/favicon.ico",
          "rewards_img": "/nostra/rose.webp",
          "rewards_title": "1 NFT",
          "rewards_description": null,
          "rewards_nfts": [
            {
              "img": "/nostra/rose.webp",
              "level": 1
            }
          ],
          "img_card": "/nostra/rose.webp",
          "title_card": "Nostra - LaFamiglia Rose",
          "hidden": false,
          "disabled": false,
          "expiry": null,
          "expiry_timestamp": null,
          "mandatory_domain": "root",
          "expired": false,
          "experience": 10
        }
      ]
    };

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await getQuests();
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_quests`);
    expect(result).toEqual(mockData);
  });

  it("should handle fetch errors", async () => {
    const mockResponse = "No quest found";

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getQuests();
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_quests`
    );
    expect(result).toEqual(mockResponse);
  });

  it("should handle undefined and null cases", async () => {
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(null),
    });

    const result = await getQuests();
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_quests`
    );
    expect(result).toBeNull();
  });

  it("should handle no response", async () => {
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(undefined),
    });

    const result = await getQuests();
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_quests`
    );
    expect(result).toBeUndefined();
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
      error: 0o0,
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

describe("getCompletedQuests", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it("should fetch and return completed quests", async () => {
    const mockDataRes = [12, 24, 36, 48, 69];
    const address = "ksdjiewmcoew";

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockDataRes),
    });

    const result = await getCompletedQuests(address);
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_completed_quests?addr=${address}`
    );

    expect(result).toEqual(mockDataRes);
  });

  it("should handle fetch with no response", async () => {
    const mockDataRes = null;
    const address = "ksdjiewmcoew";

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockDataRes),
    });

    const result = await getCompletedQuests(address);
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_completed_quests?addr=${address}`
    );

    expect(result).toEqual(mockDataRes);
  });

  it("should handle fetch with invalid response", async () => {
    const mockDataRes = "Invalid response";
    const address = "ksdjiewmcoew";

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockDataRes),
    });

    const result = await getCompletedQuests(address);
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_completed_quests?addr=${address}`
    );

    expect(result).toEqual(mockDataRes);
  });

  it("should handle fetch with invalid address", async () => {
    const mockDataRes = "Invalid address";
    const address = "2009cx-920.299z/w";

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockDataRes),
    });

    const result = await getCompletedQuests(address);
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_completed_quests?addr=${address}`
    );

    expect(result).toEqual(mockDataRes);
  });

  it("should handle fetch with empty address", async () => {
    const mockDataRes = "Empty address";
    const address = "";

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockDataRes),
    });

    const result = await getCompletedQuests(address);
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_completed_quests?addr=${address}`
    );
    expect(result).toEqual(mockDataRes);
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
        start_timestamp: null,
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
      `${API_URL}/get_quiz?id=undefined&addr=0`);
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
        start_timestamp: null,
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

describe("getQuestById function", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it("should return the quest data for a valid quest id", async function () {
    const mockData = {
      id: 1,
      name: "Create your Starknet profile",
      desc: "Onboard on Starknet by registering your Stark Name and verifying your social medias.",
      additional_desc: null,
      issuer: "Starknet ID",
      category: "onboarding",
      rewards_endpoint: "quests/starknetid/claimable",
      logo: "/starknetid/favicon.ico",
      rewards_img: "/starknetid/favicon.ico",
      rewards_title: "1 NFT",
      rewards_description: null,
      rewards_nfts: [{ img: "/starknetid/nft1.webp", level: 1 }],
      img_card: "/starknetid/nft1.webp",
      title_card: "Starknet Profile",
      hidden: false,
      disabled: false,
      expiry: null,
      expiry_timestamp: null,
      mandatory_domain: "none",
      expired: false,
      experience: 50,
    };

    fetch.mockResolvedValueOnce(mockData);

    let queryId = "1";

    try {
      await getQuestById(queryId);
    } catch (error) {
      expect(fetch).toHaveBeenCalledWith(`${API_URL}/get_quest?id=${queryId}`);
      expect(error.message).toEqual("Error fetching quest data: undefined");
    }
  });

  it("should handle when API returns no response", async () => {
    const mockData = {
      ok: false,
      status: 500,
    };
    fetch.mockResolvedValueOnce(mockData);

    try {
      await getQuestById("boost-id");
    } catch (error) {
      expect(fetch).toHaveBeenCalledWith(`${API_URL}/get_quest?id=boost-id`);
      expect(error.message).toEqual("Error fetching quest data: 500");
    }
  });

  it("should handle when API returns response in unexpected format", async () => {
    const mockData =
      "Failed to deserialize query string: invalid digit found in string";
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    try {
      await getQuestById("boost-id");
    } catch (error) {
      expect(fetch).toHaveBeenCalledWith(`${API_URL}/get_quest?id=boost-id`);
      expect(error.message).toEqual("Failed to parse quest data");
    }
  });

  it("should handle undefined cases in parameters", async () => {
    const mockData =
      "Failed to deserialize query string: invalid digit found in string";
    fetch.mockResolvedValueOnce(mockData);

    try {
      await getQuestById(undefined);
    } catch (error) {
      expect(fetch).toHaveBeenCalledWith(`${API_URL}/get_quest?id=undefined`);
      expect(error.message).toEqual("Error fetching quest data: undefined");
    }
  });

  it("should handle null cases in parameters", async () => {
    const mockData =
      "Failed to deserialize query string: invalid digit found in string";
    fetch.mockResolvedValueOnce(mockData);

    try {
      await getQuestById(null);
    } catch (error) {
      expect(fetch).toHaveBeenCalledWith(`${API_URL}/get_quest?id=null`);
      expect(error.message).toEqual("Error fetching quest data: undefined");
    }
  });
});

describe("getQuestBoostClaimParams function", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it("should fetch and return data for a valid address and boost id", async () => {
    const mockData = {
      address:
        "0x0610febaa5e58043927c8758edfaa3525ef59bac1f0b60e7b52b022084536363",
      r: "2328575043184937723727467456938795290152111035640589440945775742296008884937",
      s: "2314906404127565163552396326236777531502314327598120407071208784203310551837",
    };

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await getQuestBoostClaimParams(
      5,
      "0x0610FebaA5E58043927c8758EdFAa3525Ef59bAC1f0b60E7b52b022084536363"
    );
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/boost/get_claim_params?boost_id=5&addr=0x0610FebaA5E58043927c8758EdFAa3525Ef59bAC1f0b60E7b52b022084536363`
    );
    expect(result).toEqual(mockData);
  });

  it("should handle undefined cases in parameters", async () => {
    const mockData =
      "Failed to deserialize query string: invalid digit found in string";
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await getQuestBoostClaimParams(undefined, undefined);
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/boost/get_claim_params?boost_id=undefined&addr=undefined`
    );
    expect(result).toEqual(mockData);
  });

  it("should handle null cases in parameters", async () => {
    const mockData =
      "Failed to deserialize query string: invalid digit found in string";
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await getQuestBoostClaimParams(null, null);
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/boost/get_claim_params?boost_id=null&addr=null`
    );
    expect(result).toEqual(mockData);
  });

  it("should handle fetch errors gracefully", async () => {
    const mockResponse =
      "Failed to deserialize query string: missing field `boost_id`";
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getQuestBoostClaimParams();
    expect(result).toEqual(mockResponse);
  });
});

describe('getCompletedBoosts function', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('should fetch and return data for a valid address', async () => {
    const mockDataResponse = [23, 104, 24, 105];
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockDataResponse),
    });

    const result = await getCompletedBoosts('0x0610FebaA5E58043927c8758EdFAa3525Ef59bAC1f0b60E7b52b022084536363');
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/boost/get_completed_boosts?addr=0x0610FebaA5E58043927c8758EdFAa3525Ef59bAC1f0b60E7b52b022084536363`
    );

    expect(result).toEqual(mockDataResponse);
  });

  it('should fetch and return data in an invalid format', async () => {
    const mockDataResponse =
      'Failed to deserialize query string: invalid character';
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockDataResponse),
    });

    const result = await getCompletedBoosts('string');
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/boost/get_completed_boosts?addr=string`
    );

    expect(result).toEqual(mockDataResponse);
  });

  it('should handle fetch with handle error gracefully', async () => {

    const mockResponse = 'Boost with id 0x0610FebaA5E58043927c8758EdFAa3525Ef59bAC1f0b60E7b52b022084536363 not found';

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getCompletedBoosts('');
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/boost/get_completed_boosts?addr=`
    );

    expect(result).toEqual(mockResponse);

  });

  it('should handle fetch with empty response', async () => {
    const mockResponse = [];

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getCompletedBoosts('0');
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/boost/get_completed_boosts?addr=0`
    );
    expect(result).toEqual(mockResponse);
  });

  it('should handle fetch with undefined result', async () => {
    const mockResponse = undefined;

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getCompletedBoosts('0x0610FebaA5E58043927c8758EdFAa3525Ef59bAC1f0b60E7b52b022084536363');
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/boost/get_completed_boosts?addr=0x0610FebaA5E58043927c8758EdFAa3525Ef59bAC1f0b60E7b52b022084536363`
    );
    expect(result).toBeUndefined();
  });
});

describe("verifyUserAchievement function", () => {

  beforeEach(() => {
    fetch.mockClear();
  });

  it("should fetch and return data for a valid verifyType, address, and achievementId", async () => {
    const mockData = {
      id: 1,
      name: "Achievement Name",
      status: "verified",
    };
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });
    const result = await verifyUserAchievement({
      verifyType: "category",
      address: "0x0610FebaA5E58043927c8758EdFAa3525Ef59bAC1f0b60E7b52b022084536363",
      achievementId: 1,
    });

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/achievements/verify_category?addr=0x0610FebaA5E58043927c8758EdFAa3525Ef59bAC1f0b60E7b52b022084536363&id=1`
    );
    expect(result).toEqual(mockData);
  });

  it("should handle fetch errors gracefully", async () => {
    fetch.mockRejectedValueOnce(new Error("Network Error"));

    const result = await verifyUserAchievement({
      verifyType: "category",
      address: "0x123",
      achievementId: 1,
    });

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/achievements/verify_category?addr=0x123&id=1`
    );
    expect(result).toBeUndefined();
  });

  it("should handle invalid verifyType gracefully", async () => {
    fetch.mockRejectedValueOnce(new Error("Invalid verifyType"));

    const result = await verifyUserAchievement({
      verifyType: "invalidType",
      address: "0x0610FebaA5E58043927c8758EdFAa3525Ef59bAC1f0b60E7b52b022084536363",
      achievementId: 1,
    });

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/achievements/verify_invalidType?addr=0x0610FebaA5E58043927c8758EdFAa3525Ef59bAC1f0b60E7b52b022084536363&id=1`
    );
    expect(result).toBeUndefined();
  });

  it("should handle invalid address gracefully", async () => {
    fetch.mockRejectedValueOnce(new Error("Invalid address"));

    const result = await verifyUserAchievement({
      verifyType: "category",
      address: "invalidAddress",
      achievementId: 1,
    });

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/achievements/verify_category?addr=invalidAddress&id=1`
    );
    expect(result).toBeUndefined();
  });

  it("should handle invalid achievementId gracefully", async () => {
    fetch.mockRejectedValueOnce(new Error("Invalid achievementId"));

    const result = await verifyUserAchievement({
      verifyType: "category",
      address: "0x0610FebaA5E58043927c8758EdFAa3525Ef59bAC1f0b60E7b52b022084536363",
      achievementId: -1,
    });

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/achievements/verify_category?addr=0x0610FebaA5E58043927c8758EdFAa3525Ef59bAC1f0b60E7b52b022084536363&id=-1`
    );
    expect(result).toBeUndefined();
  });
});

describe("fetchBuildings function", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it("should fetch and return buildings data for valid filteredAssets", async () => {
    const mockData = [
      { id: 1, name: "Xplorer Tower", description: "Argent building level 1", entity: "NFT_ArgentMain_4x3_H3_1", level: "1", img_url: "achievements/argent/argent_1.webp" },
      { id: 2, name: "Xplorer Tower", description: "Argent building level 2", entity: "NFT_ArgentMain_4x3_H4_2", level: "2", img_url: "achievements/argent/argent_2.webp" },
    ];

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await fetchBuildings([1, 2]);

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/achievements/fetch_buildings?ids=1,2`
    );
    expect(result).toEqual(mockData);
  });

  it("should handle fetch errors gracefully", async () => {
    fetch.mockRejectedValueOnce(new Error("Network Error"));

    const result = await fetchBuildings([1, 2]);

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/achievements/fetch_buildings?ids=1,2`
    );
    expect(result).toBeUndefined();
  });

  it("should handle empty filteredAssets array gracefully", async () => {
    const mockData = [];
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await fetchBuildings([]);

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/achievements/fetch_buildings?ids=`
    );
    expect(result).toEqual(mockData);
  });

  it("should handle non-existent asset IDs gracefully", async () => {
    const mockData = [];
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await fetchBuildings([999, 1000]);

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/achievements/fetch_buildings?ids=999,1000`
    );
    expect(result).toEqual(mockData);
  });

  it("should handle partial success gracefully", async () => {
    const mockData = [
      { id: 1, name: "Xplorer Tower", description: "Argent building level 1", entity: "NFT_ArgentMain_4x3_H3_1", level: "1", img_url: "achievements/argent/argent_1.webp" }
    ];
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await fetchBuildings([1, 999]);

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/achievements/fetch_buildings?ids=1,999`
    );
    expect(result).toEqual(mockData);
  });
});


describe('getLendingStats function', () => {
  beforeEach(() => {
    fetch.mockClear();
  });
  it('should fetch and return lend stats', async () => {
    const mockData = {
      "zkLend": {
        "USDT": {
          "date": "2024-07-30",
          "allocation": 1155.78,
          "supply_usd": 2134546.56596344,
          "non_recursive_supply_usd": 2079341.78475195,
          "non_recursive_revenue_usd": 171.512254173623,
          "strk_grant_apr_ts": 0.0965119890775774,
          "strk_grant_apr_nrs": 0.099074301478734
        },
        "ETH": {
          "date": "2024-07-30",
          "allocation": 8234.62,
          "supply_usd": 16407571.9452803,
          "non_recursive_supply_usd": 15868539.9473565,
          "non_recursive_revenue_usd": 275.603062903866,
          "strk_grant_apr_ts": 0.0894565684211301,
          "strk_grant_apr_nrs": 0.0924952823143692
        },
        "STRK": {
          "date": "2024-07-30",
          "allocation": 8324.58,
          "supply_usd": 12061271.8822505,
          "non_recursive_supply_usd": 11830302.3454334,
          "non_recursive_revenue_usd": 66.9754240945918,
          "strk_grant_apr_ts": 0.123021812977996,
          "strk_grant_apr_nrs": 0.125423635884314
        },
        "USDC": {
          "date": "2024-07-30",
          "allocation": 3124.45,
          "supply_usd": 5756918.41280176,
          "non_recursive_supply_usd": 5516540.65323769,
          "non_recursive_revenue_usd": 672.870620705265,
          "strk_grant_apr_ts": 0.096737759505561,
          "strk_grant_apr_nrs": 0.10095301093882
        },
        "DAI": {
          "date": "2024-07-30",
          "allocation": 53.85,
          "supply_usd": 107628.025448295,
          "non_recursive_supply_usd": 97365.3927203476,
          "non_recursive_revenue_usd": 7.01736123538275,
          "strk_grant_apr_ts": 0.0891791942672291,
          "strk_grant_apr_nrs": 0.0985789747453661
        }
      },
      "Vesu": {
        "USDC": {
          "date": "2024-07-30",
          "allocation": 456.2,
          "supply_usd": 698680.693586811,
          "non_recursive_supply_usd": 698680.693586811,
          "non_recursive_revenue_usd": 85.878125891821,
          "strk_grant_apr_ts": 0.116383397888171,
          "strk_grant_apr_nrs": 0.116383397888171
        },
        "ETH": {
          "date": "2024-07-30",
          "allocation": 1109.42,
          "supply_usd": 1906267.55539434,
          "non_recursive_supply_usd": 1906267.55539434,
          "non_recursive_revenue_usd": 0.320845514547291,
          "strk_grant_apr_ts": 0.103734823621959,
          "strk_grant_apr_nrs": 0.103734823621959
        },
        "USDT": {
          "date": "2024-07-30",
          "allocation": 109.03,
          "supply_usd": 161625.245772552,
          "non_recursive_supply_usd": 161625.245772552,
          "non_recursive_revenue_usd": 31.2247470126082,
          "strk_grant_apr_ts": 0.120236186665353,
          "strk_grant_apr_nrs": 0.120236186665353
        },
        "STRK": {
          "date": "2024-07-30",
          "allocation": 1293.79,
          "supply_usd": 1729495.09949268,
          "non_recursive_supply_usd": 1729495.09949268,
          "non_recursive_revenue_usd": 0.034281872593972,
          "strk_grant_apr_ts": 0.133339389519562,
          "strk_grant_apr_nrs": 0.133339389519562
        }
      },
      "Hashstack": {
        "ETH": {
          "date": "2024-07-30",
          "allocation": 261.07,
          "supply_usd": 219327.686436547,
          "non_recursive_supply_usd": 219327.686436547,
          "non_recursive_revenue_usd": 16.6373237477505,
          "strk_grant_apr_ts": 0.212165457401,
          "strk_grant_apr_nrs": 0.212165457401
        },
        "STRK": {
          "date": "2024-07-30",
          "allocation": 289.43,
          "supply_usd": 266264.087949218,
          "non_recursive_supply_usd": 266264.087949218,
          "non_recursive_revenue_usd": 31.0804644721856,
          "strk_grant_apr_ts": 0.193749048928578,
          "strk_grant_apr_nrs": 0.193749048928578
        },
        "USDC": {
          "date": "2024-07-30",
          "allocation": 97.61,
          "supply_usd": 98957.2346780245,
          "non_recursive_supply_usd": 98957.2346780245,
          "non_recursive_revenue_usd": 23.7736671515834,
          "strk_grant_apr_ts": 0.175819282273581,
          "strk_grant_apr_nrs": 0.175819282273581
        },
        "USDT": {
          "date": "2024-07-30",
          "allocation": 83.19,
          "supply_usd": 89193.5285063299,
          "non_recursive_supply_usd": 89193.5285063299,
          "non_recursive_revenue_usd": 10.5515436997449,
          "strk_grant_apr_ts": 0.166248965029782,
          "strk_grant_apr_nrs": 0.166248965029782
        }
      },
      "Nostra": {
        "DAI": {
          "date": "2024-07-30",
          "allocation": 21.9,
          "supply_usd": 49753.9746624659,
          "non_recursive_supply_usd": 49753.9746624659,
          "non_recursive_revenue_usd": 4.60332991503369,
          "strk_grant_apr_ts": 0.0784479305778864,
          "strk_grant_apr_nrs": 0.0784479305778864
        },
        "USDT": {
          "date": "2024-07-30",
          "allocation": 10691.57,
          "supply_usd": 24425628.607175,
          "non_recursive_supply_usd": 24097329.2611507,
          "non_recursive_revenue_usd": 2638.05043069004,
          "strk_grant_apr_ts": 0.0780205476872565,
          "strk_grant_apr_nrs": 0.0790834909912467
        },
        "STRK": {
          "date": "2024-07-30",
          "allocation": 27152.13,
          "supply_usd": 40341135.2680199,
          "non_recursive_supply_usd": 38869235.0787819,
          "non_recursive_revenue_usd": 265.760952438547,
          "strk_grant_apr_ts": 0.119968970764148,
          "strk_grant_apr_nrs": 0.12451195573446
        },
        "ETH": {
          "date": "2024-07-30",
          "allocation": 48016.21,
          "supply_usd": 97003083.6109643,
          "non_recursive_supply_usd": 94623728.8471154,
          "non_recursive_revenue_usd": 211.224891604615,
          "strk_grant_apr_ts": 0.0882298391354435,
          "strk_grant_apr_nrs": 0.0904484167651596
        },
        "USDC": {
          "date": "2024-07-30",
          "allocation": 10727.13,
          "supply_usd": 25361631.1513156,
          "non_recursive_supply_usd": 24159189.1014251,
          "non_recursive_revenue_usd": 2683.38067990394,
          "strk_grant_apr_ts": 0.0753909925721956,
          "strk_grant_apr_nrs": 0.0791433246256933
        }
      },
      "Nimbora": {
        "DAI": {
          "date": "2024-06-12",
          "allocation": 288.87,
          "supply_usd": 689602.713373783,
          "non_recursive_supply_usd": 689602.713373783,
          "non_recursive_revenue_usd": 199.355910889537,
          "strk_grant_apr_ts": 0.163747447396196,
          "strk_grant_apr_nrs": 0.163747447396196
        },
        "ETH": {
          "date": "2024-06-12",
          "allocation": 142.36,
          "supply_usd": 208628.042990969,
          "non_recursive_supply_usd": 208628.042990969,
          "non_recursive_revenue_usd": 0,
          "strk_grant_apr_ts": 0.266728930899078,
          "strk_grant_apr_nrs": 0.266728930899078
        }
      }

    };
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await getLendingStats();
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/discover/defi/get_lend_stats`
    );

    expect(result).toEqual(mockData);
  });
  it('should return null', async () => {
    fetch.mockResolvedValueOnce({
      json: () => Promise.reject(null),
    });

    const result = await getLendingStats();
    expect(fetch).toHaveBeenCalledWith(`${API_URL}/discover/defi/get_lend_stats`);

    expect(result).toBeNull();
  });
});

describe('getPairingStats function', () => {

  beforeEach(() => {
    fetch.mockClear();
  });


  it('should fetch and return pairing stats', async () => {
    const mockData = {
      "Jediswap_v1": {
        "USDC/USDT": {
          "date": "2024-07-30",
          "allocation": 28.53,
          "token0_allocation": 14.26,
          "token1_allocation": 14.27,
          "thirty_day_realized_volatility": 0.0006892979915869,
          "tvl_usd": 137635.594424658,
          "apr": 0.0369477596492828
        },
        "WSTETH/ETH": {
          "date": "2024-07-30",
          "allocation": 90.09,
          "token0_allocation": 45.05,
          "token1_allocation": 45.04,
          "thirty_day_realized_volatility": 0.0019242246914148,
          "tvl_usd": 75892.5303911264,
          "apr": 0.211589539956646
        },
        "ETH/USDC": {
          "date": "2024-07-30",
          "allocation": 172.97,
          "token0_allocation": 77.66,
          "token1_allocation": 95.31,
          "thirty_day_realized_volatility": 0.130739648151866,
          "tvl_usd": 901238.662605129,
          "apr": 0.0342091715051623
        },
        "STRK/ETH": {
          "date": "2024-07-30",
          "allocation": 109.49,
          "token0_allocation": 56.14,
          "token1_allocation": 53.35,
          "thirty_day_realized_volatility": 0.266765746136404,
          "tvl_usd": 117595.028541368,
          "apr": 0.165959651664632
        },
        "STRK/USDC": {
          "date": "2024-07-30",
          "allocation": 52.57,
          "token0_allocation": 26.31,
          "token1_allocation": 26.26,
          "thirty_day_realized_volatility": 0.307358894709532,
          "tvl_usd": 34881.0354411652,
          "apr": 0.268626509621525
        },
        "Discretionary": {
          "date": "2024-07-30",
          "allocation": 0,
          "token0_allocation": 0,
          "token1_allocation": 0,
          "thirty_day_realized_volatility": 0,
          "tvl_usd": 0,
          "apr": 0
        },
        "WBTC/ETH": {
          "date": "2024-07-30",
          "allocation": 33.94,
          "token0_allocation": 17.01,
          "token1_allocation": 16.93,
          "thirty_day_realized_volatility": 0.0692347282729821,
          "tvl_usd": 83299.8000242122,
          "apr": 0.0726262149053067
        }
      },
      "StarkDefi": {
        "STRK/ETH": {
          "date": "2024-07-30",
          "allocation": 104.07,
          "token0_allocation": 53.21,
          "token1_allocation": 50.86,
          "thirty_day_realized_volatility": 0.266765746136404,
          "tvl_usd": 99300.5139866587,
          "apr": 0.186804582295853
        },
        "STRK/USDC": {
          "date": "2024-07-30",
          "allocation": 56.66,
          "token0_allocation": 28.36,
          "token1_allocation": 28.3,
          "thirty_day_realized_volatility": 0.307358894709532,
          "tvl_usd": 45294.9301189847,
          "apr": 0.222971073030756
        },
        "USDC/USDT": {
          "date": "2024-07-30",
          "allocation": 42.95,
          "token0_allocation": 20.06,
          "token1_allocation": 22.89,
          "thirty_day_realized_volatility": 0.0006892979915869,
          "tvl_usd": 215734.938307865,
          "apr": 0.0354864922371831
        },
        "ETH/USDC": {
          "date": "2024-07-30",
          "allocation": 64.71,
          "token0_allocation": 30.86,
          "token1_allocation": 33.85,
          "thirty_day_realized_volatility": 0.130739648151866,
          "tvl_usd": 152926.403201045,
          "apr": 0.0754278330413139
        },
        "WBTC/ETH": {
          "date": "2024-07-30",
          "allocation": 29.61,
          "token0_allocation": 14.81,
          "token1_allocation": 14.8,
          "thirty_day_realized_volatility": 0.0692347282729821,
          "tvl_usd": 8017.42999162902,
          "apr": 0.658384883466777
        },
        "WSTETH/ETH": {
          "date": "2024-07-30",
          "allocation": 90.09,
          "token0_allocation": 45.05,
          "token1_allocation": 45.04,
          "thirty_day_realized_volatility": 0.0019242246914148,
          "tvl_usd": 75498.8352072284,
          "apr": 0.212692197394387
        },
        "Discretionary": {
          "date": "2024-07-30",
          "allocation": 0,
          "token0_allocation": 0,
          "token1_allocation": 0,
          "thirty_day_realized_volatility": 0,
          "tvl_usd": 0,
          "apr": 0
        }
      },
      "Ekubo": {
        "STRK/USDC": {
          "date": "2024-07-30",
          "allocation": 3355.09,
          "token0_allocation": 1408.34,
          "token1_allocation": 1946.75,
          "thirty_day_realized_volatility": 0.307358894709532,
          "tvl_usd": 2276530.28544131,
          "apr": 0.262690143185486
        },
        "ETH/USDC": {
          "date": "2024-07-30",
          "allocation": 9367.62,
          "token0_allocation": 4838.28,
          "token1_allocation": 4529.34,
          "thirty_day_realized_volatility": 0.130739648151866,
          "tvl_usd": 6902120.21108474,
          "apr": 0.241913324325029
        },
        "Discretionary": {
          "date": "2024-07-30",
          "allocation": 0,
          "token0_allocation": 0,
          "token1_allocation": 0,
          "thirty_day_realized_volatility": 0,
          "tvl_usd": 0,
          "apr": 0
        },
        "WSTETH/ETH": {
          "date": "2024-07-30",
          "allocation": 31187.87,
          "token0_allocation": 15569.84,
          "token1_allocation": 15618.03,
          "thirty_day_realized_volatility": 0.0019242246914148,
          "tvl_usd": 48315627.2322319,
          "apr": 0.115056524163856
        },
        "USDC/DAI": {
          "date": "2024-07-30",
          "allocation": 864.56,
          "token0_allocation": 464.71,
          "token1_allocation": 399.85,
          "thirty_day_realized_volatility": 0.0005949565407039,
          "tvl_usd": 945554.419539945,
          "apr": 0.162975420116551
        },
        "WBTC/ETH": {
          "date": "2024-07-30",
          "allocation": 1131.31,
          "token0_allocation": 585.98,
          "token1_allocation": 545.33,
          "thirty_day_realized_volatility": 0.0692347282729821,
          "tvl_usd": 1595754.3837092,
          "apr": 0.126365536191105
        },
        "STRK/ETH": {
          "date": "2024-07-30",
          "allocation": 13871.3,
          "token0_allocation": 5893.55,
          "token1_allocation": 7977.75,
          "thirty_day_realized_volatility": 0.266765746136404,
          "tvl_usd": 7776216.79195961,
          "apr": 0.317952275347974
        },
        "USDC/USDT": {
          "date": "2024-07-30",
          "allocation": 9581.26,
          "token0_allocation": 4854.36,
          "token1_allocation": 4726.9,
          "thirty_day_realized_volatility": 0.0006892979915869,
          "tvl_usd": 11450292.0512583,
          "apr": 0.149148657406872
        }
      },
      "Sithswap": {
        "WSTETH/ETH": {
          "date": "2024-07-30",
          "allocation": 90.04,
          "token0_allocation": 45.02,
          "token1_allocation": 45.02,
          "thirty_day_realized_volatility": 0.0019242246914148,
          "tvl_usd": 6614.2732758411,
          "apr": 2.42639496987274
        },
        "Discretionary": {
          "date": "2024-07-30",
          "allocation": 0,
          "token0_allocation": 0,
          "token1_allocation": 0,
          "thirty_day_realized_volatility": 0,
          "tvl_usd": 0,
          "apr": 0
        },
        "STRK/ETH": {
          "date": "2024-07-30",
          "allocation": 79.8,
          "token0_allocation": 40.1,
          "token1_allocation": 39.69,
          "thirty_day_realized_volatility": 0.266765746136404,
          "tvl_usd": 17384.9632242172,
          "apr": 0.818141383313582
        },
        "ETH/USDC": {
          "date": "2024-07-30",
          "allocation": 85.96,
          "token0_allocation": 40.05,
          "token1_allocation": 45.92,
          "thirty_day_realized_volatility": 0.130739648151866,
          "tvl_usd": 299810.916095732,
          "apr": 0.0511069463004212
        },
        "WBTC/ETH": {
          "date": "2024-07-30",
          "allocation": 29.68,
          "token0_allocation": 14.85,
          "token1_allocation": 14.84,
          "thirty_day_realized_volatility": 0.0692347282729821,
          "tvl_usd": 9237.72475655836,
          "apr": 0.572766084727652
        },
        "STRK/USDC": {
          "date": "2024-07-30",
          "allocation": 42.87,
          "token0_allocation": 21.44,
          "token1_allocation": 21.43,
          "thirty_day_realized_volatility": 0.307358894709532,
          "tvl_usd": 10192.6286466523,
          "apr": 0.749616209341733
        },
        "USDC/USDT": {
          "date": "2024-07-30",
          "allocation": 42.17,
          "token0_allocation": 22.4,
          "token1_allocation": 19.76,
          "thirty_day_realized_volatility": 0.0006892979915869,
          "tvl_usd": 199297.26508517,
          "apr": 0.0377122529564746
        }
      },
      "10kSwap": {
        "STRK/ETH": {
          "date": "2024-07-30",
          "allocation": 91.63,
          "token0_allocation": 46.49,
          "token1_allocation": 45.14,
          "thirty_day_realized_volatility": 0.266765746136404,
          "tvl_usd": 57314.5215299952,
          "apr": 0.284958644561957
        },
        "ETH/USDC": {
          "date": "2024-07-30",
          "allocation": 173.58,
          "token0_allocation": 77.92,
          "token1_allocation": 95.66,
          "thirty_day_realized_volatility": 0.130739648151866,
          "tvl_usd": 905462.913247784,
          "apr": 0.0341698733185086
        },
        "Discretionary": {
          "date": "2024-07-30",
          "allocation": 0,
          "token0_allocation": 0,
          "token1_allocation": 0,
          "thirty_day_realized_volatility": 0,
          "tvl_usd": 0,
          "apr": 0
        },
        "STRK/USDC": {
          "date": "2024-07-30",
          "allocation": 46.41,
          "token0_allocation": 23.22,
          "token1_allocation": 23.19,
          "thirty_day_realized_volatility": 0.307358894709532,
          "tvl_usd": 19219.7529185072,
          "apr": 0.430437656821601
        },
        "USDC/USDT": {
          "date": "2024-07-30",
          "allocation": 28.51,
          "token0_allocation": 14.25,
          "token1_allocation": 14.26,
          "thirty_day_realized_volatility": 0.0006892979915869,
          "tvl_usd": 77485.619955483,
          "apr": 0.0655807029071588
        },
        "WBTC/ETH": {
          "date": "2024-07-30",
          "allocation": 32.94,
          "token0_allocation": 16.5,
          "token1_allocation": 16.44,
          "thirty_day_realized_volatility": 0.0692347282729821,
          "tvl_usd": 65957.0566607173,
          "apr": 0.0890289831277682
        },
        "USDC/DAI": {
          "date": "2024-07-30",
          "allocation": 3.44,
          "token0_allocation": 1.72,
          "token1_allocation": 1.72,
          "thirty_day_realized_volatility": 0.0005949565407039,
          "tvl_usd": 24142.5768673609,
          "apr": 0.02539048972624
        }
      },
      "Haiko": {
        "STRK/ETH": {
          "date": "2024-07-30",
          "allocation": 468,
          "token0_allocation": 360.89,
          "token1_allocation": 107.12,
          "thirty_day_realized_volatility": 0.266765746136404,
          "tvl_usd": 184848.515465523,
          "apr": 0.451281409905123
        },
        "STRK/USDC": {
          "date": "2024-07-30",
          "allocation": 216.6,
          "token0_allocation": 176.16,
          "token1_allocation": 40.44,
          "thirty_day_realized_volatility": 0.307358894709532,
          "tvl_usd": 78191.4723915738,
          "apr": 0.493751006095619
        },
        "WSTETH/ETH": {
          "date": "2024-07-30",
          "allocation": 112.12,
          "token0_allocation": 59.23,
          "token1_allocation": 52.9,
          "thirty_day_realized_volatility": 0.0019242246914148,
          "tvl_usd": 95599.4362232835,
          "apr": 0.209052356151181
        },
        "USDC/USDT": {
          "date": "2024-07-30",
          "allocation": 126.3,
          "token0_allocation": 28.54,
          "token1_allocation": 97.76,
          "thirty_day_realized_volatility": 0.0006892979915869,
          "tvl_usd": 205049.521244907,
          "apr": 0.10979237551452
        },
        "WBTC/ETH": {
          "date": "2024-07-30",
          "allocation": 169.35,
          "token0_allocation": 81.44,
          "token1_allocation": 87.91,
          "thirty_day_realized_volatility": 0.0692347282729821,
          "tvl_usd": 119939.741876529,
          "apr": 0.251674486076943
        },
        "ETH/USDC": {
          "date": "2024-07-30",
          "allocation": 357.74,
          "token0_allocation": 141.4,
          "token1_allocation": 216.34,
          "thirty_day_realized_volatility": 0.130739648151866,
          "tvl_usd": 137384.25539356,
          "apr": 0.464131348567974
        },
        "Discretionary": {
          "date": "2024-07-30",
          "allocation": 0,
          "token0_allocation": 0,
          "token1_allocation": 0,
          "thirty_day_realized_volatility": 0,
          "tvl_usd": 0,
          "apr": 0
        }
      },
      "Jediswap_v2": {
        "Discretionary": {
          "date": "2024-07-30",
          "allocation": 0,
          "token0_allocation": 0,
          "token1_allocation": 0,
          "thirty_day_realized_volatility": 0,
          "tvl_usd": 0,
          "apr": 0
        },
        "STRK/USDC": {
          "date": "2024-07-30",
          "allocation": 62.05,
          "token0_allocation": 36.58,
          "token1_allocation": 25.47,
          "thirty_day_realized_volatility": 0.307358894709532,
          "tvl_usd": 16403.8661577339,
          "apr": 0.67418934204284
        },
        "STRK/ETH": {
          "date": "2024-07-30",
          "allocation": 107.63,
          "token0_allocation": 61.47,
          "token1_allocation": 46.16,
          "thirty_day_realized_volatility": 0.266765746136404,
          "tvl_usd": 52141.8103092148,
          "apr": 0.367920298276295
        },
        "USDC/DAI": {
          "date": "2024-07-30",
          "allocation": 315.92,
          "token0_allocation": 125.19,
          "token1_allocation": 190.72,
          "thirty_day_realized_volatility": 0.0005949565407039,
          "tvl_usd": 213941.646776735,
          "apr": 0.263202468510155
        },
        "WBTC/ETH": {
          "date": "2024-07-30",
          "allocation": 37.45,
          "token0_allocation": 15.24,
          "token1_allocation": 22.22,
          "thirty_day_realized_volatility": 0.0692347282729821,
          "tvl_usd": 23956.9332579708,
          "apr": 0.278661407761409
        },
        "USDC/USDT": {
          "date": "2024-07-30",
          "allocation": 50.53,
          "token0_allocation": 21.29,
          "token1_allocation": 29.23,
          "thirty_day_realized_volatility": 0.0006892979915869,
          "tvl_usd": 47356.531742389,
          "apr": 0.190180052635965
        },
        "ETH/USDC": {
          "date": "2024-07-30",
          "allocation": 64.63,
          "token0_allocation": 38.17,
          "token1_allocation": 26.46,
          "thirty_day_realized_volatility": 0.130739648151866,
          "tvl_usd": 31073.3765828083,
          "apr": 0.370747820286243
        },
        "WSTETH/ETH": {
          "date": "2024-07-30",
          "allocation": 148.94,
          "token0_allocation": 94.4,
          "token1_allocation": 54.54,
          "thirty_day_realized_volatility": 0.0019242246914148,
          "tvl_usd": 127883.488342186,
          "apr": 0.207590765167447
        }
      },
      "Nostra": {
        "WSTETH/ETH": {
          "date": "2024-07-30",
          "allocation": 90.14,
          "token0_allocation": 45.09,
          "token1_allocation": 45.05,
          "thirty_day_realized_volatility": 0.0019242246914148,
          "tvl_usd": 145997.600766264,
          "apr": 0.110052506373483
        },
        "STRK/USDC": {
          "date": "2024-07-30",
          "allocation": 9192.44,
          "token0_allocation": 4590.44,
          "token1_allocation": 4601.99,
          "thirty_day_realized_volatility": 0.307358894709532,
          "tvl_usd": 3196783.62389112,
          "apr": 0.512543197820611
        },
        "ETH/USDC": {
          "date": "2024-07-30",
          "allocation": 4115.84,
          "token0_allocation": 1931.43,
          "token1_allocation": 2184.41,
          "thirty_day_realized_volatility": 0.130739648151866,
          "tvl_usd": 1829513.33807167,
          "apr": 0.400991887489722
        },
        "USDC/DAI": {
          "date": "2024-07-30",
          "allocation": 6.54,
          "token0_allocation": 3.6,
          "token1_allocation": 2.94,
          "thirty_day_realized_volatility": 0.0005949565407039,
          "tvl_usd": 27087.7836641315,
          "apr": 0.0430502054228959
        },
        "USDC/USDT": {
          "date": "2024-07-30",
          "allocation": 171.85,
          "token0_allocation": 62.76,
          "token1_allocation": 109.08,
          "thirty_day_realized_volatility": 0.0006892979915869,
          "tvl_usd": 333879.785189916,
          "apr": 0.0917406483899314
        },
        "STRK/ETH": {
          "date": "2024-07-30",
          "allocation": 10993.74,
          "token0_allocation": 6179.86,
          "token1_allocation": 4813.87,
          "thirty_day_realized_volatility": 0.266765746136404,
          "tvl_usd": 4591742.75951101,
          "apr": 0.426757297566124
        },
        "Discretionary": {
          "date": "2024-07-30",
          "allocation": 0,
          "token0_allocation": 0,
          "token1_allocation": 0,
          "thirty_day_realized_volatility": 0,
          "tvl_usd": 0,
          "apr": 0
        },
        "WBTC/ETH": {
          "date": "2024-07-30",
          "allocation": 8837.29,
          "token0_allocation": 4409.35,
          "token1_allocation": 4427.94,
          "thirty_day_realized_volatility": 0.0692347282729821,
          "tvl_usd": 5850525.32234072,
          "apr": 0.269238693314193
        }
      },
      "MySwap": {
        "STRK/USDC": {
          "date": "2024-07-30",
          "allocation": 786.02,
          "token0_allocation": 594.5,
          "token1_allocation": 191.52,
          "thirty_day_realized_volatility": 0.307358894709532,
          "tvl_usd": 559067.159768188,
          "apr": 0.250601231165709
        },
        "STRK/ETH": {
          "date": "2024-07-30",
          "allocation": 703.13,
          "token0_allocation": 572.68,
          "token1_allocation": 130.45,
          "thirty_day_realized_volatility": 0.266765746136404,
          "tvl_usd": 478448.591032262,
          "apr": 0.261946296169062
        },
        "WBTC/ETH": {
          "date": "2024-07-30",
          "allocation": 59.42,
          "token0_allocation": 25.33,
          "token1_allocation": 34.09,
          "thirty_day_realized_volatility": 0.0692347282729821,
          "tvl_usd": 48069.1600620097,
          "apr": 0.220315191781113
        },
        "ETH/USDC": {
          "date": "2024-07-30",
          "allocation": 733.63,
          "token0_allocation": 392.57,
          "token1_allocation": 341.06,
          "thirty_day_realized_volatility": 0.130739648151866,
          "tvl_usd": 570267.119201716,
          "apr": 0.229303922996291
        },
        "USDC/DAI": {
          "date": "2024-07-30",
          "allocation": 3.4,
          "token0_allocation": 1.7,
          "token1_allocation": 1.7,
          "thirty_day_realized_volatility": 0.0005949565407039,
          "tvl_usd": 0.0506172688952037,
          "apr": 11963.8687755487
        },
        "Discretionary": {
          "date": "2024-07-30",
          "allocation": 0,
          "token0_allocation": 0,
          "token1_allocation": 0,
          "thirty_day_realized_volatility": 0,
          "tvl_usd": 0,
          "apr": 0
        },
        "USDC/USDT": {
          "date": "2024-07-30",
          "allocation": 50.22,
          "token0_allocation": 23.22,
          "token1_allocation": 27,
          "thirty_day_realized_volatility": 0.0006892979915869,
          "tvl_usd": 93382.873844537,
          "apr": 0.0958476498968394
        },
        "WSTETH/ETH": {
          "date": "2024-07-30",
          "allocation": 98.25,
          "token0_allocation": 50.09,
          "token1_allocation": 48.16,
          "thirty_day_realized_volatility": 0.0019242246914148,
          "tvl_usd": 168110.652989625,
          "apr": 0.10417155701346
        }
      }
    };

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await getPairingStats();
    expect(fetch).toHaveBeenCalledWith(`${API_URL}/discover/defi/get_pair_stats`);

    expect(result).toEqual(mockData);
  });

  it('should return null', async () => {
    fetch.mockResolvedValueOnce({
      json: () => Promise.reject(null),
    });

    const result = await getPairingStats();
    expect(fetch).toHaveBeenCalledWith(`${API_URL}/discover/defi/get_pair_stats`);

    expect(result).toBeNull();
  });
});

describe('getAltProtocolStats function', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('should fetch and return alt protocol stats', async () => {
    const mockData = {
      "Nimbora": {
        "liquity": {
          "date": "2024-07-30",
          "allocation": 28.71,
          "tvl_usd": 47056.8195847229,
          "apr": 0.108748613895378
        },
        "pendle-flux-usdc": {
          "date": "2024-07-30",
          "allocation": 114.56,
          "tvl_usd": 187804.148341292,
          "apr": 0.108727883196851
        },
        "spark": {
          "date": "2024-07-30",
          "allocation": 1669.97,
          "tvl_usd": 2737611.58791471,
          "apr": 0.108730140154224
        },
        "pendle-puffer-eth": {
          "date": "2024-07-30",
          "allocation": 1180.2,
          "tvl_usd": 1934728.66823559,
          "apr": 0.108729815807306
        },
        "angle": {
          "date": "2024-07-30",
          "allocation": 338.59,
          "tvl_usd": 555055.338310875,
          "apr": 0.108730391676802
        },
        "pendle-etherfi-eth": {
          "date": "2024-07-30",
          "allocation": 2993.5,
          "tvl_usd": 4907308.29916189,
          "apr": 0.108729909932825
        },
        "pendle-staked-eth": {
          "date": "2024-07-30",
          "allocation": 473.33,
          "tvl_usd": 775935.690078683,
          "apr": 0.108730506720544
        }
      }
    };

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await getAltProtocolStats();
    expect(fetch).toHaveBeenCalledWith(`${API_URL}/discover/defi/get_alt_protocol_stats`);

    expect(result).toEqual(mockData);
  })

  it('should return null', async () => {
    fetch.mockResolvedValueOnce({
      json: () => Promise.reject(null),
    });

    const result = await getAltProtocolStats();
    expect(fetch).toHaveBeenCalledWith(`${API_URL}/discover/defi/get_alt_protocol_stats`);

    expect(result).toBeNull();
  });
});

describe('getDerivatesStats function', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('should fetch and return derivatives stats for a successful response', async () => {
    const mockData = {
      protocol1: {
        date: '2024-08-02',
        protocol: 'Protocol 1',
        allocation: 1000000,
        tvl: 5000000,
        volumes: 100000,
        beta_fees: 5000,
        apr: 0.05
      }
    };
    
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await getDerivatesStats()
    expect(fetch).toHaveBeenCalledWith(`${API_URL}/discover/defi/get_derivatives_stats`)
    
    expect(result).toEqual(mockData);
  })

  it('should return null and log error for a failed request', async () => {
    const mockError = new Error('Network error');
    fetch.mockRejectedValueOnce(mockError);

    const result = await getDerivatesStats();

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/discover/defi/get_derivatives_stats`
    );
    expect(result).toBeNull();
    expect(console.log).toHaveBeenCalledWith('Error while fetching derivatives stats', mockError);
  });

  it('should handle empty response gracefully', async () => {
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({})
    });

    const result = await getDerivatesStats();

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/discover/defi/get_derivatives_stats`
    );
    expect(result).toEqual({});
  });
})

describe('getEligibleRewards function', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('should fetch and return eligible rewards for valid input', async () => {
    const mockData = { rewards: [{ id: 1, amount: 100 }] };
    const rewardEndpoint = '/rewards';
    const address = '0x1234567890123456789012345678901234567890';
    const quest_id = 1;

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData)
    });

    const result = await getEligibleRewards({ rewardEndpoint, address, quest_id });

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}${rewardEndpoint}?addr=${address}&quest_id=${quest_id}`
    );
    expect(result).toEqual(mockData);
  });

  it('should handle fetch errors and log them', async () => {
    const mockError = new Error('Network error');
    const rewardEndpoint = '/rewards';
    const address = '0x1234567890123456789012345678901234567890';
    const quest_id = 1;

    fetch.mockRejectedValueOnce(mockError);

    const result = await getEligibleRewards({ rewardEndpoint, address, quest_id });

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}${rewardEndpoint}?addr=${address}&quest_id=${quest_id}`
    );
    expect(result).toBeUndefined();
    expect(console.log).toHaveBeenCalledWith('Error while fetching eligible rewards', mockError);
  });

  it('should handle empty response gracefully', async () => {
    const rewardEndpoint = '/rewards';
    const address = '0x1234567890123456789012345678901234567890';
    const quest_id = 1;

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({})
    });

    const result = await getEligibleRewards({ rewardEndpoint, address, quest_id });

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}${rewardEndpoint}?addr=${address}&quest_id=${quest_id}`
    );
    expect(result).toEqual({});
  });

  it('should handle invalid input gracefully', async () => {
    const rewardEndpoint = '';
    const address = '';
    const quest_id = NaN;

    console.log = jest.fn();

    const result = await getEligibleRewards({ rewardEndpoint, address, quest_id });

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}?addr=&quest_id=NaN`
    );
    expect(result).toBeUndefined();
  });
});
