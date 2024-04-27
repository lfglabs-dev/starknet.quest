import {
  fetchQuestCategoryData,
  fetchLeaderboardRankings,
  getBoostById,
  getTrendingQuests,
  getTasksByQuestId,
  getQuestsInBoost
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


describe("getTasksByQuestId function", () => {
  beforeEach(() => {
    fetch.mockClear()
  });

  it("should handle when api returns no response", async () => {
    const mockResponse = null;
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    })

    const result = await getTasksByQuestId({ questId: '1', address: '2'});
    expect(result).toEqual(mockResponse)
  });

  it("should handle when api return response in unexpected format", async () => {
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve("Unexpected Format")
    })

    const result = await getTasksByQuestId({ questId: '1', address: '2' })
    expect(result).not.toEqual(expect.any(Array))
  });

  it("should handle undefined values", async () => {
    const mockResponse = "Failed to deserialize query string: invalid character"

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    })

    let result = await getTasksByQuestId({questId: undefined, address: undefined });
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_tasks?quest_id=undefined&addr=undefined`
    );
    expect(result).toEqual(mockResponse);
    
  });

  it("should handle an undefined value", async () => {
    const mockResponse = "Failed to deserialize query string: invalid digit found in string"

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    })

    let result = await getTasksByQuestId({questId: undefined, address: 2 });
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_tasks?quest_id=undefined&addr=2`
    );
    expect(result).toEqual(mockResponse)
    
  });

  it("should handle null values", async () => {
    const mockResponse = "Failed to deserialize query string: invalid digit found in string"

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    })

    let result = await getTasksByQuestId({questId: null, address: 2 });
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_tasks?quest_id=null&addr=2`
    );
    expect(result).toEqual(mockResponse)
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
        quiz_name: null
      }
    ]
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    })

    const result = await getTasksByQuestId({questId:"1", address:"2"});
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_tasks?quest_id=1&addr=2`
    );
    expect(result).toEqual(mockData)
  });
})

describe("fetchLeaderboardRankings function", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it("should fetch and return data for valid parameters", async () => {
    const mockData = {
      rankings: [
        { address: '0x123abc', xp: 100, achievements: 5 },
        { address: '0x456def', xp: 80, achievements: 3 },
        { address: '0x789ghi', xp: 120, achievements: 7 },
      ],
      first_elt_position: 1,
    };
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const params = { addr: '', page_size: 10, shift: 0, duration: 'week' };
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

    const params = { addr: 'invalidAddr', page_size: -1, shift: 0, duration: 'string' };
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

    const paramsPageSize = { addr: 'sampleAddr', page_size: -1, shift: 0, duration: 'week' };
    const resultPageSize = await fetchLeaderboardRankings(paramsPageSize);

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/leaderboard/get_ranking?addr=sampleAddr&page_size=-1&shift=0&duration=week`
    );
    expect(resultPageSize).toEqual(mockResponsePageSize);

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponseDuration),
    });

    const paramsDuration = { addr: 'sampleAddr', page_size: 10, shift: 0, duration: 'string' };
    const resultDuration = await fetchLeaderboardRankings(paramsDuration);

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/leaderboard/get_ranking?addr=sampleAddr&page_size=10&shift=0&duration=string`
    );
    expect(resultDuration).toEqual(mockResponseDuration);
  });

  it("should handle undefined cases in parameters", async () => {
    const mockData = {
      rankings: [
        { address: '0x123abc', xp: 100, achievements: 5 },
        { address: '0x456def', xp: 80, achievements: 3 },
        { address: '0x789ghi', xp: 120, achievements: 7 },
      ],
      first_elt_position: 1,
    };

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const params1 = { addr: undefined, page_size: -1, shift: 0, duration: 'string' };
    const result1 = await fetchLeaderboardRankings(params1);

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/leaderboard/get_ranking?addr=undefined&page_size=-1&shift=0&duration=string`
    );
    expect(result1).toEqual(mockData);
  });

  it("should handle null cases in parameters", async () => {
    const mockData = {
      rankings: [
        { address: '0x123abc', xp: 100, achievements: 5 },
        { address: '0x456def', xp: 80, achievements: 3 },
        { address: '0x789ghi', xp: 120, achievements: 7 },
      ],
      first_elt_position: 1,
    };

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const params2 = { addr: null, page_size: -1, shift: 0, duration: 'string' };
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

describe("getQuestsInBoost function", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it("should handle unexpected params format", async () => {
    const mockResponse = "Failed to deserialize query string: invalid digit found in string";
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    })

    const result = await getQuestsInBoost('my-test-id');

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/boost/get_quests?boost_id=my-test-id`
    );

    expect(result).toEqual(mockResponse)
  });

  it("should handle empty params", async () => {
    const mockResponse = "Failed to deserialize query string: cannot parse integer from empty string";
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    })

    const result = await getQuestsInBoost('');

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/boost/get_quests?boost_id=`
    );

    expect(result).toEqual(mockResponse)
  });
  
  it("should handle quest not found", async () => {
    const mockResponse = "Quest not found";
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    })

    const result = await getQuestsInBoost('10');

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/boost/get_quests?boost_id=10`
    );

    expect(result).toEqual(mockResponse)
  });

  it("should fetch and return data for a valid boost id", async () => {
    const mockResponse = {
      "amount": 500,
      "token": "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8",
      "expiry": 1706633876113,
      "quests": [
          105
      ],
      "winner": [
          "0x06c3fd41bdb9c3b6714fe2acf5646b57174ae097ed5cad8c4111111112222222",
      ],
      "img_url": "/braavos/zklend.webp",
      "id": 4,
      "name": "Starknet Pro Score by Braavos quests",
      "hidden": false,
      "num_of_winners": 1,
      "token_decimals": 6
    };
    
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    })

    const result = await getQuestsInBoost('4');

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/boost/get_quests?boost_id=4`
    );
    expect(result).toEqual(mockResponse)
  });
});
