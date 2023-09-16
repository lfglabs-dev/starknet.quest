import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import FeaturedQuest from "../components/quests/featuredQuest";

import { useRouter } from "next/router";
import { QueryError, QuestDocument } from "../types/backTypes";
import HowToParticipate from "../components/pages/home/howToParticipate";
import QuestCategories from "../components/pages/home/questCategories";
import TrendingQuests from "../components/pages/home/trending";
import Blur from "../components/shapes/blur";
import HomeControls from "../components/pages/home/homeControls";

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
        <HomeControls />
        <div className={styles.blur1}>
          <Blur />
        </div>
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
        <QuestCategories quests={quests} />
        <div className={styles.blur2}>
          <Blur green />
        </div>
        <TrendingQuests quests={quests} />
        <HowToParticipate />
      </div>
    </div>
  );
};

export default Quests;
