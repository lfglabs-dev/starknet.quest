import React, { FunctionComponent } from "react";
import styles from "@styles/Home.module.css";
import Quest from "@components/quests/quest";
import QuestsSkeleton from "@components/skeletons/questsSkeleton";
import { QuestDocument } from "types/backTypes";
import { useRouter } from "next/navigation";

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
              <Quest
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
