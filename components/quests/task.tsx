import React, { FunctionComponent, useEffect, useState } from "react";
import styles from "../../styles/quests.module.css";
import {
  CheckCircle as CheckCircleIcon,
  ErrorRounded as ErrorRoundedIcon,
} from "@mui/icons-material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Button from "../UI/button";
import { CircularProgress } from "@mui/material";
import { useAccount } from "@starknet-react/core";

const Task: FunctionComponent<Task> = ({
  name,
  description,
  href,
  cta = "open app",
  verifyEndpoint,
  refreshRewards,
  wasVerified,
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const { address } = useAccount();

  // A verify function that setIsVerified(true) and stop propagation
  const verify = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);

    fetch(verifyEndpoint)
      .then((response) => response.json())
      .then((data) => {
        if (data.res) {
          setIsVerified(true);
          refreshRewards();
        } else {
          if (!address) {
            setError("Please connect your wallet first");
          } else {
            setError(data.error_msg);
          }
        }
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // a useEffect that sets isVerified to wasVerified (to update it correctly)
  useEffect(() => {
    if (!wasVerified) return;
    setIsVerified(wasVerified);
  }, [wasVerified]);

  return (
    <div className={styles.task}>
      <div
        className={styles.taskTitle}
        onClick={() => setIsClicked(!isClicked)}
      >
        <div className="flex">
          {isClicked ? (
            <KeyboardArrowDownIcon width={25} color="secondary" />
          ) : (
            <KeyboardArrowRightIcon width={25} color="secondary" />
          )}
          <p className="ml-2 mr-2">{name}</p>
        </div>
        {isVerified ? (
          <div className="flex">
            Done
            <CheckCircleIcon className="ml-2" width={25} color="primary" />
          </div>
        ) : isLoading ? (
          <div className="w-20 flex justify-center items-center">
            <>
              <CircularProgress size={30} color="primary" />
            </>
          </div>
        ) : error ? (
          <div className="flex">
            {error}
            <ErrorRoundedIcon className="ml-2" width={25} color="error" />
          </div>
        ) : (
          <div onClick={(e) => verify(e)} className={styles.verifyButton}>
            <p>Verify</p>
          </div>
        )}
      </div>
      <div
        className={`${styles.taskDescription}  ${
          isClicked ? styles.visible : null
        }`}
      >
        <p className="mb-3">{description}</p>
        <div className="flex w-full justify-center items-center">
          <div className="w-2/3">
            <Button onClick={() => window.open(href)}>{cta}</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Task;
