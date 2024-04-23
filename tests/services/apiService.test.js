import { fetchQuestCategoryData, getBoostedQuests } from "@services/apiService";

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
      message: "Error",
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
