import JSONModel from "sap/ui/model/json/JSONModel";

export interface LibraryTreeNode {
  id: string;
  title: string;
  icon: string;
  count: number;
  categoryIds?: string[];
  creatable?: boolean;
  children?: LibraryTreeNode[];
}

export interface MaterialBomLine {
  item: number;
  componentCode: string;
  componentName: string;
  quantity: number;
  unit: string;
  category: string;
}

export interface MaterialBomDefinition {
  bomCode: string;
  usage: string;
  alternative: string;
  status: string;
  validFrom: string;
  baseQuantity: number;
  baseUnit: string;
  lines: MaterialBomLine[];
}

export interface MaterialVersion {
  revision: string;
  processStatus: string;
  specification: string;
  lifecycleStage: string;
  modifiedBy: string;
  modifiedAt: string;
  changeNote: string;
}

export interface MaterialVersionChange {
  field: string;
  from: string;
  to: string;
}

export interface MaterialRelatedGraphNode {
  key: string;
  title: string;
  description: string;
  icon: string;
  shape: "Box";
  selected: boolean;
}

export interface MaterialRelatedGraphLine {
  from: string;
  to: string;
}

export interface MaterialRelatedGraph {
  nodes: MaterialRelatedGraphNode[];
  lines: MaterialRelatedGraphLine[];
  hasRelations: boolean;
  upstreamDepth: number;
  canExpandUpstream: boolean;
}

export interface MaterialLibraryItem {
  id: string;
  code: string;
  name: string;
  categoryId: string;
  category: string;
  revision: string;
  specification: string;
  processStatus: "已发布" | "审批中" | "草稿";
  model: string;
  lifecycleStage: "设计" | "试制" | "生产";
  baseUnit: string;
  processId: string;
  description: string;
  createdBy: string;
  createdAt: string;
  modifiedBy: string;
  creationOrg: string;
  owner: string;
  modifiedAt: string;
  inventoryCategory: string;
  foundationalUnit: string;
  attributes: Array<{ name: string; value: string }>;
  attributesText?: string;
  bom?: MaterialBomDefinition;
  versions?: MaterialVersion[];
  versionChanges?: MaterialVersionChange[];
}

export interface BomLibraryItem {
  id: string;
  number: string;
  name: string;
  categoryId: string;
  category: string;
  revision: string;
  status: "Released" | "In Development";
  view: string;
  lineCount: number;
  description: string;
  rootMaterial: string;
  children: Array<{ number: string; name: string; quantity: number; unit: string }>;
}

const materialTree: LibraryTreeNode[] = [
  {
    id: "all",
    title: "全部物料",
    icon: "sap-icon://product",
    count: 10,
    categoryIds: ["raw-metal", "raw-nonmetal", "semi-machined", "semi-purchased", "finished-bicycle", "finished-accessory"],
    children: [
      { id: "raw", title: "原材料", icon: "sap-icon://factory", count: 3, categoryIds: ["raw-metal", "raw-nonmetal"], children: [
        { id: "raw-metal", title: "金属材料", icon: "sap-icon://dimension", count: 2, categoryIds: ["raw-metal"], creatable: true },
        { id: "raw-nonmetal", title: "非金属材料", icon: "sap-icon://palette", count: 1, categoryIds: ["raw-nonmetal"], creatable: true }
      ] },
      { id: "semi", title: "半成品", icon: "sap-icon://process", count: 5, categoryIds: ["semi-machined", "semi-purchased"], children: [
        { id: "semi-machined", title: "自制加工件", icon: "sap-icon://settings", count: 3, categoryIds: ["semi-machined"], creatable: true },
        { id: "semi-purchased", title: "外购配套件", icon: "sap-icon://supplier", count: 2, categoryIds: ["semi-purchased"], creatable: true }
      ] },
      { id: "finished", title: "产成品", icon: "sap-icon://product", count: 2, categoryIds: ["finished-bicycle", "finished-accessory"], children: [
        { id: "finished-bicycle", title: "自行车整车", icon: "sap-icon://shipping-status", count: 1, categoryIds: ["finished-bicycle"], creatable: true },
        { id: "finished-accessory", title: "成品附件", icon: "sap-icon://add-equipment", count: 1, categoryIds: ["finished-accessory"], creatable: true }
      ] }
    ]
  }
];

