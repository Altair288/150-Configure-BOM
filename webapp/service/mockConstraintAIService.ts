import { createConstraintRule, validateConstraintRule } from "../model/constraintRules";
import type { ConstraintRule } from "../model/constraintRules";
import type { FeatureDefinition } from "../model/configuration";
import { createComplexConstraintAIResponseSamples } from "../mock/constraintAIResponseSamples";

export type ConstraintAIStage =
  | "ANALYZING_REQUEST"
  | "IDENTIFYING_FEATURES"
  | "IDENTIFYING_VALUES"
  | "ANALYZING_RELATIONSHIPS"
  | "GENERATING_RULES"
  | "VALIDATING_RULES";

export interface ConstraintAIRequest {
  prompt: string;
  features: FeatureDefinition[];
  rules: ConstraintRule[];
}

export interface ConstraintAISuggestion {
  id: string;
  explanation: string;
  rule: ConstraintRule;
  selected: boolean;
}

export interface ConstraintAIResponse {
  suggestions: ConstraintAISuggestion[];
}

export interface ConstraintAIService {
  generate(
    request: ConstraintAIRequest,
    onStage?: (stage: ConstraintAIStage) => void
  ): Promise<ConstraintAIResponse>;
}

const stages: ConstraintAIStage[] = [
  "ANALYZING_REQUEST",
  "IDENTIFYING_FEATURES",
  "IDENTIFYING_VALUES",
  "ANALYZING_RELATIONSHIPS",
  "GENERATING_RULES",
  "VALIDATING_RULES"
];

function delay(duration: number): Promise<void> {
  return new Promise((resolve) => globalThis.setTimeout(resolve, duration));
}

function validateSuggestions(
  suggestions: ConstraintAISuggestion[],
  request: ConstraintAIRequest
): ConstraintAISuggestion[] {
  const candidateRules = [...request.rules, ...suggestions.map((suggestion) => suggestion.rule)];
  const errors = suggestions.flatMap((suggestion) =>
    validateConstraintRule(suggestion.rule, candidateRules, request.features)
      .filter((issue) => issue.severity === "Error")
      .map((issue) => issue.message)
  );
  if (errors.length) throw new Error(`生成结果未通过当前 Feature Model 校验：${errors.join("；")}`);
  return suggestions;
}

export class MockConstraintAIService implements ConstraintAIService {
  private readonly stageDelayMs: number;

  public constructor(stageDelayMs = 350) {
    this.stageDelayMs = stageDelayMs;
  }

  public async generate(
    request: ConstraintAIRequest,
    onStage?: (stage: ConstraintAIStage) => void
  ): Promise<ConstraintAIResponse> {
    for (const stage of stages) {
      onStage?.(stage);
      await delay(this.stageDelayMs);
    }

    const suggestions = createComplexConstraintAIResponseSamples(request.prompt).map((sample) => {
      const rule = createConstraintRule(sample.rule);
      return {
        id: rule.id,
        explanation: sample.explanation,
        rule,
        selected: sample.selected
      };
    });
    return { suggestions: validateSuggestions(suggestions, request) };
  }
}
