import React, { FunctionComponent } from "react";
import { Skeleton } from "@mui/material";
import styles from "@styles/dashboard.module.css";

const QuestsCompletedTitleSkeleton: FunctionComponent = () => {
  return (
    <>
      <div className={styles.questsCompletedTitleSkeleton}>
        <Skeleton
          variant="rounded"
          className={styles.questsCompletedTitleLoading}
          height="5vh"
          sx={{
            bgcolor: "grey.900",
            borderRadius: "30px",
            margin: "40px",
          }}
        />
      </div>
    </>
  );
};

export default QuestsCompletedTitleSkeleton;
