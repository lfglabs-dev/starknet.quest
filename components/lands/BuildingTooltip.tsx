import React, { FunctionComponent, RefObject } from "react";
import styles from "../../styles/components/tooltip.module.css";

type BuildingTooltipProps = {
  buildingRef: RefObject<BuildingsInfo | null>;
};

const BuildingTooltip: FunctionComponent<BuildingTooltipProps> = ({
  buildingRef,
}) => {
  const building = buildingRef.current;
  if (!building || !building.tileData) return null;
  return (
    <div className={styles.tooltip}>
      <div className={styles.miniature}>
        <div
          className={styles.img}
          style={{
            backgroundPosition: `calc((-${building.tileData.x}px * 45 / ${building.tileData.h})) calc((-${building.tileData.y}px * 45 / ${building.tileData.h}))`,
            backgroundSize: `calc(1280px * 45 / ${building.tileData.h}) calc(1280px * 45 / ${building.tileData.h})`,
          }}
        />
      </div>
      <div className={styles.info}>
        <div className={styles.level}>Level {building.level}</div>
        <div className={styles.name}>{building.name}</div>
        <div className={styles.description}>{building.description}</div>
      </div>
    </div>
  );
};

export default BuildingTooltip;
