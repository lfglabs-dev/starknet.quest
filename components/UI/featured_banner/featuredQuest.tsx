import React, { FunctionComponent } from "react";
import styles from "@styles/quests.module.css";
import Button from "@components/UI/button";
import { useMediaQuery } from "@mui/material";
import FeaturedQuestSkeleton from "@components/skeletons/featuredQuestSkeleton";
import Timer from "@components/quests/timer";
import { CDNImg } from "@components/cdn/image";

type FeaturedQuestProps = {
  onClick?: () => void;
  imgSrc?: string;
  title?: string;
  issuer?: Issuer;
  reward?: string;
  desc?: string;
  expiry: string | null | undefined;
  heading: string;
};

const FeaturedQuest: FunctionComponent<FeaturedQuestProps> = ({
  onClick,
  imgSrc,
  title,
  issuer,
  reward,
  desc,
  expiry,
  heading,
}) => {
  const isSmallScreen = useMediaQuery("(max-width: 1024px)");

  return onClick ? (
    <div className={styles.featuredQuest}>
      <div className={styles.featuredQuestInfos}>
        <p className={styles.featuredQuestHeading}>{heading}</p>
        <h3 className={styles.featuredQuestTitle}>{title}</h3>
        <p className={styles.featuredQuestDescription}>{desc}</p>
        {issuer?.name || issuer?.logoFavicon ? (
          <div className={`${styles.issuer}  mb-4 mt-6`}>
            <CDNImg
              width={20}
              src={issuer?.logoFavicon}
              className={styles.featuredQuestRewardIcon}
            />
            <p className={styles.featuredQuestReward}>{reward}</p>
          </div>
        ) : null}
        <div className={styles.featuredQuestButtonContainer}>
          <Button onClick={onClick}>Begin</Button>
        </div>
      </div>
      <div className={styles.featuredQuestImageContainer}>
        <CDNImg src={imgSrc} className={styles.featuredQuestImage} />
        {expiry ? <Timer expiry={Number(expiry)} /> : null}
      </div>
    </div>
  ) : !onClick && !isSmallScreen ? (
    <FeaturedQuestSkeleton />
  ) : null;
};

export default FeaturedQuest;
