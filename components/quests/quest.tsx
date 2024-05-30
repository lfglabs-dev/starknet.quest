import React, { FunctionComponent, useMemo } from "react";
import { useContext } from "react";
import { QuestsContext } from "@context/QuestsProvider";
import CheckIcon from "@components/UI/iconsComponents/icons/checkIcon";
import UnavailableIcon from "@components/UI/iconsComponents/icons/unavailableIcon";
import styles from "@styles/quests.module.css";
import { CDNImg } from "@components/cdn/image";
import QuestCard from "./questCard";
import BoostReward from "./boostReward";
import QuestTag from "@components/UI/questTag";

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
    <QuestCard
      id={id}
      imgSrc={imgSrc}
      title={title}
      issuer={issuer}
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
      <div className="grid grid-cols-2 gap-2 mt-3 md:grid-cols-2 lg:grid-cols-2 justify-center md:justify-start">

          {isCompleted ? (
            <>  
              <QuestTag label={"Done"} icon={<CheckIcon width="24" color="#6AFFAF" backgroundColor="#29282B" />} backgroundColor="#29282B" />
            </>
          ) : expired ? (
            <>
              <QuestTag label={"Expired"} icon={<UnavailableIcon width="24" color="#D32F2F" backgroundColor="#29282B" />} backgroundColor="#29282B" />
            </>
          ) : (
            <>
              <QuestTag label={reward} icon={issuer.logoFavicon} />
            </>
          )}

        <BoostReward questId={id} />
      </div>
    </QuestCard>
  );
};

export default Quest;
