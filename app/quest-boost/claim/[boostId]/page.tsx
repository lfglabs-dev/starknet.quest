"use client";

import React, { useEffect, useMemo, useState } from "react";
import styles from "@styles/questboost.module.css";
import {
  getBoostById,
  getPendingBoostClaims,
  getQuestBoostClaimParams,
} from "@services/apiService";
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
import { useRouter } from "next/navigation";
import ModalMessage from "@components/UI/modalMessage";
import verifiedLottie from "@public/visuals/verifiedLottie.json";
import { PendingBoostClaim } from "types/backTypes";

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
  const [winnerList, setWinnerList] = useState<string[]>([]);
  const [isUnclaimed, setIsUnclaimed] = useState<boolean>(false);
  const { updateBoostClaimStatus } = useBoost();
  const [displayAmount, setDisplayAmount] = useState<number>(0);
  const [modalTxOpen, setModalTxOpen] = useState(false);
  const router = useRouter();

  const fetchPageData = async () => {
    try {
      const boostInfo = await getBoostById(boostId);
      const pendingClaimStatus = await getPendingBoostClaims(
        hexToDecimal(address)
      );
      // check if current boost is not claimed
      if (pendingClaimStatus) {
        setIsUnclaimed(
          pendingClaimStatus.filter(
            (claim: PendingBoostClaim) => claim.id === parseInt(boostId)
          ).length > 0
        );
      }
      setBoost(boostInfo);
    } catch (err) {
      console.log("Error while fetching boost", err);
    }
  };

  useEffect(() => {
    if (!address) return;
    fetchPageData();
  }, [address]);

  useEffect(() => {
    if (!boost) return;
    const winners = boost?.winner?.map((winner) => {
      return hexToDecimal(winner);
    });
    if (!winners) return;
    setWinnerList(winners);
  }, [boost]);

  const fetchBoostClaimParams = async (): Promise<Signature> => {
    let formattedSign: Signature = ["", ""];
    try {
      if (!boost?.id || !address) return formattedSign;
      const res = await getQuestBoostClaimParams(boost?.id, address);
      if (!res) {
        return ["", ""];
      }
      formattedSign = [res?.r, res?.s];
      return formattedSign;
    } catch (err) {
      console.log("Error while fetching signature", err);
      return formattedSign;
    }
  };

  const isUserWinner = useMemo(() => {
    if (!boost || !address || winnerList.length === 0) return false;
    // convert values in winner array from hex to decimal
    if (!boost.winner) return false;

    setDisplayAmount(parseInt(String(boost?.amount / boost?.num_of_winners)));
    return winnerList.includes(hexToDecimal(address));
  }, [boost, address, winnerList]);

  const handleClaimClick = async () => {
    if (!address) return;
    if (isUserWinner) {
      const signature = await fetchBoostClaimParams();
      if (!signature) return;
      setSign(signature);
    } else {
      updateBoostClaimStatus(address, parseInt(boostId), false);
    }
  };

  useEffect(() => {
    if (
      !address ||
      !account ||
      !boost ||
      sign[0].length === 0 ||
      sign[1].length === 0
    )
      return;

    const callContract = async () => {
      const { transaction_hash } = await account.execute(
        boostClaimCall(boost, sign)
      );
      if (transaction_hash) {
        updateBoostClaimStatus(address, boost?.id, true);
      }
      setTransactionHash(transaction_hash);
      setModalTxOpen(true);
    };

    callContract();
  }, [sign, account, boost]);

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
                    ) : boost && getTokenName(boost?.token) === "LORDS" ? (
                      <CDNImage
                        src={"/icons/lord.webp"}
                        priority
                        width={97}
                        height={97}
                        alt="lords icon"
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
                    <p className={styles.claim_amount}>
                      {boost ? displayAmount : 0}
                    </p>
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

            <div className={styles.claim_button_animation}>
              {isUserWinner ? (
                <Button disabled={!isUnclaimed} onClick={handleClaimClick}>
                  Collect my reward
                </Button>
              ) : (
                <div className="block ml-auto mr-auto">
                  <Button onClick={() => router.push("/quest-boost")}>
                    Back on boosts quest
                  </Button>
                </div>
              )}
            </div>
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
      <ModalMessage
        open={modalTxOpen}
        title="Your NFT is on it's way !"
        closeModal={() => {
          setModalTxOpen(false);
          router.push("/quest-boost");
        }}
        message={
          <div className="mt-7 flex flex-col items-center justify-center text-center">
            <Lottie
              className="w-52"
              animationData={verifiedLottie}
              loop={false}
            />
            <div className="mt-4">
              <Button onClick={() => router.push("/quest-boost")}>
                Complete another quest !
              </Button>
            </div>
          </div>
        }
      />
    </div>
  );
}
