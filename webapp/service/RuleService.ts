import type { RuleSummary } from "../model/types";
import ApiService from "./ApiService";

export default class RuleService {
  public static listRules(): Promise<RuleSummary[]> {
    return ApiService.get<RuleSummary[]>("/api/rules");
  }
}
