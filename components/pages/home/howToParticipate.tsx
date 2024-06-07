import React, { FunctionComponent } from "react";
import Steps from "@components/UI/steps/steps";
import CategoryTitle from "@components/UI/titles/categoryTitle";
import styles from "@styles/components/pages/home/howToParticipate.module.css";

const HowToParticipate: FunctionComponent = () => {
  return (
    <section className={styles.section}>
      <CategoryTitle
        title="Amplify your rewards"
        subtitle="Engage in the Starknet Experience: Unlock New Possibilities"
      />
      <div className={styles.stepsContainer}>
        <Steps
          subTitleBefore={true}
          steps={[
            {
              title: "Boost Quests",
              subtitle: "01",
              description:
                "Unlock the full potential of your Starknet journey. Complete Boost Quests to earn exclusive tokens and NFTs that enrich your digital experience.",
              icon: "/icons/starknet.svg",
              banner: "/visuals/boost-quests.svg",
            },
            {
              title: "Reward Quests",
              subtitle: "02",
              description:
                "Discover the thrill of reward quests on Starknet. Engage in challenges and accumulate rare tokens and NFTs as you elevate your collection.",
              icon: "/icons/crown.svg",
              banner: "/visuals/reward-quests.svg",
            }
          ]}
        />
      </div>
    </section>
  );
};

export default HowToParticipate;
