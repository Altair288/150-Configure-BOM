import Button from "sap/m/Button";
import CheckBox from "sap/m/CheckBox";
import Dialog from "sap/m/Dialog";
import HBox from "sap/m/HBox";
import Input from "sap/m/Input";
import Item from "sap/ui/core/Item";
import Label from "sap/m/Label";
import MessageStrip from "sap/m/MessageStrip";
import MultiComboBox from "sap/m/MultiComboBox";
import RadioButton from "sap/m/RadioButton";
import RadioButtonGroup from "sap/m/RadioButtonGroup";
import Select from "sap/m/Select";
import Text from "sap/m/Text";
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
  constraintEffectAllowedValues,
  constraintMaximumSelections,
  detectConstraintConflicts,
  reconcileConstrainedSelection,
  simulateConstraintActions
} from "../../model/constraintRules";
import type {
  ConstraintExpression,
  ConstraintPredicate,
  ConstraintPreviewEffect,
  ConstraintRule,
  ConstraintSimulation,
  ConstraintSimulationChange
} from "../../model/constraintRules";
import type {
  ConfigurationContext,
  ConfigurationProfile,
  ConfigurationStore,
  FeatureDefinition
} from "../../model/configuration";
import {
  button,
  constraintActionLabels,
  constraintIssueText,
  constraintOperatorLabels as previewOperatorLabels,
  describeConstraintDerivation,
  title,
  tr,
  trFormat,
  txt
} from "../../util/configurationUi";

type DialogHost = {
  addDependent(dependent: Dialog): void;
};

type PreviewMessageType = "Error" | "Warning";
type PreviewValueState = "None" | "Error" | "Warning";

interface PreviewFeatureField {
  definition: FeatureDefinition;
  getValue: () => unknown;
  setValue: (value: unknown) => void;
  setAvailableValues: (codes: Set<string> | undefined, maximum?: number) => void;
  setValueState: (state: PreviewValueState, message?: string) => void;
}

export interface ConfigurationPreviewOptions {
  store: ConfigurationStore;
  context: ConfigurationContext;
  profile: ConfigurationProfile;
  rules?: ConstraintRule[];
  getHost: () => DialogHost | undefined;
}

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
  if (predicate.type === "STEP" && Array.isArray(predicate.value))
    return `${name} ${operator} ${String(predicate.value[1] ?? "")}${feature?.unit ? ` ${feature.unit}` : ""}`;
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
      : describePreviewCondition(effect.target, features);
  const detail = target || effect.description || effect.name;
  if (effect.type === "DEFAULT")
    return trFormat(
      "cmConstraintLegacyDefaultPreview",
      [effect.name],
      `${effect.name}: this legacy default action is ignored; configure the Feature Model default instead`
    );
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
  if (["SET", "DERIVE", "DEFAULT", "RECOMMEND", "ADD", "REMOVE"].includes(effect.type))
    return `${effect.name}: ${tr(constraintActionLabels[effect.type])} ${detail}`;
  return trFormat(
    "cmPreviewRequireEffect",
    [effect.name, detail],
    `${effect.name}: 必须满足 ${detail}`
  );
}

function previewFeedback(
  effect: ConstraintPreviewEffect,
  features: Map<string, FeatureDefinition>
): { text: string; type: PreviewMessageType } | undefined {
  const description = describePreviewEffect(effect, features);
  if (effect.type === "DEFAULT")
    return { text: description, type: "Warning" };
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
  return undefined;
}

