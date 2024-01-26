import React, { FunctionComponent, useEffect, useMemo, useState } from "react";
import styles from "@styles/questboost.module.css";
import Cardstyles from "@styles/components/card.module.css";
import Link from "next/link";
import UnavailableIcon from "@components/UI/iconsComponents/icons/unavailableIcon";
import CheckIcon from "@components/UI/iconsComponents/icons/checkIcon";
import TrophyIcon from "@components/UI/iconsComponents/icons/trophyIcon";
import TokenSymbol from "./TokenSymbol";
import useBoost from "@hooks/useBoost";
import theme from "@styles/theme";
import { useAccount } from "@starknet-react/core";
import { TOKEN_DECIMAL_MAP } from "@utils/constants";
import { getTokenName } from "@utils/tokenService";

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
  const [hasUserCompletedBoost, setHasUserCompletedBoost] =
    useState<boolean>(false);
  const { getBoostClaimStatus } = useBoost();
  const [hovered, setHovered] = useState<boolean>(false);

  useEffect(() => {
    if (!boost || !completedQuests) return;
    let userParticipationCheck = false;
    let userBoostCompletionCheck = true;
    boost.quests.forEach((quest) => {
      // no quests are completed by user
      if (!completedQuests) return false;
      // if any of the quests are completed by user and is part of this boost
      if (completedQuests.includes(quest)) userParticipationCheck = true;

      // check if all quests are completed by the user and if not then set this flag value to false
      if (!completedQuests.includes(quest)) userBoostCompletionCheck = false;
    });
    setHasUserCompletedBoost(userBoostCompletionCheck);
    setUserParticipationStatus(userParticipationCheck ? true : false);
  }, [completedQuests, boost]);

  useEffect(() => {
    if (!address) return;
    const res = getBoostClaimStatus(address, boost?.id);
    setUserBoostCheckStatus(res);
  }, [address]);

  const isClickable = useMemo(
    () => !userBoostCheckStatus,
    [userBoostCheckStatus]
  );

  return (
    <Link
      className="flex"
      href={isClickable ? `/quest-boost/${boost?.id}` : ""}
    >
      <div
        className={styles.boost_card_container}
        style={{
          borderColor:
            hovered && isClickable
              ? theme.palette.secondary.dark
              : "transparent",
          cursor: isClickable ? "inherit" : "not-allowed",
        }}
        onMouseOver={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
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
          {!hasUserCompletedBoost && boost.expiry > Date.now() ? (
            <div className="flex flex-row gap-2 items-center p-1.5">
              <p>
                {parseInt(
                  String(boost?.amount / Math.pow(10, boost?.decimals ?? 0))
                )}
              </p>
              <TokenSymbol tokenAddress={boost.token} />
            </div>
          ) : (
            <div className="flex w-full">
              <div className="flex items-center">
                <div className={styles.issuer}>
                  {boost.expiry > Date.now() ? (
                    hasUserCompletedBoost ? (
                      <>
                        <p className="text-white">Done</p>
                        <CheckIcon width="24" color="#6AFFAF" />
                      </>
                    ) : null
                  ) : isClickable ? (
                    <>
                      <p className="text-white">See my reward</p>
                      <TrophyIcon width="24" color="#8BEED9" />
                    </>
                  ) : (
                    <>
                      <UnavailableIcon width="24" color="#D32F2F" />
                      <p className="text-white mr-2">Boost ended</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default BoostCard;
