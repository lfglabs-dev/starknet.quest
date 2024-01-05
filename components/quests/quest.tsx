import React, { FunctionComponent, useMemo } from "react";
import { useContext } from "react";
import { QuestsContext } from "@context/QuestsProvider";
import CheckIcon from "@components/UI/iconsComponents/icons/checkIcon";
import UnavailableIcon from "@components/UI/iconsComponents/icons/unavailableIcon";
import styles from "@styles/quests.module.css";
import { CDNImg } from "@components/cdn/image";
import QuestCard from "./questCard";

const BOOSTED_QUESTS = [23, 104];

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
      <div className="flex gap-2">
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
              <CDNImg width={20} src={issuer.logoFavicon} />
              <p className="text-white ml-2">{reward}</p>
            </>
          )}
        </div>
        {BOOSTED_QUESTS.includes(id) ? (
          <div
            className={styles.issuer}
            style={{ gap: 0, padding: "8px 16px" }}
          >
            <CDNImg
              src={"/icons/usdc.svg"}
              width={20}
              height={20}
              alt="usdc icon"
            />
            <p className="text-white ml-2">{1500}</p>
          </div>
        ) : null}
      </div>
    </QuestCard>
  );
};

export default Quest;
