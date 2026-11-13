import Button from "sap/m/Button";
import Form from "sap/ui/layout/form/Form";
import FormContainer from "sap/ui/layout/form/FormContainer";
import FormElement from "sap/ui/layout/form/FormElement";
import ColumnLayout from "sap/ui/layout/form/ColumnLayout";
import HBox from "sap/m/HBox";
import Input from "sap/m/Input";
import Item from "sap/ui/core/Item";
import Label from "sap/m/Label";
import MessageStrip from "sap/m/MessageStrip";
import MessageToast from "sap/m/MessageToast";
import MultiComboBox from "sap/m/MultiComboBox";
import ObjectStatus from "sap/m/ObjectStatus";
import OverflowToolbar from "sap/m/OverflowToolbar";
import RadioButton from "sap/m/RadioButton";
import RadioButtonGroup from "sap/m/RadioButtonGroup";
import SegmentedButton from "sap/m/SegmentedButton";
import SegmentedButtonItem from "sap/m/SegmentedButtonItem";
import Select from "sap/m/Select";
import Text from "sap/m/Text";
import ToolbarSpacer from "sap/m/ToolbarSpacer";
import VBox from "sap/m/VBox";
import Control from "sap/ui/core/Control";
import FlexItemData from "sap/m/FlexItemData";
import type { Input$LiveChangeEvent } from "sap/m/Input";
import type { MultiComboBox$SelectionFinishEvent } from "sap/m/MultiComboBox";
import type { SegmentedButton$SelectionChangeEvent } from "sap/m/SegmentedButton";
import type { Select$ChangeEvent } from "sap/m/Select";
import { resolveDefinition, validateContext, validateValue } from "../../model/configuration";
import type {
  ConfigurationContext,
  ConfigurationProfile,
  ConfigurationStore,
  FeatureDefinition
} from "../../model/configuration";
import {
  activeConstraintEffects,
  appendConstraintPredicate,
  collectConstraintPredicates,
  constraintEffectAllowedValues,
  constraintOperatorsFor,
  formatConstraintExpression,
  normalizeConstraintConditionForDesigner,
  reconcileConstrainedSelection,
  validateConstraintRule
} from "../../model/constraintRules";
import type {
  ConstraintAction,
  ConstraintActionType,
  ConstraintExpression,
  ConstraintLiteral,
  ConstraintOperator,
  ConstraintPredicate,
  ConstraintPreviewEffect,
  ConstraintRule
} from "../../model/constraintRules";
import { tr, trFormat } from "../../util/configurationUi";

type DesignerMode = "design" | "configure";
type SelectionStage = "idle" | "condition" | "target";
type ConditionConnector = "AND" | "OR";
type PreviewValueState = "None" | "Error" | "Warning" | "Success";

interface ValueControl {
  control: Control;
  getValue: () => unknown;
}

interface DesignerField {
  definition: FeatureDefinition;
  control: Control;
  getValue: () => unknown;
  setAvailableValues: (codes: Set<string> | undefined) => void;
  setValueState: (state: PreviewValueState, message?: string) => void;
  relationStatus: ObjectStatus;
}

interface ConditionDraft {
  feature: FeatureDefinition;
  connector: ConditionConnector;
  operator: ConstraintOperator;
  value: unknown;
}

interface ActionDraft {
  feature: FeatureDefinition;
  type: ConstraintActionType;
  operator: ConstraintOperator;
  value: unknown;
}

interface ConfigurationRuleDesignerOptions {
  store: ConfigurationStore;
  context: ConfigurationContext;
  profile: ConfigurationProfile;
  features: FeatureDefinition[];
  rule: ConstraintRule;
  rules: () => ConstraintRule[];
  isNewDraft: () => boolean;
  canEdit: () => boolean;
  onRuleChange: (rule: ConstraintRule) => void;
}

const operatorLabels: Record<ConstraintOperator, string> = {
  EQUALS: "等于",
  NOT_EQUALS: "不等于",
  GREATER_THAN: "大于",
  GREATER_THAN_OR_EQUAL: "大于等于",
  LESS_THAN: "小于",
  LESS_THAN_OR_EQUAL: "小于等于",
  IN: "属于",
  NOT_IN: "不属于",
  CONTAINS: "包含",
  STARTS_WITH: "开头为",
  ENDS_WITH: "结尾为"
};

const actionLabels: Record<ConstraintActionType, string> = {
  REQUIRE: "要求",
  EXCLUDE: "互斥",
  SET: "设置",
  RESTRICT: "限制",
  DERIVE: "派生"
};

function isSelected(value: unknown): boolean {
  return (
    value !== undefined &&
    value !== null &&
    value !== "" &&
    !(Array.isArray(value) && value.length === 0)
  );
}

function initialFeatureValue(
  definition: FeatureDefinition,
  profile: ConfigurationProfile
): unknown {
  const allowed = definition.domain.values
    .filter((value) => value.active)
    .sort((left, right) => left.sort - right.sort);
  if (definition.defaultValue)
    return definition.dataType === "Multi Enumeration"
      ? definition.defaultValue.split(",").map((value) => value.trim())
      : definition.defaultValue;
  const defaults = allowed.filter((value) => value.defaultValue).map((value) => value.code);
  if (defaults.length) return definition.dataType === "Multi Enumeration" ? defaults : defaults[0];
  if (profile.defaultBehavior === "Auto Select Single Value" && allowed.length === 1)
    return allowed[0].code;
  return undefined;
}

