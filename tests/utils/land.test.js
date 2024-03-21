import {
  convertTo2D,
  getOffsetFromDirection,
  getSubArray,
  distance,
  findClosestCorner,
  computeCityCenter,
  setDirectionBasedOnCorner,
  getCustomDataArr,
  needsDirectionChange,
} from "@utils/land";

describe("needsDirectionChange function", () => {
  it("should return true when closestCorner is topRight and col < blockSize.x / 3", () => {
    const closestCorner = { corner: "topRight", col: 2 };
    const subArr = [];
    const blockSize = { x: 9, y: 0 }; // Adjust blockSize as necessary
    expect(needsDirectionChange(closestCorner, subArr, blockSize)).toBe(true);
  });

  it("should return true when closestCorner is bottomRight and col < blockSize.x / 3", () => {
    const closestCorner = { corner: "bottomRight", col: 2 };
    const subArr = [];
    const blockSize = { x: 9, y: 0 }; // Adjust blockSize as necessary
    expect(needsDirectionChange(closestCorner, subArr, blockSize)).toBe(true);
  });

  it("should return true when closestCorner is topLeft and col > subArr[0].length - blockSize.x / 3", () => {
    const closestCorner = { corner: "topLeft", col: 7 };
    const subArr = [[1, 2, 3, 4, 5]]; // Adjust subArr as necessary
    const blockSize = { x: 9, y: 0 }; // Adjust blockSize as necessary
    expect(needsDirectionChange(closestCorner, subArr, blockSize)).toBe(true);
  });

  it("should return true when closestCorner is bottomLeft and col > subArr[0].length - blockSize.x / 3", () => {
    const closestCorner = { corner: "bottomLeft", col: 7 };
    const subArr = [[1, 2, 3, 4, 5]]; // Adjust subArr as necessary
    const blockSize = { x: 9, y: 0 }; // Adjust blockSize as necessary
    expect(needsDirectionChange(closestCorner, subArr, blockSize)).toBe(true);
  });

  it("should return false when conditions are not met", () => {
    const closestCorner = { corner: "topLeft", col: 2 };
    const subArr = [[1, 2, 3, 4, 5]]; // Adjust subArr as necessary
    const blockSize = { x: 9, y: 0 }; // Adjust blockSize as necessary
    expect(needsDirectionChange(closestCorner, subArr, blockSize)).toBe(false);
  });
});

describe("Should test convertTo2D function", () => {
  it("Should convert the array to 2D arrays of specified size", () => {
    const array = [-1, 1, 0, -1, 1, 0, -1, 1, 0];
    const size = 3;
    expect(convertTo2D(array, size)).toEqual([
      [-1, 1, 0],
      [-1, 1, 0],
      [-1, 1, 0],
    ]);
  });

  it("Should return an empty array if input array is empty", () => {
    const array = [];
    const size = 2;
    expect(convertTo2D(array, size)).toEqual([]);
  });

  it("Should return an array with a single element if size is greater than array length", () => {
    const array = [1, 2];
    const size = 5;
    expect(convertTo2D(array, size)).toEqual([[1, 2]]);
  });

  it("Should return the correct 2D array if size is not a factor of array length", () => {
    const array = [1, 2, 3, 4, 5];
    const size = 2;
    expect(convertTo2D(array, size)).toEqual([[1, 2], [3, 4], [5]]);
  });
});

describe("Testing getOffsetFromDirection function", () => {
  it("Should return the correct offset for 'left' direction", () => {
    expect(getOffsetFromDirection("left")).toEqual([
      { offsetX: -1, offsetY: 0, direction: "left" },
    ]);
  });

  it("Should return the correct offset for 'right' direction", () => {
    expect(getOffsetFromDirection("right")).toEqual([
      { offsetX: 1, offsetY: 0, direction: "right" },
    ]);
  });

  it("Should return the correct offset for 'top' direction", () => {
    expect(getOffsetFromDirection("top")).toEqual([
      { offsetX: 0, offsetY: -1, direction: "top" },
    ]);
  });

  it("Should return the correct offset for 'bottom' direction", () => {
    expect(getOffsetFromDirection("bottom")).toEqual([
      { offsetX: 0, offsetY: 1, direction: "bottom" },
    ]);
  });

  it("Should return all offsets for 'random' direction", () => {
    expect(getOffsetFromDirection("random")).toEqual([
      { offsetX: -1, offsetY: 0, direction: "left" },
      { offsetX: 1, offsetY: 0, direction: "right" },
      { offsetX: 0, offsetY: -1, direction: "top" },
      { offsetX: 0, offsetY: 1, direction: "bottom" },
    ]);
  });

  it("Should return an empty array for an invalid direction", () => {
    expect(getOffsetFromDirection("invalidDirection")).toEqual([]);
  });
});

