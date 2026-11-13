import Button from "sap/m/Button";
import CheckBox from "sap/m/CheckBox";
import FlexItemData from "sap/m/FlexItemData";
import HBox from "sap/m/HBox";
import IconTabBar from "sap/m/IconTabBar";
import IconTabFilter from "sap/m/IconTabFilter";
import Input from "sap/m/Input";
import Label from "sap/m/Label";
import List from "sap/m/List";
import MessageStrip from "sap/m/MessageStrip";
import MessageToast from "sap/m/MessageToast";
import MultiComboBox from "sap/m/MultiComboBox";
import ObjectStatus from "sap/m/ObjectStatus";
import OverflowToolbar from "sap/m/OverflowToolbar";
import OverflowToolbarLayoutData from "sap/m/OverflowToolbarLayoutData";
import SegmentedButton from "sap/m/SegmentedButton";
import SegmentedButtonItem from "sap/m/SegmentedButtonItem";
import Select from "sap/m/Select";
import StandardListItem from "sap/m/StandardListItem";
import type { Select$ChangeEvent } from "sap/m/Select";
import type { IconTabBar$SelectEvent } from "sap/m/IconTabBar";
import type { ListBase$ItemPressEvent } from "sap/m/ListBase";
import type { InputBase$ChangeEvent } from "sap/m/InputBase";
import type { MultiComboBox$SelectionFinishEvent } from "sap/m/MultiComboBox";
import type { SegmentedButton$SelectionChangeEvent } from "sap/m/SegmentedButton";
import TextArea from "sap/m/TextArea";
import Text from "sap/m/Text";
import Title from "sap/m/Title";
import ToolbarSpacer from "sap/m/ToolbarSpacer";
import Item from "sap/ui/core/Item";
import VBox from "sap/m/VBox";
import JSONModel from "sap/ui/model/json/JSONModel";
import Control from "sap/ui/core/Control";
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
  validateConstraintRule
} from "../../model/constraintRules";
import type {
  ConstraintAIResponse,
  ConstraintAISuggestion,
  ConstraintAIStage
} from "../../service/mockConstraintAIService";
import { MockConstraintAIService } from "../../service/mockConstraintAIService";
import { ConstraintRuleRepository } from "../../service/constraintRuleRepository";
import type {
  ConstraintActionType,
  ConstraintExpression,
  ConstraintOperator,
  ConstraintPredicate,
  ConstraintRule
} from "../../model/constraintRules";
import type { BlueprintPredicateSelection } from "../../blueprint/constraint-blueprint";
import { tr, trFormat } from "../../util/configurationUi";
import ConfigurationExpressionEditor from "./ConfigurationExpressionEditor";
import ConfigurationRuleDesignerView from "./ConfigurationRuleDesignerView";

type NodeKind = "source" | "condition" | "logic" | "action";
type WorkspaceMode = "designer" | "advanced";
type AdvancedWorkspaceMode = "expression" | "blueprint" | "assistant";

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
}

