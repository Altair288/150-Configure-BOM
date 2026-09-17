import JSONModel from "sap/ui/model/json/JSONModel";
import type { SearchField$LiveChangeEvent } from "sap/m/SearchField";
import MessageToast from "sap/m/MessageToast";
import type { Menu$ItemSelectedEvent } from "sap/m/Menu";
import type MenuItem from "sap/m/MenuItem";
import MenuButton from "sap/m/MenuButton";
import type { Table$RowSelectionChangeEvent } from "sap/ui/table/Table";
import type { FileUploader$ChangeEvent } from "sap/ui/unified/FileUploader";
import TreeTable from "sap/ui/table/TreeTable";

import type { BomNode, BomViewDefinition, BomViewKey } from "../model/types";
import type {
  ChiliPreviewHost,
  PreviewSelectionMode,
  PreviewShadingMode
} from "../types/chili-preview";
import BaseController from "./BaseController";

export default class BomController extends BaseController {
  private initialTreeExpanded = false;
  private chiliPreview?: ChiliPreviewHost;
  private previewHostElement?: HTMLElement;
  private syncingPreviewSelection = false;

  public onAfterRendering(): void {
    if (!this.initialTreeExpanded) {
      (this.byId("bomTable") as TreeTable).expandToLevel(3);
      this.initialTreeExpanded = true;
    }

    const previewHost = this.byId("bomChiliHost")?.getDomRef() as HTMLElement | null;
    const PreviewConstructor = window.ChiliCadPreview;
    if (!previewHost || !PreviewConstructor || this.previewHostElement === previewHost) {
      return;
    }

    this.chiliPreview?.destroy();
    this.previewHostElement = previewHost;
    this.chiliPreview = new PreviewConstructor(previewHost, {
      onNodeSelected: (nodeId) => this.onPreviewNodeSelected(nodeId),
      onModelLoaded: (nodes) => this.onPreviewModelLoaded(nodes),
      onStateChanged: (state) => {
        const model = this.getModel<JSONModel>("bom");
        model.setProperty("/selectionMode", state.selectionMode);
        model.setProperty("/shadingMode", state.shadingMode);
        model.setProperty("/cameraType", state.cameraType);
        model.setProperty("/lightingMode", state.lightingMode);
        model.setProperty("/axesVisible", state.axesVisible);
        this.updatePreviewModeIcons(state.selectionMode, state.shadingMode, state.cameraType);
      },
      onError: (message) => MessageToast.show(message)
    });
    this.chiliPreview.loadBom(this.getModel<JSONModel>("bom").getProperty("/nodes") as BomNode[]);
  }

  public onExit(): void {
    this.chiliPreview?.destroy();
    this.chiliPreview = undefined;
    this.previewHostElement = undefined;
  }

  public onBomFilter(event: SearchField$LiveChangeEvent): void {
    const value = event.getParameter("newValue") ?? "";
    const model = this.getModel<JSONModel>("bom");
    const nodes = model.getProperty("/nodes") as BomNode[];
    const query = value.trim().toLowerCase();

    model.setProperty("/filterText", value);
    model.setProperty("/visibleNodes", query ? this.filterNodes(nodes, query) : nodes);
  }

  public onBomViewChange(event: Menu$ItemSelectedEvent): void {
    const item = event.getParameter("item") as MenuItem | undefined;
    const selectedKey = item?.getKey() as BomViewKey | undefined;
    if (!selectedKey) return;

    const model = this.getModel<JSONModel>("bom");
    const view = model.getProperty(`/views/${selectedKey}`) as BomViewDefinition | undefined;
    if (!view) return;

    model.setProperty("/viewKey", view.key);
    model.setProperty("/viewName", view.name);
    model.setProperty("/viewDescription", view.description);
    model.setProperty("/nodes", view.nodes);
    model.setProperty("/visibleNodes", view.nodes);
    model.setProperty("/selectedNode", view.nodes[0]);
    model.setProperty("/loadedCount", view.loadedCount);
    model.setProperty("/filterText", "");
    this.chiliPreview?.loadBom(view.nodes);
    (this.byId("bomTable") as TreeTable).expandToLevel(selectedKey === "150" ? 99 : 3);
  }

