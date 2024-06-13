import React, { FunctionComponent, useMemo } from "react";
import { useContext } from "react";
import { QuestsContext } from "@context/QuestsProvider";
import CheckIcon from "@components/UI/iconsComponents/icons/checkIcon";
import UnavailableIcon from "@components/UI/iconsComponents/icons/unavailableIcon";
import styles from "@styles/quests.module.css";
import { CDNImg } from "@components/cdn/image";
import {
  CheckCircle as CheckCircleIcon,
  ErrorRounded as ErrorRoundedIcon,
} from "@mui/icons-material";
import QuestCard from "@components/quests/questCard";

type QuestProps = {
  onClick: () => void;
  imgSrc: string;
  title: string;
  reward: string;
  id: number;
};

const Quest: FunctionComponent<QuestProps> = ({
  onClick,
  imgSrc,
  title,
  id,
  reward,
}) => {
  return (
    <QuestCard id={id} imgSrc={imgSrc} title={title} onClick={() => onClick()}>
      <div className="flex gap-2 mt-3 justify-center md:justify-start">
        <div className={styles.issuer}>
          {reward === "Disabled" ? (
            <UnavailableIcon width="24" color="#D32F2F" />
          ) : (
            <CheckCircleIcon className="ml-2" width={25} color="primary" />
          )}

          <p className="text-white ml-2">{reward}</p>
        </div>
      </div>
    </QuestCard>
  );
};

export default Quest;
