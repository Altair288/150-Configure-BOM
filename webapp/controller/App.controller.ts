import JSONModel from "sap/ui/model/json/JSONModel";
import type { SideNavigation$ItemSelectEvent } from "sap/tnt/SideNavigation";
import type { Router$RouteMatchedEvent } from "sap/ui/core/routing/Router";

import BaseController from "./BaseController";

export default class AppController extends BaseController {
  private readonly navigationRoutes: Record<string, string> = {
    home: "home",
    bom: "bom",
    configurator: "configurator",
    products: "product",
    rules: "rules",
    viewer: "viewer"
  };

  public onInit(): void {
    this.getRouter().attachRouteMatched(this.onRouteMatched, this);
  }

  public onExit(): void {
    this.getRouter().detachRouteMatched(this.onRouteMatched, this);
  }

  public onToggleSideNavigation(): void {
    const uiModel = this.getModel<JSONModel>("ui");
    uiModel.setProperty("/sideExpanded", !uiModel.getProperty("/sideExpanded"));
  }

  public onNavigationSelect(event: SideNavigation$ItemSelectEvent): void {
    const selectedItem = event.getParameter("item");
    const selectedKey = selectedItem?.getKey() ?? "home";
    const routeName = this.navigationRoutes[selectedKey] ?? "home";

    if (routeName === "bom") {
      this.getRouter().navTo(routeName);
      return;
    }

    if (routeName === "configurator") {
      this.getRouter().navTo(routeName, { configId: "CFG-001" });
      return;
    }

    if (routeName === "product") {
      this.getRouter().navTo(routeName, { productId: "PROD-001" });
      return;
    }

    if (routeName === "viewer") {
      this.getRouter().navTo(routeName, { modelId: "MODEL-001" });
      return;
    }

    this.getRouter().navTo(routeName);
  }

  public onRouteMatched(event: Router$RouteMatchedEvent): void {
    const routeName = event.getParameter("name") ?? "home";
    let selectedNavigationKey = routeName;

    if (routeName === "product") {
      selectedNavigationKey = "products";
    }

    if (routeName === "bom" || routeName === "bomDetail") {
      selectedNavigationKey = "bom";
    }

    const uiModel = this.getModel<JSONModel>("ui");
    uiModel.setProperty("/selectedNavigationKey", selectedNavigationKey);
  }
}
