import type { Metadata } from "next";
import React from "react";
import Quest from "./quest";
import { fetchQuestData } from "../../../services/questService";

type Props = {
  params: { questPage: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const questId = params.questPage;
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
  } else {
    return {
      title: "Starknet Quest",
      description:
        "Starknet Quest help protocols attract and retain users by creating gamified quest experiences on Starknet.",
      openGraph: {
        title: "Starknet Quest - Accomplish quests to get unique NFTs.",
        description:
          "Starknet Quest help protocols attract and retain users by creating gamified quest experiences on Starknet.",
      },
      twitter: {
        card: "summary_large_image",
        title: "Starknet Quest - Accomplish quests to get unique NFTs.",
        description:
          "Starknet Quest help protocols attract and retain users by creating gamified quest experiences on Starknet.",
      },
    };
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
