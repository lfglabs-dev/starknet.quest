import React, { ReactElement, useMemo } from "react";
import { TextureLoader, RepeatWrapping, NearestFilter, Vector2 } from "three";
import { CityBuildings } from "../../types/land";
import BuildingItem from "./BuildingItem";
import { Tileset } from "../../types/ldtk";
import { useLoader } from "@react-three/fiber";

type IBuildings = {
  tilesets: Tileset[];
  buildingData: Array<Array<CityBuildings | null>>;
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
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    return texture;
  }, []);

  return (
    <>
      {buildingTexture &&
        buildingData.map((tileX: Array<CityBuildings | null>, iY: number) => {
          return tileX.map((tileData: CityBuildings | null, iX: number) => {
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
              />
            );
          });
        })}
    </>
  );
}
