import type { BomNode } from "../model/types";

export type PreviewSelectionMode = "part" | "face" | "edge" | "vertex";
export type PreviewShadingMode = "shaded" | "shaded-edges" | "edges";
export type PreviewLightingMode = "studio" | "key" | "soft";

export interface ChiliPreviewHostOptions {
  onNodeSelected?: (nodeId: string | undefined) => void;
  onModelLoaded?: (nodes: BomNode[]) => void;
  onStateChanged?: (state: {
    selectionMode: PreviewSelectionMode;
    shadingMode: PreviewShadingMode;
    cameraType: "perspective" | "orthographic";
    lightingMode: PreviewLightingMode;
    axesVisible: boolean;
  }) => void;
  onError?: (message: string) => void;
}

export interface ChiliPreviewHost {
  loadBom(nodes: BomNode[]): void;
  loadFile(file: File): Promise<void>;
  selectNode(nodeId: string): void;
  setNodeVisibility(nodeId: string, visible: boolean): boolean;
  setSelectionMode(mode: PreviewSelectionMode): void;
  setShadingMode(mode: PreviewShadingMode): void;
  setCameraType(type: "perspective" | "orthographic"): void;
  setLightingMode(mode: PreviewLightingMode): void;
  setAxesVisible(visible: boolean): boolean;
  fit(): void;
  zoomIn(): void;
  zoomOut(): void;
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
