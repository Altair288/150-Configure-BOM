import type { BomNode } from "../model/types";

export type PreviewSelectionMode = "part" | "face" | "edge" | "vertex";

export interface PreviewMeasurement {
  width: number;
  height: number;
  depth: number;
  text: string;
}

export interface ChiliPreviewHostOptions {
  onNodeSelected?: (nodeId: string | undefined) => void;
  onModelLoaded?: (nodes: BomNode[]) => void;
  onMeasure?: (measurement: PreviewMeasurement | undefined) => void;
  onStateChanged?: (state: {
    exploded: boolean;
    sectioned: boolean;
    selectionMode: PreviewSelectionMode;
  }) => void;
  onError?: (message: string) => void;
}

export interface ChiliPreviewHost {
  loadBom(nodes: BomNode[]): void;
  loadFile(file: File): Promise<void>;
  selectNode(nodeId: string): void;
  setNodeVisibility(nodeId: string, visible: boolean): boolean;
  setSelectionMode(mode: PreviewSelectionMode): void;
  fit(): void;
  zoomIn(): void;
  zoomOut(): void;
  toggleExploded(): boolean;
  toggleSection(): boolean;
  measureSelected(): PreviewMeasurement | undefined;
  clearSelection(): void;
  destroy(): void;
}

export interface ChiliPreviewConstructor {
  new (host: HTMLElement, options?: ChiliPreviewHostOptions): ChiliPreviewHost;
}

declare global {
  interface Window {
    ChiliCadPreview?: ChiliPreviewConstructor;
  }
}
