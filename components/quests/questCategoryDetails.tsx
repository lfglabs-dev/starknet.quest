import React, { FunctionComponent, useEffect } from "react";
import styles from "../../styles/Home.module.css";
import { QuestDocument } from "../../types/backTypes";
import ScreenLayout from "./screenLayout";
import Quest from "./quest";
import { useRouter } from "next/router";

type QuestCategoryDetailsProps = {
  quests: QuestDocument[];
  setShowMenu: (showMenu: boolean) => void;
};

const QuestCategoryDetails: FunctionComponent<QuestCategoryDetailsProps> = ({
  quests,
  setShowMenu,
}) => {
  const router = useRouter();

  useEffect(() => {
    const documentBody = document.querySelector("body");
    if (!documentBody) return;
    // Mount
    documentBody.style.overflow = "hidden";
    // Scroll to top
    window.scrollTo(0, 0);
    // Unmount
    return () => {
      documentBody.style.removeProperty("overflow");
    };
  }, []);

  return (
    <ScreenLayout close={() => setShowMenu(false)}>
      <h1 className={styles.title}>Onboarding quests</h1>
      <div className={styles.questList}>
        {quests.map((quest) => (
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
          />
        ))}
      </div>
    </ScreenLayout>
  );
};

export default QuestCategoryDetails;
