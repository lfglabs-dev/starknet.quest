import React, { FunctionComponent, ReactNode } from "react";
import styles from "@styles/components/box.module.css";

type BoxProps = {
  children: ReactNode;
};

const Box: FunctionComponent<BoxProps> = ({ children }) => {
  return <div className={styles.container}>{children}</div>;
};

export default Box;
