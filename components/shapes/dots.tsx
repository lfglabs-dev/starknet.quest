import React, { FunctionComponent } from "react";
import styles from "../../styles/components/shapes.module.css";
import Dot from "./dot";

type DotsProps = {
  number?: number;
};

const Dots: FunctionComponent<DotsProps> = ({
  number = 5,
}: {
  number?: number;
}) => {
  return (
    <div className={styles.dots}>
      {Array.from(Array(number).keys()).map((i) => (
        <Dot key={"dot_" + i} />
      ))}
    </div>
  );
};

export default Dots;
