import React, { FunctionComponent } from "react";
import styles from "@styles/Home.module.css";
import Quest from "@components/quests/quest";
import QuestsSkeleton from "@components/skeletons/questsSkeleton";
import { useRouter } from "next/navigation";
import { QuestDocument } from "types/backTypes";
import Typography from "@components/UI/typography/typography";
import { TEXT_TYPE } from "@constants/typography";

type TrendingQuestsProps = {
  trendingQuests: QuestDocument[];
};

const TrendingQuests: FunctionComponent<TrendingQuestsProps> = ({
  trendingQuests,
}) => {
  const router = useRouter();
  return (
    <section className={styles.section}>
      <Typography type={TEXT_TYPE.H1} color="transparent" className={styles.title}>Trending quests</Typography>
      <div className={styles.questContainer}>
        {trendingQuests ? (
          trendingQuests.map((quest) => {
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
          })
        ) : (
          <QuestsSkeleton />
        )}
      </div>
    </section>
  );
};

export default TrendingQuests;
