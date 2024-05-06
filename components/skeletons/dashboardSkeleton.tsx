import React, { FunctionComponent } from "react";
import { Skeleton } from "@mui/material";
import styles from "@styles/dashboard.module.css";

const DashboardSkeleton: FunctionComponent = () => {
  return (
    <>
      <div className={styles.dashboardSkeleton}>
        <Skeleton
          variant="rounded"
          className={styles.dashboardLoading}
          height={'90vh'}
          sx={{
            bgcolor: "grey.900",
            borderRadius: "30px",
            margin: "40px auto",
          }}
        />
      </div>

    </>
  );
};

export default DashboardSkeleton;
