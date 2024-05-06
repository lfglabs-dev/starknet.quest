import { QuestDocument } from "../types/backTypes";

export const getOrderedQuests = (quests: QuestDocument[]) => {
  // Place ongoing quests firsts and the expired ones last
  const ongoingQuests = quests.filter((quest) => !quest.expired);
  const expiredQuests = quests.filter((quest) => quest.expired);
  return ongoingQuests.concat(expiredQuests);
};

export function pickRandomObjectsFn({
  questArray,
  count = 2,
}: PickRandomObjects): QuestDocument[] {
  if (questArray.length > 2) {
    const shuffledArray = questArray.sort(() => Math.random() - 0.5);
    return shuffledArray.slice(0, count);
  } else {
    return questArray;
  }
}

export const findQuestsByAddress = (
  boosts: Boost[] | undefined,
  address: string | undefined
) => {
  const questIds = [];
  if (boosts) {
    for (const boost of boosts) {
      if (address && !boost.winner?.includes(address)) {
        questIds.push(...boost.quests);
      }
    }
    return questIds;
  }
};

export const getClaimableQuests = (
  allBoosts: Boost[],
  address: string | undefined,
  quests: QuestDocument[]
) => {
  const claimableQuestIds = findQuestsByAddress(allBoosts, address);
  if (claimableQuestIds && claimableQuestIds.length) {
    const questsToClaim = quests.filter((quest: QuestDocument) =>
      claimableQuestIds.includes(quest.id)
    );
    return questsToClaim;
  }
};
