import { ReactNode, createContext, useMemo, useState } from "react";
import { QueryError, QuestDocument } from "../types/backTypes";

interface QuestsConfig {
  quests: QuestDocument[];
  featuredQuest?: QuestDocument;
}

export const QuestsContext = createContext<QuestsConfig>({
  quests: [],
  featuredQuest: undefined,
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

  useMemo(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_LINK}/get_quests`)
      .then((response) => response.json())
      .then((data: QuestDocument[] | QueryError) => {
        if (!(data as QueryError).error) {
          setQuests(data as QuestDocument[]);
          const activeQuests = data as QuestDocument[];
          setFeaturedQuest(
            activeQuests.length >= 1
              ? activeQuests[activeQuests.length - 1]
              : undefined
          );
        }
      });
  }, []);

  const contextValues = useMemo(() => {
    return {
      quests,
      featuredQuest,
    };
  }, [quests, featuredQuest]);

  return (
    <QuestsContext.Provider value={contextValues}>
      {children}
    </QuestsContext.Provider>
  );
};
