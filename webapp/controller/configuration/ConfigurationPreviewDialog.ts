import CheckBox from "sap/m/CheckBox";
import Dialog from "sap/m/Dialog";
import Input from "sap/m/Input";
import Item from "sap/ui/core/Item";
import Label from "sap/m/Label";
import MessageStrip from "sap/m/MessageStrip";
import MultiComboBox from "sap/m/MultiComboBox";
import RadioButton from "sap/m/RadioButton";
import RadioButtonGroup from "sap/m/RadioButtonGroup";
import Select from "sap/m/Select";
import VBox from "sap/m/VBox";
import type { Input$LiveChangeEvent } from "sap/m/Input";
import Control from "sap/ui/core/Control";
import {
  contextReferences,
  resolveDefinition,
  validateContext,
  validateValue
} from "../../model/configuration";
import {
  activeConstraintEffects,
  reconcileConstrainedSelection,
  formatConstraintCondition
} from "../../model/constraintRules";
import type {
  ConstraintExpression,
  ConstraintOperator,
  ConstraintPredicate,
  ConstraintPreviewEffect,
  ConstraintRule
} from "../../model/constraintRules";
import type {
  ConfigurationContext,
  ConfigurationProfile,
  ConfigurationStore,
  FeatureDefinition
} from "../../model/configuration";
import { button, title, tr, trFormat, txt } from "../../util/configurationUi";

type DialogHost = {
  addDependent(dependent: Dialog): void;
};

type PreviewMessageType = "Error" | "Warning";
type PreviewValueState = "None" | "Error" | "Warning";

interface PreviewFeatureField {
  definition: FeatureDefinition;
  getValue: () => unknown;
  setAvailableValues: (codes: Set<string> | undefined) => void;
  setValueState: (state: PreviewValueState, message?: string) => void;
}

export interface ConfigurationPreviewOptions {
  store: ConfigurationStore;
  context: ConfigurationContext;
  profile: ConfigurationProfile;
  rules?: ConstraintRule[];
  getHost: () => DialogHost | undefined;
}

