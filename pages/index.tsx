import React from "react";
import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import Quest from "../components/quests/quest";
import { useRouter } from "next/router";

const Quests: NextPage = () => {
  const router = useRouter();

  return (
    <div className={styles.screen}>
      <div className={styles.container}>
        <h1 className="title">Get Started with Starknet</h1>
        <div className={styles.questContainer}>
          <Quest
            title="Fighter Score"
            onClick={() => router.push("/quest/123")}
            imgSrc="/starkfighter/level3.webp"
            issuer={{
              name: "StarkFighter",
              logoFavicon: "/starkfighter/favicon.ico",
            }}
            reward="3 NFTs"
          />
        </div>
      </div>
    </div>
  );
};

export default Quests;
