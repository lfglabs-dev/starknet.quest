import React, { FunctionComponent } from "react";
import { Skeleton } from "@mui/material";
import styles from "@styles/leaderboard.module.css";

const LeaderboardSkeleton: FunctionComponent = () => {
  return (
    <>
      <div className={styles.leaderboardSkeleton}>
        <Skeleton
          variant="rounded"
          className={styles.leaderboardLoading}
          height={'90vh'}
          sx={{
            bgcolor: "grey.900",
            borderRadius: "30px",
            margin: "40px auto",
          }}
        />
      </div>
    </>
  );
};

export default LeaderboardSkeleton;
