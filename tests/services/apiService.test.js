import { fetchQuestCategoryData, getQuests } from "@services/apiService";

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

describe("getQuests", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it("should fetch and return quests data", async () => {
    const mockData = {
  "onboarding": [
    {
      "id": 1,
      "name": "Create your Starknet profile",
      "desc": "Onboard on Starknet by registering your Stark Name and verifying your social medias.",
      "additional_desc": null,
      "issuer": "Starknet ID",
      "category": "onboarding",
      "rewards_endpoint": "quests/starknetid/claimable",
      "logo": "/starknetid/favicon.ico",
      "rewards_img": "/starknetid/favicon.ico",
      "rewards_title": "1 NFT",
      "rewards_description": null,
      "rewards_nfts": [
        {
          "img": "/starknetid/nft1.webp",
          "level": 1
        }
      ],
      "img_card": "/starknetid/nft1.webp",
      "title_card": "Starknet Profile",
      "hidden": false,
      "disabled": false,
      "expiry": null,
      "expiry_timestamp": null,
      "mandatory_domain": "none",
      "expired": false,
      "experience": 50
    },
    {
      "id": 13,
      "name": "Starknet Giga Brain Quiz",
      "desc": "Starknet Quest Quiz Rounds: Quizzes for Starknet ecosystem enthusiasts, offering educational quizzes on Starknet-related topics with a chance to win exclusive NFTs, catering to all knowledge levels.",
      "additional_desc": null,
      "issuer": "Starknet Knowledge",
      "category": "onboarding",
      "rewards_endpoint": "quests/starknet/gigabrain/claimable",
      "logo": "/starknet/favicon.ico",
      "rewards_img": "/starknet/gigabrain.webp",
      "rewards_title": "1 NFT",
      "rewards_description": null,
      "rewards_nfts": [
        {
          "img": "/starknet/gigabrain.webp",
          "level": 1
        }
      ],
      "img_card": "/starknet/gigabrain.webp",
      "title_card": "Starknet Giga Brain Quiz",
      "hidden": false,
      "disabled": false,
      "expiry": null,
      "expiry_timestamp": null,
      "mandatory_domain": null,
      "expired": false,
      "experience": 10
    },
    {
      "id": 14,
      "name": "Account Abstraction Mastery Quiz",
      "desc": "Starknet Quest Quiz Rounds: Quizzes for Starknet ecosystem enthusiasts, offering educational quizzes on Starknet-related topics with a chance to win exclusive NFTs, catering to all knowledge levels.",
      "additional_desc": null,
      "issuer": "Starknet Knowledge",
      "category": "onboarding",
      "rewards_endpoint": "quests/starknet/aa_mastery/claimable",
      "logo": "/starknet/favicon.ico",
      "rewards_img": "/starknet/aa.webp",
      "rewards_title": "1 NFT",
      "rewards_description": null,
      "rewards_nfts": [
        {
          "img": "/starknet/aa.webp",
          "level": 1
        }
      ],
      "img_card": "/starknet/aa.webp",
      "title_card": "Account Abstraction Mastery Quiz",
      "hidden": false,
      "disabled": false,
      "expiry": null,
      "expiry_timestamp": null,
      "mandatory_domain": null,
      "expired": false,
      "experience": 10
    }
  ],
  "Nfts": [
    {
      "id": 15,
      "name": "Attentiveness Tree Quest.",
      "desc": "Focus Tree is a Starknet DApp that shields against digital distractions, helping users control their attention for healthier relationships with tech",
      "additional_desc": null,
      "issuer": "Focus Tree",
      "category": "Nfts",
      "rewards_endpoint": "quests/focustree/claimable",
      "logo": "/focustree/favicon.ico",
      "rewards_img": "/focustree/focustree.webp",
      "rewards_title": "1 NFT",
      "rewards_description": null,
      "rewards_nfts": [
        {
          "img": "/focustree/focustree.webp",
          "level": 1
        }
      ],
      "img_card": "/focustree/focustree.webp",
      "title_card": "Focus Tree - Attentiveness Tree Quest.",
      "hidden": false,
      "disabled": false,
      "expiry": null,
      "expiry_timestamp": null,
      "mandatory_domain": null,
      "expired": false,
      "experience": 10
    }
  ],
  "deFi": [
    {
      "id": 2,
      "name": "Starknet Padawan",
      "desc": "Become a Starknet Padawan by using the most popular decentralized exchange of Starknet.",
      "additional_desc": null,
      "issuer": "JediSwap",
      "category": "deFi",
      "rewards_endpoint": "quests/jediswap/claimable",
      "logo": "/jediswap/favicon.ico",
      "rewards_img": "/jediswap/favicon.ico",
      "rewards_title": "1 NFT",
      "rewards_description": null,
      "rewards_nfts": [
        {
          "img": "/jediswap/padawan.webp",
          "level": 1
        }
      ],
      "img_card": "/jediswap/padawan.webp",
      "title_card": "Starknet Padawan",
      "hidden": false,
      "disabled": false,
      "expiry": null,
      "expiry_timestamp": null,
      "mandatory_domain": null,
      "expired": false,
      "experience": 10
    },
    {
      "id": 9,
      "name": "Ekubo Concentration",
      "desc": "Ekubo, a next-gen AMM with concentrated liquidity on Starknet for great swapper execution and liquidity provider returns",
      "additional_desc": null,
      "issuer": "Ekubo",
      "category": "deFi",
      "rewards_endpoint": "quests/ekubo/claimable",
      "logo": "/ekubo/favicon.ico",
      "rewards_img": "/ekubo/favicon.ico",
      "rewards_title": "1 NFT",
      "rewards_description": null,
      "rewards_nfts": [
        {
          "img": "/ekubo/concentration.webp",
          "level": 1
        }
      ],
      "img_card": "/ekubo/concentration.webp",
      "title_card": "Ekubo Concentration",
      "hidden": false,
      "disabled": false,
      "expiry": null,
      "expiry_timestamp": null,
      "mandatory_domain": null,
      "expired": false,
      "experience": 10
    },
    {
      "id": 20,
      "name": "Nostra - LaFamiglia Rose",
      "desc": "Nostra, is a versatile liquidity protocol for lending and borrowing, built on Starknet",
      "additional_desc": null,
      "issuer": "Nostra",
      "category": "deFi",
      "rewards_endpoint": "quests/nostra/claimable",
      "logo": "/nostra/favicon.ico",
      "rewards_img": "/nostra/rose.webp",
      "rewards_title": "1 NFT",
      "rewards_description": null,
      "rewards_nfts": [
        {
          "img": "/nostra/rose.webp",
          "level": 1
        }
      ],
      "img_card": "/nostra/rose.webp",
      "title_card": "Nostra - LaFamiglia Rose",
      "hidden": false,
      "disabled": false,
      "expiry": null,
      "expiry_timestamp": null,
      "mandatory_domain": "root",
      "expired": false,
      "experience": 10
    }
  ]
};

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