function asConstraintValue(
  definition: FeatureDefinition,
  value: unknown
): ConstraintLiteral | ConstraintLiteral[] | undefined {
  if (!isSelected(value)) return undefined;
  if (Array.isArray(value)) {
    const values = value
      .map((item) => asConstraintValue(definition, item))
      .filter((item): item is ConstraintLiteral => item !== undefined)
      .flatMap((item) => (Array.isArray(item) ? item : [item]));
    return values.length ? values : undefined;
  }
  if (definition.dataType === "Boolean") {
    if (value === true || value === "true") return true;
    if (value === false || value === "false") return false;
    return undefined;
  }
  if (["Integer", "Decimal", "Range"].includes(definition.dataType)) {
    const numeric = typeof value === "number" ? value : Number(value);
    return Number.isFinite(numeric) ? numeric : undefined;
  }
  return typeof value === "string" || typeof value === "number" ? value : undefined;
}

function valueToKeys(value: unknown): string[] {
  if (!isSelected(value)) return [];
  return (Array.isArray(value) ? value : [value]).map(String);
}

function intersectAllowedValues(sets: Set<string>[]): Set<string> | undefined {
  if (!sets.length) return undefined;
  return new Set([...sets[0]].filter((value) => sets.slice(1).every((set) => set.has(value))));
}

export default class ConfigurationRuleDesignerView {
  private readonly options: ConfigurationRuleDesignerOptions;
  private readonly featuresByCode: Map<string, FeatureDefinition>;
  private readonly featureForm = new Form({
    editable: true,
    layout: new ColumnLayout({
      columnsM: 1,
      columnsL: 1,
      columnsXL: 1
    })
  }).addStyleClass("cmConstraintDesignerForm");
  private readonly fields = new Map<string, DesignerField>();
  private readonly actionButtons = new Map<ConstraintActionType, Button>();
  private readonly conditionButtons: Button[] = [];
  private readonly values = new Map<string, unknown>();
  private readonly conditionDraftHost = new VBox({ width: "100%" });
  private readonly actionDraftHost = new VBox({ width: "100%" });
  private readonly validationHost = new VBox({ width: "100%" });
  private readonly previewFeedbackHost = new VBox({ width: "100%" });
  private readonly modelReadiness: string[];
  private readonly stageStatus = new MessageStrip({
    text: "",
    type: "Information",
    showIcon: true,
    showCloseButton: false,
    visible: false
  });
  private readonly modeSelector: SegmentedButton;
  private cancelSelectionButton?: Button;
  private currentRule: ConstraintRule;
  private isNewDraft: boolean;
  private mode: DesignerMode = "design";
  private stage: SelectionStage = "idle";
  private pendingConnector: ConditionConnector = "AND";
  private pendingAction: ConstraintActionType = "REQUIRE";
  private conditionDraft?: ConditionDraft;
  private actionDraft?: ActionDraft;
  private lastChangedFeatureCode?: string;
  private newDraftHasCondition = false;
  private newDraftHasAction = false;

  public constructor(options: ConfigurationRuleDesignerOptions) {
    this.options = options;
    this.featuresByCode = new Map(options.features.map((feature) => [feature.code, feature]));
    this.currentRule = structuredClone(options.rule);
    this.isNewDraft = options.isNewDraft();
    this.modelReadiness = validateContext(options.store, options.context.id);
    this.mode = options.context.status === "Draft" ? "design" : "configure";
    this.modeSelector = new SegmentedButton({
      selectedKey: this.mode,
      items: [
        new SegmentedButtonItem({ key: "design", text: tr("cmConstraintDesignMode") }),
        new SegmentedButtonItem({ key: "configure", text: tr("cmConstraintConfigureMode") })
      ],
      selectionChange: (event: SegmentedButton$SelectionChangeEvent) =>
        this.setMode(event.getParameter("selectedKey") as DesignerMode)
    }).addStyleClass("cmConstraintDesignerModeSelector");
    this.buildForm();
    this.renderRelations();
    this.updatePreview();
  }

  public build(): VBox {
    const toolbar = new OverflowToolbar({
      content: [
        this.modeSelector,
        new ToolbarSpacer(),
        this.createConditionButton("cmConstraintAddConditionAnd", "AND"),
        this.createConditionButton("cmConstraintAddConditionOr", "OR"),
        ...(["REQUIRE", "EXCLUDE", "RESTRICT", "SET", "DERIVE"] as const).map((type) => {
          const actionButton = new Button({
            text: tr(actionLabels[type]),
            type: type === "REQUIRE" ? "Emphasized" : "Transparent",
            enabled: false,
            press: () => this.startAction(type)
          });
          this.actionButtons.set(type, actionButton);
          return actionButton;
        }),
        (this.cancelSelectionButton = new Button({
          text: tr("cmConstraintCancelSelection"),
          icon: "sap-icon://decline",
          type: "Transparent",
          visible: this.stage !== "idle",
          press: () => this.cancelSelection()
        })).addStyleClass("cmConstraintDesignerCancel")
      ]
    }).addStyleClass("cmConstraintDesignerToolbar");
    this.updateToolbarState();

    const scrollContent = new VBox({
      width: "100%",
      fitContainer: true,
      items: [
        this.stageStatus,
        this.conditionDraftHost,
        this.actionDraftHost,
        this.validationHost,
        this.previewFeedbackHost,
        this.featureForm
      ]
    }).addStyleClass("cmConstraintDesignerContent");
    scrollContent.setLayoutData(
      new FlexItemData({ growFactor: 1, shrinkFactor: 1, baseSize: "0%" })
    );
    return new VBox({
      width: "100%",
      height: "100%",
      fitContainer: true,
      items: [toolbar, scrollContent]
    }).addStyleClass("cmConstraintDesigner");
  }

