import React, { FunctionComponent } from "react";
import Steps from "@components/UI/steps/steps";
import CategoryTitle from "@components/UI/titles/categoryTitle";
import styles from "@styles/components/pages/home/howToParticipate.module.css";
import { isNull } from "@tsparticles/engine";

const HowToParticipate: FunctionComponent = () => {
  return (
    <section className={styles.section}>
      <div className={styles.stepsContainer}>
        <Steps
          subTitleBefore={true}
          steps={[
            {
              title: "Boost Quests",
              subtitle: "01",
              description:
                "Unlock the full potential of your Starknet journey. Complete Boost Quests to earn exclusive tokens and NFTs that enrich your digital experience.",
              icon: "",
              banner: "",
            },
            {
              title: "Reward Quests",
              subtitle: "02",
              description:
                "Turn actions into assets with Reward Quests. Complete challenges to claim rare NFTs and tokens in the Starknet ecosystem",
              icon: "",
              banner: "",
            },
          ]}
        />
      </div>
    </section>
  );
};

export default HowToParticipate;
