import React, { FunctionComponent } from "react";
import styles from "../../styles/questboost.module.css";
import Cardstyles from "../../styles/components/card.module.css";
import Link from "next/link";
import { CDNImage } from "../cdn/image";
import CheckIcon from "../UI/iconsComponents/icons/checkIcon";

type BoostCardProps = {
  boost: Boost;
};

const BoostCard: FunctionComponent<BoostCardProps> = ({ boost }) => {
  return (
    <Link href={`/quest-boost/${boost?.id}`}>
      <div className={styles.boost_card_container}>
        <img
          className={Cardstyles.cardImage}
          src={boost?.img_url}
          alt="boost"
        />
        <div className={styles.boost_card_content}>
          <p>{boost?.name}</p>
          <p>
            {boost?.quests.length} quest{boost.quests.length > 1 ? "s" : ""}
          </p>
          <div className="flex flex-row gap-2">
            <p>{boost?.amount} USDC</p>
            <CDNImage
              src={"/icons/usdc.svg"}
              priority
              width={20}
              height={20}
              alt="usdc icon"
            />
          </div>
          <div className="flex w-full">
            {boost.expiry < Date.now() ? null : (
              <div className="flex items-center">
                <div className={styles.issuer}>
                  <p className="text-white mr-2">Boost Ended</p>
                  <CheckIcon width="24" color="#6AFFAF" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BoostCard;
