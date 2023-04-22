import React, { FunctionComponent } from "react";
import styles from "../../styles/quests.module.css";

type QuestProps = {
  onClick: () => void;
  imgSrc: string;
  title: string;
  issuer: string;
  xp: number;
};

const Quest: FunctionComponent<QuestProps> = ({
  onClick,
  imgSrc,
  title,
  issuer,
  xp,
}) => {
  return (
    <div className={styles.questCard} onClick={onClick}>
      <img src={imgSrc} className={styles.questImage} />
      <div className={styles.questInfos}>
        <h3 className={styles.questTitle}>{title}</h3>
        <p className="text-gray-400">{issuer}</p>
        <div className="flex mt-2 mb-1 items-center">
          <img width={30} src="https://layer3.xyz/images/xp.png" />
          <p className="text-white ml-2">{xp}</p>
        </div>
      </div>
    </div>
  );
};

export default Quest;
