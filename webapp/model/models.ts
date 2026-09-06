import Device from "sap/ui/Device";
import JSONModel from "sap/ui/model/json/JSONModel";

import type {
  BicycleConfigurationSelection,
  BomDocument,
  BomNode,
  BomViewDefinition,
  BomViewKey,
  ConfiguredBicycleBom,
  ConfiguratorState,
  ProductSummary,
  RuleSummary,
  UiState
} from "./types";

export function createDeviceModel(): JSONModel {
  return new JSONModel(Device);
}

export function createUiModel(): JSONModel {
  const state: UiState = {
    sideExpanded: false,
    selectedNavigationKey: "home",
    busy: false
  };

  return new JSONModel(state);
}

const countBomNodes = (items: BomNode[]): number =>
  items.reduce((count, node) => count + 1 + countBomNodes(node.children ?? []), 0);

const cloneBomNode = (node: BomNode): BomNode => ({
  ...node,
  ...(node.children ? { children: node.children.map(cloneBomNode) } : {})
});

const findBomNode = (
  nodes: BomNode[],
  predicate: (node: BomNode) => boolean
): BomNode | undefined => {
  for (const node of nodes) {
    if (predicate(node)) return node;
    const match = findBomNode(node.children ?? [], predicate);
    if (match) return match;
  }
  return undefined;
};

const unavailablePart = (
  id: string,
  number: string,
  name: string,
  geometryKey: string,
  color: number
): BomNode => ({
  id,
  number,
  name,
  materialId: number,
  quantity: 1,
  unit: "EA",
  lifecycle: "Design",
  changeStatus: "选配",
  state: "未选配",
  kind: "Part",
  visualState: "Available",
  visible: false,
  geometryKey,
  color
});

const unavailableAssembly = (
  id: string,
  number: string,
  name: string,
  children: BomNode[]
): BomNode => ({
  id,
  number,
  name,
  materialId: number,
  quantity: 1,
  unit: "EA",
  lifecycle: "Design",
  changeStatus: "选配",
  state: "未选配",
  kind: "Assembly",
  visualState: "Available",
  visible: false,
  children
});

const appendUnavailable = (parent: BomNode, options: BomNode[]): void => {
  parent.children = [...(parent.children ?? []), ...options];
};

