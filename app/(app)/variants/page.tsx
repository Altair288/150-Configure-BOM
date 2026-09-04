import type { Metadata } from "next";
import Link from "next/link";
import { Button, ObjectStatus, Table, TableCell, TableHeaderCell, TableHeaderRow, TableRow, Title, Text } from "@ui5/webcomponents-react";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "Variants",
};

const variants = [
  { code: "UMX-PERF-001", name: "Urban Motion X Performance", selections: "2.0T · 8AT · Leather", status: "Active", owner: "System Configurator", date: "03 Sep 2026" },
  { code: "UMX-CITY-014", name: "Urban Motion X City", selections: "1.5T · 7DCT · Fabric", status: "Draft", owner: "Product Team", date: "02 Sep 2026" },
  { code: "UMX-LAUNCH-003", name: "Launch Edition", selections: "2.0T · 8AT · Leather + Comfort", status: "Active", owner: "Marketing Ops", date: "29 Aug 2026" },
];

export default function VariantsRoute() {
  return (
    <div className="page-frame">
      <PageHeader
        eyebrow="CONFIGURATION OUTPUT"
        title="Variants"
        description="Review saved selections and their publication state before they become orderable product variants."
        breadcrumbs={["Variants"]}
        actions={<Link className="primary-link" href="/configurator/vehicle-001">Create from configurator</Link>}
      />
      <section className="content-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">SAVED CONFIGURATIONS</span>
            <Title level="H2">Variant library</Title>
            <Text>Three recent configurations are represented in the local demo boundary.</Text>
          </div>
          <Button icon="download">Export list</Button>
        </div>
        <Table accessibleName="Variant library" alternateRowColors>
          <TableHeaderRow>
            <TableHeaderCell width="16%">Code</TableHeaderCell>
            <TableHeaderCell width="28%">Variant</TableHeaderCell>
            <TableHeaderCell width="28%">Selections</TableHeaderCell>
            <TableHeaderCell width="12%">Status</TableHeaderCell>
            <TableHeaderCell width="16%">Last updated</TableHeaderCell>
          </TableHeaderRow>
          {variants.map((variant) => (
            <TableRow key={variant.code} rowKey={variant.code} interactive>
              <TableCell>{variant.code}</TableCell>
              <TableCell><div className="table-item-cell"><strong>{variant.name}</strong><span>{variant.owner}</span></div></TableCell>
              <TableCell>{variant.selections}</TableCell>
              <TableCell><ObjectStatus state={variant.status === "Active" ? "Positive" : "Information"}>{variant.status}</ObjectStatus></TableCell>
              <TableCell>{variant.date}</TableCell>
            </TableRow>
          ))}
        </Table>
      </section>
    </div>
  );
}