import React, { FunctionComponent } from "react";
import QuizControls from "./quizControls";
import Menu from "./menu";
import styles from "../../../styles/components/quests/quizzes.module.css";
import Button from "../../UI/button";

type HomeScreenProps = {
  move: (direction?: number) => void;
  quit: () => void;
};

const HomeScreen: FunctionComponent<HomeScreenProps> = ({ move, quit }) => {
  return (
    <>
      <div className={styles.content}>
        <Menu
          title="Uniswap Oracle"
          actionBar={<Button onClick={() => move()}>Start Quiz</Button>}
        >
          <p>
            Welcome to the Uniswap Unraveled quiz – an exhilarating journey into
            the heart of decentralized finance (DeFi). Test your knowledge, dive
            into Uniswap&apos;s ecosystem, and unlock the secrets of DeFi. Get
            ready to become a DeFi expert as you answer questions and earn
            rewards. Are you up for the challenge? Let&apos;s get started!
          </p>
        </Menu>
      </div>
      <QuizControls move={move} quit={quit} />
    </>
  );
};

export default HomeScreen;
