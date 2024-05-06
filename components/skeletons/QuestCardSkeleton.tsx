import React, { FunctionComponent } from "react";
import { Skeleton } from "@mui/material";

const QuestCardSkeleton: FunctionComponent = () => {
  return (
    <Skeleton
      variant="rectangular"
      width={290}
      height={390}
      sx={{ bgcolor: "grey.900", borderRadius: "8px" }}
    />
  );
};

export default QuestCardSkeleton;
