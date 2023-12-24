import { Canvas } from "@react-three/fiber";
import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { NoToneMapping } from "three";
import { Camera } from "./camera";
import { LdtkReader } from "../../utils/parser";
import { iLDtk } from "types/ldtk";
import { useGesture } from "@use-gesture/react";
import ZoomSlider from "./zoomSlider";
import { Map } from "./map";
import BuildingTooltip from "./buildingTooltip";
import styles from "@styles/components/land.module.css";

type SceneProps = {
  address: string;
  userNft: BuildingsInfo[];
  isMobile: boolean;
};

export const Scene: FunctionComponent<SceneProps> = ({
  address,
  userNft,
  isMobile,
}) => {
  const maxZoom = isMobile ? 50 : 30;
  const indexRef = useRef<number>();
  const [index, setIndex] = useState(maxZoom);
  indexRef.current = index;
  const [mouseRightPressed, setMouseRightPressed] = useState(0);
  const [isFirstTouch, setIsFirstTouch] = useState(false);
  const [data, setData] = useState<iLDtk>();
  const citySize = 100;
  const [mapReader, setMapReader] = useState<LdtkReader | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeBuilding, setActiveBuilding] = useState<BuildingsInfo | null>(
    null
  );

  useEffect(() => {
    if (data) {
      const mapReader = new LdtkReader(data, address, citySize, userNft);
      mapReader.CreateMap(); // init land data
      setMapReader(mapReader);
    }
  }, [data]);

  useEffect(() => {
    fetch("/land/data/SIDCity_Base.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((jsonData) => {
        setData(jsonData);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  const bind = useGesture({
    onDrag: ({ first, down, pinching, cancel }) => {
      if (window.innerWidth < 768) return;
      if (first) setIsFirstTouch(true);
      else setIsFirstTouch(false);
      if (pinching) return cancel();
      if (down) {
        setMouseRightPressed(1);
      } else {
        setMouseRightPressed(0);
      }
    },
  });

  const updateZoomIndex = (newValue: number) => {
    setIndex(() => newValue);
  };

  const updateBuildingRef = (newBuilding: BuildingsInfo | null) => {
    if (
      (!newBuilding && activeBuilding) ||
      (newBuilding && !activeBuilding) ||
      newBuilding?.name !== activeBuilding?.name
    ) {
      setActiveBuilding(newBuilding);
      if (newBuilding) {
        setShowTooltip(true);
        if (newBuilding.pos) {
          let posX = ((newBuilding.pos.x + 1) / 2) * window.innerWidth;
          const posY = (-(newBuilding.pos.y - 1) / 2) * window.innerHeight;
          // If the building is too close to the profile menu, move it to the left
          if (posX > window.innerWidth - 475) {
            posX = posX - 285;
          }
          setMousePosition({ x: posX, y: posY });
        }
      } else setShowTooltip(false);
    }
  };

  return (
    <>
      <Canvas
        id="canvasScene"
        gl={{ antialias: false, toneMapping: NoToneMapping, alpha: true }}
        linear
        {...bind()}
        onContextMenu={(event) => {
          event.preventDefault();
        }}
        className={styles.canvas}
      >
        {mapReader ? (
          <>
            <directionalLight color="#ffffff" intensity={3} />
            <ambientLight color="#9902fc" intensity={0.1} />
            {mapReader.cityCenter ? (
              <Camera
                aspect={window.innerWidth / window.innerHeight}
                mouseRightPressed={mouseRightPressed}
                index={index}
                isFirstTouch={isFirstTouch}
                cityCenter={mapReader.cityCenter}
                isMobile={isMobile}
              />
            ) : null}
            {data && mapReader ? (
              <Map
                mapReader={mapReader}
                data={data}
                updateBuildingRef={updateBuildingRef}
              />
            ) : null}
          </>
        ) : null}
      </Canvas>
      <ZoomSlider updateZoomIndex={updateZoomIndex} maxValue={maxZoom} />
      {showTooltip ? (
        <BuildingTooltip building={activeBuilding} pos={mousePosition} />
      ) : null}
    </>
  );
};
