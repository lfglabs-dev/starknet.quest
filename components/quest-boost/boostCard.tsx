import React, { FunctionComponent } from "react";
import styles from "../../styles/questboost.module.css";
import Cardstyles from "../../styles/components/card.module.css";
import Link from "next/link";

type BoostCardProps = {
  boost: Boost;
};

const BoostCard: FunctionComponent<BoostCardProps> = ({ boost }) => {
  return (
    <Link href={`/quest-boost/${boost?.id}`}>
      <div className={styles.boost_card_container}>
        <img
          className={Cardstyles.cardImage}
          src="/ekubo/concentration.webp"
          alt="boost"
        />
        <div className={styles.boost_card_content}>
          <p>{boost?.name}</p>
          <p>{boost?.quests.length} quest</p>
          <p>{boost?.amount} USDC</p>
        </div>
      </div>
    </Link>
  );
};

export default BoostCard;
