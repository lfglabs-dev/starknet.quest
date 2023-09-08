import {
  Tileset,
  iLDtk,
  Level,
  IntGridValue,
  EntityProps,
  Entity,
  TileRect,
} from "../types/ldtk";
import {
  GroundTileProps,
  BuildingTileProps,
  CityCenterProps,
  RoadObjects,
  CitySize,
  Coord,
  SpriteBounds,
  TileData,
} from "../types/land";
import {
  buildingsOrdered,
  BLOCK,
  propsOffset,
  PropsTypes,
  PropsTypesNames,
  tileTypes,
} from "../constants/tiles";
import {
  computeCityCenter,
  convertTo2D,
  findClosestCorner,
  getCustomDataArr,
  getOffsetFromDirection,
  getSubArray,
  needsDirectionChange,
  setDirectionBasedOnCorner,
} from "./land";
import { Vector2 } from "three";

export class LdtkReader {
  /// data related to LDTK
  ldtk: iLDtk;
  level!: Level;
  tilesets: Tileset[];
  idxToRule: { [key: string]: number }; // Mapping between tileset rules and tileset values
  TILE_LAND: number; // tile index we get from LDTK
  TILE_ROAD: number;

  /// User data
  address: string; // user address use to compute pseudo random numbers
  userNft: BuildingsInfo[]; // user NFTs

  /// Data related to the land
  // Array containing all the entities sorted by type and width, computed from LDTK json file
  // (NFT buildings, generic buildings we place behind, road props)
  entities: { [key: string]: { [key: number]: EntityProps[] } };
  citySize: number;
  cityCenter: CityCenterProps | null = null; // city center coordinates needed to place the camera
  // array of blocks of buildings (a block is a group of buildings that can be placed together, they are calculated depending on the number of NFTs owned by the user)
  blocks: { w: number; h: number; nfts: EntityProps[] }[] = [];
  cityIntGrid: number[][]; // int grid representing roads, sidewalk, borders, used to check rules patterns
  groundTiles: (GroundTileProps | null)[][]; // Ground tiles generated after checking ground rules patterns
  buildingTiles: (BuildingTileProps | null)[][]; // Buildings tiles
  currentDirection: string | null = null; // used to keep track of the direction we're building in
  // array of tiles where it's not possible to place a prop (in front of a door for ex)
  blockedPaths: Coord[] = [];
  // array of road props (lights, trees, ...) to be placed
  roadProps: (RoadObjects | null)[][];
  // data for props (and lights) pre-computed to avoid recomputing everything everytime there's a render
  tileData: Record<tileTypes, TileData[]>;

  constructor(
    filejson: any,
    address: string,
    citySize: number,
    userNft: BuildingsInfo[]
  ) {
    this.tilesets = filejson.defs.tilesets;
    this.ldtk = filejson;
    this.address = address;
    this.citySize = citySize;
    this.cityIntGrid = new Array(citySize)
      .fill(0)
      .map(() => new Array(citySize).fill(0));
    this.buildingTiles = new Array(citySize)
      .fill(0)
      .map(() => new Array(citySize).fill(null));
    this.groundTiles = new Array(citySize)
      .fill(0)
      .map(() => new Array(citySize).fill(null));
    this.roadProps = new Array(citySize)
      .fill(0)
      .map(() => new Array(citySize).fill(null));

    const intGrid = this.ldtk.defs.layers.filter(
      (l: any) => l.__type === "IntGrid"
    )[0];
    const idxToRule = intGrid.intGridValues.map((val: IntGridValue) => {
      return { [val.identifier]: val.value };
    });
    this.idxToRule = Object.assign({}, ...idxToRule);
    this.TILE_LAND = this.idxToRule["Sidewalk"];
    this.TILE_ROAD = this.idxToRule["Roads"];

    this.entities = this.sortEntities(userNft);
    this.userNft = userNft;

    this.tileData = {
      [tileTypes.PROPS]: [],
      [tileTypes.LIGHTS]: [],
    };
    this.buildTileData();
  }

  buildTileData() {
    // For Props
    Object.values(PropsTypes).forEach((propType) => {
      const propTypeName = PropsTypesNames[propType as PropsTypes];
      const entity = this.entities["Props"][0].find(
        (elem) => elem.identifier === propTypeName
      );
      const tileset = this.tilesets.find(
        (t) => t.uid === entity?.tileRect.tilesetUid
      );
      if (!entity || !tileset) return;
      let spritesPerRow = tileset?.pxWid / tileset?.tileGridSize ?? 1;
      let spritesPerColumn = tileset?.pxHei / tileset?.tileGridSize ?? 1;
      let xIndex = entity?.tileRect.x / tileset?.tileGridSize ?? 0;
      let yIndex = entity?.tileRect.y / tileset?.tileGridSize ?? 0;
      let xOffset = xIndex / spritesPerRow;
      let yOffset =
        1 - (yIndex + (entity?.tileRect.h ?? 0) / 16) / spritesPerColumn;

      this.tileData[tileTypes.PROPS].push({
        entity,
        plane: {
          w: (entity?.tileRect.w ?? 0) / 16,
          h: (entity?.tileRect.h ?? 0) / 16,
        },
        textureOffset: { x: xOffset, y: yOffset },
        textureRepeat: {
          x:
            1 /
            (spritesPerRow /
              ((entity?.tileRect.w ?? 0) / tileset?.tileGridSize ?? 1)),
          y:
            1 /
            (spritesPerColumn /
              ((entity?.tileRect.h ?? 0) / tileset?.tileGridSize ?? 1)),
        },
        z: 0.23,
      });
    });
  }

