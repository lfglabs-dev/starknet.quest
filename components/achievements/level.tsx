import React, { FunctionComponent } from "react";
import styles from "../../styles/achievements.module.css";
import { AchievementDocument } from "../../types/backTypes";
import { Tooltip, TooltipProps, styled, tooltipClasses } from "@mui/material";

type AchievementLevelProps = {
  achievement: AchievementDocument;
};

const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#191527",
    borderRadius: "12px",
    color: "#E1DCEA",
    maxWidth: 206,
    padding: 12,
  },
}));

const AchievementLevel: FunctionComponent<AchievementLevelProps> = ({
  achievement,
}) => {
  return (
    <CustomTooltip
      title={
        <React.Fragment>
          <div>
            <div className={styles.tooltipTitle}>{achievement.title}</div>
            <div className={styles.tooltipSub}>{achievement.desc}</div>
          </div>
        </React.Fragment>
      }
      placement="bottom-end"
    >
      <div className={styles.levelContainer}>
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
