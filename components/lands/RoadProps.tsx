import React, { ReactElement } from "react";
import { TextureLoader, RepeatWrapping, NearestFilter, Vector2 } from "three";
import { CityProps, TileData } from "../../types/land";
import { Tileset } from "../../types/ldtk";
import { useLoader } from "@react-three/fiber";
import PropItem from "./PropItem";

type IProps = {
  tilesets: Tileset[];
  cityData: any;
  tileData: TileData[];
};

export default function RoadProps({
  tilesets,
  cityData,
  tileData,
}: IProps): ReactElement | null {
  const buildingTexture = useLoader(
    TextureLoader,
    "/land/textures/SID_BuildingSheet.png"
  );
  const tileset = tilesets.find(
    (tileset: Tileset) => tileset.identifier === "SID_BuildingSheet"
  );
  buildingTexture.repeat = new Vector2(1 / 80, 1 / 80);
  buildingTexture.magFilter = NearestFilter;
  buildingTexture.wrapS = RepeatWrapping;
  buildingTexture.wrapT = RepeatWrapping;

  return (
    <>
      {buildingTexture &&
        cityData.map((tileX: any, iY: number) => {
          return tileX.map((elem: CityProps, iX: number) => {
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
