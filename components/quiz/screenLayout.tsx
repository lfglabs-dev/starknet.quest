import React, { FunctionComponent, ReactNode } from "react";
import styles from "@styles/components/quests/quiz.module.css";
import Typography from "@components/UI/typography/typography";
import { TEXT_TYPE } from "@constants/typography";

type ScreenLayoutProps = {
  title: string;
  children: ReactNode;
  actionBar?: ReactNode;
  highlightTitle?: boolean;
};

const ScreenLayout: FunctionComponent<ScreenLayoutProps> = ({
  title,
  actionBar,
  children,
  highlightTitle = true,
}) => {
  return (
    <div className={styles.menu}>
      <Typography type={TEXT_TYPE.H1} className={highlightTitle ? "title extrabold" : styles.menuTitle}>
        {title}
      </Typography>
      {children}
      <div className={styles.menuButtons}>{actionBar}</div>
    </div>
  );
};

export default ScreenLayout;
