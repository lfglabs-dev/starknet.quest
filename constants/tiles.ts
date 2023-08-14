export const TILE_SIZE = 16;
export const MIN_LAND_WIDTH = 7;
export const MAX_LAND_WIDTH = 16;
export const MIN_LAND_HEIGHT = 6;
export const MAX_LAND_HEIGHT = 7;
export const ROAD_SIZE = 2;
export const TILE_EMPTY = 0;

export const propsOffset: {
  [key: string]: {
    [key: string]: { x: number; y: number; z: number };
  };
} = {
  Props_StreetLight: {
    topLeft: { x: 0.5, y: -0.3, z: 0 },
    topRight: { x: 0.4, y: -0.3, z: 0 },
    bottomLeft: { x: 0.5, y: -0.3, z: 0 },
    bottomRight: { x: 0.4, y: -0.3, z: 0 },
  },
  Props_Tree_1x1: {
    top: { x: 0.6, y: -0.2, z: 0 },
    left: { x: 0.6, y: -0.2, z: 0 },
    bottom: { x: 0.6, y: -0.4, z: 0 },
    right: { x: 0.5, y: -0.2, z: 0 },
  },
  Props_SewerPlate: {
    top: { x: 0.6, y: 0.5, z: 0 },
    left: { x: 0.6, y: 0.5, z: 0 },
    bottom: { x: 0.5, y: 0.4, z: 0 },
    right: { x: 0.5, y: 0.4, z: 0 },
  },
  Props_FireHydrant: {
    top: { x: 0.5, y: 0.5, z: 0 },
    left: { x: 0.5, y: 0.4, z: 0 },
    bottom: { x: 0.5, y: 0.3, z: 0 },
    right: { x: 0.5, y: 0.3, z: 0 },
  },
  Props_BenchGrey: {
    bottom: { x: 0.5, y: -0.3, z: 0 },
  },
};

export const buildingsOrdered = {
  5: [[2, 3]],
  6: [[2, 4], [6]],
  7: [
    [2, 2, 3],
    [2, 5],
    [3, 4],
  ],
  8: [
    [2, 2, 4],
    [2, 3, 3],
    [2, 6],
    [3, 5],
  ],
  9: [
    [2, 2, 2, 3],
    [2, 2, 5],
    [2, 3, 4],
    [3, 6],
    [4, 5],
  ],
  10: [
    [2, 2, 2, 4],
    [2, 2, 3, 3],
    [2, 2, 6],
    [2, 3, 5],
    [2, 4, 4],
    [3, 3, 4],
    [4, 6],
  ],
  11: [
    [2, 2, 2, 5],
    [2, 2, 3, 4],
    [2, 3, 3, 3],
    [2, 3, 6],
    [2, 4, 5],
    [3, 3, 5],
    [3, 4, 4],
    [5, 6],
  ],
  12: [
    [2, 2, 3, 5],
    [2, 2, 4, 4],
    [2, 3, 3, 4],
    [2, 4, 6],
    [2, 5, 5],
    [3, 3, 6],
    [3, 4, 5],
  ],
  13: [
    [2, 2, 3, 3, 3],
    [2, 2, 3, 6],
    [2, 2, 4, 5],
    [2, 3, 3, 5],
    [2, 3, 4, 4],
    [2, 5, 6],
    [3, 3, 3, 4],
    [3, 4, 6],
    [3, 5, 5],
    [4, 4, 5],
  ],
  14: [
    [2, 2, 2, 3, 5],
    [2, 2, 2, 4, 4],
    [2, 2, 3, 3, 4],
    [2, 2, 4, 6],
    [2, 2, 5, 5],
    [2, 3, 3, 6],
    [2, 3, 4, 5],
    [2, 4, 4, 4],
    [3, 3, 3, 5],
    [3, 3, 4, 4],
    [4, 5, 5],
    [3, 5, 6],
    [4, 4, 6],
  ],
};

export enum PropsTypes {
  LIGHT = 0,
  TREE = 1,
  SEWER_PLATE = 2,
  FIRE_HYDRANT = 3,
  BENCH = 4,
}

export const PropsTypesNames = {
  [PropsTypes.LIGHT]: "Props_StreetLight",
  [PropsTypes.TREE]: "Props_Tree_1x1",
  [PropsTypes.SEWER_PLATE]: "Props_SewerPlate",
  [PropsTypes.FIRE_HYDRANT]: "Props_FireHydrant",
  [PropsTypes.BENCH]: "Props_BenchGrey",
};

export enum tileTypes {
  PROPS = 0,
  LIGHTS = 1,
}
