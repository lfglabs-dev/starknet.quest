import { getQuests } from "@services/apiService";

const API_URL = process.env.NEXT_PUBLIC_API_LINK;

global.fetch = jest.fn();

describe("getQuests", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it("should fetch and return quests data", async () => {
    const mockData = [
      {
        quest_id: 1,
        name: "Quest Name",
        title: "Quest title",
        desc: "Quests description.",
        img_url: "braavos/category.webp",
      },
      {
        quest_id: 2,
        name: "Quest Name",
        title: "Quest title",
        desc: "Quests description.",
        img_url: "braavos/category.webp",
      }
    ];

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await getQuests();
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_quests`
    );
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