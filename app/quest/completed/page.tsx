"use client";

import React, { useContext, useMemo } from "react";
import { useRouter } from "next/navigation";
import styles from "@styles/quests.module.css";
import moduleStyles from "@styles/category.module.css";
import homeStyles from "@styles/Home.module.css";
import { QuestsContext } from "@context/QuestsProvider";
import { pickRandomObjectsFn } from "@utils/quest";
import buttonStyles from "@styles/components/button.module.css";
import Lottie from "lottie-react";
import verifiedLottie from "@public/visuals/verifiedLottie.json";
import CompletedCategoryTitle from "@components/UI/titles/completedCategoryTitle";
import Quest from "@components/quests/quest";
import Typography from "@components/UI/typography/typography";
import { TEXT_TYPE } from "@constants/typography";

export default function Page() {
  const router = useRouter();
  const { completedQuestIds, categories } = useContext(QuestsContext);

  const computeIncompleteQuests = useMemo(() => {
    return categories.map((item) => {
      return item.quests.filter(
        (quest: { id: number; expired: boolean }) =>
          !completedQuestIds.includes(quest.id) && !quest.expired
      );
    });
  }, [categories, completedQuestIds]);

  const incompleteQuests = useMemo(() => {
    return computeIncompleteQuests.flat();
  }, [computeIncompleteQuests]);

  const uncompletedQuests = useMemo(() => {
    return pickRandomObjectsFn({
      questArray: incompleteQuests,
    });
  }, [incompleteQuests]);
  
  const textQuery = encodeURIComponent(
    "🏆 Achievement Unlocked! 🎉 I've completed all the quests and I'm ready for more. Always pushing forward!\nKeep an eye out for what's next. 🚀"
  );
  const tweetText = `https://twitter.com/intent/tweet?text=${textQuery}&hashtags=QuestCompleted,OnToTheNext,StarknetQuest`;
  return uncompletedQuests.length ? (
    <>
      <div className={homeStyles.screen}>
        <CompletedCategoryTitle title="Your NFT is on it's way !" subtitle="" />
        <div className={styles.descriptionContainer}>
          <>
            <Typography type={TEXT_TYPE.BODY_DEFAULT} className="text-center mb-8 max-w-[690px]">
              Congratulations on your efforts and progress! Keep up the great
              work and continue to explore new challenges by completing another
              quest!
            </Typography>
          </>
        </div>
        <div className={moduleStyles.questListContainer}>
          <div className={moduleStyles.questList}>
            {uncompletedQuests &&
              uncompletedQuests.map((quest, index) => (
                <Quest
                  key={index}
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
              ))}
          </div>
        </div>
      </div>
    </>
  ) : (
    <>
      <div className={homeStyles.screen}>
        <CompletedCategoryTitle title="Congratulations !" subtitle="" />
        <div className={styles.descriptionContainer}>
          <>
            <Typography type={TEXT_TYPE.BODY_DEFAULT} className="text-center mb-8 max-w-[690px]">
              You&apos;ve finished all quests. Stay focused! New quests are
              coming !
            </Typography>
          </>
        </div>
        <div className="mt-7 flex flex-col items-center justify-center text-center">
          <Lottie
            className="w-52"
            animationData={verifiedLottie}
            loop={false}
          />
          <div className="mt-8">
            <a
              className={`${buttonStyles["nq-button"]} ${buttonStyles["nq-button-secondary"]}`}
              href={tweetText}
              target="_blank"
              rel="noreferrer"
            >
              Share on X
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
