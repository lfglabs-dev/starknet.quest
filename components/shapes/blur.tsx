import React, { FunctionComponent } from "react";
import styles from "../../styles/components/shapes.module.css";

type BlurProps = {
  green?: boolean;
};

const Blur: FunctionComponent<BlurProps> = ({ green = false }) => {
  return (
    <div className={`${styles.blur}`}>
      <img
        src={`/utils/${green ? "green" : "blue"}Blur.svg`}
        alt="Background blur"
      />
    </div>
  );
};

export default Blur;