  public async onModelSelected(event: FileUploader$ChangeEvent): Promise<void> {
    const file = event.getParameter("files")?.[0] as File | undefined;
    if (!file || !this.chiliPreview) return;

    const model = this.getModel<JSONModel>("bom");
    model.setProperty("/busy", true);
    await this.chiliPreview.loadFile(file);
    model.setProperty("/busy", false);
  }

  public onExpandAll(): void {
    (this.byId("bomTable") as TreeTable).expandToLevel(99);
  }

  public onCollapseAll(): void {
    (this.byId("bomTable") as TreeTable).collapseAll();
  }

  public onToggleFavorite(): void {
    const model = this.getModel<JSONModel>("bom");
    model.setProperty("/favorite", !model.getProperty("/favorite"));
  }

  public onSettings(): void {
    const model = this.getModel<JSONModel>("bom");
    model.setProperty("/settingsOpen", !model.getProperty("/settingsOpen"));
  }

  public onSelectionChange(event: Table$RowSelectionChangeEvent): void {
    const selectedNode = event.getParameter("rowContext")?.getObject() as BomNode | undefined;

    if (selectedNode) {
      this.getModel<JSONModel>("bom").setProperty("/selectedNode", selectedNode);
      if (!this.syncingPreviewSelection) {
        this.chiliPreview?.selectNode(selectedNode.id);
      }
    }
  }

  public onSelectionModeChange(event: Menu$ItemSelectedEvent): void {
    const item = event.getParameter("item") as MenuItem | undefined;
    const selectedKey = item?.getKey() as PreviewSelectionMode | undefined;
    if (!selectedKey) return;

    this.chiliPreview?.setSelectionMode(selectedKey);
    this.getModel<JSONModel>("bom").setProperty("/selectionMode", selectedKey);
    this.updatePreviewModeIcons(selectedKey);
  }

  public onShadingModeChange(event: Menu$ItemSelectedEvent): void {
    const item = event.getParameter("item") as MenuItem | undefined;
    const selectedKey = item?.getKey() as PreviewShadingMode | undefined;
    if (!selectedKey) return;

    this.chiliPreview?.setShadingMode(selectedKey);
    this.getModel<JSONModel>("bom").setProperty("/shadingMode", selectedKey);
    this.updatePreviewModeIcons(undefined, selectedKey);
  }

  public onCameraTypeChange(event: Menu$ItemSelectedEvent): void {
    const item = event.getParameter("item") as MenuItem | undefined;
    const selectedKey = item?.getKey() as "perspective" | "orthographic" | undefined;
    if (!selectedKey) return;

    this.chiliPreview?.setCameraType(selectedKey);
    this.getModel<JSONModel>("bom").setProperty("/cameraType", selectedKey);
    this.updatePreviewModeIcons(undefined, undefined, selectedKey);
  }

  public onToggleAxes(): void {
    const model = this.getModel<JSONModel>("bom");
    const visible = model.getProperty("/axesVisible") !== false;
    const nextVisible = this.chiliPreview?.setAxesVisible(!visible) ?? !visible;
    model.setProperty("/axesVisible", nextVisible);
  }

  public onZoomIn(): void {
    this.chiliPreview?.zoomIn();
  }

  public onZoomOut(): void {
    this.chiliPreview?.zoomOut();
  }

  public onFit(): void {
    this.chiliPreview?.fit();
  }

  public onToggleSelectedVisibility(): void {
    const model = this.getModel<JSONModel>("bom");
    const selectedNode = model.getProperty("/selectedNode") as BomNode | undefined;
    if (!selectedNode || !this.chiliPreview) return;

    const visible = this.chiliPreview.setNodeVisibility(
      selectedNode.id,
      selectedNode.visible === false
    );
    model.setProperty("/selectedNode/visible", visible);
  }

