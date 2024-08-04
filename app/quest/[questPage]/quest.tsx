"use client";

import QuestDetails from "@components/quests/questDetails";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import homeStyles from "@styles/Home.module.css";
import styles from "@styles/quests.module.css";
import { useRouter } from "next/navigation";
import { QuestDocument } from "../../../types/backTypes";
import RewardSkeleton from "@components/skeletons/rewardSkeleton";
import ErrorScreen from "@components/UI/screens/errorScreen";
import BackButton from "@components/UI/backButton";
import useHasRootDomain from "@hooks/useHasRootDomain";
import { useAccount } from "@starknet-react/core";
import { starknetIdAppLink } from "@utils/links";
import BannerPopup from "@components/UI/menus/bannerPopup";
import { useDomainFromAddress } from "@hooks/naming";
import { QuestDefault } from "@constants/common";
import { updateUniqueVisitors, getQuestById } from "@services/apiService";
import QuestTag from "@components/UI/questTag";

type QuestPageProps = {
  questId: string;
  taskId?: string;
  res?: string;
  errorMsg?: string;
};

const Quest: FunctionComponent<QuestPageProps> = ({
  questId,
  taskId,
  res,
  errorMsg,
}) => {
  const router = useRouter();
  const [quest, setQuest] = useState<QuestDocument>(QuestDefault);
  const [errorPageDisplay, setErrorPageDisplay] = useState(false);
  const { address } = useAccount();
  const [showDomainPopup, setShowDomainPopup] = useState<boolean>(false);
  const hasRootDomain = useHasRootDomain(quest.mandatory_domain, address);
  const [hasNftReward, setHasNftReward] = useState<boolean>(false);
  const { domain } = useDomainFromAddress(address);

  const updatePageViews = useCallback(async (quest_id: string) => {
    try {
      const pageName = `quest_${quest_id}`;
      await updateUniqueVisitors(pageName);
    } catch (err) {
      console.log("Error while updating page views", err);
    }
  }, []);

  // this fetches quest data
  useEffect(() => {
    getQuestById(questId)
      .then((data) => {
        if (!data) {
          setErrorPageDisplay(true);
        }
        if ((data as QuestDocument).id) {
          if (
            (data as QuestDocument).rewards_nfts &&
            (data as QuestDocument).rewards_nfts.length > 0
          ) {
            setHasNftReward(true);
          }
          setQuest(data as QuestDocument);
        }
      })
      .catch((err) => {
        if (questId) {
          console.log("Error while fetching quests", err);
          setErrorPageDisplay(true);
        }
      });
  }, [questId]);

  useEffect(() => {
    // dont log if questId is not present
    if (!questId) return;

    /*
    we only want to update page views if the quest is not expired.
    Expired quests don't need to be updated.
    */
    if (quest.expired) return;

    updatePageViews(questId);
  }, [questId, updatePageViews, quest]);

  return errorPageDisplay ? (
    <ErrorScreen
      errorMessage="This quest doesn't exist !"
      buttonText="Go back to quests"
      onClick={() => router.push("/")}
    />
  ) : quest.expired ? (
    <ErrorScreen
      errorMessage="This quest has expired."
      buttonText="Go back to quests"
      onClick={() => router.push("/")}
    />
  ) : (
    <>
      <div className={homeStyles.screen}>
        {showDomainPopup &&
          (domain ? (
            <BannerPopup
              title="Subdomains are not allowed"
              banner="/visuals/profile.webp"
              description="To access Starknet Quest you need a Root Starknet domain (not a subdomain like .braavos.stark or .xplorer.stark)."
              buttonName="Get a Starknet Domain"
              onClick={() => window.open(starknetIdAppLink)}
              onClose={() => setShowDomainPopup(false)}
            />
          ) : (
            <BannerPopup
              title="Mandatory Starknet Domain"
              banner="/visuals/profile.webp"
              description="To access Starknet Quest, you must own a Starknet domain. It's your passport to the Starknet ecosystem. Get yours now."
              buttonName="Get a Starknet Domain"
              onClick={() => window.open(starknetIdAppLink)}
              onClose={() => setShowDomainPopup(false)}
            />
          ))}
        <div className={homeStyles.backButton}>
          <BackButton onClick={() => router.back()} />
        </div>

        <div className={styles.imageContainer}>
          {quest.issuer === "loading" ? (
            <RewardSkeleton />
          ) : (
            <QuestTag label={quest.issuer ?? ""} icon={quest.logo} />
          )}
        </div>

        <QuestDetails
          quest={quest}
          taskId={taskId as string | undefined}
          res={res as string | undefined}
          errorMsg={errorMsg as string | undefined}
          setShowDomainPopup={setShowDomainPopup}
          hasRootDomain={hasRootDomain}
          hasNftReward={hasNftReward}
        />
      </div>
    </>
  );
};

export default Quest;
