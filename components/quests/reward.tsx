import React, { FunctionComponent, useEffect, useState } from "react";
import styles from "../../styles/quests.module.css";
import Button from "../UI/button";
import ModalMessage from "../UI/modalMessage";
import {
  useAccount,
  useContractWrite,
  useTransactionManager,
} from "@starknet-react/core";
import { useRouter } from "next/router";
import Lottie from "lottie-react";
import verifiedLottie from "../../public/visuals/verifiedLottie.json";
import { Call } from "starknet";
import useHasRootDomain from "../../hooks/useHasRootDomain";
import Popup from "../UI/menus/popup";
import { starknetIdAppLink } from "../../utils/links";

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
  const { address } = useAccount();
  const hasRootDomain = useHasRootDomain(address);
  const [showDomainPopup, setShowDomainPopup] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (!mintData?.transaction_hash) return;
    addTransaction({ hash: mintData?.transaction_hash });
    setModalTxOpen(true);
  }, [mintData]);

  function getReward() {
    setShowDomainPopup(true);
    executeMint();
    onClick();
  }

  return (
    <div className={styles.reward}>
      {showDomainPopup && !hasRootDomain ? (
        <Popup
          title="Mandatory Starknet Domain"
          banner="/visuals/profile.webp"
          description="To access Starknet Quest, you must own a Starknet domain. It's your passport to the Starknet ecosystem. Get yours now."
          buttonName="Get a Starknet Domain"
          onClick={() => window.open(starknetIdAppLink)}
          onClose={() => setShowDomainPopup(false)}
        />
      ) : null}
      <div className="flex">
        <p className="mr-1">Reward: </p>
        <img width={25} src={imgSrc} />
        <p className="ml-1">{reward}</p>
      </div>
      <div className="max-w-lg">
        <Button onClick={getReward} disabled={disabled}>
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