function describePreviewCondition(
  expression: ConstraintExpression,
  features: Map<string, FeatureDefinition>
): string {
  if ("feature" in expression) {
    const feature = features.get(expression.feature);
    if (expression.type === "ALWAYS") return tr("cmConstraintAlways");
    if (expression.type === "IS_UNSET")
      return `${feature?.name ?? expression.feature} ${tr("cmConstraintIsUnset")}`;
    return previewPredicateText(expression, feature);
  }
  if (expression.type === "NOT")
    return trFormat(
      "cmConstraintNegatedCondition",
      [describePreviewCondition(expression.expression, features)],
      `NOT (${describePreviewCondition(expression.expression, features)})`
    );
  return expression.expressions
    .map((child) => describePreviewCondition(child, features))
    .join(` ${tr(expression.type === "AND" ? "且" : "或")} `);
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
    const inputValues = new Map<string, unknown>();
    const fields = new Map<string, PreviewFeatureField>();
    const dismissedRecommendations = new Set<string>();
    const content = new VBox().addStyleClass("cmPreviewForm");
    const simulationFeedback = new VBox({ width: "100%" });
    content.addItem(simulationFeedback);
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
      values.clear();
      fields.forEach((field, code) => {
        field.setValue(inputValues.get(code));
        values.set(code, field.getValue());
      });
      const automaticChanges = new Map<string, ConstraintSimulationChange>();
      let simulation: ConstraintSimulation | undefined;
      for (let pass = 0; pass <= fields.size; pass += 1) {
        const previous = JSON.stringify([...values]);
        simulation = simulateConstraintActions(
          this.options.rules ?? [],
          features,
          values
        );
        simulation.changes.forEach((change) =>
          automaticChanges.set(JSON.stringify([change.ruleId, change.feature, change.type]), change)
        );
        for (const [code, value] of simulation.values) {
          const field = fields.get(code);
          if (!field) continue;
          field.setValue(value);
          values.set(code, field.getValue());
        }
        const effects = activeConstraintEffects(this.options.rules ?? [], features, values);
        const conflicts = detectConstraintConflicts(this.options.rules ?? [], features, values);
        const effectsByFeature = new Map<string, ConstraintPreviewEffect[]>();
        for (const effect of effects)
          for (const predicate of collectPreviewPredicates(effect.target)) {
            const current = effectsByFeature.get(predicate.feature) ?? [];
            current.push(effect);
            effectsByFeature.set(predicate.feature, current);
          }

        fields.forEach((field, code) => {
          const previousValue = field.getValue();
          const fieldEffects = effectsByFeature.get(code) ?? [];
          const allowedValues = intersectAllowedValues(
            fieldEffects
              .map((effect) => constraintEffectAllowedValues(effect, field.definition))
              .filter((set): set is Set<string> => set !== undefined)
          );
          const applyRestrictions =
            !conflicts.some((conflict) => conflict.feature === code) &&
            !simulation?.conflicts.some((conflict) => conflict.feature === code);
          field.setAvailableValues(
            applyRestrictions ? allowedValues : undefined,
            applyRestrictions ? constraintMaximumSelections(fieldEffects, code) : undefined
          );
          const value = field.getValue();
          values.set(code, value);
          if (JSON.stringify(value) !== JSON.stringify(previousValue)) {
            for (const effect of fieldEffects) {
              if (!constraintEffectAllowedValues(effect, field.definition)) continue;
              const rule = (this.options.rules ?? []).find((item) => item.id === effect.ruleId);
              if (!rule) continue;
              const change: ConstraintSimulationChange = {
                ruleId: rule.id,
                code: rule.code,
                name: rule.name,
                feature: code,
                type: effect.type,
                value,
                previousValue,
                condition: structuredClone(effect.trigger ?? rule.ast.condition)
              };
              automaticChanges.set(JSON.stringify([rule.id, code, effect.type]), change);
            }
          }
        });
        if (previous === JSON.stringify([...values])) break;
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
        const conflict = simulation?.conflicts.find((item) => item.feature === code);
        const conflictText = conflict
          ? trFormat(
              "cmConstraintConflictDetails",
              [
                field.definition.name,
                conflict.rules.map((rule) => `${rule.code} · ${rule.name}`).join(" / ")
              ],
              field.definition.name
            )
          : undefined;
        const inputError = domainErrors.length
          ? `${field.definition.name}: ${domainErrors[0]}`
          : (conflictText ?? feedbacks.find((feedback) => feedback.type === "Error")?.text);
        const inputWarning = feedbacks.find((feedback) => feedback.type === "Warning")?.text;
        field.setValueState(
          inputError ? "Error" : inputWarning ? "Warning" : "None",
          inputError ?? inputWarning
        );
      });
      simulationFeedback.destroyItems();
      for (const conflict of simulation?.conflicts ?? []) {
        const feature = featureByCode.get(conflict.feature);
        const reasons = conflict.rules
          .map((rule) => {
            const details = (this.options.rules ?? []).find((item) => item.id === rule.id);
            const effects = currentEffects
              .filter(
                (effect) =>
                  effect.ruleId === rule.id &&
                  collectPreviewPredicates(effect.target).some(
                    (predicate) => predicate.feature === conflict.feature
                  )
              )
              .map((effect) => describePreviewEffect(effect, featureByCode))
              .join("; ");
            return `${rule.code} · ${rule.name}${details ? `: ${describePreviewCondition(details.ast.condition, featureByCode)}` : ""}${effects ? ` → ${effects}` : ""}`;
          })
          .join(" / ");
        simulationFeedback.addItem(
          new MessageStrip({
            text: trFormat(
              "cmConstraintConflictDetails",
              [feature?.name ?? conflict.feature, reasons],
              conflict.feature
            ),
            type: "Error",
            showIcon: true
          })
        );
      }
      for (const change of automaticChanges.values()) {
        const feature = featureByCode.get(change.feature);
        if (!feature) continue;
        simulationFeedback.addItem(
          new MessageStrip({
            text: trFormat(
              "cmConstraintAutomaticExplanation",
              [
                feature.name,
                formatPreviewValue(change.value, feature) || tr("cmConstraintNoValue"),
                `${change.code} · ${change.name}`,
                describePreviewCondition(change.condition, featureByCode),
                change.derivation
                  ? describeConstraintDerivation(change.derivation, featureByCode, values)
                  : ""
              ],
              change.name
            ),
            type: "Information",
            showIcon: true
          })
        );
      }
      for (const effect of currentEffects) {
        if (
          effect.type !== "RESTRICT" ||
          effect.derivation?.kind !== "LINK" ||
          !effect.derivation.range ||
          effect.status === "pending"
        )
          continue;
        simulationFeedback.addItem(
          new MessageStrip({
            text: trFormat(
              "cmConstraintLinkedRangeExplanation",
              [
                effect.name,
                describePreviewCondition(effect.target, featureByCode),
                describeConstraintDerivation(effect.derivation, featureByCode, values)
              ],
              effect.name
            ),
            type: "Information",
            showIcon: true
          })
        );
      }
      for (const issue of simulation?.issues ?? [])
        simulationFeedback.addItem(
          new MessageStrip({
            text: trFormat(
              "cmConstraintSimulationIssue",
              [issue.name, constraintIssueText(issue)],
              constraintIssueText(issue)
            ),
            type: "Warning",
            showIcon: true
          })
        );
      for (const recommendation of simulation?.recommendations ?? []) {
        const key = JSON.stringify([recommendation.ruleId, recommendation.feature]);
        const feature = featureByCode.get(recommendation.feature);
        if (!feature || dismissedRecommendations.has(key)) continue;
        simulationFeedback.addItem(
          new HBox({
            width: "100%",
            alignItems: "Center",
            wrap: "Wrap",
            items: [
              new Text({
                text: trFormat(
                  "cmConstraintRecommendationExplanation",
                  [
                    feature.name,
                    formatPreviewValue(recommendation.value, feature),
                    recommendation.name
                  ],
                  feature.name
                ),
                wrapping: true
              }),
              new Button({
                text: tr("cmConstraintAcceptRecommendation"),
                type: "Transparent",
                press: () => {
                  inputValues.set(feature.code, recommendation.value);
                  touchedFeatureCodes.add(feature.code);
                  dismissedRecommendations.add(key);
                  updatePreview();
                }
              }),
              new Button({
                text: tr("cmConstraintKeepCurrent"),
                type: "Transparent",
                press: () => {
                  dismissedRecommendations.add(key);
                  updatePreview();
                }
              })
            ]
          }).addStyleClass("cmConstraintRecommendation")
        );
      }
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
            inputValues,
            fields,
            definition,
            definitions.length > 1 || definition.name !== family.name,
            useDefault,
            touchedFeatureCodes,
            dismissedRecommendations,
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
    inputValues: Map<string, unknown>,
    fields: Map<string, PreviewFeatureField>,
    definition: FeatureDefinition,
    showLabel: boolean,
    useDefault: boolean,
    touchedFeatureCodes: Set<string>,
    dismissedRecommendations: Set<string>,
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
    let setValue: (value: unknown) => void;
    let setAvailableValues: PreviewFeatureField["setAvailableValues"] = () => undefined;
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
        selectionChange: () => onValueChange(),
        selectionFinish: () => onValueChange()
      });
      control = input;
      getValue = () => input.getSelectedKeys();
      setValue = (value) => {
        const keys = Array.isArray(value)
          ? value.map(String)
          : hasPreviewSelection(value)
            ? [String(value)]
            : [];
        if (JSON.stringify(input.getSelectedKeys()) !== JSON.stringify(keys))
          input.setSelectedKeys(keys);
      };
      setAvailableValues = (codes, maximum) => {
        const current = getValue();
        const availableSelection = reconcileConstrainedSelection(current, codes);
        const retained = Array.isArray(availableSelection) ? availableSelection : [];
        if (JSON.stringify(current) !== JSON.stringify(retained)) input.setSelectedKeys(retained);
        input.getItems().forEach((item) => {
          const enabled =
            (!codes || codes.has(item.getKey())) &&
            (maximum === undefined ||
              retained.length < maximum ||
              retained.includes(item.getKey()));
          if (item.getEnabled() !== enabled) item.setEnabled(enabled);
        });
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
        setValue = (value) => {
          const index = allowed.findIndex((entry) => entry.code === String(value ?? ""));
          if (input.getSelectedIndex() !== index) input.setSelectedIndex(index);
        };
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
        setValue = (value) => {
          const key = value === undefined || value === null ? "" : String(value);
          if (input.getSelectedKey() !== key) input.setSelectedKey(key);
        };
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
        let booleanValue: boolean | undefined =
          initial === "true" ? true : initial === "false" ? false : undefined;
        const input = new CheckBox({
          text: definition.name,
          selected: initial === "true",
          select: () => {
            booleanValue = input.getSelected();
            onValueChange();
          }
        });
        control = input;
        getValue = () => booleanValue;
        setValue = (value) => {
          booleanValue =
            value === true || value === "true"
              ? true
              : value === false || value === "false"
                ? false
                : undefined;
          if (input.getSelected() !== (booleanValue === true))
            input.setSelected(booleanValue === true);
        };
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
        setValue = (value) => {
          const key = value === undefined || value === null ? "" : String(value);
          if (input.getSelectedKey() !== key) input.setSelectedKey(key);
        };
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
        valueLiveUpdate: true,
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
      setValue = (value) => {
        const text = value === undefined || value === null ? "" : String(value);
        if (input.getValue() !== text) input.setValue(text);
      };
      setValueState = (state, message) => {
        input.setValueState(state);
        input.setValueStateText(message ?? "");
      };
    }

    onValueChange = () => {
      touchedFeatureCodes.add(definition.code);
      dismissedRecommendations.clear();
      values.set(definition.code, getValue());
      inputValues.set(definition.code, getValue());
      updatePreview();
    };
    values.set(definition.code, getValue());
    inputValues.set(definition.code, getValue());
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
      setValue,
      setAvailableValues,
      setValueState
    });
  }
}
