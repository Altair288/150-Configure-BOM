export type ConstraintNodeKind = "source" | "condition" | "logic" | "action" | "scope";

export interface ConstraintMockNode {
  id: string;
  kind: ConstraintNodeKind;
  title: string;
  parent?: string;
  detail?: string;
  inputs?: string[];
  output?: string;
  position: { x: number; y: number };
}

export interface ConstraintMockConnection {
  from: string;
  to: string;
  input: number;
}

export interface ConstraintMockRule {
  id: string;
  title: string;
  category: string;
  summary: string;
  formula: string;
  nodes: ConstraintMockNode[];
  connections: ConstraintMockConnection[];
}

const source = (id: string, title: string, detail: string, y: number): ConstraintMockNode => ({
  id,
  kind: "source",
  title,
  detail,
  output: "当前值",
  position: { x: 40, y }
});

const condition = (
  id: string,
  title: string,
  detail: string,
  y = 120,
  inputs: string[] = ["输入值"]
): ConstraintMockNode => ({
  id,
  kind: "condition",
  title,
  detail,
  inputs,
  output: "满足",
  position: { x: 390, y }
});

const action = (
  id: string,
  title: string,
  detail: string,
  y = 120,
  x = 760
): ConstraintMockNode => ({
  id,
  kind: "action",
  title,
  detail,
  inputs: ["触发时"],
  position: { x, y }
});

