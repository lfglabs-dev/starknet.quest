import React, { FunctionComponent, useCallback, useState } from "react";
import styles from "../../styles/quests.module.css";
import Button from "../UI/button";
import ModalMessage from "../UI/modalMessage";
import { useAccount, useContractWrite } from "@starknet-react/core";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import verifiedLottie from "@public/visuals/verifiedLottie.json";
import { Call } from "starknet";
import { useNotificationManager } from "@hooks/useNotificationManager";
import { NotificationType, TransactionType } from "@constants/notifications";
import { QuestDocument } from "types/backTypes";
import RewardModal from "./rewardModal";
import rewardStyles from "@styles/components/quests/modal.module.css";
import BoostReward from "./boostReward";
import QuestTag from "@components/UI/questTag";

type RewardProps = {
  onClick: () => void;
  reward: string;
  imgSrc: string;
  disabled: boolean;
  mintCalldata: Call[] | undefined;
  questName: string;
  hasNftReward?: boolean;
  claimed?: boolean;
  quest: QuestDocument;
};

const Reward: FunctionComponent<RewardProps> = ({
  onClick,
  reward,
  imgSrc,
  disabled,
  mintCalldata,
  questName,
  hasNftReward,
  claimed,
  quest,
}) => {
  const [modalTxOpen, setModalTxOpen] = useState(false);
  const { address } = useAccount();
  const { addTransaction } = useNotificationManager();
  const { writeAsync: executeMint } = useContractWrite({
    calls: mintCalldata,
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const router = useRouter();

  const submitTx = useCallback(async () => {
    if (!hasNftReward) {
      setShowSuccessModal(true);
      return;
    }
    if (!address) return;
    const tx = await executeMint();
    onClick();
    addTransaction({
      timestamp: Date.now(),
      subtext: questName,
      type: NotificationType.TRANSACTION,
      data: {
        type: TransactionType.MINT_NFT,
        hash: tx.transaction_hash,
        status: "pending",
      },
    });
    router.push('/quest/completed');
  }, [executeMint, address]);

  return (
    <div className={styles.reward}>
      <div className="flex items-center gap-2">
        <p>Reward: </p>
        <QuestTag label={reward ?? ''} icon={imgSrc}/>
        <BoostReward questId={quest.id} />
      </div>
      <div className="max-w-lg">
        {/* getReward */}
        <Button onClick={submitTx} disabled={disabled || claimed}>
          {claimed ? "Claimed" : "Get Reward"}
        </Button>
      </div>

      <ModalMessage
        open={modalTxOpen}
        title="Your NFT is on it's way !"
        closeModal={() => setModalTxOpen(false)}
        message={
          <div className="mt-7 flex flex-col items-center justify-center text-center">
            <Lottie
              className="w-52"
              animationData={verifiedLottie}
              loop={false}
            />
            <div className="mt-4">
              <Button onClick={() => router.push("/")}>
                Complete another quest !
              </Button>
            </div>
          </div>
        }
      />

      <RewardModal
        open={showSuccessModal}
        closeModal={() => setShowSuccessModal(false)}
        message={
          <div className="flex flex-col items-center justify-center text-center">
            <div className="bg-[#1F1F25] w-full flex p-8 justify-center items-center flex-col gap-8 rounded-tr-3xl rounded-tl-3xl">
              <p className={rewardStyles.menu_title}>Unlock Your Gift!</p>
              <img
                src="/icons/gift.svg"
                width={183}
                height={177}
                alt="trophy icon"
              />
            </div>
            <div className="flex flex-col justify-center p-4 w-auto">
              <div className="flex flex-col justify-center gap-2 px-8 pt-6">
                <div className="flex flex-row justify-center items-center gap-2 pb-4">
                  <img width={40} src={quest.logo} />
                  <p className="text-2xl font-bold">{quest.issuer}</p>
                </div>
                <p>Congratulations on completing the quest! 🎉 </p>
                <p>{quest.rewards_description}</p>
              </div>
              <div className="p-6 w-max self-center">
                <Button
                  onClick={() => {
                    setShowSuccessModal(false);
                    window.open("https://www.focustree.app/");
                  }}
                >
                  Claim Rewards
                </Button>
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default Reward;
