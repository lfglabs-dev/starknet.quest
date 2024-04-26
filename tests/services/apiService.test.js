import { fetchQuestCategoryData, getBoostById, getUniqueVisitorCount } from "@services/apiService";

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

describe("getUniqueVisitorCount function", () => {
  beforeEach(() => {
    fetch.mockClear();
  });
  it("should return data for valid page id", async () => {
    const mockResponse = 14;
    fetch.mockResolvedValueOnce({json: () => Promise.resolve(mockResponse)})
    const result = await getUniqueVisitorCount(1);
    expect(fetch).toHaveBeenCalledWith(`${API_URL}/analytics/get_unique_visitors?id=1`);
    expect(result).toEqual(mockResponse);
  })
  it("should handle errors gracefully", async () => {
    const mockResponse = "Error while fetching unique visitor count";
    fetch.mockResolvedValueOnce({json: () => Promise.reject(mockResponse)})
    const result = await getUniqueVisitorCount("invalid-id");
    expect(fetch).toHaveBeenCalledWith(`${API_URL}/analytics/get_unique_visitors?id=invalid-id`);
    expect(result).toBeUndefined();
  })
  it("should handle null cases in parameters", async () => {
    const mockResponse = "Failed to deserialize query string: invalid digit found in string";
    fetch.mockResolvedValueOnce({json: () => Promise.resolve(mockResponse)})
    const result = await getUniqueVisitorCount(null);
    expect(fetch).toHaveBeenCalledWith(`${API_URL}/analytics/get_unique_visitors?id=null`);
    expect(result).toEqual(mockResponse);
  })
  it("should handle undefined cases in parameters", async () => {
    const mockResponse =
      "Failed to deserialize query string: invalid digit found in string";
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getUniqueVisitorCount(undefined);
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/analytics/get_unique_visitors?id=undefined`
    );
    expect(result).toEqual(mockResponse);
  });
  it("should handle when API returns no response", async () => {
    const mockResponse = undefined;
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getUniqueVisitorCount("page-id");
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/analytics/get_unique_visitors?id=page-id`
    );
    expect(result).toBeUndefined();
  });
  it("should handle when API returns response in unexpected format", async () => {
    const mockResponse = 0;
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getUniqueVisitorCount(10);
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/analytics/get_unique_visitors?id=10`
    );
    expect(result).toEqual(mockResponse);
  });
})