export const constraintMockRules: ConstraintMockRule[] = [
  {
    id: "01-requires",
    title: "01 · 强制包含：越野包 → 四驱",
    category: "逻辑选择与互斥",
    summary: "选择 Packages 中的 Offroad Package 后，Drive Type 必须为 4WD。",
    formula: "Packages contains 'Offroad Package' ⇒ Drive Type = '4WD'",
    nodes: [
      {
        id: "offroad-scope",
        kind: "scope",
        title: "越野配置约束",
        position: { x: 18, y: 64 }
      },
      {
        ...source("packages", "特征 · Packages", "Contains Offroad", 120),
        parent: "offroad-scope"
      },
      {
        ...condition("offroad", "条件 · 选择越野包", "包含 Offroad Package"),
        parent: "offroad-scope"
      },
      { ...action("drive-4wd", "约束 · Drive Type", "Drive Type = 4WD"), parent: "offroad-scope" }
    ],
    connections: [
      { from: "packages", to: "offroad", input: 0 },
      { from: "offroad", to: "drive-4wd", input: 0 }
    ]
  },
  {
    id: "02-excludes",
    title: "02 · 互斥：21 英寸轮毂 × 钢轮",
    category: "逻辑选择与互斥",
    summary: "21 inch Wheel Size 与 Steel Wheel Material 不可同时成立。",
    formula: "NOT (Wheel Size = '21 inch' AND Wheel Material = 'Steel')",
    nodes: [
      source("wheel-size", "特征 · Wheel Size", "Enumeration · 21 inch", 40),
      source("wheel-material", "特征 · Wheel Material", "Enumeration · Steel", 280),
      {
        id: "not-both",
        kind: "logic",
        title: "逻辑 · NOT AND",
        inputs: ["条件 A", "条件 B"],
        output: "不冲突",
        position: { x: 390, y: 160 }
      },
      action("allow-wheel", "约束 · 轮毂组合", "禁止 21 inch + Steel", 160, 760)
    ],
    connections: [
      { from: "wheel-size", to: "not-both", input: 0 },
      { from: "wheel-material", to: "not-both", input: 1 },
      { from: "not-both", to: "allow-wheel", input: 0 }
    ]
  },
  {
    id: "03-one-of-many",
    title: "03 · 多选一：高配座椅包组",
    category: "逻辑选择与互斥",
    summary: "Driver Seat Adjustment 为 8-way Electric 时，Packages 中恰好选一个舒适类包。",
    formula: "Driver Seat Adjustment = '8-way Electric' ⇒ COUNT_SELECTED(Comfort, Winter) = 1",
    nodes: [
      source("driver-adjust", "特征 · Driver Seat Adjustment", "Enumeration · 8-way Electric", 120),
      condition("eight-way", "条件 · 8 向电动座椅", "等于 8-way Electric"),
      action("one-package", "约束 · Packages", "舒适包组选中数量 = 1")
    ],
    connections: [
      { from: "driver-adjust", to: "eight-way", input: 0 },
      { from: "eight-way", to: "one-package", input: 0 }
    ]
  },
  {
    id: "04-conditional-dependency",
    title: "04 · 条件依赖：四驱 + 越野包 → 轮径",
    category: "逻辑选择与互斥",
    summary: "四驱并且选择越野包时，Wheel Size 限定在 18–20 inch。",
    formula: "(Drive Type = '4WD' AND Packages contains 'Offroad') ⇒ Wheel Size IN {18, 19, 20}",
    nodes: [
      source("drive", "特征 · Drive Type", "Enumeration · 4WD", 20),
      source("packages", "特征 · Packages", "包含 Offroad Package", 260),
      {
        id: "and",
        kind: "logic",
        title: "逻辑 · AND",
        inputs: ["四驱", "越野包"],
        output: "同时满足",
        position: { x: 390, y: 140 }
      },
      action("wheel-range", "约束 · Wheel Size", "允许 18 / 19 / 20 inch", 140, 760)
    ],
    connections: [
      { from: "drive", to: "and", input: 0 },
      { from: "packages", to: "and", input: 1 },
      { from: "and", to: "wheel-range", input: 0 }
    ]
  },
  {
    id: "05-dynamic-range",
    title: "05 · 动态区间：电池容量 → 温度范围",
    category: "属性范围与值域",
    summary: "Battery Capacity 超过 100 kWh 时，Operating Temperature 收紧到 −20–60 °C。",
    formula: "Battery Capacity > 100 kWh ⇒ Operating Temperature IN [-20, 60] °C",
    nodes: [
      source("battery", "参数 · Battery Capacity", "Decimal · kWh", 120),
      condition("battery-over", "条件 · 高容量", "大于 100 kWh"),
      action("temp-range", "约束 · Operating Temperature", "Range = [-20, 60] °C")
    ],
    connections: [
      { from: "battery", to: "battery-over", input: 0 },
      { from: "battery-over", to: "temp-range", input: 0 }
    ]
  },
  {
    id: "06-inequality",
    title: "06 · 属性不等式：电池容量与座位数",
    category: "属性范围与值域",
    summary: "每个座位至少配置 8 kWh 电池容量。",
    formula: "Battery Capacity >= Seat Count × 8 kWh",
    nodes: [
      source("battery", "参数 · Battery Capacity", "Decimal · kWh", 20),
      source("seats", "参数 · Seat Count", "Integer · seats", 260),
      condition("capacity-per-seat", "运算 · 容量下限", "Battery >= Seats × 8"),
      action("capacity-valid", "结果 · 参数校验", "每座 ≥ 8 kWh", 120, 760)
    ],
    connections: [
      { from: "battery", to: "capacity-per-seat", input: 0 },
      { from: "seats", to: "capacity-per-seat", input: 0 },
      { from: "capacity-per-seat", to: "capacity-valid", input: 0 }
    ]
  },
  {
    id: "07-allowed-matrix",
    title: "07 · 允许矩阵：动力总成组合",
    category: "矩阵与组合相容性",
    summary: "仅接受表中列出的 Drive Type、Battery Capacity 与 Platform Reference 组合。",
    formula: "ALLOW_COMBINATION(Drive Type, Battery Capacity, Platform) IN ValidPowertrains",
    nodes: [
      source("drive", "特征 · Drive Type", "FWD / AWD / 4WD", 0),
      source("battery", "参数 · Battery Capacity", "40–150 kWh", 190),
      source("platform", "引用 · Platform Reference", "PLATFORM-A / B", 380),
      condition("allowed-table", "矩阵 · ValidPowertrains", "FWD→A · 4WD→B", 150, [
        "Drive",
        "Battery",
        "Platform"
      ]),
      action("allowed", "结果 · 组合有效", "表内允许；否则阻止")
    ],
    connections: [
      { from: "drive", to: "allowed-table", input: 0 },
      { from: "battery", to: "allowed-table", input: 1 },
      { from: "platform", to: "allowed-table", input: 2 },
      { from: "allowed-table", to: "allowed", input: 0 }
    ]
  },
  {
    id: "08-forbidden-matrix",
    title: "08 · 禁止表：市场轮毂组合",
    category: "矩阵与组合相容性",
    summary: "将日本市场、21 inch 轮毂和 PLATFORM-B 组合列入禁止表。",
    formula: "FORBID_COMBINATION(Region, Wheel Size, Platform) IN BannedConfig",
    nodes: [
      source("region", "特征 · Vehicle Region", "Japan", 0),
      source("wheel", "特征 · Wheel Size", "21 inch", 190),
      source("platform", "引用 · Platform Reference", "PLATFORM-B", 380),
      condition("banned-table", "矩阵 · BannedConfig", "Japan · 21 inch · B", 150, [
        "Region",
        "Wheel",
        "Platform"
      ]),
      action("blocked", "结果 · 禁止销售", "命中时阻止发布")
    ],
    connections: [
      { from: "region", to: "banned-table", input: 0 },
      { from: "wheel", to: "banned-table", input: 1 },
      { from: "platform", to: "banned-table", input: 2 },
      { from: "banned-table", to: "blocked", input: 0 }
    ]
  },
  {
    id: "09-capacity-sum",
    title: "09 · 容量累加：乘员载荷上限",
    category: "数量与容量推算",
    summary: "按每位乘员 75 kg 估算，整车乘员载荷不超过 750 kg。",
    formula: "SUM(Seat Count × 75 kg) <= 750 kg",
    nodes: [
      source("seats", "参数 · Seat Count", "2–9 seats", 120),
      condition("load-sum", "运算 · 乘员载荷", "Seats × 75 kg <= 750 kg"),
      action("load-valid", "结果 · 容量合规", "载荷上限 750 kg")
    ],
    connections: [
      { from: "seats", to: "load-sum", input: 0 },
      { from: "load-sum", to: "load-valid", input: 0 }
    ]
  },
  {
    id: "10-derived-quantity",
    title: "10 · 派生数量：座椅安装支架",
    category: "数量与容量推算",
    summary: "根据座位数自动推导座椅安装支架数量。",
    formula: "Qty_SeatBracket = CEIL(Seat Count / 2) × 2",
    nodes: [
      source("seats", "参数 · Seat Count", "Integer · seats", 120),
      condition("derive-bracket", "公式 · 支架数量", "CEIL(Seat Count / 2) × 2"),
      action("bracket-qty", "派生结果 · Qty_SeatBracket", "自动计算并传给 BOM")
    ],
    connections: [
      { from: "seats", to: "derive-bracket", input: 0 },
      { from: "derive-bracket", to: "bracket-qty", input: 0 }
    ]
  },
  {
    id: "11-proportion",
    title: "11 · 比例约束：单座电池容量",
    category: "数量与容量推算",
    summary: "电池容量与座位数的比例保持在每座 8–20 kWh。",
    formula: "8 <= Battery Capacity / Seat Count <= 20 kWh per seat",
    nodes: [
      source("battery", "参数 · Battery Capacity", "Decimal · kWh", 20),
      source("seats", "参数 · Seat Count", "Integer · seats", 260),
      condition("ratio", "运算 · 单座容量", "Battery / Seats ∈ [8, 20]"),
      action("ratio-valid", "结果 · 比例有效", "单位：kWh / seat", 120, 760)
    ],
    connections: [
      { from: "battery", to: "ratio", input: 0 },
      { from: "seats", to: "ratio", input: 0 },
      { from: "ratio", to: "ratio-valid", input: 0 }
    ]
  },
  {
    id: "12-assignment",
    title: "12 · 自动赋值：欧洲市场平台",
    category: "默认推导与自动代入",
    summary: "目标市场选择 Europe 后，自动将 Platform Reference 设为 PLATFORM-B。",
    formula: "Vehicle Region = 'Europe' ⇒ ASSIGN(Platform = 'PLATFORM-B')",
    nodes: [
      source("region", "特征 · Vehicle Region", "Enumeration · Europe", 120),
      condition("europe", "条件 · 欧洲市场", "等于 Europe"),
      action("assign-platform", "赋值 · Platform Reference", "PLATFORM-B")
    ],
    connections: [
      { from: "region", to: "europe", input: 0 },
      { from: "europe", to: "assign-platform", input: 0 }
    ]
  },
  {
    id: "13-default-override",
    title: "13 · 可覆盖默认：舒适套件",
    category: "默认推导与自动代入",
    summary: "Premium 配置默认推荐 Comfort Package，客户仍可手动取消。",
    formula: "Trim Level = 'Premium' ⇒ DEFAULT(Packages.Comfort, True), override allowed",
    nodes: [
      source("trim", "特征 · Trim Level", "Enumeration · Premium", 120),
      condition("premium", "条件 · Premium", "等于 Premium"),
      action("comfort-default", "默认 · Packages", "Comfort Package = True · 可覆盖")
    ],
    connections: [
      { from: "trim", to: "premium", input: 0 },
      { from: "premium", to: "comfort-default", input: 0 }
    ]
  },
  {
    id: "14-parent-child",
    title: "14 · 父级下传：市场区域继承",
    category: "跨层级与上下文传递",
    summary: "整车上下文中的 Vehicle Region 下传至所有子模块的市场区域属性。",
    formula: "ChildModule[*].Region = ParentContext.Vehicle Region",
    nodes: [
      source("parent-region", "父级 · Vehicle Region", "SUV Series Context", 120),
      condition("inherit", "传递 · 继承", "读取父级上下文值"),
      action("child-region", "子级 · Region", "ChildModule[*] = Parent Region")
    ],
    connections: [
      { from: "parent-region", to: "inherit", input: 0 },
      { from: "inherit", to: "child-region", input: 0 }
    ]
  },
  {
    id: "15-child-parent",
    title: "15 · 子级汇总：重型模块上提",
    category: "跨层级与上下文传递",
    summary: "任意子模块重量超过 50 kg 时，为父级配置自动添加重载平台标记。",
    formula: "ANY(ChildModule[*].Weight > 50 kg) ⇒ Parent.Platform = 'PLATFORM-B'",
    nodes: [
      source("child-weight", "子级 · Module Weight", "各子模块重量", 120),
      condition("any-heavy", "汇总 · ANY", "存在任一子模块 > 50 kg"),
      action("parent-platform", "父级 · Platform", "PLATFORM-B · 重载规格")
    ],
    connections: [
      { from: "child-weight", to: "any-heavy", input: 0 },
      { from: "any-heavy", to: "parent-platform", input: 0 }
    ]
  }
];
