import type { Metadata, ResolvingMetadata } from "next";
import React from "react";
import Category from "./category";
import { fetchQuestCategoryData } from "../../../services/questService";

type Props = {
  params: { category: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const categoryName = params.category;

  try {
    const data = await fetchQuestCategoryData(categoryName);
    return {
      title: data.name,
      description: data.desc,
      openGraph: {
        title: data.name,
        description: data.desc,
        images: [data.img_url],
      },
      twitter: {
        card: "summary_large_image",
        title: data.name,
        description: data.desc,
        images: [data.img_url],
      },
    };
  } catch (error) {
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

type CategoryPageProps = {
  params: {
    category: string;
  };
};

export default function Page({ params }: CategoryPageProps) {
  const { category: categoryName } = params;
  return <Category categoryName={decodeURIComponent(categoryName)} />;
}
