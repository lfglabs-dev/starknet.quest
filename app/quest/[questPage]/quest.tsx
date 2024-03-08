"use client";

import QuestDetails from "@components/quests/questDetails";
import React, { FunctionComponent, useEffect, useState } from "react";
import homeStyles from "@styles/Home.module.css";
import styles from "@styles/quests.module.css";
import { useRouter } from "next/navigation";
import { QueryError, QuestDocument } from "../../../types/backTypes";
import RewardSkeleton from "@components/skeletons/rewardSkeleton";
import ErrorScreen from "@components/UI/screens/errorScreen";
import BackButton from "@components/UI/backButton";
import useHasRootDomain from "@hooks/useHasRootDomain";
import { useAccount } from "@starknet-react/core";
import { starknetIdAppLink } from "@utils/links";
import BannerPopup from "@components/UI/menus/bannerPopup";
import { useDomainFromAddress } from "@hooks/naming";
import NftIssuerTag from "@components/quests/nftIssuerTag";
import { QuestDefault } from "@constants/common";

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

  // this fetches quest data
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_LINK}/get_quest?id=${questId}`)
      .then((response) => response.json())
      .then((data: QuestDocument | QueryError) => {
        if ((data as QuestDocument).name) {
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
            <div className="mb-4">
              <NftIssuerTag
                issuer={{
                  name: quest.issuer,
                  logoFavicon: quest.logo,
                }}
              />
            </div>
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
