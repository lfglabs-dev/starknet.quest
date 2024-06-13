import React, { FunctionComponent } from "react";
import styles from "@styles/admin.module.css";

type Props = {
  children: React.ReactNode;
};

const InputCard: FunctionComponent<Props> = ({ children }) => {
  return <div className={styles.input_card_container}>{children}</div>;
};

export default InputCard;
