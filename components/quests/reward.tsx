import React, { FunctionComponent } from "react";
import styles from "../../styles/quests.module.css";
import Button from "../UI/button";

const Reward: FunctionComponent<Reward> = ({ onClick, reward, imgSrc }) => {
  return (
    <div className={styles.reward}>
      <div className="flex">
        <p className="mr-1">Reward: </p>
        <img width={25} src={imgSrc} />
        <p className="ml-1">{reward}</p>
      </div>
      <div className="max-w-lg">
        <Button onClick={onClick}>Get Reward</Button>
      </div>
    </div>
  );
};

export default Reward;
