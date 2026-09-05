import BaseController from "./BaseController";

export default class HomeController extends BaseController {
  public onOpenBom(): void {
    this.getRouter().navTo("bom", { bomId: "BOM-001" });
  }
}
