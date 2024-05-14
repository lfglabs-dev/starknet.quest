import {
  ClaimableQuestDocument,
  PendingBoostClaim,
  QuestDocument,
} from "../types/backTypes";

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

export const getClaimableQuests = (
  quests: QuestDocument[],
  pendingBoostClaims: PendingBoostClaim[] | undefined
): ClaimableQuestDocument[] | undefined => {
  if (!pendingBoostClaims) return;
  const allQuestIds = pendingBoostClaims.reduce(
    (acc, curr) => acc.concat(curr.quests),
    [] as number[]
  );

  // Filter questIds that exist in the quest array and append boostId
  const questIdsInBoostClaim = allQuestIds
    .filter((questId) => quests.some((q) => q.id === questId))
    .map((questId) => ({
      ...quests.find((q) => q.id === questId),
      boostId: pendingBoostClaims.find((boost) =>
        boost.quests.includes(questId)
      )?.id,
    }));
  return questIdsInBoostClaim as ClaimableQuestDocument[];
};
