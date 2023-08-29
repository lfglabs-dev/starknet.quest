import React, { FunctionComponent, RefObject } from "react";
import { LdtkReader } from "../../utils/parser";
import Ground from "./Ground";
import RoadProps from "./RoadProps";
import Buildings from "./Buildings";
import { tileTypes } from "../../constants/tiles";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import build from "next/dist/build";

type MapProps = {
  mapReader: LdtkReader;
  data: any;
  updateBuildingRef: (newBuilding: BuildingsInfo | null) => void;
};

export const Map: FunctionComponent<MapProps> = ({
  mapReader,
  data,
  updateBuildingRef,
}) => {
  const { scene } = useThree();

  useFrame(({ mouse, raycaster }) => {
    const intersects = raycaster.intersectObjects(scene.children, true);

    let tempRayPos = new Vector3();
    const tempInter: any[] = [];
    const tempInterY: any[] = [];
    let i = 0;
    let k = 0;
    let j = 0;
    while (i < intersects.length) {
      if (
        intersects[i].point.y > -1 &&
        intersects[i].point.x > 1 &&
        intersects[i].point.z > 1
      ) {
        tempInter[k] = intersects[i].point;
        tempInterY[k] = intersects[i].point.y;
        k++;
      }
      i++;
    }
    tempInterY.sort(function (a, b) {
      return a - b;
    });
    while (j < k) {
      if (
        tempInter[j] != null &&
        tempInterY != null &&
        tempInterY[0] == tempInter[j].y
      ) {
        tempRayPos = tempInter[j];
        break;
      }
      j++;
    }
    if (tempRayPos != null) {
      const rayX = parseInt(tempRayPos.x.toFixed(2));
      const rayY = parseInt(tempRayPos.z.toFixed(2));

      if (rayX > 0 && rayY > 0) {
        if (mapReader.buildings[rayY + 1][rayX]) {
          const building: BuildingsInfo | undefined = mapReader.userNft.find(
            (nft) => nft.entity === mapReader.buildings[rayY + 1][rayX]?.ref
          );
          if (building)
            updateBuildingRef({
              ...building,
              tileData: mapReader.buildings[rayY + 1][rayX]?.tileRef,
            });
        } else {
          updateBuildingRef(null);
        }
      }
    }
  });

  return (
    <>
      {mapReader.cityBuilded ? (
        <Ground
          tileset={data?.defs.tilesets[0]}
          cityData={mapReader.cityBuilded}
        />
      ) : null}
      {mapReader.cityProps ? (
        <RoadProps
          tilesets={data?.defs.tilesets}
          cityData={mapReader.cityProps}
          tileData={mapReader.tileData[tileTypes.PROPS]}
        />
      ) : null}
      {mapReader.buildings ? (
        <Buildings
          tilesets={data?.defs.tilesets}
          buildingData={mapReader.buildings}
        />
      ) : null}
    </>
  );
};
