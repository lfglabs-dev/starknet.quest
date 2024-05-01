import React, { FunctionComponent, useEffect, useMemo, useState } from "react";
import styles from "@styles/questboost.module.css";
import questStyles from "@styles/quests.module.css";
import Cardstyles from "@styles/components/card.module.css";
import Link from "next/link";
import UnavailableIcon from "@components/UI/iconsComponents/icons/unavailableIcon";
import CheckIcon from "@components/UI/iconsComponents/icons/checkIcon";
import TrophyIcon from "@components/UI/iconsComponents/icons/trophyIcon";
import TokenSymbol from "./TokenSymbol";
import useBoost from "@hooks/useBoost";
import theme from "@styles/theme";
import { useAccount } from "@starknet-react/core";
import { CompletedQuests, QueryError } from "types/backTypes";

type BoostCardProps = {
  boost: Boost;
  completedQuests?: CompletedQuests | QueryError;
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
    // return if boost does not exist or no quests are completed
    if (
      !boost ||
      !completedQuests ||
      (completedQuests as CompletedQuests).length === 0
    )
      return;

    // check if any of the quests are completed by user
    const userParticipationCheck = (completedQuests as CompletedQuests).some(
      (quest) => boost.quests.includes(quest)
    );

    // check if all quests are completed by the user
    const userBoostCompletionCheck = boost.quests.every((quest) =>
      (completedQuests as CompletedQuests).includes(quest)
    );

    setHasUserCompletedBoost(userBoostCompletionCheck);
    setUserParticipationStatus(userParticipationCheck);
  }, [completedQuests, boost]);

  useEffect(() => {
    if (!address) return;
    const res = getBoostClaimStatus(address, boost?.id);
    setUserBoostCheckStatus(res);
  }, [address]);

  const isClickable = useMemo(() => {
    if (
      boost.expiry < Date.now() &&
      hasUserCompletedBoost &&
      userBoostCheckStatus
    ) {
      return false;
    } else if (boost.expiry < Date.now() && !hasUserCompletedBoost) {
      return false;
    }
    return true;
  }, [userBoostCheckStatus, hasUserCompletedBoost]);

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
            <>
              <div className={questStyles.issuer}>
                <p>{boost?.amount}</p>
                <TokenSymbol tokenAddress={boost.token} />
              </div>
            </>
          ) : (
            <div className="flex w-full">
              <div className="flex items-center">
                {address && (
                  <div className={styles.issuer}>
                    {boost.expiry < Date.now() ? (
                      hasUserCompletedBoost ? (
                        !userBoostCheckStatus ? (
                          boost.winner != null ? (
                            <>
                              <p className="text-white">See my reward</p>
                              <TrophyIcon width="24" color="#8BEED9" />
                            </>
                          ) : (
                            <>
                              <UnavailableIcon width="24" color="#D32F2F" />
                              <p className="mr-2 text-white">Boost ended</p>
                            </>
                          )
                        ) : (
                          userBoostCheckStatus && (
                            <>
                              <UnavailableIcon width="24" color="#D32F2F" />
                              <p className="mr-2 text-white">Boost ended</p>
                            </>
                          )
                        )
                      ) : (
                        <>
                          <UnavailableIcon width="24" color="#D32F2F" />
                          <p className="mr-2 text-white">Boost ended</p>
                        </>
                      )
                    ) : (
                      hasUserCompletedBoost && (
                        <>
                          <p className="text-white">Done</p>
                          <CheckIcon width="24" color="#6AFFAF" />
                        </>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default BoostCard;
