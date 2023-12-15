import React, { FunctionComponent } from "react";
import styles from "@styles/components/stats.module.css";
import Box from "../box";

type StatElementProps = {
  name: string;
  value: string;
};

const StatElement: FunctionComponent<StatElementProps> = ({ name, value }) => {
  return (
    <div className={styles.statElement}>
      <Box>
        <p className={styles.statValue}>{value}</p>
        <p className={styles.statName}>{name}</p>
      </Box>
    </div>
  );
};

export default StatElement;