export function createBomViews(nodes: BomNode[]): Record<BomViewKey, BomViewDefinition> {
  type PartOption = readonly [string, string, string, string, number];
  type TireOption = readonly [string, string, string, string, string, number];
  const configuredNodes = nodes;
  const supersetRoot = cloneBomNode(configuredNodes[0]);
  const frameAssembly = findBomNode([supersetRoot], (node) =>
    (node.children ?? []).some((child) =>
      ["cockpit", "cockpit-flat", "cockpit-drop", "cockpit-comfort"].includes(
        child.geometryKey ?? ""
      )
    )
  );
  const wheelAssembly = findBomNode([supersetRoot], (node) =>
    (node.children ?? []).some((child) => (child.geometryKey ?? "").endsWith("-wheel"))
  );
  let accessoryAssembly = findBomNode([supersetRoot], (node) =>
    (node.children ?? []).some((child) =>
      ["rack", "lights", "fenders", "fenders-full"].includes(child.geometryKey ?? "")
    )
  );

  const frameTarget = frameAssembly ?? supersetRoot;
  const wheelTarget = wheelAssembly ?? supersetRoot;
  if (!accessoryAssembly) {
    accessoryAssembly = {
      id: "bike/accessories",
      number: "AC-400",
      name: "通勤附件",
      materialId: "AC-400",
      quantity: 1,
      unit: "EA",
      lifecycle: "Design",
      changeStatus: "选配",
      state: "未选配",
      kind: "Assembly",
      visualState: "Available",
      visible: true,
      children: []
    };
    supersetRoot.children = [...(supersetRoot.children ?? []), accessoryAssembly];
  }

  const frameGeometry = new Set((frameTarget.children ?? []).map((child) => child.geometryKey));
  const handleOptions: PartOption[] = [
    ["flat", "HB-901", "城市平把", "cockpit-flat", 0x276d7a],
    ["drop", "HB-902", "运动弯把", "cockpit-drop", 0x3f4852],
    ["comfort", "HB-903", "舒适后掠把", "cockpit-comfort", 0x965d36]
  ];
  appendUnavailable(
    frameTarget,
    handleOptions
      .filter(([, , , geometryKey]) => !frameGeometry.has(geometryKey))
      .map(([variant, number, name, geometryKey, color]) =>
        unavailablePart(`bike/frame/options/handle/${variant}`, number, name, geometryKey, color)
      )
  );

  const saddleOptions: PartOption[] = [
    ["sport", "SD-901", "运动窄座", "saddle-sport", 0x3f4852],
    ["comfort", "SD-902", "舒适宽座", "saddle-comfort", 0x276d7a],
    ["gel", "SD-903", "凝胶减震座", "saddle-gel", 0x965d36]
  ];
  appendUnavailable(
    frameTarget,
    saddleOptions
      .filter(([, , , geometryKey]) => !frameGeometry.has(geometryKey))
      .map(([variant, number, name, geometryKey, color]) =>
        unavailablePart(`bike/frame/options/saddle/${variant}`, number, name, geometryKey, color)
      )
  );

  const wheelGeometry = new Set((wheelTarget.children ?? []).map((child) => child.geometryKey));
  const tireOptions: TireOption[] = [
    ["road", "WH-901", "700×28C 公路胎", "front-road", "rear-road", 0x3f4852],
    ["city", "WH-902", "700×35C 城市胎", "front-city", "rear-city", 0x242b34],
    ["gravel", "WH-903", "700×45C Gravel 胎", "front-gravel", "rear-gravel", 0x7b6651]
  ] as const;
  appendUnavailable(
    wheelTarget,
    tireOptions
      .filter(
        ([, , , frontGeometry, rearGeometry]) =>
          !wheelGeometry.has(frontGeometry) && !wheelGeometry.has(rearGeometry)
      )
      .map(([variant, number, name, frontGeometry, rearGeometry, color]) =>
        unavailableAssembly(`bike/wheel/options/${variant}`, number, name, [
          unavailablePart(
            `bike/wheel/options/${variant}/front`,
            `${number}-F`,
            `${name} · 前轮`,
            frontGeometry,
            color
          ),
          unavailablePart(
            `bike/wheel/options/${variant}/rear`,
            `${number}-R`,
            `${name} · 后轮`,
            rearGeometry,
            color
          )
        ])
      )
  );

  const accessoryGeometry = new Set(
    (accessoryAssembly.children ?? []).map((child) => child.geometryKey)
  );
  const fenderOptions: PartOption[] = [
    ["short", "FD-901", "运动短挡泥板", "fenders-short", 0x276d7a],
    ["full", "FD-902", "城市全包挡泥板", "fenders-full", 0x53616c],
    ["gravel", "FD-903", "Gravel 宽挡泥板", "fenders-gravel", 0x965d36]
  ];
  appendUnavailable(
    accessoryAssembly,
    fenderOptions
      .filter(([, , , geometryKey]) => !accessoryGeometry.has(geometryKey))
      .map(([variant, number, name, geometryKey, color]) =>
        unavailablePart(
          `bike/accessories/options/fender/${variant}`,
          number,
          name,
          geometryKey,
          color
        )
      )
  );

  const views: Record<BomViewKey, BomViewDefinition> = {
    "100": {
      key: "100",
      name: "100% BOM",
      description: "当前配置已解析并装配的产品结构",
      loadedCount: countBomNodes(configuredNodes),
      nodes: configuredNodes
    },
    "150": {
      key: "150",
      name: "150% BOM",
      description: "候选零件保留在所属装配位置，未选配项隐藏",
      loadedCount: countBomNodes([supersetRoot]),
      nodes: [supersetRoot]
    }
  };
  return views;
}

