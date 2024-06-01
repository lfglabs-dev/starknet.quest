import React, { FunctionComponent, ReactNode } from "react";
import styles from "@styles/components/identityMenu.module.css";
import Typography from "../typography/typography";
import { TEXT_TYPE } from "@constants/typography";

type ClickableActionProps = {
  icon: ReactNode;
  onClick?: () => void;
  title?: string;
  description?: string;
  style?: "primary" | "secondary";
  width?: "fixed" | "auto";
};

const ClickableAction: FunctionComponent<ClickableActionProps> = ({
  icon,
  onClick,
  title,
  description,
  style = "secondary",
  width = "fixed",
}) => {
  return (
    <div
      className={`${
        style === "secondary"
          ? styles.clickableActionSecondary
          : styles.clickableActionPrimary
      }
        ${width === "auto" ? styles.clickableActionAutoWidth : ""}`}
      onClick={onClick}
    >
      <div
        className={
          style === "secondary"
            ? styles.clickableIconSecondary
            : styles.clickableIconPrimary
        }
      >
        {icon}
      </div>

      <div className="ml-2">
        <Typography type={TEXT_TYPE.H1} color="secondary" className={styles.clickableActionTitle}>{title}</Typography>
        <Typography type={TEXT_TYPE.BODY_MICRO} className={styles.clickableActionDescription}>{description}</Typography>
      </div>
    </div>
  );
};

export default ClickableAction;
