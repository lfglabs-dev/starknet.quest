import { FunctionComponent } from "react";
import styles from "../../styles/components/card.module.css";

type CardProps = {
  children: React.ReactNode;
  imgSrc: string;
  title: string;
  onClick: () => void;
};

const Card: FunctionComponent<CardProps> = ({
  children,
  title,
  imgSrc,
  onClick,
}) => {
  return (
    <div className={styles.card} onClick={onClick}>
      <div
        style={{ backgroundImage: `url('${imgSrc}')` }}
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
