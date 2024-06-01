import React, { FunctionComponent, useMemo } from "react";
import styles from "@styles/achievements.module.css";
import {
  AchievementDocument,
  AchievementsDocument,
} from "../../types/backTypes";
import Level from "./level";
import cdnize from "@utils/cdnize";
import Typography from "@components/UI/typography/typography";
import { TEXT_TYPE } from "@constants/typography";

type AchievementProps = {
  achievements: AchievementsDocument;
  index: number;
};

const Achievement: FunctionComponent<AchievementProps> = ({
  achievements,
  index,
}) => {
  const backgroundStyle = useMemo(() => {
    return {
      backgroundImage: `url('/${cdnize(achievements.category_img_url)}')`,
      backgroundPosition: `${index % 2 === 0 ? "right center" : "left center"}`,
      backgroundSize: "30%",
    };
  }, [index]);
  return (
    <div className={styles.card}>
      <div className={styles.background} style={backgroundStyle} />
      <div className={styles.backgroundFilter} />
      <div className={styles.cardContainer}>
        <div>
          <Typography type={TEXT_TYPE.H2} className={styles.cardTitle}>{achievements.category_name}</Typography>
          <p className={styles.cardSubtitle}>/{achievements.category_desc}</p>
        </div>
        <div className={styles.levels}>
          {achievements.achievements.map((achievement: AchievementDocument) => {
            return <Level key={achievement.id} achievement={achievement} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Achievement;