  public setRule(rule: ConstraintRule, isNewDraft: boolean): void {
    const changedRule = this.currentRule.id !== rule.id;
    const changedDraftState = this.isNewDraft !== isNewDraft;
    this.currentRule = structuredClone(rule);
    this.isNewDraft = isNewDraft;
    if (changedRule || changedDraftState) {
      this.newDraftHasCondition = !isNewDraft;
      this.newDraftHasAction = !isNewDraft;
      this.cancelSelection();
    }
    this.renderRelations();
    this.updatePreview();
  }

  public setFeatures(features: FeatureDefinition[]): void {
    this.featuresByCode.clear();
    features.forEach((feature) => this.featuresByCode.set(feature.code, feature));
    this.buildForm();
    this.renderRelations();
    this.updatePreview();
  }

  public setConfigureMode(): void {
    this.setMode("configure");
  }

  private buildForm(): void {
    this.fields.clear();
    this.values.clear();
    this.featureForm.destroyFormContainers();
    const groups = this.options.store.groups
      .filter((group) => group.contextId === this.options.context.id)
      .sort((left, right) => left.sort - right.sort);

    for (const group of groups) {
      const familyContainers = this.options.store.families
        .filter((family) => family.groupId === group.id && family.active)
        .sort((left, right) => left.sort - right.sort);
      const elements: FormElement[] = [];
      for (const family of familyContainers) {
        const definitions = this.options.store.references
          .filter((reference) => reference.familyId === family.id)
          .map((reference) => resolveDefinition(this.options.store, reference))
          .filter((definition) => definition.active);
        elements.push(
          new FormElement({
            label: new Label({
              text: family.displayName || family.name,
              design: "Bold",
              required: definitions.some((definition) => definition.mandatory)
            }),
            fields: [
              new Text({
                text: family.businessQuestion,
                wrapping: true
              }).addStyleClass("cmConstraintDesignerQuestion")
            ]
          })
        );
        for (const definition of definitions) {
          const field = this.buildField(definition, family.businessQuestion);
          const showFeatureLabel =
            definitions.length > 1 &&
            definition.name !== family.displayName &&
            definition.name !== family.name;
          elements.push(
            new FormElement({
              label: new Label({
                text: showFeatureLabel
                  ? `${definition.name}${definition.unit ? ` (${definition.unit})` : ""}`
                  : "",
                required: showFeatureLabel && definition.mandatory,
                tooltip: family.businessQuestion || definition.description
              }),
              fields: [field.control, field.relationStatus]
            })
          );
        }
      }
      if (elements.length)
        this.featureForm.addFormContainer(
          new FormContainer({
            title: group.name,
            formElements: elements
          })
        );
    }
  }

