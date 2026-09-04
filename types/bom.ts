export type BomItemStatus = "Released" | "Optional" | "In Configuration";

export interface BomItem {
  id: string;
  materialId: string;
  materialNumber: string;
  name: string;
  quantity: number;
  unit: string;
  level: number;
  parentId: string | null;
  status: BomItemStatus;
  selectionCondition?: string;
  children: BomItem[];
}

export interface Bom {
  id: string;
  productId: string;
  revision: string;
  name: string;
  status: BomItemStatus;
  rootItem: BomItem;
  updatedAt: string;
}

export interface FlatBomItem extends Omit<BomItem, "children"> {
  path: string;
}