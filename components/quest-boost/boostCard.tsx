import React from "react";
import styles from "../../styles/questboost.module.css";
import Cardstyles from "../../styles/components/card.module.css";
import Link from "next/link";

type BoostCardProps = {};

const BoostCard: FunctionComponent<BoostCardProps> = ({ amount }) => {
  return (
    <Link href="/quest-boost/1">
      <div className={styles.boost_card_container}>
        <img
          className={Cardstyles.cardImage}
          src="/ekubo/concentration.webp"
          alt="boost"
        />
        <div className={styles.boost_card_content}>
          <p>{}</p>
          <p>1 quest</p>
          <p>{amount} USDC</p>
        </div>
      </div>
    </Link>
  );
};

export default BoostCard;