const materials: MaterialLibraryItem[] = [
  { id: "MAT-RM-001", code: "RM-AL-6061", name: "6061-T6 铝合金管材", categoryId: "raw-metal", category: "金属材料", revision: "A.02", specification: "Ø45×2.5 mm / T6", processStatus: "已发布", model: "AL6061-T6", lifecycleStage: "生产", baseUnit: "KG", processId: "WF-MAT-2026-001", description: "自行车车架用铝合金挤压管材。", createdBy: "张工", createdAt: "2026-08-12 09:20", modifiedBy: "李工", creationOrg: "材料工程部", owner: "材料主数据组", modifiedAt: "2026-09-18 15:40", inventoryCategory: "有色金属", foundationalUnit: "KG", attributes: [{ name: "牌号", value: "6061-T6" }, { name: "表面状态", value: "阳极氧化前" }] },
  { id: "MAT-RM-002", code: "RM-ST-304", name: "304 不锈钢板", categoryId: "raw-metal", category: "金属材料", revision: "A.01", specification: "1500×3000×1.5 mm", processStatus: "已发布", model: "SUS304", lifecycleStage: "生产", baseUnit: "KG", processId: "WF-MAT-2026-002", description: "通用钣金结构件用不锈钢板材。", createdBy: "王工", createdAt: "2026-08-13 10:10", modifiedBy: "王工", creationOrg: "材料工程部", owner: "材料主数据组", modifiedAt: "2026-09-16 11:25", inventoryCategory: "黑色金属", foundationalUnit: "KG", attributes: [{ name: "材质", value: "SUS304" }, { name: "厚度", value: "1.5 mm" }] },
  { id: "MAT-RM-003", code: "RM-CF-T700", name: "T700 碳纤维预浸料", categoryId: "raw-nonmetal", category: "非金属材料", revision: "B.01", specification: "200 g/m² / 0.20 mm", processStatus: "审批中", model: "T700-UD", lifecycleStage: "试制", baseUnit: "M2", processId: "WF-MAT-2026-009", description: "运动型车架成型用单向碳纤维预浸料。", createdBy: "陈工", createdAt: "2026-09-01 14:30", modifiedBy: "赵工", creationOrg: "复材中心", owner: "复材主数据组", modifiedAt: "2026-09-20 16:05", inventoryCategory: "复合材料", foundationalUnit: "M2", attributes: [{ name: "纤维等级", value: "T700" }, { name: "树脂含量", value: "38%" }] },
  { id: "MAT-SF-101", code: "SF-FR-101", name: "铝合金车架焊接件", categoryId: "semi-machined", category: "自制加工件", revision: "A.03", specification: "M / 城市型 / 700C", processStatus: "已发布", model: "URBAN-FR-M", lifecycleStage: "生产", baseUnit: "EA", processId: "WF-MAT-2026-021", description: "完成焊接与热处理、待涂装的城市车架半成品。", createdBy: "刘工", createdAt: "2026-08-20 08:45", modifiedBy: "刘工", creationOrg: "车架制造部", owner: "车架工艺组", modifiedAt: "2026-09-19 13:12", inventoryCategory: "自制半成品", foundationalUnit: "EA", attributes: [{ name: "FRAME_MATERIAL", value: "ALUMINUM" }, { name: "FRAME_STYLE", value: "CITY" }] },
  { id: "MAT-SF-102", code: "SF-FR-102", name: "碳纤维车架毛坯", categoryId: "semi-machined", category: "自制加工件", revision: "B.01", specification: "M / 运动型 / 700C", processStatus: "审批中", model: "SPORT-CF-M", lifecycleStage: "试制", baseUnit: "EA", processId: "WF-MAT-2026-026", description: "脱模后待精加工与涂装的碳纤维车架毛坯。", createdBy: "赵工", createdAt: "2026-09-02 11:20", modifiedBy: "赵工", creationOrg: "复材中心", owner: "复材工艺组", modifiedAt: "2026-09-20 09:35", inventoryCategory: "自制半成品", foundationalUnit: "EA", attributes: [{ name: "FRAME_MATERIAL", value: "CARBON" }, { name: "FRAME_STYLE", value: "SPORT" }] },
  { id: "MAT-SF-201", code: "SF-DR-302", name: "8 速链条与飞轮套件", categoryId: "semi-purchased", category: "外购配套件", revision: "A.04", specification: "8S / 11-32T", processStatus: "已发布", model: "DT-8S-1132", lifecycleStage: "生产", baseUnit: "SET", processId: "WF-MAT-2026-031", description: "城市通勤车型使用的外购传动配套件。", createdBy: "孙工", createdAt: "2026-08-25 15:10", modifiedBy: "周工", creationOrg: "采购工程部", owner: "传动件采购组", modifiedAt: "2026-09-17 17:20", inventoryCategory: "外购半成品", foundationalUnit: "SET", attributes: [{ name: "GEAR_COUNT", value: "8" }, { name: "GEAR_TYPE", value: "DERAILLEUR" }] },
  { id: "MAT-SF-202", code: "SF-WH-211", name: "700×28C 公路轮胎", categoryId: "semi-purchased", category: "外购配套件", revision: "A.05", specification: "700×28C / 85 PSI", processStatus: "已发布", model: "ROAD-700-28", lifecycleStage: "生产", baseUnit: "EA", processId: "WF-MAT-2026-032", description: "城市通勤及公路车型使用的外购轮胎。", createdBy: "孙工", createdAt: "2026-08-26 09:05", modifiedBy: "周工", creationOrg: "采购工程部", owner: "轮胎采购组", modifiedAt: "2026-09-18 10:42", inventoryCategory: "外购半成品", foundationalUnit: "EA", attributes: [{ name: "WHEEL_SIZE", value: "700x28C" }, { name: "WHEEL_TYPE", value: "ROAD" }] },
  { id: "MAT-SF-301", code: "SF-AC-401", name: "后货架涂装件", categoryId: "semi-machined", category: "自制加工件", revision: "A.02", specification: "26-29 inch / 25 kg", processStatus: "已发布", model: "RACK-CITY-25", lifecycleStage: "生产", baseUnit: "EA", processId: "WF-MAT-2026-035", description: "完成焊接和粉末涂装的后货架半成品。", createdBy: "郑工", createdAt: "2026-08-28 13:18", modifiedBy: "郑工", creationOrg: "附件制造部", owner: "附件工艺组", modifiedAt: "2026-09-15 14:50", inventoryCategory: "自制半成品", foundationalUnit: "EA", attributes: [{ name: "LOAD_CAPACITY", value: "25 KG" }, { name: "COLOR", value: "BLACK" }] },
  { id: "MAT-FG-001", code: "FG-BIKE-100", name: "城市探索自行车", categoryId: "finished-bicycle", category: "自行车整车", revision: "A.01", specification: "URBAN / M / 700C / 8S", processStatus: "已发布", model: "URBAN-100", lifecycleStage: "生产", baseUnit: "SET", processId: "WF-MAT-2026-041", description: "面向城市通勤场景的配置化自行车产成品。", createdBy: "产品数据组", createdAt: "2026-09-05 10:00", modifiedBy: "产品数据组", creationOrg: "产品工程部", owner: "URBAN 产品组", modifiedAt: "2026-09-20 18:10", inventoryCategory: "产成品", foundationalUnit: "SET", attributes: [{ name: "PRODUCT_FAMILY", value: "URBAN" }, { name: "CONFIGURATION_MODE", value: "FEATURE_DRIVEN" }] },
  { id: "MAT-FG-002", code: "FG-AC-400", name: "城市通勤附件套装", categoryId: "finished-accessory", category: "成品附件", revision: "A.03", specification: "货架+挡泥板+灯组", processStatus: "草稿", model: "COMMUTE-KIT-01", lifecycleStage: "设计", baseUnit: "SET", processId: "WF-MAT-2026-044", description: "适用于 URBAN 平台的通勤附件成品套装。", createdBy: "附件产品组", createdAt: "2026-09-12 16:30", modifiedBy: "附件产品组", creationOrg: "产品工程部", owner: "附件产品组", modifiedAt: "2026-09-21 08:20", inventoryCategory: "产成品", foundationalUnit: "SET", attributes: [{ name: "REAR_RACK", value: "TRUE" }, { name: "FENDER", value: "TRUE" }, { name: "LIGHT", value: "TRUE" }] }
];

