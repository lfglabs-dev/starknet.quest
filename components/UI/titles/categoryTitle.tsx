import styles from "../../../styles/components/titles.module.css";
import Corner from "../../shapes/corner";

const CategoryTitle = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => {
  return (
    <div className={styles.container}>
      <div className={[styles.corner, styles.cornerTopLeft].join(" ")}>
        <Corner />
      </div>
      <p className={styles.subtitle}>{subtitle}</p>
      <h2 className={styles.title}>{title}</h2>
    </div>
  );
};

export default CategoryTitle;
