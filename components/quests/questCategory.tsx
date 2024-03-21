import React, { FunctionComponent, useContext, useMemo } from "react";
import styles from "@styles/Home.module.css";
import Link from "next/link";
import { CDNImg } from "@components/cdn/image";
import { QuestsContext } from "@context/QuestsProvider";
import CheckIcon from "@components/UI/iconsComponents/icons/checkIcon";

type QuestCategoryProps = {
  category: QuestCategory;
};

const QuestCategory: FunctionComponent<QuestCategoryProps> = ({ category }) => {
  const { completedQuestIds } = useContext(QuestsContext);

  const completedQuestNumber = useMemo(
    () =>
      category.quests.filter((q) => completedQuestIds.includes(q.id)).length,
    [category, completedQuestIds]
  );

  return (
    <div className={styles.questCategoryContainer}>
      <Link
        href={`/categories/${category.name}`}
        className={styles.questCategory}
      >
        <div className={styles.categoryInfos}>
          <h2 className="text-gray-200">
            {category.name} Quest{category.questNumber > 1 ? "s" : null}
          </h2>
          <p className="text-gray-200 normal-case">
            {completedQuestNumber === category.questNumber ? (
              <div className="flex">
                <span className="mr-2">All quests done</span>
                <CheckIcon width="24" color="#6AFFAF" />
              </div>
            ) : (
              `${completedQuestNumber}/${category.questNumber} Quest${
                category.questNumber > 1 ? "s" : ""
              } done`
            )}
          </p>
        </div>
        <CDNImg src={category.img} loading="lazy"/>
      </Link>
    </div>
  );
};

export default QuestCategory;
