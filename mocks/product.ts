import type { Product } from "@/types/product";

export const demoProduct: Product = {
  id: "vehicle-001",
  number: "VEH-1000",
  name: "Urban Motion X",
  revision: "A.04",
  status: "Released",
  description: "下一代城市运动型整车产品，面向全球市场的超级 BOM 配置演示。",
  bomId: "bom-vehicle-001",
};

export const products: Product[] = [
  demoProduct,
  {
    id: "vehicle-002",
    number: "VEH-1200",
    name: "Urban Motion X Sport",
    revision: "B.02",
    status: "In Configuration",
    description: "高性能运动版本，正在进行市场配置评审。",
    bomId: "bom-vehicle-002",
  },
  {
    id: "vehicle-003",
    number: "VEH-2100",
    name: "Urban Motion E",
    revision: "C.01",
    status: "Draft",
    description: "面向城市通勤的纯电产品线概念配置。",
    bomId: "bom-vehicle-003",
  },
];