import { GetServerSidePropsContext, NextPage } from "next";
import QuestDetails from "../../components/quests/questDetails";
import React, { useEffect, useState } from "react";
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
  customTags: boolean;
  questTags?: QuestDocument;
};

/* eslint-disable react/prop-types */
const QuestPage: NextPage<QuestPageProps> = ({
  customTags = false,
  questTags,
}) => {
  const router = useRouter();
  const {
    questPage: questId,
    task_id: taskId,
    res,
    error_msg: errorMsg,
  } = router.query;
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
    expiry_timestamp: "loading",
    mandatory_domain: null,
  });
  const [errorPageDisplay, setErrorPageDisplay] = useState(false);
  const { address } = useAccount();
  const [showDomainPopup, setShowDomainPopup] = useState<boolean>(false);
  const hasRootDomain = useHasRootDomain(quest.mandatory_domain, address);
  const { domain } = useDomainFromAddress(address);

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

  return errorPageDisplay ? (
    <ErrorScreen
      errorMessage="This quest doesn't exist !"
      buttonText="Go back to quests"
      onClick={() => router.push("/")}
    />
  ) : (
    <>
      {/* {customTags && questTags ? (
        <Head>
          <meta property="og:title" content={questTags.name} />
          <meta property="og:description" content={questTags.desc} />
          <meta property="og:image" content={questTags.img_card} />
          <meta name="twitter:title" content={questTags.name} />
          <meta name="twitter:description" content={questTags.desc} />
          <meta name="twitter:image" content={questTags.img_card} />
        </Head>
      ) : null} */}
      {customTags ? (
        <Head>
          <meta property="og:title" content="TEST title" />
          <meta property="og:description" content="test description" />
          <meta name="twitter:title" content="TEST title" />
          <meta name="twitter:description" content="test description" />
        </Head>
      ) : null}
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
  const userAgent = context.req.headers["user-agent"] || "";
  const isFromDiscord = userAgent.toLowerCase().includes("discord");
  const isFromTwitter = userAgent.toLowerCase().includes("twitter");

  if (isFromDiscord || isFromTwitter) {
    try {
      const { questPage: questId } = context.query;
      return {
        props: {
          customTags: true,
        },
      };
      // const response = await fetch(
      //   `${process.env.NEXT_PUBLIC_API_LINK}/get_quest?id=${questId}`
      // );
      // const data: QuestDocument | QueryError = await response.json();

      // if ((data as QuestDocument).name) {
      //   return {
      //     props: {
      //       questTags: data as QuestDocument,
      //       customTags: true,
      //     },
      //   };
      // } else {
      //   return {
      //     props: {
      //       customTags: false,
      //     },
      //   };
      // }
    } catch (error) {
      console.log(error);
      return {
        props: {
          customTags: false,
        },
      };
    }
  } else {
    return {
      props: {
        customTags: false,
      },
    };
  }
}

export default QuestPage;
