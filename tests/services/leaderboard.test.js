import { fetchLeaderboardToppers } from "@services/apiService";

const API_URL = process.env.NEXT_PUBLIC_API_LINK;
global.fetch = jest.fn();

describe("fetchLeaderboardToppers", () => {
  afterEach(() => {
    fetch.mockClear();
  });

  it("fetches leaderboard toppers correctly", async () => {
    const mockResponse = { leaderboardData: "mockedData" };
    const params = { addr: "exampleAddr", duration: "exampleDuration" };

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    });

    const response = await fetchLeaderboardToppers(params);
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/leaderboard/get_static_info?addr=${params.addr}&duration=${params.duration}`
    );
    expect(response).toEqual(mockResponse);
  });

  it("handles errors gracefully", async () => {
    const params = { addr: "exampleAddr", duration: "exampleDuration" };

    const mockResponse = "Error querying ranks";
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await fetchLeaderboardToppers(params);
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/leaderboard/get_static_info?addr=${params.addr}&duration=${params.duration}`
    );
    expect(result).toEqual(mockResponse);
  });
});
