import React, { FunctionComponent } from "react";
import styles from "@styles/achievements.module.css";
import { AchievementDocument } from "../../types/backTypes";
import { CustomTooltip } from "@components/UI/tooltip";
import { CDNImg } from "@components/cdn/image";
import CheckIcon from "@components/UI/iconsComponents/icons/checkIcon";
import Typography from "@components/UI/typography/typography";
import type { TEXT_TYPE } from "@constants/typography";

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
          <Typography type={TEXT_TYPE.H3} className={styles.levelTitle}>{achievement.name}</Typography>
        </div>
        <div
          className={`${styles.levelImg} ${
            !achievement.completed ? styles.disabled : ""
          }`}
        >
          <CDNImg src={achievement.img_url} alt="achievement level image" />
        </div>
        {achievement.completed && (
          <div className={styles.checkIcon}>
            <CheckIcon width="24" color="#6AFFAF" />
          </div>
        )}
      </div>
    </CustomTooltip>
  );
};

export default AchievementLevel;
