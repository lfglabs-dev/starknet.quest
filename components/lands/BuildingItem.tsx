import { TileRect } from "../../types/ldtk";
import React from "react";
import { memo, useMemo, useState } from "react";
import { PlaneGeometry, Texture } from "three";
import { Coord } from "../../types/land";

type IElem = {
  tileset: any;
  pos: { posX: number; posY: number };
  tileData: TileRect;
  textureLoader: Texture;
  neonTexture: Texture;
};

const BuildingItem = memo<IElem>(
  ({ tileset, tileData, pos, textureLoader, neonTexture }): any => {
    const [offset, setOffset] = useState<Coord>();
    const [repeat, setRepeat] = useState<Coord>();

    const elemTexture = useMemo(() => {
      if (tileset && textureLoader) {
        const localT = textureLoader.clone();
        localT.needsUpdate = true;

        let spritesPerRow = tileset.pxWid / tileset.tileGridSize; // 80 sprites per row : 1280/16
        let spritesPerColumn = tileset.pxHei / tileset.tileGridSize; // 80 sprites per column:  1280/16
        let xIndex = tileData.x / tileset.tileGridSize;
        let yIndex = tileData.y / tileset.tileGridSize;
        let xOffset = xIndex / spritesPerRow;
        let yOffset = 1 - (yIndex + tileData.h / 16) / spritesPerColumn; // Add 1 to yIndex because the y-axis starts from the bottom, not from the top

        localT.offset.set(xOffset, yOffset);
        localT.repeat.set(
          1 / (spritesPerRow / (tileData.w / tileset.tileGridSize)),
          1 / (spritesPerColumn / (tileData.h / tileset.tileGridSize))
        );

        setOffset({ x: xOffset, y: yOffset });
        setRepeat({
          x: 1 / (spritesPerRow / (tileData.w / tileset.tileGridSize)),
          y: 1 / (spritesPerColumn / (tileData.h / tileset.tileGridSize)),
        });
        return localT;
      }
    }, [textureLoader, tileset, tileData]);

    const neon = useMemo(() => {
      if (neonTexture && offset && repeat) {
        const localT = neonTexture.clone();
        localT.needsUpdate = true;
        localT.offset.set(offset.x, offset.y);
        localT.repeat.set(repeat.x, repeat.y);
        return localT;
      }
    }, [neonTexture, tileset, tileData, offset, repeat]);

    const plane = useMemo(() => {
      return new PlaneGeometry(tileData.w / 16, tileData.h / 16, 1, 1);
    }, [tileData]);

    return (
      <>
        <mesh
          position={[
            pos.posX + tileData.w / 32,
            0.22 + pos.posY * 0.02,
            pos.posY - tileData.h / 32,
          ]}
          name={`${tileData.tilesetUid}_building`.toString()}
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
