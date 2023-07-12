import styles from "../../styles/components/shapes.module.css";

const Cross = () => {
  return (
    <svg
      className={[styles.shape, styles.corner].join(" ")}
      width="9"
      height="9"
      viewBox="0 0 9 9"
      fill="none"
    >
      <path
        d="M1 8.5L8.5 1M1.5 1L8.5 8.5"
        stroke="#66666F"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default Cross;
