import styles from "../../../styles/components/stats.module.css";
import StatElement from "./statElement";

const Stats = ({
  title,
  stats,
}: {
  title: string;
  stats: {
    name: string;
    value: string;
  }[];
}) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
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
