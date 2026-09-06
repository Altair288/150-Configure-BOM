import type {
  Configuration,
  FeatureDefinition,
  FeatureId,
  FeatureValue,
  MarketingFeature,
  Material,
  Product,
  ConfigurationRule
} from "../model/types";

export const product: Product = {
  id: "URBAN",
  name: "城市探索自行车",
  revision: "A.01",
  domains: [
    { id: "FRAME", name: "车架系统", description: "定义承载结构、材料与骑行姿态" },
    { id: "WHEEL", name: "轮组系统", description: "定义路面适应性与轮胎尺寸" },
    { id: "DRIVETRAIN", name: "传动系统", description: "定义变速方式与速比范围" },
    { id: "ACCESSORY", name: "通勤附件", description: "定义载物、全天候与照明需求" }
  ]
};
const options = (...pairs: [FeatureValue, string][]) =>
  pairs.map(([value, label]) => ({ value, label }));
export const features: FeatureDefinition[] = [
  {
    id: "FRAME_MATERIAL",
    domain: "FRAME",
    name: "车架材质",
    options: options(["ALUMINUM", "铝合金"], ["CARBON", "碳纤维"], ["STEEL", "钢"])
  },
  {
    id: "FRAME_STYLE",
    domain: "FRAME",
    name: "车架样式",
    options: options(["CITY", "城市"], ["SPORT", "运动"], ["COMFORT", "舒适"])
  },
  {
    id: "WHEEL_SIZE",
    domain: "WHEEL",
    name: "轮胎尺寸",
    options: options(["700x28C", "700×28C"], ["700x35C", "700×35C"], ["700x45C", "700×45C"])
  },
  {
    id: "WHEEL_TYPE",
    domain: "WHEEL",
    name: "轮组类型",
    options: options(["ROAD", "公路"], ["GRAVEL", "Gravel"], ["CITY", "城市"])
  },
  {
    id: "HANDLE_STYLE",
    domain: "FRAME",
    name: "把手样式",
    options: options(["FLAT", "城市平把"], ["DROP", "运动弯把"], ["COMFORT", "舒适后掠把"])
  },
  {
    id: "SADDLE_STYLE",
    domain: "FRAME",
    name: "座椅样式",
    options: options(["SPORT", "运动窄座"], ["COMFORT", "舒适宽座"], ["GEL", "凝胶减震座"])
  },
  {
    id: "GEAR_TYPE",
    domain: "DRIVETRAIN",
    name: "传动类型",
    options: options(
      ["DERAILLEUR", "外变速"],
      ["INTERNAL_GEAR", "内变速"],
      ["SINGLE_SPEED", "单速"]
    )
  },
  {
    id: "GEAR_COUNT",
    domain: "DRIVETRAIN",
    name: "传动速数",
    options: options([1, "1 速"], [7, "7 速"], [8, "8 速"], [9, "9 速"], [11, "11 速"])
  },
  ...(["FENDER", "REAR_RACK", "LIGHT"] as const).map((id, i) => ({
    id,
    domain: "ACCESSORY" as const,
    name: ["挡泥板", "后货架", "通勤灯组"][i],
    options: options([true, "需要"], [false, "不需要"])
  })),
  {
    id: "FENDER_STYLE",
    domain: "ACCESSORY",
    name: "挡泥板样式",
    options: options(
      ["SHORT", "运动短挡泥板"],
      ["FULL", "城市全包挡泥板"],
      ["GRAVEL", "Gravel 宽挡泥板"]
    )
  }
];
export const marketingFeatures: MarketingFeature[] = [
  {
    id: "scenario",
    name: "使用场景",
    options: [
      {
        value: "CITY",
        label: "城市通勤",
        description: "铺装路面、日常往返与实用装备",
        ruleId: "MKT-SCENE-001",
        mapping: {
          FRAME_STYLE: "CITY",
          WHEEL_TYPE: "ROAD",
          WHEEL_SIZE: "700x28C",
          HANDLE_STYLE: "FLAT",
          SADDLE_STYLE: "COMFORT",
          FENDER_STYLE: "FULL"
        }
      },
      {
        value: "SPORT",
        label: "运动骑行",
        description: "运动姿态与高效率传动",
        ruleId: "MKT-SCENE-002",
        mapping: {
          FRAME_STYLE: "SPORT",
          WHEEL_TYPE: "ROAD",
          WHEEL_SIZE: "700x28C",
          HANDLE_STYLE: "DROP",
          SADDLE_STYLE: "SPORT",
          FENDER_STYLE: "SHORT"
        }
      },
      {
        value: "GRAVEL",
        label: "周末轻度 Gravel",
        description: "混合路面、宽胎与更广速比",
        ruleId: "MKT-SCENE-003",
        mapping: {
          FRAME_STYLE: "SPORT",
          WHEEL_TYPE: "GRAVEL",
          WHEEL_SIZE: "700x45C",
          HANDLE_STYLE: "DROP",
          SADDLE_STYLE: "SPORT",
          FENDER_STYLE: "GRAVEL"
        }
      }
    ]
  },
  {
    id: "edition",
    name: "配置等级",
    options: [
      {
        value: "STANDARD",
        label: "标准版",
        description: "铝合金与 8 速外变速",
        ruleId: "MKT-EDITION-001",
        mapping: { FRAME_MATERIAL: "ALUMINUM", GEAR_TYPE: "DERAILLEUR", GEAR_COUNT: 8 }
      },
      {
        value: "SPORT",
        label: "运动版",
        description: "碳纤维与 11 速外变速",
        ruleId: "MKT-EDITION-002",
        mapping: { FRAME_MATERIAL: "CARBON", GEAR_TYPE: "DERAILLEUR", GEAR_COUNT: 11 }
      },
      {
        value: "EXPLORE",
        label: "探索版",
        description: "碳纤维与 11 速探索传动",
        ruleId: "MKT-EDITION-003",
        mapping: { FRAME_MATERIAL: "CARBON", GEAR_TYPE: "DERAILLEUR", GEAR_COUNT: 11 }
      }
    ]
  }
];
export const templates = [
  {
    id: "standard",
    name: "Urban Standard",
    description: "铝合金 · 28C 公路 · 8 速 · 挡泥板",
    marketing: {
      scenario: "CITY",
      edition: "STANDARD",
      FENDER: true,
      REAR_RACK: false,
      LIGHT: false
    }
  },
  {
    id: "commuter",
    name: "Urban Commuter",
    description: "标准平台 · 挡泥板 · 货架 · 通勤灯组",
    marketing: { scenario: "CITY", edition: "STANDARD", FENDER: true, REAR_RACK: true, LIGHT: true }
  },
  {
    id: "explore",
    name: "Urban Explore",
    description: "碳纤维运动架 · 45C Gravel · 11 速",
    marketing: {
      scenario: "GRAVEL",
      edition: "EXPLORE",
      FENDER: false,
      REAR_RACK: false,
      LIGHT: false
    }
  }
];
export function initialConfiguration(template = "commuter"): Configuration {
  return {
    marketing: { ...(templates.find((t) => t.id === template) ?? templates[1]).marketing },
    overrides: {},
    decisions: {},
    revision: 1
  };
}
const fv = (values: Partial<Record<FeatureId, FeatureValue>>) =>
  Object.entries(values).map(([feature, value]) => ({ feature: feature as FeatureId, value }));
