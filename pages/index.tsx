import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import Quest from "../components/quests/quest";
import { useRouter } from "next/router";
import { QueryError, QuestDocument } from "../types/backTypes";

const Quests: NextPage = () => {
  const router = useRouter();
  const [quests, setQuests] = useState<QuestDocument[]>([]);

  // this fetches all available quests
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_LINK}/get_quests`)
      .then((response) => response.json())
      .then((data: QuestDocument[] | QueryError) => {
        if (!(data as QueryError).error) {
          setQuests(data as QuestDocument[]);
        }
      });
  }, [router]);

  return (
    <div className={styles.screen}>
      <div className={styles.container}>
        <h1 className="title">Get Started with Starknet</h1>
        <div className={styles.questContainer}>
          {quests.map((quest: QuestDocument) => {
            return (
              <Quest
                key={quest.id}
                title={quest.issuer} // todo replace w/ title_card
                onClick={() => router.push(`/quest/${quest.id}`)}
                imgSrc="/starkfighter/level3.webp" // todo replace w/ img_card
                issuer={{
                  name: quest.issuer,
                  logoFavicon: quest.logo,
                }}
                reward={quest.rewards_title}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Quests;
