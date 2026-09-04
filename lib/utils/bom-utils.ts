import type { BomItem, FlatBomItem } from "@/types/bom";

export function flattenBomItems(rootItem: BomItem): FlatBomItem[] {
  const items: FlatBomItem[] = [];

  const visit = (item: BomItem, parentPath: string) => {
    const path = parentPath ? `${parentPath} / ${item.name}` : item.name;
    const { children, ...flatItem } = item;
    items.push({ ...flatItem, path });
    children.forEach((child) => visit(child, path));
  };

  visit(rootItem, "");
  return items;
}

export function findBomItem(rootItem: BomItem, itemId: string): BomItem | undefined {
  if (rootItem.id === itemId) {
    return rootItem;
  }

  for (const child of rootItem.children) {
    const match = findBomItem(child, itemId);
    if (match) {
      return match;
    }
  }

  return undefined;
}