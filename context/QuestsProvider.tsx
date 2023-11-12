import { ReactNode, createContext, useMemo, useState } from "react";
import { QueryError, QuestDocument } from "../types/backTypes";
import { useAccount } from "@starknet-react/core";
import { hexToDecimal } from "../utils/feltService";

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
    fetch(`${process.env.NEXT_PUBLIC_API_LINK}/get_quests`)
      .then((response) => response.json())
      .then((data: GetQuestsRes) => {
        if ((data as QueryError).error) return;
        const q = Object.values(data).flat();
        setCategories(
          Object.keys(data).map((key) => ({
            name: key,
            img: q.filter((quest) => quest.category === key)[0].img_card,
            questNumber: q.filter((quest) => quest.category === key).length,
            quests: q.filter((quest) => quest.category === key),
          }))
        );
        setQuests(q);
        const notExpired = q.filter((quest) => !quest.expired);
        setFeaturedQuest(
          notExpired.length >= 1 ? notExpired[notExpired.length - 1] : undefined
        );
      });
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
