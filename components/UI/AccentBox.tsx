import React, { useState } from "react";
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
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleToggle();
    }
  };

  return (
    <div 
      className={`${styles.accentBox} ${className} ${isExpanded ? styles.expanded : ''}`} 
      style={{ ...style }}
    >
      <button 
        onClick={handleToggle} 
        onKeyUp={handleKeyUp} 
        tabIndex={0} 
        className={styles.toggleButton}
        style={{ backgroundColor: background }}
      >
        {children}
      </button>
      {isExpanded && (
        <div className={styles.miniCardsContainer}>
          {/* Render your mini cards here */}
          <div className={styles.miniCard}>Mini Card 1</div>
          <div className={styles.miniCard}>Mini Card 2</div>
          {/* Add more mini cards as needed */}
        </div>
      )}
    </div>
  );
};

export default AccentBox;