  private buildField(definition: FeatureDefinition, question: string): DesignerField {
    const initial = initialFeatureValue(definition, this.options.profile);
    let readValue: () => unknown = () => undefined;
    let setAvailableValues: DesignerField["setAvailableValues"] = () => undefined;
    let setValueState: DesignerField["setValueState"] = () => undefined;
    const allowed = definition.domain.values
      .filter((value) => value.active)
      .sort((left, right) => left.sort - right.sort);
    const onChange = (value: unknown, captureSelection = true): void => {
      this.values.set(definition.code, value);
      if (captureSelection) {
        this.lastChangedFeatureCode = definition.code;
        if (this.stage === "condition")
          this.beginConditionDraft(definition.code, this.pendingConnector);
        else if (this.stage === "target") this.beginActionDraft(definition.code);
      }
      this.updatePreview();
    };

    if (definition.dataType === "Multi Enumeration") {
      const input = new MultiComboBox({
        width: "100%",
        selectedKeys: valueToKeys(initial),
        items: allowed.map((value) => new Item({ key: value.code, text: value.value })),
        selectionFinish: (event: MultiComboBox$SelectionFinishEvent) =>
          onChange(event.getSource().getSelectedKeys())
      });
      readValue = () => input.getSelectedKeys();
      setAvailableValues = (codes) => {
        const current = readValue();
        const retained = reconcileConstrainedSelection(current, codes);
        const keys = Array.isArray(retained) ? retained : [];
        if (JSON.stringify(current) !== JSON.stringify(keys)) input.setSelectedKeys(keys);
        input.getItems().forEach((item) => item.setEnabled(!codes || codes.has(item.getKey())));
      };
      setValueState = (state, message) => {
        input.setValueState(state === "Success" ? "None" : state);
        input.setValueStateText(message ?? "");
      };
      const field = this.makeField(definition, input, readValue, setAvailableValues, setValueState);
      this.values.set(definition.code, readValue());
      return field;
    }

    if (["Enumeration", "Reference"].includes(definition.dataType) && allowed.length <= 6) {
      const input = new RadioButtonGroup({
        columns: Math.min(3, Math.max(1, allowed.length)),
        selectedIndex: allowed.findIndex((value) => value.code === initial),
        buttons: allowed.map((value) => new RadioButton({ text: value.value })),
        select: (event) => {
          const index = event.getSource().getSelectedIndex();
          onChange(allowed[index]?.code);
        }
      });
      readValue = () => allowed[input.getSelectedIndex()]?.code;
      setAvailableValues = (codes) => {
        const current = String(readValue() ?? "");
        const retained = reconcileConstrainedSelection(current, codes, true);
        if (current !== String(retained ?? "")) {
          input.setSelectedIndex(allowed.findIndex((value) => value.code === retained));
        }
        input
          .getButtons()
          .forEach((radio, index) =>
            radio.setEnabled(!codes || codes.has(allowed[index]?.code ?? ""))
          );
      };
      setValueState = (state, message) =>
        input.setTooltip(state === "None" ? question : (message ?? question));
      const field = this.makeField(definition, input, readValue, setAvailableValues, setValueState);
      this.values.set(definition.code, readValue());
      return field;
    }

    if (["Enumeration", "Reference", "Boolean"].includes(definition.dataType)) {
      const items =
        definition.dataType === "Boolean"
          ? [
              new Item({ key: "", text: tr("cmConstraintNoValue") }),
              new Item({ key: "true", text: tr("Yes") }),
              new Item({ key: "false", text: tr("No") })
            ]
          : [
              new Item({ key: "", text: tr("cmConstraintNoValue") }),
              ...allowed.map((value) => new Item({ key: value.code, text: value.value }))
            ];
      const input = new Select({
        width: "100%",
        selectedKey: initial === undefined || initial === null ? "" : String(initial),
        items,
        change: (event: Select$ChangeEvent) => onChange(event.getSource().getSelectedKey())
      });
      readValue = () => input.getSelectedKey();
      setAvailableValues = (codes) => {
        const selected = String(readValue() ?? "");
        const retained = reconcileConstrainedSelection(selected, codes, true);
        if (selected !== String(retained ?? "")) input.setSelectedKey(String(retained ?? ""));
        input
          .getItems()
          .forEach((item) => item.setEnabled(!item.getKey() || !codes || codes.has(item.getKey())));
      };
      setValueState = (state, message) => {
        input.setValueState(state === "Success" ? "None" : state);
        input.setValueStateText(message ?? "");
      };
      const field = this.makeField(definition, input, readValue, setAvailableValues, setValueState);
      this.values.set(definition.code, readValue());
      return field;
    }

    const input = new Input({
      width: "100%",
      value: initial === undefined || initial === null ? "" : String(initial),
      type: ["Integer", "Decimal"].includes(definition.dataType)
        ? "Number"
        : definition.dataType === "Date"
          ? "Date"
          : definition.dataType === "DateTime"
            ? "DatetimeLocale"
            : "Text",
      description: definition.unit,
      placeholder:
        definition.dataType === "Range"
          ? tr("cmConstraintRangePlaceholder")
          : definition.dataType === "String"
            ? `${tr("cmConstraintMaxLength")} ${definition.domain.maxLength ?? "∞"}`
            : tr("cmConstraintEnterValue"),
      liveChange: (event: Input$LiveChangeEvent) =>
        onChange(event.getParameter("value") ?? "", false),
      change: () => onChange(input.getValue())
    });
    readValue = () => input.getValue();
    setValueState = (state, message) => {
      input.setValueState(state === "Success" ? "None" : state);
      input.setValueStateText(message ?? "");
    };
    const field = this.makeField(definition, input, readValue, setAvailableValues, setValueState);
    this.values.set(definition.code, readValue());
    return field;
  }

  private makeField(
    definition: FeatureDefinition,
    control: Control,
    getValue: () => unknown,
    setAvailableValues: DesignerField["setAvailableValues"],
    setValueState: DesignerField["setValueState"]
  ): DesignerField {
    const relationStatus = new ObjectStatus({ text: "", visible: false });
    control.addStyleClass("cmConstraintDesignerFieldControl");
    control.setTooltip(definition.description);
    const field = {
      definition,
      control,
      getValue,
      setAvailableValues,
      setValueState,
      relationStatus
    };
    this.fields.set(definition.code, field);
    return field;
  }

  private startCondition(connector: ConditionConnector): void {
    if (this.mode !== "design" || !this.options.canEdit()) return;
    const selectedFeatureCode = this.lastChangedFeatureCode;
    this.cancelSelection();
    this.pendingConnector = connector;
    if (selectedFeatureCode) {
      this.beginConditionDraft(selectedFeatureCode, connector);
      return;
    }
    this.stage = "condition";
    this.stageStatus.setType("Information");
    this.stageStatus.setText(
      trFormat(
        "cmConstraintSelectConditionHint",
        [tr(connector === "AND" ? "且" : "或")],
        `请在表单中选取条件值，将以“${connector === "AND" ? "且" : "或"}”连接。`
      )
    );
    this.stageStatus.setVisible(true);
    this.cancelSelectionButton?.setVisible(true);
  }

