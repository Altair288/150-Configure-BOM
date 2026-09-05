import type { ProductSummary } from "../model/types";
import ApiService from "./ApiService";

export default class ProductService {
  public static listProducts(): Promise<ProductSummary[]> {
    return ApiService.get<ProductSummary[]>("/api/products");
  }

  public static getProduct(id: string): Promise<ProductSummary> {
    return ApiService.get<ProductSummary>(`/api/products/${encodeURIComponent(id)}`);
  }
}
