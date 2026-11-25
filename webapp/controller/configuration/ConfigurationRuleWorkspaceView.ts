import Button from "sap/m/Button";
import CustomTreeItem from "sap/m/CustomTreeItem";
import FlexItemData from "sap/m/FlexItemData";
import HBox from "sap/m/HBox";
import IconTabBar from "sap/m/IconTabBar";
import IconTabFilter from "sap/m/IconTabFilter";
import Input from "sap/m/Input";
import Label from "sap/m/Label";
import MessageBox from "sap/m/MessageBox";
import MessageStrip from "sap/m/MessageStrip";
import MessageToast from "sap/m/MessageToast";
import MultiComboBox from "sap/m/MultiComboBox";
import ObjectStatus from "sap/m/ObjectStatus";
import OverflowToolbar from "sap/m/OverflowToolbar";
import OverflowToolbarLayoutData from "sap/m/OverflowToolbarLayoutData";
import SearchField from "sap/m/SearchField";
import Select from "sap/m/Select";
import SegmentedButton from "sap/m/SegmentedButton";
import SegmentedButtonItem from "sap/m/SegmentedButtonItem";
import StandardTreeItem from "sap/m/StandardTreeItem";
import Tree from "sap/m/Tree";
import type { Select$ChangeEvent } from "sap/m/Select";
import type { IconTabBar$SelectEvent } from "sap/m/IconTabBar";
import type { ListBase$SelectionChangeEvent } from "sap/m/ListBase";
import type { InputBase$ChangeEvent } from "sap/m/InputBase";
import type { MultiComboBox$SelectionFinishEvent } from "sap/m/MultiComboBox";
import type { SearchField$LiveChangeEvent } from "sap/m/SearchField";
import type { SegmentedButton$SelectionChangeEvent } from "sap/m/SegmentedButton";
import Text from "sap/m/Text";
import Title from "sap/m/Title";
import ToolbarSpacer from "sap/m/ToolbarSpacer";
import Item from "sap/ui/core/Item";
import Event from "sap/ui/base/Event";
import type Context from "sap/ui/model/Context";
import TreeItemBase from "sap/m/TreeItemBase";
import Popup from "sap/ui/core/Popup";
import VBox from "sap/m/VBox";
import JSONModel from "sap/ui/model/json/JSONModel";
import Control from "sap/ui/core/Control";
import UnifiedMenu from "sap/ui/unified/Menu";
import UnifiedMenuItem from "sap/ui/unified/MenuItem";
import type {
  ConfigurationContext,
  ConfigurationProfile,
  ConfigurationStore,
  FeatureDefinition
} from "../../model/configuration";
import {
  constraintOperatorsFor,
  createConstraintRule,
  formatConstraintExpression,
  hasLegacyDefaultConstraintAction,
  collectConstraintPredicates,
  isConstraintActionType,
  UNCATEGORIZED_BUSINESS_GROUP_ID,
  validateConstraintRule
} from "../../model/constraintRules";
import type { ConstraintAISuggestion } from "../../service/mockConstraintAIService";
import { ConstraintRuleRepository } from "../../service/constraintRuleRepository";
import type {
  ConstraintAction,
  ConstraintActionType,
  ConstraintConflict,
  ConstraintExpression,
  ConstraintOperator,
  ConstraintPredicate,
  ConstraintRule
} from "../../model/constraintRules";
import type { BlueprintPredicateSelection } from "../../blueprint/constraint-blueprint";
import type { Field, Values } from "./types";
import {
  constraintActionLabels,
  constraintOperatorLabels,
  tr,
  trFormat
} from "../../util/configurationUi";
import ConfigurationDialogService from "./ConfigurationDialogService";
import ConfigurationExpressionEditor from "./ConfigurationExpressionEditor";
import ConfigurationRuleDesignerView from "./ConfigurationRuleDesignerView";

type NodeKind = "source" | "condition" | "logic" | "action";
type WorkspaceMode = "designer" | "advanced";
type AdvancedWorkspaceMode = "expression" | "blueprint";
type RuleGroupingMode = "domain" | "type" | "status" | "trigger" | "recent";
type RuleStatusFilter = "all" | "valid" | "conflict" | "draft" | "disabled";
type RuleSortMode = "modified" | "name" | "status";
type RuleMetadata = {
  name: string;
  businessGroupId: string;
  ruleType?: ConstraintActionType;
};
type RuleNavigationRuleNode = {
  kind: "rule";
  ruleId: string;
  title: string;
  summary: string;
  info: string;
  statusState: "Error" | "Information" | "Success" | "None";
  tooltip: string;
  selected: boolean;
  children: [];
};
type RuleNavigationGroupNode = {
  kind: "group";
  key: string;
  title: string;
  children: RuleNavigationRuleNode[];
};
type RuleNavigationNode = RuleNavigationGroupNode | RuleNavigationRuleNode;

const actionSummarySymbols: Record<ConstraintActionType, string> = {
  REQUIRE: "→",
  EXCLUDE: "×",
  SET: "=",
  RESTRICT: "→",
  DERIVE: "ƒ",
  DEFAULT: "↳",
  RECOMMEND: "↗",
  ADD: "+",
  REMOVE: "−"
};

const groupActionOrder: ConstraintActionType[] = [
  "REQUIRE",
  "EXCLUDE",
  "RESTRICT",
  "SET",
  "DERIVE",
  "RECOMMEND",
  "ADD",
  "REMOVE",
  "DEFAULT"
];

const operatorSummarySymbols: Partial<Record<ConstraintOperator, string>> = {
  EQUALS: "=",
  NOT_EQUALS: "≠",
  GREATER_THAN: ">",
  GREATER_THAN_OR_EQUAL: "≥",
  LESS_THAN: "<",
  LESS_THAN_OR_EQUAL: "≤",
  IN: "∈",
  NOT_IN: "∉"
};

interface RuleListGroup {
  key: string;
  title: string;
  order: number;
  rules: ConstraintRule[];
}

let blueprintBundleLoading: Promise<void> | undefined;

function loadBlueprintBundle(): Promise<void> {
  if (window.ConfigurationBlueprint) return Promise.resolve();
  if (!blueprintBundleLoading) {
    blueprintBundleLoading = new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = new URL("vendor/constraint-blueprint.js", document.baseURI).toString();
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("约束蓝图编辑器加载失败"));
      document.head.appendChild(script);
    }).catch((error: unknown) => {
      blueprintBundleLoading = undefined;
      throw error;
    });
  }
  return blueprintBundleLoading;
}

interface BlueprintEditorHandle {
  addNode: (kind: NodeKind) => void;
  addScope: () => void;
  fit: () => void;
  loadConstraintAST: (
    ast: ConstraintRule["ast"],
    layout?: ConstraintRule["blueprint"],
    featureLabels?: Record<string, string>
  ) => void;
  exportConstraintAST: () => ConstraintRule["ast"] | undefined;
  exportConstraintBlueprint: () => ConstraintRule["blueprint"];
  setOnBlueprintChange: (
    handler: (ast: ConstraintRule["ast"], layout: ConstraintRule["blueprint"]) => void
  ) => void;
  setOnPredicateSelection: (
    handler: (selection: BlueprintPredicateSelection | undefined) => void
  ) => void;
  updatePredicate: (id: string, predicate: ConstraintPredicate) => void;
  validate: () => { nodes: number; connections: number };
  destroy: () => void;
}

interface ConfigurationRuleWorkspaceOptions {
  store: ConfigurationStore;
  context: ConfigurationContext;
  profile: ConfigurationProfile;
  features: FeatureDefinition[];
  repository: ConstraintRuleRepository;
  canEdit: () => boolean;
  onToggleFullscreen: () => void;
}

export default class ConfigurationRuleWorkspaceView {
  private readonly graphHost: VBox;
  private readonly rulesModel: JSONModel;
  private store: ConfigurationStore;
  private context: ConfigurationContext;
  private profile: ConfigurationProfile;
  private features: FeatureDefinition[];
  private readonly repository: ConstraintRuleRepository;
  private readonly canEdit: () => boolean;
  private readonly onToggleFullscreen: () => void;
  private rules: ConstraintRule[];
  private currentRule: ConstraintRule;
  private currentRuleDirty = false;
  private currentRuleIsNew = false;
  private readonly unsavedRuleIds = new Set<string>();
  private readonly newRuleDraftIds = new Set<string>();
  private mode: WorkspaceMode = "designer";
  private advancedMode: AdvancedWorkspaceMode = "expression";
  private rulesTree?: Tree;
  private detailsStatus?: ObjectStatus;
  private ruleMetaStatus?: ObjectStatus;
  private expressionEditor?: ConfigurationExpressionEditor;
  private expressionHost?: VBox;
  private blueprintHost?: VBox;
  private designerHost?: VBox;
  private advancedHost?: VBox;
  private readonly previewConflictRuleIds = new Set<string>();
  private readonly collapsedRuleGroups = new Set<string>();
  private searchField?: SearchField;
  private statusFilterSelector?: SegmentedButton;
  private groupSelector?: Select;
  private sortSelector?: Select;
  private searchQuery = "";
  private statusFilter: RuleStatusFilter = "all";
  private groupMode: RuleGroupingMode = "status";
  private sortMode: RuleSortMode = "modified";
  private moreToolsButton?: Button;
  private advancedModeSelector?: IconTabBar;
  private mainFullscreenButton?: Button;
  private deleteRuleButton?: Button;
  private ruleContextMenu?: UnifiedMenu;
  private ruleContextMenuRoot?: Element;
  private ruleContextMenuHandler?: EventListener;
  private designerView?: ConfigurationRuleDesignerView;
  private designerToolbarItems: Control[] = [];
  private designerHistoryToolbarItems: Control[] = [];
  private ruleNameInput?: Input;
  private blueprintNeedsLoad = true;
  private blueprintSelection?: BlueprintPredicateSelection;
  private blueprintInspectorFields?: VBox;
  private editor?: BlueprintEditorHandle;
  private validationStatus?: ObjectStatus;

