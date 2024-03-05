"use client";

import React, { useCallback, useEffect, useState } from "react";
import styles from "@styles/questboost.module.css";
import { getQuests } from "@services/apiService";
import BackButton from "@components/UI/backButton";
import { useRouter } from "next/navigation";
import { useAccount } from "@starknet-react/core";
import Quest from "@components/quests/quest";
import { QuestDocument } from "../../types/backTypes";

export default function Page() {
  const router = useRouter();
  const { address } = useAccount();

  const [quests, setQuests] = useState<Record<string, [QuestDocument]>>({});

  const fetchQuests = useCallback(async () => {
    try {
      const res = await getQuests();
      setQuests(res);
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
        {Object.keys(quests).map((categoryName: string) => {
          return quests[categoryName as keyof typeof quests].map(
            (quest: QuestDocument) => {
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
                  expired={quest.expired}
                />
              );
            }
          );
        })}
      </div>
    </div>
  );
}
