import React, { FunctionComponent, ReactNode } from "react";
import styles from "../../styles/components/button.module.css";

type ButtonProps = {
  onClick: () => void;
  children: string | ReactNode;
  disabled?: boolean;
  color?: string;
};

const Button: FunctionComponent<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  color = "primary",
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={
        color === "primary"
          ? styles["nq-button"]
          : styles["nq-button"] + " " + styles["nq-button-secondary"]
      }
    >
      {children}
    </button>
  );
};

export default Button;
