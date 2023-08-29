import React, { FunctionComponent } from "react";
import styles from "../../styles/achievements.module.css";
import {
  AchievementDocument,
  AchievementsDocument,
} from "../../types/backTypes";
import Level from "./level";

type AchievementProps = {
  achievements: AchievementsDocument;
  index: number;
};

const Achievement: FunctionComponent<AchievementProps> = ({
  achievements,
  index,
}) => {
  return (
    <div className={styles.card}>
      <div
        className={styles.background}
        style={{
          backgroundImage: `url('/${achievements.category_img_url}')`,
          backgroundPosition: `${
            index % 2 === 0 ? "right center" : "left center"
          }`,
          backgroundSize: "30%",
        }}
      />
      <div className={styles.backgroundFilter} />
      <div className={styles.cardContainer}>
        <div>
          <h2 className={styles.cardTitle}>{achievements.category_name}</h2>
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
