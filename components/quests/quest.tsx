import React, { FunctionComponent, useMemo } from "react";
import { useContext } from "react";
import { QuestsContext } from "@context/QuestsProvider";
import CheckIcon from "@components/UI/iconsComponents/icons/checkIcon";
import UnavailableIcon from "@components/UI/iconsComponents/icons/unavailableIcon";
import styles from "@styles/quests.module.css";
import { CDNImg } from "@components/cdn/image";
import QuestCard from "./questCard";
import BoostReward from "./boostReward";
import Typography from "@components/UI/typography/typography";
import { TEXT_TYPE } from "@constants/typography";

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
        <Typography type={TEXT_TYPE.BODY_DEFAULT} className="text-gray-400">{issuer.name}</Typography>
      </div>
      <div className="flex gap-2 mt-3 justify-center md:justify-start">
        <div className={styles.issuer}>
          {isCompleted ? (
            <>
              <Typography type={TEXT_TYPE.BODY_DEFAULT} className={`${styles.issuerText} mr-2`}>Done</Typography>
              <CheckIcon width="24" color="#6AFFAF" />
            </>
          ) : expired ? (
            <>
              <Typography type={TEXT_TYPE.BODY_DEFAULT} className={`${styles.issuerText} mr-2`}>Expired</Typography>
              <UnavailableIcon width="24" color="#D32F2F" />
            </>
          ) : (
            <>
              <CDNImg width={20} src={issuer.logoFavicon} loading="lazy" />
              <Typography type={TEXT_TYPE.BODY_DEFAULT} className={`${styles.issuerText} ml-2`}>{reward}</Typography>
            </>
          )}
        </div>
        <BoostReward questId={id} />
      </div>
    </QuestCard>
  );
};

export default Quest;
