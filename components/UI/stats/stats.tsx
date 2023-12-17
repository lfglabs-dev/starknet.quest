import React, { FunctionComponent } from "react";
import styles from "@styles/components/stats.module.css";
import StatElement from "./statElement";

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
      {title && <h2 className={styles.title}>{title}</h2>}
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