  public constructor(options: ConfigurationRuleWorkspaceOptions) {
    this.store = options.store;
    this.context = options.context;
    this.profile = options.profile;
    this.features = options.features;
    this.repository = options.repository;
    this.canEdit = options.canEdit;
    this.onToggleFullscreen = options.onToggleFullscreen;
    this.rules = this.repository.list(this.context.id, this.features);
    this.currentRule = this.rules[0] ?? this.createNewRule();
    this.currentRuleIsNew = this.rules.length === 0;
    this.rulesModel = new JSONModel({ currentRule: this.currentRule, navigationGroups: [] });
    this.graphHost = new VBox({
      width: "100%",
      height: "100%",
      fitContainer: true
    }).addStyleClass("cmBlueprintCanvasHost");
    this.graphHost.addEventDelegate({
      onAfterRendering: () => this.mountEditor(),
      onBeforeRendering: () => this.disposeEditor()
    });
  }

  public build(): VBox {
    const ruleNavigation = this.buildRuleNavigation();
    ruleNavigation.setLayoutData(
      new FlexItemData({ growFactor: 0, shrinkFactor: 0, minHeight: "0" })
    );
    const detail = this.buildRuleDetail();
    detail.setLayoutData(
      new FlexItemData({ growFactor: 1, shrinkFactor: 1, baseSize: "0%", minHeight: "0" })
    );
    const workspace = new HBox({
      width: "100%",
      height: "100%",
      fitContainer: true,
      items: [ruleNavigation, detail]
    }).addStyleClass("cmRuleWorkspace");
    workspace.setModel(this.rulesModel, "rules");
    this.renderRuleList();
    return workspace;
  }

  public disposeWorkspace(): void {
    this.detachRuleContextMenu();
    this.designerView?.dispose();
    this.disposeEditor();
  }

  public setMainFullscreenState(isFullscreen: boolean): void {
    this.mainFullscreenButton?.setIcon(
      isFullscreen ? "sap-icon://exit-full-screen" : "sap-icon://full-screen"
    );
    this.mainFullscreenButton?.setTooltip(isFullscreen ? "退出主体内容全屏" : "全屏主体内容");
  }

  public setConfigurationData(
    store: ConfigurationStore,
    context: ConfigurationContext,
    profile: ConfigurationProfile,
    features: FeatureDefinition[]
  ): void {
    const featuresChanged = JSON.stringify(this.features) !== JSON.stringify(features);
    this.store = store;
    this.context = context;
    this.profile = profile;
    this.features = features;
    if (featuresChanged) {
      this.expressionEditor?.setFeatures(features);
      this.designerView?.setFeatures(features);
    }
    this.blueprintNeedsLoad = true;
    if (this.mode === "advanced" && this.advancedMode === "blueprint")
      void this.loadBlueprintRule();
    this.renderRuleList();
  }

  private disposeEditor(): void {
    this.editor?.destroy();
    this.editor = undefined;
  }

  private buildRuleNavigation(): VBox {
    this.rulesTree = new Tree({
      width: "100%",
      mode: "SingleSelectMaster",
      includeItemInSelection: true,
      noDataText: tr("暂无约束规则"),
      selectionChange: (event: ListBase$SelectionChangeEvent) => {
        const item = event.getParameter("listItem");
        const node = item?.getBindingContext("rules")?.getObject() as
          RuleNavigationNode | undefined;
        if (!item || !node) return;
        if (node.kind === "group") {
          this.rulesTree?.setSelectedItem(item, false);
          const currentRuleItem = this.rulesTree?.getItems().find((candidate) => {
            const candidateNode = candidate.getBindingContext("rules")?.getObject() as
              RuleNavigationNode | undefined;
            return candidateNode?.kind === "rule" && candidateNode.ruleId === this.currentRule.id;
          });
          if (currentRuleItem) this.rulesTree?.setSelectedItem(currentRuleItem, true);
          return;
        }
        if (event.getParameter("selected")) this.selectRule(node.ruleId);
      },
      toggleOpenState: (event: Event) => {
        const parameters = event.getParameters() as {
          itemContext?: Context;
          expanded?: boolean;
        };
        const itemContext = parameters.itemContext;
        const expanded = Boolean(parameters.expanded);
        const node = itemContext?.getObject() as RuleNavigationNode | undefined;
        if (node?.kind !== "group") return;
        if (expanded) this.collapsedRuleGroups.delete(node.key);
        else this.collapsedRuleGroups.add(node.key);
      }
    }).addStyleClass("cmConstraintRuleTree");
    this.rulesTree.setModel(this.rulesModel, "rules");
    this.rulesTree.bindItems({
      path: "rules>/navigationGroups",
      parameters: { arrayNames: ["children"], numberOfExpandedLevels: 2 },
      factory: (id, context) => {
        const node = context.getObject() as RuleNavigationNode;
        if (node.kind === "group") {
          return new StandardTreeItem(id, {
            title: node.title,
            icon: "sap-icon://folder-blank",
            type: "Active"
          }).addStyleClass("cmConstraintRuleGroupTreeItem");
        }

        const textContent = new VBox({
          width: "100%",
          items: [
            new Text({ text: node.title, wrapping: false, tooltip: node.title }).addStyleClass(
              "cmConstraintRuleTreeTitle"
            ),
            new Text({ text: node.summary, wrapping: true }).addStyleClass(
              "cmConstraintRuleTreeSummary"
            )
          ]
        }).addStyleClass("cmConstraintRuleTreeText");
        textContent.setLayoutData(
          new FlexItemData({ growFactor: 1, shrinkFactor: 1, baseSize: "0%", minWidth: "0" })
        );
        const item = new CustomTreeItem(id, {
          type: "Active",
          selected: node.selected,
          content: [
            new HBox({
              width: "100%",
              alignItems: "Center",
              items: [
                textContent,
                new ObjectStatus({
                  text: node.info,
                  state: node.statusState,
                  tooltip: node.tooltip
                }).addStyleClass("cmConstraintRuleTreeStatus")
              ]
            }).addStyleClass("cmConstraintRuleTreeItemContent")
          ]
        }).addStyleClass("cmConstraintRuleTreeItem");
        return item;
      }
    });
    this.rulesTree.addEventDelegate({
      onAfterRendering: () => {
        this.attachRuleContextMenu();
        this.restoreCollapsedRuleGroups();
      }
    });
    this.rulesTree.setLayoutData(
      new FlexItemData({ growFactor: 1, shrinkFactor: 1, baseSize: "0%", minHeight: "0" })
    );

    this.searchField = new SearchField({
      width: "100%",
      placeholder: tr("cmConstraintSearchPlaceholder"),
      liveChange: (event: SearchField$LiveChangeEvent) => {
        this.searchQuery = event.getParameter("newValue") ?? "";
        this.renderRuleList();
      }
    }).addStyleClass("cmConstraintRuleSearch");
    this.statusFilterSelector = new SegmentedButton({
      width: "100%",
      selectedKey: this.statusFilter,
      items: [
        new SegmentedButtonItem({ key: "all", text: tr("cmConstraintFilterAll") }),
        new SegmentedButtonItem({ key: "valid", text: tr("cmConstraintFilterValid") }),
        new SegmentedButtonItem({ key: "conflict", text: tr("cmConstraintFilterConflict") }),
        new SegmentedButtonItem({ key: "draft", text: tr("cmConstraintFilterDraft") }),
        new SegmentedButtonItem({ key: "disabled", text: tr("cmConstraintFilterDisabled") })
      ],
      selectionChange: (event: SegmentedButton$SelectionChangeEvent) => {
        this.statusFilter = event.getParameter("selectedKey") as RuleStatusFilter;
        this.renderRuleList();
      }
    }).addStyleClass("cmConstraintRuleStatusFilter");
    this.statusFilterSelector.setLayoutData(
      new FlexItemData({ growFactor: 1, shrinkFactor: 1, baseSize: "0%", minWidth: "0" })
    );
    const statusFilterRow = new HBox({
      width: "100%",
      items: [this.statusFilterSelector]
    }).addStyleClass("cmConstraintRuleStatusFilterRow");
    this.groupSelector = new Select({
      width: "100%",
      selectedKey: this.groupMode,
      items: [
        new Item({ key: "domain", text: tr("cmConstraintGroupByDomain") }),
        new Item({ key: "type", text: tr("cmConstraintGroupByType") }),
        new Item({ key: "status", text: tr("cmConstraintGroupByStatus") }),
        new Item({ key: "trigger", text: tr("cmConstraintGroupByTrigger") }),
        new Item({ key: "recent", text: tr("cmConstraintGroupByRecent") })
      ],
      change: (event: Select$ChangeEvent) => {
        this.groupMode = event.getSource().getSelectedKey() as RuleGroupingMode;
        this.renderRuleList();
      }
    }).addStyleClass("cmConstraintRuleNavigatorSelect");
    this.sortSelector = new Select({
      width: "100%",
      selectedKey: this.sortMode,
      items: [
        new Item({ key: "modified", text: tr("cmConstraintSortByModified") }),
        new Item({ key: "name", text: tr("cmConstraintSortByName") }),
        new Item({ key: "status", text: tr("cmConstraintSortByStatus") })
      ],
      change: (event: Select$ChangeEvent) => {
        this.sortMode = event.getSource().getSelectedKey() as RuleSortMode;
        this.renderRuleList();
      }
    }).addStyleClass("cmConstraintRuleNavigatorSelect");
    [this.groupSelector, this.sortSelector].forEach((selector) =>
      selector.setLayoutData(
        new FlexItemData({ growFactor: 1, shrinkFactor: 1, baseSize: "0%", minWidth: "0" })
      )
    );
    const groupRow = new HBox({
      width: "100%",
      alignItems: "Center",
      items: [
        new Label({ text: tr("cmConstraintGroupBy"), labelFor: this.groupSelector }).addStyleClass(
          "cmConstraintNavigatorLabel"
        ),
        this.groupSelector
      ]
    }).addStyleClass("cmConstraintNavigatorSelectRow");
    const sortRow = new HBox({
      width: "100%",
      alignItems: "Center",
      items: [
        new Label({ text: tr("cmConstraintSortBy"), labelFor: this.sortSelector }).addStyleClass(
          "cmConstraintNavigatorLabel"
        ),
        this.sortSelector
      ]
    }).addStyleClass("cmConstraintNavigatorSelectRow");
    const navigation = new VBox({
      height: "100%",
      fitContainer: true,
      items: [
        new OverflowToolbar({
          content: [
            new Title({ text: tr("约束规则"), level: "H5" }),
            new ToolbarSpacer(),
            new Button({
              icon: "sap-icon://add",
              tooltip: tr("新建约束"),
              type: "Transparent",
              press: () => this.createRule()
            })
          ]
        }).addStyleClass("cmConstraintRuleNavigationToolbar"),
        this.searchField,
        statusFilterRow,
        groupRow,
        sortRow,
        this.rulesTree
      ]
    }).addStyleClass("cmConstraintRuleNavigation");
    return navigation;
  }

