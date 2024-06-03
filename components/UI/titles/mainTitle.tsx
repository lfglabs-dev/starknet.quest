import React, { FunctionComponent } from "react";
import styles from "@styles/components/titles.module.css";
import Corner from "@components/shapes/corner";
import Squares from "@components/shapes/squares";
import Button from "../button";
import Typography from "../typography/typography";
import { TEXT_TYPE } from "@constants/typography";

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

      <Typography type={TEXT_TYPE.H2} color="secondary" className={styles.mainTitle}>
        {title} <strong>{highlighted}</strong>
      </Typography>
      <Typography type={TEXT_TYPE.BODY_DEFAULT} className={styles.mainSubtitle}>{subtitle}</Typography>
      <div className={styles.buttonContainer}>
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
