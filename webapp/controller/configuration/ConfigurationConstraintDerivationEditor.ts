import Button from "sap/m/Button";
import HBox from "sap/m/HBox";
import Input from "sap/m/Input";
import Label from "sap/m/Label";
import MessageStrip from "sap/m/MessageStrip";
import Select from "sap/m/Select";
import Text from "sap/m/Text";
import VBox from "sap/m/VBox";
import Item from "sap/ui/core/Item";
import type Control from "sap/ui/core/Control";
import type { Input$LiveChangeEvent } from "sap/m/Input";
import type { Select$ChangeEvent } from "sap/m/Select";
import type { FeatureDefinition } from "../../model/configuration";
import type {
  ConstraintDerivation,
  ConstraintFormula,
  ConstraintFormulaOperand,
  ConstraintFormulaOperator,
  ConstraintMappingRow
} from "../../model/constraintRules";
import { tr } from "../../util/configurationUi";

type DerivationKind = ConstraintDerivation["kind"];

const formulaOperations: { key: ConstraintFormulaOperator; text: string }[] = [
  { key: "ADD", text: "+" },
  { key: "SUBTRACT", text: "−" },
  { key: "MULTIPLY", text: "×" },
  { key: "DIVIDE", text: "÷" },
  { key: "MIN", text: "cmConstraintFormulaMin" },
  { key: "MAX", text: "cmConstraintFormulaMax" }
];

function numericValue(value: string): number {
  return value.trim() ? Number(value) : Number.NaN;
}

function field(label: string, control: Control): VBox {
  return new VBox({
    width: "100%",
    items: [new Label({ text: tr(label), labelFor: control }), control]
  }).addStyleClass("cmConstraintDerivationField");
}

export function createConstraintDerivation(
  kind: DerivationKind,
  target: FeatureDefinition,
  features: FeatureDefinition[]
): ConstraintDerivation | undefined {
  const source = features.find(
    (feature) =>
      feature.active &&
      feature.code !== target.code &&
      (kind === "MAP"
        ? ["Integer", "Decimal", "Enumeration", "Reference", "Boolean"]
        : ["Integer", "Decimal"]
      ).includes(feature.dataType)
  );
  if (!source) return undefined;
  if (kind === "MAP")
    return {
      kind,
      source: "",
      rows: [{ minimum: Number.NaN, maximum: Number.NaN, value: "" }]
    };
  return {
    kind,
    formula: { operands: [{ kind: "FEATURE", feature: "" }], operators: [] }
  };
}

