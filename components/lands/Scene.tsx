import { Canvas } from "@react-three/fiber";
import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { NoToneMapping } from "three";
import { Camera } from "./Camera";
import { LdtkReader } from "../../utils/parser";
import { iLDtk } from "../../types/ldtk";
import { useGesture } from "@use-gesture/react";
import { TerrainBackground } from "./TerrainBackground";
import ZoomSlider from "./zoomSlider";
import { NFTData } from "../../types/nft";
import { Map } from "./Map";

type SceneProps = {
  address: string;
  userNft: NFTData;
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
  const [windowWidth, setWindowWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const [mouseRightPressed, setMouseRightPressed] = useState(0);
  const [isFirstTouch, setIsFirstTouch] = useState(false);
  const [data, setData] = useState<iLDtk>();
  const citySize = 100;
  const [mapReader, setMapReader] = useState<LdtkReader | null>(null);

  useEffect(() => {
    if (data) {
      const mapReader = new LdtkReader(data, address, citySize, userNft);
      mapReader.CreateMap("Level_0", "SIDCity_TilesetSheet");
      console.log("mapReader", mapReader);
      setMapReader(mapReader);
    }
  }, [data]);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
  }, []);

  useEffect(() => {
    fetch("/land/data/SIDCity_Base_V5.json")
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

  return (
    <>
      <Canvas
        id="canvasScene"
        gl={{ antialias: false, toneMapping: NoToneMapping }}
        linear
        {...bind()}
        onContextMenu={(event) => {
          event.preventDefault();
        }}
        style={{ touchAction: "none" }}
      >
        {mapReader ? (
          <>
            <color attach="background" args={["#1a1528"]} />
            <directionalLight color="#ffffff" intensity={3} />
            <ambientLight color="#9902fc" intensity={0.1} />
            {mapReader.cityCenter ? (
              <Camera
                aspect={windowWidth / windowHeight}
                mouseRightPressed={mouseRightPressed}
                index={index}
                isFirstTouch={isFirstTouch}
                cityCenter={mapReader.cityCenter}
                isMobile={isMobile}
              />
            ) : null}
            {data && mapReader ? (
              <Map mapReader={mapReader} data={data} />
            ) : null}
            {/* <TerrainBackground /> */}
          </>
        ) : null}
      </Canvas>
      <ZoomSlider updateZoomIndex={updateZoomIndex} maxValue={maxZoom} />
    </>
  );
};
