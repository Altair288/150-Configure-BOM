import BaseController from "./BaseController";
import Control from "sap/ui/core/Control";
import Icon from "sap/ui/core/Icon";
import Item from "sap/ui/core/Item";
import JSONModel from "sap/ui/model/json/JSONModel";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import VBox from "sap/m/VBox";
import HBox from "sap/m/HBox";
import FlexItemData from "sap/m/FlexItemData";
import Button from "sap/m/Button";
import Title from "sap/m/Title";
import Text from "sap/m/Text";
import Label from "sap/m/Label";
import Input from "sap/m/Input";
import TextArea from "sap/m/TextArea";
import Select from "sap/m/Select";
import CheckBox from "sap/m/CheckBox";
import MultiComboBox from "sap/m/MultiComboBox";
import RadioButton from "sap/m/RadioButton";
import RadioButtonGroup from "sap/m/RadioButtonGroup";
import SearchField from "sap/m/SearchField";
import Toolbar from "sap/m/OverflowToolbar";
import ToolbarSpacer from "sap/m/ToolbarSpacer";
import ObjectStatus from "sap/m/ObjectStatus";
import ObjectIdentifier from "sap/m/ObjectIdentifier";
import IconTabBar from "sap/m/IconTabBar";
import IconTabFilter from "sap/m/IconTabFilter";
import MessageStrip from "sap/m/MessageStrip";
import MessageBox from "sap/m/MessageBox";
import MessageToast from "sap/m/MessageToast";
import Dialog from "sap/m/Dialog";
import Page from "sap/m/Page";
import ScrollContainer from "sap/m/ScrollContainer";
import List from "sap/m/List";
import StandardListItem from "sap/m/StandardListItem";
import Table from "sap/m/Table";
import Tree from "sap/m/Tree";
import StandardTreeItem from "sap/m/StandardTreeItem";
import Column from "sap/m/Column";
import ColumnListItem from "sap/m/ColumnListItem";
import SimpleForm from "sap/ui/layout/form/SimpleForm";
import TreeTable from "sap/ui/table/TreeTable";
import TreeColumn from "sap/ui/table/Column";
import Fixed from "sap/ui/table/rowmodes/Fixed";
import Auto from "sap/ui/table/rowmodes/Auto";
import FlexibleColumnLayout from "sap/f/FlexibleColumnLayout";
import FlexibleColumnLayoutData from "sap/f/FlexibleColumnLayoutData";
import FlexibleColumnLayoutDataForDesktop from "sap/f/FlexibleColumnLayoutDataForDesktop";
import DynamicPage from "sap/f/DynamicPage";
import DynamicPageTitle from "sap/f/DynamicPageTitle";
import DynamicPageHeader from "sap/f/DynamicPageHeader";
import DragDropInfo from "sap/ui/core/dnd/DragDropInfo";
import Event from "sap/ui/base/Event";
import ObjectPageHeader from "sap/uxap/ObjectPageHeader";
import MenuButton from "sap/m/MenuButton";
import Menu from "sap/m/Menu";
import MenuItem from "sap/m/MenuItem";
import {
  createSeed,
  storageKey,
  uid,
  today,
  dataTypes,
  dimensions,
  validateStore,
  validateContext,
  validateDefinition,
  resolveDefinition,
  latestDefinitions,
  definitionUsage,
  contextReferences,
  copyContext,
  publishDefinition,
  validateValue
} from "../model/configuration";
import type {
  ConfigurationStore,
  ConfigurationContext,
  ConfigurationProfile,
  FeatureGroup,
  FeatureFamily,
  FeatureDefinition,
  FeatureReference,
  ProductModel,
  FeatureValue,
  Named
} from "../model/configuration";

type Field = {
  key: string;
  label: string;
  value: string | number | boolean;
  options?: string[];
  required?: boolean;
  multiline?: boolean;
  numeric?: boolean;
  valueHelp?: (setValue: (value: string) => void) => void;
};
type Values = Record<string, string | number | boolean>;
type Selection = { kind: "group" | "family" | "feature"; id: string };
type TreeNode = {
  id: string;
  kind: string;
  name: string;
  code: string;
  dimension: string;
  type: string;
  source: string;
  icon: string;
  children: TreeNode[];
};
const rawI18nKeys: Record<string, string> = {
  "Configuration Contexts": "cmContexts",
  "Configuration Context": "cmConfigurationContext",
  "Feature Model": "cmFeatureModel",
  "Product Scope": "cmProductScope",
  "Configuration Profile": "cmConfigurationProfile",
  "产品配置管理 · Product Configuration Management": "cmProductConfigurationManagement",
  "Enterprise Feature Library · 企业特征库": "cmEnterpriseFeatureLibraryTitle",
  "Enterprise Feature Library": "cmEnterpriseFeatureLibrary",
  配置边界: "cmConfigurationBoundary",
  建模进度: "cmModelingProgress",
  产品族结构: "cmProductFamilyStructure",
  "产品族 / 产品型号": "cmProductFamilyProducts",
  产品类型: "cmProductType",
  市场: "cmMarket",
  生命周期: "cmLifecycle",
  描述: "cmDescription",
  Organization: "cmOrganization",
  "Created By": "cmCreatedBy",
  "Created Date": "cmCreatedDate",
  "Last Modified": "cmLastModified",
  "Profile Name": "cmProfileName",
  "Profile Code": "cmProfileCode",
  "Configuration Mode": "cmConfigurationMode",
  "Feature Source": "cmFeatureSource",
  "Feature Structure": "cmFeatureStructure",
  "Default Behavior": "cmDefaultBehavior",
  "Allow Multi Select": "cmAllowMulti",
  "Allow Numeric Range": "cmAllowRange",
  "Allow Free Text": "cmAllowText",
  "Group / Family / Feature": "cmGroupFamilyFeature",
  "Search Feature Model": "cmSearchFeatureModel",
  "All Dimensions": "cmAllDimensions",
  Properties: "cmProperties",
  Overview: "cmOverview",
  General: "cmGeneral",
  Values: "cmValues",
  Usage: "cmUsage",
  Version: "cmVersion",
  Rules: "cmRules",
  "Business Question": "cmBusinessQuestion",
  "Value Domain": "cmValueDomain",
  "Value Code": "cmValueCode",
  "Display Value": "cmDisplayValue",
  Sequence: "cmSequence",
  Default: "cmDefault",
  Active: "cmActive",
  Dimension: "cmDimension",
  "Data Type": "cmDataType",
  "Selection Type": "cmSelectionType",
  Mandatory: "cmMandatory",
  "Default Value": "cmDefaultValue",
  Unit: "cmUnit",
  Source: "cmSource",
  "Min / Max Selection": "cmMinMaxSelection",
  "Sort Order": "cmSortOrder",
  Add: "cmAdd",
  "Add Group": "cmAddGroup",
  "Add Family": "cmAddFamily",
  "Add Feature": "cmAddFeature",
  "Reuse Feature": "cmReuseFeature",
  删除: "cmDelete",
  复制: "cmCopy",
  移动: "cmMove",
  编辑: "cmEdit",
  新建: "cmNew",
  保存: "cmSave",
  取消: "cmCancel",
  重置: "cmReset",
  发布: "cmRelease",
  停用: "cmDeactivate",
  "Preview Configuration": "cmPreviewConfiguration",
  "Create Local Feature": "cmCreateLocalFeature",
  "Reuse Existing Feature": "cmReuseExistingFeature",
  "Add Reference": "cmAddReference",
  "Search Enterprise Feature Library": "cmSearchEnterpriseFeatureLibrary",
  Draft: "cmDraft",
  Released: "cmReleased",
  Inactive: "cmInactive",
  "Read Only": "cmReadOnly",
  Editable: "cmEditable",
  Marketing: "cmMarketing",
  Engineering: "cmEngineering",
  Common: "cmCommon",
  Local: "cmLocal",
  "Enterprise Library": "cmEnterpriseLibrary",
  Single: "cmSingle",
  Multiple: "cmMultiple",
  "Value Input": "cmValueInput",
  Choice: "cmChoice",
  Characteristic: "cmCharacteristic",
  Enumeration: "cmEnumeration",
  "Multi Enumeration": "cmMultiEnumeration",
  Boolean: "cmBoolean",
  String: "cmString",
  Integer: "cmInteger",
  Decimal: "cmDecimal",
  Date: "cmDate",
  DateTime: "cmDateTime",
  Range: "cmRange",
  Reference: "cmReference",
  "Single Selection": "cmSingleSelection",
  "Multi Selection": "cmMultiSelection",
  "Boolean Selection": "cmBooleanSelection",
  "Range Input": "cmRangeInput",
  "Free Input": "cmFreeInput",
  Yes: "cmYes",
  No: "cmNo",
  Automotive: "cmAutomotive",
  Bicycle: "cmBicycle",
  "Industrial Equipment": "cmIndustrialEquipment",
  "All Categories": "cmAllCategories",
  "All Statuses": "cmAllStatuses",
  Category: "cmCategory",
  "Value Help": "cmValueHelp",
  "Category Library": "cmCategoryLibrary",
  "Search Category": "cmSearchCategory",
  Select: "cmSelect",
  "Please select a category": "cmPleaseSelectCategory",
  Status: "cmStatus",
  "Product Configuration Context": "cmConfigurationContext",
  "Product Model Group": "cmProductModelGroup",
  "Product Model": "cmProductModel",
  "Product Family": "cmProductFamily",
  "In Development": "cmInDevelopment",
  "Mixed Configuration": "cmMixedConfiguration",
  Mixed: "cmMixed",
  Hierarchical: "cmHierarchical",
  "Allow Default Value": "cmAllowDefaultValue",
  Group: "cmGroup",
  Family: "cmFamily",
  Feature: "cmFeature",
  "Data Type / Selection Type": "cmDataTypeSelection",
  导入: "cmImport",
  导出: "cmExport",
  编辑产品族: "cmEditProductFamily",
  添加产品: "cmAddProduct",
  移除: "cmRemove",
  "产品范围 / Context": "cmContextTab",
  "特征模型 / Feature Model": "cmFeatureModelTab",
  "Rules are managed in the next configuration modeling stage.": "cmRulesNext"
};
let activeI18nModel: ResourceModel | undefined;
let activeI18nBundle: { getText?: (resourceKey: string) => string | undefined } | undefined;
const tr = (text: string): string => {
  const key = rawI18nKeys[text];
  if (!key) return text;
  try {
    return activeI18nBundle?.getText?.(key) ?? text;
  } catch {
    return text;
  }
};
const txt = (text: string): Text => new Text({ text: tr(text), wrapping: true });
const button = (text: string, press: () => void, icon?: string): Button =>
  new Button({ text: tr(text), icon, press, type: "Transparent" });
const title = (text: string): Title => new Title({ text: tr(text), level: "H3" });
const grow = (control: Control): Control =>
  control.setLayoutData(new FlexItemData({ growFactor: 1, shrinkFactor: 1, baseSize: "0%" }));
const select = (options: string[], value: string, change?: (value: string) => void): Select =>
  new Select({
    width: "100%",
    selectedKey: value,
    items: options.map((o) => new Item({ key: o, text: tr(o) })),
    change: (e) => change?.(e.getSource().getSelectedKey())
  });
const status = (text: string): ObjectStatus =>
  new ObjectStatus({
    text: tr(text),
    state: text === "Released" ? "Success" : text === "Draft" ? "Information" : "None"
  });
const form = (pairs: [string, string | Control][]): SimpleForm =>
  new SimpleForm({
    editable: false,
    layout: "ResponsiveGridLayout",
    columnsL: 2,
    columnsM: 2,
    labelSpanL: 3,
    labelSpanM: 3,
    content: pairs.flatMap(([label, value]) => [
      new Label({ text: tr(label) }),
      typeof value === "string" ? txt(value || "—") : value
    ])
  });

export default class ConfigurationController extends BaseController {
  private store!: ConfigurationStore;
  private contextId = "ctx-SUV";
  private mode: "context" | "features" = "context";
  private libraryMode = false;
  private selection?: Selection;
  private selectedProduct?: string;
  private selectedLibrary?: string;
  private contextList?: Tree;
  private readonly selectedContextIds = new Set<string>();
  private syncingContextSelection = false;
  private contextSearch = "";
  private category = "All Categories";
  private contextStatus = "All Statuses";
  private treeSearch = "";
  private dimensionFilter = "All Dimensions";
  private tree?: TreeTable;
  private editor?: VBox;
  private inspector?: VBox;
  private librarySearch = "";
  private libraryTable?: Table;
  private libraryDetail?: VBox;
  private editorTab = "general";
  private profileOpen = false;