describe("Testing getSubArray function", () => {
  const testArray = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 16],
  ];

  it("Should return a subarray from the middle of the array", () => {
    expect(getSubArray(testArray, 1, 2, 1, 2)).toEqual([
      [6, 7],
      [10, 11],
    ]);
  });

  it("Should return a subarray from the top left corner", () => {
    expect(getSubArray(testArray, 0, 1, 0, 1)).toEqual([
      [1, 2],
      [5, 6],
    ]);
  });

  it("Should return a subarray from the bottom right corner", () => {
    expect(getSubArray(testArray, 2, 3, 2, 3)).toEqual([
      [11, 12],
      [15, 16],
    ]);
  });

  it("Should return a single-element subarray", () => {
    expect(getSubArray(testArray, 1, 1, 1, 1)).toEqual([[6]]);
  });

  it("Should handle the whole array as a subarray", () => {
    expect(getSubArray(testArray, 0, 3, 0, 3)).toEqual(testArray);
  });
});

describe("Testing distance function", () => {
  it("Should return the correct distance between two points", () => {
    const center = { x: 0, y: 0 };
    const corner = { row: 0, col: 5 };

    expect(distance(center, corner)).toBeCloseTo(5, 2);
  });

  it("Should return zero when the points are the same", () => {
    const center = { x: 2, y: 3 };
    const corner = { row: 3, col: 2 };

    expect(distance(center, corner)).toBeCloseTo(0, 2);
  });
});

describe("findClosestCorner tests", () => {
  it("should return the closest corner", () => {
    const center = { x: 0, y: 0 };
    const corners = [
      { row: 3, col: 3 },
      { row: 1, col: 1 },
      { row: 5, col: 5 },
    ];

    const result = findClosestCorner(center, corners);

    expect(result).toEqual({ row: 1, col: 1 });
  });

  it("should return null if the corners array is empty", () => {
    const center = { x: 0, y: 0 };
    const corners = [];

    const result = findClosestCorner(center, corners);

    expect(result).toBeNull();
  });
});

describe("computeCityCenter a that point to a different tests", () => {
  it("should correctly compute the city center", () => {
    expect(computeCityCenter(0, 10, 0, 10)).toEqual({ x: 5, y: 5 });
    expect(computeCityCenter(1, 11, 1, 11)).toEqual({ x: 5, y: 5 });
    expect(computeCityCenter(-5, 5, -5, 5)).toEqual({ x: 5, y: 5 });
  });

  it("should handle non-zero minimum values correctly", () => {
    expect(computeCityCenter(5, 15, 5, 15)).toEqual({ x: 5, y: 5 });
    expect(computeCityCenter(-10, 0, -10, 0)).toEqual({ x: 5, y: 5 });
  });

  it("should floor the coordinates correctly", () => {
    expect(computeCityCenter(-1, 9, -1, 9)).toEqual({ x: 5, y: 5 });
    expect(computeCityCenter(0, 11, 0, 11)).toEqual({ x: 5, y: 5 });
  });
});

describe("setDirectionBasedOnCorner function tests", () => {
  it('should return "left" for topRight corner', () => {
    const closestCorner = { corner: "topRight" };
    expect(setDirectionBasedOnCorner(closestCorner)).toBe("left");
  });

  it('should return "right" for topLeft corner', () => {
    const closestCorner = { corner: "topLeft" };
    expect(setDirectionBasedOnCorner(closestCorner)).toBe("right");
  });

  it('should return "top" for bottomLeft corner', () => {
    const closestCorner = { corner: "bottomLeft" };
    expect(setDirectionBasedOnCorner(closestCorner)).toBe("top");
  });

  it('should return "bottom" for bottomRight corner', () => {
    const closestCorner = { corner: "bottomRight" };
    expect(setDirectionBasedOnCorner(closestCorner)).toBe("bottom");
  });

  it("should return an empty string for an unknown corner", () => {
    const closestCorner = { corner: "unknown" };
    expect(setDirectionBasedOnCorner(closestCorner)).toBe("");
  });
});

describe("getCustomDataArr function tests", () => {
  it("should return a parsed object with offset data parsed as int", () => {
    const customData = "pointlight:purple2|offset:0,0.5";
    const expectedResult = {
      offset: { x: 0, y: 0 },
      pointlight: "purple2",
    };
    expect(getCustomDataArr(customData)).toEqual(expectedResult);
  });

  it("should handle offset values as integers where offset are parsed as int", () => {
    const customData = "pointlight:green2|offset:1,0.5";
    const expectedResult = {
      offset: { x: 1, y: 0 },
      pointlight: "green2",
    };
    expect(getCustomDataArr(customData)).toEqual(expectedResult);
  });

  it("should return an empty object for an empty string", () => {
    const customData = "";
    const expectedResult = {};
    expect(getCustomDataArr(customData)).toEqual(expectedResult);
  });

  it("should handle single data entry correctly", () => {
    const customData = "pointlight:green";
    const expectedResult = {
      pointlight: "green",
    };
    expect(getCustomDataArr(customData)).toEqual(expectedResult);
  });
});
