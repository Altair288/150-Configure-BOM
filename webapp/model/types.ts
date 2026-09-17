export interface UiState {
  sideExpanded: boolean;
  selectedNavigationKey: string;
  busy: boolean;
}

export interface BomNode {
  id: string;
  number: string;
  name: string;
  materialId: string;
  quantity: number;
  unit: string;
  lifecycle: string;
  changeStatus: string;
  state: string;
  kind: string;
  visualState: string;
  visible?: boolean;
  geometryKey?: string;
  color?: number;
  children?: BomNode[];
}

export type BomViewKey = "100" | "150";

export interface BomViewDefinition {
  key: BomViewKey;
  name: string;
  description: string;
  loadedCount: number;
  nodes: BomNode[];
}

export interface BomDocument {
  id: string;
  name: string;
  revision: string;
  viewName: string;
  viewKey?: BomViewKey;
  viewDescription?: string;
  lastUpdated: string;
  loadedCount: number;
  cameraType?: "perspective" | "orthographic";
  lightingMode?: "studio" | "key" | "soft";
  axesVisible?: boolean;
  shadingMode?: "shaded" | "shaded-edges" | "edges";
  nodes: BomNode[];
  views?: Record<BomViewKey, BomViewDefinition>;
  visibleNodes?: BomNode[];
  selectedNode?: BomNode;
  filterText?: string;
}

export interface ConfigurationOption {
  key: string;
  text: string;
}

export interface ConfiguratorState {
  id: string;
  engine: string;
  gearbox: string;
  seatMaterial: string;
  options: ConfigurationOption[];
  enabledOptions: string[];
  result: string[];
  scenario: string;
  wheelOption: string;
  handleStyle: string;
  saddleStyle: string;
  fenderStyle: string;
  rearRack: boolean;
  lights: boolean;
  status: string;
}

export interface BicycleConfigurationSelection {
  scenario: string;
  wheelOption: string;
  handleStyle: string;
  saddleStyle: string;
  fenderStyle: string;
  rearRack: boolean;
  lights: boolean;
}

export interface ConfiguredBicycleBom {
  id: string;
  revision: number;
  nodes: BomNode[];
}

export interface ProductSummary {
  id: string;
  number: string;
  name: string;
  revision: string;
  status: string;
}

export interface RuleSummary {
  id: string;
  name: string;
  condition: string;
  effect: string;
  status: string;
}
