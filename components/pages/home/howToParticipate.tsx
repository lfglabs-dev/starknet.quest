import React from "react";
import type { FunctionComponent } from "react";
import AccentBox from "@components/UI/AccentBox";
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
      <div className={styles.separator} />
      <div className={styles.stepsContainer}>
        <AccentBox>
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
              }
            ]}
          />
          {/* Add any additional children here if needed */}
        </AccentBox>
        <AccentBox>
          <Steps
            subTitleBefore={true}
            steps={[
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
          {/* Add any additional children here if needed */}
        </AccentBox>
      </div>
    </section>
  );
};

export default HowToParticipate;
