import styles from "../../styles/components/loading.module.css";
import React from "react";

const Loading = () => {
  return (
    <div className={styles.spinner}>
      <div className={styles.bar1} />
      <div className={styles.bar2} />
      <div className={styles.bar3} />
      <div className={styles.bar4} />
      <div className={styles.bar5} />
      <div className={styles.bar6} />
      <div className={styles.bar7} />
      <div className={styles.bar8} />
      <div className={styles.bar9} />
      <div className={styles.bar10} />
      <div className={styles.bar11} />
      <div className={styles.bar12} />
    </div>
  );
};

export default Loading;
