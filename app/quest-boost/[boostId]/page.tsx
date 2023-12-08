"use client";

import React, { useEffect, useState } from "react";
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
  const [quests, setQuests] = useState<QuestDocument[]>([]);
  const [boost, setBoost] = useState<Boost>();
  const [participants, setParticipants] = useState<number>();
  const [call, setCall] = useState<CallDetails>();
  const [sign, setSign] = useState<Signature>(["", ""]);
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

  const fetchBoostClaimParams = async (): Promise<Signature> => {
    let formattedSign: Signature = ["", ""];
    try {
      if (!boost?.id || !address) return formattedSign;
      const res = await getQuestBoostClaimParams(boost.id);
      formattedSign = [res?.r, res?.s];
      return formattedSign;
    } catch (err) {
      console.log(err);
      return formattedSign;
    }
  };

  useEffect(() => {
    if (!boost?.id || !(sign.length > 0)) return;
    const data = boostContractCalls.boostContractClaimData(
      hexToDecimal(process.env.NEXT_PUBLIC_QUEST_BOOST_CONTRACT),
      boost.id,
      boost.amount,
      boost.token,
      sign
    );
    setCall(data);
  }, [boost, sign]);

  //Contract
  const {
    data,
    error,
    writeAsync: execute,
  } = useContractWrite({ calls: [call as Call] });

  useEffect(() => {
    const postTransactionCalls = async (transaction_hash: string) => {
      await updateQuestBoostClaimStatus(1, true);
      addTransaction({
        timestamp: Date.now(),
        subtext: boost?.name ?? "Quest Boost Rewards",
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
    if (!sign || (call && Object.keys(call).length === 0)) return;
    execute();
  }, [sign, call]);

  return (
    <div className={styles.container}>
      <div className="flex flex-col">
        <h1 className={styles.title}>{boost?.name}</h1>
        {boost?.expiry ? (
          <Timer fixed={false} expiry={Number(boost?.expiry)} />
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
              {boost?.amount} USDC
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
            disabled={boost?.winner !== hexToDecimal(address)}
            onClick={handleClaimClick}
          >
            {boost?.winner === hexToDecimal(address)
              ? "Claim boost reward 🎉 "
              : boost?.expiry
              ? boost?.expiry > Date.now()
                ? "Claim boost reward 🎉 "
                : "You’re not selected 🙁"
              : "Claim boost reward 🎉 "}
          </Button>
        </div>
      </div>
    </div>
  );
}
