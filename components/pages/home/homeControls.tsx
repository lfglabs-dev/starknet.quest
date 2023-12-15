import React, { FunctionComponent } from "react";
import styles from "@styles/Home.module.css";

const HomeControls: FunctionComponent = () => {
  return (
    <div className={styles.controls}>
      <button aria-selected>All quests</button>
      <button>Adventure</button>
    </div>
  );
};

export default HomeControls;
