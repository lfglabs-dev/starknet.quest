import Lottie from "lottie-react";
import React, { FunctionComponent, useEffect, useState } from "react";
import loadingLottie from '../../../public/visuals/loadingLottie.json';
import styles from "../../../styles/components/loadingScreen.module.css";
import Blur from "../../shapes/blur";

const LoadingScreen: FunctionComponent = () => {
  const [loadingMessageNumber, setLoadingMessageNumber] = useState<number>(0);
  const loadingMessages: string[] = [
    "StarkNet Quest leverages the power of Layer 2 scaling solutions to enhance Ethereum's efficiency and scalability",
    "Patience is also a virtue when it comes to Starknet ",
    "Just a few moments left sir",
    "Alright now it shouldn't be long",
  ];

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (loadingMessageNumber !== loadingMessages.length - 1) {
        setLoadingMessageNumber(loadingMessageNumber + 1);
      } else {
        setLoadingMessageNumber(0);
      }
    }, 5000);

    return () => clearTimeout(timeoutId); 

  }, [loadingMessageNumber]);
  
  
  return (
    <div className={styles.loading}>
      <div className="justify-center flex flex-col gap-4">
        <Lottie animationData={loadingLottie} className={styles.loadingLottie}  />
        <h2 className={styles.loadingText} >Loading...</h2>
      </div>
      <h1 className={styles.tips}  >
        {loadingMessages[loadingMessageNumber]}
      </h1> 
      <div className={styles.blur}> 
        <Blur green />
      </div>
    </div>
  );
};

export default LoadingScreen;
