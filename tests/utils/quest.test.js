import {
  getOrderedQuests,
  pickRandomObjectsFn,
  findQuestsByAddress,
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

describe("findQuestsByAddress function", () => {
  const objectsArray = [
    [
      {
        amount: 1500,
        token:
          "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8",
        expiry: 1705708740000,
        quests: [23],
        winner: [
          "0x061b6c0a78f9edf13cea17b50719f3344533fadd470b8cb29c2b4318014f52d3",
          "0x03a1647831175f2abd4acfbcbca2ce6b8eef6c568ddb1e1174d1640ac8574580",
          "0x0664c36dc97e14d74fabfb5d1ad77258f8340fdf711b836734a0aa90e704ba8a",
          "0x019d081186f939258032ab321be2cef29816374b0d782d4a782e2d834799abad",
          "0x06862090fb4e5764650cf06653526bfb33fc8b3a8687dcf440d227fe28f927ad",
          "0x0610febaa5e58043927c8758edfaa3525ef59bac1f0b60e7b52b022084536363",
        ],
        id: 5,
        img_url: "/rango/bridge.webp",
        name: "The Rango Boost",
        hidden: false,
        num_of_winners: 6,
        token_decimals: 6,
      },
      {
        amount: 900,
        token:
          "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8",
        expiry: 1705708799000,
        quests: [104],
        winner: [
          "0x034f3c16e4a0b7f4557ed0f70f6c4e7599e5da72f5fd6836516efbf9b71de0a0",
          "0x022c2dd075059467bac7452afee146ecb17384506cb80174ecf69d2430f9fb4a",
          "0x07327df3c5215fb607d84fb72aab70b49050c8a438c3fccee4f681ef88d296c7",
          "0x02f06e4e2c320fbfdcba4b94ebc6d5c30002c5400e138ff0eedcae3409dae791",
          "0x04e56b7a9d280392aa64aa66b8c51748f2eb7bd5dface86a42fb156ed49bcec8",
          "0x01291b5e9812b2adf6755eaab3037b0b72c67cbd6c189831fc6f52bcfc4fde51",
          "0x00bfceb15cf13814aadf3337e73c7f9330c080a4507fcd1d00a8e152eea911bb",
          "0x01b1b07e0e51b8f07c2b9ddabe3da194f512cdc026167a8972b829c30d62f3ec",
          "0x012cf82361433496f77ccd8644c5498743ac11dad073d3012b793bde44357630",
        ],
        id: 6,
        img_url: "/braavos/pyramid.webp",
        name: "Starknet Pro Score by Braavos quests",
        hidden: false,
        num_of_winners: 9,
        token_decimals: 6,
      },
      {
        amount: 1000,
        token:
          "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8",
        expiry: 1715299200000,
        quests: [28],
        winner: null,
        id: 10,
        img_url: "/hashstack/hashstackEmpire.webp",
        name: "Hashstack Winquest",
        hidden: false,
        num_of_winners: 10,
        token_decimals: 6,
      },
    ],
  ];

  test("should return quests when winner is found", () => {
    const winnerValue =
      "0x061b6c0a78f9edf13cea17b50719f3344533fadd470b8cb29c2b4318014f52d3";
    const result = findQuestByWinner(objectsArray, winnerValue);
    expect(result).toEqual([23]); // Adjust the expected value based on your actual data
  });

  test("should return empty array when winner is not found", () => {
    const winnerValue = "0x1234567890123456789012345678901234567890";
    const result = findQuestByWinner(objectsArray, winnerValue);
    expect(result).toEqual([]);
  });
});
