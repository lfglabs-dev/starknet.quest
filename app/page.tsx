"use client";
import React, { useContext} from "react";
import styles from "@styles/Home.module.css";
import { useRouter } from "next/navigation";
import HowToParticipate from "@components/pages/home/howToParticipate";
import Stats from "@components/UI/stats/stats";
import Blur from "@components/shapes/blur";
import { QuestsContext } from "@context/QuestsProvider";
import FeaturedQuest from "@components/UI/featured_banner/featuredQuest";
import QuestAndCollectionTabs from "@components/pages/home/questAndCollectionTabs";
import CategoryTitle from "@components/UI/titles/categoryTitle";

export default function Page() {
  const router = useRouter();
  const { featuredQuest, categories, trendingQuests, quests } = useContext(QuestsContext);
  
  return (
    <div className={styles.screen}>
      <div className={styles.container}>
        <div className={styles.blur1}>
          <Blur />
        </div>
        <div className={styles.featured_quest_banner_container}>
          <FeaturedQuest
            heading="Featured"
            key={featuredQuest?.id}
            title={featuredQuest?.title_card}
            onClick={() => router.push(`/quest/${featuredQuest?.id}`)}
            imgSrc={featuredQuest?.img_card}
            issuer={{ name: featuredQuest?.issuer ?? "", logoFavicon: featuredQuest?.logo ?? "" }}
            reward={featuredQuest?.rewards_title}
            desc={featuredQuest?.desc}
            expiry={featuredQuest?.expiry_timestamp}
            questId={featuredQuest?.id}
          />
        </div>
        <QuestAndCollectionTabs quests={quests} categories={categories} trendingQuests={trendingQuests} />
        <CategoryTitle subtitle="Get access to our community" title="About our quests" corner="bottomLeft" squares="bottomRight" />
        <Stats
          stats={[
            { name: "Quests NFT minted", value: "+1M" },
            { name: "Unique addresses", value: "398K" },
            { name: "Unique visitors", value: "+200K" },
          ]}
        />
        <div className={styles.blur2}>
          <Blur green />
        </div>
        <HowToParticipate />
      </div>
    </div>
  );
}