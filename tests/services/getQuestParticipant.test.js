import { getQuestsParticipation } from "@services/apiService";

const API_URL = process.env.NEXT_PUBLIC_API_LINK;

global.fetch = jest.fn();

describe("getQuestsParticipation", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it("should fetch and return data for a valid id", async () => {
    const mockData = {
      quest_id: 1,
      name: "Quest Name",
      title: "Quest title",
      desc: "Quests description.",
      img_url: "braavos/category.webp",
    };

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await getQuestsParticipation(1);
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/analytics/get_quest_participation?id=1`
    );
    expect(result).toEqual(mockData);
  });

  it("should handle fetch errors gracefully", async () => {
    const mockResponse = "Quest not found";
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getQuestsParticipation(999);
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/analytics/get_quest_participation?id=999`
    );
    expect(result).toEqual(mockResponse);
  });

  it("should handle undefined and null cases", async () => {
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(null),
    });

    const result = await getQuestsParticipation(undefined);
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/analytics/get_quest_participation?id=undefined`
    );
    expect(result).toBeNull();
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
