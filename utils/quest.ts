import { QuestDocument } from "../types/backTypes";

export const getOrderedQuests = (quests: QuestDocument[]) => {
  // Place ongoing quests firsts and the expired ones last
  const ongoingQuests = quests.filter((quest) => !quest.expired);
  const expiredQuests = quests.filter((quest) => quest.expired);
  return ongoingQuests.concat(expiredQuests);
};
