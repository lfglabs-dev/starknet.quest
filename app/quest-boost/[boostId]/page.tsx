"use client";

import React, { useEffect, useState } from "react";
import styles from "../../../styles/questboost.module.css";
import {
  getBoostById,
  getQuestParticipants,
  getQuestsInBoost,
} from "../../../services/apiService";
import Quest from "../../../components/quests/quest";
import { useRouter } from "next/navigation";
import { QuestDocument } from "../../../types/backTypes";
import Timer from "../../../components/quests/timer";
import { useAccount } from "@starknet-react/core";
import Button from "../../../components/UI/button";
import { CDNImage } from "../../../components/cdn/image";
import { hexToDecimal } from "../../../utils/feltService";

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
        {address ? (
          <div>
            <Button
              disabled={
                boost?.claimed ||
                hexToDecimal(boost?.winner ?? "") !== hexToDecimal(address)
              }
              onClick={() => router.push(`/quest-boost/claim/${boost?.id}`)}
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
        ) : null}
      </div>
    </div>
  );
}
