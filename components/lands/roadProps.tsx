import React, { FunctionComponent, useMemo } from "react";
import {
  TextureLoader,
  RepeatWrapping,
  NearestFilter,
  Vector2,
  PlaneGeometry,
} from "three";
import { RoadObjects, TileData } from "types/land";
import { Tileset } from "types/ldtk";
import { useLoader } from "@react-three/fiber";
import RoadItem from "./roadItem";

type RoadItemsProps = {
  tileset: Tileset;
  cityData: (RoadObjects | null)[][];
  tileData: TileData[];
};

const RoadProps: FunctionComponent<RoadItemsProps> = ({
  tileset,
  cityData,
  tileData,
}) => {
  const buildingTexture = useMemo(() => {
    const texture = useLoader(
      TextureLoader,
      "/land/textures/SID_BuildingSheet.png"
    );
    texture.repeat = new Vector2(1 / tileset.__cHei, 1 / tileset.__cWid);
    texture.magFilter = NearestFilter;
    texture.wrapS = texture.wrapT = RepeatWrapping;

    return texture;
  }, []);

  // Reuse same planes for props
  const simplePlane = useMemo(() => {
    // used for bench, sewerPlate & firehydrant props
    return new PlaneGeometry(1, 1, 1, 1);
  }, []);

  const streetLightPlane = useMemo(() => {
    return new PlaneGeometry(1, 2, 1, 1);
  }, []);

  const treePlane = useMemo(() => {
    return new PlaneGeometry(2, 2, 1, 1);
  }, []);

  return (
    <>
      {buildingTexture &&
        tileset &&
        cityData.map((tileX: (RoadObjects | null)[], iY: number) => {
          return tileX.map((elem: RoadObjects | null, iX: number) => {
            if (elem === null) {
              return null;
            }
            return (
              <RoadItem
                key={`props-${iX}-${iY}`}
                tileset={tileset}
                buildingTexture={buildingTexture}
                tileData={tileData[elem.entityType]}
                pos={{ x: iX, y: iY }}
                propData={elem}
                plane={
                  elem.entityType === 0
                    ? streetLightPlane
                    : elem.entityType === 1
                    ? treePlane
                    : simplePlane
                }
              />
            );
          });
        })}
    </>
  );
};

export default RoadProps;
