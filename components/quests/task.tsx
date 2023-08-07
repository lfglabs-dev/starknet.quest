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
  verifyRedirect,
  refreshRewards,
  wasVerified,
  verifyEndpointType,
  hasError,
  verifyError,
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const { address } = useAccount();

  useEffect(() => {
    if (hasError) {
      setError(verifyError ?? "Something went wrong");
    }
  }, [hasError]);

  // A verify function that setIsVerified(true) and stop propagation
  const verify = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!address) {
      setError("Please connect your wallet first");
      return;
    }
    setIsLoading(true);

    if (verifyEndpointType.startsWith("oauth")) {
      window.open(verifyEndpoint);
      setIsLoading(false);
    } else {
      try {
        const response = await fetch(verifyEndpoint);

        if (!response.ok) {
          throw new Error(await response.text());
        }

        if (verifyRedirect) {
          await new Promise((resolve) =>
            setTimeout(() => {
              setIsVerified(true);
              refreshRewards();
              setIsLoading(false);
              resolve(null);
            }, 15000)
          );
        } else {
          setIsVerified(true);
          refreshRewards();
          setIsLoading(false);
        }
      } catch (error) {
        console.log("error", error);
        setError(
          address
            ? (error as { message: string }).message
            : "Please connect your wallet first"
        );
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 9000);
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
          <div
            onClick={(e) => {
              if (verifyRedirect && address) window.open(verifyRedirect);
              verify(e);
            }}
            className={styles.verifyButton}
          >
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