  private startAction(type: ConstraintActionType): void {
    if (this.mode !== "design" || !this.options.canEdit()) return;
    if (
      !collectConstraintPredicates(this.currentRule.ast.condition).length ||
      (this.isNewDraft && !this.newDraftHasCondition)
    ) {
      this.stageStatus.setType("Warning");
      this.stageStatus.setText(tr("cmConstraintAddConditionFirst"));
      this.stageStatus.setVisible(true);
      return;
    }
    const selectedFeatureCode = this.lastChangedFeatureCode;
    this.cancelSelection();
    this.pendingAction = type;
    if (selectedFeatureCode) {
      this.beginActionDraft(selectedFeatureCode);
      return;
    }
    this.stage = "target";
    this.stageStatus.setType("Information");
    this.stageStatus.setText(
      trFormat(
        "cmConstraintSelectTargetHint",
        [tr(actionLabels[type])],
        `请选择“${tr(actionLabels[type])}”动作的目标配置项。`
      )
    );
    this.stageStatus.setVisible(true);
    this.cancelSelectionButton?.setVisible(true);
  }

  private cancelSelection(): void {
    this.stage = "idle";
    this.conditionDraft = undefined;
    this.actionDraft = undefined;
    this.lastChangedFeatureCode = undefined;
    this.conditionDraftHost.destroyItems();
    this.actionDraftHost.destroyItems();
    this.stageStatus.setVisible(false);
    this.cancelSelectionButton?.setVisible(false);
  }

  private beginConditionDraft(featureCode: string, connector: ConditionConnector): void {
    const field = this.fields.get(featureCode);
    if (!field) return;
    const value = asConstraintValue(field.definition, field.getValue());
    if (value === undefined) {
      this.stageStatus.setType("Warning");
      this.stageStatus.setText(tr("cmConstraintChooseValueFirst"));
      this.stageStatus.setVisible(true);
      return;
    }
    const operators = constraintOperatorsFor(field.definition.dataType);
    this.conditionDraft = {
      feature: field.definition,
      connector,
      operator: Array.isArray(value) && operators.includes("IN") ? "IN" : "EQUALS",
      value
    };
    this.lastChangedFeatureCode = undefined;
    this.renderConditionDraft();
    this.stage = "idle";
    this.cancelSelectionButton?.setVisible(false);
    this.stageStatus.setType("Information");
    this.stageStatus.setText(tr("cmConstraintConditionDraftReady"));
    this.stageStatus.setVisible(true);
  }

  private renderConditionDraft(): void {
    this.conditionDraftHost.destroyItems();
    const draft = this.conditionDraft;
    if (!draft) return;
    const operatorSelect = new Select({
      width: "9rem",
      selectedKey: draft.operator,
      items: constraintOperatorsFor(draft.feature.dataType).map(
        (operator) => new Item({ key: operator, text: tr(operatorLabels[operator]) })
      ),
      change: (event: Select$ChangeEvent) => {
        draft.operator = event.getSource().getSelectedKey() as ConstraintOperator;
        this.renderConditionDraft();
      }
    });
    const valueInput = this.buildPredicateValueControl(
      draft.feature,
      draft.operator,
      draft.value,
      (value) => {
        draft.value = value;
      }
    );
    this.conditionDraftHost.addItem(
      new VBox({
        width: "100%",
        items: [
          new ObjectStatus({
            text: trFormat(
              "cmConstraintConditionDraft",
              [draft.feature.name, tr(draft.connector === "AND" ? "且" : "或")],
              `${draft.feature.name} · ${tr(draft.connector === "AND" ? "且" : "或")}`
            ),
            state: "Information"
          }),
          new HBox({
            width: "100%",
            alignItems: "Center",
            wrap: "Wrap",
            items: [operatorSelect, valueInput.control]
          }).addStyleClass("cmConstraintDesignerDraftControls"),
          new HBox({
            width: "100%",
            justifyContent: "End",
            items: [
              new Button({
                text: tr("cmConstraintAddCondition"),
                icon: "sap-icon://add",
                type: "Emphasized",
                press: () => this.addConditionDraft(valueInput.getValue())
              }),
              new Button({
                text: tr("cmCancel"),
                type: "Transparent",
                press: () => {
                  this.conditionDraft = undefined;
                  this.conditionDraftHost.destroyItems();
                }
              })
            ]
          })
        ]
      }).addStyleClass("cmConstraintDesignerDraft")
    );
  }

  private createConditionButton(textKey: string, connector: ConditionConnector): Button {
    const control = new Button({
      text: tr(textKey),
      icon: "sap-icon://add",
      type: "Transparent",
      press: () => this.startCondition(connector)
    });
    this.conditionButtons.push(control);
    return control;
  }

  private addConditionDraft(value: unknown): void {
    const draft = this.conditionDraft;
    if (!draft || !this.options.canEdit()) return;
    const literal = asConstraintValue(draft.feature, value);
    if (literal === undefined) {
      MessageToast.show(tr("cmConstraintChooseValueFirst"));
      return;
    }
    const issues = validateValue(draft.feature, literal, false);
    if (issues.length) {
      MessageToast.show(`${draft.feature.name}: ${issues[0]}`);
      return;
    }
    const predicate: ConstraintPredicate = {
      type: draft.operator,
      feature: draft.feature.code,
      value: literal
    };
    const isNew = this.isNewDraft;
    const condition =
      isNew && !this.newDraftHasCondition
        ? predicate
        : appendConstraintPredicate(
            normalizeConstraintConditionForDesigner(this.currentRule.ast.condition),
            draft.connector,
            predicate
          );
    this.newDraftHasCondition = true;
    this.commitAst({ ...this.currentRule.ast, condition });
    this.lastChangedFeatureCode = undefined;
    this.conditionDraft = undefined;
    this.conditionDraftHost.destroyItems();
    this.stageStatus.setType("Success");
    this.stageStatus.setText(tr("cmConstraintConditionAdded"));
    this.stageStatus.setVisible(true);
  }

