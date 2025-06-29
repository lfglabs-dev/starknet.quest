"use client";

import React, { useCallback, useEffect, useState } from "react";
import styles from "@styles/questboost.module.css";
import { getQuests } from "@services/apiService";
import BackButton from "@components/UI/backButton";
import { useRouter } from "next/navigation";
import { useAccount } from "@starknet-react/core";
import Quest from "@components/quests/quest";
import { QuestDocument, QuestList } from "../../types/backTypes";
import FeaturedQuestSkeleton from "@components/skeletons/questsSkeleton";
import Typography from "@components/UI/typography/typography";
import { TEXT_TYPE } from "@constants/typography";

export default function Page() {
  const router = useRouter();
  const { address } = useAccount();
  const [loading, setLoading] = useState<boolean>(true);

  const [quests, setQuests] = useState<QuestDocument[]>([]);

  const fetchQuests = useCallback(async () => {
    try {
      setLoading(true);
      const res = (await getQuests()) || {};

      let allQuests: QuestDocument[] = [];
      Object.keys(res).forEach((category) => {
        const categoryQuests = res[category];
        if (Array.isArray(categoryQuests)) {
          allQuests = allQuests.concat(categoryQuests);
        }
      });

      const sortedAllQuests = allQuests.sort((a, b) => b.id - a.id);

      setQuests(sortedAllQuests);
      setLoading(false);
    } catch (error) {
      console.log("Error while fetching quests", error);
    }
  }, []);

  useEffect(() => {
    fetchQuests();
  }, [address]);
  return (
    <div className={styles.container}>
      <div className={styles.backButton}>
        <BackButton onClick={() => router.back()} />
      </div>
      <Typography type={TEXT_TYPE.H1} className={styles.title}>
        Quest Analytics
      </Typography>
      <div className={styles.card_container}>
        {loading ? (
          <FeaturedQuestSkeleton />
        ) : (
          quests.map((quest) => (
            <Quest
              key={quest.id}
              title={quest.title_card}
              onClick={() => router.push(`/analytics/${quest.id}`)}
              imgSrc={quest.img_card}
              issuer={{
                name: quest.issuer,
                logoFavicon: quest.logo,
              }}
              reward={quest.rewards_title}
              id={quest.id}
              expired={false}
            />
          ))
        )}
      </div>
    </div>
  );
}
