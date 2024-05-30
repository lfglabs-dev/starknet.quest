import React, { FunctionComponent } from "react";
import styles from "@styles/quests.module.css";
import Button from "@components/UI/button";
import { useMediaQuery } from "@mui/material";
import FeaturedQuestSkeleton from "@components/skeletons/featuredQuestSkeleton";
import Timer from "@components/quests/timer";
import { CDNImage } from "@components/cdn/image";
import BoostReward from "@components/quests/boostReward";
import { Skeleton } from "@mui/material";
import QuestTag from "../questTag";

type FeaturedQuestProps = {
  onClick?: () => void;
  imgSrc?: string;
  title?: string;
  issuer?: Issuer;
  reward?: string;
  desc?: string;
  expiry: string | null | undefined;
  heading: string;
  questId?: number;
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
  questId,
}) => {
  const isSmallScreen = useMediaQuery("(max-width: 1024px)");

  return onClick ? (
    <div className={styles.featuredQuest}>
      <div className={styles.featuredQuestInfos}>
        <p className={styles.featuredQuestHeading}>{heading}</p>
        {title ? <h3 className={styles.featuredQuestTitle}>{title}</h3> : 
          <>
            {
              [...Array(2)].map((_, index) => (<Skeleton
              variant="text"
              key={index}
              className={styles.featuredQuestContentLoading}
              sx={{ fontSize: "3rem", bgcolor: "grey.700" }}
            />))
            }
          </>
          }
        {desc ? <p className={styles.featuredQuestDescription}>{desc}</p> : 
          <>
          {
              [...Array(5)].map((_, index) => (<Skeleton
                variant="text"
                key={index}
                className={styles.featuredQuestContentLoading}
                sx={{ fontSize: "1rem", bgcolor: "grey.800" }}
              />))
            }
          </>
          }

        <div className="flex items-center mb-4 mt-6 gap-2">
          {issuer?.name || issuer?.logoFavicon ? (
            <QuestTag label={reward ?? ''} icon={issuer?.logoFavicon} />
          ) : null}

          {questId ? <BoostReward questId={questId} /> : null}
          
        </div>

        <div className={styles.featuredQuestButtonContainer}>
          <Button onClick={onClick}>Begin</Button>
        </div>
      </div>
      <div className={styles.featuredQuestImageContainer}>
        {imgSrc
        ? <CDNImage alt={"Feature Quest Image"} src={imgSrc} fill className={styles.featuredQuestImage} priority sizes="(max-width: 1025px) 85vw, 33vw"/>
        : <Skeleton variant="rectangular" animation="wave" className={styles.featuredQuestImageSkeleton} sx={{ bgcolor: 'grey.900' }} /> }
        {expiry ? <Timer expiry={Number(expiry)} /> : null}
      </div>
    </div>
  ) : !onClick && !isSmallScreen ? (
    <FeaturedQuestSkeleton />
  ) : null;
};

export default FeaturedQuest;
