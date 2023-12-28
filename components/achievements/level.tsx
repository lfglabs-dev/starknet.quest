import React, { FunctionComponent } from "react";
import styles from "@styles/achievements.module.css";
import { AchievementDocument } from "../../types/backTypes";
import { CustomTooltip } from "@components/UI/tooltip";
import { CDNImg } from "@components/cdn/image";
import Button from "@components/UI/button";
import { updateAchievementClaimStatus } from "@services/apiService";
import { useAccount } from "@starknet-react/core";
import { useRouter } from "next/navigation";

type AchievementLevelProps = {
  achievement: AchievementDocument;
};

const AchievementLevel: FunctionComponent<AchievementLevelProps> = ({
  achievement,
}) => {
  const router = useRouter();
  const { address } = useAccount();
  const updateClaimStatus = async () => {
    if (!address) return;
    await updateAchievementClaimStatus(address, achievement.id);
    router.push(`/achievements/claim/${achievement.id}`);
  };
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
        {achievement.claimed ? (
          <Button onClick={updateClaimStatus}>Claim Rewards</Button>
        ) : (
          <>
            <div className={styles.levelInfo}>
              <p className={styles.levelDesc}>{achievement.short_desc}</p>
              <h3 className={styles.levelTitle}>{achievement.name}</h3>
            </div>
            <div
              className={`${styles.levelImg} ${
                !achievement.completed ? styles.disabled : ""
              }`}
            >
              <CDNImg src={achievement.img_url} alt="achievement level image" />
            </div>
          </>
        )}
      </div>
    </CustomTooltip>
  );
};

export default AchievementLevel;
