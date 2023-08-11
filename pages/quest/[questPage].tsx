import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import homeStyles from "../../styles/Home.module.css";
import styles from "../../styles/quests.module.css";
import NftDisplay from "../../components/quests/nftDisplay";
import Task from "../../components/quests/task";
import Reward from "../../components/quests/reward";
import quests_nft_abi from "../../abi/quests_nft_abi.json";
import { useAccount, useProvider } from "@starknet-react/core";
import { useRouter } from "next/router";
import { hexToDecimal } from "../../utils/feltService";
import {
  NFTItem,
  QueryError,
  QuestDocument,
  UserTask,
} from "../../types/backTypes";
import { Call, Contract } from "starknet";
import { Skeleton } from "@mui/material";
import TasksSkeleton from "../../components/skeletons/tasksSkeleton";
import RewardSkeleton from "../../components/skeletons/rewardSkeleton";
import { generateCodeChallenge } from "../../utils/codeChallenge";
import ErrorScreen from "../../components/UI/screens/errorScreen";
import Timer from "../../components/quests/timer";

const splitByNftContract = (
  rewards: EligibleReward[]
): Record<string, EligibleReward[]> => {
  return rewards.reduce(
    (acc: Record<string, EligibleReward[]>, reward: EligibleReward) => {
      if (!acc[reward.nft_contract]) {
        acc[reward.nft_contract] = [];
      }

      acc[reward.nft_contract].push(reward);
      return acc;
    },
    {}
  );
};

