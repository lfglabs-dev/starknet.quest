import styles from "../../styles/components/shapes.module.css";
import Cross from "./cross";

const Crosses = ({
  number = 2,
  xDecal = 0,
}: {
  number?: number;
  xDecal?: number;
}) => {
  const computeStyle = (i: number) => {
    const mutliplier = i % 2 ? 1 : -1;
    return {
      transform: `translateX(${Math.cos(i) * 30 * mutliplier}px) translateY(${
        Math.sin(i) * 30 * mutliplier
      }px)`,
    };
  };
  return (
    <div className={styles.crossContainer}>
      <div
        style={{
          left: `${xDecal}px`,
        }}
        className={styles.side}
      >
        {Array.from(Array(number).keys()).map((i) => (
          <div
            key={"cross_left_" + i}
            className={styles.cross}
            style={computeStyle(i - 5)}
          >
            <Cross />
          </div>
        ))}
      </div>
      <div
        style={{
          right: `${xDecal}px`,
        }}
        className={styles.side}
      >
        {Array.from(Array(number).keys()).map((i) => (
          <div
            key={"cross_right_" + i}
            className={styles.cross}
            style={computeStyle(i)}
          >
            <Cross />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Crosses;
