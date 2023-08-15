import React, { FunctionComponent } from "react";
import styles from "../../styles/profile.module.css";

type BuildingTooltipProps = {};

const BuildingTooltip: FunctionComponent<BuildingTooltipProps> = ({}) => {
  return (
    <div className={styles.tooltip}>
      {/* // TODO: get image from texture atlas */}
      <div className={styles.miniature}></div>
      <div className={styles.info}>
        <div className={styles.level}>Level 2</div>
        <div className={styles.buildingName}>Jediswap Big Building</div>
        <div className={styles.buildingDescription}>Get 4 Jediswap NFT</div>
      </div>
    </div>
  );
};

export default BuildingTooltip;
