"use client";

import React, { useEffect, useState } from "react";
import styles from "../../../styles/questboost.module.css";
import { Call, CallDetails } from "starknet";
import {
  getBoostById,
  getQuestBoostClaimParams,
  getQuestParticipants,
  getQuestsInBoost,
} from "../../../services/apiService";
import Quest from "../../../components/quests/quest";
import { useRouter } from "next/navigation";
import { QuestDocument } from "../../../types/backTypes";
import Timer from "../../../components/quests/timer";
import { useAccount, useContractWrite } from "@starknet-react/core";
import Button from "../../../components/UI/button";
import boostContractCalls from "../../../utils/calldata/boost_contract_claim";

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

  const { account } = useAccount();

  useEffect(() => {
    if (!boost?.id || !(sign.length > 0)) return;
    const data = boostContractCalls.boostContractClaimData(
      "729907108131179178523642421315218565005582159509924713194519001006014577955",
      boost.id,
      boost.amount,
      boost.token,
      sign
    );
    setCalls(data);
  }, [boost, sign]);

  //Contract
  const { writeAsync: execute } = useContractWrite({ calls: [calls as Call] });

  const handleClaimClick = async () => {
    const signature = await fetchBoostClaimParams();
    if (!signature) return;
    setSign(signature);
    // a.execute({
    //   contractAddress:
    //     "2829610427144750824096768686098500331431538330898595342164254873766442064088",
    //   entrypoint: "claim",
    //   calldata: CallData.compile({
    //     amount: boost.amount,
    //     token: boost.token,
    //     signature: final,
    //     boost_id: boost.id,
    //   }),
    // }).then((result: any) => {
    //   console.log(result);
    // });
  };

  useEffect(() => {
    if (!sign) return;
    execute();
  }, [sign]);

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
          <p className={styles.claim_button_text_highlight}>
            {boost.amount} USDC
          </p>
          <p>among</p>
          <p className={styles.claim_button_text_highlight}>
            {participants} players
          </p>
        </div>
        <div>
          <Button
            // disabled={boost.winner !== hexToDecimal(address)}
            onClick={handleClaimClick}
          >
            {/* {boost.expiry < Date.now() || boost.winner === null
              ? "Claim boost reward  🎉"
              : "You’re not selected 🙁"} */}
            yay
          </Button>
        </div>
      </div>
    </div>
  );
}