export function buildConstraintDerivationEditor(
  target: FeatureDefinition,
  features: FeatureDefinition[],
  derivation: ConstraintDerivation,
  refresh: () => void
): VBox {
  const numericFeatures = features.filter(
    (feature) =>
      feature.active &&
      feature.code !== target.code &&
      ["Integer", "Decimal"].includes(feature.dataType)
  );
  const mappingFeatures = features.filter(
    (feature) =>
      feature.active &&
      feature.code !== target.code &&
      ["Integer", "Decimal", "Enumeration", "Reference", "Boolean"].includes(feature.dataType)
  );
  const sourceItems = (mapping = false): Item[] => [
    new Item({ key: "", text: tr("cmConstraintChooseSource") }),
    ...(mapping ? mappingFeatures : numericFeatures).map(
      (feature) => new Item({ key: feature.code, text: feature.name })
    )
  ];
  const numberInput = (value: number, label: string, change: (value: number) => void): VBox => {
    const input = new Input({
      width: "100%",
      type: "Number",
      value: Number.isFinite(value) ? String(value) : "",
      liveChange: (event: Input$LiveChangeEvent) =>
        change(numericValue(event.getParameter("value") ?? ""))
    });
    return field(label, input);
  };
  const content = new VBox({ width: "100%" }).addStyleClass("cmConstraintDerivationEditor");
  if (derivation.kind === "MAP") {
    const emptyRow = (numeric: boolean): ConstraintMappingRow =>
      numeric ? { minimum: Number.NaN, maximum: Number.NaN, value: "" } : { match: "", value: "" };
    const isNumericSource = (code: string): boolean =>
      numericFeatures.some((feature) => feature.code === code);
    const hasMappingData = (): boolean =>
      derivation.rows.some(
        (row) =>
          row.value !== "" ||
          ("match" in row
            ? row.match !== ""
            : Number.isFinite(row.minimum) || Number.isFinite(row.maximum))
      );
    const confirmation = new VBox({ width: "100%", visible: false });
    const source = new Select({
      width: "100%",
      selectedKey: derivation.source,
      items: sourceItems(true),
      change: (event: Select$ChangeEvent) => {
        const selected = event.getSource().getSelectedKey();
        const previous = derivation.source;
        const changesRowType =
          !!selected &&
          derivation.rows.some((row) =>
            isNumericSource(selected) ? "match" in row : "minimum" in row
          );
        const apply = (): void => {
          derivation.source = selected;
          if (changesRowType) derivation.rows = [emptyRow(isNumericSource(selected))];
          refresh();
        };
        if (changesRowType && hasMappingData()) {
          event.getSource().setSelectedKey(previous);
          confirmation.destroyItems();
          confirmation.addItem(
            new MessageStrip({
              text: tr("cmConstraintMapChangeSourceConfirm"),
              type: "Warning",
              showIcon: true
            })
          );
          confirmation.addItem(
            new HBox({
              items: [
                new Button({
                  text: tr("cmConstraintConfirmSourceChange"),
                  type: "Emphasized",
                  press: apply
                }),
                new Button({
                  text: tr("cmCancel"),
                  type: "Transparent",
                  press: () => confirmation.setVisible(false)
                })
              ]
            })
          );
          confirmation.setVisible(true);
        } else apply();
      }
    });
    content.addItem(field("cmConstraintDerivationSource", source));
    content.addItem(confirmation);
    derivation.rows.forEach((row, index) => {
      const inputs: Control[] = [];
      if ("match" in row) {
        const sourceFeature = mappingFeatures.find((feature) => feature.code === derivation.source);
        const matches =
          sourceFeature?.dataType === "Boolean"
            ? [
                new Item({ key: "true", text: tr("Yes") }),
                new Item({ key: "false", text: tr("No") })
              ]
            : (sourceFeature?.domain.values ?? [])
                .filter((value) => value.active)
                .map((value) => new Item({ key: value.code, text: value.value }));
        const match = new Select({
          width: "100%",
          selectedKey: String(row.match),
          items: [new Item({ key: "", text: tr("cmConstraintNoValue") }), ...matches],
          change: (event: Select$ChangeEvent) => {
            const selected = event.getSource().getSelectedKey();
            row.match =
              sourceFeature?.dataType === "Boolean" && selected !== ""
                ? selected === "true"
                : selected;
          }
        });
        inputs.push(field("cmConstraintMapInput", match));
      } else {
        inputs.push(
          numberInput(row.minimum, "cmConstraintMapMinimum", (value) => {
            row.minimum = value;
          }),
          numberInput(row.maximum, "cmConstraintMapMaximum", (value) => {
            row.maximum = value;
          })
        );
      }
      let output: Control;
      if (["Enumeration", "Reference", "Boolean"].includes(target.dataType)) {
        const values =
          target.dataType === "Boolean"
            ? [
                new Item({ key: "true", text: tr("Yes") }),
                new Item({ key: "false", text: tr("No") })
              ]
            : target.domain.values
                .filter((value) => value.active)
                .map((value) => new Item({ key: value.code, text: value.value }));
        output = new Select({
          width: "100%",
          selectedKey: String(row.value),
          items: [new Item({ key: "", text: tr("cmConstraintNoValue") }), ...values],
          change: (event: Select$ChangeEvent) => {
            const selected = event.getSource().getSelectedKey();
            row.value =
              target.dataType === "Boolean" && selected !== "" ? selected === "true" : selected;
          }
        });
      } else {
        output = new Input({
          width: "100%",
          type: ["Integer", "Decimal"].includes(target.dataType) ? "Number" : "Text",
          value: String(row.value),
          liveChange: (event: Input$LiveChangeEvent) => {
            const value = event.getParameter("value") ?? "";
            row.value = ["Integer", "Decimal"].includes(target.dataType)
              ? numericValue(value)
              : value;
          }
        });
      }
      content.addItem(
        new VBox({
          width: "100%",
          items: [
            new HBox({
              width: "100%",
              alignItems: "End",
              items: [
                ...inputs,
                new Button({
                  icon: "sap-icon://delete",
                  type: "Transparent",
                  tooltip: tr("cmConstraintRemoveMapRow"),
                  enabled: derivation.rows.length > 1,
                  press: () => {
                    derivation.rows.splice(index, 1);
                    refresh();
                  }
                })
              ]
            }),
            field("cmConstraintMapResult", output)
          ]
        }).addStyleClass("cmConstraintDerivationRow")
      );
    });
    content.addItem(
      new Button({
        text: tr("cmConstraintAddMapRow"),
        icon: "sap-icon://add",
        type: "Transparent",
        press: () => {
          derivation.rows.push(emptyRow(!derivation.source || isNumericSource(derivation.source)));
          refresh();
        }
      })
    );
    content.addItem(
      new Text({
        text: tr(
          !derivation.source || isNumericSource(derivation.source)
            ? "cmConstraintMapInclusive"
            : "cmConstraintMapUnique"
        ),
        wrapping: true
      })
    );
    return content;
  }

  const formula: ConstraintFormula = derivation.formula;
  content.addItem(new Text({ text: tr("cmConstraintFormulaOrder"), wrapping: true }));
  formula.operands.forEach((operand, index) => {
    const items: Control[] = [];
    if (index > 0) {
      items.push(
        field(
          "cmConstraintFormulaOperator",
          new Select({
            width: "100%",
            selectedKey: formula.operators[index - 1],
            items: formulaOperations.map((operation) => {
              return new Item({ key: operation.key, text: tr(operation.text) });
            }),
            change: (event: Select$ChangeEvent) => {
              const operation = formulaOperations.find(
                (item) => item.key === event.getSource().getSelectedKey()
              );
              if (operation) formula.operators[index - 1] = operation.key;
            }
          })
        )
      );
    }
    const operandSelect = new Select({
      width: "100%",
      selectedKey: operand.kind === "FEATURE" ? operand.feature : "__constant__",
      items: [
        ...sourceItems(),
        new Item({ key: "__constant__", text: tr("cmConstraintFormulaConstant") })
      ],
      change: (event: Select$ChangeEvent) => {
        const selected = event.getSource().getSelectedKey();
        const next: ConstraintFormulaOperand =
          selected === "__constant__"
            ? { kind: "VALUE", value: Number.NaN }
            : { kind: "FEATURE", feature: selected };
        formula.operands[index] = next;
        refresh();
      }
    });
    items.push(field("cmConstraintFormulaOperand", operandSelect));
    if (operand.kind === "VALUE")
      items.push(
        numberInput(operand.value, "cmConstraintFormulaConstant", (value) => {
          operand.value = value;
        })
      );
    items.push(
      new Button({
        icon: "sap-icon://delete",
        type: "Transparent",
        tooltip: tr("cmConstraintRemoveOperand"),
        enabled: formula.operands.length > 1,
        press: () => {
          formula.operands.splice(index, 1);
          formula.operators.splice(index === 0 ? 0 : index - 1, 1);
          refresh();
        }
      })
    );
    content.addItem(
      new HBox({
        width: "100%",
        alignItems: "End",
        wrap: "Wrap",
        items
      }).addStyleClass("cmConstraintDerivationRow")
    );
  });
  content.addItem(
    new Button({
      text: tr("cmConstraintAddOperand"),
      icon: "sap-icon://add",
      type: "Transparent",
      press: () => {
        formula.operators.push("ADD");
        formula.operands.push({ kind: "VALUE", value: Number.NaN });
        refresh();
      }
    })
  );

  const rounding = new Select({
    width: "100%",
    selectedKey: formula.rounding?.mode ?? "",
    items: [
      new Item({ key: "", text: tr("cmConstraintNoRounding") }),
      new Item({ key: "ROUND", text: tr("cmConstraintRound") }),
      new Item({ key: "FLOOR", text: tr("cmConstraintFloor") }),
      new Item({ key: "CEIL", text: tr("cmConstraintCeil") })
    ],
    change: (event: Select$ChangeEvent) => {
      const mode = event.getSource().getSelectedKey();
      if (mode === "ROUND" || mode === "FLOOR" || mode === "CEIL")
        formula.rounding = { mode, digits: formula.rounding?.digits ?? 0 };
      else delete formula.rounding;
      refresh();
    }
  });
  content.addItem(field("cmConstraintRounding", rounding));
  if (formula.rounding) {
    const roundingConfig = formula.rounding;
    content.addItem(
      numberInput(roundingConfig.digits, "cmConstraintRoundingDigits", (value) => {
        roundingConfig.digits = value;
      })
    );
  }
  const conversion = new Select({
    width: "100%",
    selectedKey: formula.conversion ? "convert" : "",
    items: [
      new Item({ key: "", text: tr("cmConstraintNoConversion") }),
      new Item({ key: "convert", text: tr("cmConstraintConversion") })
    ],
    change: (event: Select$ChangeEvent) => {
      if (event.getSource().getSelectedKey() === "convert")
        formula.conversion = {
          factor: Number.NaN,
          fromUnit: "",
          toUnit: target.unit
        };
      else delete formula.conversion;
      refresh();
    }
  });
  content.addItem(field("cmConstraintConversion", conversion));
  if (formula.conversion) {
    const conversionConfig = formula.conversion;
    const unitInput = (value: string, change: (value: string) => void): Input =>
      new Input({
        width: "100%",
        value,
        liveChange: (event: Input$LiveChangeEvent) => change(event.getParameter("value") ?? "")
      });
    content.addItem(
      numberInput(conversionConfig.factor, "cmConstraintConversionFactor", (value) => {
        conversionConfig.factor = value;
      })
    );
    content.addItem(
      field(
        "cmConstraintConversionFrom",
        unitInput(conversionConfig.fromUnit, (value) => {
          conversionConfig.fromUnit = value.trim();
        })
      )
    );
    content.addItem(
      field(
        "cmConstraintConversionTo",
        unitInput(conversionConfig.toUnit, (value) => {
          conversionConfig.toUnit = value.trim();
        })
      )
    );
  }
  if (derivation.kind === "LINK" && derivation.range) {
    const range = derivation.range;
    content.addItem(new Text({ text: tr("cmConstraintLinkedRangeHint"), wrapping: true }));
    content.addItem(
      numberInput(range.minimumOffset, "cmConstraintLinkedMinimumOffset", (value) => {
        range.minimumOffset = value;
      })
    );
    content.addItem(
      numberInput(range.maximumOffset, "cmConstraintLinkedMaximumOffset", (value) => {
        range.maximumOffset = value;
      })
    );
  }
  return content;
}
