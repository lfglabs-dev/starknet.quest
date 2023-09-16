import React, {
  FunctionComponent,
  ReactNode,
  useEffect,
  useState,
} from "react";
import styles from "../../styles/Home.module.css";
import { QuestDocument } from "../../types/backTypes";
import ScreenLayout from "./screenLayout";
import Quest from "./quest";
import QuestDetails from "./questDetails";

type QuestCategoryDetailsProps = {
  quests: QuestDocument[];
  setShowMenu: (showMenu: boolean) => void;
};

const QuestCategoryDetails: FunctionComponent<QuestCategoryDetailsProps> = ({
  quests,
  setShowMenu,
}) => {
  const [menu, setMenu] = useState<ReactNode>(null);

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
    <ScreenLayout setShowMenu={setShowMenu}>
      <>
        <h1 className={styles.title}>Onboarding quests</h1>
        <div className={styles.questList}>
          {quests.map((quest) => (
            <Quest
              key={quest.id}
              title={quest.title_card}
              onClick={() =>
                setMenu(
                  <QuestDetails
                    quest={quest}
                    setShowMenu={() => setMenu(null)}
                  />
                )
              }
              imgSrc={quest.img_card}
              issuer={{
                name: quest.issuer,
                logoFavicon: quest.logo,
              }}
              reward={quest.rewards_title}
            />
          ))}
        </div>
        {menu}
      </>
    </ScreenLayout>
  );
};

export default QuestCategoryDetails;
