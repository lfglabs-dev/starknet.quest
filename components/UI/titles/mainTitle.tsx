import React, { FunctionComponent } from "react";
import styles from "@styles/components/titles.module.css";
import Corner from "@components/shapes/corner";
import Squares from "@components/shapes/squares";
import Button from "../button";

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
      <div className="w-64 mt-5 ml-auto mr-auto sm:mx-0">
        <Button
          onClick={() => window.open("https://forms.gle/P2PUzet6KrKJQYZB8")}
        >
          Contact us
        </Button>
      </div>
    </div>
  );
};
export default MainTitle;
