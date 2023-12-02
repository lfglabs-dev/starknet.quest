"use client";

import React, { useContext, useEffect, useMemo, useState } from "react";
import styles from "../../../styles/questboost.module.css";
import { Abi, Contract, shortString } from "starknet";
import { StarknetIdJsContext } from "../../../context/StarknetIdJsProvider";
import { getBoostById, getQuestsInBoost } from "../../../services/apiService";
import Quest from "../../../components/quests/quest";
import { useRouter } from "next/navigation";
import { QuestDocument } from "../../../types/backTypes";

type BoostQuestPageProps = {
  params: {
    boostId: string;
  };
};

export default function Page({ params }: BoostQuestPageProps) {
  const router = useRouter();
  const { boostId } = params;
  const { starknetIdNavigator } = useContext(StarknetIdJsContext);
  const [quests, setQuests] = useState([] as QuestDocument[]);
  const [boost, setBoost] = useState({} as Boost);

  const fetchData = async () => {
    const questsList = await getQuestsInBoost(boostId);
    const boostInfo = await getBoostById(boostId);
    setQuests(questsList);
    setBoost(boostInfo);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // const contract = useMemo(() => {
  //   return new Contract(
  //     naming_abi as Abi,
  //     process.env.NEXT_PUBLIC_NAMING_CONTRACT as string,
  //     starknetIdNavigator?.provider
  //   );
  // }, [starknetIdNavigator?.provider]);

  // const callContract = async (
  //   contract: Contract,
  //   token: string,
  //   amount: string,
  //   signature: string[]
  // ): Promise<void> => {
  //   try {
  //     const res = await contract.call("claim", [
  //       amount,
  //       token,
  //       signature,
  //       boostId,
  //     ]);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // const handleClaimClick = async () => {
  //   const contractAddress = "";
  // };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{boost?.name}</h1>
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
          <p className={styles.claim_button_text_highlight}>100 USDC</p>
          <p>among</p>
          <p className={styles.claim_button_text_highlight}>10 players</p>
        </div>
        <button className={styles.claim_button_cta}>
          Claim boost reward 🎉
        </button>
      </div>
    </div>
  );
}
