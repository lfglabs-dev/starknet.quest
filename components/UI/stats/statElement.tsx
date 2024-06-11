import React, { FunctionComponent } from "react";
import styles from "@styles/components/stats.module.css";
import Box from "../box";
import Typography from "../typography/typography";
import { TEXT_TYPE } from "@constants/typography";
import AccentBox from "@components/UI/AccentBox";

type StatElementProps = {
  name: string;
  value: string;
};

const StatElement: FunctionComponent<StatElementProps> = ({ name, value }) => {
  return (
    <div className="flex flex-1 w-full px-4 sm:px-2">
      <AccentBox>
      <Box>
        <Typography type={TEXT_TYPE.BODY_NORMAL} color="transparent" className={styles.statValue}>{value}</Typography>
        <Typography type={TEXT_TYPE.BODY_DEFAULT} color="secondary" className={styles.statName}>{name}</Typography>
      </Box>
      </AccentBox>
    </div>
    
  );
};

export default StatElement;