const bomLinesByMaterial: Record<string, MaterialBomLine[]> = {
  "SF-FR-101": [
    { item: 10, componentCode: "RM-AL-6061", componentName: "6061-T6 铝合金管材", quantity: 2.8, unit: "KG", category: "金属材料" },
    { item: 20, componentCode: "RM-ST-304", componentName: "304 不锈钢板", quantity: 0.15, unit: "KG", category: "金属材料" }
  ],
  "SF-FR-102": [
    { item: 10, componentCode: "RM-CF-T700", componentName: "T700 碳纤维预浸料", quantity: 3.2, unit: "M2", category: "非金属材料" }
  ],
  "FG-BIKE-100": [
    { item: 10, componentCode: "SF-FR-101", componentName: "铝合金车架焊接件", quantity: 1, unit: "EA", category: "自制加工件" },
    { item: 20, componentCode: "SF-WH-211", componentName: "700×28C 公路轮胎", quantity: 2, unit: "EA", category: "外购配套件" },
    { item: 30, componentCode: "SF-DR-302", componentName: "8 速链条与飞轮套件", quantity: 1, unit: "SET", category: "外购配套件" },
    { item: 40, componentCode: "SF-AC-401", componentName: "后货架涂装件", quantity: 1, unit: "EA", category: "自制加工件" }
  ],
  "FG-AC-400": [
    { item: 10, componentCode: "SF-AC-401", componentName: "后货架涂装件", quantity: 1, unit: "EA", category: "自制加工件" }
  ]
};

