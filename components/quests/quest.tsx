import React, { FunctionComponent, useMemo } from "react";
import { useContext } from "react";
import { QuestsContext } from "../../context/QuestsProvider";
import CheckIcon from "../UI/iconsComponents/icons/checkIcon";
import UnavailableIcon from "../UI/iconsComponents/icons/unavailableIcon";
import Card from "../UI/card";
import styles from "../../styles/quests.module.css";

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
    <Card
      imgSrc={imgSrc}
      title={title}
      onClick={() => !expired && onClick()}
      disabled={expired}
    >
      <div
        className={`flex mt-2 mb-1 items-center ${
          expired ? "opacity-40" : null
        }`}
      >
        <p className="text-gray-400">{issuer.name}</p>
      </div>
      <div className={styles.issuer}>
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
    </Card>
  );
};

export default Quest;