const QuestPage: NextPage = () => {
  const router = useRouter();
  const {
    questPage: questId,
    task_id: taskId,
    res,
    error_msg: errorMsg,
  } = router.query;
  const { address } = useAccount();
  const { provider } = useProvider();
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
    img_card: "",
    title_card: "",
    hidden: false,
    disabled: false,
    expiry: { $date: { $numberLong: "0" } },
  });
  const [tasks, setTasks] = useState<UserTask[]>([]);
  const [rewardsEnabled, setRewardsEnabled] = useState<boolean>(false);
  const [eligibleRewards, setEligibleRewards] = useState<
    Record<string, EligibleReward[]>
  >({});
  const [unclaimedRewards, setUnclaimedRewards] = useState<
    EligibleReward[] | undefined
  >();
  const [mintCalldata, setMintCalldata] = useState<Call[]>();
  const [taskError, setTaskError] = useState<TaskError>();
  const [errorPageDisplay, setErrorPageDisplay] = useState(false);

  // this fetches quest data
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_LINK}/get_quest?id=${questId}`)
      .then((response) => response.json())
      .then((data: QuestDocument | QueryError) => {
        if ((data as QuestDocument).name) {
          setQuest(data as QuestDocument);
        }
      })
      .catch((err) => {
        if (questId) {
          console.log(err);
          setErrorPageDisplay(true);
        }
      });
  }, [questId]);

  // this fetches all tasks of this quest from db
  useEffect(() => {
    if (questId) {
      // If a call was made with an address in the first second, the call with 0 address should be cancelled
      let shouldFetchWithZeroAddress = true;

      // Set a 1-second timer to allow time for address loading
      const timer = setTimeout(() => {
        // If address isn't loaded after 1 second, make the API call with the zero address
        if (shouldFetchWithZeroAddress) {
          fetch(
            `${process.env.NEXT_PUBLIC_API_LINK}/get_tasks?quest_id=${questId}&addr=0`
          )
            .then((response) => response.json())
            .then((data: UserTask[] | QueryError) => {
              if ((data as UserTask[]).length) setTasks(data as UserTask[]);
            });
        }
      }, 1000);

      // If the address is loaded before the 1-second timer, make the API call with the loaded address
      if (address) {
        shouldFetchWithZeroAddress = false;
        clearTimeout(timer);
        fetch(
          `${
            process.env.NEXT_PUBLIC_API_LINK
          }/get_tasks?quest_id=${questId}&addr=${hexToDecimal(address)}`
        )
          .then((response) => response.json())
          .then((data: UserTask[] | QueryError) => {
            if ((data as UserTask[]).length) setTasks(data as UserTask[]);
          });
      }

      // Clear the timer when component unmounts or dependencies change to prevent memory leaks
      return () => {
        clearTimeout(timer);
      };
    }
  }, [questId, address]);

  const refreshRewards = (
    quest: QuestDocument,
    address: string | undefined
  ) => {
    if (address && quest.rewards_endpoint) {
      fetch(`${quest.rewards_endpoint}?addr=${hexToDecimal(address)}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.rewards) {
            setEligibleRewards(splitByNftContract(data.rewards));
          }
        });
    }
  };

  // this fetches all rewards claimable by the user
  useEffect(() => {
    refreshRewards(quest, address);
  }, [quest, address]);

  // this filters the claimable rewards to find only the unclaimed ones (on chain)
  useEffect(() => {
    (async () => {
      let unclaimed: EligibleReward[] = [];
      for (const contractAddr in eligibleRewards) {
        const perContractRewards = eligibleRewards[contractAddr];
        const calldata = [];
        for (const reward of perContractRewards) {
          calldata.push({
            quest_id: questId as string,
            task_id: reward.task_id.toString(),
            user_addr: address as string,
          });
        }
        const contract = new Contract(quests_nft_abi, contractAddr, provider);

        const response = await contract.call("get_tasks_status", [calldata]);
        if (
          typeof response === "object" &&
          response !== null &&
          !Array.isArray(response)
        ) {
          const status = response["status"];

          if (Array.isArray(status)) {
            const result = status.map((x: any) => {
              if (typeof x === "bigint") {
                return Number(x);
              }
            });
            const unclaimedPerContractRewards = perContractRewards.filter(
              (_, index) => result[index] === 0
            );
            unclaimed = unclaimed.concat(unclaimedPerContractRewards);
          }
        }
      }
      setUnclaimedRewards(unclaimed);
    })();
  }, [questId, eligibleRewards]);

  // this builds multicall for minting rewards
  useEffect(() => {
    const calldata: Call[] = [];

    // if the sequencer query failed, let's consider the eligible as unclaimed
    const to_claim =
      unclaimedRewards === undefined
        ? ([] as EligibleReward[]).concat(...Object.values(eligibleRewards))
        : unclaimedRewards;

    to_claim.forEach((reward) => {
      calldata.push({
        contractAddress: reward.nft_contract,
        entrypoint: "mint",
        calldata: [
          reward.token_id,
          0,
          questId as string,
          reward.task_id,
          reward.sig[0],
          reward.sig[1],
        ],
      });
    });

    if (to_claim?.length > 0) {
      setRewardsEnabled(true);
    } else setRewardsEnabled(false);
    setMintCalldata(calldata);
  }, [questId, unclaimedRewards, eligibleRewards]);

  useEffect(() => {
    if (!taskId || res === "true") return;
    if (taskId && res === "false") {
      setTaskError({
        taskId: parseInt(taskId.toString()),
        res: false,
        error: errorMsg?.toString(),
      });
    }
  }, [taskId, res, errorMsg]);

  const generateOAuthUrl = (task: UserTask): string => {
    if (task.verify_endpoint_type === "oauth_discord") {
      const rootUrl = "https://discord.com/api/oauth2/authorize";
      const options = {
        redirect_uri: `${task.verify_endpoint}`,
        client_id: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID as string,
        response_type: "code",
        scope: ["identify", "guilds"].join(" "),
        state: hexToDecimal(address),
      };
      const qs = new URLSearchParams(options).toString();
      return `${rootUrl}?${qs}`;
    } else {
      const codeChallenge = generateCodeChallenge(
        process.env.NEXT_PUBLIC_TWITTER_CODE_VERIFIER as string
      );
      const rootUrl = "https://twitter.com/i/oauth2/authorize";
      const options = {
        redirect_uri: `${task.verify_endpoint}?addr=${hexToDecimal(address)}`,
        client_id: process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID as string,
        state: "state",
        response_type: "code",
        code_challenge: codeChallenge,
        code_challenge_method: "S256",
        scope: ["follows.read", "tweet.read", "users.read"].join(" "),
      };
      const qs = new URLSearchParams(options).toString();
      return `${rootUrl}?${qs}`;
    }
  };

  return errorPageDisplay ? (
    <ErrorScreen
      errorMessage="This quest doesn't exist !"
      buttonText="Go back to quests"
      onClick={() => router.push("/")}
    />
  ) : (
    <div className={homeStyles.screen}>
      <div className={styles.imageContainer}>
        {quest.issuer === "loading" ? (
          <RewardSkeleton />
        ) : (
          <NftDisplay
            issuer={{
              name: quest.issuer,
              logoFavicon: quest.logo,
            }}
            nfts={quest.rewards_nfts.map((nft: NFTItem) => {
              return { imgSrc: nft.img, level: nft.level };
            })}
          />
        )}
      </div>
      <div className={styles.descriptionContainer}>
        {quest.name === "loading" ? (
          <Skeleton
            variant="text"
            width={400}
            sx={{ fontSize: "2rem", bgcolor: "grey.900" }}
          />
        ) : (
          <h1 className="title mt-5 mw-90">{quest.name}</h1>
        )}
        {quest.desc === "loading" ? (
          <Skeleton
            variant="text"
            width={350}
            sx={{ fontSize: "0.8rem", bgcolor: "grey.900" }}
          />
        ) : (
          <p className="text-center max-w-lg">{quest.desc}</p>
        )}
      </div>
      {quest?.expiry ? (
        <Timer expiry={Number(quest?.expiry.$date.$numberLong)} fixed={false} />
      ) : null}
      <div className={styles.taskContainer}>
        {tasks.length === 0 || quest.rewards_title === "loading" ? (
          <TasksSkeleton />
        ) : (
          <>
            {tasks.map((task) => {
              return (
                <Task
                  key={task.id}
                  name={task.name}
                  description={task.desc}
                  href={task.href}
                  cta={task.cta}
                  verifyRedirect={task.verify_redirect}
                  verifyEndpoint={
                    task.verify_endpoint_type &&
                    task.verify_endpoint_type == "default"
                      ? `${task.verify_endpoint}?addr=${hexToDecimal(address)}`
                      : generateOAuthUrl(task)
                  }
                  verifyEndpointType={`${
                    task.verify_endpoint_type ?? "default"
                  }`}
                  refreshRewards={() => refreshRewards(quest, address)}
                  wasVerified={task.completed}
                  hasError={
                    taskError && taskError.taskId === task.id ? true : false
                  }
                  verifyError={
                    taskError && taskError.taskId === task.id
                      ? taskError.error
                      : ""
                  }
                />
              );
            })}
            <Reward
              reward={quest.rewards_title}
              imgSrc={quest.rewards_img}
              onClick={() => {
                setRewardsEnabled(false);
              }}
              disabled={!rewardsEnabled}
              mintCalldata={mintCalldata}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default QuestPage;
