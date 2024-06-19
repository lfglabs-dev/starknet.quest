import React, { FunctionComponent, useCallback } from "react";
import UnavailableIcon from "@components/UI/iconsComponents/icons/unavailableIcon";
import styles from "@styles/quests.module.css";
import { CheckCircle as CheckCircleIcon } from "@mui/icons-material";
import QuestCard from "@components/quests/questCard";
import { CDNImage } from "@components/cdn/image";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const handleAnalyticsNavigate = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      event.stopPropagation();
      router.push(`/analytics/${id}`);
    },
    [router, id]
  );
  return (
    <QuestCard id={id} imgSrc={imgSrc} title={title} onClick={() => onClick()}>
      <div className="flex w-full gap-2 mt-3 justify-between md:justify-between items-center">
        <div className={styles.issuer}>
          {reward === "Disabled" ? (
            <UnavailableIcon width="24" color="#D32F2F" />
          ) : (
            <CheckCircleIcon className="ml-2" width={25} color="primary" />
          )}
          <p className="text-white ml-2">{reward}</p>
        </div>
        <div onClick={handleAnalyticsNavigate}>
          <CDNImage
            src={"/icons/stats.svg"}
            alt="stats icon"
            width={20}
            height={20}
          />
        </div>
      </div>
    </QuestCard>
  );
};

export default Quest;
