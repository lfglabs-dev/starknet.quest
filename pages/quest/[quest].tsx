import { NextPage } from "next";
import React from "react";
import homeStyles from "../../styles/Home.module.css";
import styles from "../../styles/quests.module.css";
import NftDisplay from "../../components/quests/nftDisplay";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Button from "../../components/UI/button";

const QuestPage: NextPage = () => {
  return (
    <div className={homeStyles.screen}>
      <div className={styles.imageContainer}>
        <NftDisplay
          issuer="Starknet ID"
          nfts={[
            { imgSrc: "/starknetID/level1.png", level: 1 },
            { imgSrc: "/starknetID/level2.png", level: 2 },
            { imgSrc: "/starknetID/level3.png", level: 3 },
          ]}
        />
      </div>
      <div className={styles.descriptionContainer}>
        <h1 className="title mt-5 mw-90">Join the Stark Tribe</h1>
        <p className="text-center max-w-lg">
          Register a Stark Name, verify your twitter and join the stark tribe.
        </p>
      </div>
      <div className={styles.taskContainer}>
        <div className={styles.task}>
          {/* To Do: animate this and transform it into a component */}
          <div className="flex">
            <KeyboardArrowRightIcon
              className="mr-2"
              width={25}
              color="secondary"
            />
            Task 1
          </div>
          <div className="flex">
            Done
            <CheckCircleIcon className="ml-2" width={25} color="primary" />
          </div>
        </div>
        <div className={styles.task}></div>
        {/* To Do: transform it into a component */}
        <div className={styles.reward}>
          <div className="flex">
            <p>Reward: Totem NFT</p>
          </div>
          <div className="max-w-lg">
            <Button onClick={() => console.log("")}>Get Reward</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestPage;
