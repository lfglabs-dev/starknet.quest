import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import homeStyles from "../../styles/Home.module.css";
import styles from "../../styles/quests.module.css";
import NftDisplay from "../../components/quests/nftDisplay";
import Task from "../../components/quests/task";
import Reward from "../../components/quests/reward";
import quests_nft_abi from "../../abi/quests_nft_abi.json";

import {
  Call,
  useAccount,
  useStarknet,
  useStarknetExecute,
} from "@starknet-react/core";
import { useRouter } from "next/router";
import { hexToDecimal } from "../../utils/feltService";
import {
  NFTItem,
  QueryError,
  QuestDocument,
  TaskDocument,
} from "../../types/backTypes";
import { Contract } from "starknet";

const splitByNftContract = (rewards: EligibleReward[]): Record<string, EligibleReward[]> => {
  return rewards.reduce((acc: Record<string, EligibleReward[]>, reward: EligibleReward) => {
    if (!acc[reward.nft_contract]) {
      acc[reward.nft_contract] = [];
    }

    acc[reward.nft_contract].push(reward);
    return acc;
  }, {});
};

const QuestPage: NextPage = () => {
  const router = useRouter();
  const { questPage: questId } = router.query;

  const { address } = useAccount();
  const { library } = useStarknet();

  const [quest, setQuest] = useState<QuestDocument>({
    id: 0,
    name: "loading",
    desc: "loading",
    issuer: "loading",
    category: "loading",
    rewards_endpoint: "",
    logo: "",
    rewards_img: "",
    rewards_title: "loading",
    rewards_nfts: [],
  });
  const [tasks, setTasks] = useState<TaskDocument[]>([]);
  const [rewardsEnabled, setRewardsEnabled] = useState<boolean>(false);
  const [eligibleRewards, setEligibleRewards] = useState<Record<string, EligibleReward[]>>({});
  const [unclaimedRewards, setUnclaimedRewards] = useState<string[][]>();
  const [mintCalldata, setMintCalldata] = useState<Call[]>();
  const { execute: executeMint } = useStarknetExecute({
    calls: mintCalldata,
  });


  useEffect(() => {
    fetch(`/api/get_quest?id=${questId}`)
      .then((response) => response.json())
      .then((data: QuestDocument | QueryError) => {
        if ((data as QuestDocument).name) {
          setQuest(data as QuestDocument);
        }
      });
  }, [questId]);

  // get Tasks from db
  useEffect(() => {
    if (questId && address) {
      fetch(`/api/get_tasks?quest_id=${questId}`)
        .then((response) => response.json())
        .then((data: TaskDocument[] | QueryError) => {
          if ((data as TaskDocument[]).length) setTasks(data as TaskDocument[]);
          //console.log(data);
        });
    }
  }, [questId, address]);

  // fetch claimable rewards
  useEffect(() => {
    if (address && quest.rewards_endpoint) {
      fetch(`${quest.rewards_endpoint}?addr=${hexToDecimal(address)}`)
        .then((response) => response.json())
        .then(data => {
          if (!data.rewards) {
            setRewardsEnabled(false);
          } else {
            setRewardsEnabled(true);
            setEligibleRewards(splitByNftContract(data.rewards));
          }
        });
    }
  }, [quest, address]);

  useEffect(() => {
    for (const contractAddr in eligibleRewards) {
      const perContractRewards = eligibleRewards[contractAddr];
      const calldata = [perContractRewards.length.toString()];
      for (const reward of perContractRewards) {
        calldata.push(questId as string, reward.task_id.toString(), address as string);
      }

      const contract = new Contract(quests_nft_abi, contractAddr, library);

      (async () => {
        const result = await contract.call("get_tasks_status", [0]);

        console.log("result:", result)
      })()

    }
  }, [eligibleRewards])


  /*
    // build multicall for minting rewards
    useEffect(() => {
      if (error || !data) {
        setRewardsEnabled(false);
      } else {
        setRewardsEnabled(true);
        const contractAddress = process.env.NEXT_PUBLIC_IS_TESTNET
          ? (process.env.NEXT_PUBLIC_QUESTS_CONTRACT_TESTNET as string)
          : (process.env.NEXT_PUBLIC_QUESTS_CONTRACT_MAINNET as string);
  
        const calldata: Call[] = [];
        eligibleRewards.map((reward: EligibleReward, index: number) => {
          if (Number(data?.["status"][index]) === 0) {
            calldata.push({
              contractAddress,
              entrypoint: "mint",
              calldata: [
                reward.token_id,
                0,
                questId?.toString(),
                reward.task_id,
                reward.sig[0],
                reward.sig[1],
              ],
            });
          }
        });
        console.log("calldata:", calldata);
        setMintCalldata(calldata);
      }
    }, [data, error, eligibleRewards, questId]);
  */

  return (
    <div className={homeStyles.screen}>
      <div className={styles.imageContainer}>
        <NftDisplay
          issuer={{
            name: quest.issuer,
            logoFavicon: quest.logo,
          }}
          nfts={quest.rewards_nfts.map((nft: NFTItem) => {
            return { imgSrc: nft.img, level: nft.level };
          })}
        />
      </div>
      <div className={styles.descriptionContainer}>
        <h1 className="title mt-5 mw-90">{quest.name}</h1>
        <p className="text-center max-w-lg">{quest.desc}</p>
      </div>
      <div className={styles.taskContainer}>
        {tasks.map((task) => (
          <Task
            name={task.name}
            description={task.desc}
            href={task.href}
            cta={task.cta}
            verifyEndpoint={`${task.verify_endpoint}?address=${address}`}
          />
        ))}
        <Reward
          reward={quest.rewards_title}
          imgSrc={quest.rewards_img}
          onClick={executeMint}
          disabled={!rewardsEnabled}
        />
      </div>
    </div>
  );
};

export default QuestPage;