  private beginActionDraft(featureCode: string): void {
    const field = this.fields.get(featureCode);
    if (!field) return;
    const operators = constraintOperatorsFor(field.definition.dataType, this.pendingAction);
    const preferredOperator =
      this.pendingAction === "RESTRICT" && operators.includes("GREATER_THAN_OR_EQUAL")
        ? "GREATER_THAN_OR_EQUAL"
        : this.pendingAction === "REQUIRE" &&
            ["Enumeration", "Reference", "Multi Enumeration"].includes(field.definition.dataType) &&
            operators.includes("IN")
          ? "IN"
          : "EQUALS";
    const selected = asConstraintValue(field.definition, field.getValue());
    const defaultValue = initialFeatureValue(field.definition, this.options.profile);
    let value = selected ?? asConstraintValue(field.definition, defaultValue);
    if (preferredOperator === "IN" && value !== undefined && !Array.isArray(value)) value = [value];
    this.actionDraft = {
      feature: field.definition,
      type: this.pendingAction,
      operator: preferredOperator,
      value:
        value ??
        (["Integer", "Decimal", "Range"].includes(field.definition.dataType)
          ? field.definition.domain.minimum
          : undefined)
    };
    this.lastChangedFeatureCode = undefined;
    this.stage = "idle";
    this.cancelSelectionButton?.setVisible(false);
    this.renderActionDraft();
    this.stageStatus.setType("Information");
    this.stageStatus.setText(tr("cmConstraintTargetDraftReady"));
    this.stageStatus.setVisible(true);
  }

  private renderActionDraft(): void {
    this.actionDraftHost.destroyItems();
    const draft = this.actionDraft;
    if (!draft) return;
    const operators = constraintOperatorsFor(draft.feature.dataType, draft.type);
    if (!operators.includes(draft.operator))
      draft.operator = operators.includes("EQUALS") ? "EQUALS" : (operators[0] ?? "EQUALS");
    const operatorSelect = new Select({
      width: "9rem",
      selectedKey: draft.operator,
      items: operators.map(
        (operator) => new Item({ key: operator, text: tr(operatorLabels[operator]) })
      ),
      change: (event: Select$ChangeEvent) => {
        draft.operator = event.getSource().getSelectedKey() as ConstraintOperator;
        this.renderActionDraft();
      }
    });
    const valueEditor = this.buildPredicateValueControl(
      draft.feature,
      draft.operator,
      draft.value,
      (value) => {
        draft.value = value;
      }
    );
    this.actionDraftHost.addItem(
      new VBox({
        width: "100%",
        items: [
          new ObjectStatus({
            text: trFormat(
              "cmConstraintActionDraft",
              [tr(actionLabels[draft.type]), draft.feature.name],
              `${tr(actionLabels[draft.type])} · ${draft.feature.name}`
            ),
            state: "Information"
          }),
          new HBox({
            width: "100%",
            alignItems: "Center",
            wrap: "Wrap",
            items: [operatorSelect, valueEditor.control]
          }).addStyleClass("cmConstraintDesignerDraftControls"),
          new HBox({
            width: "100%",
            justifyContent: "End",
            items: [
              new Button({
                text: tr("cmConstraintAddRelation"),
                icon: "sap-icon://accept",
                type: "Emphasized",
                press: () => this.addActionDraft(valueEditor.getValue())
              }),
              new Button({
                text: tr("cmCancel"),
                type: "Transparent",
                press: () => {
                  this.actionDraft = undefined;
                  this.actionDraftHost.destroyItems();
                }
              })
            ]
          })
        ]
      }).addStyleClass("cmConstraintDesignerDraft")
    );
  }

  private addActionDraft(value: unknown): void {
    const draft = this.actionDraft;
    if (!draft || !this.options.canEdit()) return;
    const literal = asConstraintValue(draft.feature, value);
    if (literal === undefined) {
      MessageToast.show(tr("cmConstraintChooseValueFirst"));
      return;
    }
    const issues = validateValue(draft.feature, literal, false);
    if (issues.length) {
      MessageToast.show(`${draft.feature.name}: ${issues[0]}`);
      return;
    }
    const action: ConstraintAction = {
      type: draft.type,
      target: {
        type: draft.operator,
        feature: draft.feature.code,
        value: literal
      }
    };
    const isNew = this.isNewDraft;
    const actions =
      isNew && !this.newDraftHasAction ? [action] : [...this.currentRule.ast.actions, action];
    this.newDraftHasAction = true;
    this.commitAst({ ...this.currentRule.ast, actions });
    this.lastChangedFeatureCode = undefined;
    this.actionDraft = undefined;
    this.actionDraftHost.destroyItems();
    this.stageStatus.setType("Success");
    this.stageStatus.setText(tr("cmConstraintRelationAdded"));
    this.stageStatus.setVisible(true);
  }

