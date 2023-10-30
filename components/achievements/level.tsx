import React, { FunctionComponent } from "react";
import styles from "../../styles/achievements.module.css";
import { AchievementDocument } from "../../types/backTypes";
import { CustomTooltip } from "../UI/tooltip";

type AchievementLevelProps = {
  achievement: AchievementDocument;
};

const AchievementLevel: FunctionComponent<AchievementLevelProps> = ({
  achievement,
}) => {
  return (
    <CustomTooltip
      title={
        <>
          <div>
            <div className={styles.tooltipTitle}>{achievement.title}</div>
            <div className={styles.tooltipSub}>{achievement.desc}</div>
          </div>
        </>
      }
      placement="bottom-end"
    >
      <div
        className={`${styles.levelContainer} ${
          achievement.completed && styles.completed
        }`}
      >
        <div className={styles.levelInfo}>
          <p className={styles.levelDesc}>{achievement.short_desc}</p>
          <h3 className={styles.levelTitle}>{achievement.name}</h3>
        </div>
        <div
          className={`${styles.levelImg} ${
            !achievement.completed ? styles.disabled : ""
          }`}
        >
          <img src={achievement.img_url} alt="achievement level image" />
        </div>
      </div>
    </CustomTooltip>
  );
};

export default AchievementLevel;
