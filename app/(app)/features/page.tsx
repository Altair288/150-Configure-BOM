import type { Metadata } from "next";
import { Card, CardHeader, ObjectStatus, Text, Title } from "@ui5/webcomponents-react";
import { demoFeatures } from "@/mocks/feature";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "Features",
};

export default function FeaturesRoute() {
  return (
    <div className="page-frame">
      <PageHeader
        eyebrow="OPTION CATALOG"
        title="Features"
        description="Define product decisions as typed feature groups with compatibility-aware options."
        breadcrumbs={["Features"]}
      />
      <div className="feature-catalog-grid">
        {demoFeatures.map((feature) => (
          <Card key={feature.id} className="catalog-card">
            <CardHeader titleText={feature.name} subtitleText={feature.code} additionalText={feature.type} />
            <div className="catalog-card-body">
              <Text>{feature.description}</Text>
              <div className="catalog-option-stack">
                {feature.options.map((option) => (
                  <div className="catalog-option" key={option.id}>
                    <div>
                      <strong>{option.name}</strong>
                      <span>{option.materialNumber}</span>
                    </div>
                    <ObjectStatus state="Positive">Compatible</ObjectStatus>
                  </div>
                ))}
              </div>
              <Title level="H5">{feature.required ? "Required feature" : "Optional feature"}</Title>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}