  private renderRuleList(): void {
    if (!this.rulesTree) return;
    const featureCodesByRule = new Map(
      this.rules.map((rule) => [rule.id, this.ruleFeatureCodes(rule)])
    );
    const groups = this.groupRules(
      this.rules.filter((rule) => this.matchesStatusFilter(rule) && this.matchesSearch(rule))
    );
    const navigationGroups: RuleNavigationGroupNode[] = groups.map((group) => ({
      kind: "group",
      key: group.key,
      title: `${group.title} (${group.rules.length})`,
      children: group.rules.map((rule) => {
        const status = this.ruleNavigatorStatus(rule);
        const relatedCount = this.relatedRuleCount(rule, featureCodesByRule);
        return {
          kind: "rule",
          ruleId: rule.id,
          title: rule.name,
          summary: this.ruleSummary(rule),
          info: `●${relatedCount ? ` ↗${relatedCount}` : ""}`,
          statusState: status.state,
          tooltip: `${status.label}${
            relatedCount
              ? ` · ${trFormat("cmConstraintRelatedRulesCount", [relatedCount], `${relatedCount} related rules`)}`
              : ""
          }`,
          selected: rule.id === this.currentRule.id,
          children: []
        };
      })
    }));
    this.rulesModel.setProperty("/navigationGroups", navigationGroups);
    this.updateDeleteRuleButtonState();
  }

  private matchesStatusFilter(rule: ConstraintRule): boolean {
    if (this.statusFilter === "all") return true;
    return this.ruleNavigatorStatus(rule).key === this.statusFilter;
  }

  private matchesSearch(rule: ConstraintRule): boolean {
    const terms = this.searchQuery.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return true;
    const predicates = [
      ...collectConstraintPredicates(rule.ast.condition),
      ...rule.ast.actions.flatMap((action) => collectConstraintPredicates(action.target))
    ];
    const featureText = [...this.ruleFeatureCodes(rule)].flatMap((code) => {
      const feature = this.features.find((item) => item.code === code);
      return feature ? [feature.code, feature.name] : [code];
    });
    const valueText = predicates.flatMap((predicate) => {
      const feature = this.features.find((item) => item.code === predicate.feature);
      const values = Array.isArray(predicate.value) ? predicate.value : [predicate.value];
      return values.flatMap((value) => {
        const literal = String(value);
        if (typeof value !== "string") return [literal];
        const displayValue = feature?.domain.values.find((item) => item.code === value)?.value;
        return displayValue && displayValue !== value ? [literal, displayValue] : [literal];
      });
    });
    const searchable = [
      rule.name,
      rule.code,
      rule.description,
      rule.expression,
      this.ruleSummary(rule),
      rule.status,
      this.businessGroupName(rule),
      rule.ruleType ? constraintActionLabels[rule.ruleType] : "",
      ...featureText,
      ...valueText
    ]
      .join(" ")
      .toLocaleLowerCase();
    return terms.every((term) => searchable.includes(term));
  }

  private ruleNavigatorStatus(rule: ConstraintRule): {
    key: Exclude<RuleStatusFilter, "all">;
    label: string;
    state: "Error" | "Information" | "Success" | "None";
  } {
    if (rule.status === "Disabled")
      return { key: "disabled", label: tr("cmConstraintFilterDisabled"), state: "None" };
    const conflict =
      this.previewConflictRuleIds.has(rule.id) ||
      rule.status === "Conflict" ||
      rule.status === "Invalid" ||
      hasLegacyDefaultConstraintAction(rule);
    if (conflict)
      return { key: "conflict", label: tr("cmConstraintFilterConflict"), state: "Error" };
    if (rule.status === "Draft" || this.unsavedRuleIds.has(rule.id))
      return { key: "draft", label: tr("cmConstraintFilterDraft"), state: "Information" };
    return { key: "valid", label: tr("cmConstraintFilterValid"), state: "Success" };
  }

  private businessGroups() {
    return this.store.groups
      .filter((group) => group.contextId === this.context.id)
      .sort((left, right) => left.sort - right.sort || left.name.localeCompare(right.name));
  }

  private businessGroupName(rule: ConstraintRule): string {
    return (
      this.store.groups.find(
        (group) => group.contextId === this.context.id && group.id === rule.businessGroupId
      )?.name ?? tr("cmConstraintUnclassified")
    );
  }

  private ruleFeatureCodes(rule: ConstraintRule): Set<string> {
    const codes = new Set([
      ...collectConstraintPredicates(rule.ast.condition).map((predicate) => predicate.feature),
      ...rule.ast.actions.flatMap((action) =>
        collectConstraintPredicates(action.target).map((predicate) => predicate.feature)
      )
    ]);
    for (const action of rule.ast.actions) {
      if (action.derivation?.kind === "MAP") codes.add(action.derivation.source);
      else if (action.derivation)
        action.derivation.formula.operands.forEach((operand) => {
          if (operand.kind === "FEATURE") codes.add(operand.feature);
        });
    }
    return codes;
  }

  private ruleGroupDescriptor(rule: ConstraintRule): Omit<RuleListGroup, "rules"> {
    if (this.groupMode === "domain") {
      const businessGroup = this.store.groups.find(
        (group) => group.contextId === this.context.id && group.id === rule.businessGroupId
      );
      return {
        key: `domain:${businessGroup?.id ?? UNCATEGORIZED_BUSINESS_GROUP_ID}`,
        title: businessGroup?.name ?? tr("cmConstraintUnclassified"),
        order: businessGroup?.sort ?? Number.MAX_SAFE_INTEGER
      };
    }

    if (this.groupMode === "type") {
      const types = [...new Set(rule.ast.actions.map((action) => action.type))];
      const type =
        rule.ruleType ?? (types.length === 0 ? "none" : types.length === 1 ? types[0] : "mixed");
      const title =
        type === "none"
          ? tr("cmConstraintNoResults")
          : type === "mixed"
            ? tr("cmConstraintMixedActions")
            : tr(constraintActionLabels[type]);
      const typeOrder = groupActionOrder.indexOf(type as ConstraintActionType);
      return {
        key: `type:${type}`,
        title,
        order: typeOrder < 0 ? groupActionOrder.length : typeOrder
      };
    }

    if (this.groupMode === "status") {
      const status = this.ruleNavigatorStatus(rule);
      const order = { conflict: 0, draft: 1, valid: 2, disabled: 3 } satisfies Record<
        Exclude<RuleStatusFilter, "all">,
        number
      >;
      return {
        key: `status:${status.key}`,
        title: status.label,
        order: order[status.key]
      };
    }

    if (this.groupMode === "trigger") {
      const triggers = [
        ...new Set(
          collectConstraintPredicates(rule.ast.condition)
            .filter((predicate) => predicate.type !== "ALWAYS")
            .map((predicate) => predicate.feature)
        )
      ];
      const title =
        triggers.length === 0
          ? tr("cmConstraintNoTrigger")
          : triggers.length > 1
            ? tr("cmConstraintMultipleTriggers")
            : (this.features.find((feature) => feature.code === triggers[0])?.name ??
              triggers[0] ??
              tr("cmConstraintNoTrigger"));
      return { key: `trigger:${title}`, title, order: 0 };
    }

    const recentGroup = this.recentRuleGroup(rule);
    return {
      key: `recent:${recentGroup.key}`,
      title: recentGroup.title,
      order: recentGroup.order
    };
  }

  private recentRuleGroup(rule: ConstraintRule): { key: string; title: string; order: number } {
    const timestamp = Date.parse(rule.modifiedAt);
    if (!Number.isFinite(timestamp))
      return { key: "earlier", title: tr("cmConstraintGroupEarlier"), order: 2 };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const modified = new Date(timestamp);
    modified.setHours(0, 0, 0, 0);
    const daysAgo = Math.floor((today.getTime() - modified.getTime()) / 86_400_000);
    if (daysAgo <= 0) return { key: "today", title: tr("cmConstraintGroupToday"), order: 0 };
    if (daysAgo === 1)
      return { key: "yesterday", title: tr("cmConstraintGroupYesterday"), order: 1 };
    return { key: "earlier", title: tr("cmConstraintGroupEarlier"), order: 2 };
  }

  private groupRules(rules: ConstraintRule[]): RuleListGroup[] {
    const groups = new Map<string, RuleListGroup>();
    for (const rule of rules) {
      const descriptor = this.ruleGroupDescriptor(rule);
      const group = groups.get(descriptor.key) ?? { ...descriptor, rules: [] };
      group.rules.push(rule);
      groups.set(descriptor.key, group);
    }
    return [...groups.values()]
      .map((group) => ({ ...group, rules: this.sortRules(group.rules) }))
      .sort((left, right) => {
        if (left.order !== right.order) return left.order - right.order;
        return left.title.localeCompare(right.title);
      });
  }

  private sortRules(rules: ConstraintRule[]): ConstraintRule[] {
    return [...rules].sort((left, right) => {
      if (this.sortMode === "name") return left.name.localeCompare(right.name);
      if (this.sortMode === "status") {
        const statusOrder: Record<Exclude<RuleStatusFilter, "all">, number> = {
          conflict: 0,
          draft: 1,
          valid: 2,
          disabled: 3
        };
        const difference =
          statusOrder[this.ruleNavigatorStatus(left).key] -
          statusOrder[this.ruleNavigatorStatus(right).key];
        if (difference) return difference;
        return left.name.localeCompare(right.name);
      }
      return (Date.parse(right.modifiedAt) || 0) - (Date.parse(left.modifiedAt) || 0);
    });
  }

