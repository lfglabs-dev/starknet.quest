import styles from "../../styles/components/box.module.css";

const Box = ({ children }: { children: React.ReactNode }) => {
  return <div className={styles.container}>{children}</div>;
};

export default Box;
