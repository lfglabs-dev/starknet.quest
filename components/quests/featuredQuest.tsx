import React, { FunctionComponent } from "react";
import styles from "../../styles/quests.module.css";
import Button from "../UI/button";
import { useMediaQuery } from "@mui/material";
import FeaturedQuestSkeleton from "../skeletons/featuredQuestSkeleton";

type FeaturedQuestProps = {
  onClick?: () => void;
  imgSrc?: string;
  title?: string;
  issuer?: Issuer;
  reward?: string;
  desc?: string;
};

const FeaturedQuest: FunctionComponent<FeaturedQuestProps> = ({
  onClick,
  imgSrc,
  title,
  issuer,
  reward,
  desc,
}) => {
  const isSmallScreen = useMediaQuery("(max-width: 1024px)");

  return onClick && !isSmallScreen ? (
    <div className={styles.featuredQuest}>
      <div className={styles.featuredQuestInfos}>
        <p className="text-gray-200	mt-2 text-start">Featured</p>
        <h3 className={styles.featuredQuestTitle}>{title}</h3>
        <p className="text-gray-200	 mt-4 text-start">{desc}</p>
        <div className="flex mt-4 mb-4 items-center">
          <img width={20} src={issuer?.logoFavicon} />
          <p className="text-white ml-2">{reward}</p>
        </div>
        <div className="w-2/5">
          <Button onClick={onClick}>Begin</Button>
        </div>
      </div>
      <img src={imgSrc} className={styles.featuredQuestImage} />
    </div>
  ) : !onClick && !isSmallScreen ? (
    <FeaturedQuestSkeleton />
  ) : null;
};

export default FeaturedQuest;
