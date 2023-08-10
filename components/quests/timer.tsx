import React, { FunctionComponent, useEffect, useState } from "react";
import style from "../../styles/components/timer.module.css";

type RewardProps = {
  expiry: number;
  fixed?: boolean;
};

const Timer: FunctionComponent<RewardProps> = ({ expiry, fixed = true }) => {
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
    <div className={`${fixed ? `${style.timerFixed}` : `${style.timer}`}`}>
      <div className={style.title}>Expire in</div>
      <div className={style.categories}>
        <div>days</div>
        <div>hours</div>
        <div>minutes</div>
        <div>seconds</div>
      </div>
      <div className={style.dates}>
        <div>
          <span className={style.day}>{days}</span>:
        </div>
        <div>
          <span className={style.hour}>{hours}</span>:
        </div>
        <div>
          <span className={style.minute}>{minutes}</span>:
        </div>
        <div className={style.second}>{seconds}</div>
      </div>
    </div>
  );
};

export default Timer;
