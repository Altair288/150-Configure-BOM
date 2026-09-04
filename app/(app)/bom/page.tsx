import type { Metadata } from "next";
import Link from "next/link";
import { Button, Card, CardHeader, ObjectStatus, Text, Title } from "@ui5/webcomponents-react";
import { demoBom } from "@/mocks/bom";
import { demoProduct } from "@/mocks/product";
import { flattenBomItems } from "@/lib/utils/bom-utils";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "Super BOM",
};

export default function BomIndexRoute() {
  const items = flattenBomItems(demoBom.rootItem);

  return (
    <div className="page-frame">
      <PageHeader
        eyebrow="PRODUCT STRUCTURE"
        title="Super BOM"
        description="Browse released multi-level product structures and inspect every material line."
        breadcrumbs={["Super BOM"]}
        actions={
          <Link className="primary-link" href={`/bom/${demoBom.id}`}>
            Open BOM explorer
          </Link>
        }
      />
      <section className="bom-overview-grid">
        <Card className="bom-hero-card">
          <CardHeader titleText={demoBom.name} subtitleText={`${demoProduct.number} · Rev ${demoBom.revision}`} />
          <div className="bom-hero-body">
            <div className="bom-hero-stat">
              <strong>{items.length}</strong>
              <span>Total structure items</span>
            </div>
            <div className="bom-hero-stat">
              <strong>3</strong>
              <span>Configurable systems</span>
            </div>
            <ObjectStatus state="Positive">Released</ObjectStatus>
          </div>
        </Card>
        <div className="bom-quick-links">
          <Title level="H3">Explore the model</Title>
          <Text>Use the tree explorer for selection and the table view for material comparison.</Text>
          <div className="quick-link-row">
            <Link className="secondary-link" href={`/bom/${demoBom.id}`}>
              <Button icon="table-view">Tree & properties</Button>
            </Link>
            <Link className="secondary-link" href="/configurator/vehicle-001">
              <Button icon="action-settings">Configure product</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}