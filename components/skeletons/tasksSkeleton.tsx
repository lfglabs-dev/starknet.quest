import { Skeleton } from "@mui/material";
import React, { FunctionComponent } from "react";

const TasksSkeleton: FunctionComponent = () => {
  return (
    <>
      <Skeleton
        variant="rectangular"
        height={68}
        sx={{ bgcolor: "grey.900", maxWidth: "768px", width: "90%" }}
      />
      <Skeleton
        variant="rectangular"
        height={68}
        sx={{ bgcolor: "grey.900", maxWidth: "768px", width: "90%" }}
      />
      <Skeleton
        variant="rectangular"
        height={68}
        sx={{ bgcolor: "grey.900", maxWidth: "768px", width: "90%" }}
      />
      <Skeleton
        variant="rectangular"
        height={68}
        sx={{ bgcolor: "grey.900", maxWidth: "768px", width: "90%" }}
      />
      <Skeleton
        variant="rectangular"
        height={104}
        sx={{
          bgcolor: "grey.900",
          marginTop: "1.5rem",
          maxWidth: "768px",
          width: "90%",
        }}
      />
    </>
  );
};

export default TasksSkeleton;
