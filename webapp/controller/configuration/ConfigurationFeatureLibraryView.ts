import Control from "sap/ui/core/Control";
import VBox from "sap/m/VBox";
import HBox from "sap/m/HBox";
import Button from "sap/m/Button";
import Column from "sap/m/Column";
import ColumnListItem from "sap/m/ColumnListItem";
import Label from "sap/m/Label";
import MessageStrip from "sap/m/MessageStrip";
import ObjectIdentifier from "sap/m/ObjectIdentifier";
import ObjectPageHeader from "sap/uxap/ObjectPageHeader";
import ScrollContainer from "sap/m/ScrollContainer";
import SearchField from "sap/m/SearchField";
import Table from "sap/m/Table";
import Toolbar from "sap/m/OverflowToolbar";
import ToolbarSpacer from "sap/m/ToolbarSpacer";
import { definitionUsage, latestDefinitions } from "../../model/configuration";
import type { ConfigurationStore, FeatureDefinition } from "../../model/configuration";
import { button, form, grow, status, title, tr, txt } from "../../util/configurationUi";
import ConfigurationFeatureContentView from "./ConfigurationFeatureContentView";

export interface ConfigurationFeatureLibraryOptions {
  store: ConfigurationStore;
  selectedLibrary?: string;
  librarySearch: string;
  contextVersion: number;
  getHost: () => { addDependent(dependent: Control): void } | undefined;
  onSelectionChanged: (id: string | undefined) => void;
  onSearchChanged: (value: string) => void;
  onBack: () => void;
  onNewDefinition: () => void;
  onEditDefinition: (definition: FeatureDefinition) => void;
  onEditDomain: (definition: FeatureDefinition) => void;
  canEdit: () => boolean;
  commit: (
    change: (next: ConfigurationStore) => void,
    message?: string
  ) => boolean;
}

export default class ConfigurationFeatureLibraryView {
  private readonly options: ConfigurationFeatureLibraryOptions;
  private libraryTable?: Table;
  private libraryDetail?: VBox;
  private selectedLibrary?: string;

  public constructor(options: ConfigurationFeatureLibraryOptions) {
    this.options = options;
    this.selectedLibrary = options.selectedLibrary;
  }

  public render(root: VBox): void {
    this.libraryTable = new Table({
      mode: "SingleSelectMaster",
      includeItemInSelection: true,
      fixedLayout: false,
      growing: true,
      growingThreshold: 30,
      columns: ["Feature Definition", "Dimension", "Data Type", "Version", "Usage", "Status"].map(
        (text) => new Column({ header: new Label({ text }) })
      ),
      selectionChange: (event) => {
        this.selectedLibrary = event.getParameter("listItem")?.data("id") as string;
        this.options.onSelectionChanged(this.selectedLibrary);
        this.renderDetail();
      }
    });
    this.libraryDetail = new VBox({ width: "100%" }).addStyleClass("cmLibraryDetail");
    const definitions = this.enterpriseDefinitions();
    if (!definitions.some((definition) => definition.id === this.selectedLibrary)) {
      this.selectedLibrary = definitions[0]?.id;
      this.options.onSelectionChanged(this.selectedLibrary);
    }
    root.addItem(
      new ObjectPageHeader({
        objectTitle: "Enterprise Feature Library",
        objectSubtitle: "跨产品族共享配置能力 · Feature Definition + Versioned Reference",
        isObjectTitleAlwaysVisible: true,
        isObjectSubtitleAlwaysVisible: true
      })
    );
    root.addItem(
      new Toolbar({
        content: [
          button("返回配置上下文", () => this.options.onBack(), "sap-icon://nav-back"),
          title(`${definitions.length} 个公共定义`),
          new ToolbarSpacer(),
          new SearchField({
            width: "22rem",
            value: this.options.librarySearch,
            placeholder: "搜索名称 / 编码 / 类型 / 维度",
            liveChange: (event) => {
              this.options.onSearchChanged(event.getParameter("newValue") ?? "");
              this.populate();
            }
          }),
          new Button({
            text: tr("New Feature Definition"),
            icon: "sap-icon://add",
            type: "Emphasized",
            press: () => this.options.onNewDefinition()
          })
        ]
      })
    );
    root.addItem(
      grow(
        new HBox({
          height: "100%",
          items: [
            grow(
              new ScrollContainer({ height: "100%", vertical: true, content: [this.libraryTable] })
            ),
            new ScrollContainer({
              width: "34rem",
              height: "100%",
              vertical: true,
              content: [this.libraryDetail]
            }).addStyleClass("cmLibraryInspector")
          ]
        })
      )
    );
    this.populate();
    this.renderDetail();
  }

  private enterpriseDefinitions(): FeatureDefinition[] {
    return latestDefinitions(this.options.store).filter(
      (definition) => definition.sourceType === "Enterprise Library"
    );
  }

  private populate(): void {
    if (!this.libraryTable) return;
    this.libraryTable.destroyItems();
    this.enterpriseDefinitions()
      .filter((definition) =>
        `${definition.name} ${definition.code} ${definition.dataType} ${definition.dimension}`
          .toLowerCase()
          .includes(this.options.librarySearch.toLowerCase())
      )
      .forEach((definition) => {
        const item = new ColumnListItem({
          selected: definition.id === this.selectedLibrary,
          cells: [
            new ObjectIdentifier({ title: definition.name, text: definition.code }),
            status(definition.dimension),
            txt(definition.dataType),
            txt(`V${definition.version}`),
            txt(`${definitionUsage(this.options.store, definition.id).length} Contexts`),
            status(definition.active ? "Active" : "Inactive")
          ]
        });
        item.data("id", definition.id);
        this.libraryTable!.addItem(item);
      });
  }

  private renderDetail(): void {
    const box = this.libraryDetail;
    if (!box) return;
    box.destroyItems();
    const definition = this.enterpriseDefinitions().find(
      (item) => item.id === this.selectedLibrary
    );
    if (!definition) {
      box.addItem(txt("选择一个公共定义查看值域与使用情况"));
      return;
    }
    const contentView = new ConfigurationFeatureContentView({
      store: this.options.store,
      contextVersion: this.options.contextVersion,
      canEdit: this.options.canEdit,
      commit: this.options.commit,
      onEditDomain: this.options.onEditDomain
    });
    box.addItem(
      new ObjectPageHeader({
        objectTitle: definition.name,
        objectSubtitle: `${definition.code} · V${definition.version}`,
        isObjectTitleAlwaysVisible: true,
        isObjectSubtitleAlwaysVisible: true
      })
    );
    box.addItem(
      new Toolbar({
        content: [
          status(definition.dimension),
          status(definition.dataType),
          new ToolbarSpacer(),
          button("编辑定义", () => this.options.onEditDefinition(definition), "sap-icon://edit"),
          button("编辑值域", () => this.options.onEditDomain(definition))
        ]
      })
    );
    box.addItem(
      new MessageStrip({
        text: "保存会生成新定义版本，已有产品族继续使用原版本。可在各 Context 的 Version 页签主动升级。",
        type: "Information",
        showIcon: true
      })
    );
    box.addItem(
      form([
        ["Description", definition.description],
        ["Selection", definition.selectionType],
        ["Mandatory", definition.mandatory ? "Yes" : "No"],
        ["Unit", definition.unit],
        ["Last Modified", definition.modified]
      ])
    );
    box.addItem(title("Value Domain").addStyleClass("sapUiSmallMargin"));
    box.addItem(contentView.domainDisplay(definition));
    box.addItem(contentView.usageContent(definition));
    box.addItem(contentView.versionContent(definition));
  }
}