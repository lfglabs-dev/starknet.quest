import React, { FunctionComponent, ReactNode } from "react";
import styles from "../../styles/components/quests/quiz.module.css";

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
      <h1 className={highlightTitle ? "title extrabold" : styles.menuTitle}>
        {title}
      </h1>
      {children}
      <div className={styles.menuButtons}>{actionBar}</div>
    </div>
  );
};

export default ScreenLayout;