const previewOperatorLabels: Record<ConstraintOperator, string> = {
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

function hasPreviewSelection(value: unknown): boolean {
  return (
    value !== undefined &&
    value !== null &&
    value !== "" &&
    !(Array.isArray(value) && !value.length)
  );
}

function formatPreviewValue(value: unknown, feature: FeatureDefinition): string {
  const values = Array.isArray(value) ? value : [value];
  const formatted = values
    .map((entry) => {
      if (entry === undefined || entry === null || entry === "") return "";
      if (typeof entry === "boolean") return tr(entry ? "Yes" : "No");
      const option = feature.domain.values.find((item) => item.code === String(entry));
      return option?.value ?? String(entry);
    })
    .filter(Boolean);
  const unit = ["Integer", "Decimal", "Range"].includes(feature.dataType) ? feature.unit : "";
  return `${formatted.join(", ")}${unit ? ` ${unit}` : ""}`;
}

function collectPreviewPredicates(expression: ConstraintExpression): ConstraintPredicate[] {
  if ("feature" in expression) return [expression];
  if ("expression" in expression) return collectPreviewPredicates(expression.expression);
  return expression.expressions.flatMap(collectPreviewPredicates);
}

function previewPredicateText(
  predicate: ConstraintPredicate,
  feature: FeatureDefinition | undefined
): string {
  const name = feature?.name ?? predicate.feature;
  const operator = tr(previewOperatorLabels[predicate.type]);
  const value = feature
    ? formatPreviewValue(predicate.value, feature)
    : Array.isArray(predicate.value)
      ? predicate.value.join(", ")
      : String(predicate.value);
  return `${name} ${operator} ${value}`;
}

function describePreviewEffect(
  effect: ConstraintPreviewEffect,
  features: Map<string, FeatureDefinition>
): string {
  const target =
    "feature" in effect.target
      ? previewPredicateText(effect.target, features.get(effect.target.feature))
      : formatConstraintCondition(effect.target);
  const detail = target || effect.description || effect.name;
  if (effect.direction === "condition")
    return trFormat(
      "cmPreviewReverseExcludeEffect",
      [effect.name, detail],
      `${effect.name}: 当前已选目标，不能同时选择 ${detail}`
    );
  if (effect.type === "EXCLUDE")
    return trFormat(
      "cmPreviewExcludeEffect",
      [effect.name, detail],
      `${effect.name}: 不允许 ${detail}`
    );
  if (effect.type === "RESTRICT")
    return trFormat(
      "cmPreviewRestrictEffect",
      [effect.name, detail],
      `${effect.name}: 需要满足 ${detail}`
    );
  if (effect.type === "SET" || effect.type === "DERIVE")
    return trFormat(
      "cmPreviewManualEffect",
      [effect.name, detail],
      `${effect.name}: 预览不会自动执行 ${detail}`
    );
  return trFormat(
    "cmPreviewRequireEffect",
    [effect.name, detail],
    `${effect.name}: 必须满足 ${detail}`
  );
}

function previewOptionValues(
  effect: ConstraintPreviewEffect,
  feature: FeatureDefinition
): Set<string> | undefined {
  if (
    effect.type === "SET" ||
    effect.type === "DERIVE" ||
    !("feature" in effect.target) ||
    effect.target.feature !== feature.code ||
    !["Boolean", "Enumeration", "Multi Enumeration", "Reference"].includes(feature.dataType)
  )
    return undefined;

  const options =
    feature.dataType === "Boolean"
      ? ["true", "false"]
      : feature.domain.values.filter((value) => value.active).map((value) => value.code);
  const values = Array.isArray(effect.target.value)
    ? effect.target.value.map(String)
    : [String(effect.target.value)];
  let matches: Set<string>;
  switch (effect.target.type) {
    case "EQUALS":
      matches = new Set(options.filter((option) => option === values[0]));
      break;
    case "NOT_EQUALS":
      matches = new Set(options.filter((option) => option !== values[0]));
      break;
    case "IN":
      matches = new Set(options.filter((option) => values.includes(option)));
      break;
    case "NOT_IN":
      matches = new Set(options.filter((option) => !values.includes(option)));
      break;
    default:
      return undefined;
  }
  const mustMatch = effect.type !== "EXCLUDE";
  return mustMatch ? matches : new Set(options.filter((option) => !matches.has(option)));
}

function previewFeedback(
  effect: ConstraintPreviewEffect,
  features: Map<string, FeatureDefinition>
): { text: string; type: PreviewMessageType } | undefined {
  const description = describePreviewEffect(effect, features);
  if (effect.status === "conflict")
    return {
      text: trFormat("cmPreviewConstraintConflict", [description], `约束冲突：${description}`),
      type: "Error"
    };
  if (effect.status === "pending")
    return {
      text: trFormat("cmPreviewConstraintPending", [description], `待选择：${description}`),
      type: "Warning"
    };
  if (effect.status === "not-applied")
    return {
      text: description,
      type: "Warning"
    };
  return undefined;
}

function intersectAllowedValues(sets: Set<string>[]): Set<string> | undefined {
  if (!sets.length) return undefined;
  return new Set([...sets[0]].filter((value) => sets.slice(1).every((set) => set.has(value))));
}

export default class ConfigurationPreviewDialog {
  private readonly options: ConfigurationPreviewOptions;

  public constructor(options: ConfigurationPreviewOptions) {
    this.options = options;
  }

  public open(): void {
    const touchedFeatureCodes = new Set<string>();
    const groups = this.options.store.groups
      .filter((group) => group.contextId === this.options.context.id)
      .sort((a, b) => a.sort - b.sort);
    const features = contextReferences(this.options.store, this.options.context.id).map(
      (reference) => resolveDefinition(this.options.store, reference)
    );
    const featureByCode = new Map(features.map((feature) => [feature.code, feature]));
    const values = new Map<string, unknown>();
    const fields = new Map<string, PreviewFeatureField>();
    const content = new VBox().addStyleClass("cmPreviewForm");
    const readiness = validateContext(this.options.store, this.options.context.id);
    if (readiness.length)
      content.addItem(
        new MessageStrip({
          text: `模型完整性提示：${readiness.join("；")}`,
          type: "Warning",
          showIcon: true
        })
      );

    const updatePreview = (): void => {
      fields.forEach((field, code) => values.set(code, field.getValue()));

      for (let pass = 0; pass <= fields.size; pass += 1) {
        const effects = activeConstraintEffects(this.options.rules ?? [], features, values);
        const effectsByFeature = new Map<string, ConstraintPreviewEffect[]>();
        for (const effect of effects)
          for (const predicate of collectPreviewPredicates(effect.target)) {
            const current = effectsByFeature.get(predicate.feature) ?? [];
            current.push(effect);
            effectsByFeature.set(predicate.feature, current);
          }

        let selectionChanged = false;
        fields.forEach((field, code) => {
          const previousValue = field.getValue();
          const fieldEffects = effectsByFeature.get(code) ?? [];
          const allowedValues = intersectAllowedValues(
            fieldEffects
              .map((effect) => previewOptionValues(effect, field.definition))
              .filter((set): set is Set<string> => set !== undefined)
          );
          field.setAvailableValues(allowedValues);
          const value = field.getValue();
          values.set(code, value);
          if (JSON.stringify(value) !== JSON.stringify(previousValue)) selectionChanged = true;
        });
        if (!selectionChanged) break;
      }

      const currentEffects = activeConstraintEffects(this.options.rules ?? [], features, values);
      const currentEffectsByFeature = new Map<string, ConstraintPreviewEffect[]>();
      for (const effect of currentEffects)
        for (const predicate of collectPreviewPredicates(effect.target)) {
          const current = currentEffectsByFeature.get(predicate.feature) ?? [];
          current.push(effect);
          currentEffectsByFeature.set(predicate.feature, current);
        }

      fields.forEach((field, code) => {
        const fieldEffects = currentEffectsByFeature.get(code) ?? [];
        const value = field.getValue();
        const domainErrors = hasPreviewSelection(value)
          ? validateValue(field.definition, value, false)
          : touchedFeatureCodes.has(code) && field.definition.mandatory
            ? validateValue(field.definition, value, true)
            : [];
        const feedbacks = fieldEffects
          .map((effect) => previewFeedback(effect, featureByCode))
          .filter((feedback): feedback is { text: string; type: PreviewMessageType } => !!feedback);
        const inputError = domainErrors.length
          ? `${field.definition.name}: ${domainErrors[0]}`
          : feedbacks.find((feedback) => feedback.type === "Error")?.text;
        const inputWarning = feedbacks.find((feedback) => feedback.type === "Warning")?.text;
        field.setValueState(
          inputError ? "Error" : inputWarning ? "Warning" : "None",
          inputError ?? inputWarning
        );
      });
    };

    const useDefault = this.options.profile.defaultBehavior !== "No Default";
    for (const group of groups) {
      content.addItem(title(group.name).addStyleClass("cmPreviewGroup"));
      for (const family of this.options.store.families
        .filter((item) => item.groupId === group.id && item.active)
        .sort((a, b) => a.sort - b.sort)) {
        const references = this.options.store.references.filter(
          (ref) => ref.familyId === family.id
        );
        const definitions = references
          .map((ref) => resolveDefinition(this.options.store, ref))
          .filter((definition) => definition.active);
        content.addItem(
          new Label({
            text: family.displayName || family.name,
            design: "Bold"
          })
        );
        content.addItem(txt(family.businessQuestion).addStyleClass("cmPreviewQuestion"));
        definitions.forEach((definition) =>
          this.addDefinitionControl(
            content,
            values,
            fields,
            definition,
            definitions.length > 1 || definition.name !== family.name,
            useDefault,
            touchedFeatureCodes,
            updatePreview
          )
        );
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

    updatePreview();
    const dialog = new Dialog({
      title: `${this.options.context.name} · Preview`,
      contentWidth: "42rem",
      contentHeight: "85vh",
      verticalScrolling: true,
      content: [content],
      endButton: button("关闭预览", () => dialog.close()),
      afterClose: () => dialog.destroy()
    });
    this.options.getHost()?.addDependent(dialog);
    dialog.setDraggable(true).setResizable(true);
    dialog.addStyleClass("cmPreviewDrawer sapUiSizeCompact");
    dialog.open();
  }

  private addDefinitionControl(
    content: VBox,
    values: Map<string, unknown>,
    fields: Map<string, PreviewFeatureField>,
    definition: FeatureDefinition,
    showLabel: boolean,
    useDefault: boolean,
    touchedFeatureCodes: Set<string>,
    updatePreview: () => void
  ): void {
    if (showLabel)
      content.addItem(
        new Label({
          text: `${definition.name}${definition.unit ? ` (${definition.unit})` : ""}`,
          required: definition.mandatory
        })
      );

    let getValue: () => unknown;
    let setAvailableValues: (codes: Set<string> | undefined) => void = () => undefined;
    let setValueState: PreviewFeatureField["setValueState"] = () => undefined;
    let onValueChange = (): void => undefined;
    let control: Control;
    const dataType = definition.dataType;
    const domain = definition.domain;
    const allowed = domain.values.filter((value) => value.active).sort((a, b) => a.sort - b.sort);
    const initial = useDefault
      ? definition.defaultValue ||
        allowed.find((value) => value.defaultValue)?.code ||
        (this.options.profile.defaultBehavior === "Auto Select Single Value" && allowed.length === 1
          ? allowed[0].code
          : "")
      : "";

    if (dataType === "Multi Enumeration") {
      const input = new MultiComboBox({
        width: "100%",
        selectedKeys: useDefault
          ? definition.defaultValue
            ? definition.defaultValue.split(",").map((value) => value.trim())
            : allowed.filter((value) => value.defaultValue).map((value) => value.code)
          : [],
        items: allowed.map((value) => new Item({ key: value.code, text: value.value })),
        selectionFinish: () => onValueChange()
      });
      control = input;
      getValue = () => input.getSelectedKeys();
      setAvailableValues = (codes) => {
        const current = getValue();
        const availableSelection = reconcileConstrainedSelection(current, codes);
        const retained = Array.isArray(availableSelection) ? availableSelection : [];
        if (JSON.stringify(current) !== JSON.stringify(retained)) input.setSelectedKeys(retained);
        input.getItems().forEach((item) => item.setEnabled(!codes || codes.has(item.getKey())));
      };
      setValueState = (state, message) => {
        input.setValueState(state);
        input.setValueStateText(message ?? "");
      };
    } else if (["Enumeration", "Reference"].includes(dataType)) {
      if (dataType === "Enumeration" && allowed.length <= 6) {
        const input = new RadioButtonGroup({
          columns: 3,
          selectedIndex: allowed.findIndex((value) => value.code === initial),
          buttons: allowed.map((value) => new RadioButton({ text: value.value })),
          select: () => onValueChange()
        });
        control = input;
        getValue = () => allowed[input.getSelectedIndex()]?.code ?? "";
        setValueState = (state, message) =>
          input.setTooltip(state === "None" ? "" : (message ?? ""));
        setAvailableValues = (codes) => {
          const current = String(getValue() ?? "");
          const retained = reconcileConstrainedSelection(current, codes, true);
          if (current !== String(retained ?? "")) {
            const index = allowed.findIndex((entry) => entry.code === retained);
            input.setSelectedIndex(index);
          }
          input.getButtons().forEach((button, index) => {
            const code = allowed[index]?.code ?? "";
            button.setEnabled(!codes || codes.has(code));
          });
        };
      } else {
        const input = new Select({
          width: "100%",
          selectedKey: initial,
          items: [
            new Item({ key: "", text: "请选择…" }),
            ...allowed.map((value) => new Item({ key: value.code, text: value.value }))
          ],
          change: () => onValueChange()
        });
        control = input;
        getValue = () => input.getSelectedKey();
        setAvailableValues = (codes) => {
          const selected = String(getValue() ?? "");
          const retained = reconcileConstrainedSelection(selected, codes, true);
          if (selected !== String(retained ?? "")) input.setSelectedKey(String(retained ?? ""));
          input
            .getItems()
            .forEach((item) =>
              item.setEnabled(!item.getKey() || !codes || codes.has(item.getKey()))
            );
        };
        setValueState = (state, message) => {
          input.setValueState(state);
          input.setValueStateText(message ?? "");
        };
      }
    } else if (dataType === "Boolean") {
      if (!definition.mandatory) {
        const input = new CheckBox({
          text: definition.name,
          selected: initial === "true",
          select: () => onValueChange()
        });
        control = input;
        getValue = () => (input.getSelected() ? true : undefined);
        setValueState = (state, message) =>
          input.setTooltip(state === "None" ? "" : (message ?? ""));
      } else {
        const input = new Select({
          width: "100%",
          selectedKey: initial,
          items: [
            new Item({ key: "", text: "请选择…" }),
            new Item({ key: "true", text: tr("Yes") }),
            new Item({ key: "false", text: tr("No") })
          ],
          change: () => onValueChange()
        });
        control = input;
        getValue = () => input.getSelectedKey();
        setAvailableValues = (codes) => {
          const selected = String(getValue() ?? "");
          const retained = reconcileConstrainedSelection(selected, codes, true);
          if (selected !== String(retained ?? "")) input.setSelectedKey(String(retained ?? ""));
          input
            .getItems()
            .forEach((item) =>
              item.setEnabled(!item.getKey() || !codes || codes.has(item.getKey()))
            );
        };
        setValueState = (state, message) => {
          input.setValueState(state);
          input.setValueStateText(message ?? "");
        };
      }
    } else {
      const input = new Input({
        value: initial,
        width: "100%",
        type: ["Integer", "Decimal"].includes(dataType)
          ? "Number"
          : dataType === "Date"
            ? "Date"
            : dataType === "DateTime"
              ? "DatetimeLocale"
              : "Text",
        placeholder:
          dataType === "Range"
            ? "起始值 ~ 结束值"
            : dataType === "String"
              ? `最多 ${domain.maxLength ?? "不限"} 字符`
              : "输入值",
        description: definition.unit,
        liveChange: (event: Input$LiveChangeEvent) => {
          values.set(definition.code, event.getParameter("value") ?? "");
          onValueChange();
        }
      });
      control = input;
      getValue = () => input.getValue();
      setValueState = (state, message) => {
        input.setValueState(state);
        input.setValueStateText(message ?? "");
      };
    }

    onValueChange = () => {
      touchedFeatureCodes.add(definition.code);
      values.set(definition.code, getValue());
      updatePreview();
    };
    values.set(definition.code, getValue());
    content.addItem(control);

    if (["Decimal", "Integer", "Range"].includes(dataType))
      content.addItem(
        txt(
          `${domain.minimum ?? "不限"} – ${domain.maximum ?? "不限"} ${definition.unit}  ·  Step ${domain.step ?? "Any"}`
        ).addStyleClass("cmDomainHint")
      );

    fields.set(definition.code, {
      definition,
      getValue,
      setAvailableValues,
      setValueState
    });
  }
}
