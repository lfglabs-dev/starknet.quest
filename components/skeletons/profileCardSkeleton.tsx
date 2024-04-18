import React, { FunctionComponent } from "react";
import { Skeleton } from "@mui/material";
import styles from "@styles/dashboard.module.css";

const ProfileCardSkeleton: FunctionComponent = () => {
  return (
    <>
      <div className={styles.profileCardSkeleton}>
        <Skeleton
          variant="rounded"
          className={styles.profileCardLoading}
          height={'27vh'}
          sx={{
            bgcolor: "grey.900",
            borderRadius: "30px",
            margin: "20px auto",
            padding: "40px"
          }}
        />

      </div>
    </>
  );
};

export default ProfileCardSkeleton;
