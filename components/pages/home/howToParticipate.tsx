import React, { FunctionComponent } from "react";
import Steps from "@components/UI/steps/steps";
import CategoryTitle from "@components/UI/titles/categoryTitle";
import styles from "@styles/components/pages/home/howToParticipate.module.css";

const HowToParticipate: FunctionComponent = () => {
  return (
    <section>
      <CategoryTitle
        title="How to Participate ?"
        subtitle="Engage in the Starknet Experience: Unlock New Possibilities"
      />
      <div className={styles.stepsContainer}>
        <Steps
          subTitleBefore={true}
          steps={[
            {
              title: "Get Your Stark Domain",
              subtitle: "01",
              description:
                "Participation in Starknet quests requires a Stark Domain. This domain will serve as your on-chain representation and is compatible with all major Starknet apps such as ArgentX, Braavos, and Starkscan.",
              icon: "/icons/starknet.svg",
              banner: "/visuals/partners/getYourStarkDomain.webp",
            },
            {
              title: "Collect NFTs in Starknet Quest",
              subtitle: "02",
              description:
                "Complete Starknet quests to earn exclusive NFTs for each protocol, or simply purchase them to enhance your collection!",
              icon: "/icons/crown.svg",
              banner: "/visuals/partners/collectNFTsInStarknetQuest.webp",
            },
            {
              title: "Build your Starknet Land",
              subtitle: "03",
              description:
                "Experience your Starknet on-chain reputation like never before with your Starknet land, directly influenced by your Starknet Quest NFT collection and overall Starknet activities. The more you engage and develop your land, the greater are your chances of receiving rewards for your on-chain activities. ",
              icon: "/icons/verified.svg",
              banner: "/visuals/partners/buildYourStarknetLand.webp",
            },
          ]}
        />
      </div>
    </section>
  );
};

export default HowToParticipate;
