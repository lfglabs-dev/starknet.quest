import React, { FunctionComponent } from "react";
import styles from "@styles/quests.module.css";
import QuestCard from "./questCard";
import RewardIcon from "@components/UI/iconsComponents/icons/reward";

type QuestProps = {
  onClick: () => void;
  imgSrc: string;
  title: string;
  reward: string;
  name: string;
  id: number;
  expired: boolean;
};

const QuestClaim: FunctionComponent<QuestProps> = ({
  onClick,
  imgSrc,
  title,
  name,
  id,
  expired,
}) => {

  return (
    <QuestCard
      id={id}
      imgSrc={imgSrc}
      title={title}
      onClick={() => onClick()}
    >
      <div
        className={`flex mt-2 mb-1 items-center ${
          expired ? "opacity-40" : null
        }`}
      >
        <p className="text-gray-400">{name}</p>
      </div>
      <div className="flex gap-2 mt-3 justify-center md:justify-start">
        <div className={styles.claimer}>
          <p className="text-white mr-2">Claim reward</p>
          <RewardIcon width="24" />
        </div>
      </div>
    </QuestCard>
  );
};

export default QuestClaim;