  public async onFullScreen(): Promise<void> {
    const host = this.previewHostElement;
    if (!host) return;

    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await host.requestFullscreen();
    }
  }

  public onOpenViewer(): void {
    this.getRouter().navTo("viewer", { modelId: "MODEL-001" });
  }

  private filterNodes(nodes: BomNode[], query: string): BomNode[] {
    return nodes.reduce<BomNode[]>((matches, node) => {
      const children = this.filterNodes(node.children ?? [], query);
      const nodeMatches = `${node.number} ${node.name}`.toLowerCase().includes(query);

      if (nodeMatches || children.length > 0) {
        matches.push({
          ...node,
          children: children.length > 0 ? children : nodeMatches ? node.children : undefined
        });
      }

      return matches;
    }, []);
  }

  private onPreviewNodeSelected(nodeId: string | undefined): void {
    const model = this.getModel<JSONModel>("bom");
    const nodes = model.getProperty("/nodes") as BomNode[];
    const selectedNode = nodeId ? this.findNode(nodes, nodeId) : undefined;

    model.setProperty("/selectedNode", selectedNode);
    if (selectedNode) {
      this.syncingPreviewSelection = true;
      try {
        this.selectTableNode(selectedNode.id);
      } finally {
        this.syncingPreviewSelection = false;
      }
    }
  }

  private onPreviewModelLoaded(nodes: BomNode[]): void {
    const model = this.getModel<JSONModel>("bom");
    model.setProperty("/nodes", nodes);
    model.setProperty("/visibleNodes", nodes);
    model.setProperty("/selectedNode", nodes[0]);
    model.setProperty("/loadedCount", this.countNodes(nodes));

    if (nodes[0]) {
      model.setProperty("/name", nodes[0].name);
      model.setProperty("/revision", "CAD");
    }
  }

  private findNode(nodes: BomNode[], id: string): BomNode | undefined {
    for (const node of nodes) {
      if (node.id === id) return node;
      const child = this.findNode(node.children ?? [], id);
      if (child) return child;
    }

    return undefined;
  }

  private countNodes(nodes: BomNode[]): number {
    return nodes.reduce((count, node) => count + 1 + this.countNodes(node.children ?? []), 0);
  }

  private selectTableNode(nodeId: string): void {
    const table = this.byId("bomTable") as TreeTable;
    const binding = table.getBinding("rows") as { getLength?: () => number } | undefined;
    const selectVisibleRow = (): boolean => {
      const rowCount = binding?.getLength?.() ?? 0;

      for (let index = 0; index < rowCount; index++) {
        const context = table.getContextByIndex(index);
        if (context?.getProperty("id") === nodeId) {
          if (table.getSelectedIndex() !== index) {
            table.setSelectedIndex(index);
          }
          return true;
        }
      }

      return false;
    };

    if (!selectVisibleRow()) {
      table.expandToLevel(99);
      selectVisibleRow();
    }
  }

  private updatePreviewModeIcons(
    selectionMode?: PreviewSelectionMode,
    shadingMode?: PreviewShadingMode,
    cameraType?: "perspective" | "orthographic"
  ): void {
    const model = this.getModel<JSONModel>("bom");
    const selection =
      selectionMode ?? (model.getProperty("/selectionMode") as PreviewSelectionMode) ?? "part";
    const shading =
      shadingMode ?? (model.getProperty("/shadingMode") as PreviewShadingMode) ?? "shaded-edges";
    const camera =
      cameraType ??
      (model.getProperty("/cameraType") as "perspective" | "orthographic") ??
      "perspective";
    const selectionIcons: Record<PreviewSelectionMode, string> = {
      part: "sap-icon://product",
      face: "sap-icon://dimension",
      edge: "sap-icon://line-chart",
      vertex: "sap-icon://circle-task-2"
    };
    const shadingIcons: Record<PreviewShadingMode, string> = {
      shaded: "sap-icon://palette",
      "shaded-edges": "sap-icon://border",
      edges: "sap-icon://line-chart"
    };
    const cameraIcons = {
      perspective: "sap-icon://camera",
      orthographic: "sap-icon://dimension"
    } as const;

    (this.byId("selectionMode") as MenuButton | undefined)?.setIcon(selectionIcons[selection]);
    (this.byId("shadingMode") as MenuButton | undefined)?.setIcon(shadingIcons[shading]);
    (this.byId("cameraTypeMenu") as MenuButton | undefined)?.setIcon(cameraIcons[camera]);
  }
}
