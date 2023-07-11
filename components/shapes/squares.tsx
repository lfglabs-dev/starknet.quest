import styles from "../../styles/components/shapes.module.css";

const Squares = () => {
  return (
    <svg
      className={styles.shape}
      width="24"
      height="10"
      viewBox="0 0 24 10"
      fill="none"
    >
      <rect x="14.5" y="0.5" width="9" height="9" />
      <rect x="0.5" y="0.5" width="9" height="9" />
    </svg>
  );
};

export default Squares;
