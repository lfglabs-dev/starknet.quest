import React, { useRef, FunctionComponent, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { Vector2, Vector3 } from "three";
import { CityCenterProps } from "../../types/land";

type CameraProps = {
  aspect: number;
  mouseRightPressed?: number;
  mouseWheelProp?: number;
  index: number;
  isFirstTouch: boolean;
  cityCenter: CityCenterProps;
  isMobile: boolean;
};

export const Camera: FunctionComponent<CameraProps> = ({
  aspect,
  mouseRightPressed,
  index,
  isFirstTouch,
  cityCenter,
  isMobile,
}) => {
  const set = useThree(({ set }) => set);
  const size = useThree(({ size }) => size);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const tempMouseRef = useRef<Vector2>(new Vector2(0, 0));
  const mouseMoveRef = useRef<Vector2>(new Vector2(0, 0));
  const cameraPosRef = useRef<Vector3>(
    new Vector3(
      isMobile ? cityCenter.center.x : cityCenter.boundaries.maxX - 8,
      cityCenter.center.y,
      cityCenter.center.y
    )
  );

  useEffect(() => {
    cameraPosRef.current.setY(15 * index);
  }, [index]);

  useFrame(({ mouse }) => {
    if (
      cameraRef.current != null &&
      tempMouseRef.current != null &&
      mouseMoveRef.current != null &&
      cameraPosRef.current != null
    ) {
      if (mouseRightPressed == 1) {
        mouseMoveRef.current.set(0, 0);
        let difX = isFirstTouch ? 0 : (tempMouseRef.current.x - mouse.x) * 100;
        let difY = isFirstTouch ? 0 : (tempMouseRef.current.y - mouse.y) * 100;

        if (difX < 0) difX = difX * -1;
        if (difY < 0) difY = difY * -1;

        if (tempMouseRef.current.x < mouse.x) {
          if (cameraPosRef.current.x > cityCenter.boundaries.minX) {
            mouseMoveRef.current.setX(0.1 * difX);
            cameraPosRef.current.setX(
              cameraPosRef.current.x - mouseMoveRef.current.x
            );
          }
        } else if (tempMouseRef.current.x > mouse.x) {
          if (cameraPosRef.current.x < cityCenter.boundaries.maxX) {
            mouseMoveRef.current.setX(0.1 * difX);
            cameraPosRef.current.setX(
              cameraPosRef.current.x + mouseMoveRef.current.x
            );
          }
        } else if (tempMouseRef.current.x == mouse.x) {
          mouseMoveRef.current.x = 0;
        }
        if (tempMouseRef.current.y < mouse.y) {
          if (cameraPosRef.current.z < cityCenter.boundaries.maxY) {
            mouseMoveRef.current.setY(0.1 * difY);
            cameraPosRef.current.setZ(
              cameraPosRef.current.z + mouseMoveRef.current.y
            );
          }
        } else if (tempMouseRef.current.y > mouse.y) {
          if (cameraPosRef.current.z > cityCenter.boundaries.minY) {
            mouseMoveRef.current.setY(0.1 * difY);
            cameraPosRef.current.setZ(
              cameraPosRef.current.z - mouseMoveRef.current.y
            );
          }
        } else if (tempMouseRef.current.y == mouse.y) {
          mouseMoveRef.current.setY(0);
        }
      }
      tempMouseRef.current.set(mouse.x, mouse.y);

      cameraRef.current.aspect = size.width / size.height;
      cameraRef.current.position.set(
        cameraPosRef.current.x,
        cameraPosRef.current.y,
        cameraPosRef.current.z
      );
      cameraRef.current.updateProjectionMatrix();
    }
  });

  useEffect(() => {
    set({ camera: cameraRef.current as THREE.PerspectiveCamera });
  }, []);

  return (
    <PerspectiveCamera
      manual
      ref={cameraRef}
      fov={5}
      near={1}
      far={1000}
      rotation={[-Math.PI * 0.5, 0, 0]}
      aspect={aspect}
    />
  );
};
