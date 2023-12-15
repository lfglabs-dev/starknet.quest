import styles from "@styles/components/quests/quizLoading.module.css";
import React from "react";

const QuizLoading = () => {
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

export default QuizLoading;
