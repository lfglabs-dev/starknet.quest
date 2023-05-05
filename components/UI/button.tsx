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
        styles["nq-button"] +
        " " +
        (color === "primary" ? "" : styles["nq-button-secondary"]) +
        " " +
        (disabled ? styles.disabled_button : "")
      }
    >
      {children}
    </button>
  );
};

export default Button;
