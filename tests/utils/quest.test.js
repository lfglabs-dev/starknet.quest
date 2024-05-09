import {
  getOrderedQuests,
  pickRandomObjectsFn,
  getClaimableQuests,
} from "@utils/quest";

describe("orderQuests function", () => {
  it("should place ongoing quests first and expired ones last", () => {
    const ongoingQuest1 = { expired: false };
    const ongoingQuest2 = { expired: false };
    const expiredQuest1 = { expired: true };
    const expiredQuest2 = { expired: true };

    const quests = [ongoingQuest1, expiredQuest1, ongoingQuest2, expiredQuest2];

    const orderedQuests = getOrderedQuests(quests);

    // Check that ongoing quests are placed first
    expect(orderedQuests[0]).toBe(ongoingQuest1);
    expect(orderedQuests[1]).toBe(ongoingQuest2);

    // Check that expired quests are placed last
    expect(orderedQuests[2]).toBe(expiredQuest1);
    expect(orderedQuests[3]).toBe(expiredQuest2);
  });

  it("should handle empty input", () => {
    const orderedQuests = getOrderedQuests([]);

    // Check that the result is an empty array
    expect(orderedQuests).toEqual([]);
  });
});

describe("pickRandomObjectsFn", () => {
  // Test case 1: Should return an array of length 2 when questArray length is greater than 2
  test("Should return an array of length 2 when questArray length is greater than 2", () => {
    const questArray = [1, 2, 3, 4, 5];
    const result = pickRandomObjectsFn({ questArray });
    expect(result).toHaveLength(2); // Assertion 1
    expect(result.every((item) => questArray.includes(item))).toBe(true); // Assertion 2
  });

  // Test case 2: Should return the same array when questArray length is less than or equal to 2
  test("Should return the same array when questArray length is less than or equal to 2", () => {
    const questArray = [1];
    const result = pickRandomObjectsFn({ questArray });
    expect(result).toEqual(questArray); // Assertion 3
  });

  // Test case 3: Should return the requested number of elements when count parameter is provided
  test("Should return the requested number of elements when count parameter is provided", () => {
    const questArray = [1, 2, 3, 4, 5];
    const count = 3;
    const result = pickRandomObjectsFn({ questArray, count });
    expect(result).toHaveLength(count); // Assertion 4
    expect(result.every((item) => questArray.includes(item))).toBe(true); // Assertion 5
  });
});

