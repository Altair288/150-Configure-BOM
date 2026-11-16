import Button from "sap/m/Button";
import HBox from "sap/m/HBox";
import Input from "sap/m/Input";
import Item from "sap/ui/core/Item";
import Label from "sap/m/Label";
import MessageStrip from "sap/m/MessageStrip";
import MessageToast from "sap/m/MessageToast";
import MultiComboBox from "sap/m/MultiComboBox";
import ObjectStatus from "sap/m/ObjectStatus";
import Popover from "sap/m/Popover";
import RadioButton from "sap/m/RadioButton";
import RadioButtonGroup from "sap/m/RadioButtonGroup";
import SegmentedButton from "sap/m/SegmentedButton";
import SegmentedButtonItem from "sap/m/SegmentedButtonItem";
import Select from "sap/m/Select";
import Text from "sap/m/Text";
import VBox from "sap/m/VBox";
import Control from "sap/ui/core/Control";
import CustomData from "sap/ui/core/CustomData";
import FlexItemData from "sap/m/FlexItemData";
import ObjectPageLayout from "sap/uxap/ObjectPageLayout";
import ObjectPageSection from "sap/uxap/ObjectPageSection";
import ObjectPageSubSection from "sap/uxap/ObjectPageSubSection";
import type { Input$LiveChangeEvent } from "sap/m/Input";
import type { InputBase$ChangeEvent } from "sap/m/InputBase";
import type { MultiComboBox$SelectionFinishEvent } from "sap/m/MultiComboBox";
import type { RadioButtonGroup$SelectEvent } from "sap/m/RadioButtonGroup";
import type { SegmentedButton$SelectionChangeEvent } from "sap/m/SegmentedButton";
import type { Select$ChangeEvent } from "sap/m/Select";
import type {
  ObjectPageLayout$NavigateEvent,
  ObjectPageLayout$SectionChangeEvent
} from "sap/uxap/ObjectPageLayout";
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
  removeConstraintExpressionAtPath,
  constraintRelationshipsForRule,
  validateConstraintRule
} from "../../model/constraintRules";
import ConstraintRelationshipOverlay from "./ConstraintRelationshipOverlay";
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
  value: ConstraintLiteral | ConstraintLiteral[];
  editPath?: ExpressionPathPart[];
}

interface ActionDraft {
  feature: FeatureDefinition;
  type: ConstraintActionType;
  operator: ConstraintOperator;
  selectedValue?: ConstraintLiteral | ConstraintLiteral[];
  value: unknown;
  actionIndex?: number;
  targetPath?: ExpressionPathPart[];
}

type ExpressionPathPart = number | "expression";

interface PredicatePathEntry {
  predicate: ConstraintPredicate;
  path: ExpressionPathPart[];
}

interface LazyFormSection {
  section: ObjectPageSection;
  contentHost: VBox;
  form: VBox;
  placeholder: VBox;
  featureCodes: Set<string>;
  estimatedHeight: number;
  materialized: boolean;
  pinned: boolean;
}

