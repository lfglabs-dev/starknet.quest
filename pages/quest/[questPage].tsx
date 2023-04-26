import { NextPage } from "next";
import React from "react";
import homeStyles from "../../styles/Home.module.css";
import styles from "../../styles/quests.module.css";
import NftDisplay from "../../components/quests/nftDisplay";
import Task from "../../components/quests/task";
import Reward from "../../components/quests/reward";
import { useAccount } from "@starknet-react/core";

const QuestPage: NextPage = () => {
  const { address } = useAccount();

  return (
    <div className={homeStyles.screen}>
      <div className={styles.imageContainer}>
        <NftDisplay
          issuer={{
            name: "StarkFighter",
            logoFavicon: "/starkfighter/favicon.ico",
          }}
          nfts={[
            { imgSrc: "/starkfighter/level1.webp", level: 1 },
            { imgSrc: "/starkfighter/level2.webp", level: 2 },
            { imgSrc: "/starkfighter/level3.webp", level: 3 },
          ]}
        />
      </div>
      <div className={styles.descriptionContainer}>
        <h1 className="title mt-5 mw-90">Become a StarkFighter OG</h1>
        <p className="text-center max-w-lg">
          Mint NFTs based on your score in the StarkFighter game.
        </p>
      </div>
      <div className={styles.taskContainer}>
        <Task
          name="Register a stark name"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus blandit ultricies augue, eget tempor magna pharetra sit amet. Integer nec felis vel velit convallis feugiat. Sed sagittis, nibh sed iaculis accumsan, enim ex consectetur lectus, ut posuere metus odio non risus. Proin aliquet sagittis ultrices."
          href="https://app.starknet.id/"
          cta="Register my stark name"
          verifyEndpoint={`/api/quests/starknetid/hasDomain?address=${address}`}
        />
        <Task
          name="Play to StarkFighter (level 1)"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus blandit ultricies augue, eget tempor magna pharetra sit amet. Integer nec felis vel velit convallis feugiat. Sed sagittis, nibh sed iaculis accumsan, enim ex consectetur lectus, ut posuere metus odio non risus. Proin aliquet sagittis ultrices."
          href="https://starkfighter.xyz"
          cta="Play to starkfighter"
          verifyEndpoint={`/api/quests/starkfighter/hasPlayed?address=${address}`}
        />
        <Task
          name="Get a score of 50s or more (level 2)"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus blandit ultricies augue, eget tempor magna pharetra sit amet. Integer nec felis vel velit convallis feugiat. Sed sagittis, nibh sed iaculis accumsan, enim ex consectetur lectus, ut posuere metus odio non risus. Proin aliquet sagittis ultrices."
          href="https://starkfighter.xyz"
          cta="Play to starkfighter"
          verifyEndpoint={`/api/quests/starkfighter/hasScoreGreaterThan50?address=${address}`}
        />
        <Task
          name="Get a score of 100s or more (level 3)"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus blandit ultricies augue, eget tempor magna pharetra sit amet. Integer nec felis vel velit convallis feugiat. Sed sagittis, nibh sed iaculis accumsan, enim ex consectetur lectus, ut posuere metus odio non risus. Proin aliquet sagittis ultrices."
          href="https://starkfighter.xyz"
          cta="Play to starkfighter"
          verifyEndpoint={`/api/quests/starkfighter/hasScoreGreaterThan100?address=${address}&score=100`}
        />
        <Reward
          reward="3 NFTs"
          imgSrc="/starkfighter/favicon.ico"
          onClick={() => console.log("")}
        />
      </div>
    </div>
  );
};

export default QuestPage;
