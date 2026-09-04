"use client";

import { useEffect } from "react";
import { MessageStrip, Title } from "@ui5/webcomponents-react";
import { BomProperties } from "@/components/bom/bom-properties";
import { BomTree } from "@/components/bom/bom-tree";
import { ConfigurationResultPanel } from "@/components/configurator/configuration-result";
import { ConfigurationToolbar } from "@/components/configurator/configuration-toolbar";
import { FeaturePanel } from "@/components/configurator/feature-panel";
import { PageHeader } from "@/components/ui/page-header";
import { ThreeColumnWorkspace } from "@/components/ui/three-column-workspace";
import { resolveConfiguration } from "@/features/configurator/engine/configuration-engine";
import { findBomItem } from "@/lib/utils/bom-utils";
import { useConfiguratorStore } from "@/stores/configurator-store";
import type { ConfiguratorData } from "@/features/configurator/api/configurator-api";

export function ConfiguratorWorkspace({ data }: { data: ConfiguratorData }) {
  const initialize = useConfiguratorStore((state) => state.initialize);
  const selections = useConfiguratorStore((state) => state.selections);
  const selectedBomItemId = useConfiguratorStore((state) => state.selectedBomItemId);
  const dirty = useConfiguratorStore((state) => state.dirty);
  const selectBomItem = useConfiguratorStore((state) => state.selectBomItem);
  const setOption = useConfiguratorStore((state) => state.setOption);
  const reset = useConfiguratorStore((state) => state.reset);
  const markClean = useConfiguratorStore((state) => state.markClean);

  useEffect(() => {
    initialize(data.product.id, data.features);
  }, [data.features, data.product.id, initialize]);

  const result = resolveConfiguration(data.features, data.bom.rootItem, selections);
  const selectedItem =
    findBomItem(result.generatedBom, selectedBomItemId) ?? findBomItem(data.bom.rootItem, selectedBomItemId);

  return (
    <div className="page-frame configurator-page">
      <PageHeader
        eyebrow="PRODUCT CONFIGURATION"
        title={`${data.product.name} / Super BOM`}
        description={`${data.product.number} · Revision ${data.product.revision} · ${data.bom.name}`}
        breadcrumbs={["Products", data.product.name, "Configurator"]}
        actions={<ConfigurationToolbar dirty={dirty} onSave={markClean} onReset={() => reset(data.features)} />}
      />
      {result.warnings.length > 0 ? (
        <MessageStrip design="Critical">{result.warnings[0]}</MessageStrip>
      ) : (
        <MessageStrip design="Positive">Rules are evaluated live against the current selection.</MessageStrip>
      )}
      <ThreeColumnWorkspace
        label="Super BOM configuration workspace"
        left={
          <section className="workspace-panel bom-structure-panel" aria-labelledby="structure-heading">
            <div className="panel-heading">
              <div>
                <span className="eyebrow">STRUCTURE</span>
                <Title id="structure-heading" level="H3">
                  BOM Structure
                </Title>
              </div>
              <span className="panel-meta">{data.bom.revision}</span>
            </div>
            <BomTree
              rootItem={result.generatedBom}
              selectedItemId={selectedBomItemId}
              onSelect={selectBomItem}
            />
          </section>
        }
        center={
          <div className="workspace-center-stack">
            <section className="workspace-panel configuration-panel" aria-labelledby="options-heading">
              <FeaturePanel
                features={data.features}
                result={result}
                onOptionChange={setOption}
              />
            </section>
            <ConfigurationResultPanel result={result} />
          </div>
        }
        right={
          <section className="workspace-panel properties-workspace-panel" aria-labelledby="properties-heading">
            <div className="panel-heading">
              <div>
                <span className="eyebrow">INSPECTOR</span>
                <Title id="properties-heading" level="H3">
                  Properties
                </Title>
              </div>
            </div>
            <BomProperties item={selectedItem} />
          </section>
        }
      />
    </div>
  );
}