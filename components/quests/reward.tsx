import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import styles from "../../styles/quests.module.css";
import Button from "../UI/button";
import ModalMessage from "../UI/modalMessage";
import { useContractWrite } from "@starknet-react/core";
import { useRouter } from "next/router";
import Lottie from "lottie-react";
import verifiedLottie from "../../public/visuals/verifiedLottie.json";
import { Call } from "starknet";
import { useTransactionManager } from "../../hooks/useTransactionManager";

type RewardProps = {
  onClick: () => void;
  reward: string;
  imgSrc: string;
  disabled: boolean;
  mintCalldata: Call[] | undefined;
};

const Reward: FunctionComponent<RewardProps> = ({
  onClick,
  reward,
  imgSrc,
  disabled,
  mintCalldata,
}) => {
  const [modalTxOpen, setModalTxOpen] = useState(false);
  const { addTransaction } = useTransactionManager();
  const { writeAsync: executeMint, data: mintData } = useContractWrite({
    calls: mintCalldata,
  });
  const router = useRouter();

  // useEffect(() => {
  //   if (!mintData?.transaction_hash) return;
  //   // addTransaction({ hash: mintData?.transaction_hash });
  //   setModalTxOpen(true);
  // }, [mintData]);

  // function getReward() {
  //   executeMint({});
  //   onClick();
  // }

  const submitTx = useCallback(async () => {
    const tx = await executeMint({});
    onClick();
    addTransaction(tx.transaction_hash);
    setModalTxOpen(true);
  }, [executeMint]);

  return (
    <div className={styles.reward}>
      <div className="flex">
        <p className="mr-1">Reward: </p>
        <img width={25} src={imgSrc} />
        <p className="ml-1">{reward}</p>
      </div>
      <div className="max-w-lg">
        {/* getReward */}
        <Button onClick={submitTx} disabled={disabled}>
          Get Reward
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
    </div>
  );
};

export default Reward;
