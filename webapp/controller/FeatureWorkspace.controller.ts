import type { Router$RouteMatchedEvent } from "sap/ui/core/routing/Router";
import JSONModel from "sap/ui/model/json/JSONModel";
import BaseController from "./BaseController";
import type { WorkspacePage } from "../../frontend/features/product-configurator/model/types";

export default class FeatureWorkspaceController extends BaseController {
  private mounted?: { destroy: () => void };
  private host?: HTMLElement;
  public onInit(): void {
    this.getRouter().attachRouteMatched(this.onRouteMatched, this);
  }
  public onRouteMatched(event: Router$RouteMatchedEvent): void {
    const name = event.getParameter("name");
    const page: WorkspacePage =
      name === "configurator"
        ? "configure"
        : name === "review" || name === "rules"
          ? "review"
          : "products";
    if (["home", "product", "configurator", "review", "rules"].includes(name ?? ""))
      window.FeatureWorkspace?.setPage(page);
  }
  public onAfterRendering(): void {
    const host = this.byId("featureHost")?.getDomRef() as HTMLElement | null;
    if (!host || host === this.host || !window.FeatureWorkspace) return;
    this.mounted?.destroy();
    this.host = host;
    this.mounted = window.FeatureWorkspace.mount(host, {
      onNavigate: (page) =>
        this.getRouter().navTo(
          page === "products" ? "home" : page === "configure" ? "configurator" : "review",
          page === "configure" ? { configId: "URBAN" } : {}
        ),
      onOpenBom: (bom) => {
        this.getModel<JSONModel>("bom").setData({
          id: bom.id,
          name: "URBAN / 城市探索自行车",
          revision: "A.01",
          viewName: "100% Configured BOM",
          lastUpdated: `配置 R${bom.revision}`,
          nodes: bom.nodes,
          visibleNodes: bom.nodes,
          selectedNode: bom.nodes[0],
          loadedCount: bom.partCount,
          activeCount: bom.partCount,
          filterText: "",
          isBicycle: true,
          configured: true,
          selectionMode: "part",
          shadingMode: "shaded-edges",
          exploded: false,
          sectioned: false
        });
        this.getRouter().navTo("bom");
      }
    });
  }
  public onExit(): void {
    this.getRouter().detachRouteMatched(this.onRouteMatched, this);
    this.mounted?.destroy();
  }
}
