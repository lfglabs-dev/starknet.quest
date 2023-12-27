import React, { FunctionComponent } from "react";
import { Skeleton } from "@mui/material";
import styles from "@styles/Home.module.css";

const FeaturedQuestSkeleton: FunctionComponent = () => {
  return (
    <div className={styles.questContainer}>
      <Skeleton
        variant="rectangular"
        width={250}
        height={350}
        sx={{ bgcolor: "grey.900", borderRadius: "8px" }}
      />
      <Skeleton
        variant="rectangular"
        width={250}
        height={350}
        sx={{ bgcolor: "grey.900", borderRadius: "8px" }}
      />
      <Skeleton
        variant="rectangular"
        width={250}
        height={350}
        sx={{ bgcolor: "grey.900", borderRadius: "8px" }}
      />
    </div>
  );
};

export default FeaturedQuestSkeleton;
