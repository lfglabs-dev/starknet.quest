"use client";

import React, { useEffect, useMemo, useState } from "react";
import styles from "@styles/questboost.module.css";
import { getBoostById, getQuestBoostClaimParams } from "@services/apiService";
import { useAccount } from "@starknet-react/core";
import Button from "@components/UI/button";
import { useNotificationManager } from "@hooks/useNotificationManager";
import { NotificationType, TransactionType } from "@constants/notifications";
import { CDNImage } from "@components/cdn/image";
import Lottie from "lottie-react";
import claimWinnerLottie from "@public/visuals/sq_claim.json";
import claimLoserLottie from "@public/visuals/sq_looser.json";
import { hexToDecimal } from "@utils/feltService";
import { boostClaimCall } from "@utils/callData";
import { getTokenName } from "@utils/tokenService";
import useBoost from "@hooks/useBoost";

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
  const [transactionHash, setTransactionHash] = useState<string>("");
  const { updateBoostClaimStatus } = useBoost();

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
    if (isUserWinner) {
      const signature = await fetchBoostClaimParams();
      if (!signature) return;
      setSign(signature);
    } else {
      updateBoostClaimStatus(parseInt(boostId), false);
    }
  };

  useEffect(() => {
    if (!account || !boost || sign[0].length === 0 || sign[1].length === 0)
      return;

    const callContract = async () => {
      const { transaction_hash } = await account.execute(
        boostClaimCall(boost, sign)
      );
      updateBoostClaimStatus(boost?.id, true);
      setTransactionHash(transaction_hash);
    };

    callContract();
  }, [sign]);

  useEffect(() => {
    if (!(transactionHash.length > 0)) return;
    if (transactionHash) {
      addTransaction({
        timestamp: Date.now(),
        subtext: boost?.name ?? "Quest Boost Rewards",
        type: NotificationType.TRANSACTION,
        data: {
          type: TransactionType.CLAIM_REWARDS,
          hash: transactionHash,
          status: "pending",
        },
      });
    }
  }, [transactionHash]);

  const isUserWinner = useMemo(() => {
    return (
      boost &&
      boost?.winner &&
      hexToDecimal(boost?.winner) === hexToDecimal(address)
    );
  }, [boost, address]);

  return (
    <div className={styles.claim_screen_container}>
      <div className="flex flex-col gap-16">
        {displayCard ? (
          <>
            <div className={styles.claim_amount_card}>
              {isUserWinner ? (
                <>
                  <div className={styles.token_logo}>
                    {boost && getTokenName(boost?.token) === "USDC" ? (
                      <CDNImage
                        src={"/icons/usdc.svg"}
                        priority
                        width={97}
                        height={97}
                        alt="usdc icon"
                      />
                    ) : (
                      <CDNImage
                        src={"/icons/eth.svg"}
                        priority
                        width={97}
                        height={97}
                        alt="usdc icon"
                      />
                    )}
                  </div>
                  <div className={styles.claim_button_text}>
                    <p className={styles.claim_amount}>{boost?.amount}</p>
                  </div>
                  <div className={styles.token_symbol_container}>
                    <div className="bg-[#1F1F25] flex-1 rounded-[12px] flex justify-center items-center">
                      {getTokenName(boost ? boost?.token : "")}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.token_logo}>
                    <img
                      src="/visuals/animals/tiger.webp"
                      height={256}
                      width={254}
                      alt="error image"
                    />
                  </div>
                  <div className={styles.claim_button_text}>
                    <p
                      className="pb-[1.5rem] text-center"
                      style={{ fontSize: 24 }}
                    >
                      Sorry, no win this time.
                    </p>
                  </div>
                </>
              )}
            </div>

            {isUserWinner ? (
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
            ) : null}
          </>
        ) : null}
      </div>
      {boost && displayLottie ? (
        <div className="absolute ml-auto mr-auto left-0 right-0 flex justify-center w-full">
          <Lottie
            onEnterFrame={() => setDisplayCard(true)}
            onComplete={() => setDisplayLottie(false)}
            className="w-[600px] h-[600px]"
            animationData={isUserWinner ? claimWinnerLottie : claimLoserLottie}
            loop={false}
          />
        </div>
      ) : null}
    </div>
  );
}
