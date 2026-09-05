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
  children?: BomNode[];
}

export interface BomDocument {
  id: string;
  name: string;
  revision: string;
  viewName: string;
  lastUpdated: string;
  loadedCount: number;
  nodes: BomNode[];
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
