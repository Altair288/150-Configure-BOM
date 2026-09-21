import FlexibleColumnLayout from "sap/f/FlexibleColumnLayout";
import type { IconTabHeader$SelectEvent } from "sap/m/IconTabHeader";
import type { ListBase$SelectionChangeEvent } from "sap/m/ListBase";
import type { SearchField$LiveChangeEvent } from "sap/m/SearchField";
import type { Select$ChangeEvent } from "sap/m/Select";
import Tree from "sap/m/Tree";
import type { Table$CellClickEvent } from "sap/ui/table/Table";
import JSONModel from "sap/ui/model/json/JSONModel";
import type { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";

import type { BomLibraryItem, LibraryTreeNode } from "../model/library";
import BaseController from "./BaseController";

export default class BomLibraryController extends BaseController {
  private treeExpanded = false;

  public onInit(): void {
    this.getRouter().getRoute("bomLibrary")?.attachPatternMatched(this.onRouteMatched, this);
  }

  public onExit(): void {
    this.getRouter().getRoute("bomLibrary")?.detachPatternMatched(this.onRouteMatched, this);
  }

  public onAfterRendering(): void {
    if (!this.treeExpanded) {
      (this.byId("bomCategoryTree") as Tree).expandToLevel(2);
      this.treeExpanded = true;
    }
  }

  public onRouteMatched(event: Route$PatternMatchedEvent): void {
    const args = event.getParameter("arguments") as { categoryId?: string; bomId?: string };
    const model = this.getModel<JSONModel>("bomLibrary");
    const items = model.getProperty("/items") as BomLibraryItem[];
    const categoryId = args.categoryId || "all";
    const selected = items.find((item) => item.id === args.bomId) ?? items.find((item) => categoryId === "all" || item.categoryId === categoryId) ?? items[0];
    model.setProperty("/selectedCategoryId", categoryId);
    model.setProperty("/selectedCategoryTitle", ({ all: "全部 BOM", product: "产品 BOM", frame: "车架系统", wheel: "轮组系统", drivetrain: "传动系统", accessory: "通勤附件" } as Record<string, string>)[categoryId] ?? "全部 BOM");
    model.setProperty("/selected", selected);
    model.setProperty("/detailFullScreen", false);
    model.setProperty("/detailTabKey", "general");
    this.applyFilters();
    const fcl = this.byId("bomLibraryFcl") as FlexibleColumnLayout;
    fcl.setLayout(args.bomId ? "ThreeColumnsMidExpanded" : "TwoColumnsMidExpanded");
  }

  public onCategorySelectionChange(event: ListBase$SelectionChangeEvent): void {
    const item = event.getParameter("listItem") as { getBindingContext: (name: string) => { getObject: () => LibraryTreeNode } | undefined } | undefined;
    const node = item?.getBindingContext("bomLibrary")?.getObject();
    if (!node) return;
    this.getModel<JSONModel>("bomLibrary").setProperty("/selectedCategoryTitle", node.title);
    this.getRouter().navTo("bomLibrary", { categoryId: node.id });
  }

  public onBomCellPress(event: Table$CellClickEvent): void {
    const bom = event.getParameter("rowBindingContext")?.getObject() as BomLibraryItem | undefined;
    if (!bom) return;
    const categoryId = this.getModel<JSONModel>("bomLibrary").getProperty("/selectedCategoryId") as string;
    this.getRouter().navTo("bomLibrary", { categoryId, bomId: bom.id });
  }

  public onToggleDetailFullScreen(): void {
    const fcl = this.byId("bomLibraryFcl") as FlexibleColumnLayout;
    const model = this.getModel<JSONModel>("bomLibrary");
    const fullScreen = fcl.getLayout() === "EndColumnFullScreen";
    fcl.setLayout(fullScreen ? "ThreeColumnsMidExpanded" : "EndColumnFullScreen");
    model.setProperty("/detailFullScreen", !fullScreen);
  }

  public onCloseDetail(): void {
    const categoryId = this.getModel<JSONModel>("bomLibrary").getProperty("/selectedCategoryId") as string;
    this.getRouter().navTo("bomLibrary", { categoryId });
  }

  public onSearch(event: SearchField$LiveChangeEvent): void {
    this.getModel<JSONModel>("bomLibrary").setProperty("/query", event.getParameter("newValue") ?? "");
    this.applyFilters();
  }

  public onStatusChange(event: Select$ChangeEvent): void {
    this.getModel<JSONModel>("bomLibrary").setProperty("/status", event.getSource().getSelectedKey());
    this.applyFilters();
  }

  public onDetailTabSelect(event: IconTabHeader$SelectEvent): void {
    this.getModel<JSONModel>("bomLibrary").setProperty("/detailTabKey", event.getParameter("key"));
  }

  private applyFilters(): void {
    const model = this.getModel<JSONModel>("bomLibrary");
    const items = model.getProperty("/items") as BomLibraryItem[];
    const categoryId = model.getProperty("/selectedCategoryId") as string;
    const query = ((model.getProperty("/query") as string) || "").trim().toLowerCase();
    const status = model.getProperty("/status") as string;
    model.setProperty("/visibleItems", items.filter((item) =>
      (categoryId === "all" || item.categoryId === categoryId) &&
      (status === "All" || item.status === status) &&
      (!query || `${item.number} ${item.name} ${item.category}`.toLowerCase().includes(query))
    ));
  }
}
