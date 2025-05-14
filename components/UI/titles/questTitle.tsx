import React, { FunctionComponent } from "react";
import styles from "@styles/components/questTitle.module.css";
import { TEXT_TYPE } from "@constants/typography";
import Typography from "../typography/typography";

type QuestTitleProps = {
  title: string;
  subtitle: string
  description: string;
};

const QuestTitle: FunctionComponent<QuestTitleProps> = ({
  title,
  subtitle,
  description,
}) => {
  return (
    <div className={styles.container}>
      <Typography type={TEXT_TYPE.BODY_MIDDLE} color="primary" className={styles.questTagline}>{subtitle}</Typography>
      <Typography type={TEXT_TYPE.H1} color="secondary" className={styles.questTitle}>{title}</Typography>
      <Typography type={TEXT_TYPE.BODY_EXTRA_SMALL} color="secondary" className={styles.questDescription}>{description}</Typography>
    </div>
  );
};

export default QuestTitle;