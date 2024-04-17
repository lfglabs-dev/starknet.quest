"use client";

import React, { useCallback, useEffect, useState } from "react";
import styles from "@styles/admin.module.css";
import { getQuests } from "@services/apiService";
import BackButton from "@components/UI/backButton";
import { useRouter } from "next/navigation";
import { useAccount } from "@starknet-react/core";
import Quest from "@components/quests/quest";
import { QuestDocument } from "../../../types/backTypes";
import FeaturedQuestSkeleton from "@components/skeletons/questsSkeleton";

export default function Page() {
  const router = useRouter();
  const { address } = useAccount();
  const [loading, setLoading] = useState<boolean>(true);

  const [quests, setQuests] = useState<Record<string, [QuestDocument]>>({});

  const fetchQuests = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getQuests();
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
    <div className={styles.screenContainer}>
      <div className={styles.backButton}>
        <BackButton onClick={() => router.back()} />
      </div>
      <div className={styles.questsBanner}>
        <p>Admin</p>
        <p className={styles.questListHeading}>Braavos quests</p>
        <p>4 quests</p>
      </div>
      <div className={styles.card_container}>
        {loading ? (
          <FeaturedQuestSkeleton />
        ) : (
          Object.keys(quests).map((categoryName: string) => {
            return quests[categoryName as keyof typeof quests].map(
              (quest: QuestDocument) => {
                return (
                  <Quest
                    key={quest.id}
                    title={quest.title_card}
                    onClick={() =>
                      router.push(`/admin/quests/dashboard/${quest.id}`)
                    }
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
              }
            );
          })
        )}
      </div>
    </div>
  );
}