materials.forEach((material) => {
  const previousRevision = material.revision === "A.01" ? "A.00" : "A.01";
  material.attributesText = material.attributes.map((attribute) => `${attribute.name}=${attribute.value}`).join("; ");
  material.bom = {
    bomCode: `BOM-${material.code}`,
    usage: material.categoryId.startsWith("finished") ? "生产" : "工程",
    alternative: "01",
    status: material.processStatus,
    validFrom: "2026-09-01",
    baseQuantity: 1,
    baseUnit: material.baseUnit,
    lines: bomLinesByMaterial[material.code] ?? []
  };
  material.versions = [
    { revision: material.revision, processStatus: material.processStatus, specification: material.specification, lifecycleStage: material.lifecycleStage, modifiedBy: material.modifiedBy, modifiedAt: material.modifiedAt, changeNote: "当前有效版本" },
    { revision: previousRevision, processStatus: "已发布", specification: material.specification.replace("T6", "T4"), lifecycleStage: "试制", modifiedBy: material.createdBy, modifiedAt: material.createdAt, changeNote: "首版物料主数据" }
  ];
  material.versionChanges = [
    { field: "版本", from: previousRevision, to: material.revision },
    { field: "规格", from: material.versions[1].specification, to: material.specification },
    { field: "生命周期阶段", from: "试制", to: material.lifecycleStage },
    { field: "流程状态", from: "已发布", to: material.processStatus }
  ].filter((change) => change.from !== change.to);
});

