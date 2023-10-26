import { NextPage } from "next";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { QuestsContext } from "../../context/QuestsProvider";
import styles from "../../styles/category.module.css";
import homeStyles from "../../styles/Home.module.css";
import Quest from "../../components/quests/quest";
import BackButton from "../../components/UI/backButton";
import Blur from "../../components/shapes/blur";

const CategoriesPage: NextPage = () => {
  const router = useRouter();
  const { category: categoryName } = router.query;
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
      <div className={styles.questList}>
        {category &&
          category.quests.map((quest, index) => (
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
              expired={quest.disabled && !quest.hidden}
            />
          ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
