import styles from "../../styles/components/shapes.module.css";

const Corner = () => {
  return (
    <svg
      className={[styles.shape, styles.corner].join(" ")}
      width="23"
      height="23"
      viewBox="0 0 23 23"
      fill="none"
    >
      <path d="M22 1L1 1L1 22" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};

export default Corner;
