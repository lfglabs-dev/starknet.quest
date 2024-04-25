import { fetchQuestCategoryData, getQuestActivityData, } from "@services/apiService";

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
    const mockResponse = "Failed to deserialize query string: invalid digit found in string";
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

