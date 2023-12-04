import { getOrderedQuests } from "../../utils/quest";

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
