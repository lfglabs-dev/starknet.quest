import { ReactNode, createContext, useMemo, useState } from "react";
import { QueryError, QuestDocument } from "../types/backTypes";

interface QuestsConfig {
  quests: QuestDocument[];
  featuredQuest?: QuestDocument;
  categories: QuestCategory[];
  trendingQuests: QuestDocument[];
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

  useMemo(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_LINK}/get_quests`)
      .then((response) => response.json())
      .then((data: GetQuestsRes) => {
        if ((data as QueryError).error) return;
        const q = Object.values(data).flat();
        setCategories(
          Object.keys(data).map((key) => ({
            name: key,
            img: q.filter((quest) => quest.category === key)[0]?.img_card,
            questNumber: q.filter((quest) => quest.category === key).length,
            quests: q.filter((quest) => quest.category === key),
          }))
        );
        setQuests(q);
        setFeaturedQuest(q.length >= 1 ? q[q.length - 1] : undefined);
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

  const contextValues = useMemo(() => {
    return {
      quests,
      featuredQuest,
      categories,
      trendingQuests: trendingQuests,
    };
  }, [quests, featuredQuest, categories, trendingQuests]);

  return (
    <QuestsContext.Provider value={contextValues}>
      {children}
    </QuestsContext.Provider>
  );
};
