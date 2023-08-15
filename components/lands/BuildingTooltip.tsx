import React, { FunctionComponent } from "react";
import styles from "../../styles/components/tooltip.module.css";
import { TileRect } from "../../types/ldtk";

type BuildingTooltipProps = {
  level: number;
  name: string;
  description: string;
  tileData: TileRect;
};

const BuildingTooltip: FunctionComponent<BuildingTooltipProps> = ({
  level,
  name,
  description,
  tileData,
}) => {
  // {tilesetUid: 169, x: 416, y: 400, w: 64, h: 96}
  return (
    <div className={styles.tooltip}>
      <div className={styles.miniature}>
        <div
          className={styles.img}
          style={{
            backgroundPosition: `calc((-${tileData.x}px * 45 / ${tileData.h}) + 8px) calc((-${tileData.y}px * 45 / ${tileData.h}))`,
            backgroundSize: `calc(1280px * 45 / ${tileData.h}) calc(1280px * 45 / ${tileData.h})`,
          }}
        />
      </div>
      <div className={styles.info}>
        <div className={styles.level}>Level {level}</div>
        <div className={styles.name}>{name}</div>
        <div className={styles.description}>{description}</div>
      </div>
    </div>
  );
};

export default BuildingTooltip;
