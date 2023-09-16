import styles from "../../styles/Home.module.css";
import React, { FunctionComponent, ReactNode } from "react";
import BackButton from "../UI/backButton";
import Footer from "../UI/footer";
import Blur from "../shapes/blur";

type ScreenLayoutProps = {
  children: ReactNode;
  setShowMenu: (showMenu: boolean) => void;
};

const ScreenLayout: FunctionComponent<ScreenLayoutProps> = ({
  children,
  setShowMenu,
}) => {
  return (
    <div className={styles.categoryDetails}>
      <div className={styles.blur}>
        <Blur />
      </div>
      <div className={styles.backButton}>
        <BackButton onClick={() => setShowMenu(false)} />
      </div>
      <div className={styles.content}>{children}</div>
      <div className={styles.footer}>
        <Footer />
      </div>
    </div>
  );
};

export default ScreenLayout;
