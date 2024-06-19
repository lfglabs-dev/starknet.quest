"use client";

import React, {
  ReactNode,
  useEffect,
  useState,
  FunctionComponent,
  useCallback,
} from "react";
import styles from "@styles/quests.module.css";
import { useAccount } from "@starknet-react/core";
import { hexToDecimal } from "@utils/feltService";
import { NFTItem, QuestDocument, UserTask } from "types/backTypes";
import { Skeleton } from "@mui/material";
import TasksSkeleton from "@components/skeletons/tasksSkeleton";
import { generateCodeChallenge } from "@utils/codeChallenge";
import Timer from "@components/quests/timer";
import NftImage from "@components/quests/nftImage";
import Task from "@components/quests/task";
import Reward from "@components/quests/reward";
import { AdminService } from "@services/authService";
import { useNotification } from "@context/NotificationProvider";

type QuestDetailsProps = {
  quest: QuestDocument;
  taskId?: string;
  res?: string;
  errorMsg?: string;
  setShowDomainPopup: (show: boolean) => void;
  hasRootDomain: boolean;
  hasNftReward?: boolean;
  rewardButtonTitle?: string;
  onRewardButtonClick?: () => void;
  overrideDisabledState?: boolean;
};

const AdminQuestDetails: FunctionComponent<QuestDetailsProps> = ({
  quest,
  setShowDomainPopup,
  hasRootDomain,
  hasNftReward,
  rewardButtonTitle,
  onRewardButtonClick,
}) => {
  const { address } = useAccount();
  const [tasks, setTasks] = useState<UserTask[]>([]);
  const [showQuiz, setShowQuiz] = useState<ReactNode>();
  const [customError, setCustomError] = useState<string>("");
  const { showNotification } = useNotification();
  const questId = quest?.id?.toString();

  // this fetches all tasks of this quest from db
  useEffect(() => {
    if (!questId) return;

    AdminService.getTasksByQuestId(parseInt(questId)).then((data) => {
      if ((data as UserTask[]).length) setTasks(data as UserTask[]);
    });
  }, [questId]);

  const generateOAuthUrl = useCallback(
    (task: UserTask): string => {
      if (task.verify_endpoint_type === "oauth_discord") {
        const rootUrl = "https://discord.com/api/oauth2/authorize";
        const options = {
          redirect_uri: `${process.env.NEXT_PUBLIC_API_LINK}/${task.verify_endpoint}`,
          client_id: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID as string,
          response_type: "code",
          scope: ["identify", "guilds"].join(" "),
          state: `${hexToDecimal(address)}+${task.quest_id}+${task.id}`,
        };
        const qs = new URLSearchParams(options).toString();
        return `${rootUrl}?${qs}`;
      }
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
    },
    [showNotification, address]
  );

  useEffect(() => {
    // get `error_msg` from url
    if (typeof window !== "undefined") {
      const url = window.location;
      // Your client-side code that uses window goes here
      const urlParams = new URLSearchParams(url.search);
      const error_msg = urlParams.get("error_msg");
      if (error_msg) {
        setCustomError(error_msg);
      }
    }
  }, []);

  return (
    <>
      <NftImage
        nfts={quest?.rewards_nfts?.map((nft: NFTItem) => {
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
          <>
            <p className="text-center max-w-[50vw]">{quest.desc}</p>
            {quest?.additional_desc ? (
              <>
                <p className="text-center max-w-[50vw]">
                  {quest.additional_desc}
                </p>
              </>
            ) : null}
          </>
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
            </div>
            {tasks.map((task) => {
              return (
                <Task
                  key={task.id}
                  name={task.name}
                  customError={
                    task.name.includes("Discord" || "discord")
                      ? customError
                      : ""
                  }
                  description={task.desc}
                  href={task.href}
                  cta={task.cta}
                  verifyRedirect={task.verify_redirect}
                  verifyEndpoint={
                    task?.verify_endpoint_type?.startsWith("default")
                      ? `${task.verify_endpoint}?addr=${hexToDecimal(address)}`
                      : task.verify_endpoint_type === "quiz"
                      ? task.verify_endpoint
                      : generateOAuthUrl(task)
                  }
                  verifyEndpointType={task.verify_endpoint_type ?? "default"}
                  wasVerified={task.completed}
                  expired={quest.expired}
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
              buttonText={rewardButtonTitle}
              overrideRewardClick={async () =>
                onRewardButtonClick ? await onRewardButtonClick() : null
              }
              quest={quest}
              hasNftReward={hasNftReward}
              reward={quest.rewards_title}
              imgSrc={quest.rewards_img}
              questName={quest.name}
              disabled={false}
              claimed={false}
              mintCalldata={undefined}
              // eslint-disable-next-line @typescript-eslint/no-empty-function
              onClick={() => {}}
            />
          </>
        )}
      </div>
      {showQuiz}
    </>
  );
};

export default AdminQuestDetails;
