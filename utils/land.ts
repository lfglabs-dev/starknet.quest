import { Vector2 } from "three";
import { ClosestCorner, Coord } from "../types/land";

export const convertTo2D = (array: number[], size: number) => {
  const result: number[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

export const getOffsetFromDirection = (
  direction: string
): { offsetX: number; offsetY: number; direction: string }[] => {
  let offsets: { offsetX: number; offsetY: number; direction: string }[] = [];
  switch (direction) {
    case "left":
      offsets.push({ offsetX: -1, offsetY: 0, direction: "left" });
      break;
    case "right":
      offsets.push({ offsetX: 1, offsetY: 0, direction: "right" });
      break;
    case "top":
      offsets.push({ offsetX: 0, offsetY: -1, direction: "top" });
      break;
    case "bottom":
      offsets.push({ offsetX: 0, offsetY: 1, direction: "bottom" });
      break;
    case "random":
      offsets = [
        { offsetX: -1, offsetY: 0, direction: "left" }, // left
        { offsetX: 1, offsetY: 0, direction: "right" }, // right
        { offsetX: 0, offsetY: -1, direction: "top" }, // top
        { offsetX: 0, offsetY: 1, direction: "bottom" }, // bottom
      ];
      break;
  }
  return offsets;
};

export const getSubArray = (
  arr: number[][],
  minX: number,
  maxX: number,
  minY: number,
  maxY: number
) => {
  const myArr: number[][] = [];
  for (let i = minY; i <= maxY; i++) {
    myArr[i - minY] = [];
    for (let j = minX; j <= maxX; j++) {
      myArr[i - minY][j - minX] = arr[i][j];
    }
  }
  return myArr;
};

export const distance = (
  center: Coord,
  corner: { row: number; col: number }
) => {
  return Math.sqrt(
    Math.pow(corner.col - center.x, 2) + Math.pow(corner.row - center.y, 2)
  );
};

export const findClosestCorner = (
  center: Coord,
  corners: ClosestCorner[]
): ClosestCorner | null => {
  let closestCorner = null;
  let closestDistance = Infinity;

  for (const corner of corners) {
    const dist = distance(center, corner);
    if (dist < closestDistance) {
      closestDistance = dist;
      closestCorner = corner;
    }
  }

  return closestCorner;
};

// Computes the relative center of a bounding box given its min and max coordinates
export const computeCityCenter = (
  minX: number,
  maxX: number,
  minY: number,
  maxY: number
) => {
  return {
    x: Math.floor((minX + maxX) / 2) - minX,
    y: Math.floor((minY + maxY) / 2) - minY,
  };
};

export const needsDirectionChange = (
  closestCorner: ClosestCorner,
  subArr: any[],
  blockSize: Vector2
): boolean => {
  if (
    ((closestCorner?.corner === "topRight" ||
      closestCorner?.corner === "bottomRight") &&
      closestCorner.col < Math.floor(blockSize.x / 3)) ||
    ((closestCorner?.corner === "topLeft" ||
      closestCorner?.corner === "bottomLeft") &&
      subArr[0].length - closestCorner.col < Math.floor(blockSize.x / 3))
  ) {
    return true;
  }
  return false;
};

export const setDirectionBasedOnCorner = (
  closestCorner: ClosestCorner
): string => {
  switch (closestCorner.corner) {
    case "topRight":
      return "left";
    case "topLeft":
      return "right";
    case "bottomLeft":
      return "top";
    case "bottomRight":
      return "bottom";
  }
  return "";
};

export const getCustomDataArr = (
  customData: string
): { [key: string]: any } => {
  const res: { [key: string]: any } = {};
  const data = customData.split("|");
  data.map((d) => {
    const subData = d.split(":");
    if (subData[0] === "offset") {
      const offset = subData[1].split(",");
      res[subData[0]] = { x: parseInt(offset[0]), y: parseInt(offset[1]) };
    } else {
      res[subData[0]] = subData[1];
    }
  });
  return res;
};
