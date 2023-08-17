import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import Quest from "../components/quests/quest";
import FeaturedQuest from "../components/quests/featuredQuest";
import QuestsSkeleton from "../components/skeletons/questsSkeleton";

import { useRouter } from "next/router";
import { QueryError, QuestDocument } from "../types/backTypes";
import HowToParticipate from "../components/pages/home/howToParticipate";

const Quests: NextPage = () => {
  const router = useRouter();
  const [quests, setQuests] = useState<QuestDocument[]>([]);
  const [featuredQuest, setFeaturedQuest] = useState<
    QuestDocument | undefined
  >();

  // this fetches all available quests
  useEffect(() => {
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
  }, [router]);

  return (
    <div className={styles.screen}>
      <div className={styles.container}>
        <FeaturedQuest
          key={featuredQuest?.id}
          title={featuredQuest?.title_card}
          onClick={() => router.push(`/quest/${featuredQuest?.id}`)}
          imgSrc={featuredQuest?.img_card}
          issuer={{
            name: featuredQuest?.issuer ?? "",
            logoFavicon: featuredQuest?.logo ?? "",
          }}
          reward={featuredQuest?.rewards_title}
          desc={featuredQuest?.desc}
          expiry={featuredQuest?.expiry_timestamp}
        />
        <h1 className={styles.title}>Accomplish your Starknet Quests</h1>
        <div className={styles.questContainer}>
          {quests ? (
            quests.map((quest) => {
              return (
                <Quest
                  key={quest.id}
                  title={quest.title_card}
                  onClick={() => router.push(`/quest/${quest.id}`)}
                  imgSrc={quest.img_card}
                  issuer={{
                    name: quest.issuer,
                    logoFavicon: quest.logo,
                  }}
                  reward={quest.rewards_title}
                />
              );
            })
          ) : (
            <QuestsSkeleton />
          )}
        </div>
        <HowToParticipate />
      </div>
    </div>
  );
};

export default Quests;
