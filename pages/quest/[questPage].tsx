import { GetServerSidePropsContext, NextPage } from "next";
import QuestDetails from "../../components/quests/questDetails";
import React, { useState } from "react";
import homeStyles from "../../styles/Home.module.css";
import styles from "../../styles/quests.module.css";
import { useRouter } from "next/router";
import { QueryError, QuestDocument } from "../../types/backTypes";
import RewardSkeleton from "../../components/skeletons/rewardSkeleton";
import ErrorScreen from "../../components/UI/screens/errorScreen";
import NftIssuer from "../../components/quests/nftIssuer";
import BackButton from "../../components/UI/backButton";
import useHasRootDomain from "../../hooks/useHasRootDomain";
import { useAccount } from "@starknet-react/core";
import { starknetIdAppLink } from "../../utils/links";
import BannerPopup from "../../components/UI/menus/bannerPopup";
import { useDomainFromAddress } from "../../hooks/naming";
import Head from "next/head";

type QuestPageProps = {
  quest?: QuestDocument;
  errorPageDisplay: boolean;
};

/* eslint-disable react/prop-types */
const QuestPage: NextPage<QuestPageProps> = ({ quest, errorPageDisplay }) => {
  const router = useRouter();
  const { task_id: taskId, res, error_msg: errorMsg } = router.query;
  const { address } = useAccount();
  const [showDomainPopup, setShowDomainPopup] = useState<boolean>(false);
  const hasRootDomain = useHasRootDomain(
    quest ? quest.mandatory_domain : null,
    address
  );
  const { domain } = useDomainFromAddress(address);

  return errorPageDisplay || !quest ? (
    <ErrorScreen
      errorMessage="This quest doesn't exist !"
      buttonText="Go back to quests"
      onClick={() => router.push("/")}
    />
  ) : (
    <>
      <Head>
        <title>{quest.name}</title>
        <meta name="description" content={quest.desc} />
        <meta property="og:title" content={quest.name} />
        <meta property="og:description" content={quest.desc} />
        <meta property="og:image" content={quest.img_card} />
        <meta property="twitter:card" content="summary_large_image" />
      </Head>
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
          {!quest.issuer ? (
            <RewardSkeleton />
          ) : (
            <NftIssuer
              issuer={{
                name: quest.issuer,
                logoFavicon: quest.logo,
              }}
            />
          )}
        </div>
        <QuestDetails
          quest={quest}
          taskId={taskId as string | undefined}
          res={res as string | undefined}
          errorMsg={errorMsg as string | undefined}
          setShowDomainPopup={setShowDomainPopup}
          hasRootDomain={hasRootDomain}
        />
      </div>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const { questPage: questId } = context.query;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_LINK}/get_quest?id=${questId}`
    );
    const data: QuestDocument | QueryError = await response.json();

    if ((data as QuestDocument).name) {
      return {
        props: {
          quest: data as QuestDocument,
          errorPageDisplay: false,
        },
      };
    } else {
      return {
        props: {
          quest: null,
          errorPageDisplay: true,
        },
      };
    }
  } catch (error) {
    console.log(error);
    return {
      props: {
        quest: null,
        errorPageDisplay: true,
      },
    };
  }
}

export default QuestPage;