  /**
   * Function to build EntityProps from entity name
   * Entities like NFTs have name composed of different parts:
   * - type : NFT, Generic building, Props, Lights (we do not use them for now)
   * - activeWidth : width of the building without the corners
   * - activeHeight : part of the height of the building which is on the ground
   * - corner : a building can have some elements that exceed its active width (ex: mySwap building)
   *
   * @param identifier
   */
  sortEntities(userNft: BuildingsInfo[]) {
    let nftNames: string[] = [];

    userNft.forEach((nft: BuildingsInfo) => {
      nftNames.push(nft.entity);
    });

    let entitiesSorted: { [key: string]: { [key: number]: EntityProps[] } } =
      {};
    this.ldtk.defs.entities.forEach((entity: Entity) => {
      let activeWidth = 0;
      let activeHeight = 0;
      let corner = "";
      let key = "";
      const splittedId = entity.identifier.split("_");
      let needToBeAdded = false;

      if (splittedId[0] === "NFT") {
        if (nftNames.includes(entity.identifier)) {
          needToBeAdded = true;
          key = "NFT";
          if (
            splittedId.length === 5 &&
            (splittedId[1].startsWith("BraavosMain") ||
              splittedId[1].startsWith("ArgentMain"))
          ) {
            activeWidth = parseInt(splittedId[2][0]);
            activeHeight = parseInt(splittedId[2][2]);
          } else if (
            splittedId.length === 5 &&
            splittedId[1].startsWith("ArgentExplorer")
          ) {
            activeWidth = parseInt(splittedId[3][0]);
            activeHeight = parseInt(splittedId[3][2]);
          } else if (
            splittedId.length === 5 &&
            !splittedId[1].startsWith("BraavosMain") &&
            !splittedId[1].startsWith("ArgentMain") &&
            !splittedId[1].startsWith("ArgentExplorer")
          ) {
            corner = splittedId[4];
            activeWidth = parseInt(splittedId[2][0]);
            activeHeight = parseInt(splittedId[2][2]);
          } else {
            activeWidth = parseInt(splittedId[2][0]);
            activeHeight = parseInt(splittedId[2][2]);
          }
        }
      } else if (
        splittedId[0] === "Generic" &&
        entity.identifier !== "Generic_BeigeGarage_4x4_H2"
      ) {
        needToBeAdded = true;
        key = "Generic";
        activeWidth = parseInt(splittedId[2][0]);
        activeHeight = parseInt(splittedId[2][2]);
      } else if (splittedId[0] === "Building") {
        needToBeAdded = true;
        key = "Generic";
        activeWidth = parseInt(splittedId[1][0]);
        activeHeight = parseInt(splittedId[1][2]);
      } else if (splittedId[0] === "Props") {
        needToBeAdded = true;
        key = "Props";
      }

      if (needToBeAdded) {
        // Get custom data for entities
        // In LTDK we can only pass additional custom information about entities through tilesets
        // here we calculate where the entity is positioned on the spritesheet (tileId)
        // and get the custom data for those tiles
        let customDatas: { [key: string]: any }[] = [];
        let tileIdsArr: number[][] | null = null;
        const tileset = this.ldtk.defs.tilesets.find(
          (tileset: Tileset) => tileset.uid === entity.tileRect.tilesetUid
        );
        if (tileset) {
          const bounds = this.getTileIdsFromSprite(
            entity.tileRect,
            tileset.__cWid
          );
          tileIdsArr = this.getTileIdsArray(
            entity.tileRect,
            tileset.__cWid,
            bounds
          );
          const flatArr = tileIdsArr.flat();
          const data = tileset.customData.filter(
            (data: { tileId: number; data: string }) =>
              flatArr.includes(data.tileId)
          );
          data.map((elem) => {
            customDatas[customDatas.length] = {
              tileId: elem.tileId,
              ...getCustomDataArr(elem.data),
            };
          });
        }

        const entityProps: EntityProps = {
          ...entity,
          activeWidth,
          activeHeight,
          isBuilt: false,
          corner,
          tileIdsArr,
          customDatas,
        };
        if (!entitiesSorted[key]) entitiesSorted[key] = {};
        if (!entitiesSorted[key][activeWidth]) {
          entitiesSorted[key][activeWidth] = [];
        }
        entitiesSorted[key][activeWidth].push(entityProps);
      }
    });

    // Sort entities by activeWidth and activeHeight
    for (let entityType in entitiesSorted) {
      for (let activeWidth in entitiesSorted[entityType]) {
        entitiesSorted[entityType][activeWidth].sort(
          (a: EntityProps, b: EntityProps) => {
            // First sort by activeWidth in descending order
            if (a.activeWidth !== b.activeWidth) {
              return b.activeWidth - a.activeWidth;
            }
            // If activeWidth is the same, sort by activeHeight in descending order
            else {
              return b.activeHeight - a.activeHeight;
            }
          }
        );
      }
    }
    return entitiesSorted;
  }

  /**
   * Function to generate the user land based on NFTs owned
   */
  CreateMap() {
    // build an array of buildings represented by their width
    let arr = [];
    for (const key in this.entities["NFT"]) {
      const times = this.entities["NFT"][key].length;
      for (let i = 0; i < times; i++) {
        arr.push(parseInt(key));
      }
    }

    // Generate blocks & rules
    this.generateBlocks(arr);
    this.addBoundariesAroundLand();
    this.applyRules();
    this.placeProps();

    // calculate city center for Camera position
    const citySize = this.calculateCitySize();
    const center = computeCityCenter(
      citySize.minX,
      citySize.maxX,
      citySize.minY,
      citySize.maxY
    );
    this.cityCenter = {
      center: {
        x: center.x + citySize.minX,
        y: center.y + citySize.minY,
      },
      boundaries: citySize,
    };
  }

