import { QueryError, QuestDocument } from "../types/backTypes";

export async function fetchQuestData(questId: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_LINK}/get_quest?id=${questId}`
  );
  const data: QuestDocument | QueryError = await response.json();
  return data as QuestDocument;
}