const materialGraphChildren: Record<string, string[]> = {
  "SF-FR-101": ["RM-AL-6061", "RM-ST-304"],
  "SF-FR-102": ["RM-CF-T700"],
  "FG-BIKE-100": ["SF-FR-101", "SF-FR-102", "SF-DR-302", "SF-WH-211", "SF-AC-401"],
  "FG-AC-400": ["SF-AC-401"]
};

export function buildMaterialRelatedGraph(material: MaterialLibraryItem, upstreamDepth = 0): MaterialRelatedGraph {
  const materialByCode = new Map(materials.map((item) => [item.code, item]));
  const getParents = (code: string): string[] => Object.entries(materialGraphChildren)
    .filter(([, childCodes]) => childCodes.includes(code))
    .map(([parentCode]) => parentCode);
  const upstreamCodes = new Set<string>();
  const upstreamLines: MaterialRelatedGraphLine[] = [];
  let frontier = [material.code];
  for (let level = 0; level < upstreamDepth; level += 1) {
    const nextFrontier = new Set<string>();
    for (const childCode of frontier) {
      for (const parentCode of getParents(childCode)) {
        upstreamCodes.add(parentCode);
        nextFrontier.add(parentCode);
        upstreamLines.push({ from: parentCode, to: childCode });
      }
    }
    frontier = [...nextFrontier];
    if (frontier.length === 0) break;
  }
  const downstreamCodes = materialGraphChildren[material.code] ?? [];
  const nextUpstreamCodes = new Set(frontier.flatMap((code) => getParents(code)));
  const createNode = (code: string, selected: boolean): MaterialRelatedGraphNode => {
    const relatedMaterial = materialByCode.get(code);
    return {
      key: code,
      title: relatedMaterial?.name ?? code,
      description: relatedMaterial ? `${code} · ${relatedMaterial.category}` : `${code} · Mock object`,
      icon: "sap-icon://product",
      shape: "Box",
      selected
    };
  };

  return {
    nodes: [...[...upstreamCodes].reverse().map((code) => createNode(code, false)), createNode(material.code, true), ...downstreamCodes.map((code) => createNode(code, false))],
    lines: [...upstreamLines, ...downstreamCodes.map((code) => ({ from: material.code, to: code }))],
    hasRelations: upstreamCodes.size > 0 || downstreamCodes.length > 0,
    upstreamDepth,
    canExpandUpstream: nextUpstreamCodes.size > 0
  };
}

const bomTree: LibraryTreeNode[] = [
  {
    id: "all",
    title: "全部 BOM",
    icon: "sap-icon://tree",
    count: 6,
    children: [
      { id: "product", title: "产品 BOM", icon: "sap-icon://product", count: 1 },
      { id: "frame", title: "车架系统", icon: "sap-icon://dimension", count: 1 },
      { id: "wheel", title: "轮组系统", icon: "sap-icon://circle-task-2", count: 2 },
      { id: "drivetrain", title: "传动系统", icon: "sap-icon://process", count: 1 },
      { id: "accessory", title: "通勤附件", icon: "sap-icon://add-equipment", count: 1 }
    ]
  }
];

