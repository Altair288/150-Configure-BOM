import Controller from "sap/ui/core/mvc/Controller";
import History from "sap/ui/core/routing/History";
import JSONModel from "sap/ui/model/json/JSONModel";
import type Model from "sap/ui/model/Model";
import type Router from "sap/ui/core/routing/Router";

import Component from "../Component";

export default class BaseController extends Controller {
  public getOwnerComponent(): Component {
    return super.getOwnerComponent() as Component;
  }

  public getRouter(): Router {
    return this.getOwnerComponent().getRouter();
  }

  public getModel<T extends Model = JSONModel>(name?: string): T {
    const view = this.getView();
    const model = view?.getModel(name) ?? this.getOwnerComponent().getModel(name);

    if (!model) {
      throw new Error(`Model '${name ?? "default"}' is not registered.`);
    }

    return model as T;
  }

  public onNavBack(): void {
    const previousHash = History.getInstance().getPreviousHash();

    if (previousHash !== undefined) {
      window.history.go(-1);
      return;
    }

    this.getRouter().navTo("home", {}, true);
  }
}
