import BaseController from "./BaseController";

export default class ProductController extends BaseController {
  public onProductPress(): void {
    this.getRouter().navTo("product", { productId: "PROD-001" });
  }
}
