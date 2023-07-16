import React from "react";
import Steps from "../../UI/steps/steps";
import CategoryTitle from "../../UI/titles/categoryTitle";
import Crosses from "../../shapes/crosses";

import styles from "../../../styles/components/pages/home/howToParticipate.module.css";

const HowToParticipate = () => {
  return (
    <section>
      <CategoryTitle
        title="How to Participate ?"
        subtitle="Engage in the Starknet Experience: Unlock New Possibilities"
        corner="topLeft"
      />
      <div className={styles.stepsContainer}>
        <Steps
          subTitleBefore={true}
          steps={[
            {
              title: "Get Your Stark Domain",
              subtitle: "01",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
              icon: "/icons/starknet.svg",
              banner: "/visuals/getYourStarkDomain.webp",
            },
            {
              title: "Collect NFTs in Starknet Quest",
              subtitle: "02",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
              icon: "/icons/crown.svg",
              banner: "/visuals/collectNFTsInStarknetQuest.webp",
            },
            {
              title: "Build your Starknet Land",
              subtitle: "03",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
              icon: "/icons/verified.svg",
              banner: "/visuals/buildYourStarknetLand.webp",
            },
          ]}
        />
        <Crosses xDecal={-300} />
      </div>
    </section>
  );
};

export default HowToParticipate;
