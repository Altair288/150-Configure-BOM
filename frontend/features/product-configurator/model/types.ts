import type { BomNode } from "../../../../webapp/model/types";

export type DomainId = "FRAME" | "WHEEL" | "DRIVETRAIN" | "ACCESSORY";
export type FeatureId =
  | "FRAME_MATERIAL"
  | "FRAME_STYLE"
  | "WHEEL_SIZE"
  | "WHEEL_TYPE"
  | "HANDLE_STYLE"
  | "SADDLE_STYLE"
  | "GEAR_TYPE"
  | "GEAR_COUNT"
  | "FENDER"
  | "FENDER_STYLE"
  | "REAR_RACK"
  | "LIGHT";
export type FeatureValue = string | number | boolean;
export type FeatureValues = Partial<Record<FeatureId, FeatureValue>>;
export interface FeatureOption {
  value: FeatureValue;
  label: string;
}
export interface FeatureDefinition {
  id: FeatureId;
  domain: DomainId;
  name: string;
  options: FeatureOption[];
}
export interface ConfigurationDomain {
  id: DomainId;
  name: string;
  description: string;
}
export interface Product {
  id: string;
  name: string;
  revision: string;
  domains: ConfigurationDomain[];
}
export interface MarketingOption {
  value: string;
  label: string;
  description: string;
  mapping: FeatureValues;
  ruleId: string;
}
export interface MarketingFeature {
  id: "scenario" | "edition";
  name: string;
  options: MarketingOption[];
}
export interface MarketingConfiguration {
  scenario: string;
  edition: string;
  FENDER: boolean;
  REAR_RACK: boolean;
  LIGHT: boolean;
}
export interface Configuration {
  marketing: MarketingConfiguration;
  overrides: FeatureValues;
  decisions: Record<string, string>;
  revision: number;
}
export interface TechnicalRequirement {
  feature: FeatureId;
  value: FeatureValue;
  source: "marketing" | "technical";
  sourceLabel: string;
  ruleId: string;
}
export interface Condition {
  feature: FeatureId | "SCENARIO";
  operator: "eq" | "in";
  value: FeatureValue | FeatureValue[];
}
export interface ConfigurationRule {
  id: string;
  type: "requires" | "recommends";
  when: Condition;
  then: Condition;
  severity: "Conflict" | "Warning";
  message: string;
  fix: FeatureValues;
}
export interface RuleResult {
  rule: ConfigurationRule;
  status: "Valid" | "Warning" | "Conflict" | "Recommended";
  triggered: boolean;
  passed: boolean;
}
export interface MaterialFeatureValue {
  feature: FeatureId;
  value: FeatureValue;
}
export interface MaterialBomLine {
  materialCode: string;
  quantity: number;
}
export interface MaterialBom {
  lines: MaterialBomLine[];
}
export interface Material {
  code: string;
  name: string;
  category: DomainId;
  features: MaterialFeatureValue[];
  bom?: MaterialBom;
  geometryKey?: string;
  color?: number;
}
export interface ResolvedSpecification {
  id: string;
  domain: DomainId;
  label: string;
  requirements: TechnicalRequirement[];
  required: boolean;
}
export interface MaterialMatchResult {
  specification: ResolvedSpecification;
  candidates: Material[];
  selected?: Material;
  status: "MATCHED" | "NO_MATCH" | "AMBIGUOUS" | "NOT_REQUIRED";
}
export interface ConfigurationTrace {
  specificationId: string;
  requirements: TechnicalRequirement[];
  selectedCode?: string;
  bomChildren: string[];
}
export interface Resolution {
  requirements: TechnicalRequirement[];
  values: FeatureValues;
  rules: RuleResult[];
  specifications: ResolvedSpecification[];
  matches: MaterialMatchResult[];
  traces: ConfigurationTrace[];
  valid: boolean;
  blockers: string[];
}
export interface ConfiguredBomLine extends BomNode {
  sourceSpecification?: string;
  rule?: string;
}
export interface ConfiguredBom {
  id: string;
  revision: number;
  nodes: ConfiguredBomLine[];
  partCount: number;
  moduleCount: number;
}
export type WorkspacePage = "products" | "configure" | "review";
