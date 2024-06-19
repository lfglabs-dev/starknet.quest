import React, { FunctionComponent } from "react";
import styles from "@styles/components/titles.module.css";
import Corner from "@components/shapes/corner";
import Squares from "@components/shapes/squares";
import { TEXT_TYPE } from "@constants/typography";
import Typography from "../typography/typography";

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
    <div className={styles.container}>
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
      <Typography type={TEXT_TYPE.BODY_MIDDLE} color="secondary" className={styles.categorySubtitle}>{subtitle}</Typography>
      <Typography type={TEXT_TYPE.H2} color="secondary" className={styles.newCategoryTitle}>{title}</Typography>
    </div>
  );
};

export default CategoryTitle;
