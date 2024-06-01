import React, { FunctionComponent } from "react";
import styles from "@styles/quests.module.css";
import QuestCard from "./questCard";
import RewardIcon from "@components/UI/iconsComponents/icons/reward";
import Typography from "@components/UI/typography/typography";
import { TEXT_TYPE } from "@constants/typography";

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
        <Typography type={TEXT_TYPE.BODY_DEFAULT} className="text-gray-400">{name}</Typography>
      </div>
      <div className="flex gap-2 mt-3 justify-center md:justify-start">
        <div className={styles.claimer}>
          <Typography type={TEXT_TYPE.BODY_SMALL} color="white" className={`mr-2 ${styles.claimerText}`}>Claim reward</Typography>
          <RewardIcon width="24" />
        </div>
      </div>
    </QuestCard>
  );
};

export default QuestClaim;
