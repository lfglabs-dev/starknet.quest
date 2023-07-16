import React, { FunctionComponent } from "react";
import styles from "../../../styles/components/titles.module.css";
import Corner from "../../shapes/corner";
import Squares from "../../shapes/squares";

type CategoryTitleProps = {
  title: string;
  subtitle: string;
  corner?: string | null;
  squares?: string | null;
};

const CategoryTitle: FunctionComponent<CategoryTitleProps> = ({
  title,
  subtitle,
  corner = "topLeft",
  squares = null,
}) => {
  return (
    <div className={styles.container}>
      {corner && (
        <div className={[styles.corner, styles[corner]].join(" ")}>
          <Corner />
        </div>
      )}
      {squares && (
        <div className={[styles.squares, styles[squares]].join(" ")}>
          <Squares />
        </div>
      )}
      <p className={styles.categorySubtitle}>{subtitle}</p>
      <h2 className={styles.categoryTitle}>{title}</h2>
    </div>
  );
};

export default CategoryTitle;
