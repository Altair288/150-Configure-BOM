import UIComponent from "sap/ui/core/UIComponent";

import {
  createBomModel,
  createConfiguratorModel,
  createDeviceModel,
  createProductModel,
  createRuleModel,
  createUiModel
} from "./model/models";

export default class Component extends UIComponent {
  public static metadata = {
    manifest: "json"
  };

  public init(): void {
    super.init();

    this.setModel(createDeviceModel(), "device");
    this.setModel(createUiModel(), "ui");
    this.setModel(createBomModel(), "bom");
    this.setModel(createConfiguratorModel(), "config");
    this.setModel(createProductModel(), "products");
    this.setModel(createRuleModel(), "rules");

    this.getRouter().initialize();
  }
}
