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

const QuestPage: NextPage = () => {
  const router = useRouter();
  const { questPage: questId } = router.query;
  const { address } = useAccount();
  const { contract } = useQuestsNFTContract();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [eligibleRewards, setEligibaleRewards] = useState<EligibleReward[]>([]);
  const [tasksCalldata, setTasksCalldata] = useState<string[][]>();
  const [mintCalldata, setMintCalldata] = useState<Call[]>();
  const [disableRewards, setDisableRewards] = useState<boolean>(false);

  // get Tasks from DB
  useEffect(() => {
    if (questId && address) {
      fetch(`/api/get_tasks?quest_id=${questId}`)
        .then((response) => response.json())
        .then((data) => {
          setTasks(data);
        });

      // fetch(
      //   `/api/get_completed_tasks?quest_id=${questId}&user_addr=${hexToDecimal(
      //     address
      //   )}`
      // )
      //   .then((response) => response.json())
      //   .then((data) => {});
    }
  }, [questId, address]);

  const { data, error } = useStarknetCall({
    contract,
    method: "get_tasks_status",
    args: [tasksCalldata],
  });

  // build get_tasks_status calldata
  useEffect(() => {
    if (address) {
      // todo : query `get_eligible_rewards(quest, user_addr)` & map results to build calldata
      // fake data for now
      const rewardsData = [
        {
          task_id: 1,
          nft_contract:
            "0x39282ab844802d29d4d8b93f09be70c0c46304c36b036850a12f0d0a91a281a",
          token_id: "1287398872",
          sig: ["1", "2"],
        },
      ];
      setEligibaleRewards(rewardsData);

      let calldata: string[][] = [];
      rewardsData.map((reward: EligibleReward) => {
        calldata.push([
          questId as string,
          reward.task_id.toString(),
          hexToDecimal(address),
        ]);
      });
      console.log("tasks calldata", calldata);
      setTasksCalldata(calldata);
    }
  }, [address]);

  const { execute: executeMint, data: mintData } = useStarknetExecute({
    calls: mintCalldata,
  });

  // build multicall for minting rewards
  useEffect(() => {
    if (error || !data) {
      console.log("error", error);
      setDisableRewards(true);
    } else {
      console.log("data received", data);

      setDisableRewards(false);
      const contractAddress = process.env.NEXT_PUBLIC_IS_TESTNET
        ? (process.env.NEXT_PUBLIC_QUESTS_CONTRACT_TESTNET as string)
        : (process.env.NEXT_PUBLIC_QUESTS_CONTRACT_MAINNET as string);

      let calldata: Call[] = [];
      eligibleRewards.map((reward: EligibleReward, index: number) => {
        if (Number(data?.["status"][index]) === 0) {
          calldata.push({
            contractAddress,
            entrypoint: "mint",
            calldata: [
              reward.token_id,
              questId,
              reward.task_id.toString(),
              reward.sig[0],
              reward.sig[1],
            ],
          });
        }
      });
      console.log("minting calldata", calldata);
      setMintCalldata(calldata);
    }
  }, [data, error]);

  const mintNft = () => {
    executeMint();
  };

  return (
    <div className={homeStyles.screen}>
      <div className={styles.imageContainer}>
        <NftDisplay
          issuer={{
            name: "StarkFighter",
            logoFavicon: "/starkfighter/favicon.ico",
          }}
          nfts={[
            { imgSrc: "/starkfighter/level1.webp", level: 1 },
            { imgSrc: "/starkfighter/level2.webp", level: 2 },
            { imgSrc: "/starkfighter/level3.webp", level: 3 },
          ]}
        />
      </div>
      <div className={styles.descriptionContainer}>
        <h1 className="title mt-5 mw-90">Become a StarkFighter OG</h1>
        <p className="text-center max-w-lg">
          Mint NFTs based on your score in the StarkFighter game.
        </p>
      </div>
      <div className={styles.taskContainer}>
        <Task
          name="Register a stark name"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus blandit ultricies augue, eget tempor magna pharetra sit amet. Integer nec felis vel velit convallis feugiat. Sed sagittis, nibh sed iaculis accumsan, enim ex consectetur lectus, ut posuere metus odio non risus. Proin aliquet sagittis ultrices."
          href="https://app.starknet.id/"
          cta="Register my stark name"
          verifyEndpoint={`/api/quests/starknetid/verifyHasDomain?address=${address}`}
        />
        <Task
          name="Play to StarkFighter (level 1)"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus blandit ultricies augue, eget tempor magna pharetra sit amet. Integer nec felis vel velit convallis feugiat. Sed sagittis, nibh sed iaculis accumsan, enim ex consectetur lectus, ut posuere metus odio non risus. Proin aliquet sagittis ultrices."
          href="https://starkfighter.xyz"
          cta="Play to starkfighter"
          verifyEndpoint={`/api/quests/starkfighter/verifyHasPlayed?address=${address}`}
        />
        <Task
          name="Get a score of 50s or more (level 2)"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus blandit ultricies augue, eget tempor magna pharetra sit amet. Integer nec felis vel velit convallis feugiat. Sed sagittis, nibh sed iaculis accumsan, enim ex consectetur lectus, ut posuere metus odio non risus. Proin aliquet sagittis ultrices."
          href="https://starkfighter.xyz"
          cta="Play to starkfighter"
          verifyEndpoint={`/api/quests/starkfighter/verifyHasScoreGreaterThan50?address=${address}`}
        />
        <Task
          name="Get a score of 100s or more (level 3)"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus blandit ultricies augue, eget tempor magna pharetra sit amet. Integer nec felis vel velit convallis feugiat. Sed sagittis, nibh sed iaculis accumsan, enim ex consectetur lectus, ut posuere metus odio non risus. Proin aliquet sagittis ultrices."
          href="https://starkfighter.xyz"
          cta="Play to starkfighter"
          verifyEndpoint={`/api/quests/starkfighter/verifyHasScoreGreaterThan100?address=${address}`}
        />
        <Reward
          reward="3 NFTs"
          imgSrc="/starkfighter/favicon.ico"
          onClick={() => mintNft()}
          disabled={disableRewards}
        />
      </div>
    </div>
  );
};

export default QuestPage;
