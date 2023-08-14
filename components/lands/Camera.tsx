import React, {
  useLayoutEffect,
  useRef,
  useState,
  FunctionComponent,
} from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { Vector2 } from "three";
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
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const set = useThree(({ set }) => set);
  const size = useThree(({ size }) => size);
  const [tempMousePos, setTempMousePos] = useState(new Vector2(0, 0));
  const [cameraPositionX, setCameraPositionX] = useState(
    isMobile ? cityCenter.center.x : cityCenter.boundaries.maxX - 8
  );
  const [cameraPositionY, setCameraPositionY] = useState(cityCenter.center.y);
  const [cameraPositionZ, setCameraPositionZ] = useState(cityCenter.center.y);

  useFrame(({ mouse }) => {
    if (cameraRef.current != null) {
      setCameraPositionY(15 * index);
      if (mouseRightPressed == 1) {
        const posX = cameraPositionX;
        const posZ = cameraPositionZ;

        const mouseMove = new Vector2(0, 0);
        let difX = isFirstTouch ? 0 : (tempMousePos.x - mouse.x) * 100;
        let difY = isFirstTouch ? 0 : (tempMousePos.y - mouse.y) * 100;

        if (difX < 0) difX = difX * -1;
        if (difY < 0) difY = difY * -1;

        if (tempMousePos.x < mouse.x) {
          if (cameraPositionX > cityCenter.boundaries.minX) {
            mouseMove.x = 0.1 * difX;
            setCameraPositionX(cameraPositionX - mouseMove.x);
          }
        } else if (tempMousePos.x > mouse.x) {
          if (cameraPositionX < cityCenter.boundaries.maxX) {
            mouseMove.x = 0.1 * difX;
            setCameraPositionX(cameraPositionX + mouseMove.x);
          }
        } else if (tempMousePos.x == mouse.x) {
          mouseMove.x = 0;
        }
        if (tempMousePos.y < mouse.y) {
          if (cameraPositionZ < cityCenter.boundaries.maxY) {
            mouseMove.y = 0.1 * difY;
            setCameraPositionZ(cameraPositionZ + mouseMove.y);
          }
        } else if (tempMousePos.y > mouse.y) {
          if (cameraPositionZ > cityCenter.boundaries.minY) {
            mouseMove.y = 0.1 * difY;
            setCameraPositionZ(cameraPositionZ - mouseMove.y);
          }
        } else if (tempMousePos.y == mouse.y) {
          mouseMove.y = 0;
        }
      }
      setTempMousePos(new Vector2(mouse.x, mouse.y));

      cameraRef.current.aspect = size.width / size.height;
      cameraRef.current.position.set(
        cameraPositionX,
        cameraPositionY,
        cameraPositionZ
      );
      cameraRef.current.updateProjectionMatrix();
    } // END
  });

  useLayoutEffect(() => {
    set({ camera: cameraRef.current as THREE.PerspectiveCamera });
  }, []);

  return (
    <>
      <PerspectiveCamera
        manual
        ref={cameraRef}
        fov={5}
        near={1}
        far={1000}
        rotation={[-Math.PI * 0.5, 0, 0]}
        aspect={aspect}
      />
    </>
  );
};
