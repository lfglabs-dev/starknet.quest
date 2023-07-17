import React, { FunctionComponent } from "react";
import styles from "../../../styles/components/titles.module.css";
import Corner from "../../shapes/corner";
import Squares from "../../shapes/squares";

type CategoryTitleProps = {
  title: string;
  subtitle: string;
  corner?: CornerStyle;
  squares?: SquareStyle;
};

const CategoryTitle: FunctionComponent<CategoryTitleProps> = ({
  title,
  subtitle,
  corner,
  squares,
}) => {
  return (
    <div className={`${styles.container} ${styles.categoryTitleContainer}`}>
      {corner && (
        <div className={`${styles.corner} ${styles[corner]}`}>
          <Corner />
        </div>
      )}
      {squares && (
        <div className={`${styles.squares} ${styles[squares]}`}>
          <Squares />
        </div>
      )}
      <p className={styles.categorySubtitle}>{subtitle}</p>
      <h2 className={styles.categoryTitle}>{title}</h2>
    </div>
  );
};

export default CategoryTitle;
