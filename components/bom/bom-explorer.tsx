"use client";

import { useState } from "react";
import { Button, MessageStrip, Title } from "@ui5/webcomponents-react";
import { BomProperties } from "@/components/bom/bom-properties";
import { BomTable } from "@/components/bom/bom-table";
import { BomTree } from "@/components/bom/bom-tree";
import { PageHeader } from "@/components/ui/page-header";
import { ThreeColumnWorkspace } from "@/components/ui/three-column-workspace";
import { flattenBomItems, findBomItem } from "@/lib/utils/bom-utils";
import { useBomStore } from "@/stores/bom-store";
import type { Bom } from "@/types/bom";

export function BomExplorer({ bom }: { bom: Bom }) {
  const [showTable, setShowTable] = useState(true);
  const selectedBomItemId = useBomStore((state) => state.selectedBomItemId);
  const selectBomItem = useBomStore((state) => state.selectBomItem);
  const selectedItem = findBomItem(bom.rootItem, selectedBomItemId);

  return (
    <div className="page-frame bom-explorer-page">
      <PageHeader
        eyebrow="SUPER BOM / STRUCTURE EXPLORER"
        title={bom.name}
        description={`Revision ${bom.revision} · ${flattenBomItems(bom.rootItem).length} items · Updated 03 Sep 2026`}
        breadcrumbs={["Super BOM", "BOM Explorer"]}
        actions={
          <Button icon={showTable ? "list" : "table-view"} onClick={() => setShowTable((visible) => !visible)}>
            {showTable ? "Tree only" : "Tree & table"}
          </Button>
        }
      />
      <MessageStrip design="Information">Select a BOM node to inspect material, quantity, unit and lifecycle status.</MessageStrip>
      <ThreeColumnWorkspace
        label="BOM explorer workspace"
        left={
          <section className="workspace-panel bom-structure-panel" aria-labelledby="bom-tree-heading">
            <div className="panel-heading">
              <div>
                <span className="eyebrow">HIERARCHY</span>
                <Title id="bom-tree-heading" level="H3">BOM Structure</Title>
              </div>
              <span className="panel-meta">{bom.revision}</span>
            </div>
            <BomTree rootItem={bom.rootItem} selectedItemId={selectedBomItemId} onSelect={selectBomItem} />
          </section>
        }
        center={
          <section className={`workspace-panel bom-table-panel ${showTable ? "" : "is-hidden"}`} aria-labelledby="bom-table-heading">
            <div className="panel-heading">
              <div>
                <span className="eyebrow">MATERIAL LINES</span>
                <Title id="bom-table-heading" level="H3">BOM Items</Title>
              </div>
              <span className="panel-meta">{flattenBomItems(bom.rootItem).length} items</span>
            </div>
            {showTable ? (
              <BomTable items={flattenBomItems(bom.rootItem)} selectedItemId={selectedBomItemId} onSelect={selectBomItem} />
            ) : (
              <div className="empty-panel"><Title level="H3">Tree-only view</Title></div>
            )}
          </section>
        }
        right={
          <section className="workspace-panel properties-workspace-panel" aria-labelledby="bom-properties-heading">
            <div className="panel-heading">
              <div>
                <span className="eyebrow">INSPECTOR</span>
                <Title id="bom-properties-heading" level="H3">Properties</Title>
              </div>
            </div>
            <BomProperties item={selectedItem} />
          </section>
        }
      />
    </div>
  );
}