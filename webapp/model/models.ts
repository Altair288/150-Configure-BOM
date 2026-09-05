import Device from "sap/ui/Device";
import JSONModel from "sap/ui/model/json/JSONModel";

import type { BomDocument, ConfiguratorState, ProductSummary, RuleSummary, UiState } from "./types";

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

export function createBomModel(): JSONModel {
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
    id: "CFG-001",
    engine: "2.0T",
    gearbox: "8AT",
    seatMaterial: "Leather",
    options: [
      { key: "PERFORMANCE_EXHAUST", text: "Performance Exhaust" },
      { key: "SEAT_HEATING", text: "Seat Heating" },
      { key: "SEAT_VENTILATION", text: "Seat Ventilation" }
    ],
    enabledOptions: ["PERFORMANCE_EXHAUST", "SEAT_HEATING", "SEAT_VENTILATION"],
    result: ["2.0T Engine", "8AT Gearbox", "Leather Seat", "Performance Exhaust"]
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
