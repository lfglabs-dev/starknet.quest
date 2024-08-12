import React, { FunctionComponent } from "react";
import styles from "@styles/components/hamburger.module.css";

type HamburgerProps = {
  active?: boolean;
  onClick: () => void;
};

const Hamburger: FunctionComponent<HamburgerProps> = ({
  active = false,
  onClick
}) => {
  return (
    <div className={active ? styles["close"] : styles[""]} id={styles["menu-icon"]} onClick={onClick}>
  <div className={styles["bar"]}></div>
  <div className={styles["bar"]}></div>
  <div className={styles["bar"]}></div>

</div>
  );
};

export default Hamburger;
