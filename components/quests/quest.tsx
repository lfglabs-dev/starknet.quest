import React, { FunctionComponent, useMemo } from "react";
import styles from "../../styles/quests.module.css";
import { useContext } from "react";
import { QuestsContext } from "../../context/QuestsProvider";
import CheckIcon from "../UI/iconsComponents/icons/checkIcon";

type QuestProps = {
  onClick: () => void;
  imgSrc: string;
  title: string;
  issuer: Issuer;
  reward: string;
  id: number;
};

const Quest: FunctionComponent<QuestProps> = ({
  onClick,
  imgSrc,
  title,
  issuer,
  reward,
  id,
}) => {
  const { completedQuestIds } = useContext(QuestsContext);
  const isCompleted = useMemo(
    () => completedQuestIds.includes(id),
    [id, completedQuestIds]
  );

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
            {isCompleted ? (
              <>
                <p className="text-white mr-2">Done</p>
                <CheckIcon width="24" color="#6AFFAF" />
              </>
            ) : (
              <>
                <img width={20} src={issuer.logoFavicon} />
                <p className="text-white ml-2">{reward}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Quest;
