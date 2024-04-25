import { fetchQuestCategoryData, getQuestById, getBoostById } from "@services/apiService";

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


describe("getQuestById function", () => {
  
  beforeEach(() => {
    fetch.mockClear();
  });
  
  // Test cases for getQuestById function

  /* 
    This test case checks if the function returns the quest data for a valid quest id.
    URL: `${API_URL}/get_quest?id=1`
  */
  it("should return the quest data for a valid quest id", async function () {
    const mockData = {
      id: 1,
      name: "Create your Starknet profile",
      desc: "Onboard on Starknet by registering your Stark Name and verifying your social medias.",
      additional_desc: null,
      issuer: "Starknet ID",
      category: "onboarding",
      rewards_endpoint: "quests/starknetid/claimable",
      logo: "/starknetid/favicon.ico",
      rewards_img: "/starknetid/favicon.ico",
      rewards_title: "1 NFT",
      rewards_description: null,
      rewards_nfts: [{ img: "/starknetid/nft1.webp", level: 1 }],
      img_card: "/starknetid/nft1.webp",
      title_card: "Starknet Profile",
      hidden: false,
      disabled: false,
      expiry: null,
      expiry_timestamp: null,
      mandatory_domain: "none",
      expired: false,
      experience: 50,
    };

    fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockData),
    });

    let queryId = 1;

    const result = await getQuestById(queryId);

    expect(fetch).toHaveBeenCalledWith(`${API_URL}/get_quest?id=${queryId}`);
    expect(result).toEqual(mockData);
  });

  /* 
    This test case checks if the function shows the error for invalid quest id.
    URL: `${API_URL}/get_quest?id=2`
  */
  it("should return an error message for an invalid quest id", async function () {
    const mockData = "Quest not found";

    fetch.mockResolvedValue({
      ok: false,
      status: 500,
      text: () => Promise.resolve(mockData),
    });

    let queryId = 2;

    const result = await getQuestById(queryId);

    expect(fetch).toHaveBeenCalledWith(`${API_URL}/get_quest?id=${queryId}`);

    expect(result).toEqual(mockData);
  });

  /* 
    This test case checks if the function displays error for incorrect id type
    URL: `${API_URL}/get_quest?id="invalid"`
  */
  it("should return an error message for an invalid type id", async function () {
    const mockData =
      "Failed to deserialize query string: invalid digit found in string";

    fetch.mockResolvedValue({
      ok: false,
      status: 400,
      text: () => Promise.resolve(mockData),
    });

    let queryId = "invalid";

    const result = await getQuestById(queryId);

    expect(fetch).toHaveBeenCalledWith(`${API_URL}/get_quest?id=${queryId}`);

    expect(result).toEqual(mockData);
  });

  /* 
    This test case checks if the function displays error if no id is provided
    URL: `${API_URL}/get_quest`
  */

  /* 
    it("should return an error message for missing query id", async function () {
    const mockData =
      "Failed to deserialize query string: missing field `id`";

    fetch.mockResolvedValue({
      ok: false,
      status: 400,
      text: () => Promise.resolve(mockData),
    });

    const result = await getQuestById();

    expect(fetch).toHaveBeenCalledWith(`${API_URL}/get_quest`);

    expect(result).toEqual( "Failed to deserialize query string: missing field `id`");
  })
  */
});

