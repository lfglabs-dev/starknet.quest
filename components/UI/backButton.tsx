import React, { FunctionComponent } from "react";
import styles from "../../styles/components/backButton.module.css";

type BackButtonProps = {
  onClick: () => void;
};

const BackButton: FunctionComponent<BackButtonProps> = ({ onClick }) => (
  <button onClick={onClick} className={styles.backButton}>
    <svg
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 19.5L8.25 12l7.5-7.5"
      />
    </svg>
    Back
  </button>
);

export default BackButton;
