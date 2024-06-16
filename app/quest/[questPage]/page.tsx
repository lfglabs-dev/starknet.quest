import type { Metadata, ResolvingMetadata } from "next";
import React from "react";
import Quest from "./quest";
import { QuestDocument, QueryError } from "../../../types/backTypes";
import { defaultMetatags } from "@constants/metatags";
import { getQuestById } from "@services/apiService";

type Props = {
  params: { questPage: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const questId = params.questPage;

  try {
    const data: QuestDocument | QueryError = await getQuestById(questId);
    if (!data || "error" in data) {
      return defaultMetatags;
    } else {
      if (data?.name) {
        return {
          title: data.name,
          description: data.desc,
          openGraph: {
            title: data.name,
            description: data.desc,
            images: [data.img_card],
          },
          twitter: {
            card: "summary_large_image",
            title: data.name,
            description: data.desc,
            images: [data.img_card],
          },
        };
      } else return defaultMetatags;
    }
  } catch (error) {
    return defaultMetatags;
  }
}

type QuestPageProps = {
  params: {
    questPage: string;
    task_id?: string;
    res?: string;
    error_msg?: string;
  };
};

export default function Page({ params }: QuestPageProps) {
  const {
    questPage: questId,
    task_id: taskId,
    res,
    error_msg: errorMsg,
  } = params;
  return (
    <Quest questId={questId} taskId={taskId} res={res} errorMsg={errorMsg} />
  );
}
