import React, { FunctionComponent } from "react";
import { Skeleton } from "@mui/material";
import AccentBox from "@components/UI/AccentBox";

const AnalyticsSkeleton: FunctionComponent = () => {
  return (
    <AccentBox>
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
    </AccentBox>
  );
};

export default AnalyticsSkeleton;
