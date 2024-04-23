import { fetchQuestCategoryData, fetchLeaderboardRankings } from "@services/apiService";

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

describe("fetchLeaderboardRankings function", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it("should fetch and return data for valid parameters", async () => {
    // Mock data creation for a successful response
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
    // Mock fetch response with no data
    fetch.mockResolvedValueOnce(undefined);

    const params = { addr: 'invalidAddr', page_size: 10, shift: 0, duration: 'week' };
    const result = await fetchLeaderboardRankings(params);

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/leaderboard/get_ranking?addr=invalidAddr&page_size=10&shift=0&duration=week`
    );
    expect(result).toBeUndefined();
  });

  it("should handle API returning response in unexpected format", async () => {
    // Mock fetch response with unexpected data format
    const mockResponse = "Unexpected response format";
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    });

    const params = { addr: 'sampleAddr', page_size: 10, shift: 0, duration: 'week' };
    const result = await fetchLeaderboardRankings(params);

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/leaderboard/get_ranking?addr=sampleAddr&page_size=10&shift=0&duration=week`
    );
    expect(result).toEqual(mockResponse);
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

    const params1 = { addr: undefined, page_size: 10, shift: 0, duration: 'week' };
    const result1 = await fetchLeaderboardRankings(params1);

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/leaderboard/get_ranking?addr=undefined&page_size=10&shift=0&duration=week`
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

    const params2 = { addr: null, page_size: 10, shift: 0, duration: 'week' };
    const result2 = await fetchLeaderboardRankings(params2);

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/leaderboard/get_ranking?addr=null&page_size=10&shift=0&duration=week`
    );
    expect(result2).toEqual(mockData);
  });

});