export function createConfiguredBicycleBom(
  selection: BicycleConfigurationSelection
): ConfiguredBicycleBom {
  const base = createBomModel().getData() as BomDocument;
  const nodes = base.nodes.map(cloneBomNode);
  const root = nodes[0];
  const frame = findBomNode(nodes, (node) => node.number === "FR-100");
  const wheel = findBomNode(nodes, (node) => node.number === "WH-300");
  const accessories = findBomNode(nodes, (node) => node.number === "AC-400");

  const handleOptions: Record<string, [string, string, string, number]> = {
    FLAT: ["HB-901", "城市平把", "cockpit-flat", 0x276d7a],
    DROP: ["HB-902", "运动弯把", "cockpit-drop", 0x3f4852],
    COMFORT: ["HB-903", "舒适后掠把", "cockpit-comfort", 0x965d36]
  };
  const handle = handleOptions[selection.handleStyle] ?? ["HB-902", "运动弯把", "cockpit-drop", 0x3f4852];
  const saddleOptions: Record<string, [string, string, string, number]> = {
    SPORT: ["SD-901", "运动窄座", "saddle-sport", 0x3f4852],
    COMFORT: ["SD-902", "舒适宽座", "saddle-comfort", 0x276d7a],
    GEL: ["SD-903", "凝胶减震座", "saddle-gel", 0x965d36]
  };
  const saddle = saddleOptions[selection.saddleStyle] ?? ["SD-902", "舒适宽座", "saddle-comfort", 0x276d7a];
  const tireOptions: Record<string, [string, string, string, string, string, string]> = {
    ROAD_28: ["WH-200", "700×28C 公路轮组", "front-road", "rear-road", "WH-211", "WH-212"],
    CITY_35: ["WH-300", "700×35C 城市轮组", "front-city", "rear-city", "WH-221", "WH-222"],
    GRAVEL_45: ["WH-400", "700×45C Gravel 轮组", "front-gravel", "rear-gravel", "WH-231", "WH-232"]
  };
  const tire = tireOptions[selection.wheelOption] ?? ["WH-300", "700×35C 城市轮组", "front-city", "rear-city", "WH-221", "WH-222"];
  const fenderOptions: Record<string, [string, string, string, number]> = {
    SHORT: ["FD-901", "运动短挡泥板", "fenders-short", 0x276d7a],
    FULL: ["FD-902", "城市全包挡泥板", "fenders-full", 0x53616c],
    GRAVEL: ["FD-903", "Gravel 宽挡泥板", "fenders-gravel", 0x965d36]
  };
  const fender = fenderOptions[selection.fenderStyle];

  const frameChildren = frame?.children ?? [];
  const handleNode = frameChildren.find((node) => node.number.startsWith("HB-"));
  const saddleNode = frameChildren.find((node) => node.number.startsWith("SD-"));
  if (handleNode) {
    [handleNode.number, handleNode.name, handleNode.geometryKey, handleNode.color] = handle;
  }
  if (saddleNode) {
    [saddleNode.number, saddleNode.name, saddleNode.geometryKey, saddleNode.color] = saddle;
  }

  if (wheel) {
    wheel.number = tire[0];
    wheel.name = tire[1];
    const frontTire = wheel.children?.find((node) => node.id.includes("front-tire"));
    const rearTire = wheel.children?.find((node) => node.id.includes("rear-tire"));
    if (frontTire) {
      frontTire.number = tire[4];
      frontTire.name = `${tire[1]} · 前轮胎`;
      frontTire.geometryKey = tire[2];
    }
    if (rearTire) {
      rearTire.number = tire[5];
      rearTire.name = `${tire[1]} · 后轮胎`;
      rearTire.geometryKey = tire[3];
    }
  }

  if (accessories) {
    accessories.children = (accessories.children ?? []).filter((node) => {
      if (node.number.startsWith("AC-401")) return selection.rearRack;
      if (node.number.startsWith("AC-402") || node.number.startsWith("FD-")) return false;
      if (node.number.startsWith("AC-403")) return selection.lights;
      return true;
    });
    if (fender) {
      accessories.children.push({
        id: "ac-fenders",
        number: fender[0],
        name: fender[1],
        materialId: fender[0],
        quantity: 1,
        unit: "EA",
        lifecycle: "Released",
        changeStatus: "",
        state: "已解析",
        kind: "Part",
        visualState: "Loaded",
        visible: true,
        geometryKey: fender[2],
        color: fender[3]
      });
    }
  }

  root.name = `URBAN / ${selection.scenario === "GRAVEL" ? "Gravel 探索" : selection.scenario === "SPORT" ? "运动骑行" : "城市探索"}自行车`;
  root.state = "配置完成";
  return { id: `CFG-URBAN-R${base.revision.replace("A.0", "")}`, revision: 1, nodes };
}

