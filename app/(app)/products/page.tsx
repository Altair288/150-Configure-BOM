import type { Metadata } from "next";
import Link from "next/link";
import {
  Button,
  Card,
  CardHeader,
  DynamicPage,
  DynamicPageHeader,
  DynamicPageTitle,
  MessageStrip,
  ObjectStatus,
  Text,
  Title,
} from "@ui5/webcomponents-react";
import { products } from "@/mocks/product";

export const metadata: Metadata = {
  title: "Products",
};

export default function ProductsRoute() {
  return (
    <div className="page-frame">
      <DynamicPage
        className="catalog-dynamic-page"
      >
        <DynamicPageTitle slot="titleArea">
          <span slot="breadcrumbs">Product master</span>
          <Title slot="heading" level="H1">Products</Title>
          <Text slot="subheading">Manage configurable products and open their latest Super BOM workspace.</Text>
          <Button slot="actionsBar" icon="add" design="Emphasized">Create product</Button>
        </DynamicPageTitle>
        <DynamicPageHeader slot="headerArea" accessibleName="Product catalog context">
          <MessageStrip design="Information">Product models connect structure, options and released variants.</MessageStrip>
        </DynamicPageHeader>
        <div className="dynamic-page-content">
          <div className="product-grid">
            {products.map((product) => (
              <Card key={product.id} className="product-card">
                <CardHeader titleText={product.name} subtitleText={product.number} additionalText={product.revision} />
                <div className="product-card-body">
                  <Text>{product.description}</Text>
                  <div className="product-card-footer">
                    <ObjectStatus state={product.status === "Released" ? "Positive" : "Information"}>
                      {product.status}
                    </ObjectStatus>
                    <Link className="text-link" href={`/configurator/${product.id}`}>
                      Open configurator →
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <section className="onboarding-band">
            <div>
              <span className="eyebrow">MODEL COVERAGE</span>
              <Title level="H2">A single product model, many valid variants</Title>
              <Text>Bring structure, option logic and released output together before the REST API is connected.</Text>
            </div>
            <Link className="secondary-link" href="/features">
              Review feature catalog
            </Link>
          </section>
        </div>
      </DynamicPage>
    </div>
  );
}