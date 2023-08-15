import { Vector2 } from "three";
import { CityBuildings, ClosestCorner, Coord } from "../types/land";
import { EntityProps, TileRect } from "../types/ldtk";

export const convertTo2D = (array: Array<number>, size: number) => {
  let result: Array<Array<number>> = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

export const findRectangleCorners = (
  array: number[][],
  startX: number,
  startY: number
) => {
  const visited = array.map((row) => row.map(() => false));

  let topLeft = { x: Infinity, y: Infinity };
  let bottomRight = { x: -Infinity, y: -Infinity };

  function dfs(x: number, y: number) {
    if (x < 0 || x >= array[0].length || y < 0 || y >= array.length) {
      return;
    }

    if (array[y][x] === 0 || visited[y][x]) {
      return;
    }

    visited[y][x] = true;

    topLeft.x = Math.min(topLeft.x, x);
    topLeft.y = Math.min(topLeft.y, y);
    bottomRight.x = Math.max(bottomRight.x, x);
    bottomRight.y = Math.max(bottomRight.y, y);

    dfs(x + 1, y);
    dfs(x - 1, y);
    dfs(x, y + 1);
    dfs(x, y - 1);
  }

  dfs(startX, startY);

  console.log("visited", visited);

  return { topLeft, bottomRight };
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

export const printSubArray = (
  arr: any[][],
  minX: number,
  maxX: number,
  minY: number,
  maxY: number
) => {
  let myArr: number[][] = [];
  for (let i = minY; i <= maxY; i++) {
    myArr[i] = [];
    let row = [];
    for (let j = minX; j <= maxX; j++) {
      myArr[i][j] = arr[i][j];
      row.push({ value: arr[i][j], y: i, x: j });
    }
  }
  console.log("myArr", myArr);
};

export const getSubArray = (
  arr: number[][],
  minX: number,
  maxX: number,
  minY: number,
  maxY: number
) => {
  let myArr: number[][] = [];
  for (let i = minY; i <= maxY; i++) {
    myArr[i - minY] = [];
    for (let j = minX; j <= maxX; j++) {
      myArr[i - minY][j - minX] = arr[i][j];
    }
  }
  return myArr;
};

export const decompose = (
  n: number,
  curr: any[] = [],
  solutions: any[] = []
) => {
  // Base case: if n is 0, we have found a valid decomposition
  if (n === 0) {
    const sortedCurr = curr.sort((a, b) => a - b);
    if (
      !solutions.find(
        (sol) => JSON.stringify(sol) === JSON.stringify(sortedCurr)
      )
    ) {
      solutions.push(sortedCurr);
    }
  } else {
    // Try subtracting 2, 3, 4, and 5 from n
    for (let i = 2; i <= 6; i++) {
      if (n - i >= 0) {
        decompose(n - i, [...curr, i], solutions);
      }
    }
  }

  return solutions;
};

export const shuffleArray = (array: number[], seed: number) => {
  const rand = seedRand(seed);
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(rand() * (i + 1)); // random index from 0 to i
    // swap elements array[i] and array[j]
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

function seedRand(seed: number) {
  return function () {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

export const shuffleAndHandleCorners = (
  array: EntityProps[],
  rand: number
): EntityProps[] => {
  const cornerLeftEntity = array.find(
    (entity) => entity.corner === "CornerLeft"
  );
  const cornerRightEntity = array.find(
    (entity) => entity.corner === "CornerRight"
  );
  let restOfEntities = array.filter(
    (entity) =>
      entity.corner !== "CornerLeft" && entity.corner !== "CornerRight"
  );

  for (let i = restOfEntities.length - 1; i > 0; i--) {
    let j = Math.floor(rand * (i + 1));
    [restOfEntities[i], restOfEntities[j]] = [
      restOfEntities[j],
      restOfEntities[i],
    ];
  }

  if (cornerLeftEntity) {
    restOfEntities.unshift(cornerLeftEntity);
  }

  if (cornerRightEntity) {
    restOfEntities.push(cornerRightEntity);
  }

  return restOfEntities;
};

const distance = (center: Coord, corner: { row: number; col: number }) => {
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
    let dist = distance(center, corner);
    if (dist < closestDistance) {
      closestDistance = dist;
      closestCorner = corner;
    }
  }

  return closestCorner;
};

export const calculateCityCenter = (
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
) => {
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

export const getValFromCustomData = (
  val: string,
  customData: string
): string | null => {
  let data = customData.split("|");
  for (let i = 0; i < data.length; i++) {
    const subData = data[i].split(":");
    if (subData[0] === val) {
      return subData[1];
    }
  }
  return null;
};

export const getCustomDataArr = (
  customData: string
): { [key: string]: any } => {
  let res: { [key: string]: any } = {};
  let data = customData.split("|");
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

export const findBottomLeftCorner = (
  map: Array<Array<CityBuildings | null>>,
  x: number,
  y: number
): { x: number; y: number; tileData: TileRect } | null => {
  if (map[y][x] === null) {
    return null;
  }

  let currentX = x;
  let currentY = y;
  while (
    map[currentY + 1] &&
    map[currentY + 1][currentX] &&
    map[currentY + 1][currentX]?.tile === null
  ) {
    currentY++;
  }
  while (
    map[currentY][currentX - 1] &&
    map[currentY][currentX - 1]?.tile === null
  ) {
    currentX--;
  }

  return { x: currentX, y: currentY, tileData: map[currentY][currentX]?.tile };
};
