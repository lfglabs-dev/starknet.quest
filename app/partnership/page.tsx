"use client";

import React, { useEffect } from "react";
import type { NextPage } from "next";
import styles from "../../../styles/partnership.module.css";
import CategoryTitle from "../../../components/UI/titles/categoryTitle";
import Steps from "../../../components/UI/steps/steps";
import Crosses from "../../../components/shapes/crosses";
import MainTitle from "../../../components/UI/titles/mainTitle";
import Cross from "../../../components/shapes/cross";
import Stats from "../../../components/UI/stats/stats";
import Box from "../../../components/UI/box";
import Dots from "../../../components/shapes/dots";
import OnScrollIntoView from "../../../components/animations/onScrollIntoView";
import Blur from "../../../components/shapes/blur";
import Card from "../../../components/UI/card";
import team from "../../../public/starknetid/team.json";
import TwitterIcon from "../../../components/UI/iconsComponents/icons/twitterIcon";

const Partnership: NextPage = () => {
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
          <div className={styles.blueBlur} />
          <div className={styles.headerContent}>
            <div className={styles.mainTitleContainer}>
              <MainTitle
                title="Unlock Starknet Quests:"
                highlighted="Engage, Reward & Thrive"
                subtitle="Experience a Starknet native platform that revolutionizes user engagement and web3 marketing with on-chain quests."
                corner="topRight"
                squares="bottomLeft"
              />
            </div>
            <img
              src="/visuals/partners/partnershipHeader.webp"
              className={styles.headerImg}
            />
          </div>
          <div className={styles.cross1}>
            <Cross />
          </div>
          <div className={`${styles.divider} ${styles.dividerGradient}`} />
          <img src="/utils/headerDivider.svg" className={styles.divider} />
        </header>
        <main className={styles.main}>
          <section className={styles.section}>
            <CategoryTitle
              title="Why Starknet Quest ?"
              subtitle="Revolutionizing web3 Marketing"
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
                    title: "Starknet native Quests",
                    subtitle: "Seamless onboarding",
                    description:
                      "Accelerate user onboarding and reward authenticity with on-chain quests that showcase the unique capabilities and benefits of your Starknet app.",
                    icon: "/icons/starknet.svg",
                    banner: "/visuals/partners/getYourStarkDomain.webp",
                  },
                  {
                    title: "Completely Customizable",
                    subtitle: "Mix on and off chain tasks",
                    description:
                      "Unlock the potential of a quest designed to align with your project's style and need. Quest's tasks and rewards are completely programmable with on and off-chain services to perfectly fit your need. ",
                    icon: "/icons/clipboard.svg",
                    banner: "/visuals/partners/buildYourStarknetLand.webp",
                  },
                  {
                    title: "Airdrops are so 2021",
                    subtitle: "Authentic engagement",
                    description:
                      "Move beyond ineffective reward distribution. Experience a better way to reward authenticity without spending your precious tokens.",
                    icon: "/icons/user.svg",
                    banner: "/visuals/partners/airdropsAreSo2021.webp",
                  },
                  {
                    title: "Meaningful Rewards",
                    subtitle: "Empower, captivate, foster loyalty",
                    description:
                      "Cultivate loyalty and unlock new dimensions of engagement through Starknet Quests, offering a unique gamification experience.",
                    icon: "/icons/crown.svg",
                    banner: "/visuals/partners/meaningfulRewards.webp",
                  },
                  {
                    title: "Sybil-resistant marketing",
                    subtitle: "Genuine interactions, fraud protection",
                    description:
                      "By using the Starknet ID infrastructure we eliminate bots and robots from your campaigns and stimulate your growth with real Starknet users.",
                    icon: "/icons/shield.svg",
                    banner: "/visuals/partners/sybilResistantMarketing.webp",
                  },
                ]}
              />
              <Crosses number={4} xDecal={-300} />
            </div>
          </section>
          <section className={styles.section}>
            <CategoryTitle
              subtitle="Get access to our community"
              title="About our quests"
              corner="bottomLeft"
              squares="bottomRight"
            />

            <Stats
              stats={[
                {
                  name: "Quests NFT minted",
                  value: "+1M",
                },
                {
                  name: "Unique addresses",
                  value: "398K",
                },
                {
                  name: "Unique visitors on our website",
                  value: "+200K",
                },
              ]}
            />
          </section>
          <div className={styles.dots2}>
            <OnScrollIntoView animation="fadeIn">
              <Dots />
            </OnScrollIntoView>
          </div>
          <section className={`${styles.section} ${styles.partnerSection}`}>
            <Box>
              <CategoryTitle
                subtitle="Our partners"
                title="They worked with us"
              />
              <div className={styles.partnersContainer}>
                <img src="/partners/braavosLogo.svg" />
                <img src="/partners/zklendLogo.svg" />
                <img src="/partners/sithswapLogo.svg" />
                <img src="/partners/jediswapLogo.svg" />
                <img src="/partners/avnuLogo.svg" />
              </div>
            </Box>
            <div className={styles.lastCrosses}>
              <Crosses leftSide={false} number={2} xDecal={-50} />
            </div>
          </section>
          <section className={`${styles.section} mt-10`}>
            <div className={styles.blur1}>
              <Blur />
            </div>
            <h1 className={styles.title}>Meet our team</h1>
            <div className={styles.teamContainer}>
              {team.map((member, index) => (
                <Card
                  title={member.username}
                  imgSrc={`/starknetid/team/${member.username}.webp`}
                  onClick={() =>
                    window.open(`https://twitter.com/${member.twitter}`)
                  }
                  key={index}
                >
                  <div className="flex">
                    <div className={styles.twitterIcon}>
                      <TwitterIcon width="20" color="black" />
                    </div>
                    <p className="ml-2">{member.role}</p>
                  </div>
                </Card>
              ))}
              <div className={styles.blur2}>
                <Blur green />
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Partnership;
