export interface iLDtk {
  __header__: Header;
  jsonVersion: string;
  appBuildId: number;
  nextUid: number;
  identifierStyle: string;
  worldLayout: string;
  worldGridWidth: number;
  worldGridHeight: number;
  defaultLevelWidth: number;
  defaultLevelHeight: number;
  defaultPivotX: number;
  defaultPivotY: number;
  defaultGridSize: number;
  bgColor: string;
  defaultLevelBgColor: string;
  minifyJson: boolean;
  externalLevels: boolean;
  exportTiled: boolean;
  imageExportMode: string;
  pngFilePattern: any;
  backupOnSave: boolean;
  backupLimit: number;
  levelNamePattern: string;
  tutorialDesc: any;
  flags: string[];
  defs: Defs;
  levels: Level[];
  worlds: any[];
}

export interface Header {
  fileType: string;
  app: string;
  doc: string;
  schema: string;
  appAuthor: string;
  appVersion: string;
  url: string;
}

export interface Defs {
  layers: Layer[];
  entities: Entity[];
  tilesets: Tileset[];
  enums: Enum[];
  externalEnums: any[];
  levelFields: LevelField[];
}

export interface Layer {
  __type: string;
  identifier: string;
  type: string;
  uid: number;
  gridSize: number;
  guideGridWid: number;
  guideGridHei: number;
  displayOpacity: number;
  inactiveOpacity: number;
  hideInList: boolean;
  hideFieldsWhenInactive: boolean;
  pxOffsetX: number;
  pxOffsetY: number;
  parallaxFactorX: number;
  parallaxFactorY: number;
  parallaxScaling: boolean;
  requiredTags: any[];
  excludedTags: any[];
  intGridValues: IntGridValue[];
  autoTilesetDefUid?: number;
  autoRuleGroups: AutoRuleGroup[];
  autoSourceLayerDefUid: any;
  tilesetDefUid?: number;
  tilePivotX: number;
  tilePivotY: number;
}

export interface IntGridValue {
  value: number;
  identifier: string;
  color: string;
}

export interface AutoRuleGroup {
  uid: number;
  name: string;
  active: boolean;
  isOptional: boolean;
  rules: Rule[];
}

export interface Rule {
  uid: number;
  active: boolean;
  size: number;
  tileIds: number[];
  chance: number;
  breakOnMatch: boolean;
  pattern: number[];
  flipX: boolean;
  flipY: boolean;
  xModulo: number;
  yModulo: number;
  checker: string;
  tileMode: string;
  pivotX: number;
  pivotY: number;
  outOfBoundsValue: any;
  perlinActive: boolean;
  perlinSeed: number;
  perlinScale: number;
  perlinOctaves: number;
}

export interface Entity {
  identifier: string;
  uid: number;
  tags: any[];
  width: number;
  height: number;
  resizableX: boolean;
  resizableY: boolean;
  keepAspectRatio: boolean;
  tileOpacity: number;
  fillOpacity: number;
  lineOpacity: number;
  hollow: boolean;
  color: string;
  renderMode: string;
  showName: boolean;
  tilesetId?: number;
  tileId?: number;
  tileRenderMode: string;
  tileRect: TileRect;
  maxCount: number;
  limitScope: string;
  limitBehavior: string;
  pivotX: number;
  pivotY: number;
  fieldDefs: FieldDef[];
  doc: string;
}