  /**
   * Given an array of building width, it computes the right number of blocks of buildings
   * So we don't get empty spaces between buildings and place NFTs inside the blocks
   *
   * @param arr of building width
   */
  generateBlocks(arr: number[]): void {
    let blocks = [];
    let block: number[] = [];
    let totalWidth = 0;
    for (let i = 0; i < arr.length; i++) {
      let newWidth = totalWidth + arr[i];
      if (newWidth > 16 || i === arr.length - 1) {
        if (block.length > 0) {
          blocks.push(block);
        }
        block = [arr[i]];
        totalWidth = arr[i];
      } else {
        block.push(arr[i]);
        totalWidth += arr[i];
      }
    }
    if (block.length > 0) {
      blocks.push(block);
    }

    const blockWidth = blocks.map((b) => b.reduce((a, b) => a + b, 0));
    for (let i = 0; i < blocks.length; i++) {
      const nfts = blocks[i];
      const blockEntity: EntityProps[] = [];
      let maxHeight = 0;
      nfts.map((n) => {
        let entity = this.entities["NFT"][n].find(
          (e) => !e.isBuilt
        ) as EntityProps;
        if (entity) {
          entity.isBuilt = true;
          blockEntity.push(entity);
          if (entity.activeHeight > maxHeight) {
            maxHeight = entity.activeHeight;
          }
        }
      });
      this.blocks[i] = {
        w: blockWidth[i] + 2,
        h: maxHeight + 2 + 2,
        nfts: blockEntity,
      };
    }

    for (let b = 0; b < this.blocks.length; b++) {
      this.generateBlock(b);
    }
  }

  /**
   * Given a block index, it places the block on the land
   * It avoids spaces between blocks
   *
   * @param blockIndex: number
   */
  generateBlock(blockIndex: number): void {
    let center: Coord | null;
    const blockSize = new Vector2(
      this.blocks[blockIndex].w,
      this.blocks[blockIndex].h
    );

    if (blockIndex == 0) {
      center = {
        x: Math.floor(this.citySize / 2),
        y: Math.floor(this.citySize / 2),
      };
      const corner = {
        x: center.x - Math.floor(blockSize.x / 2),
        y: center.y - Math.floor(blockSize.y / 2),
        direction: "bottom",
      };
      const coordinates = this.PlaceBlock(corner, blockSize);
      if (!coordinates) return;
      this.addRoadsAroundLand();
      this.build(
        this.blocks[blockIndex].nfts,
        coordinates.startX + 1,
        coordinates.endY - 2,
        true
      );
      this.fillRemainingSpace(
        blockSize,
        coordinates.startX + 1,
        coordinates.endY - 2
      );
    } else {
      const coordinates = this.findNextBlockCorners(blockSize);
      if (!coordinates) return;
      this.build(
        this.blocks[blockIndex].nfts,
        coordinates.startX + 1,
        coordinates.endY - 2,
        true
      );
      this.fillRemainingSpace(
        blockSize,
        coordinates.startX + 1,
        coordinates.endY - 2
      );
    }
  }

  /**
   * Function to find which tiles we can start building new blocks
   * @param direction : on which side to start looking
   * @returns array of tiles : (x, y, direction)
   */
  findValidRoadTiles(
    direction: string
  ): { x: number; y: number; direction: string }[] {
    let roadTiles = [];

    for (let y = 0; y < this.citySize; y++) {
      for (let x = 0; x < this.citySize; x++) {
        if (this.cityIntGrid[y][x] === this.TILE_ROAD) {
          const offsets = getOffsetFromDirection(direction);
          for (let offset of offsets) {
            // Check if the current offset is out of bounds
            if (
              y + offset.offsetY < 0 ||
              y + offset.offsetY >= this.citySize ||
              x + offset.offsetX < 0 ||
              x + offset.offsetX >= this.citySize
            ) {
              continue;
            }

            // Check if the tile at the current offset is empty
            if (
              this.cityIntGrid[y + offset.offsetY][x + offset.offsetX] === 0
            ) {
              // Add the road tile to the list and break out of the offset loop
              roadTiles.push({ x, y, direction: offset.direction });
              break;
            }
          }
        }
      }
    }
    return roadTiles;
  }

  // randomly choose where to start the next block of buildings
  FindRandomRoadTile(
    rectangleSize: Vector2,
    direction: string,
    citySize: CitySize
  ): { x: number; y: number; direction: string; corner: string } | null {
    let roadTiles = this.findValidRoadTiles(direction);
    if (roadTiles.length === 0) {
      return null;
    }

    let selectedRoadTile = false;
    let counter: number = 0; // keep track of first index
    while (!selectedRoadTile) {
      for (let roadTile of roadTiles) {
        let potentialTiles = [];
        if (direction === "right" && roadTile.y > citySize.minY) {
          potentialTiles.push({
            x: roadTile.x + 1,
            y: roadTile.y,
            direction: "right",
            corner: "bottomLeft",
          });
        } else if (direction === "left" && roadTile.y > citySize.minY) {
          potentialTiles.push({
            x: roadTile.x - 1,
            y: roadTile.y,
            direction: "left",
            corner: "topRight",
          });
        } else if (direction === "top" && roadTile.x < citySize.maxX) {
          potentialTiles.push({
            x: roadTile.x,
            y: roadTile.y - 1,
            direction: "top",
            corner: "bottomRight",
          });
        } else if (direction === "bottom" && roadTile.x > citySize.minX) {
          potentialTiles.push({
            x: roadTile.x,
            y: roadTile.y + 1,
            direction: "bottom",
            corner: "topLeft",
          });
        }

        // Filter out tiles that are outside the grid or not empty
        let validTiles = potentialTiles.filter(
          (tile) =>
            tile.x >= 0 &&
            tile.x < this.citySize &&
            tile.y >= 0 &&
            tile.y < this.citySize &&
            this.cityIntGrid[tile.y][tile.x] === 0
        );

        let validTile = null;
        if (validTiles.length > 0) {
          for (let tile of validTiles) {
            const isValid = this.CheckSpaceForRectangle(
              tile,
              rectangleSize,
              direction
            );
            if (isValid) {
              selectedRoadTile = true;
              validTile = tile;
              break;
            }
          }
        }

        if (selectedRoadTile) {
          return validTile;
        }

        counter++;
        if (counter === 1000) return null; // avoid inifinite loop for debugging
      }
    }
    return null;
  }

