import React, { FunctionComponent, useState } from "react";
import styles from "../../styles/quests.module.css";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Button from "../UI/button";

type TaskProps = {
  name: string;
  description: string;
  href: string;
  cta?: string;
};

const Task: FunctionComponent<TaskProps> = ({
  name,
  description,
  href,
  cta = "open app",
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // a verify function that setIsVerified(true) and stoppropagation
  const verify = (e: any) => {
    e.stopPropagation();
    setIsVerified(true);
  };

  return (
    <div className={styles.task}>
      <div
        className={styles.taskTitle}
        onClick={() => setIsClicked(!isClicked)}
      >
        <div className="flex">
          {isClicked ? (
            <KeyboardArrowDownIcon
              className="mr-2"
              width={25}
              color="secondary"
            />
          ) : (
            <KeyboardArrowRightIcon
              className="mr-2"
              width={25}
              color="secondary"
            />
          )}
          <p>{name}</p>
        </div>
        {isVerified ? (
          <div className="flex">
            Done
            <CheckCircleIcon className="ml-2" width={25} color="primary" />
          </div>
        ) : (
          <div onClick={verify} className={styles.verifyButton}>
            Verify
          </div>
        )}
      </div>
      <div
        className={`${styles.taskDescription}  ${
          isClicked ? styles.visible : null
        }`}
      >
        <p className="mb-3 text-color-secondary300">{description}</p>
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
