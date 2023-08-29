import React, { ReactElement, useMemo } from "react";
import { TextureLoader, RepeatWrapping, NearestFilter, Vector2 } from "three";
import { CityProps, TileData } from "../../types/land";
import { Tileset } from "../../types/ldtk";
import { useLoader } from "@react-three/fiber";
import PropItem from "./PropItem";

type IProps = {
  tilesets: Tileset[];
  cityData: Array<Array<CityProps | null>>;
  tileData: TileData[];
};

export default function RoadProps({
  tilesets,
  cityData,
  tileData,
}: IProps): ReactElement | null {
  const buildingTexture = useMemo(() => {
    const texture = useLoader(
      TextureLoader,
      "/land/textures/SID_BuildingSheet.png"
    );
    texture.repeat = new Vector2(1 / 80, 1 / 80);
    texture.magFilter = NearestFilter;
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;

    return texture;
  }, []);

  const tileset = useMemo(() => {
    return tilesets.find(
      (tileset: Tileset) => tileset.identifier === "SID_BuildingSheet"
    );
  }, []);

  return (
    <>
      {buildingTexture &&
        tileset &&
        cityData.map((tileX: (CityProps | null)[], iY: number) => {
          return tileX.map((elem: CityProps | null, iX: number) => {
            if (elem === null) {
              return null;
            }
            return (
              <PropItem
                key={`props-${iX}-${iY}`}
                tileset={tileset}
                textureLoader={buildingTexture}
                tileData={tileData[elem.entityType]}
                pos={{ posX: iX, posY: iY }}
                propData={elem}
              />
            );
          });
        })}
    </>
  );
}
