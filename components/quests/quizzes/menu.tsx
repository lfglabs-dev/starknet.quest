import { FunctionComponent, ReactNode } from "react";
import styles from "../../../styles/components/quests/quizzes.module.css";
import Button from "../../UI/button";

type MenuProps = {
  title: string;
  children: ReactNode;
  actionBar?: ReactNode;
  highlightTitle?: boolean;
};

const Menu: FunctionComponent<MenuProps> = ({
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

export default Menu;
