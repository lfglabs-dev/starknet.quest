import React, { FunctionComponent, useState } from "react";
import { MutatingDots } from "react-loader-spinner";
import Typography from "../typography/typography";
import { TEXT_TYPE } from "@constants/typography";

interface LoadingScreenProps {
  displayMessage?: boolean;
}

const LoadingScreen: FunctionComponent<LoadingScreenProps> = (props) => {
  const [loadingMessageNumber, setLoadingMessageNumber] = useState<number>(0);
  const loadingMessages: string[] = [
    "Patience is a virtue, especially when it comes to Starknet Alpha",
    "Patience is also a virtue when it comes to Starknet testnet",
    "Ok it's slow but at least it does not stop like Solana",
    "Just a few moments left sir",
    "Alright now it shouldn't be long",
  ];

  setTimeout(() => {
    if (loadingMessageNumber != loadingMessages.length - 1)
      setLoadingMessageNumber(loadingMessageNumber + 1);
  }, 15000);

  return (
    <div className="max-w-3xl">
      {props.displayMessage && (
        <Typography type={TEXT_TYPE.H1} className="mr-3 ml-3 text-5xl sm:text-5xl">
          {loadingMessages[loadingMessageNumber]}
        </Typography>
      )}
      <div className="flex justify-center m-5">
        <MutatingDots
          height="100"
          width="100"
          color="#19AA6E"
          secondaryColor="#BF9E7B"
          ariaLabel="loading"
        />
      </div>
    </div>
  );
};

LoadingScreen.defaultProps = {
  displayMessage: true,
};

export default LoadingScreen;
