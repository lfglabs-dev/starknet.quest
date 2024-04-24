import { fetchQuestCategoryData, updateUniqueVisitors } from "@services/apiService";

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


describe("updateUniqueVisitors function", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it("should fetch unique visitor count", async () => {
    const mockData = {
      res: "unique visitor count",
    };
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await updateUniqueVisitors("1");
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/unique_page_visit?page_id=${"1"}`
    );
    expect(result).toEqual(mockData);
  });

  it("should handle fetch errors gracefully", async () => {
    const mockResponse = "Category not found";
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await updateUniqueVisitors("3");
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/unique_page_visit?page_id=${"3"}`
    );
    expect(result).toEqual(mockResponse);
  });
});