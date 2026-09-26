import Control from "sap/ui/core/Control";
import Button from "sap/m/Button";
import Column from "sap/m/Column";
import ColumnListItem from "sap/m/ColumnListItem";
import Label from "sap/m/Label";
import List from "sap/m/List";
import MessageStrip from "sap/m/MessageStrip";
import StandardListItem from "sap/m/StandardListItem";
import Table from "sap/m/Table";
import Toolbar from "sap/m/OverflowToolbar";
import ToolbarSpacer from "sap/m/ToolbarSpacer";
import VBox from "sap/m/VBox";
import {
  contextReferences,
  definitionUsage,
  latestDefinitions,
  resolveDefinition
} from "../../model/configuration";
import type {
  ConfigurationStore,
  FeatureDefinition,
  FeatureFamily,
  FeatureReference,
  FeatureValue
} from "../../model/configuration";
import { button, form, status, title, txt } from "../../util/configurationUi";
import type { ConfigurationCommit } from "./types";

export interface FeatureContentOptions {
  store: ConfigurationStore;
  contextVersion: number;
  canEdit: () => boolean;
  commit: ConfigurationCommit;
  onEditDomain: (definition: FeatureDefinition) => void;
}

export default class ConfigurationFeatureContentView {
  private readonly options: FeatureContentOptions;

  public constructor(options: FeatureContentOptions) {
    this.options = options;
  }

  public valuesContent(definition?: FeatureDefinition, family?: FeatureFamily): Control {
    const definitions = definition
      ? [definition]
      : family
        ? this.options.store.references
            .filter((reference) => reference.familyId === family.id)
            .map((reference) => resolveDefinition(this.options.store, reference))
        : [];
    if (!definitions.length)
      return new MessageStrip({
        text: "分组不定义取值。请在 Family 下添加 Feature。",
        showIcon: true
      });
    return new VBox({
      items: definitions.map(
        (item) =>
          new VBox({
            items: [
              new Toolbar({
                content: [
                  title(item.name),
                  status(item.dataType),
                  new ToolbarSpacer(),
                  button("编辑值域", () => this.options.onEditDomain(item))
                ]
              }),
              this.domainDisplay(item)
            ]
          })
      )
    });
  }

  public domainDisplay(definition: FeatureDefinition): Control {
    const domain = definition.domain ?? { values: [] };
    if (["Enumeration", "Multi Enumeration", "Reference"].includes(definition.dataType)) {
      return new VBox({
        items: [
          ...(definition.dataType === "Multi Enumeration"
            ? [
                form([
                  ["Minimum Selections", String(definition.minSelections)],
                  ["Maximum Selections", String(definition.maxSelections)]
                ])
              ]
            : []),
          this.valueTable(domain.values)
        ]
      });
    }
    const pairs: [string, string][] = [
      ["Data Type", definition.dataType],
      ["Unit", definition.unit]
    ];
    if (definition.dataType === "Multi Enumeration")
      pairs.push(["Selection Count", `${definition.minSelections} – ${definition.maxSelections}`]);
    if (["Integer", "Decimal", "Range"].includes(definition.dataType ?? ""))
      pairs.push(
        ["Minimum", String(domain.minimum ?? "—")],
        ["Maximum", String(domain.maximum ?? "—")],
        ["Step", String(domain.step ?? "—")]
      );
    else if (definition.dataType === "String")
      pairs.push(
        ["Max Length", String(domain.maxLength ?? "—")],
        ["Pattern", domain.pattern || "—"]
      );
    else if (["Date", "DateTime"].includes(definition.dataType ?? ""))
      pairs.push(
        ["Minimum Date", domain.minimumDate || "—"],
        ["Maximum Date", domain.maximumDate || "—"]
      );
    else pairs.push(["Allowed Values", "Yes / No"]);
    return form(pairs);
  }

  public usageContent(definition?: FeatureDefinition): Control {
    if (!definition)
      return new MessageStrip({
        text: "选择 Feature 可查看定义在各产品族中的引用情况。",
        showIcon: true
      });
    const contexts = definitionUsage(this.options.store, definition.id);
    return new VBox({
      items: [
        new Toolbar({ content: [title(`Used by ${contexts.length} Contexts`)] }),
        new List({
          items: contexts.map(
            (context) =>
              new StandardListItem({
                title: context.name,
                description: `${context.code} · ${contextReferences(this.options.store, context.id)
                  .filter((reference) => reference.featureDefinitionId === definition.id)
                  .map((reference) => `V${reference.definitionVersion}`)
                  .join(", ")}`,
                info: context.status
              })
          )
        })
      ]
    });
  }

  public versionContent(definition?: FeatureDefinition, reference?: FeatureReference): Control {
    if (!definition)
      return new MessageStrip({
        text: `此对象随 Context V${this.options.contextVersion} 版本管理。可在顶部“版本”查看快照。`,
        showIcon: true
      });
    const latest = latestDefinitions(this.options.store).find((item) => item.id === definition.id)!;
    return new VBox({
      items: [
        form([
          ["Pinned Definition", `V${definition.version}`],
          ["Latest Definition", `V${latest.version}`],
          ["Last Modified", definition.modified],
          ["Update Policy", "引用锁定定义版本；升级后才采用新值域"]
        ]),
        ...(reference && latest.version > definition.version
          ? [
              new Button({
                text: `升级引用至 V${latest.version}`,
                type: "Emphasized",
                press: () => {
                  if (this.options.canEdit())
                    this.options.commit((store) => {
                      store.references.find((item) => item.id === reference.id)!.definitionVersion =
                        latest.version;
                    });
                }
              }).addStyleClass("sapUiSmallMargin")
            ]
          : []),
        new List({
          items: this.options.store.definitions
            .filter((item) => item.id === definition.id)
            .sort((a, b) => b.version - a.version)
            .map(
              (item) =>
                new StandardListItem({
                  title: `V${item.version} · ${item.name}`,
                  description: `${item.modified} · ${item.dataType}`,
                  info: item.version === definition.version ? "当前引用" : ""
                })
            )
        })
      ]
    });
  }

  private valueTable(values: FeatureValue[]): Table {
    return new Table({
      fixedLayout: false,
      noDataText: "尚未定义允许值",
      columns: ["Sequence", "Value Code", "Display Value", "Description", "Default", "Active"].map(
        (text) => new Column({ header: new Label({ text }) })
      ),
      items: [...values]
        .sort((a, b) => a.sort - b.sort)
        .map(
          (value) =>
            new ColumnListItem({
              cells: [
                txt(String(value.sort)),
                txt(value.code),
                txt(value.value),
                txt(value.description || "—"),
                status(value.defaultValue ? "Yes" : "—"),
                status(value.active ? "Active" : "Inactive")
              ]
            })
        )
    });
  }
}
