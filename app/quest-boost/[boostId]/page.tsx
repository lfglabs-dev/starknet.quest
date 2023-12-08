"use client";

import React, { useContext, useEffect, useState } from "react";
import styles from "../../../styles/questboost.module.css";
import { Call, CallDetails } from "starknet";
import {
  getBoostById,
  getQuestBoostClaimParams,
  getQuestParticipants,
  getQuestsInBoost,
  updateQuestBoostClaimStatus,
} from "../../../services/apiService";
import Quest from "../../../components/quests/quest";
import { useRouter } from "next/navigation";
import { QuestDocument } from "../../../types/backTypes";
import Timer from "../../../components/quests/timer";
import { useAccount, useContractWrite } from "@starknet-react/core";
import Button from "../../../components/UI/button";
import boostContractCalls from "../../../utils/calldata/boost_contract_claim";
import { StarknetIdJsContext } from "../../../context/StarknetIdJsProvider";
import { useNotificationManager } from "../../../hooks/useNotificationManager";
import {
  NotificationType,
  TransactionType,
} from "../../../constants/notifications";
import { hexToDecimal } from "../../../utils/feltService";
import { CDNImage } from "../../../components/cdn/image";

type BoostQuestPageProps = {
  params: {
    boostId: string;
  };
};

export default function Page({ params }: BoostQuestPageProps) {
  const router = useRouter();
  const { address } = useAccount();
  const { boostId } = params;
  const [quests, setQuests] = useState([] as QuestDocument[]);
  const [boost, setBoost] = useState({} as Boost);
  const [participants, setParticipants] = useState<number>();
  const [calls, setCalls] = useState<CallDetails>({} as CallDetails);
  const [sign, setSign] = useState<string[]>([]); // [r, s]
  const { starknetIdNavigator } = useContext(StarknetIdJsContext);
  const { addTransaction } = useNotificationManager();

  const getTotalParticipants = async (questIds: number[]) => {
    let total = 0;
    await Promise.all(
      questIds?.map(async (questID) => {
        const res = await getQuestParticipants(questID);
        if (res?.count) total += res?.count;
      })
    );
    return total;
  };

  const fetchPageData = async () => {
    const questsList = await getQuestsInBoost(boostId);
    const boostInfo = await getBoostById(boostId);
    const totalParticipants = await getTotalParticipants(boostInfo.quests);
    setQuests(questsList);
    setBoost(boostInfo);
    setParticipants(totalParticipants);
  };

  useEffect(() => {
    fetchPageData();
  }, []);

  const fetchBoostClaimParams = async () => {
    try {
      if (!boost?.id || !address) return;
      const res = await getQuestBoostClaimParams(boost.id);
      const formattedSign = [res?.r, res?.s];
      return formattedSign;
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!boost?.id || !(sign.length > 0)) return;
    const data = boostContractCalls.boostContractClaimData(
      "1343893201514102212109781013771650193042157708799337461784895813565321227065",
      boost.id,
      boost.amount,
      boost.token,
      sign
    );
    setCalls(data);
  }, [boost, sign]);

  //Contract
  const {
    data,
    error,
    writeAsync: execute,
  } = useContractWrite({ calls: [calls as Call] });

  useEffect(() => {
    const postTransactionCalls = async (transaction_hash: string) => {
      await updateQuestBoostClaimStatus(1, true);
      addTransaction({
        timestamp: Date.now(),
        subtext: "Quest Boost Rewards",
        type: NotificationType.TRANSACTION,
        data: {
          type: TransactionType.CLAIM_REWARDS,
          hash: transaction_hash,
          status: "pending",
        },
      });
    };
    if (data) {
      postTransactionCalls(data?.transaction_hash);
    }
  }, [data, error]);

  const handleClaimClick = async () => {
    const signature = await fetchBoostClaimParams();
    if (!signature) return;
    setSign(signature);
  };

  useEffect(() => {
    if (!sign || Object.keys(calls).length === 0) return;
    execute();
  }, [sign, calls]);

  return (
    <div className={styles.container}>
      <div className="flex flex-col">
        <h1 className={styles.title}>{boost?.name}</h1>
        {boost.expiry ? (
          <Timer fixed={false} expiry={Number(boost.expiry)} />
        ) : null}
      </div>

      <div className={styles.card_container}>
        {quests?.map((quest, index) => {
          if (quest?.hidden || quest?.disabled) return null;
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
          <p>Reward:</p>
          <div className="flex flex-row gap-2">
            <p className={styles.claim_button_text_highlight}>
              {boost.amount} USDC
            </p>
            <CDNImage
              src={"/icons/usdc.svg"}
              priority
              width={32}
              height={32}
              alt="usdc icon"
            />
          </div>
          <p>among</p>
          <p className={styles.claim_button_text_highlight}>
            {participants} players
          </p>
        </div>
        <div>
          <Button
            disabled={boost.winner !== hexToDecimal(address)}
            onClick={handleClaimClick}
          >
            {boost.winner === null
              ? "You’re not selected 🙁"
              : "Claim boost reward 🎉"}
          </Button>
        </div>
      </div>
    </div>
  );
}
