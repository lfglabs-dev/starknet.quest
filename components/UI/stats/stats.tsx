import React, { FunctionComponent } from "react";
import styles from "@styles/components/stats.module.css";
import StatElement from "./statElement";
import Typography from "../typography/typography";
import { TEXT_TYPE } from "@constants/typography";

type StatsProps = {
  title?: string;
  stats: {
    name: string;
    value: string;
  }[];
};

const Stats: FunctionComponent<StatsProps> = ({ title, stats }) => {
  return (
    <div className={styles.container}>
      {title && <Typography type={TEXT_TYPE.H2} color="secondary" className={styles.title}>{title}</Typography>}
      <div className={styles.elementsContainer}>
        {stats.map((elt, index) => (
          <StatElement
            key={`stats_${index}`}
            name={elt.name}
            value={elt.value}
          />
        ))}
      </div>
    </div>
  );
};

export default Stats;
