import {
  QueryError,
  QuestCategoryDocument,
  QuestDocument,
} from "../types/backTypes";

export async function fetchQuestData(questId: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_LINK}/get_quest?id=${questId}`
  );
  const data: QuestDocument | QueryError = await response.json();
  if (data && typeof data === "object" && "name" in data) {
    return data as QuestDocument;
  }

  return undefined;
}

export async function fetchQuestCategoryData(name: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_LINK}/get_quest_category?name=${name}`
  );
  const data: QuestCategoryDocument | QueryError = await response.json();
  return data as QuestCategoryDocument;
}
