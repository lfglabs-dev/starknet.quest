import { fetchQuestCategoryData } from "@services/apiService";
import { getDeployedTimeByAddress } from "@services/apiService";

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

describe("getDeployedTimeByAddress function", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it("should fetch and return data for a valid address or domain", async () => {
    const mockData = {
      timestamp: 9843327487
    };
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await getDeployedTimeByAddress("address-or-domain");
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_deployed_time?addr=address-or-domain`
    );
    expect(result).toEqual(mockData);
  });

  it("should handle when API returns no response", async () => {
    const mockData = undefined;
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await getDeployedTimeByAddress("address-or-domain");
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_deployed_time?addr=address-or-domain`
    );
    expect(result).toBeUndefined();
  });

  it("should handle when API returns response in unexpected format", async () => {
    const mockData = "Unexpected response format";
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await getDeployedTimeByAddress("address-or-domain");
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_deployed_time?addr=address-or-domain`
    );
    expect(result).toEqual(mockData);
  });

  it("should handle undefined cases in parameters", async () => {
    const mockData = "Failed to deserialize query string: invalid character";
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await getDeployedTimeByAddress(undefined);
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_deployed_time?addr=undefined`
    );
    expect(result).toEqual(mockData);
  });

  it("should handle null cases in parameters", async () => {
    const mockData = "Failed to deserialize query string: invalid character";
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await getDeployedTimeByAddress(null);
    expect(fetch).toHaveBeenCalledWith(`${API_URL}/get_deployed_time?addr=null`);
    expect(result).toEqual(mockData);
  });

  it("should handle fetch errors gracefully", async () => {
    const mockResponse = "Error while fetching deployed time";
    fetch.mockResolvedValueOnce({
      json: () => Promise.reject(mockResponse),
    });

    const result = await getDeployedTimeByAddress("invalid-address");
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_deployed_time?addr=invalid-address`
    );
    expect(result).toBeUndefined();
  });
});