export default class ConfigurationRuleWorkspaceView {
  private readonly graphHost: VBox;
  private readonly rulesModel: JSONModel;
  private readonly store: ConfigurationStore;
  private readonly context: ConfigurationContext;
  private readonly profile: ConfigurationProfile;
  private features: FeatureDefinition[];
  private readonly repository: ConstraintRuleRepository;
  private readonly canEdit: () => boolean;
  private readonly aiService = new MockConstraintAIService();
  private rules: ConstraintRule[];
  private currentRule: ConstraintRule;
  private currentRuleDirty = false;
  private currentRuleIsNew = false;
  private mode: WorkspaceMode = "designer";
  private advancedMode: AdvancedWorkspaceMode = "expression";
  private rulesList?: List;
  private detailsStatus?: ObjectStatus;
  private ruleMetaStatus?: ObjectStatus;
  private expressionEditor?: ConfigurationExpressionEditor;
  private expressionHost?: VBox;
  private blueprintHost?: VBox;
  private assistantHost?: VBox;
  private designerHost?: VBox;
  private advancedHost?: VBox;
  private assistantPrompt?: TextArea;
  private assistantStatus?: ObjectStatus;
  private assistantGenerateButton?: Button;
  private assistantApplyButton?: Button;
  private assistantResults?: VBox;
  private assistantAmbiguity?: VBox;
  private assistantSuggestions: ConstraintAISuggestion[] = [];
  private assistantClarification?: string;
  private assistantAmbiguityChoice?: string;
  private assistantRunId = 0;
  private pendingAmbiguity?: ConstraintAIResponse["ambiguity"];
  private readonly ruleByListItemId = new Map<string, string>();
  private modeSelector?: SegmentedButton;
  private advancedModeSelector?: IconTabBar;
  private designerView?: ConfigurationRuleDesignerView;
  private designerToolbarItems: Control[] = [];
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
    this.rules = this.repository.list(this.context.id, this.features);
    this.currentRuleIsNew = this.rules.length === 0;
    this.currentRule = this.rules[0] ?? this.createNewRule();
    this.rulesModel = new JSONModel({ currentRule: this.currentRule });
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
    this.disposeEditor();
  }

  public setFeatures(features: FeatureDefinition[]): void {
    if (JSON.stringify(this.features) === JSON.stringify(features)) return;
    this.features = features;
    this.expressionEditor?.setFeatures(features);
    this.designerView?.setFeatures(features);
    this.blueprintNeedsLoad = true;
    if (this.mode === "advanced" && this.advancedMode === "blueprint")
      void this.loadBlueprintRule();
    this.renderAssistantSuggestions();
  }

  private disposeEditor(): void {
    this.editor?.destroy();
    this.editor = undefined;
  }

  private buildRuleNavigation(): VBox {
    this.rulesList = new List({
      width: "100%",
      mode: "SingleSelectMaster",
      includeItemInSelection: true,
      noDataText: tr("暂无约束规则"),
      itemPress: (event: ListBase$ItemPressEvent) => {
        const item = event.getParameter("listItem");
        const ruleId = item && this.ruleByListItemId.get(item.getId());
        if (ruleId) this.selectRule(ruleId);
      }
    }).addStyleClass("cmConstraintRuleList");
    this.rulesList.setLayoutData(
      new FlexItemData({ growFactor: 1, shrinkFactor: 1, baseSize: "0%", minHeight: "0" })
    );
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
        }),
        this.rulesList
      ]
    }).addStyleClass("cmConstraintRuleNavigation");
    return navigation;
  }

  private renderRuleList(): void {
    if (!this.rulesList) return;
    this.ruleByListItemId.clear();
    this.rulesList.destroyItems();
    this.rules.forEach((rule) => {
      const item = new StandardListItem({
        title: rule.name,
        description: this.ruleSummary(rule),
        info: rule.status,
        infoState:
          rule.status === "Valid" ? "Success" : rule.status === "Invalid" ? "Error" : "Information",
        type: "Active",
        wrapping: true
      });
      this.ruleByListItemId.set(item.getId(), rule.id);
      this.rulesList?.addItem(item);
      if (rule.id === this.currentRule.id) this.rulesList?.setSelectedItem(item, true);
    });
  }

  private ruleSummary(rule: ConstraintRule): string {
    const isPendingNewRuleCondition =
      rule.id === this.currentRule.id &&
      this.currentRuleIsNew &&
      !this.designerView?.hasConfiguredCondition();
    const condition = isPendingNewRuleCondition ? "" : this.describeExpression(rule.ast.condition);
    const actions = rule.ast.actions
      .map((action) => `${this.actionLabel(action.type)} ${this.describeExpression(action.target)}`)
      .join("; ");
    return [condition, actions].filter(Boolean).join(" → ");
  }

  private actionLabel(type: ConstraintActionType): string {
    const labels: Record<ConstraintActionType, string> = {
      REQUIRE: "要求",
      EXCLUDE: "互斥",
      SET: "设置",
      RESTRICT: "限制",
      DERIVE: "派生"
    };
    return tr(labels[type]);
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
      width: "13rem",
      value: this.currentRule.name,
      change: (event: InputBase$ChangeEvent) => {
        this.updateWorkingRule(
          { ...this.currentRule, name: event.getSource().getValue() },
          "metadata"
        );
      }
    }).addStyleClass("cmConstraintRuleNameInput");
    this.detailsStatus = new ObjectStatus({ text: this.currentRule.status, state: "Information" });
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
    this.assistantHost = this.buildAssistantWorkspace();
    this.designerView = new ConfigurationRuleDesignerView({
      store: this.store,
      context: this.context,
      profile: this.profile,
      features: this.features,
      rule: this.currentRule,
      rules: () => this.rulesForPreview(),
      isNewDraft: () => this.currentRuleIsNew,
      canEdit: this.canEdit,
      onRuleChange: (rule) => this.updateWorkingRule(rule, "designer")
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
    this.advancedModeSelector = new IconTabBar({
      expandable: false,
      stretchContentHeight: true,
      applyContentPadding: false,
      headerMode: "Inline",
      selectedKey: this.advancedMode,
      items: [
        new IconTabFilter({ key: "expression", text: tr("表达式"), icon: "sap-icon://syntax" }),
        new IconTabFilter({ key: "blueprint", text: tr("蓝图"), icon: "sap-icon://process" }),
        new IconTabFilter({ key: "assistant", text: tr("AI 助手"), icon: "sap-icon://da" })
      ],
      content: [this.expressionHost, this.blueprintHost, this.assistantHost],
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
    this.modeSelector = new SegmentedButton({
      width: "15rem",
      selectedKey: this.mode,
      items: [
        new SegmentedButtonItem({
          key: "designer",
          text: tr("cmConstraintWysiwygDesigner")
        }),
        new SegmentedButtonItem({
          key: "advanced",
          text: tr("cmConstraintAdvancedTools")
        })
      ],
      selectionChange: (event: SegmentedButton$SelectionChangeEvent) =>
        this.setMode(event.getParameter("selectedKey") as WorkspaceMode)
    }).addStyleClass("cmConstraintWorkspaceModeSelector");
    this.setMode(this.mode);
    this.setAdvancedMode(this.advancedMode);

    const saveButton = new Button({
      text: tr("保存规则"),
      icon: "sap-icon://save",
      type: "Emphasized",
      press: () => this.saveCurrentRule()
    });
    saveButton.setLayoutData(new OverflowToolbarLayoutData({ priority: "NeverOverflow" }));
    const toolbar = new OverflowToolbar({
      content: [
        this.ruleNameInput,
        new Text({ text: "{rules>/currentRule/code}" }).addStyleClass("cmConstraintRuleCode"),
        this.ruleMetaStatus,
        this.detailsStatus,
        this.modeSelector,
        ...this.designerToolbarItems,
        new ToolbarSpacer(),
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
    this.modeSelector?.setSelectedKey(mode);
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
    this.assistantHost?.setVisible(mode === "assistant");
    if (mode === "blueprint") void this.loadBlueprintRule();
  }

  private selectRule(ruleId: string): void {
    const rule = this.rules.find((item) => item.id === ruleId);
    if (!rule) return;
    this.currentRule = structuredClone(rule);
    this.currentRuleDirty = false;
    this.currentRuleIsNew = false;
    this.blueprintNeedsLoad = true;
    this.rulesModel.setProperty("/currentRule", this.currentRule);
    this.ruleNameInput?.setValue(this.currentRule.name);
    this.ruleMetaStatus?.setText(this.ruleMetadata(this.currentRule));
    this.detailsStatus?.setText(this.currentRule.status);
    this.expressionEditor?.setRule(this.currentRule);
    this.expressionEditor?.setRules(this.rules);
    this.designerView?.setRule(this.currentRule, false);
    if (this.mode === "advanced" && this.advancedMode === "blueprint")
      void this.loadBlueprintRule();
    this.renderRuleList();
  }

  private createRule(): void {
    if (!this.canEdit()) return;
    const activeFeatures = this.features.filter((feature) => feature.active);
    const sourceFeature =
      activeFeatures.find((feature) => feature.code === "SUNROOF_TYPE") ?? activeFeatures[0];
    if (!sourceFeature) {
      MessageToast.show(tr("当前 Context 尚无可用于约束的 Feature。"));
      return;
    }
    const code = this.nextRuleCode();
    const sequence = Number(code.slice("CR-".length));
    const rule = createConstraintRule({
      id: `rule-${globalThis.crypto.randomUUID()}`,
      code,
      name: `新建约束 ${String(sequence).padStart(3, "0")}`,
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
    this.currentRule = rule;
    this.currentRuleDirty = true;
    this.currentRuleIsNew = true;
    this.blueprintNeedsLoad = true;
    this.rulesModel.setProperty("/currentRule", rule);
    this.ruleNameInput?.setValue(rule.name);
    this.ruleMetaStatus?.setText(this.ruleMetadata(rule));
    this.expressionEditor?.setRule(rule);
    this.expressionEditor?.setRules(this.rules);
    this.designerView?.setRule(rule, true);
    this.renderRuleList();
    this.setMode("designer");
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
    if (!this.expressionEditor?.isExpressionValid()) {
      this.detailsStatus?.setText(tr("表达式语法无效"));
      this.detailsStatus?.setState("Error");
      MessageToast.show(tr("请先修正表达式语法，再保存规则。"));
      return;
    }
    try {
      const saved = this.repository.save(this.context.id, this.currentRule, this.features);
      this.rules = this.rules.some((rule) => rule.id === saved.id)
        ? this.rules.map((rule) => (rule.id === saved.id ? saved : rule))
        : [...this.rules, saved];
      this.expressionEditor?.setRules(this.rules);
      this.currentRule = structuredClone(saved);
      this.currentRuleDirty = false;
      this.currentRuleIsNew = false;
      this.ruleMetaStatus?.setText(this.ruleMetadata(saved));
      this.designerView?.setRule(saved, false);
      this.assistantSuggestions = this.assistantSuggestions.filter(
        (suggestion) => suggestion.id !== saved.id
      );
      this.renderAssistantSuggestions();
      this.detailsStatus?.setText(
        trFormat("cmConstraintValidatedVersion", [saved.version], `已验证 · V${saved.version}`)
      );
      this.detailsStatus?.setState("Success");
      this.renderRuleList();
      MessageToast.show(tr("约束规则已保存到当前 Context。"));
    } catch (error) {
      this.detailsStatus?.setText(tr("校验失败"));
      this.detailsStatus?.setState("Error");
      MessageToast.show(error instanceof Error ? error.message : String(error));
    }
  }

  private buildAssistantWorkspace(): VBox {
    this.assistantPrompt = new TextArea({
      width: "100%",
      rows: 4,
      value: "全景天窗必须配高级内饰，并且不能选择车顶行李架B。",
      valueLiveUpdate: true,
      liveChange: () => {
        this.assistantClarification = undefined;
        this.assistantAmbiguityChoice = undefined;
        this.pendingAmbiguity = undefined;
        this.assistantRunId += 1;
        this.assistantSuggestions = [];
        this.assistantAmbiguity?.setVisible(false);
        this.assistantResults?.destroyItems();
        this.assistantGenerateButton?.setEnabled(true);
        this.assistantApplyButton?.setEnabled(false);
        this.assistantStatus?.setText(tr("等待需求"));
        this.assistantStatus?.setState("None");
      }
    });
    this.assistantStatus = new ObjectStatus({ text: tr("等待需求"), state: "None" });
    this.assistantGenerateButton = new Button({
      text: tr("生成约束"),
      icon: "sap-icon://create",
      type: "Emphasized",
      press: () => void this.generateAI()
    });
    this.assistantApplyButton = new Button({
      text: trFormat("cmConstraintApplySelectedCount", [0], "应用选中 (0)"),
      icon: "sap-icon://accept",
      type: "Emphasized",
      enabled: false,
      press: () => this.applySelectedAISuggestions()
    });
    this.assistantResults = new VBox({ width: "100%" }).addStyleClass("cmConstraintAIResults");
    this.assistantAmbiguity = new VBox({ width: "100%", visible: false }).addStyleClass(
      "cmConstraintAIAmbiguity"
    );
    return new VBox({
      width: "100%",
      height: "100%",
      fitContainer: true,
      items: [
        new OverflowToolbar({
          content: [
            new Title({ text: tr("Configuration Engineering Assistant"), level: "H5" }),
            new ToolbarSpacer(),
            this.assistantApplyButton,
            this.assistantStatus,
            new Button({
              text: tr("重新生成"),
              icon: "sap-icon://refresh",
              type: "Transparent",
              press: () => void this.generateAI()
            })
          ]
        }).addStyleClass("cmConstraintAIToolbar"),
        new VBox({
          width: "100%",
          items: [
            new Label({ text: tr("自然语言需求") }),
            this.assistantPrompt,
            new Text({
              text: tr("Mock Assistant · 生成结果需经人工审核后才会写入当前规则集。")
            }).addStyleClass("cmConstraintAIHint"),
            this.assistantGenerateButton
          ]
        }).addStyleClass("cmConstraintAIInput"),
        this.assistantAmbiguity,
        this.assistantResults
      ]
    }).addStyleClass("cmConstraintAssistant");
  }

  private async generateAI(): Promise<void> {
    if (!this.canEdit()) return;
    const prompt = this.assistantPrompt?.getValue().trim() ?? "";
    if (!prompt) {
      this.assistantStatus?.setText(tr("请输入需求"));
      this.assistantStatus?.setState("Warning");
      return;
    }
    const runId = ++this.assistantRunId;
    this.assistantSuggestions = [];
    this.pendingAmbiguity = undefined;
    this.assistantAmbiguityChoice = undefined;
    this.assistantAmbiguity?.setVisible(false);
    this.assistantResults?.destroyItems();
    this.assistantApplyButton?.setEnabled(false);
    this.assistantGenerateButton?.setEnabled(false);
    this.assistantStatus?.setState("Information");
    const stageLabels: Record<ConstraintAIStage, string> = {
      ANALYZING_REQUEST: tr("分析需求…"),
      IDENTIFYING_FEATURES: tr("识别 Feature…"),
      IDENTIFYING_VALUES: tr("识别 Value…"),
      ANALYZING_RELATIONSHIPS: tr("分析逻辑关系…"),
      GENERATING_RULES: tr("生成约束…"),
      VALIDATING_RULES: tr("验证约束…")
    };
    try {
      const response = await this.aiService.generate(
        {
          prompt,
          features: this.features,
          rules: this.rules,
          clarification: this.assistantClarification
        },
        (stage) => {
          if (runId === this.assistantRunId) this.assistantStatus?.setText(stageLabels[stage]);
        }
      );
      if (runId !== this.assistantRunId) return;
      if (!response.ambiguity) this.assistantClarification = undefined;
      this.assistantSuggestions = response.suggestions;
      this.pendingAmbiguity = response.ambiguity;
      if (response.ambiguity) this.renderAmbiguity(response.ambiguity);
      this.renderAssistantSuggestions();
      this.assistantStatus?.setText(
        response.ambiguity
          ? tr("需要人工确认")
          : trFormat(
              "cmConstraintGeneratedCount",
              [response.suggestions.length],
              `已生成 ${response.suggestions.length} 条待审核规则`
            )
      );
      this.assistantStatus?.setState(response.ambiguity ? "Warning" : "Success");
    } catch (error) {
      this.assistantStatus?.setText(error instanceof Error ? error.message : String(error));
      this.assistantStatus?.setState("Error");
    } finally {
      if (runId === this.assistantRunId) this.assistantGenerateButton?.setEnabled(true);
    }
  }

  private renderAmbiguity(ambiguity: NonNullable<ConstraintAIResponse["ambiguity"]>): void {
    if (!this.assistantAmbiguity) return;
    this.assistantAmbiguity.destroyItems();
    const choice = new Select({
      width: "100%",
      selectedKey: this.assistantAmbiguityChoice ?? "",
      items: [
        new Item({ key: "", text: tr("请选择引用对象") }),
        ...ambiguity.options.map(
          (option) => new Item({ key: option.key, text: `${option.label} · ${option.detail}` })
        )
      ],
      change: (event: Select$ChangeEvent) => {
        this.assistantAmbiguityChoice = event.getSource().getSelectedKey();
      }
    });
    this.assistantAmbiguity.addItem(
      new MessageStrip({
        text: ambiguity.prompt,
        type: "Warning",
        showIcon: true,
        showCloseButton: false
      })
    );
    this.assistantAmbiguity.addItem(choice);
    this.assistantAmbiguity.addItem(
      new Button({
        text: tr("确认选择并重新生成"),
        icon: "sap-icon://accept",
        press: () => {
          if (!this.assistantAmbiguityChoice) {
            MessageToast.show(tr("请先选择一个引用对象。"));
            return;
          }
          this.assistantClarification = [this.assistantClarification, this.assistantAmbiguityChoice]
            .filter(Boolean)
            .join("|");
          void this.generateAI();
        }
      })
    );
    this.assistantAmbiguity.setVisible(true);
  }

  private renderAssistantSuggestions(): void {
    if (!this.assistantResults) return;
    this.assistantResults.destroyItems();
    this.assistantSuggestions.forEach((suggestion) => {
      const relation = this.actionLabel(suggestion.rule.ast.actions[0]?.type ?? "REQUIRE");
      this.assistantResults?.addItem(
        new VBox({
          width: "100%",
          items: [
            new HBox({
              width: "100%",
              alignItems: "Center",
              items: [
                new CheckBox({
                  selected: suggestion.selected,
                  text: relation,
                  select: (event) =>
                    this.setSuggestionSelected(suggestion.id, event.getSource().getSelected())
                }),
                new ToolbarSpacer(),
                new ObjectStatus({ text: tr("待审核"), state: "Warning" })
              ]
            }),
            new Title({ text: suggestion.rule.name, level: "H6" }),
            new Text({ text: suggestion.explanation, wrapping: true }),
            new Text({ text: suggestion.rule.expression, wrapping: true }).addStyleClass(
              "cmConstraintAISuggestionExpression"
            ),
            new Text({
              text: this.structuredPreview(suggestion.rule),
              wrapping: true
            }).addStyleClass("cmConstraintAISuggestionPreview"),
            new HBox({
              wrap: "Wrap",
              items: [
                new Button({
                  text: tr("应用"),
                  icon: "sap-icon://accept",
                  press: () => this.applyAISuggestion(suggestion.id)
                }),
                new Button({
                  text: tr("编辑表达式"),
                  icon: "sap-icon://edit",
                  press: () => this.editAISuggestion(suggestion, "expression")
                }),
                new Button({
                  text: tr("在蓝图中编辑"),
                  icon: "sap-icon://process",
                  press: () => this.editAISuggestion(suggestion, "blueprint")
                }),
                new Button({
                  text: tr("忽略"),
                  icon: "sap-icon://decline",
                  type: "Transparent",
                  press: () => this.ignoreAISuggestion(suggestion.id)
                })
              ]
            })
          ]
        }).addStyleClass("cmConstraintAISuggestion")
      );
    });
    this.updateAssistantApplyButton();
  }

  private setSuggestionSelected(id: string, selected: boolean): void {
    this.assistantSuggestions = this.assistantSuggestions.map((suggestion) =>
      suggestion.id === id ? { ...suggestion, selected } : suggestion
    );
    this.updateAssistantApplyButton();
  }

  private updateAssistantApplyButton(): void {
    const selectedCount = this.assistantSuggestions.filter(
      (suggestion) => suggestion.selected
    ).length;
    this.assistantApplyButton?.setText(
      trFormat("cmConstraintApplySelectedCount", [selectedCount], `应用选中 (${selectedCount})`)
    );
    this.assistantApplyButton?.setEnabled(selectedCount > 0);
  }

  private blueprintPreview(rule: ConstraintRule): string {
    const condition = this.describeExpression(rule.ast.condition);
    const actions = rule.ast.actions
      .map((action) => `${this.actionLabel(action.type)} ${this.describeExpression(action.target)}`)
      .join("; ");
    return `${condition} → ${actions}`;
  }

  private structuredPreview(rule: ConstraintRule): string {
    const when = this.describeExpression(rule.ast.condition);
    const then = rule.ast.actions
      .map((action) => `${this.actionLabel(action.type)} ${this.describeExpression(action.target)}`)
      .join("; ");
    const blueprint = this.blueprintPreview(rule);
    return trFormat(
      "cmConstraintStructuredPreview",
      [when, then, blueprint],
      `结构化条件：当 ${when}，则 ${then} · 蓝图预览 ${blueprint}`
    );
  }

  private describeExpression(
    expression: ConstraintExpression,
    parentOperator?: "AND" | "OR"
  ): string {
    if ("feature" in expression) {
      const feature = this.features.find((item) => item.code === expression.feature);
      const operatorLabels: Record<ConstraintOperator, string> = {
        EQUALS: tr("等于"),
        NOT_EQUALS: tr("不等于"),
        GREATER_THAN: tr("大于"),
        GREATER_THAN_OR_EQUAL: tr("大于等于"),
        LESS_THAN: tr("小于"),
        LESS_THAN_OR_EQUAL: tr("小于等于"),
        IN: tr("属于"),
        NOT_IN: tr("不属于"),
        CONTAINS: tr("包含"),
        STARTS_WITH: tr("开头为"),
        ENDS_WITH: tr("结尾为")
      };
      const describeValue = (value: string | number | boolean): string => {
        if (typeof value !== "string") return String(value);
        return feature?.domain.values.find((item) => item.code === value)?.value ?? value;
      };
      const value = Array.isArray(expression.value)
        ? expression.value.map(describeValue).join(", ")
        : describeValue(expression.value);
      return `${feature?.name ?? expression.feature} ${operatorLabels[expression.type]} ${value}`;
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

  private applyAISuggestion(id: string): void {
    if (!this.canEdit()) return;
    const suggestion = this.assistantSuggestions.find((item) => item.id === id);
    if (!suggestion) return;
    this.applyAISuggestions([suggestion]);
  }

  private applySelectedAISuggestions(): void {
    const selected = this.assistantSuggestions.filter((suggestion) => suggestion.selected);
    if (selected.length) this.applyAISuggestions(selected);
  }

  private applyAISuggestions(suggestions: ConstraintAISuggestion[]): void {
    if (!this.canEdit()) return;
    const stagedRules = [...this.rules];
    const rulesToSave = suggestions.map((suggestion) => {
      const rule = {
        ...structuredClone(suggestion.rule),
        code: this.nextRuleCode(stagedRules),
        source: { type: "AI" as const, prompt: this.assistantPrompt?.getValue() ?? "" }
      };
      stagedRules.push(rule);
      return rule;
    });
    try {
      const saved = this.repository.saveMany(this.context.id, rulesToSave, this.features);
      const savedIds = new Set(saved.map((rule) => rule.id));
      this.rules = [...this.rules.filter((rule) => !savedIds.has(rule.id)), ...saved];
      this.expressionEditor?.setRules(this.rules);
      this.assistantSuggestions = this.assistantSuggestions.filter(
        (suggestion) => !savedIds.has(suggestion.id)
      );
      const current = saved[saved.length - 1];
      if (!current) return;
      this.currentRule = structuredClone(current);
      this.currentRuleDirty = false;
      this.blueprintNeedsLoad = true;
      this.rulesModel.setProperty("/currentRule", current);
      this.ruleNameInput?.setValue(current.name);
      this.ruleMetaStatus?.setText(this.ruleMetadata(current));
      this.expressionEditor?.setRule(current);
      this.renderRuleList();
      this.renderAssistantSuggestions();
      this.assistantStatus?.setText(
        trFormat(
          "cmConstraintPendingSuggestionCount",
          [this.assistantSuggestions.length],
          `${this.assistantSuggestions.length} 条待审核规则`
        )
      );
      this.detailsStatus?.setText(
        trFormat("cmConstraintValidatedVersion", [current.version], `已验证 · V${current.version}`)
      );
      this.detailsStatus?.setState("Success");
      MessageToast.show(
        trFormat(
          "cmConstraintAIAppliedCount",
          [saved.length],
          `已应用 ${saved.length} 条 AI 规则到当前规则集。`
        )
      );
    } catch (error) {
      MessageToast.show(error instanceof Error ? error.message : String(error));
    }
  }

  private editAISuggestion(suggestion: ConstraintAISuggestion, mode: AdvancedWorkspaceMode): void {
    this.currentRule = structuredClone(suggestion.rule);
    this.currentRuleDirty = true;
    this.currentRuleIsNew = false;
    this.rules = this.rules.some((rule) => rule.id === suggestion.rule.id)
      ? this.rules.map((rule) =>
          rule.id === suggestion.rule.id ? structuredClone(suggestion.rule) : rule
        )
      : [...this.rules, structuredClone(suggestion.rule)];
    this.expressionEditor?.setRules(this.rules);
    this.rulesModel.setProperty("/currentRule", this.currentRule);
    this.ruleNameInput?.setValue(this.currentRule.name);
    this.ruleMetaStatus?.setText(this.ruleMetadata(this.currentRule));
    this.expressionEditor?.setRule(this.currentRule);
    this.designerView?.setRule(this.currentRule, false);
    this.detailsStatus?.setText(tr("AI 草稿 · 尚未应用"));
    this.detailsStatus?.setState("Warning");
    this.blueprintNeedsLoad = true;
    this.renderRuleList();
    this.setAdvancedMode(mode);
    this.setMode("advanced");
  }

  private ignoreAISuggestion(id: string): void {
    this.assistantSuggestions = this.assistantSuggestions.filter((item) => item.id !== id);
    this.renderAssistantSuggestions();
    this.assistantStatus?.setText(
      trFormat(
        "cmConstraintPendingSuggestionCount",
        [this.assistantSuggestions.length],
        `${this.assistantSuggestions.length} 条待审核规则`
      )
    );
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
    const operatorLabels: Record<ConstraintOperator, string> = {
      EQUALS: tr("等于"),
      NOT_EQUALS: tr("不等于"),
      GREATER_THAN: tr("大于"),
      GREATER_THAN_OR_EQUAL: tr("大于等于"),
      LESS_THAN: tr("小于"),
      LESS_THAN_OR_EQUAL: tr("小于等于"),
      IN: tr("属于"),
      NOT_IN: tr("不属于"),
      CONTAINS: tr("包含"),
      STARTS_WITH: tr("开头为"),
      ENDS_WITH: tr("结尾为")
    };
    this.blueprintInspectorFields.addItem(
      new Select({
        width: "100%",
        selectedKey: selection.predicate.type,
        items: constraintOperatorsFor(feature.dataType, selection.actionType).map(
          (operator) => new Item({ key: operator, text: operatorLabels[operator] })
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
    this.blueprintInspectorFields.addItem(new Label({ text: tr("允许值") }));
    this.blueprintInspectorFields.addItem(this.buildBlueprintValueControl(selection, feature));
  }

  private buildBlueprintValueControl(
    selection: BlueprintPredicateSelection,
    feature: FeatureDefinition
  ): Input | Select | MultiComboBox {
    const predicate = selection.predicate;
    const currentValue = predicate.value;
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
