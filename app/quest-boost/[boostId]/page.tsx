"use client";

import React, { useEffect, useState } from "react";
import styles from "@styles/questboost.module.css";
import { CallData, uint256 } from "starknet";
import {
  getBoostById,
  getQuestBoostClaimParams,
  getQuestParticipants,
  getQuestsInBoost,
} from "@services/apiService";
import Quest from "@components/quests/quest";
import { useRouter } from "next/navigation";
import { QuestDocument } from "../../../types/backTypes";
import Timer from "@components/quests/timer";
import { useAccount } from "@starknet-react/core";
import Button from "@components/UI/button";
import { useNotificationManager } from "@hooks/useNotificationManager";
import {
  NotificationType,
  TransactionType,
} from "@constants/notifications";
import { CDNImage } from "@components/cdn/image";
import { hexToDecimal } from "../../../utils/feltService";


type BoostQuestPageProps = {
  params: {
    boostId: string;
  };
};

export default function Page({ params }: BoostQuestPageProps) {
  const router = useRouter();
  const { address, account } = useAccount();
  const { boostId } = params;
  const [quests, setQuests] = useState<QuestDocument[]>([]);
  const [boost, setBoost] = useState<Boost>();
  const [participants, setParticipants] = useState<number>();
  const [sign, setSign] = useState<Signature>(["", ""]);
  const [disableClaimButton, setDisableClaimButton] = useState<boolean>(false);
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

  const handleClaimClick = async () => {
    const signature = await fetchBoostClaimParams();
    if (!signature) return;
    setSign(signature);
  };

  useEffect(() => {
    if (!account || !boost || sign[0].length === 0 || sign[1].length === 0)
      return;

    const callContract = async () => {
      const amount = uint256.bnToUint256(boost.amount);
      const claimCallData = CallData.compile({
        amount: amount,
        token: boost.token,
        boost_id: boost.id,
        signature: sign,
      });

      const { transaction_hash } = await account.execute({
        contractAddress: process.env.NEXT_PUBLIC_QUEST_BOOST_CONTRACT ?? "",
        entrypoint: "claim",
        calldata: claimCallData,
      });

      if (transaction_hash) {
        setDisableClaimButton(true);
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
      }
    };

    callContract();
  }, [sign]);

  return (
    <div className={styles.container}>
      <div className="flex flex-col">
        <h1 className={styles.title}>{boost?.name}</h1>
        {boost?.expiry && boost.expiry > Date.now() ? (
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
            disabled={
              boost?.claimed ||
              hexToDecimal(boost?.winner ?? "") !== hexToDecimal(address)
            }
            onClick={handleClaimClick}
          >
            {(() => {
              if (boost?.claimed) {
                return "Claimed ✅";
              } else if (
                hexToDecimal(boost?.winner ?? "") === hexToDecimal(address)
              ) {
                return "Claim boost reward 🎉 ";
              } else if (boost && boost?.expiry > Date.now()) {
                return "Boost has not ended ⌛";
              } else {
                return "You’re not selected 🙁";
              }
            })()}
          </Button>
        </div>
      </div>
    </div>
  );
}
