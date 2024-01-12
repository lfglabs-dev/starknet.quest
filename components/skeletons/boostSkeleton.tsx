import React, { FunctionComponent } from "react";
import { Skeleton } from "@mui/material";
import styles from "@styles/questboost.module.css";

const BoostSkeleton: FunctionComponent = () => {
  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex justify-center items-center mt-2">
          <div className={styles.skeleton_title}>
            <Skeleton
              variant="rounded"
              className={styles.skeleton_loading}
              height={100}
              sx={{
                bgcolor: "grey.900",
                borderRadius: "30px",
                margin: "10px auto 0",
              }}
            />
          </div>
        </div>
        <div className="flex w-full justify-center items-center">
          <div className={styles.skeleton_card}>
            <Skeleton
              variant="rounded"
              className={styles.skeleton_loading}
              height={425}
              sx={{
                bgcolor: "grey.900",
                borderRadius: "30px",
                margin: "10px auto 0",
              }}
            />
          </div>
        </div>
        <div className="flex justify-center items-center mt-2">
          <div className={styles.skeleton_reward}>
            <Skeleton
              variant="rounded"
              className={styles.skeleton_loading}
              height={100}
              sx={{
                bgcolor: "grey.900",
                borderRadius: "30px",
                margin: "10px auto 0",
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default BoostSkeleton;
