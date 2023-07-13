import styles from "../../../styles/components/stats.module.css";
import Box from "../box";

const StatElement = ({ name, value }: { name: string; value: string }) => {
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
