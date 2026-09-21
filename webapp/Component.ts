import UIComponent from "sap/ui/core/UIComponent";
import ResourceModel from "sap/ui/model/resource/ResourceModel";

import {
  createBomModel,
  createConfiguratorModel,
  createDeviceModel,
  createProductModel,
  createRuleModel,
  createUiModel
} from "./model/models";
import { createBomLibraryModel, createMaterialLibraryModel } from "./model/library";

export default class Component extends UIComponent {
  public static metadata = {
    manifest: "json"
  };

  public init(): void {
    super.init();

    const savedLanguage = localStorage.getItem("superbom.language");
    if (savedLanguage) sap.ui.getCore().getConfiguration().setLanguage(savedLanguage);

    // The configuration workbench builds controls programmatically, so expose the
    // resource model to XML views and its shared text helpers from one place.
    const i18n = new ResourceModel({ bundleName: "com.company.superbom.i18n.i18n", async: true });
    this.setModel(i18n, "i18n");
    sap.ui.getCore().setModel(i18n, "i18n");

    this.setModel(createDeviceModel(), "device");
    this.setModel(createUiModel(), "ui");
    this.setModel(createBomModel(), "bom");
    this.setModel(createConfiguratorModel(), "config");
    this.setModel(createProductModel(), "products");
    this.setModel(createRuleModel(), "rules");
    this.setModel(createMaterialLibraryModel(), "materialLibrary");
    this.setModel(createBomLibraryModel(), "bomLibrary");

    this.getRouter().initialize();
  }
}
