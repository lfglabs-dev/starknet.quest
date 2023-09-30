import React, { FunctionComponent } from "react";
import styles from "../../styles/quests.module.css";

type QuestProps = {
  onClick: () => void;
  imgSrc: string;
  title: string;
  issuer: Issuer;
  reward: string;
};

const Quest: FunctionComponent<QuestProps> = ({
  onClick,
  imgSrc,
  title,
  issuer,
  reward,
}) => {
  return (
    <>
      <div className={styles.questCard} onClick={onClick}>
        <img src={imgSrc} className={styles.questImage} />
        <div className={styles.questInfos}>
          <h3 className={styles.questTitle}>{title}</h3>
          <div className="flex mt-2 mb-1 items-center">
            <p className="text-gray-400">{issuer.name}</p>
          </div>
          <div className="flex mt-2 mb-1 items-center">
            <img width={20} src={issuer.logoFavicon} />
            <p className="text-white ml-2">{reward}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Quest;
