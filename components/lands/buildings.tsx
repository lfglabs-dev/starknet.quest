import React, { FunctionComponent, useMemo } from "react";
import { TextureLoader, RepeatWrapping, NearestFilter, Vector2 } from "three";
import { BuildingTileProps } from "../../types/land";
import BuildingItem from "./buildingItem";
import { Tileset } from "../../types/ldtk";
import { useLoader } from "@react-three/fiber";

type BuildingsProps = {
  tilesets: Tileset[];
  buildingData: (BuildingTileProps | null)[][];
};

const Buildings: FunctionComponent<BuildingsProps> = ({
  tilesets,
  buildingData,
}) => {
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
        buildingData.map((tileX: (BuildingTileProps | null)[], iY: number) => {
          return tileX.map((tileData: BuildingTileProps | null, iX: number) => {
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
                pos={{ x: iX, y: iY }}
                isNFT={tileData.isNFT}
              />
            );
          });
        })}
    </>
  );
};

export default Buildings;
