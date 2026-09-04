"use client";

import {
  ObjectStatus,
  Table,
  TableCell,
  TableHeaderCell,
  TableHeaderRow,
  TableRow,
  Text,
  Title,
} from "@ui5/webcomponents-react";
import { flattenBomItems } from "@/lib/utils/bom-utils";
import type { ConfigurationResult, ResolvedRule } from "@/types/configuration";

function ruleState(rule: ResolvedRule) {
  return rule.result === "Applied" ? ("Positive" as const) : ("None" as const);
}

export function ConfigurationResultPanel({ result }: { result: ConfigurationResult }) {
  const generatedItems = flattenBomItems(result.generatedBom);

  return (
    <section className="result-panel" data-testid="configuration-result">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Output</span>
          <Title level="H2">Configuration Result</Title>
        </div>
        <ObjectStatus state="Positive" showDefaultIcon>
          {generatedItems.length} BOM items
        </ObjectStatus>
      </div>
      <div className="result-flow" aria-label="Configuration resolution flow">
        <span>Selected configuration</span>
        <span aria-hidden="true">→</span>
        <span>Resolved rules</span>
        <span aria-hidden="true">→</span>
        <strong>Generated BOM</strong>
      </div>
      <div className="result-content">
        <div className="result-table-wrap">
          <Table accessibleName="Generated BOM" alternateRowColors>
            <TableHeaderRow>
              <TableHeaderCell width="52%">Generated item</TableHeaderCell>
              <TableHeaderCell width="24%">Material</TableHeaderCell>
              <TableHeaderCell width="12%" horizontalAlign="End">
                Qty
              </TableHeaderCell>
              <TableHeaderCell width="12%">Unit</TableHeaderCell>
            </TableHeaderRow>
            {generatedItems.map((item) => (
              <TableRow key={item.id} rowKey={item.id}>
                <TableCell>
                  <span style={{ paddingInlineStart: `${item.level * 16}px` }}>{item.name}</span>
                </TableCell>
                <TableCell>{item.materialNumber}</TableCell>
                <TableCell horizontalAlign="End">{item.quantity}</TableCell>
                <TableCell>{item.unit}</TableCell>
              </TableRow>
            ))}
          </Table>
        </div>
        <div className="rule-list">
          <Title level="H3">Resolved rules</Title>
          {result.resolvedRules.map((rule) => (
            <div className="rule-row" key={rule.id}>
              <ObjectStatus state={ruleState(rule)}>{rule.result}</ObjectStatus>
              <div>
                <strong>{rule.name}</strong>
                <Text>{rule.detail}</Text>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}