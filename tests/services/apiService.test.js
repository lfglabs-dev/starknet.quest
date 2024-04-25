import {
  fetchQuestCategoryData,
  fetchLeaderboardToppers,
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