interface PendingInteractionPopover {
  anchor: Control;
  render: () => void;
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

function predicatePathsForFeature(
  expression: ConstraintExpression,
  featureCode: string,
  path: ExpressionPathPart[] = []
): PredicatePathEntry[] {
  if ("feature" in expression)
    return expression.feature === featureCode ? [{ predicate: expression, path }] : [];
  if (expression.type === "NOT")
    return predicatePathsForFeature(expression.expression, featureCode, [...path, "expression"]);
  return expression.expressions.flatMap((child, index) =>
    predicatePathsForFeature(child, featureCode, [...path, index])
  );
}

function replaceExpressionAtPath(
  expression: ConstraintExpression,
  path: ExpressionPathPart[],
  replacement: ConstraintExpression
): ConstraintExpression {
  const [part, ...remaining] = path;
  if (part === undefined) return replacement;
  if (typeof part === "number" && "expressions" in expression)
    return {
      ...expression,
      expressions: expression.expressions.map((child, index) =>
        index === part ? replaceExpressionAtPath(child, remaining, replacement) : child
      )
    };
  if (part === "expression" && expression.type === "NOT")
    return {
      ...expression,
      expression: replaceExpressionAtPath(expression.expression, remaining, replacement)
    };
  return expression;
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
  private readonly objectPage = new ObjectPageLayout({
    showAnchorBar: true,
    showAnchorBarPopover: false,
    upperCaseAnchorBar: false,
    showHeaderContent: false,
    useIconTabBar: false,
    enableLazyLoading: false,
    navigate: (event: ObjectPageLayout$NavigateEvent) => {
      const section = event.getParameter("section");
      if (section) this.materializeObjectPageSection(section);
    },
    sectionChange: (event: ObjectPageLayout$SectionChangeEvent) => {
      const section = event.getParameter("section");
      if (section) this.materializeObjectPageSection(section);
    }
  }).addStyleClass("cmConstraintObjectPage");
  private readonly relationshipOverlay: ConstraintRelationshipOverlay;
  private readonly lazyFormSections: LazyFormSection[] = [];
  private readonly pendingLazySectionFrames = new Map<LazyFormSection, number>();
  private lazySectionObserver?: IntersectionObserver;
  private lazyObserverRoot?: Element;
  private readonly observedLazySections = new Map<ObjectPageSection, Element>();
  private readonly fields = new Map<string, DesignerField>();
  private readonly values = new Map<string, unknown>();
  private readonly interactionMenuHost = new VBox({ width: "100%" }).addStyleClass(
    "cmConstraintDesignerInteractionMenu"
  );
  private readonly interactionPopover: Popover;
  private interactionPopoverOpen = false;
  private interactionPopoverAnchor?: Control;
  private pendingInteractionPopover?: PendingInteractionPopover;
  private readonly validationHost = new VBox({ width: "100%" });
  private readonly previewFeedbackHost = new VBox({ width: "100%" });
  private readonly messageOverlay = new VBox({
    items: [this.validationHost, this.previewFeedbackHost]
  }).addStyleClass("cmConstraintDesignerMessageOverlay");
  private readonly modelReadiness: string[];
  private readonly modeSelector: SegmentedButton;
  private toolbarVisible = true;
  private currentRule: ConstraintRule;
  private isNewDraft: boolean;
  private mode: DesignerMode = "design";
  private conditionDraft?: ConditionDraft;
  private actionDraft?: ActionDraft;
  private newDraftHasCondition = false;
  private newDraftHasAction = false;

  public constructor(options: ConfigurationRuleDesignerOptions) {
    this.options = options;
    this.featuresByCode = new Map(options.features.map((feature) => [feature.code, feature]));
    this.currentRule = structuredClone(options.rule);
    this.isNewDraft = options.isNewDraft();
    this.modelReadiness = validateContext(options.store, options.context.id);
    this.mode = options.context.status === "Draft" ? "design" : "configure";
    this.relationshipOverlay = new ConstraintRelationshipOverlay(this.objectPage);
    this.objectPage.addEventDelegate({
      onBeforeRendering: () => this.relationshipOverlay.beforeRendering(),
      onAfterRendering: () => {
        this.observeLazyFormSections();
        this.relationshipOverlay.afterRendering();
      }
    });
    this.interactionPopover = new Popover({
      title: "",
      placement: "HorizontalPreferredRight",
      contentWidth: "18rem",
      modal: false,
      showHeader: true,
      horizontalScrolling: false,
      verticalScrolling: false,
      content: [this.interactionMenuHost],
      afterOpen: () => {
        this.interactionPopoverOpen = true;
      },
      afterClose: () => this.handleInteractionPopoverAfterClose()
    }).addStyleClass("cmConstraintDesignerInteractionPopover");
    this.objectPage.addDependent(this.interactionPopover);
    this.modeSelector = new SegmentedButton({
      width: "10rem",
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

  public buildToolbarItems(): Control[] {
    this.updateToolbarState();
    return [this.modeSelector];
  }

  public setToolbarVisible(visible: boolean): void {
    this.toolbarVisible = visible;
    if (!visible) this.dismissInteractionPopover();
    this.updateToolbarState();
  }

  private updateRelationshipSections(
    relationships: ReturnType<typeof constraintRelationshipsForRule>
  ): void {
    const relatedFeatures = new Set(
      relationships.flatMap(({ source, target }) => [source, target])
    );
    for (const entry of this.lazyFormSections) {
      const pinned = [...entry.featureCodes].some((code) => relatedFeatures.has(code));
      if (pinned === entry.pinned) continue;
      entry.pinned = pinned;
      const sectionDom = this.observedLazySections.get(entry.section);
      if (pinned) this.materializeLazyFormSection(entry);
      else if (sectionDom && this.lazySectionObserver) {
        this.lazySectionObserver.unobserve(sectionDom);
        this.lazySectionObserver.observe(sectionDom);
      }
    }
  }

  public build(): VBox {
    const scrollContent = new VBox({
      width: "100%",
      fitContainer: true,
      items: [this.objectPage, this.messageOverlay]
    }).addStyleClass("cmConstraintDesignerContent");
    this.objectPage.setLayoutData(
      new FlexItemData({ growFactor: 1, shrinkFactor: 1, baseSize: "0%", minHeight: "0" })
    );
    return scrollContent.addStyleClass("cmConstraintDesigner");
  }

  public setRule(rule: ConstraintRule, isNewDraft: boolean): void {
    const changedRule = this.currentRule.id !== rule.id;
    const changedDraftState = this.isNewDraft !== isNewDraft;
    this.currentRule = structuredClone(rule);
    this.isNewDraft = isNewDraft;
    if (changedRule || changedDraftState) {
      this.newDraftHasCondition = !isNewDraft;
      this.newDraftHasAction = !isNewDraft;
      this.dismissInteractionPopover();
    }
    this.renderRelations();
    this.updatePreview();
  }

  public setFeatures(features: FeatureDefinition[]): void {
    this.dismissInteractionPopover();
    this.featuresByCode.clear();
    features.forEach((feature) => this.featuresByCode.set(feature.code, feature));
    this.buildForm();
    this.renderRelations();
    this.updatePreview();
  }

  public dispose(): void {
    this.dismissInteractionPopover();
    this.relationshipOverlay.dispose();
    this.clearLazyFormSections();
  }

  public setConfigureMode(): void {
    this.setMode("configure");
  }

  public refreshLayout(): void {
    this.objectPage.invalidate();
  }

  private buildForm(): void {
    this.clearLazyFormSections();
    this.fields.clear();
    this.values.clear();
    this.objectPage.destroySections();
    const groups = this.options.store.groups
      .filter((group) => group.contextId === this.options.context.id)
      .sort((left, right) => left.sort - right.sort);

    for (const group of groups) {
      const familyContainers = this.options.store.families
        .filter((family) => family.groupId === group.id && family.active)
        .sort((left, right) => left.sort - right.sort);
      const items: Control[] = [];
      const featureCodes = new Set<string>();
      let estimatedHeight = 48;
      for (const family of familyContainers) {
        const definitions = this.options.store.references
          .filter((reference) => reference.familyId === family.id)
          .map((reference) => resolveDefinition(this.options.store, reference))
          .filter((definition) => definition.active);
        const familyItems: Control[] = [
          new Label({
            text: family.displayName || family.name,
            design: "Bold"
          }).addStyleClass("cmConstraintDesignerFamilyTitle"),
          new Text({
            text: family.businessQuestion,
            wrapping: true
          }).addStyleClass("cmPreviewQuestion cmConstraintDesignerFamilyDescription")
        ];
        const featureItems: Control[] = [];
        let familyEstimatedHeight = 50;
        for (const definition of definitions) {
          featureCodes.add(definition.code);
          const field = this.buildField(definition, family.businessQuestion);
          const optionCount = definition.domain.values.filter((value) => value.active).length;
          const showFeatureLabel = definitions.length > 1 || definition.name !== family.name;
          if (showFeatureLabel)
            featureItems.push(
              new Label({
                text: `${definition.name}${definition.unit ? ` (${definition.unit})` : ""}`,
                required: definition.mandatory
              }).addStyleClass("cmConstraintDesignerFeatureLabel")
            );
          field.control.setLayoutData(
            new FlexItemData({ growFactor: 1, shrinkFactor: 1, baseSize: "0%", minWidth: "0" })
          );
          field.relationStatus.setLayoutData(new FlexItemData({ shrinkFactor: 0 }));
          featureItems.push(
            new HBox({
              width: "100%",
              alignItems: "Center",
              justifyContent: "SpaceBetween",
              items: [field.control, field.relationStatus]
            })
              .addCustomData(
                new CustomData({
                  key: "constraint-feature",
                  value: definition.code,
                  writeToDom: true
                })
              )
              .addStyleClass("cmConstraintDesignerFieldRow cmConstraintDesignerFeatureControl")
          );
          const usesRadioGroup =
            ["Enumeration", "Reference"].includes(definition.dataType) && optionCount <= 6;
          const radioRows = usesRadioGroup ? Math.ceil(Math.max(1, optionCount) / 3) : 1;
          familyEstimatedHeight +=
            (showFeatureLabel ? 26 : 0) + (usesRadioGroup ? radioRows * 32 : 32) + 6;
          if (["Decimal", "Integer", "Range"].includes(definition.dataType)) {
            featureItems.push(
              new Text({
                text: `${definition.domain.minimum ?? "不限"} – ${definition.domain.maximum ?? "不限"} ${definition.unit}  ·  Step ${definition.domain.step ?? "Any"}`
              }).addStyleClass("cmDomainHint")
            );
            familyEstimatedHeight += 24;
          }
        }
        familyItems.push(
          new VBox({
            width: "100%",
            items: featureItems
          }).addStyleClass("cmConstraintDesignerFamilyFields")
        );
        items.push(
          new VBox({
            width: "100%",
            items: familyItems
          }).addStyleClass("cmConstraintDesignerFamily")
        );
        estimatedHeight += familyEstimatedHeight;
      }
      if (!items.length) continue;

      const form = new VBox({
        items
      }).addStyleClass("cmConstraintDesignerForm cmPreviewForm");
      const placeholder = new VBox({
        width: "100%",
        height: `${estimatedHeight}px`,
        justifyContent: "Center",
        alignItems: "Center",
        items: [new Text({ text: tr("cmConstraintSectionLoading") })]
      }).addStyleClass("cmConstraintDesignerLazySectionPlaceholder");
      const contentHost = new VBox({
        width: "100%",
        items: [placeholder]
      }).addStyleClass("cmConstraintDesignerLazySectionContent");
      const subSection = new ObjectPageSubSection({
        title: group.name,
        titleUppercase: false,
        blocks: [contentHost]
      });
      const section = new ObjectPageSection({
        title: group.name,
        titleUppercase: false,
        subSections: [subSection]
      });
      const lazySection: LazyFormSection = {
        section,
        contentHost,
        form,
        placeholder,
        featureCodes,
        estimatedHeight,
        materialized: false,
        pinned: false
      };
      this.lazyFormSections.push(lazySection);
      this.objectPage.addSection(section);
    }

    if (this.lazyFormSections[0]) this.materializeLazyFormSection(this.lazyFormSections[0]);
  }

  private materializeObjectPageSection(section: ObjectPageSection): void {
    const entry = this.lazyFormSections.find((candidate) => candidate.section === section);
    if (entry) this.materializeLazyFormSection(entry);
  }

  private observeLazyFormSections(): void {
    const root = this.objectPage.getDomRef()?.querySelector(".sapUxAPObjectPageWrapper");
    if (!root || typeof IntersectionObserver === "undefined") {
      this.lazyFormSections.slice(0, 2).forEach((entry) => this.materializeLazyFormSection(entry));
      return;
    }

    if (!this.lazySectionObserver || this.lazyObserverRoot !== root) {
      this.lazySectionObserver?.disconnect();
      this.lazyObserverRoot = root;
      this.observedLazySections.clear();
      this.lazySectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((intersection) => {
            const entry = this.lazyFormSections.find(
              (candidate) =>
                this.observedLazySections.get(candidate.section) === intersection.target
            );
            if (!entry) return;
            if (intersection.isIntersecting) this.materializeLazyFormSection(entry);
            else this.dematerializeLazyFormSection(entry);
          });
        },
        { root, rootMargin: "200px 0px" }
      );
    }

    this.lazyFormSections.forEach((entry) => {
      const section = entry.section.getDomRef();
      const observed = this.observedLazySections.get(entry.section);
      if (section === observed) return;
      if (observed) this.lazySectionObserver?.unobserve(observed);
      if (section) {
        this.observedLazySections.set(entry.section, section);
        this.lazySectionObserver?.observe(section);
      } else this.observedLazySections.delete(entry.section);
    });
  }

  private materializeLazyFormSection(entry: LazyFormSection): void {
    if (entry.materialized) return;
    const placeholderIndex = entry.contentHost.indexOfItem(entry.placeholder);
    if (placeholderIndex < 0) return;
    entry.contentHost.removeItem(entry.placeholder);
    entry.contentHost.insertItem(entry.form, placeholderIndex);
    entry.materialized = true;
    const frame = window.requestAnimationFrame(() => {
      this.pendingLazySectionFrames.delete(entry);
      if (!entry.materialized) return;
      const height = entry.form.getDomRef()?.getBoundingClientRect().height;
      if (!height || !Number.isFinite(height)) return;
      entry.estimatedHeight = Math.ceil(height);
      entry.placeholder.setHeight(`${entry.estimatedHeight}px`);
    });
    this.pendingLazySectionFrames.set(entry, frame);
  }

  private dematerializeLazyFormSection(entry: LazyFormSection): void {
    if (!entry.materialized || entry.pinned) return;
    const pendingFrame = this.pendingLazySectionFrames.get(entry);
    if (pendingFrame !== undefined) {
      window.cancelAnimationFrame(pendingFrame);
      this.pendingLazySectionFrames.delete(entry);
    }
    const formDom = entry.form.getDomRef();
    const activeElement = document.activeElement;
    if (formDom && activeElement && formDom.contains(activeElement)) {
      if (activeElement instanceof HTMLElement) activeElement.blur();
      this.dismissInteractionPopover();
    }
    const height = formDom?.getBoundingClientRect().height;
    if (height && Number.isFinite(height)) {
      entry.estimatedHeight = Math.ceil(height);
      entry.placeholder.setHeight(`${entry.estimatedHeight}px`);
    }
    const formIndex = entry.contentHost.indexOfItem(entry.form);
    if (formIndex < 0) return;
    entry.contentHost.removeItem(entry.form);
    entry.contentHost.insertItem(entry.placeholder, formIndex);
    entry.materialized = false;
  }

  private clearLazyFormSections(): void {
    this.lazySectionObserver?.disconnect();
    this.lazySectionObserver = undefined;
    this.lazyObserverRoot = undefined;
    this.observedLazySections.clear();
    this.pendingLazySectionFrames.forEach((frame) => window.cancelAnimationFrame(frame));
    this.pendingLazySectionFrames.clear();
    this.lazyFormSections.forEach((entry) => {
      if (entry.materialized) entry.placeholder.destroy();
      else entry.form.destroy();
    });
    this.lazyFormSections.length = 0;
  }

  private buildField(definition: FeatureDefinition, question: string): DesignerField {
    const initial = initialFeatureValue(definition, this.options.profile);
    let readValue: () => unknown = () => undefined;
    let setAvailableValues: DesignerField["setAvailableValues"] = () => undefined;
    let setValueState: DesignerField["setValueState"] = () => undefined;
    const allowed = definition.domain.values
      .filter((value) => value.active)
      .sort((left, right) => left.sort - right.sort);
    const onChange = (value: unknown, anchor?: Control, captureSelection = true): void => {
      this.values.set(definition.code, value);
      this.updatePreview();
      if (captureSelection && anchor) this.showFieldInteractionMenu(definition.code, anchor);
    };

    if (definition.dataType === "Multi Enumeration") {
      const input = new MultiComboBox({
        width: "100%",
        selectedKeys: valueToKeys(initial),
        items: allowed.map((value) => new Item({ key: value.code, text: value.value })),
        selectionFinish: (event: MultiComboBox$SelectionFinishEvent) =>
          onChange(event.getSource().getSelectedKeys(), event.getSource())
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
      const buttons = allowed.map((value) => {
        const radio = new RadioButton({ text: value.value });
        radio.attachBrowserEvent("click", () => {
          window.setTimeout(() => {
            if (!radio.getDomRef() || !this.toolbarVisible || this.mode !== "design") return;
            if (
              this.interactionPopoverAnchor === radio ||
              this.pendingInteractionPopover?.anchor === radio
            )
              return;
            this.showFieldInteractionMenu(definition.code, radio);
          }, 0);
        });
        return radio;
      });
      const input = new RadioButtonGroup({
        width: "100%",
        columns: Math.max(1, allowed.length),
        selectedIndex: allowed.findIndex((value) => value.code === initial),
        buttons,
        select: (event: RadioButtonGroup$SelectEvent) => {
          const group = event.getSource();
          const index = group.getSelectedIndex();
          onChange(allowed[index]?.code, group.getButtons()[index] ?? group);
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
        change: (event: Select$ChangeEvent) =>
          onChange(event.getSource().getSelectedKey(), event.getSource())
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
        onChange(event.getParameter("value") ?? "", event.getSource(), false),
      change: (event: InputBase$ChangeEvent) =>
        onChange(event.getSource().getValue(), event.getSource())
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

  private dismissInteractionPopover(): void {
    this.pendingInteractionPopover = undefined;
    this.interactionPopoverAnchor = undefined;
    this.conditionDraft = undefined;
    this.actionDraft = undefined;
    this.interactionMenuHost.destroyItems();
    this.interactionPopover.close();
  }

  private updateInteractionPopover(anchor: Control, render: () => void): void {
    if (this.interactionPopoverOpen) {
      this.pendingInteractionPopover = { anchor, render };
      this.interactionPopover.close();
      return;
    }
    render();
    this.openInteractionPopover(anchor);
  }

  private openInteractionPopover(anchor: Control): void {
    this.interactionPopoverAnchor = anchor;
    this.interactionPopover.openBy(anchor);
    this.interactionPopoverOpen = true;
  }

  private handleInteractionPopoverAfterClose(): void {
    this.interactionPopoverOpen = false;
    this.interactionPopoverAnchor = undefined;
    const pending = this.pendingInteractionPopover;
    this.pendingInteractionPopover = undefined;
    if (!pending || !this.toolbarVisible || this.mode !== "design" || !this.options.canEdit()) {
      this.conditionDraft = undefined;
      this.actionDraft = undefined;
      this.interactionMenuHost.destroyItems();
      return;
    }
    pending.render();
    this.openInteractionPopover(pending.anchor);
  }

  private showFieldInteractionMenu(
    featureCode: string,
    anchor: Control,
    feedbackText?: string
  ): boolean {
    if (this.mode !== "design" || !this.options.canEdit()) {
      this.dismissInteractionPopover();
      return false;
    }
    const field = this.fields.get(featureCode);
    if (!field) return false;
    const value = asConstraintValue(field.definition, field.getValue());
    if (value === undefined) {
      this.dismissInteractionPopover();
      return false;
    }

    this.conditionDraft = undefined;
    this.actionDraft = undefined;
    this.updateInteractionPopover(anchor, () => {
      this.interactionMenuHost.destroyItems();
      if (feedbackText)
        this.interactionMenuHost.addItem(
          new ObjectStatus({ text: feedbackText, state: "Success" })
        );
      this.interactionMenuHost.addItem(
        new ObjectStatus({
          text: this.describeSelectedValue(value, field.definition),
          state: "Information"
        }).addStyleClass("cmConstraintDesignerInteractionValue")
      );

      const addGroupTitle = (text: string): void => {
        this.interactionMenuHost.addItem(
          new Text({ text }).addStyleClass("cmConstraintDesignerInteractionGroupTitle")
        );
      };
      const addMenuButton = (text: string, press: () => void, icon?: string): void => {
        this.interactionMenuHost.addItem(
          new Button({
            text,
            width: "100%",
            type: "Transparent",
            ...(icon ? { icon } : {}),
            press
          }).addStyleClass("cmConstraintDesignerInteractionMenuButton")
        );
      };
      const existingConditions = predicatePathsForFeature(
        this.currentRule.ast.condition,
        featureCode
      );
      if (existingConditions.length) {
        addGroupTitle(tr("cmConstraintCondition"));
        existingConditions.forEach((entry) =>
          addMenuButton(
            this.describePredicate(entry.predicate),
            () => this.beginConditionDraft(featureCode, "AND", anchor, entry),
            "sap-icon://edit"
          )
        );
      }
      const existingActions = this.currentRule.ast.actions.flatMap((action, actionIndex) =>
        predicatePathsForFeature(action.target, featureCode).map((entry) => ({
          actionIndex,
          actionType: action.type,
          ...entry
        }))
      );
      if (existingActions.length) {
        addGroupTitle(tr("cmConstraintAction"));
        existingActions.forEach((entry) =>
          addMenuButton(
            `${this.actionLabel(entry.actionType)} · ${this.describePredicate(entry.predicate)}`,
            () =>
              this.beginActionDraft(featureCode, entry.actionType, anchor, {
                actionIndex: entry.actionIndex,
                predicate: entry.predicate,
                path: entry.path
              }),
            "sap-icon://edit"
          )
        );
      }
      const hasConfiguredCondition = this.hasConfiguredCondition();
      if (hasConfiguredCondition) {
        addGroupTitle(tr("cmConstraintConditionMenu"));
        for (const connector of ["AND", "OR"] as const)
          addMenuButton(
            tr(connector === "AND" ? "cmConstraintAddConditionAnd" : "cmConstraintAddConditionOr"),
            () => this.beginConditionDraft(featureCode, connector, anchor)
          );
      } else {
        addMenuButton(tr("cmConstraintAddCondition"), () =>
          this.beginConditionDraft(featureCode, "AND", anchor)
        );
      }

      if (hasConfiguredCondition) {
        addGroupTitle(tr("cmConstraintActionMenu"));
        for (const type of ["REQUIRE", "EXCLUDE", "RESTRICT", "SET", "DERIVE"] as const)
          addMenuButton(this.actionLabel(type), () =>
            this.beginActionDraft(featureCode, type, anchor)
          );
      } else {
        this.interactionMenuHost.addItem(
          new ObjectStatus({
            text: tr("cmConstraintAddConditionFirst"),
            state: "Information"
          })
        );
      }

      this.interactionPopover.setTitle(field.definition.name);
    });
    return true;
  }

  public hasConfiguredCondition(): boolean {
    return (
      collectConstraintPredicates(this.currentRule.ast.condition).length > 0 &&
      (!this.isNewDraft || this.newDraftHasCondition)
    );
  }

  private beginConditionDraft(
    featureCode: string,
    connector: ConditionConnector,
    anchor: Control,
    existing?: PredicatePathEntry
  ): void {
    const field = this.fields.get(featureCode);
    if (!field) return;
    const value = asConstraintValue(field.definition, field.getValue());
    if (value === undefined) {
      MessageToast.show(tr("cmConstraintChooseValueFirst"));
      return;
    }
    const operators = constraintOperatorsFor(field.definition.dataType);
    const operator =
      existing && operators.includes(existing.predicate.type)
        ? existing.predicate.type
        : Array.isArray(value) && operators.includes("IN")
          ? "IN"
          : "EQUALS";
    const usesValueGroup = operator === "IN" || operator === "NOT_IN";
    const draftValue = usesValueGroup
      ? existing
        ? Array.isArray(existing.predicate.value)
          ? existing.predicate.value
          : [existing.predicate.value]
        : []
      : value;
    this.conditionDraft = {
      feature: field.definition,
      connector,
      operator,
      value: draftValue,
      editPath: existing?.path
    };
    this.renderConditionDraft(anchor);
  }

  private renderConditionDraft(anchor: Control): void {
    const draft = this.conditionDraft;
    if (!draft) return;
    const conditionAfterEdit =
      draft.editPath === undefined
        ? undefined
        : removeConstraintExpressionAtPath(this.currentRule.ast.condition, draft.editPath);
    const canRemoveExistingCondition = conditionAfterEdit !== undefined;
    this.updateInteractionPopover(anchor, () => {
      this.interactionMenuHost.destroyItems();
      const operatorSelect = new Select({
        width: "9rem",
        selectedKey: draft.operator,
        items: constraintOperatorsFor(draft.feature.dataType).map(
          (operator) => new Item({ key: operator, text: tr(operatorLabels[operator]) })
        ),
        change: (event: Select$ChangeEvent) => {
          const previousUsesValueGroup = draft.operator === "IN" || draft.operator === "NOT_IN";
          const operator = event.getSource().getSelectedKey() as ConstraintOperator;
          const usesValueGroup = operator === "IN" || operator === "NOT_IN";
          draft.operator = operator;
          if (usesValueGroup && !previousUsesValueGroup) draft.value = [];
          else if (!usesValueGroup && previousUsesValueGroup) {
            const field = this.fields.get(draft.feature.code);
            draft.value = field ? (asConstraintValue(draft.feature, field.getValue()) ?? "") : "";
          }
          this.renderConditionDraft(anchor);
        }
      });
      const valueEditor =
        draft.operator === "IN" || draft.operator === "NOT_IN"
          ? this.buildPredicateValueControl(draft.feature, draft.operator, draft.value, (value) => {
              const literal = asConstraintValue(draft.feature, value);
              draft.value =
                Array.isArray(value) && value.length === 0 ? [] : (literal ?? draft.value);
            })
          : undefined;
      this.interactionMenuHost.addItem(
        new VBox({
          width: "100%",
          items: [
            new ObjectStatus({
              text:
                draft.editPath !== undefined
                  ? tr("cmConstraintCondition")
                  : trFormat(
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
              items: [
                operatorSelect,
                valueEditor?.control ??
                  new ObjectStatus({
                    text: this.describeSelectedValue(draft.value, draft.feature),
                    state: "Information"
                  }).addStyleClass("cmConstraintDesignerInteractionValue")
              ]
            }).addStyleClass("cmConstraintDesignerDraftControls"),
            ...(draft.editPath === undefined
              ? []
              : [
                  new HBox({
                    width: "100%",
                    justifyContent: "Start",
                    items: [
                      new Button({
                        text: tr("cmConstraintRemoveCondition"),
                        icon: "sap-icon://delete",
                        type: "Transparent",
                        enabled: canRemoveExistingCondition,
                        tooltip: canRemoveExistingCondition
                          ? tr("cmConstraintRemoveCondition")
                          : tr("cmConstraintAtLeastOneCondition"),
                        press: () => this.removeConditionDraft()
                      })
                    ]
                  }).addStyleClass("cmConstraintDesignerDraftActions")
                ]),
            new HBox({
              width: "100%",
              justifyContent: "End",
              items: [
                new Button({
                  text:
                    draft.editPath !== undefined ? tr("cmSave") : tr("cmConstraintAddCondition"),
                  icon: draft.editPath !== undefined ? "sap-icon://accept" : "sap-icon://add",
                  type: "Emphasized",
                  press: () => this.addConditionDraft(valueEditor?.getValue() ?? draft.value)
                }),
                new Button({
                  text: tr("cmCancel"),
                  type: "Transparent",
                  press: () => this.dismissInteractionPopover()
                })
              ]
            })
          ]
        }).addStyleClass("cmConstraintDesignerDraft")
      );
      this.interactionPopover.setTitle(draft.feature.name);
    });
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
    const isEditing = draft.editPath !== undefined;
    const condition =
      draft.editPath !== undefined
        ? replaceExpressionAtPath(this.currentRule.ast.condition, draft.editPath, predicate)
        : isNew && !this.newDraftHasCondition
          ? predicate
          : appendConstraintPredicate(
              normalizeConstraintConditionForDesigner(this.currentRule.ast.condition),
              draft.connector,
              predicate
            );
    this.newDraftHasCondition = true;
    this.commitAst({ ...this.currentRule.ast, condition });
    this.dismissInteractionPopover();
    MessageToast.show(tr(isEditing ? "cmConstraintUnsavedChanges" : "cmConstraintConditionAdded"));
  }

  private removeConditionDraft(): void {
    const draft = this.conditionDraft;
    if (!draft || draft.editPath === undefined || !this.options.canEdit()) return;
    const condition = removeConstraintExpressionAtPath(
      this.currentRule.ast.condition,
      draft.editPath
    );
    if (!condition) {
      MessageToast.show(tr("cmConstraintAtLeastOneCondition"));
      return;
    }
    this.commitAst({ ...this.currentRule.ast, condition });
    this.dismissInteractionPopover();
    MessageToast.show(tr("cmConstraintUnsavedChanges"));
  }

  private beginActionDraft(
    featureCode: string,
    type: ConstraintActionType,
    anchor: Control,
    existing?: {
      actionIndex: number;
      predicate: ConstraintPredicate;
      path: ExpressionPathPart[];
    }
  ): void {
    if (!this.hasConfiguredCondition()) {
      MessageToast.show(tr("cmConstraintAddConditionFirst"));
      return;
    }
    const field = this.fields.get(featureCode);
    if (!field) return;
    const operators = constraintOperatorsFor(field.definition.dataType, type);
    const selected = asConstraintValue(field.definition, field.getValue());
    const preferredOperator =
      existing && operators.includes(existing.predicate.type)
        ? existing.predicate.type
        : type === "RESTRICT" && operators.includes("GREATER_THAN_OR_EQUAL")
          ? "GREATER_THAN_OR_EQUAL"
          : type === "REQUIRE" && Array.isArray(selected) && operators.includes("IN")
            ? "IN"
            : "EQUALS";
    const defaultValue = initialFeatureValue(field.definition, this.options.profile);
    let value =
      selected ?? existing?.predicate.value ?? asConstraintValue(field.definition, defaultValue);
    if (preferredOperator === "IN" && value !== undefined && !Array.isArray(value)) value = [value];
    this.actionDraft = {
      feature: field.definition,
      type,
      operator: preferredOperator,
      selectedValue: selected,
      actionIndex: existing?.actionIndex,
      targetPath: existing?.path,
      value:
        value ??
        (["Integer", "Decimal", "Range"].includes(field.definition.dataType)
          ? field.definition.domain.minimum
          : undefined)
    };
    this.renderActionDraft(anchor);
  }

  private renderActionDraft(anchor: Control): void {
    const draft = this.actionDraft;
    if (!draft) return;
    this.updateInteractionPopover(anchor, () => {
      this.interactionMenuHost.destroyItems();
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
          const operator = event.getSource().getSelectedKey() as ConstraintOperator;
          draft.operator = operator;
          if (
            (operator === "EQUALS" || operator === "NOT_EQUALS") &&
            draft.selectedValue !== undefined
          )
            draft.value = draft.selectedValue;
          this.renderActionDraft(anchor);
        }
      });
      const actionTypeSelect =
        draft.actionIndex === undefined
          ? undefined
          : new Select({
              width: "9rem",
              selectedKey: draft.type,
              tooltip: tr("cmConstraintAction"),
              items: (["REQUIRE", "EXCLUDE", "RESTRICT", "SET", "DERIVE"] as const).map(
                (type) => new Item({ key: type, text: this.actionLabel(type) })
              ),
              change: (event: Select$ChangeEvent) => {
                draft.type = event.getSource().getSelectedKey() as ConstraintActionType;
                const nextOperators = constraintOperatorsFor(draft.feature.dataType, draft.type);
                if (!nextOperators.includes(draft.operator))
                  draft.operator = nextOperators.includes("EQUALS")
                    ? "EQUALS"
                    : (nextOperators[0] ?? "EQUALS");
                this.renderActionDraft(anchor);
              }
            });
      let valueEditor: ValueControl;
      if (
        (draft.operator === "EQUALS" || draft.operator === "NOT_EQUALS") &&
        draft.selectedValue !== undefined
      ) {
        const selectedValue = draft.selectedValue;
        valueEditor = {
          control: new ObjectStatus({
            text: this.describeSelectedValue(selectedValue, draft.feature),
            state: "Information"
          }).addStyleClass("cmConstraintDesignerInteractionValue"),
          getValue: () => selectedValue
        };
      } else {
        valueEditor = this.buildPredicateValueControl(
          draft.feature,
          draft.operator,
          draft.value,
          (value) => {
            draft.value = value;
          }
        );
      }
      this.interactionMenuHost.addItem(
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
              items: [
                ...(actionTypeSelect ? [actionTypeSelect] : []),
                operatorSelect,
                valueEditor.control
              ]
            }).addStyleClass("cmConstraintDesignerDraftControls"),
            ...(draft.actionIndex === undefined
              ? []
              : [
                  new HBox({
                    width: "100%",
                    justifyContent: "Start",
                    items: [
                      new Button({
                        text: tr("cmConstraintRemoveResult"),
                        icon: "sap-icon://delete",
                        type: "Transparent",
                        press: () => this.removeActionDraft()
                      })
                    ]
                  }).addStyleClass("cmConstraintDesignerDraftActions")
                ]),
            new HBox({
              width: "100%",
              justifyContent: "End",
              items: [
                new Button({
                  text:
                    draft.actionIndex !== undefined ? tr("cmSave") : tr("cmConstraintAddRelation"),
                  icon: "sap-icon://accept",
                  type: "Emphasized",
                  press: () => this.addActionDraft(valueEditor.getValue())
                }),
                new Button({
                  text: tr("cmCancel"),
                  type: "Transparent",
                  press: () => this.dismissInteractionPopover()
                })
              ]
            })
          ]
        }).addStyleClass("cmConstraintDesignerDraft")
      );
      this.interactionPopover.setTitle(draft.feature.name);
    });
  }

  private removeActionDraft(): void {
    const draft = this.actionDraft;
    if (draft?.actionIndex === undefined || !this.options.canEdit()) return;
    const currentAction = this.currentRule.ast.actions[draft.actionIndex];
    if (!currentAction) return;
    const target =
      draft.targetPath === undefined
        ? undefined
        : removeConstraintExpressionAtPath(currentAction.target, draft.targetPath);
    const actions =
      target === undefined
        ? this.currentRule.ast.actions.filter((_, index) => index !== draft.actionIndex)
        : this.currentRule.ast.actions.map((action, index) =>
            index === draft.actionIndex ? { ...action, target } : action
          );
    this.commitAst({ ...this.currentRule.ast, actions });
    this.dismissInteractionPopover();
    MessageToast.show(tr("cmConstraintUnsavedChanges"));
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
    if (draft.actionIndex !== undefined) {
      const currentAction = this.currentRule.ast.actions[draft.actionIndex];
      if (!currentAction) return;
      const target =
        draft.targetPath === undefined
          ? action.target
          : replaceExpressionAtPath(currentAction.target, draft.targetPath, action.target);
      const actions = this.currentRule.ast.actions.map((existing, index) =>
        index === draft.actionIndex ? { ...existing, type: draft.type, target } : existing
      );
      this.commitAst({ ...this.currentRule.ast, actions });
      this.dismissInteractionPopover();
      MessageToast.show(tr("cmConstraintUnsavedChanges"));
      return;
    }
    const isNew = this.isNewDraft;
    const actions =
      isNew && !this.newDraftHasAction ? [action] : [...this.currentRule.ast.actions, action];
    this.newDraftHasAction = true;
    this.commitAst({ ...this.currentRule.ast, actions });
    this.dismissInteractionPopover();
    MessageToast.show(tr("cmConstraintRelationAdded"));
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
        placeholder: tr("cmConstraintChooseValues"),
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
    const relationships = constraintRelationshipsForRule(this.currentRule);
    this.relationshipOverlay.setRelationships(relationships);
    this.updateRelationshipSections(relationships);
    const projectedCondition = normalizeConstraintConditionForDesigner(
      this.currentRule.ast.condition
    );
    this.updateFieldRelations(projectedCondition);
    this.renderValidation();
    this.updateToolbarState();
  }

  private updateToolbarState(): void {
    this.modeSelector.setVisible(this.toolbarVisible);
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

  private describeSelectedValue(
    value: ConstraintLiteral | ConstraintLiteral[],
    feature: FeatureDefinition
  ): string {
    return (Array.isArray(value) ? value : [value])
      .map((item) => this.describeLiteral(item, feature))
      .join(", ");
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
    if (mode !== "design") this.dismissInteractionPopover();
    this.modeSelector.setSelectedKey(mode);
    this.updateToolbarState();
    this.updatePreview();
  }
}
