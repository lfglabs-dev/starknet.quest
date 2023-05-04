import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import homeStyles from "../../styles/Home.module.css";
import styles from "../../styles/quests.module.css";
import NftDisplay from "../../components/quests/nftDisplay";
import Task from "../../components/quests/task";
import Reward from "../../components/quests/reward";
import { useQuestsNFTContract } from "../../hooks/contracts";
import {
  Call,
  useAccount,
  useStarknetCall,
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

const QuestPage: NextPage = () => {
  const router = useRouter();
  const { questPage: questId } = router.query;

  const { address } = useAccount();
  const [quest, setQuest] = useState<QuestDocument>({
    id: 0,
    name: "loading",
    desc: "loading",
    issuer: "loading",
    category: "loading",
    logo: "",
    rewards_img: "",
    rewards_title: "loading",
    rewards_nfts: [],
  });
  const { contract } = useQuestsNFTContract();
  const [tasks, setTasks] = useState<TaskDocument[]>([]);
  const [eligibleRewards, setEligibleRewards] = useState<EligibleReward[]>([]);
  const [tasksCalldata, setTasksCalldata] = useState<string[][]>();
  const [mintCalldata, setMintCalldata] = useState<Call[]>();
  const [disableRewards, setDisableRewards] = useState<boolean>(false);

  useEffect(() => {
    fetch(`/api/get_quest?id=${questId}`)
      .then((response) => response.json())
      .then((data: QuestDocument | QueryError) => {
        if ((data as QuestDocument).name) {
          setQuest(data as QuestDocument);
        }
      });
  }, [questId]);

  const { data, error } = useStarknetCall({
    contract,
    method: "get_tasks_status",
    args: [tasksCalldata],
  });

  // get Tasks from db
  useEffect(() => {
    if (questId && address) {
      fetch(`/api/get_tasks?quest_id=${questId}`)
        .then((response) => response.json())
        .then((data: TaskDocument[] | QueryError) => {
          if ((data as TaskDocument[]).length) setTasks(data as TaskDocument[]);
          console.log(data);
        });
    }
  }, [questId, address]);

  // build get_tasks_status calldata
  useEffect(() => {
    const calldata: string[][] = [];
    tasks.forEach((task) => {
      calldata.push([
        questId as string,
        task.id.toString(),
        hexToDecimal(address),
      ]);
    });
    setTasksCalldata(calldata);
  }, [tasks]);

  // fetch claimable rewards
  useEffect(() => {
    if (address) {
      fetch(`/api/quests/starkfighter/claimable?addr=${hexToDecimal(address)}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.error || !data.rewards) {
            setDisableRewards(true);
          } else {
            setEligibleRewards(data.rewards);
          }
        });
    }
  }, [address]);

  const { execute: executeMint, data: mintData } = useStarknetExecute({
    calls: mintCalldata,
  });

  // build multicall for minting rewards
  useEffect(() => {
    if (error || !data) {
      setDisableRewards(true);
    } else {
      setDisableRewards(false);
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

  const mintNft = () => {
    executeMint();
  };

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
          onClick={() => mintNft()}
          disabled={disableRewards}
        />
      </div>
    </div>
  );
};

export default QuestPage;
