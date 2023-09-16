import React, { FunctionComponent, useState } from "react";
import styles from "../../styles/Home.module.css";
import QuestCategoryDetails from "./questCategoryDetails";
import { QuestDocument } from "../../types/backTypes";

type QuestCategoryProps = {
  category: QuestCategory;
  quests: QuestDocument[];
};

const QuestCategory: FunctionComponent<QuestCategoryProps> = ({
  category,
  quests,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <div className={styles.questCategory} onClick={() => setShowMenu(true)}>
        <div className={styles.categoryInfos}>
          <h2 className="text-gray-200">{category.name} Quest</h2>
          <p className="text-gray-200">
            {category.questNumber} quest{category.questNumber > 1 ? "s" : ""}
          </p>
        </div>
        <img src={category.img} />
      </div>
      {showMenu && (
        <QuestCategoryDetails setShowMenu={setShowMenu} quests={quests} />
      )}
    </>
  );
};

export default QuestCategory;
