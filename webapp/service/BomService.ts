import type { BomDocument } from "../model/types";
import ApiService from "./ApiService";

export default class BomService {
  public static getBom(id: string): Promise<BomDocument> {
    return ApiService.get<BomDocument>(`/api/boms/${encodeURIComponent(id)}`);
  }
}
