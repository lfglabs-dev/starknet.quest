import React, { FunctionComponent } from "react";
import { Skeleton, useMediaQuery } from "@mui/material";

const AchievementSkeleton: FunctionComponent = () => {
  const isMobile = useMediaQuery("(max-width:768px)");
  return (
    <>
      <Skeleton
        variant="rounded"
        width={1000}
        height={isMobile ? 400 : 245}
        sx={{
          bgcolor: "grey.900",
          marginBottom: "40px",
          borderRadius: "30px",
          maxWidth: `${isMobile ? "100%" : "min(1500px, calc(100% - 32px))"}`,
          margin: "0 auto 40px",
        }}
      />
      <Skeleton
        variant="rounded"
        width={1000}
        height={isMobile ? 400 : 245}
        sx={{
          bgcolor: "grey.900",
          borderRadius: "30px",
          maxWidth: `${isMobile ? "100%" : "min(1500px, calc(100% - 32px))"}`,
          margin: "0 auto",
        }}
      />
    </>
  );
};

export default AchievementSkeleton;