  // Given the land intGrid, it returns the 4 extremities of the land
  findCitySize(): { minX: number; maxX: number; minY: number; maxY: number } {
    let minX = this.citySize,
      minY = this.citySize,
      maxX = -1,
      maxY = -1;

    for (let y = 0; y < this.citySize; y++) {
      for (let x = 0; x < this.citySize; x++) {
        // Check if the current tile is part of the rectangle (1 or 2)
        if (this.cityIntGrid[y][x] === 1 || this.cityIntGrid[y][x] === 2) {
          // Update the bounding coordinates
          minX = Math.min(minX, x);
          maxX = Math.max(maxX, x);
          minY = Math.min(minY, y);
          maxY = Math.max(maxY, y);
        }
      }
    }
    return { minX, maxX, minY, maxY };
  }

  // Finds empty corners in the land to place new blocks and avoid empty spaces
  findEmptyCorners(arr: number[][]) {
    let rows = arr.length;
    let cols = arr[0].length;
    let corners = [];

    for (let r = 1; r < rows - 1; r++) {
      for (let c = 1; c < cols - 1; c++) {
        if (arr[r][c] === 0) {
          if (arr[r - 1][c] > 0 && arr[r][c - 1] > 0) {
            // upper-left corner
            corners.push({
              row: r,
              col: c,
              corner: "topLeft",
              w: cols - c,
              h: rows - r,
            });
          } else if (arr[r - 1][c] > 0 && arr[r][c + 1] > 0) {
            // upper-right corner
            corners.push({
              row: r,
              col: c,
              corner: "topRight",
              w: cols - c,
              h: rows - r,
            });
          } else if (arr[r + 1][c] > 0 && arr[r][c - 1] > 0) {
            // lower-left corner
            corners.push({
              row: r,
              col: c,
              corner: "bottomLeft",
              w: cols - c,
              h: rows - r,
            });
          } else if (arr[r + 1][c] > 0 && arr[r][c + 1] > 0) {
            // lower-right corner
            corners.push({
              row: r,
              col: c,
              corner: "bottomRight",
              w: cols - c,
              h: rows - r,
            });
          }
        }
      }
    }
    return corners;
  }

  // Find where to place the next block of buildings, given the block size
  findNextBlockCorners(
    blockSize: Vector2
  ): { startX: number; startY: number; endX: number; endY: number } | null {
    if (!this.currentDirection) this.currentDirection = "top";

    const citySize = this.calculateCitySize();
    const center = computeCityCenter(
      citySize.minX,
      citySize.maxX,
      citySize.minY,
      citySize.maxY
    );

    const subArr = getSubArray(
      this.cityIntGrid,
      citySize.minX,
      citySize.maxX,
      citySize.minY,
      citySize.maxY
    );
    const corners = this.findEmptyCorners(subArr);
    let closestCorner = findClosestCorner(center, corners);
    if (
      !closestCorner ||
      needsDirectionChange(closestCorner, subArr, blockSize)
    ) {
      this.changeDirection(citySize);
      let roadTile = this.FindRandomRoadTile(
        blockSize,
        this.currentDirection,
        citySize
      );
      if (roadTile) {
        const coordinates = this.PlaceBlock(
          { x: roadTile.x, y: roadTile.y, direction: roadTile.corner },
          blockSize
        );
        this.addRoadsAroundLand();
        return coordinates;
      }
    } else {
      const coordinates = this.PlaceBlock(
        {
          x: closestCorner.col + citySize.minX,
          y: closestCorner.row + citySize.minY,
          direction: closestCorner.corner,
        },
        blockSize
      );
      this.addRoadsAroundLand();
      this.currentDirection = setDirectionBasedOnCorner(closestCorner);
      return coordinates;
    }
    return null;
  }

  calculateCitySize(): CitySize {
    const { minX, maxX, minY, maxY } = this.findCitySize();
    const citySizeX = maxX - minX + 1;
    const citySizeY = maxY - minY + 1;

    return { minX, maxX, minY, maxY, citySizeX, citySizeY };
  }

  // function called if we cannot place another block in the current direction
  changeDirection(citySize: CitySize) {
    if (
      citySize.citySizeX >= citySize.citySizeY &&
      this.currentDirection !== "top" &&
      this.currentDirection !== "bottom"
    ) {
      this.currentDirection =
        this.currentDirection === "left" ? "bottom" : "top";
    } else if (
      citySize.citySizeX <= citySize.citySizeY &&
      this.currentDirection !== "right" &&
      this.currentDirection !== "left"
    ) {
      this.currentDirection =
        this.currentDirection === "top" ? "left" : "right";
    }
  }

