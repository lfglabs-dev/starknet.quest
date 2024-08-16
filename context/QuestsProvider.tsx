"use client";

import React, { ReactNode, createContext, useMemo, useState } from "react";
import {
  BoostedQuests,
  QueryError,
  QuestDocument,
  CompletedQuests,
} from "../types/backTypes";
import { useAccount } from "@starknet-react/core";
import { hexToDecimal } from "@utils/feltService";
import { fetchQuestCategoryData } from "@services/apiService";
import {
  getBoostedQuests,
  getCompletedBoosts,
  getCompletedQuests,
  getQuests,
  getTrendingQuests,
} from "@services/apiService";

interface QuestsConfig {
  quests: QuestDocument[];
  featuredQuest?: QuestDocument;
  categories: QuestCategory[];
  trendingQuests: QuestDocument[];
  completedQuestIds: number[];
  completedBoostIds: number[];
  boostedQuests: number[];
}

export const QuestsContext = createContext<QuestsConfig>({
  quests: [],
  featuredQuest: undefined,
  categories: [],
  trendingQuests: [],
  completedQuestIds: [],
  completedBoostIds: [],
  boostedQuests: [],
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
  const [completedBoostIds, setCompletedBoostIds] = useState<number[]>([]);
  const [boostedQuests, setBoostedQuests] = useState<number[]>([]);
  const { address } = useAccount();

  useMemo(() => {
    (async () => {
      const data = await getQuests();

      if (!data) return;

      const q = Object.values(data).flat();

      const categoriesWithImages = await Promise.all(
        Object.keys(data).map(async (key) => {
          const img = await (async () => {
            try {
              // If a category img is defined in quest_categories use it
              const questData = await fetchQuestCategoryData(key);
              if (!questData || !questData.img_url) return;
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
    })();
  }, []);

  useMemo(() => {
    getTrendingQuests(hexToDecimal(address)).then(
      (data: QuestDocument[] | QueryError) => {
        if (!data || (data as QueryError).error) return;
        setTrendingQuests(data as QuestDocument[]);
      }
    );
  }, [address]);

  useMemo(() => {
    if (!address) return;
    getCompletedBoosts(hexToDecimal(address)).then(
      (data: number[] | QueryError) => {
        if ((data as QueryError).error) return;
        setCompletedBoostIds(data as number[]);
      }
    );
  }, [address]);

  useMemo(() => {
    if (!address) return;
    getCompletedQuests(hexToDecimal(address)).then((data) => {
      if (!data) return;
      setCompletedQuestIds(data as CompletedQuests);
    });
  }, [address]);

  useMemo(() => {
    getBoostedQuests().then((data: BoostedQuests | QueryError | undefined) => {
      if ((data as QueryError).error) return;
      setBoostedQuests(data as BoostedQuests);
    });
  }, []);

  useMemo(() => {
    if (!quests.length) return;
    const notExpired = quests.filter((quest) => !quest.expired);
    const lastBoostedQuest = boostedQuests.length
      ? quests.find(
          (quest) =>
            quest.id === boostedQuests[boostedQuests.length - 1] &&
            !quest.expired
        )
      : undefined;

    setFeaturedQuest(
      lastBoostedQuest ||
        notExpired[Math.floor(Math.random() * notExpired.length)]
    );
  }, [quests, boostedQuests]);

  const contextValues = useMemo(() => {
    return {
      quests,
      featuredQuest,
      categories,
      trendingQuests,
      completedQuestIds,
      completedBoostIds,
      boostedQuests,
    };
  }, [
    quests,
    featuredQuest,
    categories,
    trendingQuests,
    completedQuestIds,
    completedBoostIds,
    boostedQuests,
  ]);

  return (
    <QuestsContext.Provider value={contextValues}>
      {children}
    </QuestsContext.Provider>
  );
};
