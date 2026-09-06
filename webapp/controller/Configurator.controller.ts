import JSONModel from "sap/ui/model/json/JSONModel";

import MessageToast from "sap/m/MessageToast";
import { createBomViews, createConfiguredBicycleBom } from "../model/models";
import type { ConfiguratorState } from "../model/types";
import BaseController from "./BaseController";

export default class ConfiguratorController extends BaseController {
  public onInit(): void {
    this.updateStatus();
  }

  public onConfigurationChange(): void {
    this.updateStatus();
  }

  public onGenerateBom(): void {
    const model = this.getModel<JSONModel>("config");
    const state = model.getData() as ConfiguratorState;
    try {
      const configuredBom = createConfiguredBicycleBom({
        scenario: state.scenario,
        wheelOption: state.wheelOption,
        handleStyle: state.handleStyle,
        saddleStyle: state.saddleStyle,
        fenderStyle: state.fenderStyle,
        rearRack: state.rearRack,
        lights: state.lights
      });
      const views = createBomViews(configuredBom.nodes);
      const currentView = views["100"];
      this.getModel<JSONModel>("bom").setData({
        id: configuredBom.id,
        name: "URBAN / 城市探索自行车",
        revision: "A.01",
        viewName: currentView.name,
        viewKey: currentView.key,
        viewDescription: currentView.description,
        lastUpdated: `配置 R${configuredBom.revision}`,
        loadedCount: currentView.loadedCount,
        nodes: currentView.nodes,
        views,
        visibleNodes: currentView.nodes,
        selectedNode: currentView.nodes[0],
        filterText: "",
        selectionMode: "part",
        shadingMode: "shaded-edges",
        cameraType: "perspective",
        axesVisible: true
      });
      model.setProperty("/status", "已生成 100% BOM，可在 BOM 页面切换 150% 结构候选");
      this.getRouter().navTo("bom");
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      model.setProperty("/status", message);
      MessageToast.show(message);
    }
  }

  private updateStatus(): void {
    const model = this.getModel<JSONModel>("config");
    model.setProperty("/status", "选配已更新，点击“生成 100% BOM”应用到装配结构");
  }
}