  public onInit(): void {
    sap.ui.getCore().attachLocalizationChanged(this.onLocalizationChanged, this);
    activeI18nModel = this.getModel<ResourceModel>("i18n");
    const bundle = activeI18nModel?.getResourceBundle();
    if (bundle instanceof Promise)
      void bundle.then((loaded) => {
        activeI18nBundle = loaded;
        this.render();
      });
    else
      activeI18nBundle = bundle as
        { getText?: (resourceKey: string) => string | undefined } | undefined;
    this.store = createSeed();
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as ConfigurationStore;
        if (validateStore(parsed).length) throw new Error();
        this.store = parsed;
      } catch {
        MessageBox.warning(
          "本地建模数据无法读取，已打开示例工作区。原始数据未覆盖；可通过导入恢复有效备份。"
        );
      }
    }
    this.getRouter().getRoute("configuration")?.attachPatternMatched(this.openContext, this);
    this.getRouter().getRoute("featureLibrary")?.attachPatternMatched(this.openLibrary, this);
    // ResourceModel may finish its locale bundle just after the controller is created.
    window.setTimeout(() => this.onLocalizationChanged(), 300);
  }
  public onExit(): void {
    sap.ui.getCore().detachLocalizationChanged(this.onLocalizationChanged, this);
    this.getRouter().getRoute("configuration")?.detachPatternMatched(this.openContext, this);
    this.getRouter().getRoute("featureLibrary")?.detachPatternMatched(this.openLibrary, this);
  }
  private onLocalizationChanged(): void {
    const bundle = activeI18nModel?.getResourceBundle();
    if (bundle instanceof Promise)
      void bundle.then((loaded) => {
        activeI18nBundle = loaded;
        this.render();
      });
    else {
      activeI18nBundle = bundle as
        { getText?: (resourceKey: string) => string | undefined } | undefined;
      this.render();
    }
  }
  private openContext(): void {
    this.libraryMode = false;
    this.render();
  }
  private openLibrary(): void {
    this.libraryMode = true;
    this.render();
  }
  private currentContext(): ConfigurationContext {
    return this.store.contexts.find((c) => c.id === this.contextId) ?? this.store.contexts[0];
  }
  private currentProfile(): ConfigurationProfile {
    return this.store.profiles.find((p) => p.id === this.currentContext().profileId)!;
  }
  private canEdit(): boolean {
    if (this.currentContext().status === "Draft") return true;
    MessageBox.information(
      "当前上下文为只读状态。请先创建新的草稿版本，再修改产品范围或特征模型。"
    );
    return false;
  }
  private commit(
    change: (next: ConfigurationStore) => void,
    message = "已保存到本地建模工作区"
  ): boolean {
    try {
      const next = structuredClone(this.store);
      change(next);
      const errors = validateStore(next);
      if (errors.length) {
        MessageBox.error(errors.slice(0, 12).join("\n"));
        return false;
      }
      const context = next.contexts.find((c) => c.id === this.contextId);
      if (context && !this.libraryMode) context.modified = today();
      localStorage.setItem(storageKey, JSON.stringify(next));
      this.store = next;
      this.render();
      MessageToast.show(message);
      return true;
    } catch (error) {
      MessageBox.error(
        `保存失败，修改尚未应用：${error instanceof Error ? error.message : String(error)}`
      );
      return false;
    }
  }
  private render(): void {
    this.contextId = this.currentContext().id;
    const root = this.byId("workspace") as VBox;
    root.destroyItems();
    root.addItem(
      new Toolbar({
        content: [
          title(
            this.libraryMode
              ? "企业特征库 · Enterprise Feature Library"
              : "产品配置管理 · Product Configuration Management"
          ),
          new ToolbarSpacer(),
          status("本地建模工作区"),
          button("导入", () => this.importWorkspace(), "sap-icon://upload"),
          button("导出", () => this.exportWorkspace(), "sap-icon://download")
        ]
      }).addStyleClass("cmTopbar")
    );
    if (this.libraryMode) {
      this.renderLibrary(root);
      return;
    }
    const begin = new Page({
      showHeader: false,
      enableScrolling: false,
      content: [this.buildContextList()]
    });
    const mid = new Page({
      showHeader: false,
      enableScrolling: false,
      content: [this.buildContextWorkspace()]
    });
    const layout = new FlexibleColumnLayout({
      layout: "TwoColumnsMidExpanded",
      beginColumnPages: [begin],
      midColumnPages: [mid]
    });
    layout.setLayoutData(
      new FlexibleColumnLayoutData({
        desktopLayoutData: new FlexibleColumnLayoutDataForDesktop({
          twoColumnsMidExpanded: "23/77/0"
        })
      })
    );
    root.addItem(
      grow(
        new VBox({ height: "100%", fitContainer: true, items: [layout] }).addStyleClass(
          "cmLayoutHost"
        )
      )
    );
  }
  private buildContextList(): VBox {
    this.contextList = new Tree({
      width: "100%",
      mode: "MultiSelect",
      includeItemInSelection: false,
      rememberSelections: true,
      selectionChange: (e) => this.onContextSelection(e),
      itemPress: (e) => this.openContextFromItem(e.getParameter("listItem") as Control | undefined),
      toggleOpenState: () => window.setTimeout(() => this.syncContextSelection(), 0)
    });
    this.contextList.addDragDropConfig(
      new DragDropInfo({
        sourceAggregation: "items",
        targetAggregation: "items",
        dropPosition: "Between",
        drop: (e) => this.onContextDrop(e)
      })
    );
    this.populateContextList();
    return new VBox({
      height: "100%",
      fitContainer: true,
      items: [
        new Toolbar({
          content: [
            title("Configuration Contexts"),
            new ToolbarSpacer(),
            button("新建", () => this.editContext(true), "sap-icon://add")
          ]
        }),
        new SearchField({
          value: this.contextSearch,
          placeholder: "搜索名称 / 编码 / 产品族",
          liveChange: (e) => {
            this.contextSearch = e.getParameter("newValue") ?? "";
            this.populateContextList();
          }
        }).addStyleClass("sapUiTinyMargin"),
        new HBox({
          items: [
            grow(
              select(
                [
                  "All Categories",
                  "Automotive",
                  "Bicycle",
                  "Aircraft",
                  "High-speed Rail",
                  "Industrial Equipment",
                  "HVAC",
                  "Automation"
                ],
                this.category,
                (v) => {
                  this.category = v;
                  this.populateContextList();
                }
              )
            ),
            grow(
              select(["All Statuses", "Draft", "Released", "Inactive"], this.contextStatus, (v) => {
                this.contextStatus = v;
                this.populateContextList();
              })
            )
          ]
        }).addStyleClass("cmFilterRow"),
        grow(this.contextList),
        new Toolbar({
          content: [
            txt(`${this.store.contexts.length} 个上下文`),
            new ToolbarSpacer(),
            txt("Product Scope")
          ]
        })
      ]
    }).addStyleClass("cmContextList");
  }
  private populateContextList(): void {
    const tree = this.contextList!;
    const matches = this.store.contexts.filter(
      (c) =>
        (this.category === "All Categories" || c.category === this.category) &&
        (this.contextStatus === "All Statuses" || c.status === this.contextStatus) &&
        `${c.name} ${c.code}`.toLowerCase().includes(this.contextSearch.toLowerCase())
    );
    const rows = [
      "Automotive",
      "Bicycle",
      "Aircraft",
      "High-speed Rail",
      "Industrial Equipment",
      "HVAC",
      "Automation"
    ].flatMap((category) => {
      const contexts = matches.filter((c) => c.category === category);
      if (!contexts.length) return [];
      return [
        {
          kind: "category",
          id: `category-${category}`,
          name: tr(category),
          code: `${contexts.length}`,
          nodeText: `${tr(category)} (${contexts.length})`,
          icon: "sap-icon://folder-blank",
          statusText: "",
          statusState: "None",
          children: contexts.map((c) => ({
            kind: "context",
            id: c.id,
            name: c.name,
            code: `${c.code} · V${String(c.version).padStart(2, "0")}`,
            nodeText: `${c.name} · ${c.code} · V${String(c.version).padStart(2, "0")}`,
            icon: "sap-icon://product",
            statusText: tr(c.status),
            statusState:
              c.status === "Released" ? "Success" : c.status === "Draft" ? "Information" : "None",
            children: []
          }))
        }
      ];
    });
    tree.setModel(new JSONModel({ rows }));
    tree.bindItems({
      path: "/rows",
      parameters: { arrayNames: ["children"], numberOfExpandedLevels: 2 },
      template: new StandardTreeItem({
        title: "{nodeText}",
        icon: "{icon}",
        type: "Active",
        press: (e) => this.openContextFromItem(e.getSource() as Control)
      })
    });
    window.setTimeout(() => this.syncContextSelection(), 0);
  }
  private syncContextSelection(): void {
    if (!this.contextList || this.syncingContextSelection) return;
    this.syncingContextSelection = true;
    try {
      this.contextList.getItems().forEach((item) => {
        const context = item.getBindingContext();
        if (!context) return;
        const kind = context.getProperty("kind") as string;
        if (kind === "context") {
          this.contextList!.setSelectedItem(
            item,
            this.selectedContextIds.has(context.getProperty("id") as string),
            false
          );
        } else if (kind === "category") {
          const children = (context.getProperty("children") as { id: string }[] | undefined) ?? [];
          const allSelected =
            children.length > 0 && children.every((child) => this.selectedContextIds.has(child.id));
          this.contextList!.setSelectedItem(item, allSelected, false);
        }
      });
    } finally {
      this.syncingContextSelection = false;
    }
  }
  private onContextSelection(event: Event): void {
    if (this.syncingContextSelection) return;
    const tree = this.contextList;
    if (!tree) return;
    const parameters = event.getParameters() as { listItem?: Control; selected?: boolean };
    const item = parameters.listItem;
    if (!item) return;
    const selected = Boolean(parameters.selected);
    const context = item.getBindingContext();
    if (!context) return;
    if (context.getProperty("kind") === "category") {
      const childIds = (
        (context.getProperty("children") as { id: string }[] | undefined) ?? []
      ).map((child) => child.id);
      tree.getItems().forEach((child) => {
        const id = child.getBindingContext()?.getProperty("id") as string | undefined;
        if (!id || !childIds.includes(id)) return;
        if (selected) this.selectedContextIds.add(id);
        else this.selectedContextIds.delete(id);
      });
    } else {
      const id = context.getProperty("id") as string;
      if (selected) this.selectedContextIds.add(id);
      else this.selectedContextIds.delete(id);
    }
    this.syncContextSelection();
  }
  private openContextFromItem(item?: Control): void {
    const context = item?.getBindingContext();
    if (!context || context.getProperty("kind") !== "context") return;
    this.contextId = context.getProperty("id") as string;
    this.selection = undefined;
    this.selectedProduct = undefined;
    this.render();
  }
  private onContextDragStart(event: Event): void {
    const parameters = event.getParameters() as {
      dragSession?: { getDragControl: () => StandardTreeItem | null };
    };
    const item = parameters.dragSession?.getDragControl();
    if (item?.getBindingContext()?.getProperty("kind") !== "context") event.preventDefault();
  }
  private onContextDrop(event: Event): void {
    const parameters = event.getParameters() as {
      dragSession?: { getDragControl: () => StandardTreeItem | null };
      droppedControl?: StandardTreeItem;
    };
    const source = parameters.dragSession
      ?.getDragControl()
      ?.getBindingContext()
      ?.getProperty("id") as string | undefined;
    const target = parameters.droppedControl?.getBindingContext()?.getProperty("id") as
      string | undefined;
    if (!source || !target || source === target) return;
    const from = this.store.contexts.findIndex((c) => c.id === source);
    const to = this.store.contexts.findIndex((c) => c.id === target);
    if (from < 0 || to < 0) return;
    this.commit((next) => {
      const [moved] = next.contexts.splice(from, 1);
      next.contexts.splice(to, 0, moved);
    }, "Context 顺序已更新");
  }
  private buildContextWorkspace(): Control {
    const c = this.currentContext();
    const heading = new VBox({
      items: [
        new Title({ text: c.name, level: "H2" }),
        txt(
          `${c.code} · ${this.store.productFamilies.find((f) => f.id === c.productFamilyId)?.name ?? ""} · V${String(c.version).padStart(2, "0")} · ${c.status}`
        )
      ]
    });
    const titleActions = [
      button("编辑", () => this.editContext(false), "sap-icon://edit"),
      button("复制", () => this.duplicateContext(), "sap-icon://copy"),
      button("版本", () => this.contextVersions(), "sap-icon://history"),
      button(
        c.status === "Draft" ? "发布" : c.status === "Inactive" ? "恢复草稿" : "新建版本",
        () => this.transitionContext()
      ),
      button("停用", () => this.deactivateContext())
    ];
    const header = new HBox({
      width: "100%",
      items: [
        grow(
          form([
            [
              "Product Family",
              this.store.productFamilies.find((f) => f.id === c.productFamilyId)?.name ?? ""
            ],
            ["Organization", c.organization],
            ["Created By", c.createdBy],
            ["Last Modified", c.modified],
            ["Description", c.description]
          ])
        )
      ]
    }).addStyleClass("cmDynamicHeaderContent cmContextMetadataOnly");
    const contentHost = new VBox({
      height: "100%",
      fitContainer: true,
      items: [grow(this.mode === "context" ? this.buildScope() : this.buildFeatureWorkspace())]
    }).addStyleClass("cmDynamicPageContentHost");
    const tabs = new IconTabBar({
      expandable: false,
      headerMode: "Inline",
      applyContentPadding: false,
      selectedKey: this.mode,
      items: [
        new IconTabFilter({
          key: "context",
          text: tr("产品范围 / Context")
        }),
        new IconTabFilter({
          key: "features",
          text: tr("特征模型 / Feature Model"),
          count: String(contextReferences(this.store, c.id).length)
        })
      ],
      select: (e) => {
        this.mode = e.getParameter("key") as "context" | "features";
        contentHost.destroyItems();
        contentHost.addItem(
          grow(this.mode === "context" ? this.buildScope() : this.buildFeatureWorkspace())
        );
      }
    }).addStyleClass("cmMainTabs");
    const page = new DynamicPage({
      fitContent: false,
      headerExpanded: true,
      toggleHeaderOnTitleClick: this.mode !== "features",
      stickySubheaderProvider: tabs.getId(),
      title: new DynamicPageTitle({ heading, actions: titleActions }),
      header: new DynamicPageHeader({ pinnable: true, content: [header] }),
      content: new VBox({
        height: "100%",
        fitContainer: true,
        items: [tabs, contentHost]
      }).addStyleClass("cmDynamicPageContent")
    }).addStyleClass("cmWorkspace cmContextDynamicPage sapUiNoContentPadding");
    return page;
  }
  private buildScope(): Control {
    const c = this.currentContext(),
      pf = this.store.productFamilies.find((f) => f.id === c.productFamilyId)!;
    const rows: {
      name: string;
      code: string;
      type: string;
      market: string;
      status: string;
      id?: string;
      children?: unknown[];
    }[] = [];
    const products = this.store.products.filter((p) => p.familyId === pf.id);
    for (const group of [...new Set(products.map((p) => p.group || "Ungrouped"))]) {
      rows.push({
        name: group,
        code: "",
        type: "Product Model Group",
        market: "",
        status: "",
        children: products
          .filter((p) => (p.group || "Ungrouped") === group)
          .map((p) => ({ ...p, type: p.productType, children: [] }))
      });
    }
    const tree = new TreeTable({
      width: "100%",
      rowMode: new Fixed({ rowCount: 14, rowContentHeight: 40 }),
      selectionMode: "Single",
      selectionBehavior: "RowOnly",
      enableSelectAll: false,
      columns: [
        new TreeColumn({
          label: new Label({ text: tr("产品族 / 产品型号") }),
          template: new ObjectIdentifier({ title: "{name}", text: "{code}" }),
          width: "32%",
          showSortMenuEntry: true,
          showFilterMenuEntry: true
        }),
        ...[
          ["type", "产品类型"],
          ["market", "市场"],
          ["status", "生命周期"],
          ["description", "描述"]
        ].map(
          ([key, label]) =>
            new TreeColumn({
              label: new Label({ text: label }),
              template: txt(`{${key}}`),
              width: key === "description" ? "28%" : "13%",
              showSortMenuEntry: true,
              showFilterMenuEntry: true
            })
        )
      ],
      rowSelectionChange: (e) => {
        this.selectedProduct = e.getParameter("rowContext")?.getProperty("id") as
          string | undefined;
      }
    });
    tree.setModel(
      new JSONModel({
        rows: [
          {
            name: pf.name,
            code: pf.code,
            type: "Product Family",
            market: "",
            status: "",
            children: rows
          }
        ]
      })
    );
    tree.bindRows({ path: "/rows", parameters: { arrayNames: ["children"] } });
    tree.expandToLevel(3);
    const profile = this.currentProfile();
    const treeWorkArea = new VBox({
      height: "100%",
      fitContainer: true,
      items: [
        new Toolbar({
          content: [
            title(`产品族结构 (${products.length})`),
            new ToolbarSpacer(),
            button("编辑产品族", () => this.editProductFamily()),
            button("添加产品", () => this.editProduct(), "sap-icon://add"),
            button("编辑", () => this.editProduct(this.selectedProduct), "sap-icon://edit"),
            button("移除", () => this.removeProduct(), "sap-icon://delete")
          ]
        }),
        grow(tree),
        new Toolbar({
          content: [
            title("Configuration Profile"),
            status(profile.configurationMode),
            txt(`${profile.featureSourceMode} · ${profile.featureStructureMode}`),
            new ToolbarSpacer(),
            button(
              "查看 Profile",
              () => {
                this.profileOpen = true;
                this.render();
              },
              "sap-icon://inspect"
            )
          ]
        })
      ]
    }).addStyleClass("cmScopeContent");
    const profilePanel = this.profileOpen
      ? new VBox({
          width: "24rem",
          height: "100%",
          fitContainer: true,
          items: [
            new Toolbar({
              content: [
                title("Configuration Profile"),
                new ToolbarSpacer(),
                button(
                  "",
                  () => {
                    this.profileOpen = false;
                    this.render();
                  },
                  "sap-icon://decline"
                )
              ]
            }),
            form([
              ["Profile Name", profile.name],
              ["Profile Code", profile.code],
              ["配置维度", profile.configurationMode],
              ["特征来源", profile.featureSourceMode],
              ["Feature Structure", profile.featureStructureMode],
              ["Default Behavior", profile.defaultBehavior]
            ]),
            new Toolbar({
              content: [
                new Button({
                  text: "编辑 Profile",
                  type: "Emphasized",
                  press: () => this.editProfile()
                })
              ]
            })
          ]
        }).addStyleClass("cmProfileInspector")
      : undefined;
    return new HBox({
      height: "100%",
      fitContainer: true,
      items: [grow(treeWorkArea), ...(profilePanel ? [profilePanel] : [])]
    }).addStyleClass("cmScopeLayout");
  }
  private editDialog(
    name: string,
    fields: Field[],
    save: (values: Values) => boolean,
    extra?: Control
  ): void {
    const getters = new Map<string, () => string | number | boolean>();
    const inputs: { field: Field; control: Input | TextArea }[] = [];
    const content: Control[] = [];
    fields.forEach((field) => {
      let control: Control;
      if (field.options) {
        const input = select(field.options, String(field.value));
        control = input;
        getters.set(field.key, () => input.getSelectedKey());
      } else if (typeof field.value === "boolean") {
        const input = new CheckBox({ selected: field.value, text: tr("Yes") });
        control = input;
        getters.set(field.key, () => input.getSelected());
      } else if (field.valueHelp) {
        const input = new Input({
          value: String(field.value),
          width: "100%",
          showValueHelp: true,
          valueHelpOnly: false,
          valueHelpRequest: () => field.valueHelp?.((value) => input.setValue(value))
        });
        control = input;
        inputs.push({ field, control: input });
        getters.set(field.key, () => input.getValue().trim());
      } else {
        const input = field.multiline
          ? new TextArea({ value: String(field.value), rows: 3, width: "100%" })
          : new Input({
              value: String(field.value),
              width: "100%",
              type: field.numeric ? "Number" : "Text"
            });
        control = input;
        inputs.push({ field, control: input });
        getters.set(field.key, () =>
          field.numeric ? Number(input.getValue()) : input.getValue().trim()
        );
        input.attachEvent("liveChange", () =>
          input.setValueState(field.required && !input.getValue().trim() ? "Error" : "None")
        );
      }
      content.push(new Label({ text: tr(field.label), required: field.required }), control);
    });
    const dialog: Dialog = new Dialog({
      title: name,
      contentWidth: "46rem",
      draggable: true,
      resizable: true,
      content: [
        new SimpleForm({
          editable: true,
          layout: "ResponsiveGridLayout",
          columnsL: 1,
          columnsM: 1,
          labelSpanL: 2,
          labelSpanM: 3,
          content
        }),
        ...(extra ? [extra] : [])
      ],
      beginButton: new Button({
        text: "保存",
        type: "Emphasized",
        press: () => {
          let valid = true;
          inputs.forEach(({ field, control }) => {
            const invalid =
              (field.required && !control.getValue().trim()) ||
              (field.numeric &&
                (!control.getValue().trim() || !Number.isFinite(Number(control.getValue()))));
            control.setValueState(invalid ? "Error" : "None");
            if (invalid) valid = false;
          });
          if (!valid) {
            MessageToast.show("请检查必填项与数字格式");
            return;
          }
          const values = Object.fromEntries([...getters].map(([key, get]) => [key, get()]));
          if (save(values)) dialog.close();
        }
      }),
      endButton: button("取消", () => dialog.close()),
      afterClose: () => dialog.destroy()
    });
    this.getView()?.addDependent(dialog);
    dialog.addStyleClass("sapUiSizeCompact cmEditDialog");
    dialog.open();
  }
  private namedFields(record: Named): Field[] {
    return [
      { key: "name", label: "Name / 名称", value: record.name, required: true },
      { key: "code", label: "Code / 编码", value: record.code, required: true },
      {
        key: "description",
        label: "Description / 描述",
        value: record.description,
        multiline: true
      }
    ];
  }
  private openCategoryValueHelp(setValue: (value: string) => void): void {
    const categories = [
      {
        code: "Transportation",
        name: "交通工具",
        description: "Transportation product families",
        children: [
          { code: "Automotive", name: "汽车", description: "Automotive product families" },
          { code: "Bicycle", name: "自行车", description: "Bicycle product families" },
          { code: "Aircraft", name: "飞机", description: "Aircraft product families" },
          {
            code: "High-speed Rail",
            name: "高铁",
            description: "High-speed rail product families"
          },
          { code: "Marine", name: "船舶", description: "Marine product families" }
        ]
      },
      {
        code: "Industrial Equipment",
        name: "工业设备",
        description: "Industrial equipment product families",
        children: [
          {
            code: "Industrial Equipment",
            name: "工业设备（通用）",
            description: "General industrial equipment product families"
          },
          { code: "HVAC", name: "暖通空调", description: "HVAC product families" },
          {
            code: "Automation",
            name: "自动化设备",
            description: "Industrial automation product families"
          },
          {
            code: "Energy Equipment",
            name: "能源设备",
            description: "Energy equipment product families"
          }
        ]
      },
      {
        code: "Electronics",
        name: "电子产品",
        description: "Electronics product families",
        children: [
          {
            code: "Consumer Electronics",
            name: "消费电子",
            description: "Consumer electronics product families"
          },
          {
            code: "Industrial Electronics",
            name: "工业电子",
            description: "Industrial electronics product families"
          }
        ]
      },
      {
        code: "Medical Equipment",
        name: "医疗设备",
        description: "Medical equipment product families",
        children: [
          {
            code: "Diagnostic Equipment",
            name: "诊断设备",
            description: "Diagnostic equipment product families"
          },
          {
            code: "Surgical Equipment",
            name: "手术设备",
            description: "Surgical equipment product families"
          }
        ]
      },
      {
        code: "Construction Equipment",
        name: "工程设备",
        description: "Construction equipment product families",
        children: [
          {
            code: "Earthmoving Equipment",
            name: "土方设备",
            description: "Earthmoving equipment product families"
          },
          {
            code: "Lifting Equipment",
            name: "起重设备",
            description: "Lifting equipment product families"
          }
        ]
      }
    ];
    let selected: string | undefined;
    let rootFilter = "All Categories";
    const tree = new TreeTable({
      width: "100%",
      selectionMode: "Single",
      selectionBehavior: "RowOnly",
      enableSelectAll: false,
      rowMode: new Auto({ minRowCount: 5, rowContentHeight: 34 }),
      columns: [
        new TreeColumn({
          label: new Label({ text: "Code" }),
          template: txt("{code}"),
          width: "20%",
          showSortMenuEntry: true,
          showFilterMenuEntry: true
        }),
        new TreeColumn({
          label: new Label({ text: "Category" }),
          template: txt("{name}"),
          width: "30%",
          showSortMenuEntry: true,
          showFilterMenuEntry: true
        }),
        new TreeColumn({
          label: new Label({ text: "Description" }),
          template: txt("{description}"),
          width: "50%",
          showSortMenuEntry: true,
          showFilterMenuEntry: true
        })
      ],
      rowSelectionChange: (e) => {
        const row = e.getParameter("rowContext");
        if (!row) return;
        selected = row.getProperty("level") === 0 ? undefined : (row.getProperty("code") as string);
      }
    });
    const fill = (search = ""): void => {
      const normalized = search.toLowerCase();
      const rows = categories.flatMap((category) => {
        if (rootFilter !== "All Categories" && category.code !== rootFilter) return [];
        const categoryMatch = `${category.code} ${category.name} ${category.description}`
          .toLowerCase()
          .includes(normalized);
        const children = category.children.filter(
          (child) =>
            categoryMatch ||
            `${child.code} ${child.name} ${child.description}`.toLowerCase().includes(normalized)
        );
        if (!categoryMatch && !children.length) return [];
        return [
          {
            kind: "category",
            level: 0,
            rootCode: category.code,
            code: category.code,
            name: category.name,
            description: category.description,
            children: children.map((child) => ({
              kind: "category",
              level: 1,
              rootCode: category.code,
              code: child.code,
              name: child.name,
              description: child.description,
              children: []
            }))
          }
        ];
      });
      tree.setModel(new JSONModel({ rows }));
      tree.bindRows({
        path: "/rows",
        parameters: { arrayNames: ["children"], numberOfExpandedLevels: 2 }
      });
      tree.expandToLevel(2);
    };
    fill();
    const filterPanel = new HBox({
      visible: false,
      alignItems: "Center",
      items: [
        new Label({ text: "分类范围" }).addStyleClass("sapUiTinyMarginBegin"),
        select(
          ["All Categories", ...categories.map((category) => category.code)],
          rootFilter,
          (value) => {
            rootFilter = value;
            fill();
          }
        )
      ]
    }).addStyleClass("cmValueHelpFilterBar");
    const search = new SearchField({
      width: "34rem",
      placeholder: tr("Search Category"),
      liveChange: (e) => fill(e.getParameter("newValue") ?? ""),
      search: (e) => fill(e.getParameter("query") ?? "")
    });
    const categoryToolbar = new Toolbar({
      content: [
        search,
        new Button({ text: "执行", type: "Emphasized", press: () => fill(search.getValue()) }),
        new ToolbarSpacer(),
        button("显示过滤器", () => filterPanel.setVisible(!filterPanel.getVisible())),
        button(
          "",
          () => this.openCategoryColumnSettings(tree),
          "sap-icon://action-settings"
        ).setTooltip("列设置")
      ]
    });
    const categorySummary = new Toolbar({
      content: [
        txt("Category Library"),
        new ToolbarSpacer(),
        txt(`${categories.length} categories`)
      ]
    });
    const dialogBody = new VBox({
      height: "100%",
      fitContainer: true,
      items: [categoryToolbar, filterPanel, categorySummary, grow(tree)]
    }).addStyleClass("cmValueHelpBody");
    const dialog: Dialog = new Dialog({
      title: tr("Category Library"),
      contentWidth: "54rem",
      contentHeight: "34rem",
      draggable: true,
      resizable: true,
      verticalScrolling: false,
      content: [dialogBody],
      beginButton: new Button({
        text: tr("Select"),
        type: "Emphasized",
        press: () => {
          if (!selected) {
            MessageToast.show(tr("Please select a category"));
            return;
          }
          setValue(selected);
          dialog.close();
        }
      }),
      endButton: button("取消", () => dialog.close()),
      afterClose: () => dialog.destroy()
    });
    this.getView()?.addDependent(dialog);
    dialog.setDraggable(true).setResizable(true);
    dialog.addStyleClass("sapUiSizeCompact cmValueHelpDialog");
    dialog.open();
  }
  private openCategoryColumnSettings(tree: TreeTable): void {
    const labels = ["Code", "Category", "Description"];
    const checks = tree
      .getColumns()
      .map((column, index) => new CheckBox({ text: labels[index], selected: column.getVisible() }));
    const dialog = new Dialog({
      title: "列设置",
      contentWidth: "20rem",
      draggable: true,
      resizable: true,
      content: [new VBox({ items: checks }).addStyleClass("sapUiSmallMargin")],
      beginButton: new Button({
        text: tr("Select"),
        type: "Emphasized",
        press: () => {
          checks.forEach((check, index) =>
            tree.getColumns()[index].setVisible(check.getSelected())
          );
          dialog.close();
        }
      }),
      endButton: button("取消", () => dialog.close()),
      afterClose: () => dialog.destroy()
    });
    this.getView()?.addDependent(dialog);
    dialog.setDraggable(true).setResizable(true);
    dialog.addStyleClass("sapUiSizeCompact");
    dialog.open();
  }
  private editContext(create: boolean): void {
    if (!create && !this.canEdit()) return;
    const c = create
      ? {
          ...this.currentContext(),
          id: uid("ctx"),
          name: "",
          code: "",
          description: "",
          status: "Draft" as const,
          version: 1,
          createdDate: today(),
          modified: today()
        }
      : this.currentContext();
    this.editDialog(
      create ? "新建配置上下文" : "编辑配置上下文",
      [
        ...this.namedFields(c),
        {
          key: "category",
          label: "Category",
          value: c.category,
          valueHelp: (setValue) => this.openCategoryValueHelp(setValue)
        },
        {
          key: "productFamilyName",
          label: "Product Family",
          value: create
            ? ""
            : this.store.productFamilies.find((f) => f.id === c.productFamilyId)!.name,
          required: true
        },
        { key: "owner", label: "Owner", value: c.owner, required: true },
        { key: "organization", label: "Organization", value: c.organization, required: true }
      ],
      (values) =>
        this.commit(
          (s) => {
            if (create) {
              const pfId = uid("pf"),
                profileId = uid("profile");
              s.productFamilies.push({
                id: pfId,
                code: `${values.code}-PF`,
                name: String(values.productFamilyName),
                description: ""
              });
              s.profiles.push({
                ...this.currentProfile(),
                id: profileId,
                code: `${values.code}-PROFILE`,
                name: `${values.name} Profile`
              });
              s.contexts.push({
                ...c,
                ...values,
                productFamilyId: pfId,
                profileId
              } as ConfigurationContext);
            } else {
              Object.assign(
                s.contexts.find((x) => x.id === c.id)!,
                values
              );
              s.productFamilies.find((f) => f.id === c.productFamilyId)!.name = String(
                values.productFamilyName
              );
            }
          },
          create ? "已创建配置上下文，可在列表中选择" : undefined
        )
    );
  }
  private duplicateContext(): void {
    this.editDialog(
      "复制 Context · 企业特征保留引用，本地特征独立复制",
      [
        {
          key: "name",
          label: "新名称",
          value: `${this.currentContext().name} Copy`,
          required: true
        },
        {
          key: "code",
          label: "新编码",
          value: `${this.currentContext().code}-COPY`,
          required: true
        }
      ],
      (v) =>
        this.commit((s) => {
          copyContext(s, this.currentContext().id, String(v.code), String(v.name));
        }, "上下文及其产品范围、Profile、特征模型已复制")
    );
  }
  private deactivateContext(): void {
    MessageBox.confirm(`停用 ${this.currentContext().name}？停用后保留数据并设为只读。`, {
      onClose: (action) => {
        if (action === MessageBox.Action.OK)
          this.commit((s) => {
            s.contexts.find((c) => c.id === this.currentContext().id)!.status = "Inactive";
          });
      }
    });
  }
  private transitionContext(): void {
    const draft = this.currentContext().status === "Draft";
    if (draft) {
      const errors = validateContext(this.store, this.currentContext().id);
      if (errors.length) {
        MessageBox.error(`词汇模型尚未完整：\n${errors.join("\n")}`);
        return;
      }
    }
    MessageBox.confirm(
      draft
        ? "发布当前词汇模型版本？发布后只读，可通过新建版本继续编辑。"
        : "从当前配置范围与词汇模型创建新的草稿版本？",
      {
        onClose: (action) => {
          if (action !== MessageBox.Action.OK) return;
          this.commit((s) => {
            const c = s.contexts.find((x) => x.id === this.currentContext().id)!;
            s.revisions.push({
              contextId: c.id,
              version: c.version,
              date: today(),
              action: draft ? "Released" : "New Draft",
              snapshot: JSON.stringify({
                context: c,
                profile: this.currentProfile(),
                products: s.products.filter((p) => p.familyId === c.productFamilyId),
                groups: s.groups.filter((g) => g.contextId === c.id),
                families: s.families.filter((f) =>
                  s.groups.some((g) => g.contextId === c.id && g.id === f.groupId)
                ),
                references: contextReferences(s, c.id),
                definitions: contextReferences(s, c.id).map((r) => resolveDefinition(s, r))
              })
            });
            c.status = draft ? "Released" : "Draft";
            if (!draft) c.version++;
          });
        }
      }
    );
  }
  private contextVersions(): void {
    const rows = this.store.revisions
      .filter((r) => r.contextId === this.currentContext().id)
      .reverse();
    const dialog = new Dialog({
      title: `${this.currentContext().code} · 版本记录`,
      contentWidth: "42rem",
      content: [
        new MessageStrip({
          text: `当前 V${this.currentContext().version} · ${this.currentContext().status}。发布和新建草稿时保存版本快照。`,
          showIcon: true
        }),
        new List({
          noDataText: "尚无历史版本",
          items: rows.map(
            (r) =>
              new StandardListItem({
                title: `V${r.version} · ${r.action}`,
                description: r.date,
                type: "Active",
                press: () =>
                  this.download(`${this.currentContext().code}-v${r.version}.json`, r.snapshot)
              })
          )
        })
      ],
      endButton: button("关闭", () => dialog.close()),
      afterClose: () => dialog.destroy()
    });
    this.getView()?.addDependent(dialog);
    dialog.setDraggable(true).setResizable(true);
    dialog.open();
  }
  private editProductFamily(): void {
    if (!this.canEdit()) return;
    const pf = this.store.productFamilies.find(
      (f) => f.id === this.currentContext().productFamilyId
    )!;
    this.editDialog("编辑 Product Family", this.namedFields(pf), (v) =>
      this.commit((s) =>
        Object.assign(
          s.productFamilies.find((f) => f.id === pf.id)!,
          v
        )
      )
    );
  }
  private editProduct(id?: string): void {
    if (!this.canEdit()) return;
    const product: ProductModel = this.store.products.find((p) => p.id === id) ?? {
      id: uid("product"),
      familyId: this.currentContext().productFamilyId,
      code: "",
      name: "",
      description: "",
      group: "Global",
      market: "Global",
      productType: "Product Model",
      status: "In Development"
    };
    this.editDialog(
      id ? "编辑产品型号" : "添加产品型号",
      [
        ...this.namedFields(product),
        { key: "group", label: "Product Model Group", value: product.group },
        {
          key: "productType",
          label: "Product Type",
          value: product.productType,
          options: ["Product", "Product Model"]
        },
        { key: "market", label: "Market", value: product.market, required: true },
        {
          key: "status",
          label: "Lifecycle Status",
          value: product.status,
          options: ["In Development", "Released", "Retired"]
        }
      ],
      (v) =>
        this.commit((s) => {
          if (
            s.products.some(
              (p) =>
                p.id !== product.id &&
                p.familyId === product.familyId &&
                p.code.toUpperCase() === String(v.code).toUpperCase()
            )
          )
            throw new Error("同一产品族中产品编码不能重复");
          const existing = s.products.find((p) => p.id === product.id);
          if (existing) Object.assign(existing, v);
          else s.products.push({ ...product, ...v } as ProductModel);
        })
    );
  }
  private removeProduct(): void {
    if (!this.canEdit()) return;
    if (!this.selectedProduct) {
      MessageToast.show("请先选择一个产品型号");
      return;
    }
    MessageBox.confirm("从产品族中移除所选产品？", {
      onClose: (a) => {
        if (a === MessageBox.Action.OK)
          this.commit((s) => {
            s.products = s.products.filter((p) => p.id !== this.selectedProduct);
          });
      }
    });
  }
  private editProfile(): void {
    if (!this.canEdit()) return;
    const p = this.currentProfile();
    this.editDialog(
      "Configuration Profile · 模型行为",
      [
        ...this.namedFields(p),
        {
          key: "configurationMode",
          label: "Configuration Mode",
          value: p.configurationMode,
          options: ["Engineering Configuration", "Sales Configuration", "Mixed Configuration"]
        },
        {
          key: "featureSourceMode",
          label: "Feature Source",
          value: p.featureSourceMode,
          options: ["Local Features", "Enterprise Feature Library", "Mixed"]
        },
        {
          key: "featureStructureMode",
          label: "Feature Structure Mode",
          value: p.featureStructureMode,
          options: ["Hierarchical", "Flat"]
        },
        {
          key: "defaultBehavior",
          label: "Default Selection Behavior",
          value: p.defaultBehavior,
          options: ["No Default", "Allow Default Value", "Auto Select Single Value"]
        },
        { key: "allowMulti", label: "Allow Multi Select", value: p.allowMulti },
        { key: "allowRange", label: "Allow Numeric Range", value: p.allowRange },
        { key: "allowText", label: "Allow Free Text", value: p.allowText }
      ],
      (v) =>
        this.commit((s) =>
          Object.assign(
            s.profiles.find((x) => x.id === p.id)!,
            v
          )
        )
    );
  }
  private buildFeatureWorkspace(): VBox {
    const addMenu = new Menu({
      items: [
        new MenuItem({
          text: tr("Add Group"),
          icon: "sap-icon://folder-blank",
          press: () => this.editGroup()
        }),
        new MenuItem({
          text: tr("Add Family"),
          icon: "sap-icon://question-mark",
          press: () => this.editFamily()
        }),
        new MenuItem({
          text: tr("Add Feature"),
          icon: "sap-icon://action-settings",
          press: () => this.addFeature()
        }),
        new MenuItem({
          text: tr("Reuse Feature"),
          icon: "sap-icon://chain-link",
          press: () => this.reuseFeature()
        })
      ]
    });
    this.tree = new TreeTable({
      width: "100%",
      rowMode: new Fixed({ rowCount: 18, rowContentHeight: 36 }),
      selectionMode: "Single",
      selectionBehavior: "RowOnly",
      enableSelectAll: false,
      columns: [
        new TreeColumn({
          label: new Label({ text: tr("Group / Family / Feature") }),
          template: new HBox({
            alignItems: "Center",
            items: [
              new Icon({ src: "{icon}", size: ".875rem", color: "#5c7081" }).addStyleClass(
                "sapUiTinyMarginEnd"
              ),
              new ObjectIdentifier({ title: "{name}", text: "{type}" })
            ]
          }),
          width: "100%",
          showSortMenuEntry: true,
          showFilterMenuEntry: true
        })
      ],
      rowSelectionChange: (e) => {
        if (e.getParameter("userInteraction") === false) return;
        const row = e.getParameter("rowContext");
        if (!row) return;
        this.selection = {
          id: row.getProperty("id") as string,
          kind: row.getProperty("kind") as Selection["kind"]
        };
        this.editorTab = "general";
        this.renderSelected();
      }
    });
    this.populateTree();
    const treePanel = new VBox({
      width: "21rem",
      height: "100%",
      fitContainer: true,
      items: [
        new Toolbar({
          content: [
            title("Feature Model"),
            new ToolbarSpacer(),
            button("", () => this.tree?.expandToLevel(3), "sap-icon://expand-all").setTooltip(
              "展开全部"
            ),
            button("", () => this.tree?.collapseAll(), "sap-icon://collapse-all").setTooltip(
              "折叠全部"
            )
          ]
        }),
        new SearchField({
          placeholder: tr("Search Feature Model"),
          value: this.treeSearch,
          liveChange: (e) => {
            this.treeSearch = e.getParameter("newValue") ?? "";
            this.populateTree();
          }
        }),
        select(["All Dimensions", ...dimensions], this.dimensionFilter, (v) => {
          this.dimensionFilter = v;
          this.populateTree();
        }),
        grow(this.tree),
        txt("Group › Family › Feature · 链接图标表示企业引用").addStyleClass("cmTreeLegend")
      ]
    }).addStyleClass("cmModelTree");
    this.editor = new VBox({ width: "100%" }).addStyleClass("cmEditorContent");
    this.inspector = new VBox({ width: "19rem", height: "100%", fitContainer: true }).addStyleClass(
      "cmInspector"
    );
    const workspace = new VBox({
      height: "100%",
      fitContainer: true,
      items: [
        new Toolbar({
          content: [
            new MenuButton({ text: tr("Add"), icon: "sap-icon://add", menu: addMenu }),
            button("删除", () => this.deleteNode(), "sap-icon://delete"),
            button("复制", () => this.copyNode(), "sap-icon://copy"),
            button("移动", () => this.moveNode(), "sap-icon://move"),
            new ToolbarSpacer(),
            button(
              "企业特征库",
              () => this.getRouter().navTo("featureLibrary"),
              "sap-icon://collections-management"
            ),
            new Button({
              text: tr("Preview Configuration"),
              icon: "sap-icon://inspect",
              type: "Emphasized",
              press: () => this.preview()
            })
          ]
        }),
        grow(
          new HBox({
            height: "100%",
            fitContainer: true,
            items: [
              treePanel,
              grow(
                new ScrollContainer({
                  vertical: true,
                  horizontal: false,
                  height: "100%",
                  content: [this.editor]
                })
              ),
              this.inspector
            ]
          }).addStyleClass("cmModelColumns")
        )
      ]
    });
    if (!this.selection || !this.nodeExists()) {
      const first = this.store.families.find((f) =>
        this.store.groups.some(
          (g) => g.id === f.groupId && g.contextId === this.currentContext().id
        )
      );
      const group = this.store.groups.find((g) => g.contextId === this.currentContext().id);
      this.selection = first
        ? { kind: "family", id: first.id }
        : group
          ? { kind: "group", id: group.id }
          : undefined;
    }
    this.renderSelected();
    const count =
      this.store.groups.length + this.store.families.length + this.store.references.length;
    for (let i = 0; i < count; i++) {
      if (this.tree?.getContextByIndex(i)?.getProperty("id") === this.selection?.id) {
        this.tree.setSelectedIndex(i);
        break;
      }
    }
    return workspace;
  }
  private nodeExists(): boolean {
    if (!this.selection) return false;
    return this.selection.kind === "group"
      ? this.store.groups.some(
          (g) => g.id === this.selection!.id && g.contextId === this.currentContext().id
        )
      : this.selection.kind === "family"
        ? this.store.families.some(
            (f) =>
              f.id === this.selection!.id &&
              this.store.groups.some(
                (g) => g.id === f.groupId && g.contextId === this.currentContext().id
              )
          )
        : contextReferences(this.store, this.currentContext().id).some(
            (r) => r.id === this.selection!.id
          );
  }
  private populateTree(): void {
    const nodes: TreeNode[] = this.store.groups
      .filter((g) => g.contextId === this.currentContext().id)
      .sort((a, b) => a.sort - b.sort)
      .map((g) => ({
        ...g,
        kind: "group",
        icon: "sap-icon://folder-blank",
        type: `Group · ${g.dimension}`,
        source: "",
        children: this.store.families
          .filter((f) => f.groupId === g.id)
          .sort((a, b) => a.sort - b.sort)
          .map((f) => ({
            ...f,
            kind: "family",
            icon: "sap-icon://question-mark",
            type: `Family · ${f.dimension}${f.active ? "" : " · Inactive"}`,
            source: f.sourceType,
            children: this.store.references
              .filter((r) => r.familyId === f.id)
              .map((r) => {
                const d = resolveDefinition(this.store, r);
                return {
                  id: r.id,
                  kind: "feature",
                  name: d.name,
                  icon:
                    d.sourceType === "Enterprise Library"
                      ? "sap-icon://chain-link"
                      : "sap-icon://action-settings",
                  code: d.code,
                  dimension: d.dimension,
                  source: d.sourceType,
                  type: `${d.kind === "Choice" ? "Choice" : d.dataType} · V${d.version}${d.active ? "" : " · Inactive"}`,
                  children: []
                };
              })
          }))
      }));
    const matches = (node: TreeNode): boolean =>
      `${node.name} ${node.code}`.toLowerCase().includes(this.treeSearch.toLowerCase()) &&
      (this.dimensionFilter === "All Dimensions" || node.dimension === this.dimensionFilter);
    const filter = (rows: TreeNode[], inherited = false): TreeNode[] =>
      rows.flatMap((node) => {
        const match = inherited || matches(node);
        const children = filter(node.children, match && this.dimensionFilter === "All Dimensions");
        return match || children.length ? [{ ...node, children }] : [];
      });
    const filtered = filter(nodes);
    const rows =
      this.currentProfile().featureStructureMode === "Flat"
        ? filtered.flatMap((g) => g.children.flatMap((f) => f.children))
        : filtered;
    this.tree!.setModel(new JSONModel({ rows }));
    this.tree!.bindRows({ path: "/rows", parameters: { arrayNames: ["children"] } });
    this.tree!.expandToLevel(3);
  }
  private selectedFamily(): FeatureFamily | undefined {
    if (this.selection?.kind === "family")
      return this.store.families.find((f) => f.id === this.selection!.id);
    if (this.selection?.kind === "feature") {
      const ref = this.store.references.find((r) => r.id === this.selection!.id);
      return this.store.families.find((f) => f.id === ref?.familyId);
    }
    return undefined;
  }
  private selectedGroup(): FeatureGroup | undefined {
    const id =
      this.selection?.kind === "group" ? this.selection.id : this.selectedFamily()?.groupId;
    return this.store.groups.find((g) => g.id === id);
  }
  private renderSelected(): void {
    if (!this.editor || !this.inspector) return;
    this.editor.destroyItems();
    this.inspector.destroyItems();
    if (!this.selection || !this.nodeExists()) {
      this.editor.addItem(
        new MessageStrip({
          text: "创建 Group，再定义 Family 业务问题，最后添加本地特征或引用企业特征。",
          showIcon: true
        })
      );
      return;
    }
    const s = this.selection;
    const ref = s.kind === "feature" ? this.store.references.find((r) => r.id === s.id) : undefined;
    const d = ref ? resolveDefinition(this.store, ref) : undefined;
    const family = this.selectedFamily(),
      group = this.selectedGroup();
    const record = (d ?? (s.kind === "family" ? family : group))!;
    this.editor.addItem(
      txt(
        `${this.currentContext().name}  /  ${group?.name ?? ""}${family ? `  /  ${family.name}` : ""}`
      ).addStyleClass("cmBreadcrumb")
    );
    this.editor.addItem(
      new ObjectPageHeader({
        objectTitle: record.name,
        objectSubtitle: record.code,
        isObjectTitleAlwaysVisible: true,
        isObjectSubtitleAlwaysVisible: true
      })
    );
    this.editor.addItem(
      new HBox({
        wrap: "Wrap",
        items: [
          status(record.dimension),
          status(
            s.kind === "group" ? "组织分组" : d ? `${d.kind} · ${d.dataType}` : "配置问题 / Family"
          ),
          ...(d
            ? [status(d.sourceType), status(`V${d.version}`)]
            : family
              ? [status(family.selectionMode), status(family.mandatory ? "Mandatory" : "Optional")]
              : [])
        ]
      }).addStyleClass("cmObjectTags")
    );
    const tabs = new IconTabBar({
      expandable: false,
      applyContentPadding: false,
      selectedKey: this.editorTab,
      select: (e) => {
        this.editorTab = e.getParameter("key") ?? "general";
      },
      items: [
        new IconTabFilter({
          key: "general",
          text: tr("General"),
          content: [this.generalContent(s, d, family, group)]
        }),
        new IconTabFilter({
          key: "values",
          text: tr("Values"),
          content: [this.valuesContent(d, family)]
        }),
        new IconTabFilter({ key: "usage", text: tr("Usage"), content: [this.usageContent(d)] }),
        new IconTabFilter({
          key: "version",
          text: tr("Version"),
          content: [this.versionContent(d, ref)]
        }),
        new IconTabFilter({
          key: "rules",
          text: tr("Rules"),
          content: [
            new MessageStrip({
              text: tr("Rules are managed in the next configuration modeling stage."),
              type: "Information",
              showIcon: true
            }).addStyleClass("sapUiSmallMargin")
          ]
        })
      ]
    });
    this.editor.addItem(tabs);
    this.buildInspector(s, record, d, family, group);
  }
  private generalContent(
    s: Selection,
    d?: FeatureDefinition,
    f?: FeatureFamily,
    g?: FeatureGroup
  ): Control {
    const fields: [string, string | Control][] = [
      ["Description", (d ?? (s.kind === "family" ? f : g))!.description]
    ];
    if (s.kind === "group")
      fields.push(
        ["Dimension", g!.dimension],
        ["Sort Order", String(g!.sort)],
        ["Purpose", "只负责组织业务问题，不参与配置取值"]
      );
    else if (d)
      fields.push(
        ["Mode", d.kind === "Choice" ? "A · Feature as Choice" : "B · Typed Characteristic"],
        ["Data Type", d.dataType],
        ["Selection Type", d.selectionType],
        ["Mandatory", d.mandatory ? "Yes" : "No"],
        ["Source", d.sourceType],
        ["Unit", d.unit],
        ["Default", d.defaultValue],
        ["Min / Max Selection", `${d.minSelections} / ${d.maxSelections}`],
        ["Active", d.active ? "Yes" : "No"]
      );
    else if (f)
      fields.push(
        ["Display Name", f.displayName],
        ["Business Question", f.businessQuestion],
        ["Dimension", f.dimension],
        ["Selection Mode", f.selectionMode],
        ["Mandatory", f.mandatory ? "Yes" : "No"],
        ["Source", f.sourceType],
        ["Min / Max Selection", `${f.minSelections} / ${f.maxSelections}`],
        ["Sort Order", String(f.sort)],
        ["Active", f.active ? "Yes" : "No"]
      );
    return new VBox({
      items: [
        new Toolbar({
          content: [
            title(s.kind === "family" ? "Business Question" : "Overview"),
            new ToolbarSpacer(),
            button("编辑完整属性", () =>
              s.kind === "group"
                ? this.editGroup(g)
                : s.kind === "family"
                  ? this.editFamily(f)
                  : this.editDefinition(d!)
            )
          ]
        }),
        form(fields)
      ]
    });
  }
  private valuesContent(d?: FeatureDefinition, f?: FeatureFamily): Control {
    const definitions = d
      ? [d]
      : f
        ? this.store.references
            .filter((r) => r.familyId === f.id)
            .map((r) => resolveDefinition(this.store, r))
        : [];
    if (!definitions.length)
      return new MessageStrip({
        text: "分组不定义取值。请在 Family 下添加 Feature。",
        showIcon: true
      });
    return new VBox({
      items: definitions.map(
        (def) =>
          new VBox({
            items: [
              new Toolbar({
                content: [
                  title(def.name),
                  status(def.dataType),
                  new ToolbarSpacer(),
                  button("编辑值域", () => this.editDomain(def))
                ]
              }),
              this.domainDisplay(def)
            ]
          })
      )
    });
  }
  private domainDisplay(d: FeatureDefinition): Control {
    if (d.kind === "Choice")
      return form([
        ["Choice Code", d.code],
        ["Display Value", d.name],
        ["Active", d.active ? "Yes" : "No"]
      ]);
    if (["Enumeration", "Multi Enumeration", "Reference"].includes(d.dataType))
      return this.valueTable(d.domain.values);
    const pairs: [string, string][] = [
      ["Data Type", d.dataType],
      ["Unit", d.unit]
    ];
    if (["Integer", "Decimal", "Range"].includes(d.dataType))
      pairs.push(
        ["Minimum", String(d.domain.minimum ?? "—")],
        ["Maximum", String(d.domain.maximum ?? "—")],
        ["Step", String(d.domain.step ?? "—")]
      );
    else if (d.dataType === "String")
      pairs.push(
        ["Max Length", String(d.domain.maxLength ?? "—")],
        ["Pattern", d.domain.pattern || "—"]
      );
    else if (["Date", "DateTime"].includes(d.dataType))
      pairs.push(
        ["Minimum Date", d.domain.minimumDate || "—"],
        ["Maximum Date", d.domain.maximumDate || "—"]
      );
    else pairs.push(["Allowed Values", "Yes / No"]);
    return form(pairs);
  }
  private valueTable(values: FeatureValue[]): Table {
    return new Table({
      fixedLayout: false,
      noDataText: "尚未定义允许值",
      columns: ["Value Code", "Display Value", "Description", "Sequence", "Default", "Active"].map(
        (text) => new Column({ header: new Label({ text }) })
      ),
      items: [...values]
        .sort((a, b) => a.sort - b.sort)
        .map(
          (v) =>
            new ColumnListItem({
              cells: [
                txt(v.code),
                txt(v.value),
                txt(v.description || "—"),
                txt(String(v.sort)),
                status(v.defaultValue ? "Yes" : "—"),
                status(v.active ? "Active" : "Inactive")
              ]
            })
        )
    });
  }
  private usageContent(d?: FeatureDefinition): Control {
    if (!d)
      return new MessageStrip({
        text: "选择 Feature 可查看定义在各产品族中的引用情况。",
        showIcon: true
      });
    const contexts = definitionUsage(this.store, d.id);
    return new VBox({
      items: [
        new Toolbar({ content: [title(`Used by ${contexts.length} Contexts`)] }),
        new List({
          items: contexts.map(
            (c) =>
              new StandardListItem({
                title: c.name,
                description: `${c.code} · ${contextReferences(this.store, c.id)
                  .filter((r) => r.featureDefinitionId === d.id)
                  .map((r) => `V${r.definitionVersion}`)
                  .join(", ")}`,
                info: c.status
              })
          )
        })
      ]
    });
  }
  private versionContent(d?: FeatureDefinition, ref?: FeatureReference): Control {
    if (!d)
      return new MessageStrip({
        text: `此对象随 Context V${this.currentContext().version} 版本管理。可在顶部“版本”查看快照。`,
        showIcon: true
      });
    const latest = latestDefinitions(this.store).find((x) => x.id === d.id)!;
    return new VBox({
      items: [
        form([
          ["Pinned Definition", `V${d.version}`],
          ["Latest Definition", `V${latest.version}`],
          ["Last Modified", d.modified],
          ["Update Policy", "引用锁定定义版本；升级后才采用新值域"]
        ]),
        ...(ref && latest.version > d.version
          ? [
              new Button({
                text: `升级引用至 V${latest.version}`,
                type: "Emphasized",
                press: () => {
                  if (this.canEdit())
                    this.commit((s) => {
                      s.references.find((r) => r.id === ref.id)!.definitionVersion = latest.version;
                    });
                }
              }).addStyleClass("sapUiSmallMargin")
            ]
          : []),
        new List({
          items: this.store.definitions
            .filter((x) => x.id === d.id)
            .sort((a, b) => b.version - a.version)
            .map(
              (x) =>
                new StandardListItem({
                  title: `V${x.version} · ${x.name}`,
                  description: `${x.modified} · ${x.dataType}`,
                  info: x.version === d.version ? "当前引用" : ""
                })
            )
        })
      ]
    });
  }
  private buildInspector(
    s: Selection,
    record: FeatureGroup | FeatureFamily | FeatureDefinition,
    d?: FeatureDefinition,
    f?: FeatureFamily,
    g?: FeatureGroup
  ): void {
    const locked =
      this.currentContext().status !== "Draft" || d?.sourceType === "Enterprise Library";
    const fields: Field[] = [
      ...this.namedFields(record),
      { key: "dimension", label: "Dimension", value: record.dimension, options: dimensions }
    ];
    if (d)
      fields.push(
        { key: "dataType", label: "Data Type", value: d.dataType, options: dataTypes },
        {
          key: "selectionType",
          label: "Selection Type",
          value: d.selectionType,
          options: [
            "Single Selection",
            "Multi Selection",
            "Boolean Selection",
            "Range Input",
            "Free Input"
          ]
        },
        { key: "unit", label: "Unit", value: d.unit },
        { key: "mandatory", label: "Mandatory", value: d.mandatory },
        { key: "defaultValue", label: "Default Value", value: d.defaultValue },
        { key: "active", label: "Active", value: d.active }
      );
    else if (s.kind === "family" && f)
      fields.push(
        {
          key: "businessQuestion",
          label: "Business Question",
          value: f.businessQuestion,
          required: true,
          multiline: true
        },
        { key: "mandatory", label: "Mandatory", value: f.mandatory },
        { key: "active", label: "Active", value: f.active }
      );
    const draft: Values = {};
    const controls: Control[] = [];
    const inputs: { field: Field; input: Input | TextArea }[] = [];
    for (const field of fields) {
      draft[field.key] = field.value;
      controls.push(new Label({ text: field.label, required: field.required }));
      if (field.options)
        controls.push(
          select(field.options, String(field.value), (v) => {
            draft[field.key] = v;
          }).setEnabled(!locked)
        );
      else if (typeof field.value === "boolean")
        controls.push(
          new CheckBox({
            selected: field.value,
            enabled: !locked,
            select: (e) => {
              draft[field.key] = e.getParameter("selected") ?? false;
            }
          })
        );
      else {
        const input = field.multiline
          ? new TextArea({ value: String(field.value), width: "100%", rows: 3, editable: !locked })
          : new Input({ value: String(field.value), width: "100%", editable: !locked });
        input.attachEvent("liveChange", () => {
          draft[field.key] = input.getValue();
          input.setValueState(
            field.required && !String(draft[field.key]).trim() ? "Error" : "None"
          );
        });
        controls.push(input);
        inputs.push({ field, input });
      }
    }
    for (let i = 0; i < controls.length; i += 2)
      (controls[i] as Label).setLabelFor(controls[i + 1]);
    this.inspector!.addItem(
      new Toolbar({
        content: [
          title("Properties"),
          new ToolbarSpacer(),
          status(locked ? "Read Only" : "Editable")
        ]
      })
    );
    const box = new VBox({ items: controls }).addStyleClass("cmInspectorForm");
    if (d) {
      box.addItem(new Label({ text: tr("Data Type / Selection Type") }));
      box.addItem(txt(`${d.dataType} / ${d.selectionType}`));
    }
    if (locked)
      box.addItem(
        new MessageStrip({
          text:
            d?.sourceType === "Enterprise Library"
              ? "公共定义在企业特征库维护。此处保留版本引用。"
              : "发布 / 停用的上下文为只读。",
          showIcon: true
        })
      );
    this.inspector!.addItem(
      grow(new ScrollContainer({ height: "100%", vertical: true, content: [box] }))
    );
    this.inspector!.addItem(
      new Toolbar({
        content: [
          new Button({
            text: "保存属性",
            enabled: !locked,
            type: "Emphasized",
            press: () => {
              let valid = true;
              inputs.forEach(({ field, input }) => {
                draft[field.key] = input.getValue().trim();
                const bad = !!field.required && !input.getValue().trim();
                input.setValueState(bad ? "Error" : "None");
                if (bad) valid = false;
              });
              if (!valid) return;
              if (d) {
                const edited = { ...structuredClone(d), ...draft } as FeatureDefinition;
                if (edited.dataType !== d.dataType) {
                  edited.domain = { values: [] };
                  edited.defaultValue = "";
                }
                this.saveDefinition(edited);
              } else
                this.commit((next) =>
                  Object.assign(
                    s.kind === "group"
                      ? next.groups.find((x) => x.id === g!.id)!
                      : next.families.find((x) => x.id === f!.id)!,
                    draft
                  )
                );
            }
          }),
          button("重置", () => this.renderSelected())
        ]
      })
    );
  }
  private editGroup(existing?: FeatureGroup): void {
    if (!this.canEdit()) return;
    const record: FeatureGroup = existing ?? {
      id: uid("group"),
      contextId: this.currentContext().id,
      code: "",
      name: "",
      description: "",
      dimension: "Common",
      sort: this.store.groups.filter((g) => g.contextId === this.currentContext().id).length + 1
    };
    this.editDialog(
      existing ? "编辑 Feature Group" : "Add Group",
      [
        ...this.namedFields(record),
        { key: "dimension", label: "Dimension", value: record.dimension, options: dimensions },
        { key: "sort", label: "Sort Order", value: record.sort, numeric: true }
      ],
      (v) =>
        this.commit((s) => {
          if (existing)
            Object.assign(
              s.groups.find((g) => g.id === record.id)!,
              v
            );
          else s.groups.push({ ...record, ...v } as FeatureGroup);
        })
    );
  }
  private editFamily(existing?: FeatureFamily): void {
    if (!this.canEdit()) return;
    const group = existing
      ? this.store.groups.find((g) => g.id === existing.groupId)
      : this.selectedGroup();
    if (!group) {
      MessageToast.show("请先创建或选择一个 Group");
      return;
    }
    const record: FeatureFamily = existing ?? {
      id: uid("family"),
      groupId: group.id,
      code: "",
      name: "",
      description: "",
      displayName: "",
      businessQuestion: "",
      dimension: group.dimension,
      selectionMode: "Single",
      mandatory: true,
      sourceType: "Local",
      sort: this.store.families.filter((f) => f.groupId === group.id).length + 1,
      active: true,
      minSelections: 0,
      maxSelections: 1
    };
    this.editDialog(
      existing ? "编辑 Feature Family" : `Add Family · ${group.name}`,
      [
        ...this.namedFields(record),
        { key: "displayName", label: "Display Name", value: record.displayName },
        {
          key: "businessQuestion",
          label: "Business Question",
          value: record.businessQuestion,
          required: true,
          multiline: true
        },
        { key: "dimension", label: "Dimension", value: record.dimension, options: dimensions },
        {
          key: "selectionMode",
          label: "Selection Mode",
          value: record.selectionMode,
          options: ["Single", "Multiple", "Value Input"]
        },
        { key: "mandatory", label: "Mandatory", value: record.mandatory },
        {
          key: "sourceType",
          label: "Feature Source",
          value: record.sourceType,
          options: ["Local", "Enterprise Library"]
        },
        {
          key: "minSelections",
          label: "Min Selection Count",
          value: record.minSelections,
          numeric: true
        },
        {
          key: "maxSelections",
          label: "Max Selection Count",
          value: record.maxSelections,
          numeric: true
        },
        { key: "sort", label: "Sort Order", value: record.sort, numeric: true },
        { key: "active", label: "Active", value: record.active }
      ],
      (v) =>
        this.commit((s) => {
          if (v.selectionMode === "Multiple" && !this.currentProfile().allowMulti)
            throw new Error("当前 Profile 不允许多选");
          if (existing)
            Object.assign(
              s.families.find((f) => f.id === record.id)!,
              v
            );
          else s.families.push({ ...record, ...v } as FeatureFamily);
        })
    );
  }
  private addFeature(): void {
    if (!this.canEdit()) return;
    if (!this.selectedFamily()) {
      MessageToast.show("请先选择一个 Family");
      return;
    }
    const dialog = new Dialog({
      title: "Add Feature",
      contentWidth: "30rem",
      content: [
        new VBox({
          items: [
            txt("创建当前产品族独有的特征，或引用企业公共定义。"),
            new Button({
              text: tr("Create Local Feature"),
              icon: "sap-icon://add",
              width: "100%",
              press: () => {
                dialog.close();
                this.editDefinition();
              }
            }),
            new Button({
              text: tr("Reuse Existing Feature"),
              icon: "sap-icon://chain-link",
              width: "100%",
              press: () => {
                dialog.close();
                this.reuseFeature();
              }
            })
          ]
        }).addStyleClass("sapUiMediumMargin")
      ],
      endButton: button("取消", () => dialog.close()),
      afterClose: () => dialog.destroy()
    });
    this.getView()?.addDependent(dialog);
    dialog.setDraggable(true).setResizable(true);
    dialog.open();
  }
  private definitionFields(d: FeatureDefinition): Field[] {
    return [
      ...this.namedFields(d),
      { key: "kind", label: "Feature Mode", value: d.kind, options: ["Choice", "Characteristic"] },
      { key: "dimension", label: "Dimension", value: d.dimension, options: dimensions },
      { key: "dataType", label: "Data Type", value: d.dataType, options: dataTypes },
      {
        key: "selectionType",
        label: "Selection Type",
        value: d.selectionType,
        options: [
          "Single Selection",
          "Multi Selection",
          "Boolean Selection",
          "Range Input",
          "Free Input"
        ]
      },
      { key: "mandatory", label: "Mandatory", value: d.mandatory },
      { key: "defaultValue", label: "Default Value (Code / Literal)", value: d.defaultValue },
      { key: "unit", label: "Unit", value: d.unit },
      { key: "minSelections", label: "Min Selection Count", value: d.minSelections, numeric: true },
      { key: "maxSelections", label: "Max Selection Count", value: d.maxSelections, numeric: true },
      { key: "active", label: "Active", value: d.active }
    ];
  }
  private editDefinition(existing?: FeatureDefinition): void {
    if (!this.libraryMode && !this.canEdit()) return;
    if (existing?.sourceType === "Enterprise Library" && !this.libraryMode) {
      MessageBox.information(
        "这是企业特征的版本引用。请在企业特征库中编辑定义，再在 Version 中升级引用。"
      );
      return;
    }
    if (
      !existing &&
      !this.libraryMode &&
      this.currentProfile().featureSourceMode === "Enterprise Feature Library"
    ) {
      MessageBox.information("当前 Profile 仅允许引用企业特征。");
      return;
    }
    const d: FeatureDefinition = existing ?? {
      id: uid("def"),
      code: "",
      name: "",
      description: "",
      version: 1,
      sourceType: this.libraryMode ? "Enterprise Library" : "Local",
      dimension: "Engineering",
      kind: "Characteristic",
      dataType: "Enumeration",
      selectionType: "Single Selection",
      unit: "",
      mandatory: true,
      defaultValue: "",
      minSelections: 0,
      maxSelections: 1,
      active: true,
      domain: { values: [] },
      modified: today()
    };
    this.editDialog(
      existing
        ? `编辑 ${d.name} · 保存为新定义版本`
        : this.libraryMode
          ? "新建企业特征定义"
          : "Create Local Feature",
      this.definitionFields(d),
      (v) => {
        const updated = { ...structuredClone(d), ...v } as FeatureDefinition;
        if (updated.kind === "Choice") {
          updated.dataType = "Enumeration";
          updated.selectionType = "Single Selection";
          updated.domain = { values: [] };
        }
        if (existing && existing.dataType !== updated.dataType) {
          updated.domain = { values: [] };
          updated.defaultValue = "";
        }
        return this.saveDefinition(updated, !existing);
      }
    );
  }
  private saveDefinition(d: FeatureDefinition, create = false): boolean {
    const errors = validateDefinition(d);
    if (errors.length) {
      MessageBox.error(errors.join("\n"));
      return false;
    }
    if (!this.libraryMode) {
      if (d.dataType === "Multi Enumeration" && !this.currentProfile().allowMulti) {
        MessageBox.error("当前 Profile 不允许多选");
        return false;
      }
      if (d.dataType === "Range" && !this.currentProfile().allowRange) {
        MessageBox.error("当前 Profile 不允许范围输入");
        return false;
      }
      if (d.dataType === "String" && !this.currentProfile().allowText) {
        MessageBox.error("当前 Profile 不允许自由文本");
        return false;
      }
    }
    return this.commit(
      (s) => {
        const next = create ? { ...d, version: 1, modified: today() } : publishDefinition(s, d);
        if (create) s.definitions.push(next);
        if (!this.libraryMode) {
          if (create) {
            const family = this.selectedFamily();
            if (!family) throw new Error("请先选择 Family");
            s.references.push({
              id: uid("ref"),
              familyId: family.id,
              featureDefinitionId: next.id,
              definitionVersion: next.version
            });
          } else {
            const refs = contextReferences(s, this.currentContext().id).filter(
              (r) => r.featureDefinitionId === next.id
            );
            refs.forEach((r) => {
              r.definitionVersion = next.version;
            });
          }
        }
      },
      d.sourceType === "Enterprise Library"
        ? "企业定义已保存；现有 Context 引用版本保持不变"
        : "本地特征已保存"
    );
  }
  private editDomain(d: FeatureDefinition): void {
    if (!this.libraryMode && !this.canEdit()) return;
    if (d.sourceType === "Enterprise Library" && !this.libraryMode) {
      MessageBox.information("公共值域请在企业特征库修改。已有引用保留当前版本。");
      return;
    }
    if (d.kind === "Choice") {
      this.editDefinition(d);
      return;
    }
    const draft = structuredClone(d);
    if (["Enumeration", "Multi Enumeration", "Reference"].includes(d.dataType)) {
      let selected = -1;
      const table = new Table({
        mode: "SingleSelectLeft",
        fixedLayout: false,
        columns: ["Code *", "Display Value *", "Description", "Sequence", "Default", "Active"].map(
          (t) => new Column({ header: new Label({ text: t }) })
        ),
        selectionChange: (e) => {
          selected = table.indexOfItem(e.getParameter("listItem")!);
        }
      });
      const refresh = (): void => {
        table.destroyItems();
        selected = -1;
        draft.domain.values.forEach((v) => {
          const input = (key: "code" | "value" | "description"): Input =>
            new Input({
              value: v[key],
              liveChange: (e) => {
                v[key] = e.getParameter("value") ?? "";
              }
            });
          table.addItem(
            new ColumnListItem({
              cells: [
                input("code"),
                input("value"),
                input("description"),
                new Input({
                  value: String(v.sort),
                  type: "Number",
                  width: "5rem",
                  liveChange: (e) => {
                    v.sort = Number(e.getParameter("value"));
                  }
                }),
                new CheckBox({
                  selected: v.defaultValue,
                  select: (e) => {
                    v.defaultValue = e.getParameter("selected") ?? false;
                  }
                }),
                new CheckBox({
                  selected: v.active,
                  select: (e) => {
                    v.active = e.getParameter("selected") ?? false;
                  }
                })
              ]
            })
          );
        });
      };
      refresh();
      const targetInput = new Input({
        value: draft.domain.referenceTarget || "",
        liveChange: (e) => {
          draft.domain.referenceTarget = e.getParameter("value");
        }
      });
      const dialog = new Dialog({
        title: `${d.name} · Value Domain`,
        contentWidth: "65rem",
        draggable: true,
        resizable: true,
        content: [
          ...(d.dataType === "Reference" ? [form([["Reference Catalog", targetInput]])] : []),
          new Toolbar({
            content: [
              txt("允许值编码在当前定义内唯一；停用值不会出现在预览中。"),
              new ToolbarSpacer(),
              button(
                "添加值",
                () => {
                  draft.domain.values.push({
                    id: uid("value"),
                    code: "",
                    value: "",
                    description: "",
                    sort: draft.domain.values.length + 1,
                    defaultValue: false,
                    active: true
                  });
                  refresh();
                },
                "sap-icon://add"
              ),
              button(
                "移除",
                () => {
                  if (selected < 0) {
                    MessageToast.show("请先选择允许值");
                    return;
                  }
                  draft.domain.values.splice(selected, 1);
                  refresh();
                },
                "sap-icon://delete"
              )
            ]
          }),
          table
        ],
        beginButton: new Button({
          text: "保存值域",
          type: "Emphasized",
          press: () => {
            if (this.saveDefinition(draft)) dialog.close();
          }
        }),
        endButton: button("取消", () => dialog.close()),
        afterClose: () => dialog.destroy()
      });
      this.getView()?.addDependent(dialog);
      dialog.addStyleClass("sapUiSizeCompact");
      dialog.open();
      return;
    }
    const fields: Field[] = [];
    if (["Integer", "Decimal", "Range"].includes(d.dataType))
      fields.push(
        { key: "minimum", label: "Minimum", value: d.domain.minimum ?? "" },
        { key: "maximum", label: "Maximum", value: d.domain.maximum ?? "" },
        { key: "step", label: "Step", value: d.domain.step ?? "" },
        { key: "unit", label: "Unit", value: d.unit }
      );
    if (d.dataType === "String")
      fields.push(
        { key: "maxLength", label: "Max Length", value: d.domain.maxLength ?? "" },
        { key: "pattern", label: "Pattern (Optional)", value: d.domain.pattern ?? "" }
      );
    if (["Date", "DateTime"].includes(d.dataType))
      fields.push(
        {
          key: "minimumDate",
          label:
            d.dataType === "Date"
              ? "Minimum Date · YYYY-MM-DD"
              : "Minimum DateTime · YYYY-MM-DDTHH:mm",
          value: d.domain.minimumDate ?? ""
        },
        {
          key: "maximumDate",
          label:
            d.dataType === "Date"
              ? "Maximum Date · YYYY-MM-DD"
              : "Maximum DateTime · YYYY-MM-DDTHH:mm",
          value: d.domain.maximumDate ?? ""
        }
      );
    if (d.dataType === "Boolean") {
      MessageBox.information(
        "Boolean 固定提供 Yes / No。可在完整属性中设置必填和默认值（true / false）。"
      );
      return;
    }
    this.editDialog(`${d.name} · Value Domain`, fields, (v) => {
      for (const key of ["minimum", "maximum", "step", "maxLength"] as const)
        if (key in v) draft.domain[key] = String(v[key]).trim() === "" ? undefined : Number(v[key]);
      for (const key of ["pattern", "minimumDate", "maximumDate"] as const)
        if (key in v) draft.domain[key] = String(v[key]);
      if ("unit" in v) draft.unit = String(v.unit);
      return this.saveDefinition(draft);
    });
  }
  private reuseFeature(): void {
    if (!this.canEdit()) return;
    const family = this.selectedFamily();
    if (!family) {
      MessageToast.show("请先选择一个 Family");
      return;
    }
    if (this.currentProfile().featureSourceMode === "Local Features") {
      MessageBox.information("当前 Profile 仅允许本地特征。请先调整 Feature Source。");
      return;
    }
    let selected: string | undefined;
    const list = new List({
      mode: "SingleSelectLeft",
      includeItemInSelection: true,
      selectionChange: (e) => {
        selected = e.getParameter("listItem")?.data("id") as string;
      }
    });
    const populate = (search: string): void => {
      list.destroyItems();
      selected = undefined;
      latestDefinitions(this.store)
        .filter(
          (d) =>
            d.sourceType === "Enterprise Library" &&
            d.active &&
            `${d.name} ${d.code}`.toLowerCase().includes(search.toLowerCase())
        )
        .forEach((d) => {
          const exists = this.store.references.some(
            (r) => r.familyId === family.id && r.featureDefinitionId === d.id
          );
          const item = new StandardListItem({
            title: d.name,
            description: `${d.code} · ${d.dimension} · ${d.dataType} · V${d.version}`,
            info: exists
              ? "已引用"
              : `Used by ${definitionUsage(this.store, d.id).length} Contexts`,
            icon: "sap-icon://chain-link",
            type: exists ? "Inactive" : "Active"
          });
          item.data("id", d.id);
          list.addItem(item);
        });
    };
    populate("");
    const dialog = new Dialog({
      title: `Reuse Existing Feature · ${family.name}`,
      contentWidth: "49rem",
      contentHeight: "31rem",
      content: [
        new SearchField({
          placeholder: tr("Search Enterprise Feature Library"),
          liveChange: (e) => populate(e.getParameter("newValue") ?? "")
        }),
        list
      ],
      beginButton: new Button({
        text: tr("Add Reference"),
        type: "Emphasized",
        press: () => {
          if (!selected) {
            MessageToast.show("请选择企业特征");
            return;
          }
          const d = latestDefinitions(this.store).find((x) => x.id === selected)!;
          if (
            (d.dataType === "Multi Enumeration" && !this.currentProfile().allowMulti) ||
            (d.dataType === "Range" && !this.currentProfile().allowRange) ||
            (d.dataType === "String" && !this.currentProfile().allowText)
          ) {
            MessageBox.error("此特征的数据类型不符合当前 Profile 允许的输入行为");
            return;
          }
          if (
            this.commit((s) => {
              s.references.push({
                id: uid("ref"),
                familyId: family.id,
                featureDefinitionId: d.id,
                definitionVersion: d.version
              });
            }, "已添加版本化引用，未复制企业定义")
          )
            dialog.close();
        }
      }),
      endButton: button("取消", () => dialog.close()),
      afterClose: () => dialog.destroy()
    });
    this.getView()?.addDependent(dialog);
    dialog.setDraggable(true).setResizable(true);
    dialog.addStyleClass("sapUiSizeCompact");
    dialog.open();
  }
  private deleteNode(): void {
    if (!this.canEdit()) return;
    const node = this.selection;
    if (!node) {
      MessageToast.show("请先选择节点");
      return;
    }
    MessageBox.confirm(
      node.kind === "feature"
        ? "移除此特征引用？特征定义及历史版本会保留。"
        : "删除所选节点及其下属 Family 和特征引用？",
      {
        onClose: (a) => {
          if (a !== MessageBox.Action.OK) return;
          this.commit((s) => {
            if (node.kind === "feature")
              s.references = s.references.filter((r) => r.id !== node.id);
            else {
              const ids = new Set(
                s.families
                  .filter((f) => (node.kind === "group" ? f.groupId === node.id : f.id === node.id))
                  .map((f) => f.id)
              );
              s.references = s.references.filter((r) => !ids.has(r.familyId));
              s.families = s.families.filter((f) => !ids.has(f.id));
              if (node.kind === "group") s.groups = s.groups.filter((g) => g.id !== node.id);
            }
          });
        }
      }
    );
  }
  private copyNode(): void {
    if (!this.canEdit()) return;
    const node = this.selection;
    if (!node) return;
    const record =
      node.kind === "group"
        ? this.selectedGroup()!
        : node.kind === "family"
          ? this.selectedFamily()!
          : resolveDefinition(
              this.store,
              this.store.references.find((r) => r.id === node.id)!
            );
    this.editDialog(
      "复制节点 · 企业定义继续复用，本地定义独立复制",
      [
        { key: "name", label: "新名称", value: `${record.name} Copy`, required: true },
        { key: "code", label: "新编码", value: `${record.code}_COPY`, required: true }
      ],
      (v) =>
        this.commit((s) => {
          const copyRef = (r: FeatureReference, familyId: string, rename = false): void => {
            const d = resolveDefinition(s, r);
            let id = d.id,
              version = d.version;
            if (d.sourceType === "Local") {
              id = uid("def");
              version = 1;
              s.definitions.push({
                ...structuredClone(d),
                id,
                version,
                code: rename ? String(v.code) : `${v.code}_${d.code}`,
                name: rename ? String(v.name) : d.name
              });
            } else if (rename)
              throw new Error(
                "企业特征在同一个 Family 中只能引用一次。请使用移动，或在另一个 Family 中 Reuse Feature。"
              );
            s.references.push({
              id: uid("ref"),
              familyId,
              featureDefinitionId: id,
              definitionVersion: version
            });
          };
          if (node.kind === "feature") {
            const r = s.references.find((x) => x.id === node.id)!;
            copyRef(r, r.familyId, true);
          } else {
            let groupId = this.selectedGroup()!.id;
            if (node.kind === "group") {
              groupId = uid("group");
              s.groups.push({
                ...this.selectedGroup()!,
                id: groupId,
                name: String(v.name),
                code: String(v.code)
              });
            }
            const families = s.families.filter((f) =>
              node.kind === "group" ? f.groupId === node.id : f.id === node.id
            );
            families.forEach((f) => {
              const id = uid("family");
              s.families.push({
                ...f,
                id,
                groupId,
                ...(node.kind === "family" ? { name: String(v.name), code: String(v.code) } : {})
              });
              s.references.filter((r) => r.familyId === f.id).forEach((r) => copyRef(r, id));
            });
          }
        })
    );
  }
  private moveNode(): void {
    if (!this.canEdit()) return;
    const node = this.selection;
    if (!node) return;
    if (node.kind === "group") {
      this.editGroup(this.selectedGroup());
      return;
    }
    const targets =
      node.kind === "family"
        ? this.store.groups.filter((g) => g.contextId === this.currentContext().id)
        : this.store.families.filter((f) =>
            this.store.groups.some(
              (g) => g.id === f.groupId && g.contextId === this.currentContext().id
            )
          );
    const names = targets.map((t) => `${t.code} · ${t.name}`);
    this.editDialog(
      "移动节点 · 保留定义及版本引用",
      [
        {
          key: "target",
          label: node.kind === "family" ? "目标 Group" : "目标 Family",
          value: names[0] ?? "",
          options: names
        }
      ],
      (v) =>
        this.commit((s) => {
          const target = targets[names.indexOf(String(v.target))];
          if (!target) throw new Error("请选择目标");
          if (node.kind === "family") s.families.find((f) => f.id === node.id)!.groupId = target.id;
          else s.references.find((r) => r.id === node.id)!.familyId = target.id;
        })
    );
  }
  private renderLibrary(root: VBox): void {
    this.libraryTable = new Table({
      mode: "SingleSelectMaster",
      includeItemInSelection: true,
      fixedLayout: false,
      growing: true,
      growingThreshold: 30,
      columns: ["Feature Definition", "Dimension", "Data Type", "Version", "Usage", "Status"].map(
        (text) => new Column({ header: new Label({ text }) })
      ),
      selectionChange: (e) => {
        this.selectedLibrary = e.getParameter("listItem")?.data("id") as string;
        this.renderLibraryDetail();
      }
    });
    this.libraryDetail = new VBox({ width: "100%" }).addStyleClass("cmLibraryDetail");
    const definitions = latestDefinitions(this.store).filter(
      (d) => d.sourceType === "Enterprise Library"
    );
    if (!definitions.some((d) => d.id === this.selectedLibrary))
      this.selectedLibrary = definitions[0]?.id;
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
          button(
            "返回配置上下文",
            () => this.getRouter().navTo("configuration"),
            "sap-icon://nav-back"
          ),
          title(`${definitions.length} 个公共定义`),
          new ToolbarSpacer(),
          new SearchField({
            width: "22rem",
            value: this.librarySearch,
            placeholder: "搜索名称 / 编码 / 类型 / 维度",
            liveChange: (e) => {
              this.librarySearch = e.getParameter("newValue") ?? "";
              this.populateLibrary();
            }
          }),
          new Button({
            text: tr("New Feature Definition"),
            icon: "sap-icon://add",
            type: "Emphasized",
            press: () => this.editDefinition()
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
    this.populateLibrary();
    this.renderLibraryDetail();
  }
  private populateLibrary(): void {
    this.libraryTable!.destroyItems();
    latestDefinitions(this.store)
      .filter(
        (d) =>
          d.sourceType === "Enterprise Library" &&
          `${d.name} ${d.code} ${d.dataType} ${d.dimension}`
            .toLowerCase()
            .includes(this.librarySearch.toLowerCase())
      )
      .forEach((d) => {
        const item = new ColumnListItem({
          selected: d.id === this.selectedLibrary,
          cells: [
            new ObjectIdentifier({ title: d.name, text: d.code }),
            status(d.dimension),
            txt(d.dataType),
            txt(`V${d.version}`),
            txt(`${definitionUsage(this.store, d.id).length} Contexts`),
            status(d.active ? "Active" : "Inactive")
          ]
        });
        item.data("id", d.id);
        this.libraryTable!.addItem(item);
      });
  }
  private renderLibraryDetail(): void {
    const box = this.libraryDetail!;
    box.destroyItems();
    const d = latestDefinitions(this.store).find((x) => x.id === this.selectedLibrary);
    if (!d) {
      box.addItem(txt("选择一个公共定义查看值域与使用情况"));
      return;
    }
    box.addItem(
      new ObjectPageHeader({
        objectTitle: d.name,
        objectSubtitle: `${d.code} · V${d.version}`,
        isObjectTitleAlwaysVisible: true,
        isObjectSubtitleAlwaysVisible: true
      })
    );
    box.addItem(
      new Toolbar({
        content: [
          status(d.dimension),
          status(d.dataType),
          new ToolbarSpacer(),
          button("编辑定义", () => this.editDefinition(d), "sap-icon://edit"),
          button("编辑值域", () => this.editDomain(d))
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
        ["Description", d.description],
        ["Selection", d.selectionType],
        ["Mandatory", d.mandatory ? "Yes" : "No"],
        ["Unit", d.unit],
        ["Last Modified", d.modified]
      ])
    );
    box.addItem(title("Value Domain").addStyleClass("sapUiSmallMargin"));
    box.addItem(this.domainDisplay(d));
    box.addItem(this.usageContent(d));
    box.addItem(this.versionContent(d));
  }
  private preview(): void {
    const checks: (() => string[])[] = [];
    const groups = this.store.groups
      .filter((g) => g.contextId === this.currentContext().id)
      .sort((a, b) => a.sort - b.sort);
    const values = new Map<string, unknown>();
    const content = new VBox({
      items: [
        new MessageStrip({
          text: "Rule validation is not enabled in this modeling stage. 此预览仅检查必填、类型和值域，允许独立选择 FWD 与 Offroad Package。",
          type: "Information",
          showIcon: true
        })
      ]
    }).addStyleClass("cmPreviewForm");
    const readiness = validateContext(this.store, this.currentContext().id);
    if (readiness.length)
      content.addItem(
        new MessageStrip({
          text: `模型完整性提示：${readiness.join("；")}`,
          type: "Warning",
          showIcon: true
        })
      );
    const message = new MessageStrip({ text: "", visible: false, showIcon: true });
    const useDefault = this.currentProfile().defaultBehavior !== "No Default";
    for (const group of groups) {
      content.addItem(title(group.name).addStyleClass("cmPreviewGroup"));
      for (const family of this.store.families
        .filter((f) => f.groupId === group.id && f.active)
        .sort((a, b) => a.sort - b.sort)) {
        const refs = this.store.references.filter((r) => r.familyId === family.id);
        const definitions = refs
          .map((r) => ({ ref: r, d: resolveDefinition(this.store, r) }))
          .filter(({ d }) => d.active);
        content.addItem(
          new Label({
            text: family.displayName || family.name,
            required: family.mandatory,
            design: "Bold"
          })
        );
        content.addItem(txt(family.businessQuestion).addStyleClass("cmPreviewQuestion"));
        const choices = definitions.filter(({ d }) => d.kind === "Choice");
        if (choices.length) {
          const active = choices.map(({ d }) => d);
          if (family.selectionMode === "Multiple") {
            const input = new MultiComboBox({
              width: "100%",
              selectedKeys: useDefault
                ? active.filter((d) => d.defaultValue === d.code).map((d) => d.id)
                : [],
              items: active.map((d) => new Item({ key: d.id, text: d.name })),
              selectionFinish: () => values.set(family.id, input.getSelectedKeys())
            });
            content.addItem(input);
            checks.push(() => {
              const count = input.getSelectedKeys().length;
              const error =
                count < Math.max(family.mandatory ? 1 : 0, family.minSelections) ||
                count > family.maxSelections;
              input.setValueState(error ? "Error" : "None");
              return error
                ? [
                    `${family.name}: 请选择 ${Math.max(family.mandatory ? 1 : 0, family.minSelections)}–${family.maxSelections} 项`
                  ]
                : [];
            });
          } else {
            const input = new RadioButtonGroup({
              columns: 2,
              selectedIndex:
                useDefault && active.some((d) => d.defaultValue === d.code)
                  ? active.findIndex((d) => d.defaultValue === d.code)
                  : useDefault &&
                      this.currentProfile().defaultBehavior === "Auto Select Single Value" &&
                      active.length === 1
                    ? 0
                    : -1,
              buttons: active.map((d) => new RadioButton({ text: d.name })),
              select: () => values.set(family.id, active[input.getSelectedIndex()]?.code)
            });
            content.addItem(input);
            checks.push(() =>
              family.mandatory && input.getSelectedIndex() < 0
                ? [`${family.name}: 请选择一个值`]
                : []
            );
          }
        }
        for (const { ref, d } of definitions.filter(({ d }) => d.kind !== "Choice")) {
          if (definitions.length > 1 || d.name !== family.name)
            content.addItem(
              new Label({ text: `${d.name}${d.unit ? ` (${d.unit})` : ""}`, required: d.mandatory })
            );
          let getValue: () => unknown;
          let control: Control;
          let setError: (error: string[]) => void = () => undefined;
          const allowed = d.domain.values.filter((v) => v.active).sort((a, b) => a.sort - b.sort);
          const initial = useDefault
            ? d.defaultValue ||
              allowed.find((v) => v.defaultValue)?.code ||
              (this.currentProfile().defaultBehavior === "Auto Select Single Value" &&
              allowed.length === 1
                ? allowed[0].code
                : "")
            : "";
          if (d.dataType === "Multi Enumeration") {
            const input = new MultiComboBox({
              width: "100%",
              selectedKeys: useDefault
                ? d.defaultValue
                  ? d.defaultValue.split(",").map((v) => v.trim())
                  : allowed.filter((v) => v.defaultValue).map((v) => v.code)
                : [],
              items: allowed.map((v) => new Item({ key: v.code, text: v.value }))
            });
            control = input;
            getValue = () => input.getSelectedKeys();
            setError = (errors) => {
              input.setValueState(errors.length ? "Error" : "None");
              input.setValueStateText(errors[0] ?? "");
            };
          } else if (["Enumeration", "Reference"].includes(d.dataType)) {
            if (d.dataType === "Enumeration" && allowed.length <= 6) {
              const input = new RadioButtonGroup({
                columns: 3,
                selectedIndex: allowed.findIndex((v) => v.code === initial),
                buttons: allowed.map((v) => new RadioButton({ text: v.value }))
              });
              control = input;
              getValue = () => allowed[input.getSelectedIndex()]?.code ?? "";
            } else {
              const input = new Select({
                width: "100%",
                selectedKey: initial,
                items: [
                  new Item({ key: "", text: "请选择…" }),
                  ...allowed.map((v) => new Item({ key: v.code, text: v.value }))
                ]
              });
              control = input;
              getValue = () => input.getSelectedKey();
              setError = (errors) => input.setValueState(errors.length ? "Error" : "None");
            }
          } else if (d.dataType === "Boolean") {
            if (!d.mandatory && !family.mandatory) {
              const input = new CheckBox({ text: d.name, selected: initial === "true" });
              control = input;
              getValue = () => input.getSelected();
            } else {
              const input = new Select({
                width: "100%",
                selectedKey: initial,
                items: [
                  new Item({ key: "", text: "请选择…" }),
                  new Item({ key: "true", text: tr("Yes") }),
                  new Item({ key: "false", text: tr("No") })
                ]
              });
              control = input;
              getValue = () => input.getSelectedKey();
              setError = (errors) => input.setValueState(errors.length ? "Error" : "None");
            }
          } else {
            const input = new Input({
              value: initial,
              width: "100%",
              type: ["Integer", "Decimal"].includes(d.dataType)
                ? "Number"
                : d.dataType === "Date"
                  ? "Date"
                  : d.dataType === "DateTime"
                    ? "DatetimeLocale"
                    : "Text",
              placeholder:
                d.dataType === "Range"
                  ? "起始值 ~ 结束值"
                  : d.dataType === "String"
                    ? `最多 ${d.domain.maxLength ?? "不限"} 字符`
                    : "输入值",
              description: d.unit
            });
            control = input;
            getValue = () => input.getValue();
            setError = (errors) => {
              input.setValueState(errors.length ? "Error" : "None");
              input.setValueStateText(errors[0] ?? "");
            };
          }
          content.addItem(control);
          if (["Decimal", "Integer", "Range"].includes(d.dataType))
            content.addItem(
              txt(
                `${d.domain.minimum ?? "不限"} – ${d.domain.maximum ?? "不限"} ${d.unit}  ·  Step ${d.domain.step ?? "Any"}`
              ).addStyleClass("cmDomainHint")
            );
          checks.push(() => {
            const value = getValue();
            values.set(ref.id, value);
            const errors = validateValue(d, value, d.mandatory || family.mandatory);
            setError(errors);
            return errors.map((e) => `${d.name}: ${e}`);
          });
        }
        if (!definitions.length)
          content.addItem(
            new MessageStrip({
              text: "此问题尚无有效特征，无法生成输入控件。",
              type: "Warning",
              showIcon: true
            })
          );
      }
    }
    const dialog = new Dialog({
      title: `${this.currentContext().name} · Preview`,
      contentWidth: "42rem",
      contentHeight: "85vh",
      verticalScrolling: true,
      content: [message, content],
      beginButton: new Button({
        text: "验证类型与值域",
        type: "Emphasized",
        press: () => {
          const errors = checks.flatMap((check) => check());
          message.setVisible(true);
          message.setType(errors.length ? "Error" : "Success");
          message.setText(
            errors.length ? errors.join("；") : "类型与值域检查通过。未执行跨特征规则校验。"
          );
        }
      }),
      endButton: button("关闭预览", () => dialog.close()),
      afterClose: () => dialog.destroy()
    });
    this.getView()?.addDependent(dialog);
    dialog.setDraggable(true).setResizable(true);
    dialog.addStyleClass("cmPreviewDrawer sapUiSizeCompact");
    dialog.open();
  }
  private download(name: string, text: string): void {
    const url = URL.createObjectURL(new Blob([text], { type: "application/json;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  private exportWorkspace(): void {
    this.download(`configuration-vocabulary-${today()}.json`, JSON.stringify(this.store, null, 2));
    MessageToast.show("已导出所有上下文、企业定义和版本引用");
  }
  private importWorkspace(): void {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,application/json";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      if (file.size > 10 * 1024 * 1024) {
        MessageBox.error("工作区文件不得超过 10 MB");
        return;
      }
      try {
        const next = JSON.parse(await file.text()) as ConfigurationStore;
        const errors = validateStore(next);
        if (!next.contexts.length) errors.push("工作区至少需要一个 Context");
        if (errors.length) {
          MessageBox.error(`导入校验失败：\n${errors.slice(0, 10).join("\n")}`);
          return;
        }
        MessageBox.confirm(
          `导入 ${next.contexts.length} 个 Context、${latestDefinitions(next).length} 个特征定义，将替换当前本地建模工作区。建议先导出备份。`,
          {
            onClose: (a) => {
              if (a !== MessageBox.Action.OK) return;
              this.commit((s) => Object.assign(s, next), "工作区导入成功");
            }
          }
        );
      } catch (error) {
        MessageBox.error(
          `无法读取工作区：${error instanceof Error ? error.message : String(error)}`
        );
      }
    };
    input.click();
  }
}
