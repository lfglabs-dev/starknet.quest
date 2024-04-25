import { fetchQuestCategoryData, getCompletedQuests } from "@services/apiService";

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

describe("getCompletedQuests", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it("should fetch and return completed quests", async () => {
    const mockDataRes = [];
    const address = "ksdjiewmcoew"

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockDataRes),
    });

    const result = await getCompletedQuests(address)
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_completed_quests?addr=${address}`
    );

    expect(result).toEqual(mockDataRes)
  });

  it("should handle fetch with no response", async () => {
    const mockDataRes = null;
    const address = "ksdjiewmcoew"

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockDataRes),
    });

    const result = await getCompletedQuests(address)
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_completed_quests?addr=${address}`
    );

    expect(result).toEqual(mockDataRes)
  })

  it("should handle fetch with invalid response", async () => {
    const mockDataRes = "Invalid response";
    const address = "ksdjiewmcoew"

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockDataRes),
    });

    const result = await getCompletedQuests(address)
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_completed_quests?addr=${address}`
    );

    expect(result).toEqual(mockDataRes)
  })

  it("should handle fetch with invalid address", async () => {
    const mockDataRes = "Invalid address";
    const address = "2009cx-920.299z/w"

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockDataRes),
    });

    const result = await getCompletedQuests(address)
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_completed_quests?addr=${address}`
    );

    expect(result).toEqual(mockDataRes)
  })

  it("should handle fetch with empty address", async () => {
    const mockDataRes = "Empty address";
    const address = ""

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockDataRes),
    });

    const result = await getCompletedQuests(address)
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_completed_quests?addr=${address}`
    );

    expect(result).toEqual(mockDataRes)
  })
});