import React, { FunctionComponent, useEffect, useState } from "react";
import styles from "../../styles/quests.module.css";
import useHasRootDomain from "../../hooks/useHasRootDomain";
import { useAccount } from "@starknet-react/core";
import Popup from "../UI/menus/popup";
import { starknetIdAppLink } from "../../utils/links";

type QuestProps = {
  onClick: () => void;
  imgSrc: string;
  title: string;
  issuer: Issuer;
  reward: string;
};

const Quest: FunctionComponent<QuestProps> = ({
  onClick,
  imgSrc,
  title,
  issuer,
  reward,
}) => {
  const { address } = useAccount();
  const hasRootDomain = useHasRootDomain(address);
  const [showDomainPopup, setShowDomainPopup] = useState<boolean>(false);

  useEffect(() => {
    if (!address) return;
    setShowDomainPopup(!hasRootDomain);
  }, [address, hasRootDomain]);

  return (
    <>
      {showDomainPopup && (
        <Popup
          title="Mandatory Starknet Domain"
          banner="/visuals/profile.webp"
          description="To access Starknet Quest, you must own a Starknet domain. It's your passport to the Starknet ecosystem. Get yours now."
          buttonName="Get a Starknet Domain"
          onClick={() => window.open(starknetIdAppLink)}
        />
      )}
      <div className={styles.questCard} onClick={onClick}>
        <img src={imgSrc} className={styles.questImage} />
        <div className={styles.questInfos}>
          <h3 className={styles.questTitle}>{title}</h3>
          <div className="flex mt-2 mb-1 items-center">
            <p className="text-gray-400">{issuer.name}</p>
          </div>
          <div className="flex mt-2 mb-1 items-center">
            <img width={20} src={issuer.logoFavicon} />
            <p className="text-white ml-2">{reward}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Quest;
