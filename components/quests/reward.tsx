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
import Typography from "@components/UI/typography/typography";
import { TEXT_TYPE } from "@constants/typography";

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
  overrideRewardClick?: () => void;
  buttonText?: string;
  overrideDisabledState?: boolean;
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
  overrideRewardClick,
  buttonText,
  overrideDisabledState,
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
    if (overrideRewardClick) return;
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
    router.push(`/quest/completed/${quest.id}`);
  }, [executeMint, address]);

  return (
    <div className={styles.reward}>
      <div className="flex items-center gap-2">
        <p>Reward: </p>
        <QuestTag label={reward ?? ""} icon={imgSrc} />
        <BoostReward questId={quest.id} />
      </div>
      <div className="max-w-lg">
        <Button
          onClick={async () =>
            overrideRewardClick ? await overrideRewardClick() : submitTx()
          }
          disabled={overrideDisabledState ?? (disabled || claimed)}
        >
          {claimed ? "Claimed" : buttonText ? buttonText : "Get Reward"}
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
              <Typography
                type={TEXT_TYPE.BODY_NORMAL}
                color="secondary"
                className={rewardStyles.menu_title}
              >
                Unlock Your Gift!
              </Typography>
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
                  <Typography
                    type={TEXT_TYPE.BODY_DEFAULT}
                    className="text-2xl font-bold"
                  >
                    {quest.issuer}
                  </Typography>
                </div>
                <Typography type={TEXT_TYPE.BODY_DEFAULT}>
                  Congratulations on completing the quest! 🎉{" "}
                </Typography>
                <Typography type={TEXT_TYPE.BODY_DEFAULT}>
                  {quest.rewards_description}
                </Typography>
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
