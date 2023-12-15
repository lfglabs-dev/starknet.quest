"use client";

import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { QuestsContext } from "@context/QuestsProvider";
import styles from "@styles/category.module.css";
import homeStyles from "@styles/Home.module.css";
import Quest from "@components/quests/quest";
import BackButton from "@components/UI/backButton";
import Blur from "@components/shapes/blur";
import { getOrderedQuests } from "@utils/quest";

type CategoryPageProps = {
  categoryName: string;
};

const Category: FunctionComponent<CategoryPageProps> = ({ categoryName }) => {
  const router = useRouter();
  const { categories } = useContext(QuestsContext);

  const [category, setCategory] = useState<QuestCategory | undefined>();

  useEffect(() => {
    if (!categoryName) return;
    setCategory(categories.find((cat) => cat.name === categoryName));
  }, [categories, categoryName]);

  return (
    <div className={styles.screen}>
      <div className={homeStyles.blur1}>
        <Blur />
      </div>
      <div className={styles.backButton}>
        <BackButton onClick={() => router.back()} />
      </div>
      <h1 className={homeStyles.title}>
        {(categoryName as string)?.charAt(0)?.toUpperCase() +
          categoryName?.slice(1)}{" "}
        quests
      </h1>
      <div className={styles.questListContainer}>
        <div className={styles.questList}>
          {category &&
            getOrderedQuests(category.quests).map((quest, index) => (
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
  );
};

export default Category;
