"use client";

import React, { useEffect, useState } from "react";
import styles from "@styles/achievements.module.css";
import { CDNImage } from "@components/cdn/image";
import Lottie from "lottie-react";
import verifiedLottie from "@public/visuals/sq_claim.json";

type BoostQuestPageProps = {
  params: {
    achievementId: string;
  };
};

export default function Page({ params }: BoostQuestPageProps) {
  const { achievementId } = params;
  const [displayCard, setDisplayCard] = useState<boolean>(false);
  const [displayLottie, setDisplayLottie] = useState<boolean>(true);

  const fetchPageData = async () => {
    console.log({ achievementId });
  };

  useEffect(() => {
    fetchPageData();
  }, []);

  return (
    <div className={styles.claim_screen_container}>
      <div className="flex flex-col gap-16">
        {displayCard ? (
          <>
            <div className={styles.claim_amount_card}>
              <div className={styles.token_logo}>
                <CDNImage
                  src={"/icons/usdc.svg"}
                  priority
                  width={97}
                  height={97}
                  alt="usdc icon"
                />
              </div>
            </div>
          </>
        ) : null}
      </div>
      {displayLottie ? (
        <div className="absolute ml-auto mr-auto left-0 right-0 flex justify-center w-full">
          <Lottie
            onEnterFrame={() => {
              setDisplayCard(true);
            }}
            onComplete={() => {
              setDisplayLottie(false);
            }}
            className="w-[600px] h-[600px]"
            animationData={verifiedLottie}
            loop={false}
          />
        </div>
      ) : null}
    </div>
  );
}
