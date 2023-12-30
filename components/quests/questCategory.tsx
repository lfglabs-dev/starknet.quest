import React, { FunctionComponent } from "react";
import styles from "@styles/Home.module.css";
import Link from "next/link";
import { CDNImg } from "@components/cdn/image";

type QuestCategoryProps = {
  category: QuestCategory;
};

const QuestCategory: FunctionComponent<QuestCategoryProps> = ({ category }) => {
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
          <p className="text-gray-200">
            {category.questNumber} quest{category.questNumber > 1 ? "s" : null}
          </p>
        </div>
        <CDNImg src={category.img} />
      </Link>
    </div>
  );
};

export default QuestCategory;
