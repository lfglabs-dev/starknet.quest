import React, { FunctionComponent, useEffect, useState } from "react";
import styles from "../../../styles/Home.module.css";
import QuestCategory from "../../quests/questCategory";
import QuestsSkeleton from "../../skeletons/questsSkeleton";
import { getBoosts } from "../../../services/apiService";
import Link from "next/link";

type QuestCategoriesProps = {
  categories: QuestCategory[];
};

const QuestCategories: FunctionComponent<QuestCategoriesProps> = ({
  categories,
}) => {
  const [boosts, setBoosts] = useState<Boost[]>([]);

  const fetchBoosts = async () => {
    try {
      const res = await getBoosts();
      setBoosts(res);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchBoosts();
  }, []);

  return (
    <>
      <h1 className={styles.title}>Accomplish your Starknet Quests</h1>

      <div className={`${styles.container} my-12`}>
        <div className={styles.questCategories}>
          {boosts ? (
            <Link href={`/quest-boost`} className={styles.questCategory}>
              <div className={styles.categoryInfos}>
                <h2 className="text-gray-200">Boosts Quest</h2>
                <p className="text-gray-200">
                  {boosts.length} quest
                  {boosts.length > 1 ? "s" : null}
                </p>
              </div>
              <img src="/avnu/astronaut.webp" />
            </Link>
          ) : null}
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
