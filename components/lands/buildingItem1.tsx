import { TileRect, Tileset } from "../../types/ldtk";
import React, { ReactElement } from "react";
import { memo, useMemo } from "react";
import { PlaneGeometry, Texture } from "three";

type IElem = {
  tileset: Tileset;
  pos: { posX: number; posY: number };
  tileData: TileRect;
  textureLoader: Texture;
  isNFT: boolean;
};

const BuildingItem = memo<IElem>(
  ({ tileset, tileData, pos, textureLoader, isNFT }): ReactElement => {
    const elemTexture = useMemo(() => {
      if (tileset && textureLoader) {
        const localT = textureLoader.clone();
        localT.needsUpdate = true;

        const spritesPerRow = tileset.pxWid / tileset.tileGridSize; // 80 sprites per row : 1280/16
        const spritesPerColumn = tileset.pxHei / tileset.tileGridSize; // 80 sprites per column:  1280/16
        const xIndex = tileData.x / tileset.tileGridSize;
        const yIndex = tileData.y / tileset.tileGridSize;
        const xOffset = xIndex / spritesPerRow;
        const yOffset = 1 - (yIndex + tileData.h / 16) / spritesPerColumn; // Add 1 to yIndex because the y-axis starts from the bottom, not from the top

        localT.offset.set(xOffset, yOffset);
        localT.repeat.set(
          1 / (spritesPerRow / (tileData.w / tileset.tileGridSize)),
          1 / (spritesPerColumn / (tileData.h / tileset.tileGridSize))
        );
        return localT;
      }
    }, [textureLoader, tileset, tileData]);

    const plane = useMemo(() => {
      return new PlaneGeometry(tileData.w / 16, tileData.h / 16, 1, 1);
    }, [tileData.w, tileData.h]);

    return (
      <>
        <mesh
          position={[
            pos.posX + tileData.w / 32,
            0.22 + pos.posY * 0.02,
            pos.posY - tileData.h / 32,
          ]}
          name={`${tileData.tilesetUid}_building${
            isNFT ? "_isNFT" : ""
          }`.toString()}
          rotation={[-Math.PI * 0.5, 0, 0]}
          geometry={plane}
        >
          <meshPhongMaterial
            attach="material"
            map={elemTexture}
            name={`${tileData.tilesetUid}_building`.toString() + "_mat"}
            transparent={true}
            depthWrite={false}
            depthTest={true}
          />
        </mesh>
      </>
    );
  }
);

BuildingItem.displayName = "BuildingItem";
export default BuildingItem;
