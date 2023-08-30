import React, { FunctionComponent } from "react";
import { LdtkReader } from "../../utils/parser";
import Ground from "./Ground";
import RoadProps from "./RoadProps";
import Buildings from "./Buildings";
import { tileTypes } from "../../constants/tiles";
import { useFrame, useThree } from "@react-three/fiber";

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

    let buildingData = null;
    let tooltipPosition = null;

    // Loop through all intersected objects
    for (let i = 0; i < intersects.length; i++) {
      const object = intersects[i].object;

      // If the object's name includes "isNFT", process it
      if (object.name.includes("isNFT")) {
        const point = intersects[i].point;
        if (point.y > -1 && point.x > 1 && point.z > 1) {
          const rayX = parseInt(point.x.toFixed(2));
          const rayY = parseInt(point.z.toFixed(2));
          // Find the building data based on the intersected object
          buildingData = mapReader.userNft.find(
            (nft) => nft.entity === mapReader.buildings[rayY + 1][rayX]?.ref
          );

          if (buildingData) {
            tooltipPosition = mouse; // send mouse position to place tooltip
            break; // Break the loop as we've found our object
          }
        }
      }
    }
    if (buildingData && tooltipPosition) {
      updateBuildingRef({
        ...buildingData,
        pos: tooltipPosition,
      });
    } else {
      updateBuildingRef(null);
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
