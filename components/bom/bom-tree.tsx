"use client";

import { useState } from "react";
import { Tree, TreeItem } from "@ui5/webcomponents-react";
import type { BomItem } from "@/types/bom";

interface BomTreeProps {
  rootItem: BomItem;
  selectedItemId: string;
  onSelect: (itemId: string) => void;
}

function collectExpandedIds(item: BomItem): string[] {
  return item.children.length > 0
    ? [item.id, ...item.children.flatMap((child) => (child.level < 2 ? collectExpandedIds(child) : []))]
    : [];
}

export function BomTree({ rootItem, selectedItemId, onSelect }: BomTreeProps) {
  const [expandedIds, setExpandedIds] = useState(() => new Set(collectExpandedIds(rootItem)));

  const renderItem = (item: BomItem): React.ReactNode => (
    <TreeItem
      key={item.id}
      id={item.id}
      text={item.name}
      icon={item.children.length > 0 ? "folder-full" : "product"}
      selected={item.id === selectedItemId}
      expanded={expandedIds.has(item.id)}
    >
      {item.children.map((child) => renderItem(child))}
    </TreeItem>
  );

  return (
    <Tree
      headerText="BOM Structure"
      accessibleName="BOM Structure"
      selectionMode="Single"
      onSelectionChange={(event) => onSelect(event.detail.targetItem.id)}
      onItemToggle={(event) => {
        const itemId = event.detail.item.id;
        setExpandedIds((current) => {
          const next = new Set(current);
          if (next.has(itemId)) {
            next.delete(itemId);
          } else {
            next.add(itemId);
          }
          return next;
        });
      }}
    >
      {renderItem(rootItem)}
    </Tree>
  );
}