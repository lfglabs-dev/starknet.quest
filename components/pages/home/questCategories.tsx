import React, { FunctionComponent, useEffect, useState } from "react";
import styles from "../../../styles/Home.module.css";
import { QuestDocument } from "../../../types/backTypes";
import QuestCategory from "../../quests/questCategory";
import QuestsSkeleton from "../../skeletons/questsSkeleton";

type QuestCategoriesProps = {
  quests: QuestDocument[];
};

const QuestCategories: FunctionComponent<QuestCategoriesProps> = ({
  quests,
}) => {
  const [categories, setCategories] = useState<QuestCategory[]>([]);

  useEffect(() => {
    const res: {
      [key: string]: QuestCategory;
    } = {};
    for (let quest of quests) {
      const key = quest.category as string;
      const value = res[key];
      if (!value) {
        res[key] = {
          name: quest.category,
          img: quest.img_card,
          questNumber: 1,
        };
      } else {
        res[key].questNumber += 1;
      }
    }
    setCategories(Object.values(res));
  }, [quests]);

  return (
    <>
      <h1 className={styles.title}>Accomplish your Starknet Quests</h1>
      <div className={`${styles.container} my-12`}>
        <div className={styles.questCategories}>
          {categories ? (
            categories.map((category) => {
              return (
                <QuestCategory
                  key={category.name}
                  category={category}
                  quests={quests.filter(
                    (quest) => quest.category === category.name
                  )}
                />
              );
            })
          ) : (
            <QuestsSkeleton />
          )}
        </div>
      </div>
    </>
  );
};

export default QuestCategories;
