import { GroundTileProps } from "../../types/land";
import React, { ReactElement, memo, useMemo } from "react";
import { MeshPhongMaterial, PlaneGeometry, Texture } from "three";
import { Tileset } from "../../types/ldtk";

type IElem = {
  tileset: Tileset;
  pos: { posX: number; posY: number };
  tileData: GroundTileProps;
  groundTexture: Texture;
  plane: PlaneGeometry;
};

const GroundItem = memo<IElem>(
  ({ tileset, tileData, pos, groundTexture, plane }): ReactElement => {
    const itemTexture = useMemo(() => {
      if (tileset && groundTexture) {
        const localT = groundTexture.clone();
        localT.needsUpdate = true;

        const spritesPerRow = tileset.pxWid / tileset.tileGridSize; // 40 sprites per row : 640/16
        const spritesPerColumn = tileset.pxHei / tileset.tileGridSize; // 40 sprites per column:  640/16
        const xIndex = tileData.tileId % spritesPerRow;
        const yIndex = Math.floor(tileData.tileId / spritesPerColumn);
        // Texture coordinates are normalized between 0 and 1. We divide by the number of sprites per row or column to get the offset.
        const xOffset = xIndex / spritesPerRow;
        const yOffset = 1 - (yIndex / spritesPerColumn + 1 / spritesPerColumn);
        localT.offset.set(xOffset, yOffset);
        return localT;
      }
    }, [groundTexture, tileset, tileData]);

    const material = useMemo(() => {
      return new MeshPhongMaterial({
        map: itemTexture,
        transparent: true,
      });
    }, [itemTexture]);

    return (
      <mesh
        position={[pos.posX + 0.5, 0.22, pos.posY - 0.5]}
        name={`groundItem_${pos.posX}_${pos.posY}`.toString()}
        rotation={[-Math.PI * 0.5, 0, 0]}
        geometry={plane}
        material={material}
        scale={[tileData.flipX ? -1 : 1, tileData.flipY ? -1 : 1, 1]}
      ></mesh>
    );
  }
);

GroundItem.displayName = "GroundItem";
export default GroundItem;