const part = (
  code: string,
  name: string,
  category: Material["category"],
  geometryKey: string,
  color: number
): Material => ({ code, name, category, features: [], geometryKey, color });
const assembly = (
  code: string,
  name: string,
  category: Material["category"],
  values: Partial<Record<FeatureId, FeatureValue>>,
  codes: string[]
): Material => ({
  code,
  name,
  category,
  features: fv(values),
  bom: { lines: codes.map((materialCode) => ({ materialCode, quantity: 1 })) }
});
export const materials: Material[] = [
  part("FR-101", "铝合金车架", "FRAME", "frame", 0x168b91),
  part("FR-102", "碳纤维车架", "FRAME", "frame", 0x303948),
  part("FR-103", "铝合金运动车架", "FRAME", "frame", 0x217aaf),
  part("FR-105", "舒适车架 · A 厂", "FRAME", "frame", 0x168b91),
  part("FR-106", "舒适车架 · B 厂", "FRAME", "frame", 0x477e85),
  part("FR-110", "前叉", "FRAME", "fork", 0x168b91),
  part("FR-120", "车把与把立", "FRAME", "cockpit", 0x404956),
  part("FR-130", "坐垫与座管", "FRAME", "saddle", 0x30343c),
  {
    ...part("HB-901", "城市平把", "FRAME", "cockpit-flat", 0x276d7a),
    features: fv({ HANDLE_STYLE: "FLAT" })
  },
  {
    ...part("HB-902", "运动弯把", "FRAME", "cockpit-drop", 0x3f4852),
    features: fv({ HANDLE_STYLE: "DROP" })
  },
  {
    ...part("HB-903", "舒适后掠把", "FRAME", "cockpit-comfort", 0x965d36),
    features: fv({ HANDLE_STYLE: "COMFORT" })
  },
  {
    ...part("SD-901", "运动窄座", "FRAME", "saddle-sport", 0x3f4852),
    features: fv({ SADDLE_STYLE: "SPORT" })
  },
  {
    ...part("SD-902", "舒适宽座", "FRAME", "saddle-comfort", 0x276d7a),
    features: fv({ SADDLE_STYLE: "COMFORT" })
  },
  {
    ...part("SD-903", "凝胶减震座", "FRAME", "saddle-gel", 0x965d36),
    features: fv({ SADDLE_STYLE: "GEL" })
  },
  assembly(
    "FR-100",
    "铝合金城市车架总成",
    "FRAME",
    { FRAME_MATERIAL: "ALUMINUM", FRAME_STYLE: "CITY" },
    ["FR-101", "FR-110", "FR-120", "FR-130"]
  ),
  assembly(
    "FR-200",
    "碳纤维运动车架总成",
    "FRAME",
    { FRAME_MATERIAL: "CARBON", FRAME_STYLE: "SPORT" },
    ["FR-102", "FR-110", "FR-120", "FR-130"]
  ),
  assembly(
    "FR-300",
    "铝合金运动车架总成",
    "FRAME",
    { FRAME_MATERIAL: "ALUMINUM", FRAME_STYLE: "SPORT" },
    ["FR-103", "FR-110", "FR-120", "FR-130"]
  ),
  assembly(
    "FR-500",
    "舒适车架总成 · A 厂",
    "FRAME",
    { FRAME_MATERIAL: "ALUMINUM", FRAME_STYLE: "COMFORT" },
    ["FR-105", "FR-110", "FR-120", "FR-130"]
  ),
  assembly(
    "FR-600",
    "舒适车架总成 · B 厂",
    "FRAME",
    { FRAME_MATERIAL: "ALUMINUM", FRAME_STYLE: "COMFORT" },
    ["FR-106", "FR-110", "FR-120", "FR-130"]
  ),
  part("WH-201", "前轮圈 / 花鼓 / 辐条", "WHEEL", "front-wheel", 0xa7b4c1),
  part("WH-202", "后轮圈 / 花鼓 / 辐条", "WHEEL", "rear-wheel", 0xa7b4c1),
  ...([28, 35, 45] as const).flatMap((size, i) => [
    part(
      `WH-${211 + i * 10}`,
      `前轮胎 700×${size}C`,
      "WHEEL",
      `front-${size === 28 ? "road" : size === 35 ? "city" : "gravel"}`,
      size === 45 ? 0x7b6651 : 0x242b34
    ),
    part(
      `WH-${212 + i * 10}`,
      `后轮胎 700×${size}C`,
      "WHEEL",
      `rear-${size === 28 ? "road" : size === 35 ? "city" : "gravel"}`,
      size === 45 ? 0x7b6651 : 0x242b34
    )
  ]),
  assembly("WH-200", "700×28C 公路轮组", "WHEEL", { WHEEL_SIZE: "700x28C", WHEEL_TYPE: "ROAD" }, [
    "WH-201",
    "WH-202",
    "WH-211",
    "WH-212"
  ]),
  assembly("WH-300", "700×35C 城市轮组", "WHEEL", { WHEEL_SIZE: "700x35C", WHEEL_TYPE: "CITY" }, [
    "WH-201",
    "WH-202",
    "WH-221",
    "WH-222"
  ]),
  assembly(
    "WH-350",
    "700×35C Gravel 轮组",
    "WHEEL",
    { WHEEL_SIZE: "700x35C", WHEEL_TYPE: "GRAVEL" },
    ["WH-201", "WH-202", "WH-221", "WH-222"]
  ),
  assembly(
    "WH-400",
    "700×45C Gravel 轮组",
    "WHEEL",
    { WHEEL_SIZE: "700x45C", WHEEL_TYPE: "GRAVEL" },
    ["WH-201", "WH-202", "WH-231", "WH-232"]
  ),
  part("DR-301", "牙盘 / 曲柄 / 脚踏", "DRIVETRAIN", "crank", 0x697788),
  part("DR-302", "8 速链条与飞轮", "DRIVETRAIN", "chain", 0x8997a6),
  part("DR-303", "11 速链条与飞轮", "DRIVETRAIN", "chain", 0x8997a6),
  part("DR-304", "单速链条与飞轮", "DRIVETRAIN", "chain", 0x8997a6),
  part("DR-310", "前后碟刹套件", "DRIVETRAIN", "brakes", 0xb9c4ce),
  assembly(
    "DR-300",
    "8 速通勤传动与制动",
    "DRIVETRAIN",
    { GEAR_TYPE: "DERAILLEUR", GEAR_COUNT: 8 },
    ["DR-301", "DR-302", "DR-310"]
  ),
  assembly(
    "DR-400",
    "11 速运动传动与制动",
    "DRIVETRAIN",
    { GEAR_TYPE: "DERAILLEUR", GEAR_COUNT: 11 },
    ["DR-301", "DR-303", "DR-310"]
  ),
  assembly("DR-500", "单速传动与制动", "DRIVETRAIN", { GEAR_TYPE: "SINGLE_SPEED", GEAR_COUNT: 1 }, [
    "DR-301",
    "DR-304",
    "DR-310"
  ]),
  { ...part("AC-401", "后货架", "ACCESSORY", "rack", 0x465362), features: fv({ REAR_RACK: true }) },
  {
    ...part("AC-402", "城市全包挡泥板", "ACCESSORY", "fenders-full", 0x647589),
    features: fv({ FENDER: true, FENDER_STYLE: "FULL" })
  },
  {
    ...part("AC-404", "运动短挡泥板", "ACCESSORY", "fenders-short", 0x276d7a),
    features: fv({ FENDER: true, FENDER_STYLE: "SHORT" })
  },
  {
    ...part("AC-405", "Gravel 宽挡泥板", "ACCESSORY", "fenders-gravel", 0x965d36),
    features: fv({ FENDER: true, FENDER_STYLE: "GRAVEL" })
  },
  {
    ...part("AC-403", "前后通勤灯组", "ACCESSORY", "lights", 0xe8b341),
    features: fv({ LIGHT: true })
  }
];
export const rules: ConfigurationRule[] = [
  {
    id: "RULE-001",
    type: "requires",
    when: { feature: "WHEEL_TYPE", operator: "eq", value: "GRAVEL" },
    then: { feature: "WHEEL_SIZE", operator: "in", value: ["700x35C", "700x45C"] },
    severity: "Conflict",
    message: "Gravel 轮组需要 35C 或 45C 轮胎，不能使用 28C。",
    fix: { WHEEL_SIZE: "700x45C" }
  },
  {
    id: "RULE-002",
    type: "requires",
    when: { feature: "FRAME_STYLE", operator: "eq", value: "SPORT" },
    then: { feature: "REAR_RACK", operator: "eq", value: false },
    severity: "Conflict",
    message: "SPORT 运动车架不支持后货架。",
    fix: { REAR_RACK: false }
  },
  {
    id: "RULE-003",
    type: "requires",
    when: { feature: "SCENARIO", operator: "eq", value: "GRAVEL" },
    then: { feature: "WHEEL_TYPE", operator: "eq", value: "GRAVEL" },
    severity: "Conflict",
    message: "Gravel 使用场景要求 GRAVEL 轮组，当前技术选择与使用意图冲突。",
    fix: { WHEEL_TYPE: "GRAVEL", WHEEL_SIZE: "700x45C" }
  },
  {
    id: "RULE-004",
    type: "recommends",
    when: { feature: "SCENARIO", operator: "eq", value: "CITY" },
    then: { feature: "LIGHT", operator: "eq", value: true },
    severity: "Warning",
    message: "城市通勤建议配备灯组，提高夜间可见性。",
    fix: { LIGHT: true }
  },
  {
    id: "RULE-005",
    type: "requires",
    when: { feature: "GEAR_TYPE", operator: "eq", value: "SINGLE_SPEED" },
    then: { feature: "GEAR_COUNT", operator: "eq", value: 1 },
    severity: "Conflict",
    message: "单速传动只能选择 1 速。",
    fix: { GEAR_COUNT: 1 }
  },
  {
    id: "RULE-006",
    type: "requires",
    when: { feature: "GEAR_TYPE", operator: "eq", value: "DERAILLEUR" },
    then: { feature: "GEAR_COUNT", operator: "in", value: [7, 8, 9, 11] },
    severity: "Conflict",
    message: "外变速需匹配多速传动。",
    fix: { GEAR_COUNT: 8 }
  }
];
