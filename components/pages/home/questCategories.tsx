import React, { FunctionComponent } from "react";
import styles from "../../../styles/Home.module.css";
import QuestCategory from "../../quests/questCategory";
import QuestsSkeleton from "../../skeletons/questsSkeleton";

type QuestCategoriesProps = {
  categories: QuestCategory[];
};

const QuestCategories: FunctionComponent<QuestCategoriesProps> = ({
  categories,
}) => {
  return (
    <>
      <h1 className={styles.title}>Accomplish your Starknet Quests</h1>
      <div className={`${styles.container} my-12`}>
        <div className={styles.questCategories}>
          {categories ? (
            categories.map((category) => {
              return <QuestCategory key={category.name} category={category} />;
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
