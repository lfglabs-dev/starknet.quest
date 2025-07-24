import React, { FunctionComponent } from "react";
import styles from "@styles/components/titles.module.css";
import { TEXT_TYPE } from "@constants/typography";
import Typography from "../typography/typography";

type CategoryTitleProps = {
  title: string;
  subtitle: string;
  description?: string;
  useGradientSubtitle?: boolean;
  alignLeft?: boolean;
};

const CategoryTitle: FunctionComponent<CategoryTitleProps> = ({
  title,
  subtitle,
  description, 
  useGradientSubtitle = false,
  alignLeft = false,
}) => {
  return (
    <div className={alignLeft ? styles.containerLeft : styles.container}>      
      <Typography type={TEXT_TYPE.BODY_MIDDLE} color="secondary" className={useGradientSubtitle ? styles.categorySubtitleGradient : styles.categorySubtitle}>{subtitle}</Typography>
      <Typography type={TEXT_TYPE.H2} color="secondary" className={styles.categoryTitle}>{title}</Typography>
      {description && (
        <Typography type={TEXT_TYPE.BODY_MIDDLE} color="textGray" className={styles.categoryDescription}>{description}</Typography>
      )}
    </div>
  );
};

export default CategoryTitle;
