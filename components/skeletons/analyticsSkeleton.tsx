import React, { FunctionComponent } from "react";
import { Skeleton } from "@mui/material";

const AnalyticsSkeleton: FunctionComponent = () => {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <Skeleton
          variant="rounded"
          height={200}
          sx={{
            bgcolor: "grey.900",
            borderRadius: "30px",
            margin: "10px auto 0",
          }}
        />
      </div>
      <div>
        <Skeleton
          variant="rounded"
          height={400}
          sx={{
            bgcolor: "grey.900",
            borderRadius: "30px",
            margin: "10px auto 0",
          }}
        />
      </div>
      <div>
        <Skeleton
          variant="rounded"
          height={400}
          sx={{
            bgcolor: "grey.900",
            borderRadius: "30px",
            margin: "10px auto 0",
          }}
        />
      </div>
    </div>
  );
};

export default AnalyticsSkeleton;
