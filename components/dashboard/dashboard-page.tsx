"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  Input,
  MessageStrip,
  ObjectStatus,
  Option,
  Select,
  Table,
  TableCell,
  TableHeaderCell,
  TableHeaderRow,
  TableRow,
  Text,
  Title,
} from "@ui5/webcomponents-react";
import { useProducts } from "@/features/product/hooks/use-products";
import { StatusTag } from "@/components/ui/status-tag";
import type { Product } from "@/types/product";

const statCards = [
  { label: "Active products", value: "24", delta: "+3 this quarter", tone: "Positive" as const },
  { label: "Released BOMs", value: "86", delta: "98.4% valid", tone: "Information" as const },
  { label: "Open configurations", value: "12", delta: "4 need review", tone: "Critical" as const },
  { label: "Published variants", value: "148", delta: "+18 this month", tone: "Neutral" as const },
];

export function DashboardPage({ initialProducts }: { initialProducts: Product[] }) {
  const router = useRouter();
  const { data: products, isLoading, isError } = useProducts(initialProducts);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  if (isError) {
    return <div className="state-panel">Unable to load product portfolio.</div>;
  }

  const availableProducts = products ?? [];
  const filteredProducts = availableProducts.filter((product) => {
    const matchesSearch = `${product.number} ${product.name}`.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === "all" || product.status === status;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="page-frame dashboard-page">
      <section className="dashboard-hero">
        <div>
          <span className="eyebrow">PRODUCT CONFIGURATION / CONTROL CENTER</span>
          <Title level="H1">Super BOM Configurator</Title>
          <p>Model product choices, validate compatibility rules, and publish resolved BOM variants from one workspace.</p>
        </div>
        <div className="hero-actions">
          <Link className="primary-link" href="/configurator/vehicle-001">
            <span aria-hidden="true">+</span> Start configuration
          </Link>
          <Link className="secondary-link" href="/bom/bom-vehicle-001">
            Open Super BOM
          </Link>
        </div>
      </section>
      <MessageStrip design="Information">Workspace data is connected to a local mock REST boundary and ready for backend integration.</MessageStrip>
      <section className="stat-grid" aria-label="Workspace metrics">
        {statCards.map((card) => (
          <Card key={card.label} className="stat-card">
            <CardHeader titleText={card.label} subtitleText="Portfolio overview" />
            <div className="stat-card-body">
              <strong>{card.value}</strong>
              <StatusTag status={card.delta} tone={card.tone} />
            </div>
          </Card>
        ))}
      </section>
      <section className="content-section" aria-labelledby="recent-products-heading">
        <div className="section-heading">
          <div>
            <span className="eyebrow">RECENT ACTIVITY</span>
            <Title id="recent-products-heading" level="H2">
              Product portfolio
            </Title>
            <Text>Keep the product model, BOM revision and configuration state visible together.</Text>
          </div>
          <Button icon="add" design="Emphasized" onClick={() => router.push("/products")}>
            Add product
          </Button>
        </div>
        <div className="table-toolbar" role="toolbar" aria-label="Product filters">
          <Input
            className="filter-input"
            data-testid="product-search-input"
            placeholder="Search product number or name"
            accessibleName="Search products"
            value={search}
            onInput={(event) => setSearch(event.currentTarget?.value ?? "")}
          />
          <Select
            className="filter-select"
            data-testid="product-status-filter"
            value={status}
            accessibleName="Filter product status"
            onChange={(event) => setStatus(event.detail.selectedOption.value ?? "all")}
          >
            <Option value="all">All statuses</Option>
            <Option value="Released">Released</Option>
            <Option value="In Configuration">In Configuration</Option>
            <Option value="Draft">Draft</Option>
          </Select>
        </div>
        <Table accessibleName="Product portfolio" alternateRowColors loading={isLoading}>
          <TableHeaderRow>
            <TableHeaderCell width="20%">Product number</TableHeaderCell>
            <TableHeaderCell width="34%">Product</TableHeaderCell>
            <TableHeaderCell width="12%">Revision</TableHeaderCell>
            <TableHeaderCell width="20%">Status</TableHeaderCell>
            <TableHeaderCell width="14%">Workspace</TableHeaderCell>
          </TableHeaderRow>
          {filteredProducts.map((product) => (
            <TableRow key={product.id} rowKey={product.id} interactive>
              <TableCell>{product.number}</TableCell>
              <TableCell>
                <div className="table-item-cell">
                  <strong>{product.name}</strong>
                  <span>{product.description}</span>
                </div>
              </TableCell>
              <TableCell>{product.revision}</TableCell>
              <TableCell>
                <ObjectStatus state={product.status === "Released" ? "Positive" : "Information"}>
                  {product.status}
                </ObjectStatus>
              </TableCell>
              <TableCell>
                <Link className="text-link" href={`/configurator/${product.id}`}>
                  Configure →
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </section>
    </div>
  );
}