  private buildPredicateValueControl(
    feature: FeatureDefinition,
    operator: ConstraintOperator,
    initial: unknown,
    onChange: (value: unknown) => void
  ): ValueControl {
    const allowed = feature.domain.values
      .filter((item) => item.active)
      .sort((left, right) => left.sort - right.sort);
    const multi =
      operator === "IN" ||
      operator === "NOT_IN" ||
      (feature.dataType === "Multi Enumeration" && operator !== "EQUALS");
    if (
      multi &&
      feature.dataType !== "Boolean" &&
      ["Enumeration", "Reference", "Multi Enumeration"].includes(feature.dataType)
    ) {
      const control = new MultiComboBox({
        width: "100%",
        selectedKeys: valueToKeys(initial),
        items: allowed.map((item) => new Item({ key: item.code, text: item.value })),
        selectionFinish: (event: MultiComboBox$SelectionFinishEvent) =>
          onChange(event.getSource().getSelectedKeys())
      });
      return { control, getValue: () => control.getSelectedKeys() };
    }

    if (["Enumeration", "Reference", "Boolean"].includes(feature.dataType)) {
      const items =
        feature.dataType === "Boolean"
          ? [
              new Item({ key: "", text: tr("cmConstraintNoValue") }),
              new Item({ key: "true", text: tr("Yes") }),
              new Item({ key: "false", text: tr("No") })
            ]
          : allowed.map((item) => new Item({ key: item.code, text: item.value }));
      const control = new Select({
        width: "100%",
        selectedKey: valueToKeys(initial)[0] ?? "",
        items,
        change: (event: Select$ChangeEvent) => onChange(event.getSource().getSelectedKey())
      });
      return { control, getValue: () => control.getSelectedKey() };
    }

    const control = new Input({
      width: "100%",
      value: isSelected(initial) ? String(initial) : "",
      type: ["Integer", "Decimal"].includes(feature.dataType)
        ? "Number"
        : feature.dataType === "Date"
          ? "Date"
          : feature.dataType === "DateTime"
            ? "DatetimeLocale"
            : "Text",
      description: feature.unit,
      liveChange: (event: Input$LiveChangeEvent) => onChange(event.getParameter("value") ?? "")
    });
    return { control, getValue: () => control.getValue() };
  }

  private commitAst(ast: ConstraintRule["ast"]): void {
    this.currentRule = {
      ...this.currentRule,
      ast: structuredClone(ast),
      expression: formatConstraintExpression(ast),
      status: "Draft"
    };
    this.options.onRuleChange(structuredClone(this.currentRule));
    this.renderRelations();
    this.updatePreview();
  }

  private renderRelations(): void {
    const projectedCondition = normalizeConstraintConditionForDesigner(
      this.currentRule.ast.condition
    );
    this.updateFieldRelations(projectedCondition);
    this.renderValidation();
    this.updateToolbarState();
  }

  private updateToolbarState(): void {
    const canDesign = this.mode === "design" && this.options.context.status === "Draft";
    const hasConfiguredCondition =
      collectConstraintPredicates(this.currentRule.ast.condition).length > 0 &&
      (!this.isNewDraft || this.newDraftHasCondition);
    this.conditionButtons.forEach((control) => control.setEnabled(canDesign));
    this.actionButtons.forEach((control) =>
      control.setEnabled(canDesign && hasConfiguredCondition)
    );
    this.cancelSelectionButton?.setVisible(canDesign && this.stage !== "idle");
  }

  private updateFieldRelations(condition: ConstraintExpression): void {
    const conditionFeatures = new Set(
      collectConstraintPredicates(condition).map((predicate) => predicate.feature)
    );
    const actionTypes = new Map<string, Set<ConstraintActionType>>();
    for (const action of this.currentRule.ast.actions) {
      for (const predicate of collectConstraintPredicates(action.target)) {
        const types = actionTypes.get(predicate.feature) ?? new Set<ConstraintActionType>();
        types.add(action.type);
        actionTypes.set(predicate.feature, types);
      }
    }

    for (const field of this.fields.values()) {
      const types = actionTypes.get(field.definition.code);
      const labels = [
        ...(conditionFeatures.has(field.definition.code) ? [tr("cmConstraintCondition")] : []),
        ...(types ? [...types].map((type) => tr(actionLabels[type])) : [])
      ];
      field.relationStatus.setText(labels.join(" · "));
      field.relationStatus.setVisible(labels.length > 0);
      field.relationStatus.setState(
        types?.has("EXCLUDE")
          ? "Warning"
          : conditionFeatures.has(field.definition.code)
            ? "Information"
            : "Success"
      );
      field.control.toggleStyleClass("cmConstraintDesignerField--related", labels.length > 0);
    }
  }

  private renderValidation(): void {
    this.validationHost.destroyItems();
    if (this.modelReadiness.length)
      this.validationHost.addItem(
        new MessageStrip({
          text: trFormat(
            "cmConstraintModelReadiness",
            [this.modelReadiness.join("；")],
            `模型完整性提示：${this.modelReadiness.join("；")}`
          ),
          type: "Warning",
          showIcon: true,
          showCloseButton: false
        })
      );
    const rules = this.options.rules();
    const issues = validateConstraintRule(this.currentRule, rules, this.options.features).filter(
      (issue) => issue.severity === "Error"
    );
    if (issues.length)
      this.validationHost.addItem(
        new MessageStrip({
          text: issues.map((issue) => issue.message).join("；"),
          type: "Error",
          showIcon: true,
          showCloseButton: false
        })
      );
  }

