import type { Metadata, ResolvingMetadata } from "next";
import React from "react";
import Quest from "./quest";
import { fetchQuestData } from "../../../services/questService";
import { defaultMetatags } from "../../../constants/metatags";

type Props = {
  params: { questPage: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const questId = params.questPage;

  try {
    const data = await fetchQuestData(questId);

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
