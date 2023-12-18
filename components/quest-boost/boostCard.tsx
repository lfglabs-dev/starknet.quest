import React, { FunctionComponent } from "react";
import styles from "@styles/questboost.module.css";
import Cardstyles from "@styles/components/card.module.css";
import Link from "next/link";
import UnavailableIcon from "@components/UI/iconsComponents/icons/unavailableIcon";
import { CDNImage } from "@components/cdn/image";


import UnavailableIcon from "../UI/iconsComponents/icons/unavailableIcon";

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
          <p className={styles.card_title}>{boost?.name}</p>
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
            {boost.expiry > Date.now() ? null : (
              <div className="flex items-center">
                <div className={styles.issuer}>
                  <UnavailableIcon width="24" color="#D32F2F" />
                  <p className="text-white mr-2">Boost Ended</p>
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
