import type { Metadata } from "next";
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
import { configurationRules } from "@/mocks/configuration";
import { PageHeader } from "@/components/ui/page-header";
import { RuleActions } from "@/components/rules/rule-actions";

export const metadata: Metadata = {
  title: "Rules",
};

export default function RulesRoute() {
  return (
    <div className="page-frame">
      <PageHeader
        eyebrow="CONFIGURATION LOGIC"
        title="Rules"
        description="Keep compatibility and auto-inclusion rules explicit, reviewable and independent from UI components."
        breadcrumbs={["Rules"]}
      />
      <section className="content-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">ACTIVE RULE SET</span>
            <Title level="H2">Configuration rules</Title>
            <Text>Rules are evaluated by the domain engine on every option change.</Text>
          </div>
          <ObjectStatus state="Positive" showDefaultIcon>3 active rules</ObjectStatus>
        </div>
        <RuleActions />
        <Table accessibleName="Configuration rules" alternateRowColors>
          <TableHeaderRow>
            <TableHeaderCell width="24%">Rule</TableHeaderCell>
            <TableHeaderCell width="16%">Type</TableHeaderCell>
            <TableHeaderCell width="24%">Condition</TableHeaderCell>
            <TableHeaderCell width="36%">Action</TableHeaderCell>
          </TableHeaderRow>
          {configurationRules.map((rule) => (
            <TableRow key={rule.id} rowKey={rule.id}>
              <TableCell><div className="table-item-cell"><strong>{rule.name}</strong><span>{rule.id}</span></div></TableCell>
              <TableCell><ObjectStatus state="Information">{rule.type}</ObjectStatus></TableCell>
              <TableCell>{rule.condition}</TableCell>
              <TableCell>{rule.action}</TableCell>
            </TableRow>
          ))}
        </Table>
      </section>
    </div>
  );
}