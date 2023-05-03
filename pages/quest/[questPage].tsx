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
  const [eligibleRewards, setEligibaleRewards] = useState<EligibleReward[]>([]);
  const [tasksCalldata, setTasksCalldata] = useState<string[][]>();
  const [mintCalldata, setMintCalldata] = useState<Call>();

  const { data, error } = useStarknetCall({
    contract,
    method: "get_tasks_status",
    args: [tasksCalldata],
  });

  // build get_tasks_status calldata
  useEffect(() => {
    if (address) {
      // todo : query `get_eligible_rewards(quest, user_addr)` & map results to build calldata
      // returns: { task_id : 1, nft_contract: "123", token_id : "1287398872", sig: [ x, y ] }
      // setEligibaleRewards
      let calldata = [];
      for (let i = 1; i <= 4; i++)
        calldata.push([questId as string, i.toString(), hexToDecimal(address)]);
      console.log("calldata", calldata);
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
    } else {
      console.log("data received", data);
      let calldata = [];
      eligibleRewards.map((reward: EligibleReward, index: number) => {
        if (Number(data?.["status"][index]) === 0) {
          console.log("eligible");
          // calldata.push
        }
      });
      console.log("test", Number(data?.["status"][0]));
      // {
      //   contractAddress: process.env.NEXT_PUBLIC_IS_TESTNET ? process.env.NEXT_PUBLIC_QUESTS_CONTRACT_TESTNET as string : process.env.NEXT_PUBLIC_QUESTS_CONTRACT_MAINNET as string,
      //   entrypoint: "mint",
      //   calldata: [tokenId: Uint256, quest_id, task_id, sig: (felt, felt)],
      // },
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
        />
      </div>
    </div>
  );
};

export default QuestPage;