  private restoreCollapsedRuleGroups(): void {
    const tree = this.rulesTree;
    if (!tree || !this.collapsedRuleGroups.size) return;
    const indexes: number[] = [];
    tree.getItems().forEach((item, index) => {
      if (!(item instanceof TreeItemBase)) return;
      const node = item.getBindingContext("rules")?.getObject() as RuleNavigationNode | undefined;
      if (node?.kind === "group" && this.collapsedRuleGroups.has(node.key) && item.getExpanded()) {
        indexes.push(index);
      }
    });
    if (indexes.length) tree.collapse(indexes);
  }

  private relatedRuleCount(
    rule: ConstraintRule,
    featureCodesByRule: ReadonlyMap<string, Set<string>>
  ): number {
    const codes = featureCodesByRule.get(rule.id);
    if (!codes?.size) return 0;
    return this.rules.filter(
      (candidate) =>
        candidate.id !== rule.id &&
        [...(featureCodesByRule.get(candidate.id) ?? [])].some((code) => codes.has(code))
    ).length;
  }

  private updateDeleteRuleButtonState(): void {
    this.deleteRuleButton?.setEnabled(
      this.canEdit() && this.rules.some((rule) => rule.id === this.currentRule.id)
    );
  }

  private attachRuleContextMenu(): void {
    const root = this.rulesTree?.getDomRef();
    if (!root || root === this.ruleContextMenuRoot) return;
    this.detachRuleContextMenu();
    this.ruleContextMenuRoot = root;
    this.ruleContextMenuHandler = (event) => this.openRuleContextMenu(event as MouseEvent);
    root.addEventListener("contextmenu", this.ruleContextMenuHandler);
  }

  private detachRuleContextMenu(): void {
    if (this.ruleContextMenuRoot && this.ruleContextMenuHandler)
      this.ruleContextMenuRoot.removeEventListener("contextmenu", this.ruleContextMenuHandler);
    this.ruleContextMenu?.destroy();
    this.ruleContextMenu = undefined;
    this.ruleContextMenuRoot = undefined;
    this.ruleContextMenuHandler = undefined;
  }

  private openRuleContextMenu(event: MouseEvent): void {
    const tree = this.rulesTree;
    const root = this.ruleContextMenuRoot;
    const target = event.target instanceof Element ? event.target : undefined;
    if (!tree || !root || !target || !this.canEdit()) return;
    const item = tree.getItems().find((candidate) => candidate.getDomRef()?.contains(target));
    const node = item?.getBindingContext("rules")?.getObject() as RuleNavigationNode | undefined;
    const ruleId = node?.kind === "rule" ? node.ruleId : undefined;
    const rule = this.rules.find((candidate) => candidate.id === ruleId);
    if (!ruleId || !rule) return;

    event.preventDefault();
    event.stopPropagation();
    this.ruleContextMenu?.destroy();
    const metadataMenuItem = new UnifiedMenuItem({
      text: tr("cmConstraintEditRuleMetadata"),
      icon: "sap-icon://edit"
    });
    const enableMenuItem = new UnifiedMenuItem({
      text: tr(rule.status === "Disabled" ? "cmConstraintRuleEnable" : "cmConstraintRuleDisable"),
      icon: rule.status === "Disabled" ? "sap-icon://accept" : "sap-icon://decline"
    });
    const deleteMenuItem = new UnifiedMenuItem({
      text: tr("cmConstraintDeleteRule"),
      icon: "sap-icon://delete"
    });
    const menu = new UnifiedMenu({
      items: [metadataMenuItem, enableMenuItem, deleteMenuItem],
      itemSelect: (menuEvent: Event) => {
        const selectedItem = (
          menuEvent as Event & {
            getParameter: (name: "item") => UnifiedMenuItem | undefined;
          }
        ).getParameter("item");
        if (selectedItem?.getId() === metadataMenuItem.getId()) {
          window.setTimeout(() => this.editRuleMetadata(ruleId), 0);
        } else if (selectedItem?.getId() === enableMenuItem.getId()) {
          window.setTimeout(() => this.toggleRuleEnabled(ruleId), 0);
        } else if (selectedItem?.getId() === deleteMenuItem.getId()) {
          window.setTimeout(() => this.confirmDeleteRule(ruleId), 0);
        }
      }
    });
    this.ruleContextMenu = menu;
    tree.addDependent(menu);
    const rootBounds = root.getBoundingClientRect();
    const offset = `${Math.round(event.clientX - rootBounds.left)} ${Math.round(event.clientY - rootBounds.top)}`;
    menu.open(false, target, Popup.Dock.LeftTop, Popup.Dock.LeftTop, root, offset);
  }

  private ruleSummary(rule: ConstraintRule): string {
    const isPendingNewRuleCondition =
      rule.id === this.currentRule.id &&
      this.currentRuleIsNew &&
      !this.designerView?.hasConfiguredCondition();
    const condition = isPendingNewRuleCondition ? "" : this.describeExpression(rule.ast.condition);
    const actions = rule.ast.actions.map((action) => this.describeAction(action)).join(" · ");
    return [condition, actions].filter(Boolean).join(" ");
  }

  private describeAction(action: ConstraintAction): string {
    if (!action.derivation)
      return `${actionSummarySymbols[action.type]} ${this.describeExpression(action.target)}`;
    const target = "feature" in action.target ? action.target.feature : "";
    const name = this.features.find((feature) => feature.code === target)?.name ?? target;
    const sources =
      action.derivation.kind === "MAP"
        ? [action.derivation.source]
        : action.derivation.formula.operands.flatMap((operand) =>
            operand.kind === "FEATURE" ? [operand.feature] : []
          );
    const sourceNames = sources.map(
      (code) => this.features.find((feature) => feature.code === code)?.name ?? code
    );
    return `${actionSummarySymbols[action.type]} ${sourceNames.join(" + ")} → ${name}`;
  }

  private setPreviewConflicts(conflicts: ConstraintConflict[]): void {
    const next = new Set(conflicts.flatMap((conflict) => conflict.ruleIds));
    if (
      next.size === this.previewConflictRuleIds.size &&
      [...next].every((id) => this.previewConflictRuleIds.has(id))
    )
      return;
    this.previewConflictRuleIds.clear();
    next.forEach((id) => this.previewConflictRuleIds.add(id));
    this.renderRuleList();
  }

  private ruleMetadata(rule: ConstraintRule): string {
    const sourceLabels = {
      MANUAL: "Manual",
      BLUEPRINT: "Blueprint",
      AI: "AI Generated"
    } satisfies Record<ConstraintRule["source"]["type"], string>;
    const source = tr(sourceLabels[rule.source.type]);
    return trFormat(
      "cmConstraintRuleMetadata",
      [rule.version, source],
      `V${rule.version} · ${source}`
    );
  }

  private buildRuleDetail(): VBox {
    this.ruleNameInput = new Input({
      width: "11rem",
      value: this.currentRule.name,
      change: (event: InputBase$ChangeEvent) => {
        this.updateWorkingRule(
          { ...this.currentRule, name: event.getSource().getValue() },
          "metadata"
        );
      }
    }).addStyleClass("cmConstraintRuleNameInput");
    this.ruleNameInput.setLayoutData(new OverflowToolbarLayoutData({ priority: "High" }));
    const currentStatus = this.ruleNavigatorStatus(this.currentRule);
    this.detailsStatus = new ObjectStatus({
      text: currentStatus.label,
      state: currentStatus.state
    });
    this.detailsStatus.setLayoutData(new OverflowToolbarLayoutData({ priority: "Low" }));
    this.ruleMetaStatus = new ObjectStatus({
      text: this.ruleMetadata(this.currentRule),
      state: "None"
    });
    this.ruleMetaStatus.setLayoutData(new OverflowToolbarLayoutData({ priority: "Low" }));

    this.expressionEditor = new ConfigurationExpressionEditor({
      rule: this.currentRule,
      rules: this.rules,
      features: this.features,
      onRuleChange: (rule) => this.updateWorkingRule(rule, "expression")
    });
    this.expressionHost = new VBox({
      width: "100%",
      height: "100%",
      fitContainer: true,
      items: [this.expressionEditor.build()]
    }).addStyleClass("cmConstraintModeHost cmConstraintExpressionHost");
    this.blueprintHost = new VBox({
      width: "100%",
      height: "100%",
      fitContainer: true,
      visible: false,
      items: [this.buildEditorColumn()]
    }).addStyleClass("cmConstraintModeHost cmConstraintBlueprintHost");
    this.designerView = new ConfigurationRuleDesignerView({
      store: this.store,
      context: this.context,
      profile: this.profile,
      features: this.features,
      rule: this.currentRule,
      rules: () => this.rulesForPreview(),
      isNewDraft: () => this.currentRuleIsNew,
      canEdit: this.canEdit,
      onRuleChange: (rule) => this.updateWorkingRule(rule, "designer"),
      onApplyAISuggestion: (suggestion, prompt) => this.stageAISuggestion(suggestion, prompt),
      onPreviewConflicts: (conflicts) => this.setPreviewConflicts(conflicts),
      onOpenRule: (ruleId) => this.selectRule(ruleId)
    });
    this.designerHost = new VBox({
      width: "100%",
      height: "100%",
      fitContainer: true,
      items: [this.designerView.build()]
    }).addStyleClass("cmConstraintModeHost cmConstraintDesignerHost");
    this.designerHost.setLayoutData(
      new FlexItemData({ growFactor: 1, shrinkFactor: 1, baseSize: "0%", minHeight: "0" })
    );
    this.designerToolbarItems = this.designerView.buildToolbarItems();
    this.designerHistoryToolbarItems = this.designerView.buildHistoryToolbarItems();
    this.advancedModeSelector = new IconTabBar({
      expandable: false,
      stretchContentHeight: true,
      applyContentPadding: false,
      headerMode: "Inline",
      selectedKey: this.advancedMode,
      items: [
        new IconTabFilter({ key: "expression", text: tr("表达式"), icon: "sap-icon://syntax" }),
        new IconTabFilter({ key: "blueprint", text: tr("蓝图"), icon: "sap-icon://process" })
      ],
      content: [this.expressionHost, this.blueprintHost],
      select: (event: IconTabBar$SelectEvent) =>
        this.setAdvancedMode(event.getParameter("key") as AdvancedWorkspaceMode)
    }).addStyleClass("cmConstraintAdvancedTools");
    this.advancedModeSelector.setLayoutData(
      new FlexItemData({ growFactor: 1, shrinkFactor: 1, baseSize: "0%", minHeight: "0" })
    );
    this.advancedHost = new VBox({
      width: "100%",
      height: "100%",
      fitContainer: true,
      items: [this.advancedModeSelector]
    }).addStyleClass("cmConstraintAdvancedHost");
    this.advancedHost.setLayoutData(
      new FlexItemData({ growFactor: 1, shrinkFactor: 1, baseSize: "0%", minHeight: "0" })
    );
    this.moreToolsButton = new Button({
      text: tr("cmConstraintAdvancedTools"),
      icon: "sap-icon://action-settings",
      type: "Transparent",
      press: () => this.setMode(this.mode === "designer" ? "advanced" : "designer")
    });
    this.moreToolsButton.setLayoutData(
      new OverflowToolbarLayoutData({ priority: "AlwaysOverflow" })
    );
    this.setMode(this.mode);
    this.setAdvancedMode(this.advancedMode);

    const mainFullscreenButton = new Button({
      icon: "sap-icon://full-screen",
      tooltip: "全屏主体内容",
      type: "Transparent",
      press: () => this.onToggleFullscreen()
    });
    this.mainFullscreenButton = mainFullscreenButton;
    mainFullscreenButton.setLayoutData(
      new OverflowToolbarLayoutData({ priority: "NeverOverflow" })
    );
    const deleteRuleButton = new Button({
      icon: "sap-icon://delete",
      tooltip: tr("cmConstraintDeleteRule"),
      type: "Transparent",
      press: () => this.confirmDeleteRule(this.currentRule.id)
    });
    this.deleteRuleButton = deleteRuleButton;
    deleteRuleButton.setLayoutData(new OverflowToolbarLayoutData({ priority: "NeverOverflow" }));
    const saveButton = new Button({
      text: tr("保存规则"),
      icon: "sap-icon://save",
      type: "Emphasized",
      press: () => this.saveCurrentRule()
    });
    saveButton.setLayoutData(new OverflowToolbarLayoutData({ priority: "NeverOverflow" }));
    const ruleCodeText = new Text({ text: "{rules>/currentRule/code}" }).addStyleClass(
      "cmConstraintRuleCode"
    );
    ruleCodeText.setLayoutData(new OverflowToolbarLayoutData({ priority: "Low" }));
    const toolbar = new OverflowToolbar({
      content: [
        this.ruleNameInput,
        ruleCodeText,
        this.ruleMetaStatus,
        this.detailsStatus,
        ...this.designerToolbarItems,
        new ToolbarSpacer(),
        ...this.designerHistoryToolbarItems,
        mainFullscreenButton,
        this.moreToolsButton,
        deleteRuleButton,
        saveButton
      ]
    }).addStyleClass("cmConstraintDetailToolbar");
    return new VBox({
      width: "100%",
      height: "100%",
      fitContainer: true,
      items: [toolbar, this.designerHost, this.advancedHost]
    }).addStyleClass("cmConstraintRuleDetail");
  }

