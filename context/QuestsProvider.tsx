"use client";

import { ReactNode, createContext, useMemo, useState } from "react";
import { QueryError, QuestDocument } from "../types/backTypes";
import { useAccount } from "@starknet-react/core";
import { hexToDecimal } from "@utils/feltService";
import { fetchQuestCategoryData } from "@services/questService";

interface QuestsConfig {
  quests: QuestDocument[];
  featuredQuest?: QuestDocument;
  categories: QuestCategory[];
  trendingQuests: QuestDocument[];
  completedQuestIds: number[];
}

type GetQuestsRes =
  | {
      [key: string]: QuestDocument[];
    }
  | QueryError;

export const QuestsContext = createContext<QuestsConfig>({
  quests: [],
  featuredQuest: undefined,
  categories: [],
  trendingQuests: [],
  completedQuestIds: [],
});

export const QuestsContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [quests, setQuests] = useState<QuestDocument[]>([]);
  const [featuredQuest, setFeaturedQuest] = useState<
    QuestDocument | undefined
  >();
  const [categories, setCategories] = useState<QuestCategory[]>([]);
  const [trendingQuests, setTrendingQuests] = useState<QuestDocument[]>([]);
  const [completedQuestIds, setCompletedQuestIds] = useState<number[]>([]);
  const { address } = useAccount();

  useMemo(() => {
    (async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_LINK}/get_quests`
      );
      const data: GetQuestsRes = await response.json();
      if ((data as QueryError).error) return;

      const q = Object.values(data).flat();

      const categoriesWithImages = await Promise.all(
        Object.keys(data).map(async (key) => {
          const img = await (async () => {
            try {
              // If a category img is defined in quest_categories use it
              const questData = await fetchQuestCategoryData(key);
              return questData.img_url;
            } catch (error) {
              // else use img from first quest in the category
              return q.filter((quest) => quest.category === key)[0].img_card;
            }
          })();
          const questNumber = q.filter(
            (quest) => quest.category === key
          ).length;
          const quests = q.filter((quest) => quest.category === key);

          return {
            name: key,
            img,
            questNumber,
            quests,
          };
        })
      );

      setCategories(categoriesWithImages);
      setQuests(q);

      const notExpired = q.filter((quest) => !quest.expired);
      setFeaturedQuest(
        notExpired.length >= 1 ? notExpired[notExpired.length - 1] : undefined
      );
    })();
  }, []);

  useMemo(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_LINK}/get_trending_quests`)
      .then((response) => response.json())
      .then((data: QuestDocument[] | QueryError) => {
        if ((data as QueryError).error) return;
        setTrendingQuests(data as QuestDocument[]);
      });
  }, []);

  useMemo(() => {
    if (!address) return;
    fetch(
      `${
        process.env.NEXT_PUBLIC_API_LINK
      }/get_completed_quests?addr=${hexToDecimal(address)}`
    )
      .then((response) => response.json())
      .then((data: number[] | QueryError) => {
        if ((data as QueryError).error) return;
        setCompletedQuestIds(data as number[]);
      });
  }, [address]);

  const contextValues = useMemo(() => {
    return {
      quests,
      featuredQuest,
      categories,
      trendingQuests,
      completedQuestIds,
    };
  }, [quests, featuredQuest, categories, trendingQuests, completedQuestIds]);

  return (
    <QuestsContext.Provider value={contextValues}>
      {children}
    </QuestsContext.Provider>
  );
};
