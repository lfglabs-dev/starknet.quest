import React, {
  ReactNode,
  useEffect,
  useState,
  FunctionComponent,
  useContext,
} from "react";
import styles from "../../styles/quests.module.css";
import Task from "./task";
import Reward from "./reward";
import quests_nft_abi from "../../abi/quests_nft_abi.json";
import { useAccount, useProvider } from "@starknet-react/core";
import { hexToDecimal } from "../../utils/feltService";
import {
  NFTItem,
  QueryError,
  QuestDocument,
  UserTask,
} from "../../types/backTypes";
import { Call, Contract } from "starknet";
import { Skeleton } from "@mui/material";
import TasksSkeleton from "../skeletons/tasksSkeleton";
import { generateCodeChallenge } from "../../utils/codeChallenge";
import Timer from "./timer";
import NftImage from "./nftImage";
import { splitByNftContract } from "../../utils/rewards";
import { StarknetIdJsContext } from "../../context/StarknetIdJsProvider";
import { getCompletedQuestsOfUser } from "../../services/apiService";

type QuestDetailsProps = {
  quest: QuestDocument;
  taskId?: string;
  res?: string;
  errorMsg?: string;
  setShowDomainPopup: (show: boolean) => void;
  hasRootDomain: boolean;
  hasNftReward?: boolean;
};

const QuestDetails: FunctionComponent<QuestDetailsProps> = ({
  quest,
  taskId,
  res,
  errorMsg,
  setShowDomainPopup,
  hasRootDomain,
  hasNftReward,
}) => {
  const { address } = useAccount();
  const { provider } = useProvider();
  const [tasks, setTasks] = useState<UserTask[]>([]);
  const [rewardsEnabled, setRewardsEnabled] = useState<boolean>(false);
  const { starknetIdNavigator } = useContext(StarknetIdJsContext);
  const [eligibleRewards, setEligibleRewards] = useState<
    Record<string, EligibleReward[]>
  >({});
  const [unclaimedRewards, setUnclaimedRewards] = useState<
    EligibleReward[] | undefined
  >();
  const [mintCalldata, setMintCalldata] = useState<Call[]>();
  const [taskError, setTaskError] = useState<TaskError>();
  const [showQuiz, setShowQuiz] = useState<ReactNode>();

  const questId = quest.id.toString();
  const [participants, setParticipants] = useState({
    count: 0,
    firstParticipants: [] as string[],
  });

  // This fetches the number of participants in the quest and up to 3 of their starknet ids
  useEffect(() => {
    if (questId && starknetIdNavigator) {
      fetch(
        `${process.env.NEXT_PUBLIC_API_LINK}/get_quest_participants?quest_id=${questId}`,
        {
          method: "GET",
        }
      )
        .then((response) => response.json())
        .then(async (data) => {
          setParticipants(data);
          const addrs = data.firstParticipants;
          const identities = addrs.map(async (addr: string) => {
            const domain = await starknetIdNavigator
              ?.getStarkName(addr)
              .catch(console.error);
            return domain
              ? await starknetIdNavigator
                  ?.getStarknetId(domain)
                  .catch(console.error)
              : 0;
          });
          const identitiesResolved = await Promise.all(identities);
          setParticipants({
            count: data.count,
            firstParticipants: identitiesResolved,
          });
        });
    }
  }, [questId, starknetIdNavigator]);

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
      fetch(
        `${process.env.NEXT_PUBLIC_API_LINK}/${
          quest.rewards_endpoint
        }?addr=${hexToDecimal(address)}`
      )
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
      if (hasNftReward === false) return;
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
          const status = (response as any)["status"];

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

  const checkUserRewards = async () => {
    if (!address) return;
    const res = await getCompletedQuestsOfUser(address);
    if (res.includes(questId) && !hasNftReward) {
      setRewardsEnabled(true);
    }
  };

  useEffect(() => {
    checkUserRewards();
  }, [address]);

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
    console.log({ to_claim });
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
        redirect_uri: `${process.env.NEXT_PUBLIC_API_LINK}/${task.verify_endpoint}`,
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

  return (
    <>
      <NftImage
        nfts={quest.rewards_nfts.map((nft: NFTItem) => {
          return { imgSrc: nft.img, level: nft.level };
        })}
      />

      <div className={styles.descriptionContainer}>
        {quest.name === "loading" ? (
          <Skeleton
            variant="text"
            width={400}
            sx={{ fontSize: "2rem", bgcolor: "grey.900" }}
          />
        ) : (
          <h1 className="title extrabold mt-5 mw-90">{quest.name}</h1>
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
      {quest?.expiry_timestamp && quest?.expiry_timestamp !== "loading" ? (
        <Timer expiry={Number(quest?.expiry_timestamp)} fixed={false} />
      ) : null}
      <div className={styles.taskContainer}>
        {tasks.length === 0 || quest.rewards_title === "loading" ? (
          <TasksSkeleton />
        ) : (
          <>
            <div className={styles.questStats}>
              <p>{tasks.length} steps</p>
              <div className="ml-auto flex">
                <div className={styles.participantAvatars}>
                  {participants.firstParticipants.map((participant, index) => (
                    <img
                      src={`${process.env.NEXT_PUBLIC_STARKNET_ID_LINK}/api/identicons/${participant}`}
                      alt="user icons"
                      width="24"
                      key={index}
                    />
                  ))}
                </div>
                <p>{participants.count || 0} participants</p>
              </div>
            </div>
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
                    task.verify_endpoint_type === "default"
                      ? `${task.verify_endpoint}?addr=${hexToDecimal(address)}`
                      : task.verify_endpoint_type === "quiz"
                      ? task.verify_endpoint
                      : generateOAuthUrl(task)
                  }
                  verifyEndpointType={task.verify_endpoint_type ?? "default"}
                  refreshRewards={() => refreshRewards(quest, address)}
                  wasVerified={task.completed}
                  hasError={Boolean(taskError && taskError.taskId === task.id)}
                  verifyError={
                    taskError && taskError.taskId === task.id
                      ? taskError.error
                      : ""
                  }
                  setShowQuiz={setShowQuiz}
                  quizName={task.quiz_name || undefined}
                  issuer={{
                    name: quest.issuer,
                    logoFavicon: quest.logo,
                  }}
                  hasRootDomain={hasRootDomain}
                  setShowDomainPopup={setShowDomainPopup}
                />
              );
            })}
            <Reward
              quest={quest}
              hasNftReward={hasNftReward}
              reward={quest.rewards_title}
              imgSrc={quest.rewards_img}
              onClick={() => {
                setRewardsEnabled(false);
              }}
              disabled={!rewardsEnabled}
              mintCalldata={mintCalldata}
              questName={quest.name}
            />
          </>
        )}
      </div>
      {showQuiz}
    </>
  );
};

export default QuestDetails;
