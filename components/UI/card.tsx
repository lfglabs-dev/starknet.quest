import React, { FunctionComponent } from "react";
import styles from "@styles/components/card.module.css";
import cdnize from "@utils/cdnize";
import Typography from "./typography/typography";
import type { TEXT_TYPE } from "@constants/typography";
type CardProps = {
  children: React.ReactNode;
  imgSrc: string;
  title: string;
  onClick: () => void;
  disabled?: boolean;
};

const Card: FunctionComponent<CardProps> = ({
  children,
  title,
  imgSrc,
  onClick,
  disabled,
}) => {
  return (
    <div className={styles.card} onClick={onClick} aria-disabled={disabled}>
      <div
        style={{ backgroundImage: `url('${cdnize(imgSrc)}')` }}
        className={styles.cardImage}
      />
      <div className={styles.cardInfos}>
        <Typography type={TEXT_TYPE.H3} color="secondary" className={styles.cardTitle}>{title}</Typography>
        {children}
      </div>
    </div>
  );
};

export default Card;
