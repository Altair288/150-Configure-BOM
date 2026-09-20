import Control from "sap/ui/core/Control";
import Item from "sap/ui/core/Item";
import Button from "sap/m/Button";
import CheckBox from "sap/m/CheckBox";
import Dialog from "sap/m/Dialog";
import Input from "sap/m/Input";
import Label from "sap/m/Label";
import MessageStrip from "sap/m/MessageStrip";
import MultiComboBox from "sap/m/MultiComboBox";
import RadioButton from "sap/m/RadioButton";
import RadioButtonGroup from "sap/m/RadioButtonGroup";
import Select from "sap/m/Select";
import VBox from "sap/m/VBox";
import {
  resolveDefinition,
  validateContext,
  validateValue
} from "../../model/configuration";
import type {
  ConfigurationContext,
  ConfigurationProfile,
  ConfigurationStore,
  FeatureDefinition,
  FeatureFamily
} from "../../model/configuration";
import { button, title, tr, txt } from "../../util/configurationUi";

type DialogHost = {
  addDependent(dependent: Control): void;
};

export interface ConfigurationPreviewOptions {
  store: ConfigurationStore;
  context: ConfigurationContext;
  profile: ConfigurationProfile;
  getHost: () => DialogHost | undefined;
}

export default class ConfigurationPreviewDialog {
  private readonly options: ConfigurationPreviewOptions;

  public constructor(options: ConfigurationPreviewOptions) {
    this.options = options;
  }

