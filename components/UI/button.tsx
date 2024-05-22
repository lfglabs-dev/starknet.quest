import React, { FunctionComponent, ReactNode } from "react";
import styles from "@styles/components/button.module.css";
import { CircularProgress } from "@mui/material";

type ButtonProps = {
  onClick: () => void;
  children: string | ReactNode;
  disabled?: boolean;
  color?: string;
  loading?: boolean;
};

const Button: FunctionComponent<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  color = "primary",
  loading = false,
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
      {loading ? <CircularProgress size={20} /> : children}
    </button>
  );
};

export default Button;
