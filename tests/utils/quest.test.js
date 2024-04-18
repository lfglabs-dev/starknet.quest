import { getOrderedQuests, pickRandomObjectsFn } from "@utils/quest";

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