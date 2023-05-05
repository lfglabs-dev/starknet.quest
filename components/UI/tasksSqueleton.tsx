import { Skeleton } from "@mui/material";
import React, { FunctionComponent } from "react";

const TasksSkeleton: FunctionComponent = () => {
  return (
    <>
      <Skeleton
        variant="rectangular"
        width={728}
        height={68}
        sx={{ bgcolor: "grey.900" }}
      />
      <Skeleton
        variant="rectangular"
        width={728}
        height={68}
        sx={{ bgcolor: "grey.900" }}
      />
      <Skeleton
        variant="rectangular"
        width={728}
        height={68}
        sx={{ bgcolor: "grey.900" }}
      />
      <Skeleton
        variant="rectangular"
        width={728}
        height={68}
        sx={{ bgcolor: "grey.900" }}
      />
      <Skeleton
        variant="rectangular"
        width={728}
        height={104}
        sx={{ bgcolor: "grey.900", marginTop: "1.5rem" }}
      />
    </>
  );
};

export default TasksSkeleton;
