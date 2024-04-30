import React, { FunctionComponent } from "react";
import styles from "@styles/Home.module.css";
import { QuestDocument } from "types/backTypes";
import { useRouter } from "next/navigation";
import UnavailableIcon from "@components/UI/iconsComponents/icons/unavailableIcon";
import { CDNImg } from "@components/cdn/image";
import BoostReward from "@components/quests/boostReward";
import QuestCard from "@components/quests/questCard";
import questCardStyles from "@styles/quests.module.css";

type QuestProps = {
  onClick: () => void;
  imgSrc: string;
  title: string;
  issuer: Issuer;
  reward: string;
  id: number;
  expired: boolean;
};

const QuestCardCustomised: FunctionComponent<QuestProps> = ({
  onClick,
  imgSrc,
  title,
  issuer,
  reward,
  id,
  expired,
}) => {
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
      <div className="flex gap-2 mt-3 justify-center md:justify-start">
        <div className={questCardStyles.issuer}>
          {expired ? (
            <>
              <p className="text-white mr-2">Expired</p>
              <UnavailableIcon width="24" color="#D32F2F" />
            </>
          ) : (
            <>
              <CDNImg width={20} src={issuer.logoFavicon} loading="lazy" />
              <p className="text-white ml-2">{reward}</p>
            </>
          )}
        </div>
        <BoostReward questId={id} />
      </div>
    </QuestCard>
  );
};

type CompletedQuestsProps = {
  completedQuests: QuestDocument[];
};

const CompletedQuests: FunctionComponent<CompletedQuestsProps> = ({
  completedQuests,
}) => {
  const router = useRouter();

  return (
    <section className={styles.section}>
      <div className={styles.questContainer}>
        {completedQuests &&
          completedQuests.map((quest) => {
            return (
              <QuestCardCustomised
                key={quest.id}
                title={quest.title_card}
                onClick={() => router.push(`/quest/${quest.id}`)}
                imgSrc={quest.img_card}
                issuer={{
                  name: quest.issuer,
                  logoFavicon: quest.logo,
                }}
                reward={quest.rewards_title}
                id={quest.id}
                expired={quest.expired}
              />
            );
          })}
      </div>
    </section>
  );
};

export default CompletedQuests;