  private updatePreview(): void {
    this.fields.forEach((field, code) => this.values.set(code, field.getValue()));
    const rules = this.options.rules();
    for (let pass = 0; pass <= this.fields.size; pass += 1) {
      const effects = activeConstraintEffects(rules, this.options.features, this.values);
      const effectsByFeature = new Map<string, ConstraintPreviewEffect[]>();
      for (const effect of effects)
        for (const predicate of collectConstraintPredicates(effect.target)) {
          const entries = effectsByFeature.get(predicate.feature) ?? [];
          entries.push(effect);
          effectsByFeature.set(predicate.feature, entries);
        }

      let changed = false;
      for (const [code, field] of this.fields) {
        const previous = field.getValue();
        const fieldEffects = effectsByFeature.get(code) ?? [];
        const available = intersectAllowedValues(
          fieldEffects
            .map((effect) => constraintEffectAllowedValues(effect, field.definition))
            .filter((set): set is Set<string> => set !== undefined)
        );
        field.setAvailableValues(this.mode === "configure" ? available : undefined);
        const value = field.getValue();
        this.values.set(code, value);
        if (JSON.stringify(previous) !== JSON.stringify(value)) changed = true;
      }
      if (!changed) break;
    }

    const effects = activeConstraintEffects(rules, this.options.features, this.values);
    const conflicting = effects.filter((effect) => effect.status === "conflict");
    const restrictedCodes = new Set(
      effects
        .map((effect) => ("feature" in effect.target ? effect.target.feature : undefined))
        .filter((code): code is string => !!code)
    );
    for (const field of this.fields.values()) {
      const fieldEffects = effects.filter((effect) =>
        collectConstraintPredicates(effect.target).some(
          (predicate) => predicate.feature === field.definition.code
        )
      );
      const error = fieldEffects.find((effect) => effect.status === "conflict");
      const pending = fieldEffects.find((effect) => effect.status === "pending");
      const explanation = fieldEffects
        .map(
          (effect) =>
            `${effect.code} · ${this.actionLabel(effect.type)}: ${this.describeExpression(effect.target)}`
        )
        .join("\n");
      const value = field.getValue();
      const domainErrors = isSelected(value) ? validateValue(field.definition, value, false) : [];
      field.setValueState(
        domainErrors.length || error
          ? "Error"
          : pending
            ? "Warning"
            : restrictedCodes.has(field.definition.code)
              ? "Success"
              : "None",
        domainErrors[0] ?? explanation
      );
    }
    this.previewFeedbackHost.destroyItems();
    const allConflicts = [...conflicting];
    for (const field of this.fields.values()) {
      const available = intersectAllowedValues(
        effects
          .filter((effect) =>
            collectConstraintPredicates(effect.target).some(
              (predicate) => predicate.feature === field.definition.code
            )
          )
          .map((effect) => constraintEffectAllowedValues(effect, field.definition))
          .filter((set): set is Set<string> => set !== undefined)
      );
      if (available?.size === 0)
        this.previewFeedbackHost.addItem(
          new MessageStrip({
            text: trFormat(
              "cmConstraintNoAvailableValues",
              [field.definition.name],
              `${field.definition.name} 没有同时满足所有规则的可选值。`
            ),
            type: "Error",
            showIcon: true,
            showCloseButton: false
          })
        );
    }
    if (allConflicts.length)
      this.previewFeedbackHost.addItem(
        new MessageStrip({
          text: trFormat(
            "cmConstraintConflictCount",
            [allConflicts.length],
            `当前配置存在 ${allConflicts.length} 个规则冲突。`
          ),
          type: "Error",
          showIcon: true,
          showCloseButton: false
        })
      );
  }

  private describePredicate(predicate: ConstraintPredicate): string {
    const feature = this.featuresByCode.get(predicate.feature);
    const values = (Array.isArray(predicate.value) ? predicate.value : [predicate.value]).map(
      (value) => this.describeLiteral(value, feature)
    );
    const operator = tr(operatorLabels[predicate.type]);
    const unit =
      feature && ["Integer", "Decimal", "Range"].includes(feature.dataType) && feature.unit
        ? ` ${feature.unit}`
        : "";
    return `${feature?.name ?? predicate.feature} ${operator} ${values.join(", ")}${unit}`;
  }

  private describeExpression(expression: ConstraintExpression, parent?: "AND" | "OR"): string {
    if ("feature" in expression) return this.describePredicate(expression);
    if (expression.type === "NOT")
      return trFormat(
        "cmConstraintNegatedCondition",
        [this.describeExpression(expression.expression)],
        `不满足（${this.describeExpression(expression.expression)}）`
      );
    const separator = expression.type === "AND" ? tr("且") : tr("或");
    const text = expression.expressions
      .map((child) => this.describeExpression(child, expression.type))
      .join(` ${separator} `);
    return parent && parent !== expression.type ? `(${text})` : text;
  }

  private describeLiteral(
    value: ConstraintLiteral,
    feature: FeatureDefinition | undefined
  ): string {
    if (typeof value === "boolean") return tr(value ? "Yes" : "No");
    if (typeof value !== "string") return String(value);
    return feature?.domain.values.find((item) => item.code === value)?.value ?? value;
  }

  private actionLabel(type: ConstraintActionType): string {
    return tr(actionLabels[type]);
  }

  private setMode(mode: DesignerMode): void {
    if (mode === "design" && !this.options.canEdit()) {
      this.modeSelector.setSelectedKey("configure");
      return;
    }
    this.mode = mode;
    this.cancelSelection();
    this.modeSelector.setSelectedKey(mode);
    this.updateToolbarState();
    this.updatePreview();
  }
}
