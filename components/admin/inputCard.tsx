import React, { FunctionComponent } from "react";
import styles from "@styles/admin.module.css";
import AccentBox from "@components/UI/AccentBox";

type Props = {
  children: React.ReactNode;
};

const InputCard: FunctionComponent<Props> = ({ children }) => {
  return (
    <AccentBox>
      <div className={styles.input_card_container}>{children}</div>
    </AccentBox>
  );
};

export default InputCard;
