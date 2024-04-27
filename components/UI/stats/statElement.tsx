import React, { FunctionComponent } from "react";
import styles from "@styles/components/stats.module.css";
import Box from "../box";

type StatElementProps = {
  name: string;
  value: string;
};

const StatElement: FunctionComponent<StatElementProps> = ({ name, value }) => {
  return (
    <div className="flex flex-1 w-full px-4 sm:px-2">
      <Box>
        <p className={styles.statValue}>{value}</p>
        <p className={styles.statName}>{name}</p>
      </Box>
    </div>
  );
};

export default StatElement;
