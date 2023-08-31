import React, { ReactElement, useMemo } from "react";
import { TextureLoader, RepeatWrapping, NearestFilter, Vector2 } from "three";
import { BuildingTileProps } from "../../types/land";
import BuildingItem from "./buildingItem";
import { Tileset } from "../../types/ldtk";
import { useLoader } from "@react-three/fiber";

type IBuildings = {
  tilesets: Tileset[];
  buildingData: Array<Array<BuildingTileProps | null>>;
};

export default function Buildings({
  tilesets,
  buildingData,
}: IBuildings): ReactElement | null {
  const buildingTexture = useMemo(() => {
    const texture = useLoader(
      TextureLoader,
      "/land/textures/SID_BuildingSheet.png"
    );
    const tileset = tilesets[2];
    texture.repeat = new Vector2(1 / tileset.__cHei, 1 / tileset.__cWid);
    texture.magFilter = NearestFilter;
    texture.wrapS = texture.wrapT = RepeatWrapping;
    return texture;
  }, [tilesets]);

  return (
    <>
      {buildingTexture &&
        buildingData.map(
          (tileX: Array<BuildingTileProps | null>, iY: number) => {
            return tileX.map(
              (tileData: BuildingTileProps | null, iX: number) => {
                if (
                  tileData === null ||
                  tileData.tile === undefined ||
                  tileData.tile === null
                ) {
                  return null;
                }
                return (
                  <BuildingItem
                    key={`building-${iX}-${iY}`}
                    tileset={
                      tilesets.filter(
                        (tileset) => tileset.uid === tileData.tile.tilesetUid
                      )[0]
                    }
                    textureLoader={buildingTexture}
                    tileData={tileData.tile}
                    pos={{ posX: iX, posY: iY }}
                    isNFT={tileData.isNFT}
                  />
                );
              }
            );
          }
        )}
    </>
  );
}
