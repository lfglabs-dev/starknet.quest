import React, { FunctionComponent, useEffect, useState } from "react";
import styles from "@styles/questboost.module.css";
import Cardstyles from "@styles/components/card.module.css";
import Link from "next/link";
import UnavailableIcon from "@components/UI/iconsComponents/icons/unavailableIcon";
import CheckIcon from "@components/UI/iconsComponents/icons/checkIcon";
import TrophyIcon from "@components/UI/iconsComponents/icons/trophyIcon";
import TokenSymbol from "./TokenSymbol";
import { hexToDecimal } from "@utils/feltService";
import { useAccount } from "@starknet-react/core";
import useBoost from "@hooks/useBoost";

type BoostCardProps = {
  boost: Boost;
  completedQuests?: number[];
};

const BoostCard: FunctionComponent<BoostCardProps> = ({
  boost,
  completedQuests,
}) => {
  const { address } = useAccount();
  const [userParticipationStatus, setUserParticipationStatus] =
    useState<boolean>(false);
  const [userBoostCheckStatus, setUserBoostCheckStatus] =
    useState<boolean>(false);
  const { getBoostClaimStatus } = useBoost();

  useEffect(() => {
    if (!boost || !completedQuests) return;
    let userParticipationCheck = false;
    boost.quests.forEach((quest) => {
      // no quests are completed by user
      if (!completedQuests) return false;

      // if any of the quests are completed by user and is part of this boost
      if (completedQuests.includes(quest)) userParticipationCheck = true;
    });
    setUserParticipationStatus(userParticipationCheck ? true : false);
    if (userParticipationCheck) {
      const res = getBoostClaimStatus(boost?.id);
      setUserBoostCheckStatus(res);
    }
  }, [completedQuests]);

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
          {boost.expiry > Date.now() ? (
            <div className="flex flex-row gap-2 items-center">
              <p>{boost?.amount}</p>
              <TokenSymbol tokenAddress={boost.token} />
            </div>
          ) : null}
          <div className="flex w-full">
            {boost.expiry > Date.now() ? null : (
              <div className="flex items-center">
                <div className={styles.issuer}>
                  {userParticipationStatus ? (
                    !userBoostCheckStatus ? (
                      <>
                        <p className="text-white">See my reward</p>
                        <TrophyIcon width="24" color="#8BEED9" />
                      </>
                    ) : hexToDecimal(boost?.winner ?? "") ===
                      hexToDecimal(address) ? (
                      <>
                        <p className="text-white">Done</p>
                        <CheckIcon width="24" color="#6AFFAF" />
                      </>
                    ) : (
                      <>
                        <UnavailableIcon width="24" color="#D32F2F" />
                        <p className="text-white mr-2">Boost ended</p>
                      </>
                    )
                  ) : (
                    <>
                      <UnavailableIcon width="24" color="#D32F2F" />
                      <p className="text-white mr-2">Boost ended</p>
                    </>
                  )}
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
