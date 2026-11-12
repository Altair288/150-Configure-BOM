import { createConstraintRule, validateConstraintRule } from "../model/constraintRules";
import type { ConstraintRule } from "../model/constraintRules";
import type { FeatureDefinition } from "../model/configuration";

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
  clarification?: string;
}

export interface ConstraintAIAmbiguity {
  prompt: string;
  options: Array<{ key: string; label: string; detail: string }>;
}

export interface ConstraintAISuggestion {
  id: string;
  explanation: string;
  rule: ConstraintRule;
  selected: boolean;
}

export interface ConstraintAIResponse {
  suggestions: ConstraintAISuggestion[];
  ambiguity?: ConstraintAIAmbiguity;
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

function createSuggestionId(): string {
  return `ai-${globalThis.crypto.randomUUID()}`;
}

function hasFeature(features: FeatureDefinition[], code: string): boolean {
  return features.some((feature) => feature.code === code && feature.active);
}

function hasActiveValue(
  features: FeatureDefinition[],
  featureCode: string,
  valueCode: string
): boolean {
  const feature = features.find((item) => item.code === featureCode && item.active);
  return !!feature?.domain.values.some((value) => value.code === valueCode && value.active);
}

function validateSuggestions(
  suggestions: ConstraintAISuggestion[],
  request: ConstraintAIRequest
): ConstraintAIResponse {
  const candidateRules = [...request.rules, ...suggestions.map((suggestion) => suggestion.rule)];
  const errors = suggestions.flatMap((suggestion) =>
    validateConstraintRule(suggestion.rule, candidateRules, request.features)
      .filter((issue) => issue.severity === "Error")
      .map((issue) => issue.message)
  );
  if (!errors.length) return { suggestions };
  return {
    suggestions: [],
    ambiguity: {
      prompt: `生成结果未通过当前 Feature Model 校验：${errors.join("；")}`,
      options: request.features
        .filter((feature) => feature.active)
        .slice(0, 3)
        .map((feature) => ({
          key: feature.code,
          label: feature.name,
          detail: `${feature.code} · ${feature.dataType}`
        }))
    }
  };
}

function createSunroofSuggestions(prompt: string): ConstraintAISuggestion[] {
  const first = createConstraintRule({
    id: createSuggestionId(),
    code: "AI-REQUIRES-SUNROOF",
    name: "全景天窗内饰约束",
    description: "选择全景天窗时必须使用高级内饰。",
    source: { type: "AI", prompt },
    ast: {
      condition: { type: "EQUALS", feature: "SUNROOF_TYPE", value: "PANORAMIC" },
      actions: [
        {
          type: "REQUIRE",
          target: { type: "EQUALS", feature: "INTERIOR_PACKAGE", value: "PREMIUM" }
        }
      ]
    }
  });
  const second = createConstraintRule({
    id: createSuggestionId(),
    code: "AI-EXCLUDES-ROOF-RACK",
    name: "天窗与行李架互斥",
    description: "选择全景天窗时不可选择 B 型车顶行李架。",
    source: { type: "AI", prompt },
    ast: {
      condition: { type: "EQUALS", feature: "SUNROOF_TYPE", value: "PANORAMIC" },
      actions: [
        {
          type: "EXCLUDE",
          target: { type: "EQUALS", feature: "ROOF_RACK", value: "TYPE_B" }
        }
      ]
    }
  });
  return [
    {
      id: first.id,
      explanation: "当 Sunroof Type 为 Panoramic 时，要求 Interior Package 为 Premium。",
      rule: first,
      selected: true
    },
    {
      id: second.id,
      explanation: "当 Sunroof Type 为 Panoramic 时，Roof Rack Type B 与全景天窗互斥。",
      rule: second,
      selected: true
    }
  ];
}

function createTrimSeatSuggestion(
  prompt: string,
  seatFeature: string,
  seatValue: string,
  seatLabel: string
): ConstraintAISuggestion[] {
  const rule = createConstraintRule({
    id: createSuggestionId(),
    code: "AI-REQUIRES-PREMIUM-SEAT",
    name: "高配车型座椅要求",
    description: `Trim Level 为 Premium 时，要求 ${seatLabel}。`,
    source: { type: "AI", prompt },
    ast: {
      condition: { type: "EQUALS", feature: "TRIM_LEVEL", value: "PREMIUM" },
      actions: [
        { type: "REQUIRE", target: { type: "EQUALS", feature: seatFeature, value: seatValue } }
      ]
    }
  });
  return [
    {
      id: rule.id,
      explanation: `当 Trim Level 为 Premium 时，要求 ${seatLabel}。`,
      rule,
      selected: true
    }
  ];
}

export class MockConstraintAIService implements ConstraintAIService {
  private readonly stageDelayMs: number;

