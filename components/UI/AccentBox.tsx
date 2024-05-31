import React, { FunctionComponent, ReactNode, useState } from "react";
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
  background = "#101012", 
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
      className={`${styles.accentBox} ${className}`} 
      style={{ ...style, backgroundColor: background, border: "2px solid #000" }}
      onClick={handleToggle}
      onKeyUp={handleKeyUp}
      tabIndex={0} // Makes the div focusable
    >
      <div>
        {children}
      </div>
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
