import type {
  ConstraintLiteral,
  ConstraintOperator,
  ConstraintPredicate,
  ConstraintRuleInput
} from "../model/constraintRules";

const predicate = (
  type: ConstraintOperator,
  feature: string,
  value: ConstraintLiteral | ConstraintLiteral[]
): ConstraintPredicate => ({ type, feature, value });

export const constraintRuleSamples: ConstraintRuleInput[] = [
  {
    id: "rule-sunroof-interior",
    code: "CR-001",
    name: "全景天窗内饰约束",
    description: "选择全景天窗时必须使用高级内饰。",
    ast: {
      condition: predicate("EQUALS", "SUNROOF_TYPE", "PANORAMIC"),
      actions: [{ type: "REQUIRE", target: predicate("EQUALS", "INTERIOR_PACKAGE", "PREMIUM") }]
    }
  },
  {
    id: "rule-sunroof-roof-rack",
    code: "CR-002",
    name: "天窗与行李架互斥",
    description: "全景天窗不能搭配 B 型车顶行李架。",
    ast: {
      condition: predicate("EQUALS", "SUNROOF_TYPE", "PANORAMIC"),
      actions: [{ type: "EXCLUDE", target: predicate("EQUALS", "ROOF_RACK", "TYPE_B") }]
    }
  },
  {
    id: "rule-awd-battery",
    code: "CR-003",
    name: "四驱电池容量要求",
    description: "全轮驱动车型至少需要 80 kWh 电池容量。",
    ast: {
      condition: predicate("EQUALS", "DRIVE_TYPE", "AWD"),
      actions: [
        { type: "RESTRICT", target: predicate("GREATER_THAN_OR_EQUAL", "BATTERY_CAPACITY", 80) }
      ]
    }
  },
  {
    id: "rule-winter-kit",
    code: "CR-004",
    name: "冬季套件",
    description: "选择冬季套件时需要加热方向盘和加热座椅。",
    ast: {
      condition: predicate("EQUALS", "WINTER_PACKAGE", true),
      actions: [
        { type: "REQUIRE", target: predicate("EQUALS", "HEATED_STEERING", true) },
        { type: "REQUIRE", target: predicate("EQUALS", "HEATED_SEAT", true) }
      ]
    }
  },
  {
    id: "rule-complex-market",
    code: "CR-005",
    name: "高配市场组合约束",
    description: "Premium 车型在非日本市场可使用 AWD 或 4WD。",
    ast: {
      condition: {
        type: "AND",
        expressions: [
          predicate("EQUALS", "TRIM_LEVEL", "PREMIUM"),
          {
            type: "NOT",
            expression: {
              type: "OR",
              expressions: [
                predicate("EQUALS", "VEHICLE_REGION", "JAPAN"),
                predicate("EQUALS", "ROOF_RACK", "TYPE_B")
              ]
            }
          }
        ]
      },
      actions: [
        {
          type: "REQUIRE",
          target: {
            type: "IN",
            feature: "DRIVE_TYPE",
            value: ["AWD", "4WD"]
          }
        }
      ]
    }
  }
];
