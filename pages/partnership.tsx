import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import styles from "../styles/partnership.module.css";

import { useRouter } from "next/router";
import { QueryError, QuestDocument } from "../types/backTypes";
import CategoryTitle from "../components/UI/titles/categoryTitle";
import Steps from "../components/UI/steps";
import Crosses from "../components/shapes/crosses";
import MainTitle from "../components/UI/titles/mainTitle";
import Cross from "../components/shapes/cross";
import Stats from "../components/UI/stats/stats";
import Box from "../components/UI/box";
import Dots from "../components/shapes/dots";
import { useLottie } from "lottie-react";
import JedieSwapLottie from "../public/visuals/JediswapLottie.json";
import OnScrollIntoView from "../components/animations/onScrollIntoView";

const Partnership: NextPage = () => {
  const router = useRouter();
  const [quests, setQuests] = useState<QuestDocument[]>([]);
  const [featuredQuest, setFeaturedQuest] = useState<
    QuestDocument | undefined
  >();

  const { View: JediSwapView, play: jediSwapPlay } = useLottie({
    animationData: JedieSwapLottie,
    loop: false,
    autoplay: false,
  });

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

  useEffect(() => {
    const body = document.body;
    const parent = body.parentNode as HTMLElement;
    const interval = setInterval(() => {
      const scrollTop = body.scrollTop || parent?.scrollTop || 0;
      document.documentElement.style.setProperty("--scroll", `${scrollTop}`);
    }, 1);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.screen}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.mainTitleContainer}>
              <MainTitle
                title="Unlock Starknet Quests:"
                highlighted="Engage, Reward & Thrive"
                subtitle="Experience a groundbreaking platform that revolutionizes user engagement and rewards through specialized on-chain quests on Starknet. Explore the possibilities, foster loyalty, and take your project to new heights."
                corner="topRight"
                squares="bottomLeft"
              />
            </div>
            <img
              src="/visuals/partnershipHeader.webp"
              className={styles.headerImg}
            />
          </div>
          <div className={styles.cross1}>
            <Cross />
          </div>
          <div className={[styles.divider, styles.dividerGradient].join(" ")} />
          <img src="/utils/headerDivider.svg" className={styles.divider} />
        </header>
        <main className={styles.main}>
          <section className={styles.section}>
            <CategoryTitle
              title="Starknet Quests Lead the Way"
              subtitle="Revolutionizing Rewards"
              corner={null}
            />

            <div className={styles.stepsContainer}>
              <div className={styles.dots1}>
                <OnScrollIntoView animation="fadeIn">
                  <Dots />
                </OnScrollIntoView>
              </div>
              <div className={styles.cross2}>
                <Cross />
              </div>
              <Steps
                subTitleBefore={false}
                steps={[
                  {
                    title: "Starknet On-Chain quests",
                    subtitle: "/Seamless onboarding, authentic rewards",
                    description:
                      "Accelerate user onboarding and reward authenticity with seamless Starknet quests that showcase the unique capabilities and benefits of the Starknet ecosystem.",
                    icon: "/icons/starknet.svg",
                    banner: "/visuals/getYourStarkDomain.webp",
                  },
                  {
                    title: "Inspired by your project",
                    subtitle: "/Tailored quests, organic marketing",
                    description:
                      "Unlock the potential of tailored Starknet Quests designed to align with your project's vision and values, providing everlasting, organic, and cost-effective marketing on users' Starknet Quest profiles",
                    icon: "/icons/clipboard.svg",
                    banner: "/visuals/inspiredByYourProject.webp",
                    overlay: (
                      <OnScrollIntoView
                        callback={() => setTimeout(jediSwapPlay, 1000)}
                      >
                        <div className={styles.jediSwapLottie}>
                          {JediSwapView}
                        </div>
                      </OnScrollIntoView>
                    ),
                  },
                  {
                    title: "Airdrops are so 2021",
                    subtitle: "/Authentic engagement, better approach",
                    description:
                      "Move beyond ineffective token distribution. Our innovative approach ensures genuine user engagement, leaving behind the flaws of traditional airdrops. Experience a better way to reward authenticity and provide real value to users",
                    icon: "/icons/user.svg",
                    banner: "/visuals/airdropsAreSo2021.webp",
                  },
                  {
                    title: "Meaningful Rewards",
                    subtitle: "/Empower, captivate, foster loyalty",
                    description:
                      "Empower your community with meaningful rewards that hold intrinsic value within the Starknet ecosystem. Cultivate loyalty and unlock new dimensions of engagement through Starknet Quests, offering unique and captivating experiences.",
                    icon: "/icons/crown.svg",
                    banner: "/visuals/meaningfulRewards.webp",
                  },
                  {
                    title: "Sybil-resistant marketing",
                    subtitle: "/Genuine interactions, fraud protection",
                    description:
                      "Ensure genuine user interactions and protect your community from fraudulent activities by leveraging secure Starknet Quests, eliminating bots, and fostering authentic growth and sustainable success.",
                    icon: "/icons/shield.svg",
                    banner: "/visuals/sybilResistantMarketing.webp",
                  },
                  {
                    title: "A Quest that fits your need",
                    subtitle: "/Customized quests, maximum participation",
                    description:
                      "Customize Starknet Quests to meet your project's needs, seamlessly executing captivating quests on the blockchain or integrating with external interactions, maximizing user participation and satisfaction.",
                    icon: "/icons/verified.svg",
                    banner: "/visuals/buildYourStarknetLand.webp",
                  },
                ]}
              />
              <Crosses number={4} xDecal={-300} />
            </div>
          </section>
          <section className={styles.section}>
            <CategoryTitle
              title="Starknet Quests Lead the Way"
              subtitle="Revolutionizing Rewards"
              corner="bottomLeft"
              squares="bottomRight"
            />
            <Stats
              title="Community interactions"
              stats={[
                {
                  name: "Lorem Ipsum",
                  value: "3x",
                },
                {
                  name: "Lorem Ipsum",
                  value: "+10%",
                },
                {
                  name: "Lorem Ipsum",
                  value: "40",
                },
              ]}
            />
            <Stats
              title="Business Returns Examples"
              stats={[
                {
                  name: "Lorem Ipsum",
                  value: "3250",
                },
                {
                  name: "Lorem Ipsum",
                  value: "478x",
                },
                {
                  name: "Lorem Ipsum",
                  value: "78%",
                },
              ]}
            />
          </section>
          <div className={styles.dots2}>
            <OnScrollIntoView animation="fadeIn">
              <Dots />
            </OnScrollIntoView>
          </div>
          <section
            className={[styles.section, styles.partnerSection].join(" ")}
          >
            <Box>
              <CategoryTitle
                subtitle="Our partners"
                title="They worked with us"
                corner={null}
              />
              <div className={styles.partnersContainer}>
                <img src="/partners/braavosLogo.svg" />
                <img src="/partners/zklendLogo.svg" />
                <img src="/partners/SithswapLogo.svg" />
                <img src="/partners/JEDIswapLogo.svg" />
                <img src="/partners/AVNULogo.svg" />
              </div>
            </Box>
            <Crosses leftSide={false} number={2} xDecal={-50} />
          </section>
        </main>
      </div>
    </div>
  );
};

export default Partnership;
