import { NextPage } from "next";
import React from "react";
import homeStyles from "../../styles/Home.module.css";
import styles from "../../styles/quests.module.css";
import NftDisplay from "../../components/quests/nftDisplay";

const QuestPage: NextPage = () => {
  return (
    <div className={homeStyles.screen}>
      <div className={styles.imageContainer}>
        <NftDisplay
          issuer="Starknet ID"
          imgSrc="https://imgp.layer3cdn.com/cdn-cgi/image/fit=cover,width=400,height=400,anim=false,format=auto/ipfs/QmaC8d6746Z6QXqxJegDEtCpnURvtikUEEdcHFvPiWYX3N"
          level={1}
        />
      </div>
      <div className={styles.descriptionContainer}>
        <h1 className="title mt-5">Join the Stark Tribe</h1>
        <p className="text-center max-w-lg">
          Register a Stark Name, verify your twitter and join the stark tribe.
        </p>
      </div>
      <div className={styles.taskContainer}>
        <div className={styles.task}></div>
        <div className={styles.task}></div>
        <div className={styles.task}></div>
        <div className={styles.reward}></div>
      </div>
    </div>
  );
};

export default QuestPage;
