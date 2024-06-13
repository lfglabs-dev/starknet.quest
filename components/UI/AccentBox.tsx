import React, { FunctionComponent, ReactNode } from "react";
import styles from "@styles/components/accentBox.module.css";

type AccentBoxProps = {
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

const AccentBox: FunctionComponent<AccentBoxProps> = ({
  children,
  className,
  style,
}) => {
  return (
    <div
      className={`${styles.accentBox} ${className}`}
      style={{ ...style }}
    >
      <div className={styles.gradientLine}></div>
      {children}
    </div>
  );
};

export default AccentBox;
