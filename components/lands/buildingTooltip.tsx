import React, { FunctionComponent } from "react";
import styles from "../../styles/components/tooltip.module.css";

type BuildingTooltipProps = {
  building?: BuildingsInfo | null;
  pos: { x: number; y: number };
};

const BuildingTooltip: FunctionComponent<BuildingTooltipProps> = ({
  building,
  pos,
}) => {
  if (!building) return null;
  return (
    <div className={styles.tooltip} style={{ left: pos.x, top: pos.y }}>
      <div className={styles.level}>Level {building.level}</div>
      <div className={styles.name}>{building.name}</div>
      <div className={styles.description}>{building.description}</div>
    </div>
  );
};

export default BuildingTooltip;
