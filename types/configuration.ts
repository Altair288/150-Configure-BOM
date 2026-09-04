import type { BomItem } from "@/types/bom";

export type SelectedOptions = Record<string, string[]>;
export type DisabledOptions = Record<string, string[]>;

export interface ResolvedRule {
  id: string;
  name: string;
  type: "Compatibility" | "AutoInclude";
  result: "Applied" | "Skipped";
  detail: string;
}

export interface ConfigurationRule {
  id: string;
  name: string;
  type: "Compatibility" | "AutoInclude";
  condition: string;
  action: string;
}

export interface ConfigurationResult {
  selectedOptions: SelectedOptions;
  disabledOptions: DisabledOptions;
  resolvedRules: ResolvedRule[];
  warnings: string[];
  generatedBom: BomItem;
}