"use client";

import React, { useEffect, useState } from "react";
import styles from "@styles/questboost.module.css";
import { CallData, uint256 } from "starknet";
import { getBoostById, getQuestBoostClaimParams } from "@services/apiService";
import { useAccount } from "@starknet-react/core";
import Button from "@components/UI/button";
import { useNotificationManager } from "@hooks/useNotificationManager";
import { NotificationType, TransactionType } from "@constants/notifications";
import { CDNImage } from "@components/cdn/image";
import Lottie from "lottie-react";
import verifiedLottie from "@public/visuals/sq_claim.json";
import { hexToDecimal } from "@utils/feltService";

type BoostQuestPageProps = {
  params: {
    boostId: string;
  };
};

export default function Page({ params }: BoostQuestPageProps) {
  const { address, account } = useAccount();
  const { boostId } = params;
  const [boost, setBoost] = useState<Boost>();
  const [sign, setSign] = useState<Signature>(["", ""]);
  const { addTransaction } = useNotificationManager();
  const [displayCard, setDisplayCard] = useState<boolean>(false);
  const [displayLottie, setDisplayLottie] = useState<boolean>(true);

  const fetchPageData = async () => {
    const boostInfo = await getBoostById(boostId);
    setBoost(boostInfo);
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
    <div className={styles.claim_screen_container}>
      <div className="flex flex-col gap-16">
        {displayCard ? (
          <>
            <div className={styles.claim_amount_card}>
              <div className={styles.token_logo}>
                <CDNImage
                  src={"/icons/usdc.svg"}
                  priority
                  width={97}
                  height={97}
                  alt="usdc icon"
                />
              </div>
              <div className={styles.claim_button_text}>
                <p className={styles.claim_amount}>{boost?.amount}</p>
              </div>
              <div className={styles.token_symbol_container}>
                <div className="bg-[#1F1F25] flex-1 rounded-[12px] flex justify-center items-center">
                  USDC
                </div>
              </div>
            </div>
            <div className={styles.claim_button_animation}>
              <Button
                disabled={
                  boost?.claimed ||
                  hexToDecimal(boost?.winner ?? "") !== hexToDecimal(address)
                }
                onClick={handleClaimClick}
              >
                Collect my reward
              </Button>
            </div>
          </>
        ) : null}
      </div>
      {displayLottie ? (
        <div className="absolute ml-auto mr-auto left-0 right-0 flex justify-center w-full">
          <Lottie
            onEnterFrame={() => {
              setDisplayCard(true);
            }}
            onComplete={() => {
              setDisplayLottie(false);
            }}
            className="w-[600px] h-[600px]"
            animationData={verifiedLottie}
            loop={false}
          />
        </div>
      ) : null}
    </div>
  );
}
