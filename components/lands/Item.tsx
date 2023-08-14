import { CityBuilded } from "../../types/land";
import { useFrame } from "@react-three/fiber";
import React, { ReactElement, memo, useMemo, useRef, useState } from "react";
import { MeshPhongMaterial, PlaneGeometry, Texture } from "three";
import { Tileset } from "../../types/ldtk";

type IElem = {
  tileset: Tileset;
  pos: { posX: number; posY: number };
  tileData: CityBuilded;
  textureLoader: Texture;
};

const ResourceItem = memo<IElem>(
  ({ tileset, tileData, pos, textureLoader }): ReactElement => {
    const meshRef = useRef<THREE.Mesh>(null);
    const [localTexture, setLocalTexture] = useState<Texture>();
    const plane = new PlaneGeometry(1, 1, 1, 1);
    const material = new MeshPhongMaterial({
      map: localTexture,
      transparent: true,
    });

    const elemTexture = useMemo(() => {
      if (tileset && textureLoader) {
        const localT = textureLoader.clone();
        localT.needsUpdate = true;

        const spritesPerRow = tileset.pxWid / tileset.tileGridSize; // 40 sprites per row : 640/16
        const spritesPerColumn = tileset.pxHei / tileset.tileGridSize; // 40 sprites per column:  640/16
        const xIndex = tileData.tileId % spritesPerRow;
        const yIndex = Math.floor(tileData.tileId / spritesPerColumn);
        // Texture coordinates are normalized between 0 and 1. We divide by the number of sprites per row or column to get the offset.
        const xOffset = xIndex / spritesPerRow;
        const yOffset = 1 - (yIndex / spritesPerColumn + 1 / spritesPerColumn);
        localT.offset.set(xOffset, yOffset);
        setLocalTexture(localT);
        return localT;
      }
    }, [textureLoader, tileset, tileData]);

    useFrame(() => {
      if (!meshRef || !meshRef.current) {
        return;
      }

      if (meshRef.current && localTexture) {
        if (tileData.flipX) {
          meshRef.current.scale.x = -1;
        } else {
          meshRef.current.scale.x = 1;
        }
        if (tileData.flipY) {
          meshRef.current.scale.y = -1;
        } else {
          meshRef.current.scale.y = 1;
        }
      }
    });

    return (
      <>
        <mesh
          ref={meshRef}
          position={[pos.posX + 0.5, 0.22, pos.posY - 0.5]}
          name={`nameblock`.toString()}
          rotation={[-Math.PI * 0.5, 0, 0]}
          geometry={plane}
          material={material}
        ></mesh>
      </>
    );
  }
);

ResourceItem.displayName = "ResourceItem";
export default ResourceItem;
