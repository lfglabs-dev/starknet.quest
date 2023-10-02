import React, { FunctionComponent } from "react";
import { Skeleton } from "@mui/material";
import styles from "../../styles/achievements.module.css";

const AchievementSkeleton: FunctionComponent = () => {
  return (
    <>
      <div className={styles.achievementSkeleton}>
        <Skeleton
          variant="rounded"
          className={styles.achievementLoading}
          sx={{
            bgcolor: "grey.900",
            borderRadius: "30px",
            margin: "40px auto 0",
          }}
        />
      </div>
      <div className={styles.achievementSkeleton}>
        <Skeleton
          variant="rounded"
          className={styles.achievementLoading}
          sx={{
            bgcolor: "grey.900",
            borderRadius: "30px",
            margin: "10px auto 0",
          }}
        />
      </div>
    </>
  );
};

export default AchievementSkeleton;
