import React, { FunctionComponent } from "react";
import styles from "@styles/components/quests/card.module.css";
import cdnize from "@utils/cdnize";
import Typography from "@components/UI/typography/typography";
import type { TEXT_TYPE } from "@constants/typography";
type QuestCardProps = {
  id: number;
  children: React.ReactNode;
  imgSrc: string;
  issuer?: Issuer;
  title: string;
  onClick: () => void;
  disabled?: boolean;
};

const QuestCard: FunctionComponent<QuestCardProps> = ({
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

export default QuestCard;