  // Place block on land
  PlaceBlock(
    corner: { x: number; y: number; direction: string },
    rectangleSize: Vector2
  ): { startX: number; startY: number; endX: number; endY: number } | null {
    let startX, startY, endX, endY;

    if (corner.direction === "topLeft") {
      // If the space is below, the corner is the top-left of the rectangle
      startX = corner.x;
      startY = corner.y;
      endX = corner.x + rectangleSize.x;
      endY = corner.y + rectangleSize.y;
    } else if (corner.direction === "topRight") {
      // corner is the top right of the rectangle
      startX = corner.x - rectangleSize.x + 1;
      startY = corner.y;
      endX = corner.x + 1;
      endY = corner.y + rectangleSize.y + 1;
    } else if (corner.direction === "bottomRight") {
      // the corner is the bottom-right of the rectangle
      startX = corner.x - rectangleSize.x + 1;
      startY = corner.y - rectangleSize.y + 1;
      endX = corner.x + 1;
      endY = corner.y + 1;
    } else {
      // For all other cases, the corner is the bottom-left of the rectangle
      startX = corner.x;
      startY = corner.y - rectangleSize.y + 1;
      endX = corner.x + rectangleSize.x;
      endY = corner.y + 1;
    }

    // Ensure the rectangle is within the city bounds
    if (
      startX < 0 ||
      startY < 0 ||
      endX > this.citySize ||
      endY > this.citySize
    ) {
      return null;
    }
    // Fill in the rectangle
    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        this.cityIntGrid[y][x] = this.TILE_LAND;
      }
    }
    return { startX, startY, endX, endY };
  }

  // Place road on intGrid
  // Function called after placing a new block on land
  addRoadsAroundLand(): void {
    let copyCityGrid = JSON.parse(JSON.stringify(this.cityIntGrid));

    for (let y = 0; y < this.cityIntGrid.length; y++) {
      for (let x = 0; x < this.cityIntGrid[y].length; x++) {
        // Check if the current cell is a land
        if (this.cityIntGrid[y][x] === this.idxToRule["Sidewalk"]) {
          // Go through the cells in a 2-unit radius around the current cell
          for (let yOffset = -2; yOffset <= 2; yOffset++) {
            for (let xOffset = -2; xOffset <= 2; xOffset++) {
              // Check if the target cell is within the city grid
              if (
                y + yOffset >= 0 &&
                y + yOffset < this.cityIntGrid.length &&
                x + xOffset >= 0 &&
                x + xOffset < this.cityIntGrid[y].length
              ) {
                // Check if the target cell is empty
                if (copyCityGrid[y + yOffset][x + xOffset] === 0) {
                  // Mark the target cell as a road
                  copyCityGrid[y + yOffset][x + xOffset] =
                    this.idxToRule["Roads"];
                }
              }
            }
          }
        }
      }
    }
    this.cityIntGrid = copyCityGrid;
  }

  // Adds boundaries around land
  // Function called after placing all blocks and roads on land
  addBoundariesAroundLand(): void {
    let copyCityGrid = JSON.parse(JSON.stringify(this.cityIntGrid));

    for (let y = 0; y < this.cityIntGrid.length; y++) {
      for (let x = 0; x < this.cityIntGrid[y].length; x++) {
        // Check if the current cell is a land
        if (this.cityIntGrid[y][x] === this.idxToRule["Roads"]) {
          // Go through the cells in a 2-unit radius around the current cell
          for (let yOffset = -2; yOffset <= 2; yOffset++) {
            for (let xOffset = -2; xOffset <= 2; xOffset++) {
              // Check if the target cell is within the city grid
              if (
                y + yOffset >= 0 &&
                y + yOffset < this.cityIntGrid.length &&
                x + xOffset >= 0 &&
                x + xOffset < this.cityIntGrid[y].length
              ) {
                // Check if the target cell is empty
                if (copyCityGrid[y + yOffset][x + xOffset] === 0) {
                  // Mark the target cell as a road
                  copyCityGrid[y + yOffset][x + xOffset] =
                    this.idxToRule["Boundaries"];
                }
              }
            }
          }
        }
      }
    }

    for (let y = 0; y < this.cityIntGrid.length; y++) {
      for (let x = 0; x < this.cityIntGrid[y].length; x++) {
        // Check if the current cell is a Boundary
        if (copyCityGrid[y][x] === this.idxToRule["Boundaries"]) {
          // Go through the cells in a 1-unit radius around the current cell
          for (let yOffset = -1; yOffset <= 1; yOffset++) {
            for (let xOffset = -1; xOffset <= 1; xOffset++) {
              // Check if the target cell is within the city grid
              if (
                y + yOffset >= 0 &&
                y + yOffset < this.cityIntGrid.length &&
                x + xOffset >= 0 &&
                x + xOffset < this.cityIntGrid[y].length
              ) {
                // Check if the target cell is empty
                if (copyCityGrid[y + yOffset][x + xOffset] === 0) {
                  // Mark the target cell as Exterior
                  copyCityGrid[y + yOffset][x + xOffset] =
                    this.idxToRule["Exterior"];
                }
              }
            }
          }
        }
      }
    }
    this.cityIntGrid = copyCityGrid;
  }

  CheckSpaceForRectangle(
    corner: any,
    rectangleSize: Vector2,
    direction: string
  ): boolean {
    // Define increments for each direction
    let increments: { [key: string]: Coord } = {
      top: { x: 0, y: -1 },
      bottom: { x: 0, y: 1 },
      left: { x: -1, y: 0 },
      right: { x: 1, y: 0 },
    };
    let increment = increments[direction];
    // Calculate the end points based on the direction
    let endX = corner.x + increment.x * rectangleSize.x;
    let endY = corner.y + increment.y * rectangleSize.y;

    // Check if the rectangle would go out of bounds
    if (
      endX < 0 ||
      endX >= this.citySize ||
      endY < 0 ||
      endY >= this.citySize
    ) {
      return false;
    }

    // Check if the area required for the rectangle is empty
    for (let y = corner.y; y !== endY; y += increment.y) {
      for (let x = corner.x; x !== endX; x += increment.x) {
        // If the current tile is not empty (0), return false
        if (this.cityIntGrid[y][x] !== 0) {
          return false;
        }
      }
    }

    // Check corner type
    let cornerType = "";
    if (corner.x < this.citySize / 2 && corner.y < this.citySize / 2) {
      cornerType = "TopLeft";
    } else if (corner.x >= this.citySize / 2 && corner.y < this.citySize / 2) {
      cornerType = "TopRight";
    } else if (corner.x < this.citySize / 2 && corner.y >= this.citySize / 2) {
      cornerType = "BottomLeft";
    } else {
      cornerType = "BottomRight";
    }
    return true;
  }

  // Get the size of a new block of buildings
  GetRandomBlockSize(blockNb: number): Vector2 {
    let rand = this.randomGround(blockNb * 10);
    let width = Math.round(
      BLOCK.MIN_WIDTH + rand * (BLOCK.MAX_WIDTH - BLOCK.MIN_WIDTH)
    );

    rand = this.randomGround(blockNb * 100);
    let height = Math.round(
      BLOCK.MIN_HEIGHT + rand * (BLOCK.MAX_HEIGHT - BLOCK.MIN_HEIGHT)
    );

    return new Vector2(width, height);
  }

  // Applying rules on each ground tile type following patterns including in LDTK
  applyRules(): void {
    let rules = this.ldtk.defs.layers[1];

    // parse rulegroups to build grounds
    for (let l = 0; l < rules.autoRuleGroups.length; l++) {
      let roadGroup = rules.autoRuleGroups[l];

      // only check active groups
      if (roadGroup.active) {
        let idx = this.idxToRule[roadGroup.name as string]; // get IntGrid value from rule group name
        if (idx) {
          for (let y = 0; y < this.cityIntGrid.length; y++) {
            for (let x = 0; x < this.cityIntGrid[y].length; x++) {
              // check which king of ground we have at this position
              if (this.cityIntGrid[y][x] === idx) {
                // check each rules
                for (let r = 0; r < roadGroup.rules.length; r++) {
                  const rule = roadGroup.rules[r];
                  const pattern2D = convertTo2D(rule.pattern, rule.size);

                  const { match, needFlipX, needFlipY } = this.MatchesPattern(
                    this.cityIntGrid,
                    pattern2D,
                    x,
                    y,
                    idx,
                    Math.floor(pattern2D.length / 2),
                    rule.flipX,
                    rule.flipY
                  );
                  if (match) {
                    const rand = Math.random();

                    if (
                      rule.chance === 1 ||
                      (rule.chance !== 1 && rand < rule.chance)
                    ) {
                      this.groundTiles[y][x] = {
                        tileId:
                          rule.tileIds.length > 0
                            ? rule.tileIds[
                                Math.floor(Math.random() * rule.tileIds.length)
                              ]
                            : rule.tileIds[0],
                        flipX: needFlipX,
                        flipY: needFlipY,
                      };

                      if (rule.breakOnMatch) break;
                    } else {
                      continue;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  MatchesPattern(
    mapData: number[][],
    pattern: number[][],
    x: number,
    y: number,
    ruleNb: number,
    offset: number,
    checkFlipX: boolean,
    checkFlipY: boolean
  ): { match: boolean; needFlipX: boolean; needFlipY: boolean } {
    const checkPattern = (flipX: boolean, flipY: boolean) => {
      for (let py = 0; py < pattern.length; py++) {
        for (let px = 0; px < pattern[py].length; px++) {
          let currentPx = flipX ? pattern[py].length - px - 1 : px;
          let currentPy = flipY ? pattern.length - py - 1 : py;

          // If the pattern element is 0, it's a wildcard, so it always matches
          if (pattern[currentPy][currentPx] === 0) continue;

          if (
            y + py < this.citySize &&
            x + px < this.citySize &&
            y - py >= 0 &&
            x - px >= 0 &&
            x - offset + px >= 0 &&
            y - offset + py >= 0
          ) {
            // If the pattern element is -ruleNb, it matches anything that is not ruleNb
            if (
              pattern[currentPy][currentPx] === -ruleNb &&
              mapData[y - offset + py][x - offset + px] !== ruleNb
            )
              continue;

            // If the pattern element is a positive integer, it must match exactly
            if (
              mapData[y - offset + py][x - offset + px] !==
              pattern[currentPy][currentPx]
            ) {
              return false;
            }
          } else {
            return false;
          }
        }
      }

      return true;
    };

    // First check without flipping
    if (checkPattern(false, false)) {
      return { match: true, needFlipX: false, needFlipY: false };
    }
    if (checkFlipX && checkPattern(true, false)) {
      return { match: true, needFlipX: true, needFlipY: false };
    }
    if (checkFlipY && checkPattern(false, true)) {
      return { match: true, needFlipX: false, needFlipY: true };
    }
    if (checkFlipX && checkFlipY && checkPattern(true, true)) {
      return { match: true, needFlipX: true, needFlipY: true };
    }

    return { match: false, needFlipX: false, needFlipY: false };
  }

  /**
   * Function to place buildings on the land
   * @param entities EntityProps[]
   * @param x : position on the x axis
   * @param y : position on the y axis
   * @param isFirstLine : if the building is place on the row of the block
   */
  build(
    entities: EntityProps[],
    x: number,
    y: number,
    isFirstLine: boolean
  ): void {
    entities.forEach((entity: EntityProps) => {
      const xOffset = entity.corner === "CornerLeft" ? x - 1 : x;
      for (
        let w = 0;
        w < (entity.corner ? entity.activeWidth + 1 : entity.activeWidth);
        w++
      ) {
        const isNFT = this.userNft.find(
          (nft) => entity.identifier === nft.entity
        );
        for (let h = 0; h < entity.activeHeight; h++) {
          if (w === 0 && h === 0) {
            this.buildingTiles[y][xOffset] = {
              tile: entity.tileRect,
              isOccupied: true,
              isHidden: false,
              ref: entity.identifier,
              tileRef: entity.tileRect,
              isNFT: isNFT ? true : false,
            };
          } else {
            this.buildingTiles[y - h][xOffset + w] = {
              tile: null,
              isOccupied: true,
              isHidden: true,
              ref: entity.identifier,
              tileRef: entity.tileRect,
              isNFT: isNFT ? true : false,
            };
          }
        }
      }
      if (isFirstLine && entity.fieldDefs && entity.fieldDefs.length > 0) {
        const blockedTiles = entity.fieldDefs[0].defaultOverride?.params[0]
          .toString()
          .split("-");
        blockedTiles &&
          blockedTiles.map((tile) => {
            this.blockedPaths.push({ x: x + parseInt(tile) - 1, y: y + 1 });
          });
      }

      x = x + entity.activeWidth;
    });
  }

  fillRemainingSpace(rectangleSize: Vector2, x: number, y: number): void {
    const innerWidth = rectangleSize.x - 2;
    const innerHeight = rectangleSize.y - 2;
    let remainingHeight = innerHeight - 1;

    for (let i = y; i > y - innerHeight - 1; i--) {
      for (let j = x; j < x + innerWidth; j++) {
        if (!this.buildingTiles[i][j]) {
          let counter = this.findCounter(i, j, x + innerWidth);
          const entityIndex = this.findEntityIndex(
            counter,
            innerHeight,
            remainingHeight
          );
          if (
            entityIndex !== -1 &&
            this.entities["Generic"][counter] &&
            entityIndex < this.entities["Generic"][counter].length &&
            entityIndex !== 1
          ) {
            const entity = this.entities["Generic"][counter][entityIndex];
            this.build([entity], j, i, false);
          }
        }
      }
      remainingHeight--;
      if (remainingHeight < 1) break;
    }
  }

  findCounter(i: number, j: number, limit: number): number {
    let counter = 0;
    while (
      (!this.buildingTiles[i][j + counter] ||
        !this.buildingTiles[i][j + counter]?.isOccupied) &&
      j + counter < limit
    ) {
      counter++;
      if (counter === 100) break;
    }
    if (counter > 5) {
      if (counter > 14) counter = 14;
      // @ts-ignore
      const possibleCombinations = buildingsOrdered[counter].filter(
        (combination: number[]) => !combination.includes(6)
      );
      counter = possibleCombinations[0][0];
    }
    return counter;
  }

  findEntityIndex(
    counter: number,
    innerHeight: number,
    remainingWidth: number
  ): number {
    let entityIndex = -1;
    while (entityIndex === -1) {
      entityIndex = this.getRandomBuilding(counter, innerHeight);
      if (entityIndex === -1) counter++;
      if (counter === remainingWidth || counter === 100) break;
    }
    return entityIndex;
  }

  // get a random generic building
  getRandomBuilding(width: number, maxHeight: number): number {
    const copyEntities = JSON.parse(JSON.stringify(this.entities));
    if (!copyEntities["Generic"][width]) return -1;
    const entityIndex = copyEntities["Generic"][width].findIndex(
      (elem: EntityProps) => !elem.isBuilt && elem.activeHeight < maxHeight - 1
    );
    if (entityIndex === -1) return -1;
    copyEntities["Generic"][width][entityIndex].isBuilt = true;
    this.entities = copyEntities;
    return entityIndex;
  }

  /**
   * Function to place street props on sidewalk
   * - Some props can only be places on bottom sidewalks : bench
   * - Lights need to placed on every road corners
   * - Other props can be placed on every sidewalks : tree, fire hydrant, sewer plate
   * - Props cannot be placed on blocked sidewalks (in front of a door)
   *
   */
  placeProps(): void {
    const tileset = this.ldtk.defs.tilesets[0];
    const corners = tileset.customData;
    let propTypesArray = Object.values(PropsTypes).filter(
      (value) => typeof value === "number"
    ) as PropsTypes[];
    let propIndex = 1;

    for (let i = 0; i < this.cityIntGrid.length; i++) {
      for (let j = 0; j < this.cityIntGrid[i].length; j++) {
        if (this.cityIntGrid[i][j] !== 1) continue; // if not a sidewalk continue
        if (this.blockedPaths.find((elem) => elem.x === j && elem.y === i))
          continue; // if blocked sidewalk continue

        const tile = this.groundTiles[i][j];
        const isCorner = this.checkWhichCorner(i, j);
        const isSide = this.checkWhichSidewalkSide(i, j);
        if (
          corners.find(
            (corner: { tileId: number; data: string }) =>
              corner.tileId === tile?.tileId
          ) &&
          isCorner
        ) {
          const entity = this.entities["Props"][0].find(
            (elem) => elem.identifier === "Props_StreetLight"
          );
          if (!entity) continue;
          this.roadProps[i][j] = {
            entityType: PropsTypes.LIGHT,
            corner: isCorner,
            z: 0,
          };
        } else if (isSide) {
          const hashed = this.hash(this.address);
          let rand = this.createSeededRandom(hashed + i * j);
          let propType: PropsTypes | null = null;
          if (isSide === "bottom") {
            propType = propTypesArray[propIndex];
            if (propIndex === 4) propIndex = 1;
            else propIndex++;
          } else {
            if (rand < 0.3) {
              if (propIndex === 4) propIndex = 1;
              propType = propTypesArray[propIndex];
              propIndex++;
            }
          }

          if (propType) {
            const entity = this.entities["Props"][0].find(
              // @ts-ignore
              (elem) => elem.identifier === PropsTypesNames[propType]
            );
            if (!entity) continue;
            const offset = propsOffset[entity.identifier][isSide] ?? {
              x: 0,
              y: 0,
              z: 0,
            };
            this.roadProps[i][j] = {
              entityType: propType,
              corner: isSide,
              z: isSide === "bottom" ? 0.01 : 0,
            };
          }
        }
      }
    }
  }

  /**
   * Function to check if an entity is placed on the corner of a sidewalk
   * @param y coordinate of the entity
   * @param x coordinate of the entity
   * @returns corner : "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | null
   */
  checkWhichCorner(y: number, x: number): string | null {
    if (this.cityIntGrid[y][x - 1] === 2 && this.cityIntGrid[y - 1][x] === 2) {
      return "topLeft";
    } else if (
      this.cityIntGrid[y][x + 1] === 2 &&
      this.cityIntGrid[y - 1][x] === 2
    ) {
      return "topRight";
    } else if (
      this.cityIntGrid[y][x - 1] === 2 &&
      this.cityIntGrid[y + 1][x] === 2
    ) {
      return "bottomLeft";
    } else if (
      this.cityIntGrid[y][x + 1] === 2 &&
      this.cityIntGrid[y + 1][x] === 2
    ) {
      return "bottomRight";
    }
    return null;
  }

  /**
   * Function to check on which side of a sidewalk an entity is placed
   * @param y coordinate of the entity
   * @param x coordinate of the entity
   * @returns side : "left" | "right" | "top" | "bottom" | null
   */
  checkWhichSidewalkSide(y: number, x: number): string | null {
    if (this.cityIntGrid[y][x - 1] === 2 && this.cityIntGrid[y][x + 1] === 1) {
      return "left";
    } else if (
      this.cityIntGrid[y][x + 1] === 2 &&
      this.cityIntGrid[y][x - 1] === 1
    ) {
      return "right";
    } else if (
      this.cityIntGrid[y - 1][x] === 2 &&
      this.cityIntGrid[y + 1][x] === 1
    ) {
      return "top";
    } else if (
      this.cityIntGrid[y + 1][x] === 2 &&
      this.cityIntGrid[y - 1][x] === 1
    ) {
      return "bottom";
    }
    return null;
  }

  /**
   * Function to get the boundaries of a sprite on a sprite sheet given its TileRect (x, y, h, w)
   * @param tileRect : TileRect
   * @param cWid : width of the sprite sheet
   * @returns SpriteBounds
   */
  getTileIdsFromSprite(tileRect: TileRect, cWid: number): SpriteBounds {
    const { x, y, h, w } = tileRect;
    let spriteTileIdTopLeft = (y / 16) * cWid + x / 16; // This is your `spriteTileIdStart`
    let spriteTileIdTopRight = spriteTileIdTopLeft + w / 16 - 1;
    let spriteTileIdBottomLeft = spriteTileIdTopLeft + (h / 16 - 1) * cWid;
    let spriteTileIdBottomRight = spriteTileIdBottomLeft + w / 16 - 1; // This is your `spriteTileIdEnd`
    return {
      spriteTileIdTopLeft,
      spriteTileIdTopRight,
      spriteTileIdBottomLeft,
      spriteTileIdBottomRight,
    };
  }

  getTileIdsArray(
    tileRect: TileRect,
    cWid: number,
    bounds: SpriteBounds
  ): number[][] {
    const { spriteTileIdTopLeft } = bounds;
    const tileIds: number[][] = [];
    let start = bounds.spriteTileIdTopLeft;
    for (let by = 0; by < tileRect.h / 16; by++) {
      for (let bx = 0; bx < tileRect.w / 16; bx++) {
        if (!tileIds[by]) tileIds[by] = [];
        tileIds[by][bx] = start;
        start++;
      }
      if (start > spriteTileIdTopLeft + tileRect.w / 16 - 1) {
        start = spriteTileIdTopLeft + cWid * (by + 1);
      }
    }
    return tileIds;
  }

  // Functions to generate a random number based on user address
  randomGround(spec: number): number {
    const x = Math.sin(this.seedFromWallet(this.address) + spec) * 10000;
    return x - Math.floor(x);
  }

  seedFromWallet(wallet: string): number {
    let i: number = 3;
    let seed: number = 0;
    let seedStr: string = "";

    while (i < 20) {
      seedStr = seedStr + wallet[i].charCodeAt(0).toString();
      i = i + 3;
    }

    seed = parseInt(seedStr);
    return seed;
  }

  createSeededRandom(seed: number) {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }

  hash(s: string) {
    let hash = 0;
    for (let i = 0; i < s.length; i++) {
      hash = (Math.imul(31, hash) + s.charCodeAt(i)) | 0;
    }
    return hash;
  }
}
