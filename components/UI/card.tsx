import React, { FunctionComponent } from "react";
import styles from "../../styles/components/card.module.css";
import cdnize from "../../utils/cdnize";
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
        <h3 className={styles.cardTitle}>{title}</h3>
        {children}
      </div>
    </div>
  );
};

export default Card;
