import type { ConstraintRuleInput } from "../model/constraintRules";

export interface ConstraintAIResponseSample {
  explanation: string;
  rule: ConstraintRuleInput;
  selected: boolean;
}

export function createComplexConstraintAIResponseSamples(
  prompt: string
): ConstraintAIResponseSample[] {
  const firstId = `ai-${globalThis.crypto.randomUUID()}`;
  const secondId = `ai-${globalThis.crypto.randomUUID()}`;

  return [
    {
      explanation: "全景天窗与高配或豪华车型组合时，要求高级/豪华内饰，并建议 Nappa 皮革座椅。",
      rule: {
        id: firstId,
        code: "AI-SUNROOF-COMFORT",
        name: "全景天窗高配舒适组合约束",
        description: "高配或豪华车型配置全景天窗时，要求匹配内饰套装并建议 Nappa 皮革座椅。",
        source: { type: "AI", prompt },
        ast: {
          condition: {
            type: "AND",
            expressions: [
              { type: "EQUALS", feature: "SUNROOF_TYPE", value: "PANORAMIC" },
              {
                type: "OR",
                expressions: [
                  { type: "EQUALS", feature: "TRIM_LEVEL", value: "PREMIUM" },
                  { type: "EQUALS", feature: "TRIM_LEVEL", value: "LUXURY" }
                ]
              }
            ]
          },
          actions: [
            {
              type: "REQUIRE",
              target: { type: "IN", feature: "INTERIOR_PACKAGE", value: ["PREMIUM", "LUXURY"] }
            },
            {
              type: "RECOMMEND",
              target: { type: "EQUALS", feature: "SEAT_MATERIAL", value: "NAPPA_LEATHER" }
            }
          ]
        }
      },
      selected: true
    },
    {
      explanation: "全景天窗用于中国或全球市场时，要求 AWD/4WD 且电池容量不少于 80 kWh。",
      rule: {
        id: secondId,
        code: "AI-SUNROOF-MARKET-POWER",
        name: "全景天窗区域动力约束",
        description: "中国或全球市场的全景天窗车型需要四驱，并限制电池容量至少为 80 kWh。",
        source: { type: "AI", prompt },
        ast: {
          condition: {
            type: "AND",
            expressions: [
              { type: "EQUALS", feature: "SUNROOF_TYPE", value: "PANORAMIC" },
              {
                type: "OR",
                expressions: [
                  { type: "EQUALS", feature: "VEHICLE_REGION", value: "CHINA" },
                  { type: "EQUALS", feature: "VEHICLE_REGION", value: "GLOBAL" }
                ]
              }
            ]
          },
          actions: [
            {
              type: "REQUIRE",
              target: { type: "IN", feature: "DRIVE_TYPE", value: ["AWD", "4WD"] }
            },
            {
              type: "RESTRICT",
              target: {
                type: "GREATER_THAN_OR_EQUAL",
                feature: "BATTERY_CAPACITY",
                value: 80
              }
            }
          ]
        }
      },
      selected: true
    }
  ];
}