describe("getClaimableQuests function", () => {
  it("should return undefined if pendingBoostClaims is undefined", () => {
    const quests = [
      {
        id: 27,
        name: "Element - Gemstone Quest",
        desc: "Element, an NFT marketplace where the users save time and money with top liquidity and minimal costs.",
        additional_desc: null,
        issuer: "Element",
        category: "Hi, Starks",
        rewards_endpoint: "quests/element/element/claimable",
        logo: "/element/favicon.ico",
        rewards_img: "/element/elementGem.webp",
        rewards_title: "1 NFT",
        rewards_description: null,
        rewards_nfts: [
          {
            img: "/element/elementGem.webp",
            level: 1,
          },
        ],
        img_card: "/element/elementGem.webp",
        title_card: "Element - Gemstone Quest",
        hidden: false,
        disabled: false,
        expiry: 1699542000000,
        expiry_timestamp: "1699542000000",
        mandatory_domain: "none",
        expired: true,
        experience: 10,
        start_time: 1640995100000,
      },
      {
        id: 17,
        name: "briq  - Gemstone Quest",
        desc: "briq is an NFT construction protocol that allows you to build NFTs by assembling fundamental components known as briqs.",
        additional_desc: null,
        issuer: "briq",
        category: "Hi, Starks",
        rewards_endpoint: "quests/element/briq/claimable",
        logo: "/briq/favicon.ico",
        rewards_img: "/element/briqGem.webp",
        rewards_title: "1 NFT",
        rewards_description: null,
        rewards_nfts: [
          {
            img: "/element/briqGem.webp",
            level: 1,
          },
        ],
        img_card: "/element/briqGem.webp",
        title_card: "briq  - Gemstone Quest",
        hidden: false,
        disabled: false,
        expiry: 1699542000000,
        expiry_timestamp: "1699542000000",
        mandatory_domain: "none",
        expired: true,
        experience: 10,
        start_time: 1640995100000,
      },
    ];
    const pendingBoostClaims = undefined;

    const result = getClaimableQuests(quests, pendingBoostClaims);

    expect(result).toBeUndefined();
  });

  it("should return undefined if pendingBoostClaims is an empty array", () => {
    const quests = [
      {
        id: 27,
        name: "Element - Gemstone Quest",
        desc: "Element, an NFT marketplace where the users save time and money with top liquidity and minimal costs.",
        additional_desc: null,
        issuer: "Element",
        category: "Hi, Starks",
        rewards_endpoint: "quests/element/element/claimable",
        logo: "/element/favicon.ico",
        rewards_img: "/element/elementGem.webp",
        rewards_title: "1 NFT",
        rewards_description: null,
        rewards_nfts: [
          {
            img: "/element/elementGem.webp",
            level: 1,
          },
        ],
        img_card: "/element/elementGem.webp",
        title_card: "Element - Gemstone Quest",
        hidden: false,
        disabled: false,
        expiry: 1699542000000,
        expiry_timestamp: "1699542000000",
        mandatory_domain: "none",
        expired: true,
        experience: 10,
        start_time: 1640995100000,
      },
      {
        id: 17,
        name: "briq  - Gemstone Quest",
        desc: "briq is an NFT construction protocol that allows you to build NFTs by assembling fundamental components known as briqs.",
        additional_desc: null,
        issuer: "briq",
        category: "Hi, Starks",
        rewards_endpoint: "quests/element/briq/claimable",
        logo: "/briq/favicon.ico",
        rewards_img: "/element/briqGem.webp",
        rewards_title: "1 NFT",
        rewards_description: null,
        rewards_nfts: [
          {
            img: "/element/briqGem.webp",
            level: 1,
          },
        ],
        img_card: "/element/briqGem.webp",
        title_card: "briq  - Gemstone Quest",
        hidden: false,
        disabled: false,
        expiry: 1699542000000,
        expiry_timestamp: "1699542000000",
        mandatory_domain: "none",
        expired: true,
        experience: 10,
        start_time: 1640995100000,
      },
    ];
    const pendingBoostClaims = [];

    const result = getClaimableQuests(quests, pendingBoostClaims);

    expect(result).toBeUndefined();
  });

  it("should return an array of quests with boostId appended if pendingBoostClaims contains valid quests", () => {
    const quests = [
      {
        id: 27,
        name: "Element - Gemstone Quest",
        desc: "Element, an NFT marketplace where the users save time and money with top liquidity and minimal costs.",
        additional_desc: null,
        issuer: "Element",
        category: "Hi, Starks",
        rewards_endpoint: "quests/element/element/claimable",
        logo: "/element/favicon.ico",
        rewards_img: "/element/elementGem.webp",
        rewards_title: "1 NFT",
        rewards_description: null,
        rewards_nfts: [
          {
            img: "/element/elementGem.webp",
            level: 1,
          },
        ],
        img_card: "/element/elementGem.webp",
        title_card: "Element - Gemstone Quest",
        hidden: false,
        disabled: false,
        expiry: 1699542000000,
        expiry_timestamp: "1699542000000",
        mandatory_domain: "none",
        expired: true,
        experience: 10,
        start_time: 1640995100000,
      },
      {
        id: 17,
        name: "briq  - Gemstone Quest",
        desc: "briq is an NFT construction protocol that allows you to build NFTs by assembling fundamental components known as briqs.",
        additional_desc: null,
        issuer: "briq",
        category: "Hi, Starks",
        rewards_endpoint: "quests/element/briq/claimable",
        logo: "/briq/favicon.ico",
        rewards_img: "/element/briqGem.webp",
        rewards_title: "1 NFT",
        rewards_description: null,
        rewards_nfts: [
          {
            img: "/element/briqGem.webp",
            level: 1,
          },
        ],
        img_card: "/element/briqGem.webp",
        title_card: "briq  - Gemstone Quest",
        hidden: false,
        disabled: false,
        expiry: 1699542000000,
        expiry_timestamp: "1699542000000",
        mandatory_domain: "none",
        expired: true,
        experience: 10,
        start_time: 1640995100000,
      },
    ];
    const pendingBoostClaims = [
      {
        amount: 1000,
        token:
          "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
        expiry: 1715252529000,
        quests: [27],
        winner:
          "0x01bf5fad6815868d6fe067905548285596cf311641169544109a7a5394c2565f",
        img_url: "/nostra/cigar.webp",
        id: 9,
        name: "Nostra - Stake and Win",
        num_of_winners: 4,
        token_decimals: 18,
      },
    ];

    const result = getClaimableQuests(quests, pendingBoostClaims);

    expect(result).toEqual([
      {
        boostId: 9,
        id: 27,
        name: "Element - Gemstone Quest",
        desc: "Element, an NFT marketplace where the users save time and money with top liquidity and minimal costs.",
        additional_desc: null,
        issuer: "Element",
        category: "Hi, Starks",
        rewards_endpoint: "quests/element/element/claimable",
        logo: "/element/favicon.ico",
        rewards_img: "/element/elementGem.webp",
        rewards_title: "1 NFT",
        rewards_description: null,
        rewards_nfts: [
          {
            img: "/element/elementGem.webp",
            level: 1,
          },
        ],
        img_card: "/element/elementGem.webp",
        title_card: "Element - Gemstone Quest",
        hidden: false,
        disabled: false,
        expiry: 1699542000000,
        expiry_timestamp: "1699542000000",
        mandatory_domain: "none",
        expired: true,
        experience: 10,
        start_time: 1640995100000,
      },
    ]);
  });
});
