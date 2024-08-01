import React, { FunctionComponent, useContext, useMemo } from "react";
import styles from "@styles/Home.module.css";
import Link from "next/link";
import { CDNImg } from "@components/cdn/image";
import { QuestsContext } from "@context/QuestsProvider";
import CheckIcon from "@components/UI/iconsComponents/icons/checkIcon";
import Typography from "@components/UI/typography/typography";
import { TEXT_TYPE } from "@constants/typography";

type QuestCategoryProps = {
  category: QuestCategory;
};

const QuestCategory: FunctionComponent<QuestCategoryProps> = ({ category }) => {
  const { completedQuestIds } = useContext(QuestsContext);

  const completedQuestNumber = useMemo(
    () =>
      category.quests.filter((q) => completedQuestIds?.includes(q.id)).length,
    [category, completedQuestIds]
  );

  return (
    <div className={styles.questCategoryContainer}>
      <Link
        href={`/categories/${category.name}`}
        className={styles.questCategory}
      >
        <div className={styles.categoryInfos}>
          <Typography
            type={TEXT_TYPE.H2}
            className={`text-gray-200 ${styles.categoryInfosH2}`}
          >
            {category.name} Quest{category.questNumber > 1 ? "s" : null}
          </Typography>
          <Typography
            type={TEXT_TYPE.BODY_DEFAULT}
            className={`text-gray-200 normal-case ${styles.categoryInfosText}`}
          >
            {completedQuestNumber === category.questNumber ? (
              <div className="flex">
                <span className="mr-2">All quests done</span>
                <CheckIcon width="24" color="#6AFFAF" />
              </div>
            ) : (
              `${completedQuestNumber}/${category.quests.length} Quest${
                category.questNumber > 1 ? "s" : ""
              } done`
            )}
          </Typography>
        </div>
        <CDNImg src={category.img} loading="lazy" />
      </Link>
    </div>
  );
};

export default QuestCategory;
