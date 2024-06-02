import React from "react";
import type { FunctionComponent, ReactNode } from "react";
import styles from "@styles/components/accentBox.module.css";

type AccentBoxProps = {
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  background?: string;
};

const AccentBox: FunctionComponent<AccentBoxProps> = ({
  children,
  className,
  style,
  background = "#000",
}) => {
  return (
    <div
      className={`${styles.accentBox} ${className}`}
      style={{ ...style, backgroundColor: background }}
    >
      <div className={styles.gradientLine}></div>
      <div>
        {children}
      </div>
    </div>
  );
};

export default AccentBox;