  public rulesForPreview(): ConstraintRule[] {
    return [
      structuredClone(this.currentRule),
      ...this.rules
        .filter((rule) => rule.id !== this.currentRule.id)
        .map((rule) => structuredClone(rule))
    ];
  }

  private setMode(mode: WorkspaceMode): void {
    const shouldRefreshDesigner = mode === "designer" && this.mode !== "designer";
    this.mode = mode;
    this.moreToolsButton?.setText(
      tr(mode === "designer" ? "cmConstraintAdvancedTools" : "cmConstraintWysiwygDesigner")
    );
    this.moreToolsButton?.setIcon(
      mode === "designer" ? "sap-icon://action-settings" : "sap-icon://arrow-left"
    );
    this.designerHost?.setVisible(mode === "designer");
    this.advancedHost?.setVisible(mode === "advanced");
    this.designerView?.setToolbarVisible(mode === "designer");
    if (shouldRefreshDesigner) this.designerView?.refreshLayout();
    if (mode === "advanced" && this.advancedMode === "blueprint") void this.loadBlueprintRule();
  }

  private setAdvancedMode(mode: AdvancedWorkspaceMode): void {
    this.advancedMode = mode;
    this.advancedModeSelector?.setSelectedKey(mode);
    this.expressionHost?.setVisible(mode === "expression");
    this.blueprintHost?.setVisible(mode === "blueprint");
    if (mode === "blueprint") void this.loadBlueprintRule();
  }

  private selectRule(ruleId: string): void {
    const rule = this.rules.find((item) => item.id === ruleId);
    if (!rule) return;
    this.currentRule = structuredClone(rule);
    this.currentRuleIsNew = this.newRuleDraftIds.has(ruleId);
    this.currentRuleDirty = this.unsavedRuleIds.has(ruleId);
    this.blueprintNeedsLoad = true;
    this.rulesModel.setProperty("/currentRule", this.currentRule);
    this.ruleNameInput?.setValue(this.currentRule.name);
    this.ruleMetaStatus?.setText(this.ruleMetadata(this.currentRule));
    const status = this.ruleNavigatorStatus(this.currentRule);
    this.detailsStatus?.setText(status.label);
    this.detailsStatus?.setState(status.state);
    this.expressionEditor?.setRule(this.currentRule);
    this.expressionEditor?.setRules(this.rules);
    this.designerView?.setRule(this.currentRule, this.currentRuleIsNew);
    if (this.mode === "advanced" && this.advancedMode === "blueprint")
      void this.loadBlueprintRule();
    this.renderRuleList();
  }

  private createRule(): void {
    if (!this.canEdit()) return;
    const activeFeatures = this.features.filter((feature) => feature.active);
    if (!activeFeatures.length) {
      MessageToast.show(tr("cmConstraintNoActiveFeatures"));
      return;
    }
    const groups = this.businessGroups();
    if (!groups.length) {
      MessageToast.show(tr("cmConstraintNoBusinessGroups"));
      return;
    }
    const ruleTypes = this.ruleTypeOptions();
    new ConfigurationDialogService(() => this.rulesTree).openEditDialog(
      tr("cmConstraintCreateDialogTitle"),
      this.ruleMetadataFields("", "", undefined, groups, ruleTypes),
      (values) => {
        const metadata = this.readRuleMetadata(values, groups, ruleTypes);
        if (!metadata) return false;
        return this.createRuleInDesigner(metadata);
      },
      undefined,
      { contentWidth: "32rem", draggable: false, resizable: false }
    );
  }

  private ruleTypeOptions(): ConstraintActionType[] {
    return groupActionOrder.filter((type) => type !== "DEFAULT");
  }

  private ruleMetadataFields(
    name: string,
    businessGroupId: string,
    ruleType: ConstraintActionType | undefined,
    groups: ConfigurationStore["groups"],
    ruleTypes: ConstraintActionType[]
  ): Field[] {
    const groupLabels: Record<string, string> = {
      "": tr("cmConstraintSelectBusinessGroup"),
      ...Object.fromEntries(groups.map((group) => [group.id, group.name]))
    };
    const ruleTypeLabels: Record<string, string> = {
      "": tr("cmConstraintSelectRuleType"),
      ...Object.fromEntries(ruleTypes.map((type) => [type, tr(constraintActionLabels[type])]))
    };
    return [
      { key: "name", label: "cmConstraintRuleName", value: name, required: true },
      {
        key: "businessGroupId",
        label: "cmConstraintBusinessGroup",
        value: businessGroupId,
        options: ["", ...groups.map((group) => group.id)],
        optionLabels: groupLabels,
        required: true
      },
      {
        key: "ruleType",
        label: "cmConstraintRuleTypeField",
        value: ruleType ?? "",
        options: ["", ...ruleTypes],
        optionLabels: ruleTypeLabels
      }
    ];
  }

  private readRuleMetadata(
    values: Values,
    groups: ConfigurationStore["groups"],
    ruleTypes: ConstraintActionType[]
  ): RuleMetadata | undefined {
    const name = typeof values.name === "string" ? values.name.trim() : "";
    if (!name) return undefined;
    const businessGroupId =
      typeof values.businessGroupId === "string" ? values.businessGroupId : "";
    if (!groups.some((group) => group.id === businessGroupId)) {
      MessageToast.show(tr("cmConstraintBusinessGroupRequired"));
      return undefined;
    }
    const selectedType = typeof values.ruleType === "string" ? values.ruleType : "";
    if (
      selectedType &&
      (!isConstraintActionType(selectedType) || !ruleTypes.includes(selectedType))
    ) {
      MessageToast.show(tr("cmConstraintRuleTypeInvalid"));
      return undefined;
    }
    return {
      name,
      businessGroupId,
      ...(selectedType ? { ruleType: selectedType as ConstraintActionType } : {})
    };
  }

  private createRuleInDesigner(metadata: RuleMetadata): boolean {
    if (!this.canEdit()) return false;
    const activeFeatures = this.features.filter((feature) => feature.active);
    const sourceFeature =
      activeFeatures.find((feature) => feature.code === "SUNROOF_TYPE") ?? activeFeatures[0];
    if (!sourceFeature) {
      MessageToast.show(tr("cmConstraintNoActiveFeatures"));
      return false;
    }
    const code = this.nextRuleCode();
    const rule = createConstraintRule({
      id: `rule-${globalThis.crypto.randomUUID()}`,
      code,
      name: metadata.name,
      businessGroupId: metadata.businessGroupId,
      ...(metadata.ruleType ? { ruleType: metadata.ruleType } : {}),
      ast: {
        condition: {
          type: "EQUALS",
          feature: sourceFeature.code,
          value: this.defaultFeatureValue(sourceFeature)
        },
        actions: []
      }
    });
    this.rules.push(rule);
    this.unsavedRuleIds.add(rule.id);
    this.newRuleDraftIds.add(rule.id);
    this.currentRule = rule;
    this.currentRuleDirty = true;
    this.currentRuleIsNew = true;
    this.blueprintNeedsLoad = true;
    this.rulesModel.setProperty("/currentRule", rule);
    this.ruleNameInput?.setValue(rule.name);
    this.ruleMetaStatus?.setText(this.ruleMetadata(rule));
    this.detailsStatus?.setText(this.ruleNavigatorStatus(rule).label);
    this.detailsStatus?.setState(this.ruleNavigatorStatus(rule).state);
    this.expressionEditor?.setRule(rule);
    this.expressionEditor?.setRules(this.rules);
    this.designerView?.setRule(rule, true);
    this.designerView?.setDesignMode();
    this.renderRuleList();
    this.setMode("designer");
    return true;
  }

