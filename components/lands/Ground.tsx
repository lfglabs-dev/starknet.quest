import React, { ReactElement } from "react";
import { TextureLoader, RepeatWrapping, NearestFilter, Vector2 } from "three";
import ResourceItem from "./Item";
import { CityBuilded } from "../../types/land";
import { useLoader } from "@react-three/fiber";
import { Tileset } from "../../types/ldtk";

type IGround = {
  tileset: Tileset;
  cityData: Array<Array<CityBuilded | null>>;
};

export default function Ground({
  tileset,
  cityData,
}: IGround): ReactElement | null {
  const groundTexture = useLoader(
    TextureLoader,
    "/land/textures/SIDCity_TilesetSheet.png"
  );
  groundTexture.repeat = new Vector2(1 / tileset.__cHei, 1 / tileset.__cWid);
  groundTexture.magFilter = NearestFilter;
  groundTexture.wrapS = RepeatWrapping;
  groundTexture.wrapT = RepeatWrapping;

  return (
    <>
      {groundTexture &&
        cityData.map((tileX: Array<CityBuilded | null>, iY: number) => {
          return tileX.map((tileData: CityBuilded | null, iX: number) => {
            if (tileData === null || tileData.tileId === undefined) {
              return null;
            }
            return (
              <ResourceItem
                key={`tile-${iX}-${iY}`}
                tileset={tileset}
                textureLoader={groundTexture}
                tileData={tileData}
                pos={{ posX: iX, posY: iY }}
              />
            );
          });
        })}
    </>
  );
}