  public open(): void {
    const checks: (() => string[])[] = [];
    const groups = this.options.store.groups
      .filter((group) => group.contextId === this.options.context.id)
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
    const readiness = validateContext(this.options.store, this.options.context.id);
    if (readiness.length)
      content.addItem(
        new MessageStrip({
          text: `模型完整性提示：${readiness.join("；")}`,
          type: "Warning",
          showIcon: true
        })
      );
    const message = new MessageStrip({ text: "", visible: false, showIcon: true });
    const useDefault = this.options.profile.defaultBehavior !== "No Default";
    for (const group of groups) {
      content.addItem(title(group.name).addStyleClass("cmPreviewGroup"));
      for (const family of this.options.store.families
        .filter((item) => item.groupId === group.id && item.active)
        .sort((a, b) => a.sort - b.sort)) {
        const references = this.options.store.references.filter((ref) => ref.familyId === family.id);
        const definitions = references
          .map((ref) => ({ ref, definition: resolveDefinition(this.options.store, ref) }))
          .filter(({ definition }) => definition.active);
        content.addItem(
          new Label({
            text: family.displayName || family.name,
            required: family.mandatory,
            design: "Bold"
          })
        );
        content.addItem(txt(family.businessQuestion).addStyleClass("cmPreviewQuestion"));
        const choices = definitions.filter(({ definition }) => definition.kind === "Choice");
        if (choices.length) this.addChoiceControl(content, checks, values, family, choices, useDefault);
        for (const { ref, definition } of definitions.filter(
          ({ definition: item }) => item.kind !== "Choice"
        )) {
          this.addDefinitionControl(
            content,
            checks,
            values,
            family,
            ref.id,
            definition,
            definitions.length > 1 || definition.name !== family.name,
            useDefault
          );
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
      title: `${this.options.context.name} · Preview`,
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
    this.options.getHost()?.addDependent(dialog);
    dialog.setDraggable(true).setResizable(true);
    dialog.addStyleClass("cmPreviewDrawer sapUiSizeCompact");
    dialog.open();
  }

  private addChoiceControl(
    content: VBox,
    checks: (() => string[])[],
    values: Map<string, unknown>,
    family: FeatureFamily,
    choices: { definition: FeatureDefinition }[],
    useDefault: boolean
  ): void {
    const active = choices.map(({ definition }) => definition);
    if (family.selectionMode === "Multiple") {
      const input = new MultiComboBox({
        width: "100%",
        selectedKeys: useDefault
          ? active.filter((definition) => definition.defaultValue === definition.code).map((definition) => definition.id)
          : [],
        items: active.map((definition) => new Item({ key: definition.id, text: definition.name })),
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
      return;
    }
    const input = new RadioButtonGroup({
      columns: 2,
      selectedIndex:
        useDefault && active.some((definition) => definition.defaultValue === definition.code)
          ? active.findIndex((definition) => definition.defaultValue === definition.code)
          : useDefault &&
              this.options.profile.defaultBehavior === "Auto Select Single Value" &&
              active.length === 1
            ? 0
            : -1,
      buttons: active.map((definition) => new RadioButton({ text: definition.name })),
      select: () => values.set(family.id, active[input.getSelectedIndex()]?.code)
    });
    content.addItem(input);
    checks.push(() =>
      family.mandatory && input.getSelectedIndex() < 0 ? [`${family.name}: 请选择一个值`] : []
    );
  }

  private addDefinitionControl(
    content: VBox,
    checks: (() => string[])[],
    values: Map<string, unknown>,
    family: FeatureFamily,
    referenceId: string,
    definition: FeatureDefinition,
    showLabel: boolean,
    useDefault: boolean
  ): void {
    if (showLabel)
      content.addItem(
        new Label({
          text: `${definition.name}${definition.unit ? ` (${definition.unit})` : ""}`,
          required: definition.mandatory
        })
      );
    let getValue: () => unknown;
    let control: Control;
    let setError: (errors: string[]) => void = () => undefined;
    const allowed = definition.domain.values
      .filter((value) => value.active)
      .sort((a, b) => a.sort - b.sort);
    const initial = useDefault
      ? definition.defaultValue ||
        allowed.find((value) => value.defaultValue)?.code ||
        (this.options.profile.defaultBehavior === "Auto Select Single Value" && allowed.length === 1
          ? allowed[0].code
          : "")
      : "";
    if (definition.dataType === "Multi Enumeration") {
      const input = new MultiComboBox({
        width: "100%",
        selectedKeys: useDefault
          ? definition.defaultValue
            ? definition.defaultValue.split(",").map((value) => value.trim())
            : allowed.filter((value) => value.defaultValue).map((value) => value.code)
          : [],
        items: allowed.map((value) => new Item({ key: value.code, text: value.value }))
      });
      control = input;
      getValue = () => input.getSelectedKeys();
      setError = (errors) => {
        input.setValueState(errors.length ? "Error" : "None");
        input.setValueStateText(errors[0] ?? "");
      };
    } else if (["Enumeration", "Reference"].includes(definition.dataType)) {
      if (definition.dataType === "Enumeration" && allowed.length <= 6) {
        const input = new RadioButtonGroup({
          columns: 3,
          selectedIndex: allowed.findIndex((value) => value.code === initial),
          buttons: allowed.map((value) => new RadioButton({ text: value.value }))
        });
        control = input;
        getValue = () => allowed[input.getSelectedIndex()]?.code ?? "";
      } else {
        const input = new Select({
          width: "100%",
          selectedKey: initial,
          items: [
            new Item({ key: "", text: "请选择…" }),
            ...allowed.map((value) => new Item({ key: value.code, text: value.value }))
          ]
        });
        control = input;
        getValue = () => input.getSelectedKey();
        setError = (errors) => input.setValueState(errors.length ? "Error" : "None");
      }
    } else if (definition.dataType === "Boolean") {
      if (!definition.mandatory && !family.mandatory) {
        const input = new CheckBox({ text: definition.name, selected: initial === "true" });
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
        type: ["Integer", "Decimal"].includes(definition.dataType)
          ? "Number"
          : definition.dataType === "Date"
            ? "Date"
            : definition.dataType === "DateTime"
              ? "DatetimeLocale"
              : "Text",
        placeholder:
          definition.dataType === "Range"
            ? "起始值 ~ 结束值"
            : definition.dataType === "String"
              ? `最多 ${definition.domain.maxLength ?? "不限"} 字符`
              : "输入值",
        description: definition.unit
      });
      control = input;
      getValue = () => input.getValue();
      setError = (errors) => {
        input.setValueState(errors.length ? "Error" : "None");
        input.setValueStateText(errors[0] ?? "");
      };
    }
    content.addItem(control);
    if (["Decimal", "Integer", "Range"].includes(definition.dataType))
      content.addItem(
        txt(
          `${definition.domain.minimum ?? "不限"} – ${definition.domain.maximum ?? "不限"} ${definition.unit}  ·  Step ${definition.domain.step ?? "Any"}`
        ).addStyleClass("cmDomainHint")
      );
    checks.push(() => {
      const value = getValue();
      values.set(referenceId, value);
      const errors = validateValue(definition, value, definition.mandatory || family.mandatory);
      setError(errors);
      return errors.map((error) => `${definition.name}: ${error}`);
    });
  }
}