const boms: BomLibraryItem[] = [
  { id: "BOM-URBAN-100", number: "BOM-URBAN-100", name: "城市探索自行车标准配置", categoryId: "product", category: "产品 BOM", revision: "A.01", status: "Released", view: "Configured", lineCount: 4, rootMaterial: "BIKE-100", description: "由已解析物料总成组合生成的标准城市通勤配置。", children: [{ number: "FR-100", name: "城市车架总成", quantity: 1, unit: "EA" }, { number: "WH-200", name: "700×28C 公路轮组", quantity: 1, unit: "SET" }, { number: "DR-300", name: "8 速通勤传动总成", quantity: 1, unit: "SET" }, { number: "AC-400", name: "通勤附件总成", quantity: 1, unit: "SET" }] },
  { id: "BOM-FR-100", number: "BOM-FR-100", name: "城市车架总成 BOM", categoryId: "frame", category: "车架系统", revision: "A.02", status: "Released", view: "Engineering", lineCount: 3, rootMaterial: "FR-100", description: "FR-100 物料自身维护的工程 BOM。", children: [{ number: "FR-101", name: "铝合金城市车架", quantity: 1, unit: "EA" }, { number: "FR-110", name: "前叉", quantity: 1, unit: "EA" }, { number: "HB-901", name: "城市平把", quantity: 1, unit: "EA" }] },
  { id: "BOM-WH-200", number: "BOM-WH-200", name: "公路轮组 BOM", categoryId: "wheel", category: "轮组系统", revision: "A.05", status: "Released", view: "Engineering", lineCount: 4, rootMaterial: "WH-200", description: "700×28C 公路轮组的物料结构。", children: [{ number: "WH-201", name: "前轮组", quantity: 1, unit: "EA" }, { number: "WH-202", name: "后轮组", quantity: 1, unit: "EA" }, { number: "WH-211", name: "前公路胎 700×28C", quantity: 1, unit: "EA" }, { number: "WH-212", name: "后公路胎 700×28C", quantity: 1, unit: "EA" }] },
  { id: "BOM-WH-400", number: "BOM-WH-400", name: "Gravel 轮组 BOM", categoryId: "wheel", category: "轮组系统", revision: "A.01", status: "In Development", view: "Engineering", lineCount: 4, rootMaterial: "WH-400", description: "700×45C Gravel 轮组的物料结构。", children: [{ number: "WH-201", name: "前轮组", quantity: 1, unit: "EA" }, { number: "WH-202", name: "后轮组", quantity: 1, unit: "EA" }, { number: "WH-231", name: "前 Gravel 胎 700×45C", quantity: 1, unit: "EA" }, { number: "WH-232", name: "后 Gravel 胎 700×45C", quantity: 1, unit: "EA" }] },
  { id: "BOM-DR-300", number: "BOM-DR-300", name: "8 速传动总成 BOM", categoryId: "drivetrain", category: "传动系统", revision: "A.04", status: "Released", view: "Engineering", lineCount: 3, rootMaterial: "DR-300", description: "通勤型传动与制动系统结构。", children: [{ number: "DR-301", name: "牙盘 / 曲柄 / 脚踏", quantity: 1, unit: "SET" }, { number: "DR-302", name: "8 速链条与飞轮", quantity: 1, unit: "SET" }, { number: "DR-310", name: "前后碟刹套件", quantity: 1, unit: "SET" }] },
  { id: "BOM-AC-400", number: "BOM-AC-400", name: "通勤附件总成 BOM", categoryId: "accessory", category: "通勤附件", revision: "A.03", status: "Released", view: "Engineering", lineCount: 3, rootMaterial: "AC-400", description: "可按技术需求组合的通勤附件结构。", children: [{ number: "AC-401", name: "后货架", quantity: 1, unit: "EA" }, { number: "AC-402", name: "前后挡泥板", quantity: 1, unit: "SET" }, { number: "AC-403", name: "通勤灯组", quantity: 1, unit: "SET" }] }
];

export function createMaterialLibraryModel(): JSONModel {
  return new JSONModel({ tree: materialTree, items: materials, visibleItems: materials, selectedCategoryId: "all", selectedCategoryIds: materialTree[0].categoryIds, selectedCategoryTitle: "全部物料", selected: materials[0], query: "", status: "All", canCreateMaterial: false, detailFullScreen: false, detailTabKey: "general", relatedGraph: buildMaterialRelatedGraph(materials[0]) });
}

export function createBomLibraryModel(): JSONModel {
  return new JSONModel({ tree: bomTree, items: boms, visibleItems: boms, selectedCategoryId: "all", selectedCategoryTitle: "全部 BOM", selected: boms[0], query: "", status: "All", detailFullScreen: false, detailTabKey: "general" });
}
