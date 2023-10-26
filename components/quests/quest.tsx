import React, { FunctionComponent, useMemo } from "react";
import styles from "../../styles/quests.module.css";
import { useContext } from "react";
import { QuestsContext } from "../../context/QuestsProvider";
import CheckIcon from "../UI/iconsComponents/icons/checkIcon";
import UnavailableIcon from "../UI/iconsComponents/icons/unavailableIcon";

type QuestProps = {
  onClick: () => void;
  imgSrc: string;
  title: string;
  issuer: Issuer;
  reward: string;
  id: number;
  expired: boolean;
};

const Quest: FunctionComponent<QuestProps> = ({
  onClick,
  imgSrc,
  title,
  issuer,
  reward,
  id,
  expired,
}) => {
  const { completedQuestIds } = useContext(QuestsContext);
  const isCompleted = useMemo(
    () => completedQuestIds.includes(id),
    [id, completedQuestIds]
  );

  return (
    <>
      <div
        className={styles.questCard}
        onClick={() => !expired && onClick()}
        aria-disabled={expired}
      >
        <img src={imgSrc} className={styles.questImage} />
        <div className={styles.questInfos}>
          <h3 className={styles.questTitle}>{title}</h3>
          <div className={styles.issuer}>
            <p className="text-gray-400">{issuer.name}</p>
          </div>
          <div className="flex mt-2 mb-1 items-center">
            {isCompleted ? (
              <>
                <p className="text-white mr-2">Done</p>
                <CheckIcon width="24" color="#6AFFAF" />
              </>
            ) : expired ? (
              <>
                <p className="text-white mr-2">Expired</p>
                <UnavailableIcon width="24" color="#D32F2F" />
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
