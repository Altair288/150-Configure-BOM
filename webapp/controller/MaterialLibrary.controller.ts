import FlexibleColumnLayout from "sap/f/FlexibleColumnLayout";
import type { IconTabHeader$SelectEvent } from "sap/m/IconTabHeader";
import type { ListBase$SelectionChangeEvent } from "sap/m/ListBase";
import type { SearchField$LiveChangeEvent } from "sap/m/SearchField";
import type { Select$ChangeEvent } from "sap/m/Select";
import type { Graph$GraphReadyEvent } from "sap/suite/ui/commons/networkgraph/Graph";
import Tree from "sap/m/Tree";
import type { Table$CellClickEvent } from "sap/ui/table/Table";
import JSONModel from "sap/ui/model/json/JSONModel";
import type { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";

import { buildMaterialRelatedGraph, type LibraryTreeNode, type MaterialLibraryItem, type MaterialVersion, type MaterialVersionChange } from "../model/library";
import BaseController from "./BaseController";

export default class MaterialLibraryController extends BaseController {
  private treeExpanded = false;
  private relatedGraphPanCleanup?: () => void;

  public onInit(): void {
    this.getRouter().getRoute("materialLibrary")?.attachPatternMatched(this.onRouteMatched, this);
  }

  public onExit(): void {
    this.relatedGraphPanCleanup?.();
    this.getRouter().getRoute("materialLibrary")?.detachPatternMatched(this.onRouteMatched, this);
  }

  public onAfterRendering(): void {
    if (!this.treeExpanded) {
      (this.byId("materialCategoryTree") as Tree).expandToLevel(2);
      this.treeExpanded = true;
    }
  }

  public onRouteMatched(event: Route$PatternMatchedEvent): void {
    const args = event.getParameter("arguments") as { categoryId?: string; materialId?: string };
    const model = this.getModel<JSONModel>("materialLibrary");
    const items = model.getProperty("/items") as MaterialLibraryItem[];
    const categoryId = args.categoryId || "all";
    const categoryNode = this.findTreeNode(model.getProperty("/tree") as LibraryTreeNode[], categoryId);
    const categoryIds = categoryNode?.categoryIds ?? [];
    const selected = items.find((item) => item.id === args.materialId) ?? items.find((item) => categoryIds.length === 0 || categoryIds.includes(item.categoryId)) ?? items[0];
    model.setProperty("/selectedCategoryId", categoryId);
    model.setProperty("/selectedCategoryIds", categoryIds);
    model.setProperty("/canCreateMaterial", categoryNode?.creatable === true);
    model.setProperty("/selectedCategoryTitle", categoryNode?.title ?? "全部物料");
    model.setProperty("/selected", selected);
    model.setProperty("/detailFullScreen", false);
    model.setProperty("/detailTabKey", "general");
    model.setProperty("/relatedGraph", buildMaterialRelatedGraph(selected));
    this.applyFilters();
    const fcl = this.byId("materialLibraryFcl") as FlexibleColumnLayout;
    if (args.materialId) {
      fcl.setLayout("ThreeColumnsMidExpanded");
    } else {
      fcl.setLayout("TwoColumnsMidExpanded");
    }
  }

  public onCategorySelectionChange(event: ListBase$SelectionChangeEvent): void {
    const item = event.getParameter("listItem") as { getBindingContext: (name: string) => { getObject: () => LibraryTreeNode } | undefined } | undefined;
    const node = item?.getBindingContext("materialLibrary")?.getObject();
    if (!node) return;
    this.getModel<JSONModel>("materialLibrary").setProperty("/selectedCategoryTitle", node.title);
    this.getRouter().navTo("materialLibrary", { categoryId: node.id });
  }

  public onMaterialCellPress(event: Table$CellClickEvent): void {
    const material = event.getParameter("rowBindingContext")?.getObject() as MaterialLibraryItem | undefined;
    if (!material) return;
    const categoryId = this.getModel<JSONModel>("materialLibrary").getProperty("/selectedCategoryId") as string;
    this.getRouter().navTo("materialLibrary", { categoryId, materialId: material.id });
  }

  public onToggleDetailFullScreen(): void {
    const fcl = this.byId("materialLibraryFcl") as FlexibleColumnLayout;
    const model = this.getModel<JSONModel>("materialLibrary");
    const fullScreen = fcl.getLayout() === "EndColumnFullScreen";
    if (fullScreen) {
      fcl.setLayout("ThreeColumnsMidExpanded");
    } else {
      fcl.setLayout("EndColumnFullScreen");
    }
    model.setProperty("/detailFullScreen", !fullScreen);
  }

  public onCloseDetail(): void {
    const categoryId = this.getModel<JSONModel>("materialLibrary").getProperty("/selectedCategoryId") as string;
    this.getRouter().navTo("materialLibrary", { categoryId });
  }

  public onSearch(event: SearchField$LiveChangeEvent): void {
    this.getModel<JSONModel>("materialLibrary").setProperty("/query", event.getParameter("newValue") ?? "");
    this.applyFilters();
  }

  public onStatusChange(event: Select$ChangeEvent): void {
    this.getModel<JSONModel>("materialLibrary").setProperty("/status", event.getSource().getSelectedKey());
    this.applyFilters();
  }

  public onVersionSelectionChange(event: ListBase$SelectionChangeEvent): void {
    const contexts = event.getSource().getSelectedContexts();
    if (contexts.length !== 2) return;

    const [older, newer] = contexts
      .map((context) => context.getObject() as MaterialVersion)
      .sort((left, right) => left.modifiedAt.localeCompare(right.modifiedAt));
    const fields: Array<[keyof MaterialVersion, string]> = [
      ["revision", "版本"],
      ["specification", "规格"],
      ["lifecycleStage", "生命周期阶段"],
      ["processStatus", "流程状态"]
    ];
    const changes: MaterialVersionChange[] = fields
      .filter(([key]) => older[key] !== newer[key])
      .map(([key, field]) => ({ field, from: older[key], to: newer[key] }));
    this.getModel<JSONModel>("materialLibrary").setProperty("/selected/versionChanges", changes);
  }

  public onDetailTabSelect(event: IconTabHeader$SelectEvent): void {
    this.getModel<JSONModel>("materialLibrary").setProperty("/detailTabKey", event.getParameter("key"));
  }

  public onExpandUpstream(): void {
    const model = this.getModel<JSONModel>("materialLibrary");
    const selected = model.getProperty("/selected") as MaterialLibraryItem;
    const depth = model.getProperty("/relatedGraph/upstreamDepth") as number;
    model.setProperty("/relatedGraph", buildMaterialRelatedGraph(selected, depth + 1));
  }

  public onCollapseUpstream(): void {
    const model = this.getModel<JSONModel>("materialLibrary");
    const selected = model.getProperty("/selected") as MaterialLibraryItem;
    model.setProperty("/relatedGraph", buildMaterialRelatedGraph(selected));
  }

  public onRelatedGraphReady(event: Graph$GraphReadyEvent): void {
    this.relatedGraphPanCleanup?.();
    const scroller = event.getSource().getDomRef()?.querySelector<HTMLElement>('.sapSuiteUiCommonsNetworkGraphScroller');
    if (!scroller) return;

    let activePointerId: number | null = null;
    let startX = 0;
    let startY = 0;
    let startScrollLeft = 0;
    let startScrollTop = 0;
    let dragging = false;

    const finish = (): void => {
      if (activePointerId === null) return;
      if (scroller.hasPointerCapture?.(activePointerId)) scroller.releasePointerCapture(activePointerId);
      activePointerId = null;
      dragging = false;
      scroller.classList.remove('sapSuiteUiCommonsNetworkGraphPanning');
    };
    const onPointerDown = (pointerEvent: PointerEvent): void => {
      if (pointerEvent.button !== 0) return;
      activePointerId = pointerEvent.pointerId;
      startX = pointerEvent.clientX;
      startY = pointerEvent.clientY;
      startScrollLeft = scroller.scrollLeft;
      startScrollTop = scroller.scrollTop;
      dragging = false;
      scroller.setPointerCapture?.(pointerEvent.pointerId);
    };
    const onPointerMove = (pointerEvent: PointerEvent): void => {
      if (activePointerId !== pointerEvent.pointerId) return;
      const deltaX = pointerEvent.clientX - startX;
      const deltaY = pointerEvent.clientY - startY;
      if (!dragging && Math.hypot(deltaX, deltaY) < 4) return;
      dragging = true;
      pointerEvent.preventDefault();
      scroller.classList.add('sapSuiteUiCommonsNetworkGraphPanning');
      scroller.scrollLeft = startScrollLeft - deltaX;
      scroller.scrollTop = startScrollTop - deltaY;
    };

    scroller.addEventListener('pointerdown', onPointerDown, true);
    scroller.addEventListener('pointermove', onPointerMove, true);
    scroller.addEventListener('pointerup', finish, true);
    scroller.addEventListener('pointercancel', finish, true);
    this.relatedGraphPanCleanup = () => {
      finish();
      scroller.removeEventListener('pointerdown', onPointerDown, true);
      scroller.removeEventListener('pointermove', onPointerMove, true);
      scroller.removeEventListener('pointerup', finish, true);
      scroller.removeEventListener('pointercancel', finish, true);
    };
  }

  private applyFilters(): void {
    const model = this.getModel<JSONModel>("materialLibrary");
    const items = model.getProperty("/items") as MaterialLibraryItem[];
    const categoryIds = model.getProperty("/selectedCategoryIds") as string[];
    const query = ((model.getProperty("/query") as string) || "").trim().toLowerCase();
    const status = model.getProperty("/status") as string;
    const visible = items.filter((item) =>
      (categoryIds.length === 0 || categoryIds.includes(item.categoryId)) &&
      (status === "All" || item.processStatus === status) &&
      (!query || `${item.code} ${item.name} ${item.category} ${item.specification} ${item.model}`.toLowerCase().includes(query))
    );
    model.setProperty("/visibleItems", visible);
  }

  private findTreeNode(nodes: LibraryTreeNode[], id: string): LibraryTreeNode | undefined {
    for (const node of nodes) {
      if (node.id === id) return node;
      const child = this.findTreeNode(node.children ?? [], id);
      if (child) return child;
    }
    return undefined;
  }
}
