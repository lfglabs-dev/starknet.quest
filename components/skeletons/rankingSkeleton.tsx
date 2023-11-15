import React, { FunctionComponent } from "react";
import { Skeleton } from "@mui/material";
import styles from "../../styles/leaderboard.module.css";

const RankingSkeleton: FunctionComponent = () => {
  return (
    <>
      <div className={styles.leaderboardSkeleton}>
        <Skeleton
          variant="rounded"
          className={styles.leaderboardLoading}
          height={"120vh"}
          sx={{
            bgcolor: "grey.900",
            borderRadius: "30px",
          }}
        />
      </div>
    </>
  );
};

export default RankingSkeleton;
