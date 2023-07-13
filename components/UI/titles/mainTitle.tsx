import styles from "../../../styles/components/titles.module.css";
import Corner from "../../shapes/corner";
import Squares from "../../shapes/squares";

const MainTitle = ({
  title,
  highlighted,
  subtitle,
  corner = "topLeft",
  squares = null,
}: {
  title: string;
  highlighted: string;
  subtitle: string;
  corner?: string | null;
  squares?: string | null;
}) => {
  return (
    <div className={[styles.container, styles.mainTitleContainer].join(" ")}>
      {corner && (
        <div className={[styles.corner, styles[corner]].join(" ")}>
          <Corner />
        </div>
      )}
      {squares && (
        <div className={[styles.squares, styles[squares]].join(" ")}>
          <Squares />
        </div>
      )}

      <h2 className={styles.mainTitle}>
        {title} <strong>{highlighted}</strong>
      </h2>
      <p className={styles.mainSubtitle}>{subtitle}</p>
    </div>
  );
};
export default MainTitle;
