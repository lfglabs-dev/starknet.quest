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
            title="Web wallet"
            onClick={() => router.push("/quest/1")}
            imgSrc="https://imgp.layer3cdn.com/cdn-cgi/image/fit=cover,width=400,height=400,anim=false,format=auto/ipfs/QmaC8d6746Z6QXqxJegDEtCpnURvtikUEEdcHFvPiWYX3N"
            issuer="Argent-x"
            xp={200}
          />
          <Quest
            title="Hardware signer"
            onClick={() => router.push("/quest/2")}
            imgSrc="https://imgp.layer3cdn.com/cdn-cgi/image/fit=cover,width=400,height=400,anim=false,format=auto/ipfs/QmeNBYHQsMkn6GKj7LX5AC9ybYKu2fgxqMo6gkvvFPJbXY"
            issuer="Braavos"
            xp={200}
          />
        </div>
      </div>
    </div>
  );
};

export default Quests;