export interface TileRect {
  tilesetUid: number;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface FieldDef {
  identifier: string;
  __type: string;
  uid: number;
  type: any;
  isArray: boolean;
  canBeNull: boolean;
  arrayMinLength: any;
  arrayMaxLength: any;
  editorDisplayMode: string;
  editorDisplayPos: string;
  editorAlwaysShow: boolean;
  editorCutLongValues: boolean;
  editorTextSuffix: any;
  editorTextPrefix: any;
  useForSmartColor: boolean;
  min: any;
  max: any;
  regex: any;
  acceptFileTypes: any;
  defaultOverride?: DefaultOverride;
  textLanguageMode: any;
  symmetricalRef: boolean;
  autoChainRef: boolean;
  allowOutOfLevelRef: boolean;
  allowedRefs: string;
  allowedRefTags: any[];
  tilesetUid: any;
}

export interface DefaultOverride {
  id: string;
  params: number[];
}

export interface Tileset {
  __cWid: number;
  __cHei: number;
  identifier: string;
  uid: number;
  relPath?: string;
  embedAtlas?: string;
  pxWid: number;
  pxHei: number;
  tileGridSize: number;
  spacing: number;
  padding: number;
  tags: any[];
  tagsSourceEnumUid: any;
  enumTags: any[];
  customData: CustomData[];
  savedSelections: SavedSelection[];
  cachedPixelData: CachedPixelData;
}

export interface CustomData {
  tileId: number;
  data: string;
}

export interface AnimationData {
  // refers to key of the animation (name & json)
  anim: string;
}

export interface SavedSelection {
  ids: number[];
  mode: string;
}

export interface CachedPixelData {
  opaqueTiles: string;
  averageColors: string;
}

export interface Enum {
  identifier: string;
  uid: number;
  values: Value[];
  iconTilesetUid: number;
  externalRelPath: any;
  externalFileChecksum: any;
  tags: any[];
}

export interface Value {
  id: string;
  tileId: number;
  color: number;
  __tileSrcRect: number[];
}

export interface LevelField {
  identifier: string;
  __type: string;
  uid: number;
  type: string;
  isArray: boolean;
  canBeNull: boolean;
  arrayMinLength: any;
  arrayMaxLength: any;
  editorDisplayMode: string;
  editorDisplayPos: string;
  editorAlwaysShow: boolean;
  editorCutLongValues: boolean;
  editorTextSuffix: any;
  editorTextPrefix: any;
  useForSmartColor: boolean;
  min: any;
  max: any;
  regex: any;
  acceptFileTypes: any;
  defaultOverride: any;
  textLanguageMode: any;
  symmetricalRef: boolean;
  autoChainRef: boolean;
  allowOutOfLevelRef: boolean;
  allowedRefs: string;
  allowedRefTags: any[];
  tilesetUid: any;
}

export interface Level {
  identifier: string;
  iid: string;
  uid: number;
  worldX: number;
  worldY: number;
  worldDepth: number;
  pxWid: number;
  pxHei: number;
  __bgColor: string;
  bgColor?: string;
  useAutoIdentifier: boolean;
  bgRelPath: any;
  bgPos: any;
  bgPivotX: number;
  bgPivotY: number;
  __smartColor: string;
  __bgPos: any;
  externalRelPath: any;
  fieldInstances: FieldInstance[];
  layerInstances: LayerInstance[];
  __neighbours: Neighbour[];
}

export interface FieldInstance {
  __identifier: string;
  __value: any;
  __type: string;
  __tile: any;
  defUid: number;
  realEditorValues: any[];
}

export interface LayerInstance {
  __identifier: string;
  __type: string;
  __cWid: number;
  __cHei: number;
  __gridSize: number;
  __opacity: number;
  __pxTotalOffsetX: number;
  __pxTotalOffsetY: number;
  __tilesetDefUid?: number;
  __tilesetRelPath?: string;
  iid: string;
  levelId: number;
  layerDefUid: number;
  pxOffsetX: number;
  pxOffsetY: number;
  visible: boolean;
  optionalRules: any[];
  intGridCsv: number[];
  autoLayerTiles: AutoLayerTile[];
  seed: number;
  overrideTilesetUid?: number;
  gridTiles: GridTile[];
  entityInstances: EntityInstance[];
}

export interface AutoLayerTile {
  px: number[];
  src: number[];
  f: number;
  t: number;
  d: number[];
}

export interface GridTile {
  px: number[];
  src: number[];
  f: number;
  t: number;
  d: number[];
}

export interface EntityInstance {
  __identifier: string;
  __grid: number[];
  __pivot: number[];
  __tags: any[];
  __tile: Tile;
  iid: string;
  width: number;
  height: number;
  defUid: number;
  px: number[];
  fieldInstances: FieldInstance2[];
}

export interface Tile {
  tilesetUid: number;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface FieldInstance2 {
  __identifier: string;
  __value: string;
  __type: string;
  __tile: any;
  defUid: number;
  realEditorValues: RealEditorValue[];
}

export interface RealEditorValue {
  id: string;
  params: number[];
}

export interface Neighbour {
  levelIid: string;
  levelUid: number;
  dir: string;
}

export interface EntityProps {
  identifier: string;
  uid: number;
  tags: any[];
  width: number;
  height: number;
  resizableX: boolean;
  resizableY: boolean;
  keepAspectRatio: boolean;
  tileOpacity: number;
  fillOpacity: number;
  lineOpacity: number;
  hollow: boolean;
  color: string;
  renderMode: string;
  showName: boolean;
  tilesetId?: number;
  tileId?: number;
  tileRenderMode: string;
  tileRect: TileRect;
  maxCount: number;
  limitScope: string;
  limitBehavior: string;
  pivotX: number;
  pivotY: number;
  fieldDefs: FieldDef[];
  doc: string;
  // custom data
  activeWidth: number;
  activeHeight: number;
  isBuilt: boolean;
  corner: string;
  customDatas?: { [key: string]: any }[] | null;
  tileIdsArr: number[][] | null;
}
