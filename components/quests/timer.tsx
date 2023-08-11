import React, { FunctionComponent, useEffect, useState } from "react";
import styles from "../../styles/components/timer.module.css";

type TimerProps = {
  expiry: number;
  fixed?: boolean;
};

const Timer: FunctionComponent<TimerProps> = ({ expiry, fixed = true }) => {
  const [timeLeft, setTimeLeft] = useState(expiry - Date.now());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeLeft(expiry - Date.now());
    }, 1000);

    return () => clearInterval(intervalId);
  }, [expiry]);

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  return (
    <div className={`${fixed ? `${styles.timerFixed}` : `${styles.timer}`}`}>
      <div className={styles.title}>Expires in</div>
      <div className={styles.categories}>
        <div>days</div>
        <div>hours</div>
        <div>minutes</div>
        <div>seconds</div>
      </div>
      <div className={styles.dates}>
        <div>
          <span className={styles.day}>{days}</span>:
        </div>
        <div>
          <span className={styles.hour}>{hours}</span>:
        </div>
        <div>
          <span className={styles.minute}>{minutes}</span>:
        </div>
        <div className={styles.second}>{seconds}</div>
      </div>
    </div>
  );
};

export default Timer;