  public constructor(stageDelayMs = 240) {
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

    const text = request.prompt.toLocaleLowerCase();
    if (text.includes("高配车型")) {
      const choices = (request.clarification ?? "").split("|").filter(Boolean);
      if (!choices.length) {
        return {
          suggestions: [],
          ambiguity: {
            prompt: "“高配车型”可能对应多个对象，请先选择引用方式。",
            options: [
              { key: "SUV_PREMIUM", label: "SUV Premium", detail: "Product Model" },
              { key: "PREMIUM_PACKAGE", label: "Premium Package", detail: "Package" },
              { key: "TRIM_LEVEL", label: "Trim Level = Premium", detail: "Feature / Value" }
            ]
          }
        };
      }
      if (choices[0] !== "TRIM_LEVEL") {
        return {
          suggestions: [],
          ambiguity: {
            prompt: "当前 Constraint AST 只支持 Feature 条件；请选择 Feature / Value 映射。",
            options: [
              { key: "TRIM_LEVEL", label: "Trim Level = Premium", detail: "Feature / Value" }
            ]
          }
        };
      }
      if (!hasActiveValue(request.features, "TRIM_LEVEL", "PREMIUM")) {
        return {
          suggestions: [],
          ambiguity: {
            prompt: "当前 Feature Model 中没有活动的 Trim Level = Premium 值，请先确认可用配置值。",
            options: request.features
              .filter((feature) => feature.active)
              .slice(0, 3)
              .map((feature) => ({
                key: feature.code,
                label: feature.name,
                detail: `${feature.code} · ${feature.dataType}`
              }))
          }
        };
      }
      if (choices.length < 2) {
        const seatOptions = [
          {
            key: "SEAT_TYPE:COMFORT",
            feature: "SEAT_TYPE",
            value: "COMFORT",
            label: "Comfort Seat"
          },
          {
            key: "SEAT_MATERIAL:NAPPA_LEATHER",
            feature: "SEAT_MATERIAL",
            value: "NAPPA_LEATHER",
            label: "Nappa Leather"
          }
        ].flatMap((option) => {
          const feature = request.features.find((item) => item.code === option.feature);
          const value = feature?.domain.values.find(
            (item) => item.code === option.value && item.active
          );
          return feature && value
            ? [{ key: option.key, label: value.value, detail: feature.name }]
            : [];
        });
        return {
          suggestions: [],
          ambiguity: {
            prompt: "“高级座椅”对应多个 Feature Value，请选择一个。",
            options: seatOptions
          }
        };
      }
      const [seatFeature, seatValue] = choices[1].split(":");
      const feature = request.features.find((item) => item.code === seatFeature);
      const option = feature?.domain.values.find((item) => item.code === seatValue && item.active);
      if (feature && option && hasFeature(request.features, "TRIM_LEVEL"))
        return validateSuggestions(
          createTrimSeatSuggestion(
            request.prompt,
            feature.code,
            option.code,
            `${feature.name} = ${option.value}`
          ),
          request
        );
    }

    const canGenerateSunroof =
      hasFeature(request.features, "SUNROOF_TYPE") &&
      hasActiveValue(request.features, "SUNROOF_TYPE", "PANORAMIC") &&
      hasActiveValue(request.features, "INTERIOR_PACKAGE", "PREMIUM") &&
      hasActiveValue(request.features, "ROOF_RACK", "TYPE_B");
    if (canGenerateSunroof && (text.includes("全景天窗") || text.includes("panoramic")))
      return validateSuggestions(createSunroofSuggestions(request.prompt), request);

    return {
      suggestions: [],
      ambiguity: {
        prompt:
          "未能从当前 Configuration Context 唯一识别条件与目标 Feature，请选择一个待引用 Feature。",
        options: request.features.slice(0, 3).map((feature) => ({
          key: feature.code,
          label: feature.name,
          detail: `${feature.code} · ${feature.dataType}`
        }))
      }
    };
  }
}
