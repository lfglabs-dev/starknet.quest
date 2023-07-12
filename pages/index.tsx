import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import Quest from "../components/quests/quest";
import FeaturedQuest from "../components/quests/featuredQuest";
import QuestsSkeleton from "../components/skeletons/questsSkeleton";

import { useRouter } from "next/router";
import { QueryError, QuestDocument } from "../types/backTypes";
import CategoryTitle from "../components/UI/titles/categoryTitle";
import Steps from "../components/UI/steps";
import Crosses from "../components/shapes/crosses";

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
          const activeQuests = (data as QuestDocument[]).filter(
            (quest) => !quest.finished
          );
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
        />
        <h1 className={styles.title}>Accomplish your Starknet Quests</h1>
        <div className={styles.questContainer}>
          {quests ? (
            quests
              .filter((quest) => !quest.finished)
              .map((quest) => {
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
        <section>
          <CategoryTitle
            title="How to Participate ?"
            subtitle="Engage in the Starknet Experience: Unlock New Possibilities"
          />
          <div className={styles.stepsContainer}>
            <Steps
              subTitleBefore={true}
              steps={[
                {
                  title: "Get Your Stark Domain",
                  subtitle: "01",
                  description:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                  icon: "/icons/starknet.svg",
                  banner: "/visuals/getYourStarkDomain.webp",
                },
                {
                  title: "Collect NFTs in Starknet Quest",
                  subtitle: "02",
                  description:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                  icon: "/icons/crown.svg",
                  banner: "/visuals/collectNFTsInStarknetQuest.webp",
                },
                {
                  title: "Build your Starknet Land",
                  subtitle: "03",
                  description:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                  icon: "/icons/verified.svg",
                  banner: "/visuals/buildYourStarknetLand.webp",
                },
              ]}
            />
            <Crosses xDecal={-300} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Quests;
