import { Skeleton } from "@mui/material";
import React, { FunctionComponent } from "react";

const RewardSkeleton: FunctionComponent = () => {
  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <div style={{ gap: "10px", marginBottom: "1.5rem" }}>
          <Skeleton
            variant="rounded"
            width={110}
            height={36}
            sx={{ bgcolor: "grey.900", borderRadius: "100px" }}
          />
        </div>
        <div className="flex gap-5 flex-wrap justify-center items-center">
          
          <div className="flex justify-center items-center flex-col">
            <Skeleton
              variant="rectangular"
              width={200}
              height={200}
              sx={{ bgcolor: "grey.900", borderRadius: "30px" }}
            />
            <Skeleton
              variant="rounded"
              width={110}
              height={36}
              sx={{
                bgcolor: "grey.900",
                borderRadius: "100px",
                marginTop: "1rem",
              }}
            />
          </div>
          
        </div>
      </div>
    </>
  );
};

export default RewardSkeleton;
