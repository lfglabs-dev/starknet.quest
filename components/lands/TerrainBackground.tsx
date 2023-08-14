import { useFrame, useLoader } from "@react-three/fiber";
import React, {
  ReactElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  TextureLoader,
  RepeatWrapping,
  NearestFilter,
  PlaneGeometry,
} from "three";

export const TerrainBackground = (): ReactElement | null => {
  const skyRef = useRef<any>();
  const [spriteData, setSpriteData] = useState<any>();
  const posX = [-20, -10, 0, 10, 20, 30, 40, 50, 60, 70, 80];
  const posY = [-10, 0, 10, 20, 30, 40, 50, 60, 70, 80];
  const skyTexture = useLoader(
    TextureLoader,
    "land/textures/background/SID_Background_SpaceLoop_old.png"
  );
  skyTexture.wrapS = skyTexture.wrapT = RepeatWrapping;
  skyTexture.magFilter = NearestFilter;

  useEffect(() => {
    fetch("land/data/SID_Background_SpaceLoop.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((jsonData) => {
        setSpriteData(jsonData);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  const frames = useMemo(() => {
    if (spriteData) return Object.values(spriteData.frames) as any;
  }, [spriteData]);

  useFrame(({ clock }) => {
    if (frames && skyRef.current) {
      const index = Math.floor((clock.getElapsedTime() * 10) % frames.length);
      const { frame } = frames[index];
      skyTexture.offset.set(
        frame.x / spriteData.meta.size.w,
        1 - frame.y / spriteData.meta.size.h - frame.h / spriteData.meta.size.h
      );
      skyTexture.repeat.set(
        frame.w / spriteData.meta.size.w,
        frame.h / spriteData.meta.size.h
      );
      skyTexture.needsUpdate = true;
      skyRef.current.map = skyTexture;
    }
  });

  const plane = useMemo(() => {
    return new PlaneGeometry(10, 10, 1, 1);
  }, []);

  return (
    <>
      {posX.map((x, i) => {
        return posY.map((y, j) => {
          return (
            <mesh
              key={`${x}-${y}`}
              position={[x, -0.2, y]}
              name={"terrainBackgroundGeometry_" + i + j}
              rotation={[-Math.PI * 0.5, 0, 0]}
              geometry={plane}
            >
              <meshBasicMaterial
                ref={skyRef}
                attach="material"
                map={skyTexture}
                name={"terrainBackgroundGeometry_" + i + j}
                transparent={true}
                depthWrite={false}
                depthTest={true}
              />
            </mesh>
          );
        });
      })}
    </>
  );
};
