"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import styles from "@styles/questboost.module.css";
import questStyles from "@styles/quests.module.css";
import {
  getBoostById,
  getQuestParticipants,
  getQuestsInBoost,
} from "@services/apiService";
import Quest from "@components/quests/quest";
import { useRouter } from "next/navigation";
import {
  QuestDocument,
  QuestParticipantsDocument,
} from "../../../types/backTypes";
import Timer from "@components/quests/timer";
import { useAccount } from "@starknet-react/core";
import Button from "@components/UI/button";
import { hexToDecimal } from "@utils/feltService";
import TokenSymbol from "@components/quest-boost/TokenSymbol";
import BackButton from "@components/UI/backButton";
import useBoost from "@hooks/useBoost";
import { getTokenName } from "@utils/tokenService";
import BoostSkeleton from "@components/skeletons/boostSkeleton";
import ErrorScreen from "@components/UI/screens/errorScreen";
import Typography from "@components/UI/typography/typography";
import { TEXT_TYPE } from "@constants/typography";

type BoostQuestPageProps = {
  params: {
    boostId: string;
  };
};

export default function Page({ params }: BoostQuestPageProps) {
  const router = useRouter();
  const { address } = useAccount();
  const { boostId } = params;
  const [quests, setQuests] = useState<QuestDocument[]>([]);
  const [boost, setBoost] = useState<Boost>();
  const [participants, setParticipants] = useState<number>();
  const { getBoostClaimStatus, updateBoostClaimStatus } = useBoost();
  const [loading, setLoading] = useState<boolean>(true);
  const [winnerList, setWinnerList] = useState<string[]>([]);

  const getTotalParticipants = async (questIds: number[]) => {
    try {
      let total = 0;
      await Promise.all(
        questIds?.map(async (questID) => {
          const res = (await getQuestParticipants(
            questID
          )) as QuestParticipantsDocument;
          if (res?.count) total += res?.count as number;
        })
      );
      return total;
    } catch (err) {
      console.log("Error while fetching total participants", err);
    }
  };

  const isBoostExpired = useMemo(
    () => boost && boost?.expiry <= Date.now(),
    [boost]
  );

  useEffect(() => {
    if (!boost) return;
    const winners = boost?.winner?.map((winner) => {
      return hexToDecimal(winner);
    });
    if (!winners) return;
    setWinnerList(winners);
  }, [boost]);

  const fetchPageData = async () => {
    setLoading(true);
    const questsList = await getQuestsInBoost(boostId);
    const boostInfo = await getBoostById(boostId);

    if (!boostInfo) {
      setLoading(false);
      return;
    }

    const totalParticipants = await getTotalParticipants(boostInfo.quests);
    if (questsList) {
      setQuests(questsList);
    }
    setBoost(boostInfo);
    setParticipants(totalParticipants);
    setLoading(false);
  };

  const getButtonText = useCallback(() => {
    if (!boost || !address) return;
    const chestOpened = getBoostClaimStatus(address, boost?.id);
    if (!isBoostExpired) {
      return "Boost in progress ⌛";
    } else if (isBoostExpired && boost.winner === null) {
      return "Raffle in Progress 🎩";
    } else if (!chestOpened) {
      return "See my reward 🎉";
    } else {
      return "Chest already opened";
    }
  }, [boost, address, isBoostExpired]);

  const handleButtonClick = useCallback(() => {
    if (!boost || !address) return;
    if (!winnerList?.includes(hexToDecimal(address)))
      updateBoostClaimStatus(address, boost?.id, true);

    router.push(`/quest-boost/claim/${boost?.id}`);
  }, [boost, address, winnerList]);

  const buttonDisabled = useMemo(() => {
    if (!address) return true;

    // check if boost is not expired
    // check if user has already claimed the boost
    // check if boost expired but no winners assigned

    return (
      boost &&
      (!isBoostExpired ||
        getBoostClaimStatus(address, boost.id) ||
        (isBoostExpired && boost.winner === null))
    );
  }, [boost, address, isBoostExpired]);

  useEffect(() => {
    fetchPageData();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.backButton}>
        <BackButton onClick={() => router.back()} />
      </div>
      {loading ? (
        <BoostSkeleton />
      ) : (
        <>
          {boost ? (
            <>
              <div className="flex flex-col">
                <Typography
                  type={TEXT_TYPE.H1}
                  color="transparent"
                  className={styles.title}
                >
                  {boost?.name}
                </Typography>
                {boost?.expiry && boost.expiry > Date.now() ? (
                  <Timer fixed={false} expiry={Number(boost?.expiry)} />
                ) : null}
              </div>

              <div className={styles.card_container}>
                {quests?.map((quest, index) => {
                  if (quest?.disabled) return null;
                  return (
                    <Quest
                      key={index}
                      title={quest.title_card}
                      onClick={() => router.push(`/quest/${quest.id}`)}
                      imgSrc={quest.img_card}
                      issuer={{
                        name: quest.issuer,
                        logoFavicon: quest.logo,
                      }}
                      reward={quest.rewards_title}
                      id={quest.id}
                      expired={quest.expired}
                    />
                  );
                })}
              </div>
              <div className={styles.claim_button_container}>
                <div className={styles.claim_button_text_content}>
                  <Typography type={TEXT_TYPE.BODY_DEFAULT}>Reward:</Typography>
                  <div className={questStyles.issuer}>
                    <Typography type={TEXT_TYPE.BODY_DEFAULT}>
                      {boost?.amount} {getTokenName(boost?.token ?? "")}
                    </Typography>
                    <TokenSymbol tokenAddress={boost?.token ?? ""} />
                  </div>
                  <Typography type={TEXT_TYPE.BODY_DEFAULT}>among</Typography>
                  <Typography
                    type={TEXT_TYPE.BODY_NORMAL}
                    className={styles.claim_button_text_highlight}
                  >
                    {participants} players
                  </Typography>
                </div>
                {address ? (
                  <div>
                    <Button
                      disabled={buttonDisabled}
                      onClick={handleButtonClick}
                    >
                      {getButtonText()}
                    </Button>
                  </div>
                ) : null}
              </div>
            </>
          ) : (
            <ErrorScreen
              errorMessage="This boost doesn't exist !"
              buttonText="Go back to boosts"
              onClick={() => router.push("/quest-boost")}
            />
          )}
        </>
      )}
    </div>
  );
}
