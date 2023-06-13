import React, { FunctionComponent } from "react";
import { Skeleton } from "@mui/material";

const FeaturedQuestSkeleton: FunctionComponent = () => {
  return (
    <Skeleton
      variant="rectangular"
      width={950}
      height={350}
      sx={{ bgcolor: "grey.900", marginTop: "1rem", marginBottom: "5rem" }}
    />
  );
};

export default FeaturedQuestSkeleton;
