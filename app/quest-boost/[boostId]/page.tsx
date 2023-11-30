"use client";

import React, { useContext, useMemo } from "react";
import styles from "../../../styles/questboost.module.css";
import BoostCard from "../../../components/quest-boost/boostCard";
import { Abi, Contract, shortString } from "starknet";
import { StarknetIdJsContext } from "../../../context/StarknetIdJsProvider";

type BoostQuestPageProps = {
  params: {
    boostId: string;
  };
};

export default function Page({ params }: BoostQuestPageProps) {
  const { boostId } = params;
  const { starknetIdNavigator } = useContext(StarknetIdJsContext);

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
      <h1 className={styles.title}>Name of boost</h1>
      <div className={styles.card_container}>
        <BoostCard />
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
