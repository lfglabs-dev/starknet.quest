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
};

export const Map: FunctionComponent<MapProps> = ({ mapReader, data }) => {
  const { scene } = useThree();

  useFrame(({ mouse, raycaster }) => {
    const intersects = raycaster.intersectObjects(scene.children, true);
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
