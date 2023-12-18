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
        <p className="mt-2 text-start">{heading}</p>
        <h3 className={styles.featuredQuestTitle}>{title}</h3>
        <p className="text-gray-200	 mt-4 text-start">{desc}</p>
        <div className="flex mt-4 mb-4 items-center">
          <CDNImg width={20} src={issuer?.logoFavicon} />
          <p className="text-white ml-2">{reward}</p>
        </div>
        <div>
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
