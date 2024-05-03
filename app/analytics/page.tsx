"use client";

import React, { useCallback, useEffect, useState } from "react";
import styles from "@styles/questboost.module.css";
import { getQuests } from "@services/apiService";
import BackButton from "@components/UI/backButton";
import { useRouter } from "next/navigation";
import { useAccount } from "@starknet-react/core";
import Quest from "@components/quests/quest";
import { GetQuestsRes, QuestDocument } from "../../types/backTypes";
import FeaturedQuestSkeleton from "@components/skeletons/questsSkeleton";

export default function Page() {
  const router = useRouter();
  const { address } = useAccount();
  const [loading, setLoading] = useState<boolean>(true);

  const [quests, setQuests] = useState<GetQuestsRes>({} as GetQuestsRes);

  const fetchQuests = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getQuests() || {};
      setQuests(res);
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
      <h1 className={styles.title}>Quest Analytics</h1>
      <div className={styles.card_container}>
        {loading ? (
          <FeaturedQuestSkeleton />
        ) : (
          (Object.keys(quests) as (keyof typeof quests)[]).map((categoryName: keyof typeof quests) => {
            const categoryValue = quests[categoryName];
            if (Array.isArray(categoryValue)) {
              return categoryValue.map((quest: QuestDocument) => {
                return (
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
                );
              });
            }
            return null; 
          })
        )}
      </div>
    </div>
  );
}
