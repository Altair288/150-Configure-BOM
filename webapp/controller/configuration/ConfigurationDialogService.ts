import Control from "sap/ui/core/Control";
import Button from "sap/m/Button";
import CheckBox from "sap/m/CheckBox";
import Dialog from "sap/m/Dialog";
import Input from "sap/m/Input";
import Label from "sap/m/Label";
import MessageToast from "sap/m/MessageToast";
import TextArea from "sap/m/TextArea";
import SimpleForm from "sap/ui/layout/form/SimpleForm";
import { button, select, tr } from "../../util/configurationUi";
import type { Named } from "../../model/configuration";
import type { Field, Values } from "./types";

type DialogHost = {
  addDependent(dependent: Control): void;
};

export default class ConfigurationDialogService {
  private readonly getHost: () => DialogHost | undefined;

  public constructor(getHost: () => DialogHost | undefined) {
    this.getHost = getHost;
  }

  public openEditDialog(
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
    const dialog = new Dialog({
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
    this.getHost()?.addDependent(dialog);
    dialog.addStyleClass("sapUiSizeCompact cmEditDialog");
    dialog.open();
  }

  public namedFields(record: Named): Field[] {
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
}