"use client";

import React, { FunctionComponent, useEffect, useState } from "react";
import styles from "@styles/quests.module.css";
import {
  CheckCircle as CheckCircleIcon,
  ErrorRounded as ErrorRoundedIcon,
} from "@mui/icons-material";
import Button from "@components/UI/button";
import { CircularProgress } from "@mui/material";
import { useAccount } from "@starknet-react/core";
import Quiz from "@components/quiz/quiz";
import ArrowRightIcon from "@components/UI/iconsComponents/icons/arrowRightIcon";

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
  setShowQuiz,
  quizName,
  issuer,
  setShowDomainPopup,
  hasRootDomain,
  customError,
  checkUserRewards,
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>(
    customError.length > 0 ? customError : ""
  );
  const { address } = useAccount();

  useEffect(() => {
    if (hasError) {
      setError(verifyError ?? "Something went wrong");
    }
  }, [hasError]);

  const checkCanDoTask = () => {
    if (!address) {
      setError("Please connect your wallet first");
      return false;
    }
    return true;
  };

  // A verify function that setIsVerified(true) and stop propagation
  const verify = async () => {
    checkCanDoTask();
    setIsLoading(true);

    if (verifyEndpointType.startsWith("oauth")) {
      window.open(verifyEndpoint);
      setIsLoading(false);
    } else {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_LINK}/${verifyEndpoint}`
        );

        if (!response.ok) {
          throw new Error(await response.text());
        }

        if (verifyRedirect) {
          // if the redirect is to a realm, we set a timeout of 2 minutes
          const timeout = verifyRedirect.includes("realms") ? 120000 : 15000;
          await new Promise((resolve) =>
            setTimeout(() => {
              setIsVerified(true);
              checkUserRewards();
              refreshRewards();
              setIsLoading(false);
              resolve(null);
            }, timeout)
          );
        } else {
          setIsVerified(true);
          checkUserRewards();
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
    checkUserRewards();
  }, [wasVerified]);

  const openTask = () => {
    if (!checkCanDoTask()) return;
    if (verifyEndpointType === "quiz" && issuer)
      return setShowQuiz(
        <Quiz
          setShowQuiz={setShowQuiz}
          quizId={quizName as string}
          issuer={issuer}
          verifyEndpoint={verifyEndpoint}
          setIsVerified={setIsVerified}
          refreshRewards={refreshRewards}
        />
      );
    window.open(href);
  };

  const getButtonName = () => {
    if (verifyEndpointType === "quiz") return "Start quiz";
    return "Verify";
  };

  return (
    <div className={styles.task}>
      <div
        className={styles.taskTitle}
        onClick={() => setIsClicked(!isClicked)}
      >
        <div className="flex items-center">
          <div className={isClicked ? "rotate-90" : undefined}>
            <ArrowRightIcon width={"16"} color="white" />
          </div>
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
              e.stopPropagation();
              if (!address) return setError("Please connect your wallet first");
              if (!hasRootDomain) return setShowDomainPopup(true);
              if (verifyEndpointType === "quiz") return openTask();
              if (verifyRedirect) window.open(verifyRedirect);
              verify();
            }}
            className={styles.verifyButton}
          >
            <p>{getButtonName()}</p>
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