export function createBomModel(): JSONModel {
  const part = (
    id: string,
    number: string,
    name: string,
    geometryKey: string,
    color: number,
    lifecycle = "Released"
  ): BomNode => ({
    id,
    number,
    name,
    materialId: number,
    quantity: 1,
    unit: "EA",
    lifecycle,
    changeStatus: "",
    state: "已解析",
    kind: "Part",
    visualState: "Loaded",
    visible: true,
    geometryKey,
    color
  });
  const assembly = (
    id: string,
    number: string,
    name: string,
    children: BomNode[],
    lifecycle = "Released"
  ): BomNode => ({
    id,
    number,
    name,
    materialId: number,
    quantity: 1,
    unit: "EA",
    lifecycle,
    changeStatus: "",
    state: "已解析",
    kind: "Assembly",
    visualState: "Loaded",
    visible: true,
    children
  });
  const nodes: BomNode[] = [
    {
      id: "bike-root",
      number: "BIKE-100",
      name: "URBAN / 城市探索自行车",
      materialId: "URBAN",
      quantity: 1,
      unit: "SET",
      lifecycle: "Released",
      changeStatus: "",
      state: "配置完成",
      kind: "Product",
      visualState: "Loaded",
      visible: true,
      children: [
        assembly("bike-frame", "FR-100", "铝合金城市车架总成", [
          part("fr-frame", "FR-101", "铝合金城市车架", "frame", 0x168b91),
          part("fr-fork", "FR-110", "前叉", "fork", 0x168b91),
          part("fr-cockpit", "HB-902", "运动弯把", "cockpit-drop", 0x404956),
          part("fr-saddle", "SD-902", "舒适宽座", "saddle-comfort", 0x30343c)
        ]),
        assembly("bike-wheel", "WH-300", "700×35C 城市轮组", [
          part("wh-front-wheel", "WH-201", "前轮圈 / 花鼓 / 辐条", "front-wheel", 0xa7b4c1),
          part("wh-front-tire", "WH-221", "前轮胎 700×35C", "front-city", 0x242b34),
          part("wh-rear-wheel", "WH-202", "后轮圈 / 花鼓 / 辐条", "rear-wheel", 0xa7b4c1),
          part("wh-rear-tire", "WH-222", "后轮胎 700×35C", "rear-city", 0x242b34)
        ]),
        assembly("bike-drivetrain", "DR-300", "8 速通勤传动与制动", [
          part("dr-crank", "DR-301", "牙盘 / 曲柄 / 脚踏", "crank", 0x697788),
          part("dr-chain", "DR-302", "8 速链条与飞轮", "chain", 0x8997a6),
          part("dr-brakes", "DR-310", "前后碟刹套件", "brakes", 0xb9c4ce)
        ]),
        assembly("bike-accessories", "AC-400", "通勤附件", [
          part("ac-rack", "AC-401", "后货架", "rack", 0x4f6472, "Production"),
          part("ac-lights", "AC-402", "前后灯组", "lights", 0xf0c65a, "Production"),
          part("ac-fenders", "FD-902", "城市全包挡泥板", "fenders-full", 0x53616c, "Production")
        ])
      ]
    }
  ];
  const views = createBomViews(nodes);
  const configuredRoot = nodes[0];
  const currentView = views["100"];
  const bom: BomDocument = {
    id: "CFG-URBAN-R1",
    name: configuredRoot.name,
    revision: "A.01",
    viewName: currentView.name,
    viewKey: currentView.key,
    viewDescription: currentView.description,
    lastUpdated: "配置 R1",
    loadedCount: currentView.loadedCount,
    cameraType: "perspective",
    axesVisible: true,
    shadingMode: "shaded-edges",
    nodes: currentView.nodes,
    views,
    selectedNode: currentView.nodes[0],
    visibleNodes: currentView.nodes,
    filterText: ""
  };

  return new JSONModel(bom);
}

