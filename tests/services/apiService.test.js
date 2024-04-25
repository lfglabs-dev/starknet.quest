import { fetchQuestCategoryData, getBoostById, getTasksByQuestId } from "@services/apiService";

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

describe("getTasksByQuestId function", () => {
  beforeEach(() => {
    fetch.mockClear()
  });

  it("should handle when api returns no response", async () => {
    const mockResponse = null;
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    })

    const result = await getTasksByQuestId({ questId: '1', address: '2'});
    expect(result).toEqual(mockResponse)
  });

  it("should handle when api return response in unexpected format", async () => {
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve("Unexpected Format")
    })

    const result = await getTasksByQuestId({ questId: '1', address: '2' })
    expect(result).not.toEqual(expect.any(Array))
  });

  it("should handle undefined values", async () => {
    const mockResponse = "Failed to deserialize query string: invalid character"

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    })

    let result = await getTasksByQuestId({questId: undefined, address: undefined });
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_tasks?quest_id=undefined&addr=undefined`
    );
    expect(result).toEqual(mockResponse);
    
  });

  it("should handle an undefined value", async () => {
    const mockResponse = "Failed to deserialize query string: invalid digit found in string"

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    })

    let result = await getTasksByQuestId({questId: undefined, address: 2 });
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_tasks?quest_id=undefined&addr=2`
    );
    expect(result).toEqual(mockResponse)
    
  });

  it("should handle null values", async () => {
    const mockResponse = "Failed to deserialize query string: invalid digit found in string"

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    })

    let result = await getTasksByQuestId({questId: null, address: 2 });
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_tasks?quest_id=null&addr=2`
    );
    expect(result).toEqual(mockResponse)
  });

  it("should fetch and return data for a valid task", async () => {
    const mockData = [
      {
        id: 56,
        quest_id: 1,
        name: "Starknet Tribe",
        href: "https://docs.starknet.id/",
        cta: "Start Starknet Tribe Quiz",
        verify_endpoint: "quests/verify_quiz",
        verify_endpoint_type: "quiz",
        verify_redirect: null,
        desc: "Task Description",
        completed: false,
        quiz_name: null
      }
    ]
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    })

    const result = await getTasksByQuestId({questId:"1", address:"2"});
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_tasks?quest_id=1&addr=2`
    );
    expect(result).toEqual(mockData)
  });
})

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
