"use client";
import React, { useCallback } from "react";
import styles from "@styles/Home.module.css";
import { useRouter } from "next/navigation";
import Typography from "@components/UI/typography/typography";
import { TEXT_TYPE } from "@constants/typography";
import MainHeader from "@components/pages/home/hero";
import Card from "@components/pages/home/card";
import CallToAction from "@components/pages/home/callToAction";
import AnimatedBackground from "@components/shapes/animatedBackground";

export default function Page() {
  const router = useRouter();

  const handleNavigateToDefi = useCallback(() => {
    router.push("/discover/defi");
  }, [router]);

  const handleNavigateToQuests = useCallback(() => {
    router.push("/quests");
  }, [router]);

  return (
    <div className={styles.screen}>
      <div className="flex flex-col items-center justify-center">
        <div className={styles.blur1}>
          <AnimatedBackground />
        </div>

        <MainHeader />

        <CallToAction>
          <Card
            title="DeFi"
            imgSrc="/home/defi.webp"
            onClick={handleNavigateToDefi}
          >
            <Typography type={TEXT_TYPE.BODY_MICRO} color="textGray">
              Access the top DeFi opportunities on Starknet and grow your assets
              effortlessly.
            </Typography>
          </Card>
          <Card
            title="Quest"
            imgSrc="/home/quests.webp"
            onClick={handleNavigateToQuests}
          >
            <Typography type={TEXT_TYPE.BODY_MICRO} color="textGray">
              Complete exciting quests, earn rewards, and deepen your knowledge
              of Starknet.
            </Typography>
          </Card>
        </CallToAction>
      </div>
    </div>
  );
}