  private editRuleMetadata(ruleId: string): void {
    if (!this.canEdit()) return;
    const rule = this.rules.find((item) => item.id === ruleId);
    if (!rule) return;
    const groups = this.businessGroups();
    if (!groups.length) {
      MessageToast.show(tr("cmConstraintNoBusinessGroups"));
      return;
    }
    const ruleTypes = this.ruleTypeOptions();
    new ConfigurationDialogService(() => this.rulesTree).openEditDialog(
      tr("cmConstraintEditDialogTitle"),
      this.ruleMetadataFields(rule.name, rule.businessGroupId, rule.ruleType, groups, ruleTypes),
      (values) => {
        const metadata = this.readRuleMetadata(values, groups, ruleTypes);
        return metadata ? this.updateRuleMetadata(ruleId, metadata) : false;
      },
      undefined,
      { contentWidth: "32rem", draggable: false, resizable: false }
    );
  }

  private updateRuleMetadata(ruleId: string, metadata: RuleMetadata): boolean {
    if (!this.canEdit()) return false;
    const current = this.rules.find((rule) => rule.id === ruleId);
    if (!current) return false;
    try {
      let updated: ConstraintRule;
      if (this.unsavedRuleIds.has(ruleId)) {
        updated = structuredClone(current);
        updated.name = metadata.name;
        updated.businessGroupId = metadata.businessGroupId;
        if (metadata.ruleType) updated.ruleType = metadata.ruleType;
        else delete updated.ruleType;
        updated.modifiedAt = new Date().toISOString();
      } else {
        updated = this.repository.updateMetadata(this.context.id, ruleId, metadata, this.features);
      }
      this.rules = this.rules.map((rule) => (rule.id === ruleId ? updated : rule));
      this.refreshCurrentRule(updated);
      this.expressionEditor?.setRules(this.rules);
      this.renderRuleList();
      MessageToast.show(tr("cmConstraintMetadataUpdated"));
      return true;
    } catch (error) {
      MessageToast.show(error instanceof Error ? error.message : String(error));
      return false;
    }
  }

  private toggleRuleEnabled(ruleId: string): void {
    if (!this.canEdit()) return;
    const current = this.rules.find((rule) => rule.id === ruleId);
    if (!current) return;
    const enabled = current.status === "Disabled";
    try {
      let updated: ConstraintRule;
      if (this.unsavedRuleIds.has(ruleId)) {
        if (enabled) {
          const { disabledStatus, ...rule } = structuredClone(current);
          updated = {
            ...rule,
            status: disabledStatus ?? "Draft",
            modifiedAt: new Date().toISOString()
          };
        } else {
          updated = {
            ...structuredClone(current),
            status: "Disabled",
            disabledStatus:
              current.status === "Disabled" ? (current.disabledStatus ?? "Draft") : current.status,
            modifiedAt: new Date().toISOString()
          };
        }
      } else {
        updated = this.repository.setEnabled(this.context.id, ruleId, enabled, this.features);
      }
      this.rules = this.rules.map((rule) => (rule.id === ruleId ? updated : rule));
      this.refreshCurrentRule(updated);
      this.expressionEditor?.setRules(this.rules);
      this.renderRuleList();
      MessageToast.show(tr(enabled ? "cmConstraintRuleEnabled" : "cmConstraintRuleDisabled"));
    } catch (error) {
      MessageToast.show(error instanceof Error ? error.message : String(error));
    }
  }

  private refreshCurrentRule(rule: ConstraintRule): void {
    if (this.currentRule.id !== rule.id) return;
    this.currentRule = structuredClone(rule);
    this.currentRuleDirty = this.unsavedRuleIds.has(rule.id);
    this.currentRuleIsNew = this.newRuleDraftIds.has(rule.id);
    this.blueprintNeedsLoad = true;
    this.rulesModel.setProperty("/currentRule", this.currentRule);
    this.ruleNameInput?.setValue(rule.name);
    this.ruleMetaStatus?.setText(this.ruleMetadata(rule));
    const status = this.ruleNavigatorStatus(rule);
    this.detailsStatus?.setText(status.label);
    this.detailsStatus?.setState(status.state);
    this.expressionEditor?.setRule(this.currentRule);
    this.designerView?.setRule(this.currentRule, this.currentRuleIsNew);
    if (this.mode === "advanced" && this.advancedMode === "blueprint")
      void this.loadBlueprintRule();
  }

  private stageAISuggestion(suggestion: ConstraintAISuggestion, prompt: string): boolean {
    if (!this.canEdit() || this.rules.some((rule) => rule.id === suggestion.rule.id)) return false;
    const rule: ConstraintRule = {
      ...structuredClone(suggestion.rule),
      code: this.nextRuleCode(),
      status: "Draft",
      source: { type: "AI", prompt }
    };
    this.rules = [...this.rules, rule];
    this.unsavedRuleIds.add(rule.id);
    this.currentRule = structuredClone(rule);
    this.currentRuleDirty = true;
    this.currentRuleIsNew = false;
    this.blueprintNeedsLoad = true;
    this.rulesModel.setProperty("/currentRule", this.currentRule);
    this.ruleNameInput?.setValue(rule.name);
    this.ruleMetaStatus?.setText(this.ruleMetadata(rule));
    this.detailsStatus?.setText(tr("cmDesignerAIStagedStatus"));
    this.detailsStatus?.setState("Warning");
    this.expressionEditor?.setRules(this.rules);
    this.expressionEditor?.setRule(this.currentRule);
    this.designerView?.setRule(this.currentRule, false);
    this.setMode("designer");
    this.designerView?.setDesignMode();
    this.renderRuleList();
    return true;
  }

  private updateWorkingRule(
    rule: ConstraintRule,
    origin: "designer" | "expression" | "blueprint" | "metadata"
  ): void {
    this.currentRule = {
      ...structuredClone(rule),
      source:
        origin === "blueprint"
          ? { ...rule.source, type: "BLUEPRINT" }
          : origin === "designer"
            ? { ...rule.source, type: "MANUAL" }
            : structuredClone(rule.source)
    };
    this.currentRuleDirty = true;
    const existingIndex = this.rules.findIndex((item) => item.id === rule.id);
    if (existingIndex < 0) this.unsavedRuleIds.add(rule.id);
    this.rules =
      existingIndex < 0
        ? [...this.rules, structuredClone(this.currentRule)]
        : this.rules.map((item) =>
            item.id === rule.id ? structuredClone(this.currentRule) : item
          );
    this.rulesModel.setProperty("/currentRule", this.currentRule);
    this.expressionEditor?.setRules(this.rules);
    this.ruleMetaStatus?.setText(this.ruleMetadata(this.currentRule));
    this.detailsStatus?.setText(tr("未保存变更"));
    this.detailsStatus?.setState("Warning");
    if (origin !== "expression") this.expressionEditor?.setRule(this.currentRule);
    if (origin !== "designer") this.designerView?.setRule(this.currentRule, this.currentRuleIsNew);
    if (origin !== "metadata") this.ruleNameInput?.setValue(this.currentRule.name);
    if (origin !== "blueprint") {
      this.blueprintNeedsLoad = true;
      if (this.mode === "advanced" && this.advancedMode === "blueprint")
        void this.loadBlueprintRule();
    }
    this.renderRuleList();
  }

  private saveCurrentRule(): void {
    if (!this.canEdit()) return;
    if (
      this.currentRuleIsNew &&
      this.currentRule.source.type === "MANUAL" &&
      !this.businessGroups().some((group) => group.id === this.currentRule.businessGroupId)
    ) {
      MessageToast.show(tr("cmConstraintBusinessGroupRequired"));
      return;
    }
    if (!this.expressionEditor?.isExpressionValid()) {
      this.detailsStatus?.setText(tr("表达式语法无效"));
      this.detailsStatus?.setState("Error");
      MessageToast.show(tr("请先修正表达式语法，再保存规则。"));
      return;
    }
    try {
      const saved = this.repository.save(this.context.id, this.currentRule, this.features);
      this.unsavedRuleIds.delete(saved.id);
      this.newRuleDraftIds.delete(saved.id);
      this.rules = this.rules.some((rule) => rule.id === saved.id)
        ? this.rules.map((rule) => (rule.id === saved.id ? saved : rule))
        : [...this.rules, saved];
      this.expressionEditor?.setRules(this.rules);
      this.currentRule = structuredClone(saved);
      this.currentRuleDirty = false;
      this.currentRuleIsNew = false;
      this.ruleMetaStatus?.setText(this.ruleMetadata(saved));
      this.designerView?.setRule(saved, false);
      const status = this.ruleNavigatorStatus(saved);
      this.detailsStatus?.setText(
        status.key === "disabled" || status.key === "conflict"
          ? status.label
          : trFormat("cmConstraintValidatedVersion", [saved.version], `已验证 · V${saved.version}`)
      );
      this.detailsStatus?.setState(status.key === "disabled" ? "None" : status.state);
      this.renderRuleList();
      MessageToast.show(tr("约束规则已保存到当前 Context。"));
    } catch (error) {
      this.detailsStatus?.setText(tr("校验失败"));
      this.detailsStatus?.setState("Error");
      MessageToast.show(error instanceof Error ? error.message : String(error));
    }
  }

  private confirmDeleteRule(ruleId: string): void {
    if (!this.canEdit()) return;
    const rule = this.rules.find((item) => item.id === ruleId);
    if (!rule) return;
    MessageBox.confirm(
      trFormat(
        "cmConstraintDeleteRuleConfirm",
        [rule.name],
        `确定删除约束规则“${rule.name}”？此操作无法撤销。`
      ),
      {
        title: tr("cmConstraintDeleteRule"),
        onClose: (action) => {
          if (action === MessageBox.Action.OK) this.deleteRule(ruleId);
        }
      }
    );
  }

