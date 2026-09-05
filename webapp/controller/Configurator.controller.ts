import JSONModel from "sap/ui/model/json/JSONModel";

import ConfiguratorService from "../service/ConfiguratorService";
import type { ConfiguratorState } from "../model/types";
import BaseController from "./BaseController";

export default class ConfiguratorController extends BaseController {
  public onInit(): void {
    this.applyRules();
  }

  public onConfigurationChange(): void {
    this.applyRules();
  }

  private applyRules(): void {
    const model = this.getModel<JSONModel>("config");
    const state = model.getData() as ConfiguratorState;
    const evaluation = ConfiguratorService.evaluate(state);

    model.setProperty("/gearbox", evaluation.gearbox);
    model.setProperty("/enabledOptions", evaluation.enabledOptions);
    model.setProperty("/result", evaluation.result);
  }
}
