import React, { Dispatch, FunctionComponent, SetStateAction } from "react";
import QuizControls from "./quizControls";
import Menu from "./menu";
import styles from "../../styles/components/quests/quizzes.module.css";
import Button from "../UI/button";

type HomeScreenProps = {
  setStep: Dispatch<SetStateAction<number>>;
};

const HomeScreen: FunctionComponent<HomeScreenProps> = ({ setStep }) => {
  return (
    <>
      <div className={styles.content}>
        <Menu
          title="Uniswap Oracle"
          actionBar={
            <Button onClick={() => setStep((step) => step + 1)}>
              Start Quiz
            </Button>
          }
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
      <QuizControls setStep={setStep} />
    </>
  );
};

export default HomeScreen;
