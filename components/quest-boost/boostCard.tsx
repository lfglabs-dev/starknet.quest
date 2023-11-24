import React from "react";
import styles from "../../styles/questboost.module.css";
import Cardstyles from "../../styles/components/card.module.css";
import Link from "next/link";

export default function BoostCard() {
  return (
    <Link href="/quest-boost/1">
      <div className={styles.boost_card_container}>
        <img
          className={Cardstyles.cardImage}
          src="/ekubo/concentration.webp"
          alt="boost"
        />
        <div className={styles.boost_card_content}>
          <p>Name of boost</p>
          <p>1 quest</p>
          <p>100 USDC</p>
        </div>
      </div>
    </Link>
  );
}
