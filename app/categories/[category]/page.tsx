import type { Metadata, ResolvingMetadata } from "next";
import React from "react";
import Category from "./category";
import { fetchQuestCategoryData } from "../../../services/questService";
import { defaultMetatags } from "../../../constants/metatags";

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
    if (data?.name)
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
    else return defaultMetatags;
  } catch (error) {
    return defaultMetatags;
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
