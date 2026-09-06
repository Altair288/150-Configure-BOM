import { features, marketingFeatures } from "../mock/catalog";
import type { Configuration, TechnicalRequirement } from "../model/types";

export function marketingResolver(configuration: Configuration): TechnicalRequirement[] {
  const requirements = new Map<string, TechnicalRequirement>();
  for (const feature of marketingFeatures) {
    const choice = feature.options.find(
      (option) => option.value === configuration.marketing[feature.id]
    );
    if (!choice) throw new Error(`未知营销选项：${feature.id}`);
    for (const definition of features) {
      const value = choice.mapping[definition.id];
      if (value !== undefined)
        requirements.set(definition.id, {
          feature: definition.id,
          value,
          source: "marketing",
          sourceLabel: `${feature.name} / ${choice.label}`,
          ruleId: choice.ruleId
        });
    }
  }
  for (const feature of ["FENDER", "REAR_RACK", "LIGHT"] as const)
    requirements.set(feature, {
      feature,
      value: configuration.marketing[feature],
      source: "marketing",
      sourceLabel: "营销配置 / 舒适附件",
      ruleId: "MKT-ACCESSORY-001"
    });
  for (const definition of features) {
    const value = configuration.overrides[definition.id];
    if (value !== undefined)
      requirements.set(definition.id, {
        feature: definition.id,
        value,
        source: "technical",
        sourceLabel: `技术配置 / ${definition.name}（显式覆盖）`,
        ruleId: "TECH-OVERRIDE"
      });
  }
  return [...requirements.values()];
}
