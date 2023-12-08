import React, { FunctionComponent } from "react";
import styles from "../../styles/questboost.module.css";
import Cardstyles from "../../styles/components/card.module.css";
import Link from "next/link";
import UnavailableIcon from "../UI/iconsComponents/icons/unavailableIcon";
import { CDNImage } from "../cdn/image";

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
          <p>
            {boost?.quests.length} quest{boost.quests.length > 0 ? "s" : ""}
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
              <div className="flex items-center opacity-40">
                <div className={styles.issuer}>
                  <p className="text-white mr-2">Expired</p>
                  <UnavailableIcon width="24" color="#D32F2F" />
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
