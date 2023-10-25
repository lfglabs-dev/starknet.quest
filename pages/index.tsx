import React, { useCallback, useContext } from "react";
import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import FeaturedQuest from "../components/quests/featuredQuest";

import { useRouter } from "next/router";
import HowToParticipate from "../components/pages/home/howToParticipate";
import QuestCategories from "../components/pages/home/questCategories";
import TrendingQuests from "../components/pages/home/trending";
import Blur from "../components/shapes/blur";
import { QuestsContext } from "../context/QuestsProvider";
import { uint256 } from "starknet";
import {
  useAccount,
  useContract,
  useContractWrite,
  useNetwork,
} from "@starknet-react/core";
import erc20_abi from "../abi/erc20_abi.json";
import { useTransactionManager } from "../hooks/useTransactionManager";
import { NotificationType } from "../constants/notifications";

const Quests: NextPage = () => {
  const router = useRouter();
  const { featuredQuest, categories, trendingQuests } =
    useContext(QuestsContext);

  // ------- FOR TESTING PURPOSES ONLY -------
  const { chain } = useNetwork();
  const { address } = useAccount();
  const { addTransaction } = useTransactionManager();
  const amount = uint256.bnToUint256(BigInt(1));
  const { contract } = useContract({
    abi: erc20_abi,
    address: chain.nativeCurrency.address,
  });
  const { writeAsync, isLoading } = useContractWrite({
    calls: address
      ? [contract?.populateTransaction["transfer"]!(address, amount)]
      : [],
  });

  const submitTx = useCallback(async () => {
    console.log("address before", address);
    if (!address) return;
    const tx = await writeAsync({});
    addTransaction({
      hash: tx.transaction_hash,
      status: "pending",
      timestamp: Date.now(),
      name: "Test tx",
      type: NotificationType.MINT_NFT,
    });
  }, [writeAsync, address]);

  // ------- END FOR TESTING PURPOSES ONLY -------

  return (
    <div className={styles.screen}>
      <div className={styles.container}>
        <div className={styles.blur1}>
          <Blur />
        </div>
        {/* For testing purposes */}
        <div onClick={submitTx}>Send test tx</div>
        <FeaturedQuest
          key={featuredQuest?.id}
          title={featuredQuest?.title_card}
          onClick={() => router.push(`/quest/${featuredQuest?.id}`)}
          imgSrc={featuredQuest?.img_card}
          issuer={{
            name: featuredQuest?.issuer ?? "",
            logoFavicon: featuredQuest?.logo ?? "",
          }}
          reward={featuredQuest?.rewards_title}
          desc={featuredQuest?.desc}
          expiry={featuredQuest?.expiry_timestamp}
        />
        <QuestCategories categories={categories} />
        <div className={styles.blur2}>
          <Blur green />
        </div>
        <TrendingQuests trendingQuests={trendingQuests} />
        <HowToParticipate />
      </div>
    </div>
  );
};

export default Quests;
