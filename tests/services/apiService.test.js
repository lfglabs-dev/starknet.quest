import {
  fetchQuestCategoryData,
  fetchLeaderboardToppers,
  getBoostById,
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
