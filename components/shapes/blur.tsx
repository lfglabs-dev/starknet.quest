import React, { FunctionComponent } from "react";
import styles from "../../styles/components/shapes.module.css";

type BlurProps = {
  green?: boolean;
};

const Blur: FunctionComponent<BlurProps> = ({ green = false }) => {
  return (
    <img
      src={`/utils/${green ? "green" : "blue"}Blur.svg`}
      alt="Background blur"
      className={`${styles.blur} ${green ? styles.greenBlur : null}`}
    />
  );
};

export default Blur;
