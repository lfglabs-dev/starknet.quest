import React, { useState } from "react";
import type { FunctionComponent, ReactNode } from "react";
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
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleToggle();
    }
  };

  return (
    <div
      className={`${styles.accentBox} ${className} ${isExpanded ? styles.expanded : ''}`}
      style={{ ...style }}
      onClick={handleToggle}
      onKeyUp={handleKeyUp}
      tabIndex={0} 
    >
      <div className={styles.gradientLine}></div>
      <div>
        {children}
      </div>
    </div>
  );
};

export default AccentBox;
