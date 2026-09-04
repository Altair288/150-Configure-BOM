"use client";

import {
  ObjectStatus,
  Table,
  TableCell,
  TableHeaderCell,
  TableHeaderRow,
  TableRow,
} from "@ui5/webcomponents-react";
import type { FlatBomItem } from "@/types/bom";

interface BomTableProps {
  items: FlatBomItem[];
  selectedItemId: string;
  onSelect: (itemId: string) => void;
}

function statusState(status: FlatBomItem["status"]) {
  if (status === "Released") {
    return "Positive" as const;
  }
  if (status === "Optional") {
    return "Information" as const;
  }
  return "Critical" as const;
}

export function BomTable({ items, selectedItemId, onSelect }: BomTableProps) {
  return (
    <Table
      accessibleName="BOM Items"
      alternateRowColors
      headerRow={
        <TableHeaderRow>
          <TableHeaderCell width="32%">Item</TableHeaderCell>
          <TableHeaderCell width="18%">Material</TableHeaderCell>
          <TableHeaderCell width="12%" horizontalAlign="End">
            Quantity
          </TableHeaderCell>
          <TableHeaderCell width="12%">Unit</TableHeaderCell>
          <TableHeaderCell width="26%">Status</TableHeaderCell>
        </TableHeaderRow>
      }
      onRowClick={(event) => onSelect(event.detail.row.rowKey ?? event.detail.row.id)}
    >
      {items.map((item) => (
        <TableRow
          key={item.id}
          id={item.id}
          rowKey={item.id}
          interactive
          navigated={item.id === selectedItemId}
        >
          <TableCell>
            <div className="table-item-cell" style={{ paddingInlineStart: `${item.level * 14}px` }}>
              <strong>{item.name}</strong>
              <span>{item.path}</span>
            </div>
          </TableCell>
          <TableCell>{item.materialNumber}</TableCell>
          <TableCell horizontalAlign="End">{item.quantity}</TableCell>
          <TableCell>{item.unit}</TableCell>
          <TableCell>
            <ObjectStatus state={statusState(item.status)}>{item.status}</ObjectStatus>
          </TableCell>
        </TableRow>
      ))}
    </Table>
  );
}