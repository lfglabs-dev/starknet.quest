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
                "Turn actions into assets with Reward Quests. Complete challenges to claim rare NFTs and tokens in the Starknet ecosystem",
            }
          ]}
        />
      </div>
    </section>
  );
};

export default HowToParticipate;
