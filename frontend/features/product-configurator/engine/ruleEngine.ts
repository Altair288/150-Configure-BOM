import { rules } from "../mock/catalog";
import type { Condition, Configuration, FeatureValues, RuleResult } from "../model/types";

export function ruleEngine(values: FeatureValues, configuration: Configuration): RuleResult[] {
  const evaluate = (condition: Condition) => {
    const value =
      condition.feature === "SCENARIO"
        ? configuration.marketing.scenario
        : values[condition.feature];
    return condition.operator === "in" && Array.isArray(condition.value)
      ? condition.value.includes(value!)
      : value === condition.value;
  };
  return rules.map((rule) => {
    const triggered = evaluate(rule.when);
    const passed = !triggered || evaluate(rule.then);
    return {
      rule,
      triggered,
      passed,
      status: !passed
        ? rule.severity
        : rule.type === "recommends" && triggered
          ? "Recommended"
          : "Valid"
    };
  });
}
