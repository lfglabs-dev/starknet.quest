"use client";

import React from "react";
import styles from "../../../styles/questboost.module.css";
import BoostCard from "../../../components/quest-boost/boostCard";

type BoostQuestPageProps = {
  params: {
    boostId: string;
  };
};

export default function Page({ params }: BoostQuestPageProps) {
  const { boostId } = params;
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Name of boost</h1>
      <div className={styles.card_container}>
        <BoostCard />
      </div>
      <div className={styles.claim_button_container}>
        <div className={styles.claim_button_text_content}>
          <p>Reward:</p>
          <p className={styles.claim_button_text_highlight}>100 USDC</p>
          <p>among</p>
          <p className={styles.claim_button_text_highlight}>10 players</p>
        </div>
        <button className={styles.claim_button_cta}>
          Claim boost reward 🎉
        </button>
      </div>
    </div>
  );
}
