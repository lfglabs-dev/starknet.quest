import React, { ReactElement, useMemo } from "react";
import {
  TextureLoader,
  RepeatWrapping,
  NearestFilter,
  Vector2,
  PlaneGeometry,
} from "three";
import GroundItem from "./GroundItem";
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
  const groundTexture = useMemo(() => {
    const textObj = useLoader(
      TextureLoader,
      "/land/textures/SIDCity_TilesetSheet.png"
    );
    textObj.repeat = new Vector2(1 / tileset.__cHei, 1 / tileset.__cWid);
    textObj.magFilter = NearestFilter;
    textObj.wrapS = textObj.wrapT = RepeatWrapping;
    return textObj;
  }, [tileset]);

  const plane = useMemo(() => {
    return new PlaneGeometry(1, 1, 1, 1);
  }, []);

  return (
    <>
      {groundTexture &&
        cityData.map((tileX: Array<CityBuilded | null>, iY: number) => {
          return tileX.map((tileData: CityBuilded | null, iX: number) => {
            if (tileData === null || tileData.tileId === undefined) {
              return null;
            }
            return (
              <GroundItem
                key={`ground-${iX}-${iY}`}
                tileset={tileset}
                groundTexture={groundTexture}
                tileData={tileData}
                pos={{ posX: iX, posY: iY }}
                plane={plane}
              />
            );
          });
        })}
    </>
  );
}
