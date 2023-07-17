import React, { FunctionComponent } from "react";
import styles from "../../../styles/components/titles.module.css";
import Corner from "../../shapes/corner";
import Squares from "../../shapes/squares";

type MainTitleProps = {
  title: string;
  highlighted: string;
  subtitle: string;
  corner?: CornerStyle;
  squares?: SquareStyle;
};

const MainTitle: FunctionComponent<MainTitleProps> = ({
  title,
  highlighted,
  subtitle,
  corner,
  squares,
}) => {
  return (
    <div className={`${styles.container} ${styles.mainTitleContainer}`}>
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

      <h2 className={styles.mainTitle}>
        {title} <strong>{highlighted}</strong>
      </h2>
      <p className={styles.mainSubtitle}>{subtitle}</p>
    </div>
  );
};
export default MainTitle;
