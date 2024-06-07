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
import Typography from "@components/UI/typography/typography";
import { TEXT_TYPE } from "@constants/typography";

const Task: FunctionComponent<Task> = ({
  name,
  description,
  href,
  cta = "open app",
  verifyEndpoint,
  verifyRedirect,
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
  expired,
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
        if (expired) {
          setError("This quest has expired");
          setIsLoading(false);
          return;
        }
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_LINK}/${verifyEndpoint}`
        );

        if (!response.ok) {
          throw new Error(await response.text());
        }

        if (verifyRedirect) {
          // if the verify_endpoint_type contains a timeout indication we use it,
          // otherwise we use the default timeout of 15 seconds
          const timeout =
            verifyEndpointType.split("_").length === 2
              ? parseInt(verifyEndpointType.split("_")[1]) ?? 15000
              : 15000;
          await new Promise((resolve) =>
            setTimeout(() => {
              setIsVerified(true);
              setIsLoading(false);
              resolve(null);
            }, timeout)
          );
        } else {
          setIsVerified(true);
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
          <Typography type={TEXT_TYPE.BODY_DEFAULT} className="ml-2 mr-2">{name}</Typography>
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
            <Typography type={TEXT_TYPE.BODY_DEFAULT}>{getButtonName()}</Typography>
          </div>
        )}
      </div>
      <div
        className={`${styles.taskDescription}  ${
          isClicked ? styles.visible : null
        }`}
      >
        <Typography type={TEXT_TYPE.BODY_DEFAULT} className="mb-3">{description}</Typography>
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