  private deleteRule(ruleId: string): void {
    if (!this.canEdit()) return;
    if (!this.rules.some((rule) => rule.id === ruleId)) return;
    if (!this.unsavedRuleIds.has(ruleId)) {
      try {
        this.repository.remove(this.context.id, ruleId, this.features);
      } catch (error) {
        MessageBox.error(error instanceof Error ? error.message : String(error));
        return;
      }
    }

    this.unsavedRuleIds.delete(ruleId);
    this.newRuleDraftIds.delete(ruleId);
    this.rules = this.rules.filter((rule) => rule.id !== ruleId);
    if (this.currentRule.id === ruleId) {
      const nextRule = this.rules[0];
      if (nextRule) this.selectRule(nextRule.id);
      else this.startEmptyDraft();
    } else {
      this.expressionEditor?.setRules(this.rules);
      this.blueprintNeedsLoad = true;
      if (this.mode === "advanced" && this.advancedMode === "blueprint")
        void this.loadBlueprintRule();
      this.renderRuleList();
    }
    MessageToast.show(tr("cmConstraintRuleDeleted"));
  }

  private startEmptyDraft(): void {
    const rule = this.createNewRule();
    this.currentRule = rule;
    this.currentRuleDirty = false;
    this.currentRuleIsNew = true;
    this.blueprintNeedsLoad = true;
    this.rulesModel.setProperty("/currentRule", rule);
    this.ruleNameInput?.setValue(rule.name);
    this.ruleMetaStatus?.setText(this.ruleMetadata(rule));
    const status = this.ruleNavigatorStatus(rule);
    this.detailsStatus?.setText(status.label);
    this.detailsStatus?.setState(status.state);
    this.expressionEditor?.setRules(this.rules);
    this.expressionEditor?.setRule(rule);
    this.designerView?.setRule(rule, true);
    this.renderRuleList();
    this.setMode("designer");
  }

  private describeExpression(
    expression: ConstraintExpression,
    parentOperator?: "AND" | "OR"
  ): string {
    if ("feature" in expression) {
      const feature = this.features.find((item) => item.code === expression.feature);
      if (expression.type === "STEP" && Array.isArray(expression.value))
        return `${feature?.name ?? expression.feature} ${tr("cmConstraintStep")} ${String(expression.value[1] ?? "")}${feature?.unit ? ` ${feature.unit}` : ""}`;
      const describeValue = (value: string | number | boolean): string => {
        if (typeof value !== "string") return String(value);
        return feature?.domain.values.find((item) => item.code === value)?.value ?? value;
      };
      const value = Array.isArray(expression.value)
        ? expression.value.map(describeValue).join(", ")
        : describeValue(expression.value);
      const operator =
        operatorSummarySymbols[expression.type] ?? tr(constraintOperatorLabels[expression.type]);
      const unit =
        feature && ["Integer", "Decimal", "Range"].includes(feature.dataType) && feature.unit
          ? ` ${feature.unit}`
          : "";
      if (expression.type === "ALWAYS") return tr("cmConstraintAlways");
      return expression.type === "IS_UNSET"
        ? `${feature?.name ?? expression.feature} ${operator}`
        : `${feature?.name ?? expression.feature} ${operator} ${value}${unit}`;
    }
    if ("expression" in expression) {
      const negated = this.describeExpression(expression.expression);
      return trFormat("cmConstraintNegatedCondition", [negated], `不满足（${negated}）`);
    }
    const text = expression.expressions
      .map((child) => this.describeExpression(child, expression.type))
      .join(` ${tr(expression.type === "AND" ? "且" : "或")} `);
    return parentOperator && parentOperator !== expression.type ? `(${text})` : text;
  }

  private nextRuleCode(rules: ConstraintRule[] = this.rules): string {
    const highest = rules.reduce((value, rule) => {
      const match = /^CR-(\d+)$/.exec(rule.code);
      return match ? Math.max(value, Number(match[1])) : value;
    }, 0);
    return `CR-${String(highest + 1).padStart(3, "0")}`;
  }

  private featureLabels(): Record<string, string> {
    return Object.fromEntries(this.features.map((feature) => [feature.code, feature.name]));
  }

  private async loadBlueprintRule(): Promise<void> {
    if (!this.editor) {
      await this.mountEditor();
      return;
    }
    if (!this.blueprintNeedsLoad) return;
    this.editor.loadConstraintAST(
      this.currentRule.ast,
      this.currentRule.blueprint,
      this.featureLabels()
    );
    this.blueprintNeedsLoad = false;
  }

  private buildPalette(): VBox {
    const palette = new VBox({
      width: "13rem",
      items: [
        new Title({ text: tr("节点库"), level: "H5" }),
        new Text({ text: tr("拖动节点并连接端口，组合配置逻辑。") }).addStyleClass(
          "cmBlueprintPaletteIntro"
        ),
        new Label({ text: tr("画布") }).addStyleClass("cmBlueprintSectionLabel"),
        new Button({
          text: tr("范围组"),
          icon: "sap-icon://group-2",
          width: "100%",
          type: "Transparent",
          press: () => this.editor?.addScope()
        }).addStyleClass("cmBlueprintPaletteButton cmBlueprintScopeButton"),
        new Label({ text: tr("配置项") }).addStyleClass("cmBlueprintSectionLabel"),
        this.paletteButton("特征值", "sap-icon://tag", "source"),
        new Label({ text: tr("逻辑") }).addStyleClass("cmBlueprintSectionLabel"),
        this.paletteButton("比较条件", "sap-icon://compare", "condition"),
        this.paletteButton("逻辑 AND", "sap-icon://combine", "logic"),
        new Label({ text: tr("约束") }).addStyleClass("cmBlueprintSectionLabel"),
        this.paletteButton("应用约束", "sap-icon://action", "action"),
        new MessageStrip({
          text: tr("连接输出端口与输入端口，即可表达配置项之间的依赖关系。"),
          type: "Information",
          showIcon: true,
          showCloseButton: false
        }).addStyleClass("cmBlueprintPaletteNote")
      ]
    }).addStyleClass("cmBlueprintPalette");
    return palette;
  }

  private buildEditorColumn(): VBox {
    const palette = this.buildPalette();
    const inspector = this.buildInspector();
    const floatingPanels = new HBox({
      width: "100%",
      height: "100%",
      fitContainer: true,
      justifyContent: "SpaceBetween",
      alignItems: "Start",
      items: [palette, inspector]
    }).addStyleClass("cmBlueprintFloatingLayer");

    this.validationStatus = new ObjectStatus({ text: tr("蓝图结构就绪"), state: "Success" });
    const workspaceToolbar = new OverflowToolbar({
      content: [
        new Title({
          text: tr("配置约束蓝图"),
          level: "H4",
          tooltip: tr("将当前 Constraint AST 映射为可视节点关系")
        }).addStyleClass("cmBlueprintPageTitle"),
        new Text({ text: `${this.context.name} / ${this.currentRule.code}` }).addStyleClass(
          "cmBlueprintCanvasCrumb"
        ),
        new ToolbarSpacer(),
        this.validationStatus,
        new Button({
          text: tr("校验蓝图"),
          icon: "sap-icon://validate",
          press: () => this.validate()
        }),
        new Button({
          text: tr("保存规则"),
          icon: "sap-icon://save",
          press: () => this.saveCurrentRule()
        }),
        new Button({
          text: tr("适配画布"),
          icon: "sap-icon://resize",
          press: () => this.editor?.fit()
        })
      ]
    }).addStyleClass("cmBlueprintWorkspaceToolbar");

    const canvasFooter = new HBox({
      width: "100%",
      items: [
        new Text({ text: tr("滚轮缩放 · 拖动画布平移 · 拖动端口创建连接") }),
        new ToolbarSpacer(),
        new Text({ text: "Rete.js · Constraint AST" })
      ]
    }).addStyleClass("cmBlueprintCanvasFooter");

    const canvasFrame = new VBox({
      width: "100%",
      height: "100%",
      fitContainer: true,
      items: [this.graphHost, floatingPanels]
    }).addStyleClass("cmBlueprintCanvasFrame");

    const column = new VBox({
      width: "100%",
      height: "100%",
      fitContainer: true,
      items: [workspaceToolbar, canvasFrame, canvasFooter]
    }).addStyleClass("cmBlueprintEditorColumn");
    return column;
  }

  private buildInspector(): VBox {
    this.blueprintInspectorFields = new VBox({
      width: "100%",
      items: [new Text({ text: tr("选择条件节点以编辑 Feature、操作符和值域。") })]
    }).addStyleClass("cmBlueprintInspectorForm");
    const inspector = new VBox({
      width: "17rem",
      items: [
        new OverflowToolbar({
          content: [
            new Title({ text: tr("规则属性"), level: "H5" }),
            new ToolbarSpacer(),
            new ObjectStatus({ text: "{rules>/currentRule/status}", state: "Information" })
          ]
        }).addStyleClass("cmBlueprintInspectorToolbar"),
        new Label({ text: tr("约束表达式") }),
        new Text({ text: "{rules>/currentRule/expression}", wrapping: true }).addStyleClass(
          "cmBlueprintInspectorExpression"
        ),
        this.blueprintInspectorFields,
        new MessageStrip({
          text: tr("蓝图节点选择和连线调整直接同步到当前 Constraint AST。"),
          type: "Information",
          showIcon: true,
          showCloseButton: false
        }).addStyleClass("cmBlueprintInspectorNote")
      ]
    }).addStyleClass("cmBlueprintInspector");
    inspector.setLayoutData(new FlexItemData({ growFactor: 0, shrinkFactor: 0 }));
    return inspector;
  }

