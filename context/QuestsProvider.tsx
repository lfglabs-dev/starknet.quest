"use client";

import { ReactNode, createContext, useMemo, useState } from "react";
import { QueryError, QuestDocument } from "../types/backTypes";
import { useAccount } from "@starknet-react/core";
import { hexToDecimal } from "@utils/feltService";
import { fetchQuestCategoryData, getQuestById } from "@services/apiService";
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
  completedQuests: QuestDocument[];
  completedQuestIds: number[]; 
  completedBoostIds: number[];
  boostedQuests: number[];
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
  completedQuests: [],
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
  const [completedQuests, setCompletedQuests] = useState<QuestDocument[]>([]);
  const [completedQuestIds, setCompletedQuestIds] = useState<number[]>([]);
  const [completedBoostIds, setCompletedBoostIds] = useState<number[]>([]);
  const [boostedQuests, setBoostedQuests] = useState<number[]>([]);
  const { address } = useAccount();

  useMemo(() => {
    (async () => {
      const data: GetQuestsRes = await getQuests();

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
    })();
  }, []);

  useMemo(() => {
    getTrendingQuests(hexToDecimal(address)).then(
      (data: QuestDocument[] | QueryError) => {
        if ((data as QueryError).error) return;
        const quests = data as QuestDocument[];
        setTrendingQuests(quests);
        const notExpired = quests.filter((quest) => !quest.expired);
        setFeaturedQuest(
          notExpired[Math.floor(Math.random() * notExpired.length)]
        );
      }
    );
  }, [address]);




  useMemo(() => {
    if (!quests || featuredQuest || !quests.length) return;
    const notExpired = quests.filter((quest) => !quest.expired);
    const randomQuest =
      notExpired[Math.floor(Math.random() * notExpired.length)];
    setFeaturedQuest(randomQuest);
  }, [quests, address, featuredQuest]);

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
  const fetchCompletedQuests = async () => {
    try {
      const questIds = await getCompletedQuests(hexToDecimal(address));
      const completedQuests = await Promise.all(
        questIds.map((id:number) => getQuestById(id)) 
      );
      setCompletedQuests(completedQuests.filter((quest) => quest !== null));


    } catch (error) {
      console.error("Error fetching completed quests:", error);
    }
  };

  fetchCompletedQuests(); 
}, [address]);


  useMemo(() => {
    getBoostedQuests().then((data: number[] | QueryError) => {
      if ((data as QueryError).error) return;
      setBoostedQuests(data as number[]);
    });
  }, []);

  const contextValues = useMemo(() => {
    return {
      quests,
      featuredQuest,
      categories,
      trendingQuests,
      completedQuests,
      completedQuestIds,
      completedBoostIds,
      boostedQuests,
    };
  }, [
    quests,
    featuredQuest,
    categories,
    trendingQuests,
    completedQuests,
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
