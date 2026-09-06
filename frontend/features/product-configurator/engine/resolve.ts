import { features } from "../mock/catalog";
import type { Configuration, FeatureValues, Resolution } from "../model/types";
import { marketingResolver } from "./marketingResolver";
import { specificationResolver } from "./specificationResolver";
import { materialMatcher } from "./materialMatcher";
import { ruleEngine } from "./ruleEngine";

export function resolveConfiguration(configuration: Configuration): Resolution {
  const requirements = marketingResolver(configuration);
  const values = Object.fromEntries(requirements.map((r) => [r.feature, r.value])) as FeatureValues;
  const rules = ruleEngine(values, configuration);
  const specifications = specificationResolver(requirements);
  const matches = specifications.map((s) => materialMatcher(s, configuration.decisions));
  const blockers = [
    ...features
      .filter((f) => !f.options.some((o) => o.value === values[f.id]))
      .map((f) => `${f.name}缺少有效值`),
    ...rules.filter((r) => r.status === "Conflict").map((r) => r.rule.message),
    ...matches
      .filter((m) => m.status === "NO_MATCH" || m.status === "AMBIGUOUS")
      .map(
        (m) =>
          `${m.specification.label}：${m.status === "NO_MATCH" ? "未找到满足当前规格的物料" : "请明确选择一个候选物料"}`
      )
  ];
  return {
    requirements,
    values,
    rules,
    specifications,
    matches,
    blockers,
    valid: blockers.length === 0,
    traces: matches.map((m) => ({
      specificationId: m.specification.id,
      requirements: m.specification.requirements,
      selectedCode: m.selected?.code,
      bomChildren: m.selected?.bom?.lines.map((line) => line.materialCode) ?? []
    }))
  };
}