export function createSnowmobileBomModel(): JSONModel {
  const bom: BomDocument = {
    id: "BOM-001",
    name: "SNOWMOBILE MASTER",
    revision: "1.2",
    viewName: "Design",
    lastUpdated: "2026-09-05 14:32",
    loadedCount: 56,
    nodes: [
      {
        id: "bom-root",
        number: "100 SNOW",
        name: "SNOWMOBILE MASTER",
        materialId: "MAT-SNOW-100",
        quantity: 1,
        unit: "EA",
        lifecycle: "Released",
        changeStatus: "",
        state: "Released",
        kind: "Product",
        visualState: "Loaded",
        children: [
          {
            id: "bom-chassis",
            number: "0000020001",
            name: "CHASSIS SYSTEM",
            materialId: "MAT-CHASSIS",
            quantity: 1,
            unit: "EA",
            lifecycle: "Released",
            changeStatus: "",
            state: "Released",
            kind: "Assembly",
            visualState: "Loaded",
            children: [
              {
                id: "bom-main-chassis",
                number: "0000030004",
                name: "MAIN CHASSIS MODULE",
                materialId: "MAT-MAIN-CHASSIS",
                quantity: 1,
                unit: "EA",
                lifecycle: "Released",
                changeStatus: "Changed",
                state: "Released",
                kind: "Assembly",
                visualState: "Loaded",
                children: [
                  {
                    id: "bom-pro-ride",
                    number: "0114659",
                    name: "PRO-RIDE CHASSIS",
                    materialId: "MAT-PRO-RIDE",
                    quantity: 1,
                    unit: "EA",
                    lifecycle: "Released",
                    changeStatus: "",
                    state: "Released",
                    kind: "Part",
                    visualState: "Loaded"
                  },
                  {
                    id: "bom-axys",
                    number: "0115331",
                    name: "AXYS CHASSIS",
                    materialId: "MAT-AXYS",
                    quantity: 1,
                    unit: "EA",
                    lifecycle: "Released",
                    changeStatus: "",
                    state: "Released",
                    kind: "Part",
                    visualState: "Loaded"
                  }
                ]
              },
              {
                id: "bom-suspension",
                number: "0000020002",
                name: "SUSPENSION SYSTEM",
                materialId: "MAT-SUSPENSION",
                quantity: 1,
                unit: "EA",
                lifecycle: "Released",
                changeStatus: "Changed",
                state: "Released",
                kind: "Assembly",
                visualState: "Loaded",
                children: [
                  {
                    id: "bom-rear-suspension",
                    number: "0000030011",
                    name: "REAR SUSPENSION MODULE",
                    materialId: "MAT-REAR-SUSPENSION",
                    quantity: 1,
                    unit: "EA",
                    lifecycle: "Production",
                    changeStatus: "Changed",
                    state: "Production",
                    kind: "Assembly",
                    visualState: "Loaded",
                    children: [
                      {
                        id: "bom-pro-xc-rear",
                        number: "117011A",
                        name: "PRO-XC REAR SUSPENSION",
                        materialId: "MAT-PRO-XC-REAR",
                        quantity: 1,
                        unit: "EA",
                        lifecycle: "Production",
                        changeStatus: "",
                        state: "Production",
                        kind: "Part",
                        visualState: "Available"
                      },
                      {
                        id: "bom-pro-cc-rear",
                        number: "1543904A",
                        name: "PRO-CC REAR SUSPENSION",
                        materialId: "MAT-PRO-CC-REAR",
                        quantity: 1,
                        unit: "EA",
                        lifecycle: "Design",
                        changeStatus: "New",
                        state: "Design",
                        kind: "Part",
                        visualState: "Available"
                      }
                    ]
                  },
                  {
                    id: "bom-front-suspension",
                    number: "0000030019",
                    name: "FRONT SUSPENSION MODULE",
                    materialId: "MAT-FRONT-SUSPENSION",
                    quantity: 1,
                    unit: "EA",
                    lifecycle: "Production",
                    changeStatus: "Changed",
                    state: "Production",
                    kind: "Assembly",
                    visualState: "Loaded",
                    children: [
                      {
                        id: "bom-ultra-max",
                        number: "000000592",
                        name: "ULTRA MAX FRONT SUSPENSION",
                        materialId: "MAT-ULTRA-MAX",
                        quantity: 1,
                        unit: "EA",
                        lifecycle: "Design",
                        changeStatus: "New",
                        state: "Design",
                        kind: "Part",
                        visualState: "Available"
                      },
                      {
                        id: "bom-switchback",
                        number: "0114023",
                        name: "SWITCHBACK ASSAULT FRONT SUSPENSION",
                        materialId: "MAT-SWITCHBACK",
                        quantity: 1,
                        unit: "EA",
                        lifecycle: "Released",
                        changeStatus: "",
                        state: "Released",
                        kind: "Part",
                        visualState: "Loaded"
                      },
                      {
                        id: "bom-indy",
                        number: "0115686",
                        name: "INDY ADVENTURE FRONT SUSPENSION",
                        materialId: "MAT-INDY",
                        quantity: 1,
                        unit: "EA",
                        lifecycle: "Released",
                        changeStatus: "",
                        state: "Released",
                        kind: "Part",
                        visualState: "Loaded"
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            id: "bom-engine",
            number: "0000020003",
            name: "ENGINE & DRIVETRAIN SYSTEM",
            materialId: "MAT-ENGINE-SYSTEM",
            quantity: 1,
            unit: "EA",
            lifecycle: "Released",
            changeStatus: "",
            state: "Released",
            kind: "Assembly",
            visualState: "Loaded",
            children: [
              {
                id: "bom-oil-system",
                number: "0000030001",
                name: "OIL SYSTEM MODULE",
                materialId: "MAT-OIL-SYSTEM",
                quantity: 1,
                unit: "EA",
                lifecycle: "Released",
                changeStatus: "",
                state: "Released",
                kind: "Assembly",
                visualState: "Loaded",
                children: [
                  {
                    id: "bom-standard-oil",
                    number: "0113306",
                    name: "STANDARD OIL SYSTEM",
                    materialId: "MAT-STANDARD-OIL",
                    quantity: 1,
                    unit: "EA",
                    lifecycle: "Released",
                    changeStatus: "",
                    state: "Released",
                    kind: "Part",
                    visualState: "Loaded"
                  }
                ]
              },
              {
                id: "bom-cooling-system",
                number: "0000030002",
                name: "COOLING SYSTEM MODULE",
                materialId: "MAT-COOLING",
                quantity: 1,
                unit: "EA",
                lifecycle: "Released",
                changeStatus: "",
                state: "Released",
                kind: "Assembly",
                visualState: "Loaded",
                children: [
                  {
                    id: "bom-standard-cooling",
                    number: "0114255",
                    name: "STANDARD COOLING SYSTEM",
                    materialId: "MAT-STANDARD-COOLING",
                    quantity: 1,
                    unit: "EA",
                    lifecycle: "Released",
                    changeStatus: "",
                    state: "Released",
                    kind: "Part",
                    visualState: "Loaded"
                  }
                ]
              },
              {
                id: "bom-fuel-system",
                number: "0000030006",
                name: "FUEL SYSTEM MODULE",
                materialId: "MAT-FUEL",
                quantity: 1,
                unit: "EA",
                lifecycle: "Released",
                changeStatus: "",
                state: "Released",
                kind: "Assembly",
                visualState: "Loaded",
                children: [
                  {
                    id: "bom-standard-fuel",
                    number: "0114525",
                    name: "STANDARD FUEL SYSTEM A.3",
                    materialId: "MAT-STANDARD-FUEL",
                    quantity: 1,
                    unit: "EA",
                    lifecycle: "Production",
                    changeStatus: "Changed",
                    state: "Production",
                    kind: "Part",
                    visualState: "Available"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  };

  bom.selectedNode = bom.nodes[0];
  bom.filterText = "";
  bom.visibleNodes = bom.nodes;

  return new JSONModel(bom);
}

export function createConfiguratorModel(): JSONModel {
  const state: ConfiguratorState = {
    id: "CFG-URBAN-R1",
    engine: "",
    gearbox: "",
    seatMaterial: "",
    options: [],
    enabledOptions: [],
    result: [],
    scenario: "CITY",
    wheelOption: "CITY_35",
    handleStyle: "FLAT",
    saddleStyle: "COMFORT",
    fenderStyle: "FULL",
    rearRack: true,
    lights: true,
    status: "配置尚未生成 BOM"
  };

  return new JSONModel(state);
}

export function createProductModel(): JSONModel {
  const products: ProductSummary[] = [
    {
      id: "PROD-001",
      number: "VEH-1000",
      name: "Vehicle Platform",
      revision: "A.03",
      status: "Released"
    },
    {
      id: "PROD-002",
      number: "ENG-2000",
      name: "2.0T Engine",
      revision: "B.01",
      status: "Released"
    }
  ];

  return new JSONModel({ items: products });
}

export function createRuleModel(): JSONModel {
  const rules: RuleSummary[] = [
    {
      id: "RULE-001",
      name: "Engine to Gearbox",
      condition: "Engine = 2.0T",
      effect: "Gearbox = 8AT",
      status: "Active"
    },
    {
      id: "RULE-002",
      name: "Leather Comfort",
      condition: "Seat Material = Leather",
      effect: "Enable heating and ventilation",
      status: "Active"
    }
  ];

  return new JSONModel({ items: rules });
}
