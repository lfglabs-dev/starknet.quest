import React, { FunctionComponent } from "react";
import { Skeleton } from "@mui/material";
import styles from "../../styles/achievements.module.css";

const AchievementSkeleton: FunctionComponent = () => {
  return (
    <>
      <Skeleton
        variant="rounded"
        width={650}
        height={245}
        sx={{
          bgcolor: "grey.900",
          marginBottom: "40px",
          borderRadius: "30px",
        }}
      />
      <Skeleton
        variant="rounded"
        width={650}
        height={245}
        sx={{
          bgcolor: "grey.900",
          borderRadius: "30px",
        }}
      />
    </>
  );
};

export default AchievementSkeleton;