  private renderBlueprintSelection(selection?: BlueprintPredicateSelection): void {
    this.blueprintSelection = selection;
    if (!this.blueprintInspectorFields) return;
    this.blueprintInspectorFields.destroyItems();
    if (!selection) {
      this.blueprintInspectorFields.addItem(
        new Text({ text: tr("选择特征/约束节点后，可在此编辑其条件。") })
      );
      return;
    }
    const feature = this.features.find((item) => item.code === selection.predicate.feature);
    if (!feature) return;
    if (selection.actionType === "DEFAULT") {
      this.blueprintInspectorFields.addItem(
        new MessageStrip({
          text: tr("cmConstraintLegacyDefaultMigration"),
          type: "Warning",
          showIcon: true
        })
      );
      return;
    }
    if (selection.isDerived || selection.predicate.type === "STEP") {
      this.blueprintInspectorFields.addItem(
        new MessageStrip({
          text: tr(
            selection.isDerived ? "cmConstraintDerivedEditWysiwyg" : "cmConstraintStepEditWysiwyg"
          ),
          type: "Information",
          showIcon: true
        })
      );
      return;
    }
    this.blueprintInspectorFields.addItem(new Label({ text: tr("Feature") }));
    this.blueprintInspectorFields.addItem(
      new Select({
        width: "100%",
        selectedKey: feature.code,
        items: this.features.map(
          (item) =>
            new Item({
              key: item.code,
              text: `${item.name} · ${item.code}${item.active ? "" : ` · ${tr("已停用")}`}`,
              enabled: item.active
            })
        ),
        change: (event: Select$ChangeEvent) => {
          const nextFeature = this.features.find(
            (item) => item.code === event.getSource().getSelectedKey()
          );
          if (nextFeature)
            this.updateBlueprintPredicate(selection, {
              type: "EQUALS",
              feature: nextFeature.code,
              value: this.defaultFeatureValue(nextFeature)
            });
        }
      })
    );
    this.blueprintInspectorFields.addItem(new Label({ text: tr("操作符") }));
    this.blueprintInspectorFields.addItem(
      new Select({
        width: "100%",
        selectedKey: selection.predicate.type,
        items: [
          ...constraintOperatorsFor(feature.dataType, selection.actionType),
          ...(selection.predicate.type === "IS_UNSET" || selection.predicate.type === "ALWAYS"
            ? [selection.predicate.type]
            : [])
        ].map(
          (operator) => new Item({ key: operator, text: tr(constraintOperatorLabels[operator]) })
        ),
        change: (event: Select$ChangeEvent) => {
          const operator = event.getSource().getSelectedKey() as ConstraintOperator;
          const value =
            operator === "IN" || operator === "NOT_IN"
              ? Array.isArray(selection.predicate.value)
                ? selection.predicate.value
                : [selection.predicate.value]
              : Array.isArray(selection.predicate.value)
                ? (selection.predicate.value[0] ?? "")
                : selection.predicate.value;
          this.updateBlueprintPredicate(selection, {
            ...selection.predicate,
            type: operator,
            value
          });
        }
      })
    );
    if (selection.predicate.type !== "IS_UNSET" && selection.predicate.type !== "ALWAYS") {
      this.blueprintInspectorFields.addItem(new Label({ text: tr("允许值") }));
      this.blueprintInspectorFields.addItem(this.buildBlueprintValueControl(selection, feature));
    }
  }

  private buildBlueprintValueControl(
    selection: BlueprintPredicateSelection,
    feature: FeatureDefinition
  ): Input | Select | MultiComboBox {
    const predicate = selection.predicate;
    const currentValue = predicate.value;
    if (predicate.type.startsWith("COUNT_"))
      return new Input({
        width: "100%",
        type: "Number",
        value: String(currentValue),
        change: (event: InputBase$ChangeEvent) => {
          const value = event.getSource().getValue();
          this.updateBlueprintPredicate(selection, {
            ...predicate,
            value: value.trim() ? Number(value) : Number.NaN
          });
        }
      });
    if (feature.dataType === "Boolean")
      return new Select({
        width: "100%",
        selectedKey: String(currentValue),
        items: [
          new Item({ key: "true", text: tr("Yes") }),
          new Item({ key: "false", text: tr("No") })
        ],
        change: (event: Select$ChangeEvent) =>
          this.updateBlueprintPredicate(selection, {
            ...predicate,
            value: event.getSource().getSelectedKey() === "true"
          })
      });
    if (
      feature.dataType === "Multi Enumeration" &&
      selection.actionType &&
      ["SET", "RECOMMEND"].includes(selection.actionType)
    )
      return new MultiComboBox({
        width: "100%",
        selectedKeys: (Array.isArray(currentValue) ? currentValue : [currentValue]).map(String),
        items: feature.domain.values
          .filter((item) => item.active)
          .map((item) => new Item({ key: item.code, text: item.value })),
        selectionFinish: (event: MultiComboBox$SelectionFinishEvent) =>
          this.updateBlueprintPredicate(selection, {
            ...predicate,
            type: "EQUALS",
            value: event.getSource().getSelectedKeys()
          })
      });
    if (
      ["Enumeration", "Reference", "Multi Enumeration"].includes(feature.dataType) &&
      predicate.type !== "IN" &&
      predicate.type !== "NOT_IN"
    )
      return new Select({
        width: "100%",
        selectedKey: String(currentValue),
        items: feature.domain.values
          .filter((item) => item.active)
          .map((item) => new Item({ key: item.code, text: item.value })),
        change: (event: Select$ChangeEvent) =>
          this.updateBlueprintPredicate(selection, {
            ...predicate,
            value: event.getSource().getSelectedKey()
          })
      });
    if (
      ["IN", "NOT_IN"].includes(predicate.type) &&
      feature.domain.values.some((item) => item.active)
    )
      return new MultiComboBox({
        width: "100%",
        selectedKeys: (Array.isArray(currentValue) ? currentValue : [currentValue]).map(String),
        items: feature.domain.values
          .filter((item) => item.active)
          .map((item) => new Item({ key: item.code, text: item.value })),
        selectionFinish: (event: MultiComboBox$SelectionFinishEvent) =>
          this.updateBlueprintPredicate(selection, {
            ...predicate,
            value: event.getSource().getSelectedKeys()
          })
      });
    if (predicate.type === "IN" || predicate.type === "NOT_IN") {
      const numeric = ["Integer", "Decimal", "Range"].includes(feature.dataType);
      return new Input({
        width: "100%",
        value: (Array.isArray(currentValue) ? currentValue : [currentValue]).join(", "),
        change: (event: InputBase$ChangeEvent) => {
          const value = event
            .getSource()
            .getValue()
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
          this.updateBlueprintPredicate(selection, {
            ...predicate,
            value: value.map((item) => (numeric ? Number(item) : item))
          });
        }
      });
    }
    const numeric = ["Integer", "Decimal", "Range"].includes(feature.dataType);
    return new Input({
      width: "100%",
      type: numeric ? "Number" : "Text",
      value: String(currentValue),
      change: (event: InputBase$ChangeEvent) => {
        const raw = event.getSource().getValue();
        this.updateBlueprintPredicate(selection, {
          ...predicate,
          value: numeric && raw !== "" ? Number(raw) : raw
        });
      }
    });
  }

  private updateBlueprintPredicate(
    selection: BlueprintPredicateSelection,
    predicate: ConstraintPredicate
  ): void {
    this.editor?.updatePredicate(selection.id, predicate);
  }

  private defaultFeatureValue(feature: FeatureDefinition): string | number | boolean {
    if (feature.dataType === "Boolean") return false;
    if (["Integer", "Decimal", "Range"].includes(feature.dataType))
      return feature.domain.minimum ?? 0;
    return feature.domain.values.find((item) => item.active)?.code ?? "";
  }

  private createNewRule(): ConstraintRule {
    const activeFeatures = this.features.filter((feature) => feature.active);
    const sourceFeature =
      activeFeatures.find((feature) => feature.code === "SUNROOF_TYPE") ?? activeFeatures[0];
    if (!sourceFeature) {
      const predicate = { type: "EQUALS" as const, feature: "UNKNOWN", value: "" };
      return createConstraintRule({
        id: `rule-${globalThis.crypto.randomUUID()}`,
        code: "CR-001",
        name: "新建约束",
        ast: {
          condition: predicate,
          actions: []
        }
      });
    }
    return createConstraintRule({
      id: `rule-${globalThis.crypto.randomUUID()}`,
      code: this.nextRuleCode(),
      name: "新建约束",
      ast: {
        condition: {
          type: "EQUALS",
          feature: sourceFeature.code,
          value: this.defaultFeatureValue(sourceFeature)
        },
        actions: []
      }
    });
  }

  private paletteButton(text: string, icon: string, kind: NodeKind): Button {
    return new Button({
      text: tr(text),
      icon,
      width: "100%",
      type: "Transparent",
      press: () => this.editor?.addNode(kind)
    }).addStyleClass("cmBlueprintPaletteButton");
  }

  private async mountEditor(): Promise<void> {
    const domRef = this.graphHost.getDomRef();
    if (!domRef || this.editor) return;
    const host = domRef as HTMLElement;
    try {
      await loadBlueprintBundle();
      if (this.graphHost.getDomRef() !== domRef || this.editor || !window.ConfigurationBlueprint)
        return;
      this.editor = window.ConfigurationBlueprint.mount(host);
      this.editor.setOnBlueprintChange((ast, blueprint) => {
        this.updateWorkingRule(
          {
            ...this.currentRule,
            ast,
            blueprint,
            expression: formatConstraintExpression(ast)
          },
          "blueprint"
        );
      });
      this.editor.setOnPredicateSelection((selection) => this.renderBlueprintSelection(selection));
      this.editor.loadConstraintAST(
        this.currentRule.ast,
        this.currentRule.blueprint,
        this.featureLabels()
      );
      this.blueprintNeedsLoad = false;
    } catch (error) {
      MessageToast.show(error instanceof Error ? error.message : tr("约束蓝图编辑器加载失败"));
    }
  }

  private validate(): void {
    if (!this.editor) return;
    const ast = this.editor.exportConstraintAST();
    if (ast)
      this.updateWorkingRule(
        {
          ...this.currentRule,
          ast,
          blueprint: this.editor.exportConstraintBlueprint(),
          expression: formatConstraintExpression(ast)
        },
        "blueprint"
      );
    const { nodes, connections } = this.editor.validate();
    const issues = validateConstraintRule(this.currentRule, this.rules, this.features);
    const valid =
      nodes > 1 && connections > 0 && !issues.some((issue) => issue.severity === "Error");
    this.validationStatus?.setText(
      valid
        ? trFormat("cmConstraintBlueprintNodesValid", [nodes], `基础校验通过 · ${nodes} 个节点`)
        : tr("尚无有效连接")
    );
    this.validationStatus?.setState(valid ? "Success" : "Warning");
    MessageToast.show(
      valid
        ? trFormat(
            "cmConstraintBlueprintConnectionsValid",
            [connections],
            `蓝图结构有效，共 ${connections} 条连接。`
          )
        : tr("请先连接节点，再校验蓝图。")
    );
    this.editor.fit();
  }
}
