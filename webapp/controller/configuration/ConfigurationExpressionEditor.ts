import Button from "sap/m/Button";
import Control from "sap/ui/core/Control";
import HBox from "sap/m/HBox";
import Input from "sap/m/Input";
import Item from "sap/ui/core/Item";
import Label from "sap/m/Label";
import MessageStrip from "sap/m/MessageStrip";
import MultiComboBox from "sap/m/MultiComboBox";
import ObjectStatus from "sap/m/ObjectStatus";
import OverflowToolbar from "sap/m/OverflowToolbar";
import SegmentedButton from "sap/m/SegmentedButton";
import SegmentedButtonItem from "sap/m/SegmentedButtonItem";
import Select from "sap/m/Select";
import Text from "sap/m/Text";
import TextArea from "sap/m/TextArea";
import ToolbarSpacer from "sap/m/ToolbarSpacer";
import VBox from "sap/m/VBox";
import type { MultiComboBox$SelectionFinishEvent } from "sap/m/MultiComboBox";
import type { SegmentedButton$SelectionChangeEvent } from "sap/m/SegmentedButton";
import type { Select$ChangeEvent } from "sap/m/Select";
import type { TextArea$LiveChangeEvent } from "sap/m/TextArea";
import type { InputBase$ChangeEvent } from "sap/m/InputBase";
import {
  constraintOperatorsFor,
  formatConstraintCondition,
  formatConstraintExpression,
  parseConstraintExpression,
  validateConstraintRule
} from "../../model/constraintRules";
import type {
  ConstraintAction,
  ConstraintActionType,
  ConstraintExpression,
  ConstraintLogicalGroup,
  ConstraintLiteral,
  ConstraintOperator,
  ConstraintPredicate,
  ConstraintRule
} from "../../model/constraintRules";
import type { FeatureDefinition } from "../../model/configuration";
import { tr, trFormat } from "../../util/configurationUi";

type EditorMode = "structured" | "expression";
type ExpressionPathPart = number | "expression";

interface ConfigurationExpressionEditorOptions {
  rule: ConstraintRule;
  rules: ConstraintRule[];
  features: FeatureDefinition[];
  onRuleChange: (rule: ConstraintRule) => void;
}

interface OperatorItem {
  key: ConstraintOperator;
  label: string;
}

const operatorItems: OperatorItem[] = [
  { key: "EQUALS", label: "等于" },
  { key: "NOT_EQUALS", label: "不等于" },
  { key: "GREATER_THAN", label: "大于" },
  { key: "GREATER_THAN_OR_EQUAL", label: "大于等于" },
  { key: "LESS_THAN", label: "小于" },
  { key: "LESS_THAN_OR_EQUAL", label: "小于等于" },
  { key: "IN", label: "属于" },
  { key: "NOT_IN", label: "不属于" },
  { key: "CONTAINS", label: "包含" },
  { key: "STARTS_WITH", label: "开头为" },
  { key: "ENDS_WITH", label: "结尾为" }
];

const actionItems: Array<{ key: ConstraintActionType; label: string }> = [
  { key: "REQUIRE", label: "要求" },
  { key: "EXCLUDE", label: "排斥" },
  { key: "SET", label: "设置" },
  { key: "RESTRICT", label: "限制" },
  { key: "DERIVE", label: "派生" }
];

function isPredicate(expression: ConstraintExpression): expression is ConstraintPredicate {
  return "feature" in expression;
}

function conditionGroup(
  expression: ConstraintExpression,
  path: ExpressionPathPart[],
  onPredicateChange: (path: ExpressionPathPart[], predicate: ConstraintPredicate) => void,
  onPredicateRemove: (path: ExpressionPathPart[]) => void,
  onGroupAddCondition: (path: ExpressionPathPart[], group: ConstraintLogicalGroup) => void,
  canRemoveCondition: boolean,
  predicateControl: (
    predicate: ConstraintPredicate,
    change: (predicate: ConstraintPredicate) => void,
    remove?: () => void
  ) => HBox
): Control {
  if (isPredicate(expression))
    return predicateControl(
      expression,
      (predicate) => onPredicateChange(path, predicate),
      canRemoveCondition && path.length > 0 ? () => onPredicateRemove(path) : undefined
    );

  if (expression.type === "NOT")
    return new VBox({
      width: "100%",
      items: [
        new HBox({
          width: "100%",
          alignItems: "Center",
          wrap: "Wrap",
          items: [
            new ObjectStatus({
              text: tr("不满足以下条件（NOT）"),
              state: "Warning"
            })
          ]
        }).addStyleClass("cmConstraintGroupHeader"),
        conditionGroup(
          expression.expression,
          [...path, "expression"],
          onPredicateChange,
          onPredicateRemove,
          onGroupAddCondition,
          canRemoveCondition,
          predicateControl
        )
      ]
    }).addStyleClass("cmConstraintExpressionGroup cmConstraintExpressionGroup--not");

  const groupTitle = expression.type === "AND" ? "全部满足（AND）" : "满足任一（OR）";
  return new VBox({
    width: "100%",
    items: [
      new HBox({
        width: "100%",
        alignItems: "Center",
        wrap: "Wrap",
        items: [
          new ObjectStatus({
            text: tr(groupTitle),
            state: expression.type === "AND" ? "Information" : "Warning"
          }),
          new ToolbarSpacer(),
          new Button({
            text: tr("+ 条件"),
            icon: "sap-icon://add",
            tooltip: tr("在此组中添加条件"),
            type: "Transparent",
            press: () => onGroupAddCondition(path, expression)
          })
        ]
      }).addStyleClass("cmConstraintGroupHeader"),
      ...expression.expressions.map((child, index) =>
        conditionGroup(
          child,
          [...path, index],
          onPredicateChange,
          onPredicateRemove,
          onGroupAddCondition,
          canRemoveCondition,
          predicateControl
        )
      )
    ]
  }).addStyleClass(
    `cmConstraintExpressionGroup cmConstraintExpressionGroup--${expression.type.toLowerCase()}`
  );
}

function replaceAtPath(
  expression: ConstraintExpression,
  path: ExpressionPathPart[],
  replacement: ConstraintExpression
): ConstraintExpression {
  if (!path.length) return replacement;
  const [part, ...remaining] = path;
  if (typeof part === "number" && "expressions" in expression) {
    return {
      ...expression,
      expressions: expression.expressions.map((child, index) =>
        index === part ? replaceAtPath(child, remaining, replacement) : child
      )
    };
  }
  if (part === "expression" && "expression" in expression)
    return {
      ...expression,
      expression: replaceAtPath(expression.expression, remaining, replacement)
    };
  return expression;
}

function countPredicates(expression: ConstraintExpression): number {
  if (isPredicate(expression)) return 1;
  if (expression.type === "NOT") return countPredicates(expression.expression);
  return expression.expressions.reduce((count, child) => count + countPredicates(child), 0);
}

function removeExpressionAtPath(
  expression: ConstraintExpression,
  path: ExpressionPathPart[]
): ConstraintExpression | undefined {
  const [part, ...remaining] = path;
  if (part === undefined) return undefined;

  if (typeof part === "number" && "expressions" in expression) {
    const child = expression.expressions[part];
    if (!child) return expression;
    const replacement = remaining.length ? removeExpressionAtPath(child, remaining) : undefined;
    const expressions = expression.expressions.flatMap((item, index) =>
      index === part ? (replacement ? [replacement] : []) : [item]
    );
    if (expressions.length === 0) return undefined;
    return expressions.length === 1 ? expressions[0] : { ...expression, expressions };
  }

  if (part === "expression" && "expression" in expression) {
    const child = remaining.length
      ? removeExpressionAtPath(expression.expression, remaining)
      : undefined;
    return child ? { ...expression, expression: child } : undefined;
  }

  return expression;
}

function defaultValue(feature: FeatureDefinition): ConstraintLiteral {
  if (feature.dataType === "Boolean") return false;
  if (["Integer", "Decimal", "Range"].includes(feature.dataType))
    return feature.domain.minimum ?? 0;
  return feature.domain.values.find((item) => item.active)?.code ?? "";
}

function defaultPredicate(feature: FeatureDefinition): ConstraintPredicate {
  if (feature.dataType === "Multi Enumeration") {
    const value = feature.domain.values.find((item) => item.active)?.code;
    return { type: "IN", feature: feature.code, value: value ? [value] : [] };
  }
  return { type: "EQUALS", feature: feature.code, value: defaultValue(feature) };
}

function defaultAction(feature: FeatureDefinition): ConstraintAction {
  return { type: "REQUIRE", target: defaultPredicate(feature) };
}

export default class ConfigurationExpressionEditor {
  private rule: ConstraintRule;
  private readonly undoStack: ConstraintRuleAstHistory[] = [];
  private readonly redoStack: ConstraintRuleAstHistory[] = [];
  private readonly conditionHost = new VBox({ width: "100%" }).addStyleClass(
    "cmConstraintConditionRows"
  );
  private readonly actionsHost = new VBox({ width: "100%" }).addStyleClass(
    "cmConstraintActionRows"
  );
  private readonly status = new MessageStrip({
    text: "",
    type: "Information",
    showIcon: true,
    showCloseButton: false
  });
  private readonly expressionInput: TextArea;
  private readonly structuredHost: VBox;
  private readonly expressionHost: VBox;
  private modeSelector?: SegmentedButton;
  private undoButton?: Button;
  private redoButton?: Button;
  private mode: EditorMode = "structured";
  private parseError = "";

  public constructor(private readonly options: ConfigurationExpressionEditorOptions) {
    this.rule = structuredClone(options.rule);
    this.expressionInput = new TextArea({
      width: "100%",
      rows: 5,
      value: this.rule.expression,
      valueLiveUpdate: true,
      liveChange: (event: TextArea$LiveChangeEvent) => this.onExpressionChange(event)
    }).addStyleClass("cmConstraintExpressionInput");
    this.structuredHost = new VBox({
      width: "100%",
      items: [
        new VBox({
          width: "100%",
          items: [new Label({ text: tr("条件") }), this.conditionHost, this.buildConditionToolbar()]
        }).addStyleClass("cmConstraintConditionSection"),
        new VBox({
          width: "100%",
          items: [
            new Label({ text: tr("结果") }),
            this.actionsHost,
            new Button({
              text: tr("添加结果"),
              icon: "sap-icon://add",
              type: "Transparent",
              press: () => this.addAction()
            }).addStyleClass("cmConstraintAddAction")
          ]
        }).addStyleClass("cmConstraintActionsSection")
      ]
    }).addStyleClass("cmConstraintStructuredEditor");
    this.expressionHost = new VBox({
      width: "100%",
      visible: false,
      items: [
        new Label({ text: tr("高级表达式") }),
        this.expressionInput,
        new Text({
          text: tr("Feature Code 与 Value Code 均来自当前 Configuration Context。")
        }).addStyleClass("cmConstraintExpressionHint")
      ]
    }).addStyleClass("cmConstraintExpressionAdvanced");
    this.renderCondition();
    this.renderActions();
    this.updateValidation();
  }

  public build(): VBox {
    this.status.setText(tr("表达式待验证"));
    this.modeSelector = new SegmentedButton({
      width: "16rem",
      selectedKey: this.mode,
      items: [
        new SegmentedButtonItem({ key: "structured", text: tr("结构化编辑") }),
        new SegmentedButtonItem({ key: "expression", text: tr("表达式") })
      ],
      selectionChange: (event: SegmentedButton$SelectionChangeEvent) =>
        this.setMode(event.getParameter("selectedKey") as EditorMode)
    }).addStyleClass("cmConstraintEditorModeSelector");
    return new VBox({
      width: "100%",
      height: "100%",
      fitContainer: true,
      items: [
        this.buildHistoryToolbar(),
        new HBox({
          width: "100%",
          alignItems: "Center",
          items: [
            this.modeSelector,
            new ToolbarSpacer(),
            new ObjectStatus({
              text: trFormat(
                "cmConstraintAvailableFeatureCount",
                [this.options.features.filter((feature) => feature.active).length],
                `${this.options.features.filter((feature) => feature.active).length} 个可用 Feature`
              ),
              state: "Information"
            })
          ]
        }).addStyleClass("cmConstraintEditorModeToolbar"),
        this.structuredHost,
        this.expressionHost,
        this.status
      ]
    }).addStyleClass("cmConstraintExpressionEditor");
  }

  public setRule(rule: ConstraintRule): void {
    this.rule = structuredClone(rule);
    this.undoStack.length = 0;
    this.redoStack.length = 0;
    this.parseError = "";
    this.expressionInput.setValue(rule.expression);
    this.refreshHistoryButtons();
    this.renderCondition();
    this.renderActions();
    this.updateValidation();
  }

  public setRules(rules: ConstraintRule[]): void {
    this.options.rules = rules;
    this.updateValidation();
  }

  public setFeatures(features: FeatureDefinition[]): void {
    this.options.features = features;
    this.renderCondition();
    this.renderActions();
    this.updateValidation();
  }

  public isExpressionValid(): boolean {
    return !this.parseError;
  }

  private setMode(mode: EditorMode): void {
    if (mode === "structured" && this.parseError) {
      this.parseError = "";
      this.expressionInput.setValue(this.rule.expression);
      this.updateValidation();
    }
    this.mode = mode;
    this.structuredHost.setVisible(mode === "structured");
    this.expressionHost.setVisible(mode === "expression");
    this.modeSelector?.setSelectedKey(mode);
  }

  private buildHistoryToolbar(): OverflowToolbar {
    return new OverflowToolbar({
      content: [
        new ToolbarSpacer(),
        (this.undoButton = new Button({
          text: tr("撤销"),
          icon: "sap-icon://undo",
          enabled: false,
          press: () => this.undo()
        })),
        (this.redoButton = new Button({
          text: tr("重做"),
          icon: "sap-icon://redo",
          enabled: false,
          press: () => this.redo()
        })),
        new Button({
          text: tr("格式化"),
          icon: "sap-icon://text-align-left",
          press: () => this.format()
        }),
        new Button({
          text: tr("验证"),
          icon: "sap-icon://validate",
          press: () => this.updateValidation()
        })
      ]
    }).addStyleClass("cmConstraintExpressionToolbar");
  }

  private buildConditionToolbar(): OverflowToolbar {
    return new OverflowToolbar({
      content: [
        new Button({
          text: tr("+ 条件"),
          icon: "sap-icon://add",
          press: () => this.addCondition("AND")
        }),
        new Button({ text: tr("+ AND"), press: () => this.addCondition("AND") }),
        new Button({ text: tr("+ OR"), press: () => this.addCondition("OR") }),
        new Button({ text: tr("+ NOT"), press: () => this.negateCondition() })
      ]
    }).addStyleClass("cmConstraintConditionToolbar");
  }

  private onExpressionChange(event: TextArea$LiveChangeEvent): void {
    const expression = event.getParameter("value") ?? "";
    try {
      const ast = parseConstraintExpression(expression);
      this.parseError = "";
      this.commitAst(ast, expression);
    } catch (error) {
      this.parseError = error instanceof Error ? error.message : String(error);
      this.updateValidation();
    }
  }

  private commitAst(ast: ConstraintRule["ast"], expression?: string, addHistory = true): void {
    const astChanged = JSON.stringify(ast) !== JSON.stringify(this.rule.ast);
    if (addHistory && astChanged) this.undoStack.push(structuredClone(this.rule.ast));
    if (addHistory && astChanged) this.redoStack.length = 0;
    this.parseError = "";
    this.rule = {
      ...this.rule,
      ast: structuredClone(ast),
      expression: expression ?? formatConstraintExpression(ast),
      status: "Draft"
    };
    this.refreshHistoryButtons();
    this.options.onRuleChange(structuredClone(this.rule));
    if (expression === undefined) this.expressionInput.setValue(this.rule.expression);
    this.renderCondition();
    this.renderActions();
    this.updateValidation();
  }

  private addCondition(operator: "AND" | "OR"): void {
    const feature = this.options.features.find((item) => item.active);
    if (!feature) {
      this.status.setType("Warning");
      this.status.setText(tr("当前 Context 没有活动 Feature"));
      return;
    }
    const addition = defaultPredicate(feature);
    const current = this.rule.ast.condition;
    const condition: ConstraintExpression =
      "expressions" in current && current.type === operator
        ? { ...current, expressions: [...current.expressions, addition] }
        : { type: operator, expressions: [current, addition] };
    this.commitAst({ ...this.rule.ast, condition });
  }

  private addConditionToGroup(path: ExpressionPathPart[], group: ConstraintLogicalGroup): void {
    const feature = this.options.features.find((item) => item.active);
    if (!feature) {
      this.status.setType("Warning");
      this.status.setText(tr("当前 Context 没有活动 Feature"));
      return;
    }
    const condition = replaceAtPath(this.rule.ast.condition, path, {
      ...group,
      expressions: [...group.expressions, defaultPredicate(feature)]
    });
    this.commitAst({ ...this.rule.ast, condition });
  }

  private removeCondition(path: ExpressionPathPart[]): void {
    const condition = removeExpressionAtPath(this.rule.ast.condition, path);
    if (condition) this.commitAst({ ...this.rule.ast, condition });
  }

  private negateCondition(): void {
    const condition =
      this.rule.ast.condition.type === "NOT"
        ? this.rule.ast.condition.expression
        : { type: "NOT" as const, expression: this.rule.ast.condition };
    this.commitAst({ ...this.rule.ast, condition });
  }

  private addAction(): void {
    const feature = this.options.features.find((item) => item.active);
    if (!feature) {
      this.status.setType("Warning");
      this.status.setText(tr("当前 Context 没有活动 Feature"));
      return;
    }
    this.commitAst({
      ...this.rule.ast,
      actions: [...this.rule.ast.actions, defaultAction(feature)]
    });
  }

  private removeAction(index: number): void {
    this.commitAst({
      ...this.rule.ast,
      actions: this.rule.ast.actions.filter((_, actionIndex) => actionIndex !== index)
    });
  }

  private changeActionType(index: number, type: ConstraintActionType): void {
    const action = this.rule.ast.actions[index];
    if (!action || action.type === type) return;
    let target = action.target;
    if (isPredicate(target)) {
      const predicate = target;
      const feature = this.options.features.find((item) => item.code === predicate.feature);
      const allowed = feature ? constraintOperatorsFor(feature.dataType, type) : [];
      if (!allowed.includes(predicate.type)) {
        const operator = allowed.includes("EQUALS") ? "EQUALS" : allowed[0];
        if (operator) {
          const value =
            operator === "IN" || operator === "NOT_IN"
              ? Array.isArray(predicate.value)
                ? predicate.value
                : [predicate.value]
              : Array.isArray(predicate.value)
                ? (predicate.value[0] ?? "")
                : predicate.value;
          target = { ...predicate, type: operator, value };
        }
      }
    }
    const actions = this.rule.ast.actions.map((item, actionIndex) =>
      actionIndex === index ? { ...item, type, target } : item
    );
    this.commitAst({ ...this.rule.ast, actions });
  }

  private renderCondition(): void {
    this.conditionHost.destroyItems();
    const canRemoveCondition = countPredicates(this.rule.ast.condition) > 1;
    this.conditionHost.addItem(
      conditionGroup(
        this.rule.ast.condition,
        [],
        (path, predicate) => {
          const condition = replaceAtPath(this.rule.ast.condition, path, predicate);
          this.commitAst({ ...this.rule.ast, condition });
        },
        (path) => this.removeCondition(path),
        (path, group) => this.addConditionToGroup(path, group),
        canRemoveCondition,
        (predicate, change, remove) =>
          this.buildPredicateControls(predicate, change, undefined, remove)
      )
    );
  }

  private renderActions(): void {
    this.actionsHost.destroyItems();
    this.rule.ast.actions.forEach((action, index) =>
      this.actionsHost.addItem(this.buildActionRow(action, index))
    );
  }

  private buildActionRow(action: ConstraintAction, index: number): VBox {
    const actionSelect = new Select({
      width: "8rem",
      selectedKey: action.type,
      tooltip: tr("动作"),
      items: actionItems.map((item) => new Item({ key: item.key, text: tr(item.label) })),
      change: (event: Select$ChangeEvent) =>
        this.changeActionType(index, event.getSource().getSelectedKey() as ConstraintActionType)
    });
    const removeButton = new Button({
      icon: "sap-icon://delete",
      tooltip: tr("删除结果"),
      type: "Transparent",
      press: () => this.removeAction(index)
    });
    const targetControl = isPredicate(action.target)
      ? this.buildPredicateControls(
          action.target,
          (target) => this.replaceActionTarget(index, target),
          action.type
        )
      : new VBox({
          width: "100%",
          items: [
            new Text({
              text: formatConstraintCondition(action.target),
              wrapping: true
            }).addStyleClass("cmConstraintComplexActionExpression"),
            new Text({
              text: tr("复杂结果可在高级表达式模式中编辑。")
            }).addStyleClass("cmConstraintExpressionHint")
          ]
        }).addStyleClass("cmConstraintComplexAction");
    return new VBox({
      width: "100%",
      items: [
        new HBox({
          width: "100%",
          alignItems: "Center",
          items: [actionSelect, new ToolbarSpacer(), removeButton]
        }).addStyleClass("cmConstraintActionHeader"),
        targetControl
      ]
    }).addStyleClass("cmConstraintActionCard");
  }

  private buildPredicateControls(
    predicate: ConstraintPredicate,
    onChange: (predicate: ConstraintPredicate) => void,
    actionType?: ConstraintActionType,
    onRemove?: () => void
  ): HBox {
    const feature = this.options.features.find((item) => item.code === predicate.feature);
    const featureSelect = new Select({
      width: "20rem",
      selectedKey: predicate.feature,
      tooltip: tr("Feature"),
      items: this.options.features.map(
        (item) =>
          new Item({
            key: item.code,
            text: `${item.name} · ${item.code}${item.active ? "" : ` · ${tr("已停用")}`}`,
            enabled: item.active
          })
      ),
      change: (event: Select$ChangeEvent) => {
        const selected = this.options.features.find(
          (item) => item.code === event.getSource().getSelectedKey() && item.active
        );
        if (selected) onChange(defaultPredicate(selected));
      }
    });
    const allowed = feature ? constraintOperatorsFor(feature.dataType, actionType) : ["EQUALS"];
    const operatorSelect = new Select({
      width: "13.5rem",
      selectedKey: predicate.type,
      tooltip: tr("Operator"),
      items: operatorItems
        .filter((item) => allowed.includes(item.key))
        .map((item) => new Item({ key: item.key, text: tr(item.label) })),
      change: (event: Select$ChangeEvent) => {
        const type = event.getSource().getSelectedKey() as ConstraintOperator;
        const currentValue = predicate.value;
        const value =
          type === "IN" || type === "NOT_IN"
            ? Array.isArray(currentValue)
              ? currentValue
              : [currentValue]
            : Array.isArray(currentValue)
              ? (currentValue[0] ?? "")
              : currentValue;
        onChange({ ...predicate, type, value });
      }
    });
    const items: Control[] = [
      featureSelect,
      operatorSelect,
      this.buildValueControl(predicate, feature, onChange, actionType)
    ];
    if (onRemove) {
      items.push(
        new Button({
          text: tr("删除条件"),
          icon: "sap-icon://delete",
          tooltip: tr("删除条件"),
          type: "Transparent",
          press: onRemove
        }).addStyleClass("cmConstraintRemoveConditionButton")
      );
    }
    return new HBox({
      width: "100%",
      alignItems: "Center",
      wrap: "Wrap",
      items
    }).addStyleClass("cmConstraintPredicateControls");
  }

  private buildValueControl(
    predicate: ConstraintPredicate,
    feature: FeatureDefinition | undefined,
    onChange: (predicate: ConstraintPredicate) => void,
    actionType?: ConstraintActionType
  ): Input | Select | MultiComboBox {
    if (!feature)
      return new Input({
        width: "20rem",
        value: "",
        enabled: false,
        tooltip: tr("Allowed Value")
      });
    const currentValue = predicate.value;
    const options = feature.domain.values.filter((item) => item.active);
    if (feature.dataType === "Boolean") {
      return new Select({
        width: "15rem",
        selectedKey: String(currentValue),
        tooltip: tr("Allowed Value"),
        items: [
          new Item({ key: "true", text: tr("Yes") }),
          new Item({ key: "false", text: tr("No") })
        ],
        change: (event: Select$ChangeEvent) =>
          onChange({ ...predicate, value: event.getSource().getSelectedKey() === "true" })
      });
    }
    const allowMultiSelection =
      predicate.type === "IN" ||
      predicate.type === "NOT_IN" ||
      (feature.dataType === "Multi Enumeration" && actionType !== "SET" && actionType !== "DERIVE");
    if (allowMultiSelection && options.length > 0) {
      return new MultiComboBox({
        width: "20rem",
        selectedKeys: (Array.isArray(currentValue) ? currentValue : [currentValue]).map(String),
        tooltip: tr("Allowed Value"),
        items: options.map((item) => new Item({ key: item.code, text: item.value })),
        selectionFinish: (event: MultiComboBox$SelectionFinishEvent) =>
          onChange({
            ...predicate,
            type:
              predicate.type === "NOT_IN"
                ? "NOT_IN"
                : feature.dataType === "Multi Enumeration"
                  ? "IN"
                  : predicate.type,
            value: event.getSource().getSelectedKeys()
          })
      });
    }
    if (
      ["Enumeration", "Reference"].includes(feature.dataType) ||
      (feature.dataType === "Multi Enumeration" && actionType === "SET")
    )
      return new Select({
        width: "20rem",
        selectedKey: String(Array.isArray(currentValue) ? (currentValue[0] ?? "") : currentValue),
        tooltip: tr("Allowed Value"),
        items: options.map((item) => new Item({ key: item.code, text: item.value })),
        change: (event: Select$ChangeEvent) =>
          onChange({ ...predicate, type: "EQUALS", value: event.getSource().getSelectedKey() })
      });

    const numeric = ["Integer", "Decimal", "Range"].includes(feature.dataType);
    if (predicate.type === "IN" || predicate.type === "NOT_IN") {
      return new Input({
        width: "20rem",
        tooltip: tr("Comma-separated values"),
        value: (Array.isArray(currentValue) ? currentValue : [currentValue]).join(", "),
        change: (event: InputBase$ChangeEvent) => {
          const values = event
            .getSource()
            .getValue()
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean)
            .map((value) => (numeric ? Number(value) : value));
          onChange({ ...predicate, value: values });
        }
      });
    }
    return new Input({
      width: "20rem",
      tooltip: tr("Allowed Value"),
      type: numeric ? "Number" : "Text",
      value: String(currentValue),
      change: (event: InputBase$ChangeEvent) => {
        const raw = event.getSource().getValue();
        onChange({ ...predicate, value: numeric && raw !== "" ? Number(raw) : raw });
      }
    });
  }

  private replaceActionTarget(index: number, target: ConstraintPredicate): void {
    const actions = this.rule.ast.actions.map((action, actionIndex) =>
      actionIndex === index ? { ...action, target } : action
    );
    this.commitAst({ ...this.rule.ast, actions });
  }

  private format(): void {
    const expression = formatConstraintExpression(this.rule.ast);
    this.rule = { ...this.rule, expression };
    this.expressionInput.setValue(expression);
    this.options.onRuleChange(structuredClone(this.rule));
    this.parseError = "";
    this.updateValidation();
  }

  private undo(): void {
    const previous = this.undoStack.pop();
    if (!previous) return;
    this.redoStack.push(structuredClone(this.rule.ast));
    this.commitAst(previous, undefined, false);
  }

  private redo(): void {
    const next = this.redoStack.pop();
    if (!next) return;
    this.undoStack.push(structuredClone(this.rule.ast));
    this.commitAst(next, undefined, false);
  }

  private refreshHistoryButtons(): void {
    this.undoButton?.setEnabled(this.undoStack.length > 0);
    this.redoButton?.setEnabled(this.redoStack.length > 0);
  }

  private updateValidation(): void {
    if (this.parseError) {
      this.status.setType("Error");
      this.status.setText(this.parseError);
      return;
    }
    const issues = validateConstraintRule(this.rule, this.options.rules, this.options.features);
    const firstError = issues.find((issue) => issue.severity === "Error");
    this.status.setType(
      firstError
        ? "Error"
        : issues.some((issue) => issue.severity === "Warning")
          ? "Warning"
          : "Success"
    );
    this.status.setText(
      firstError?.message ?? issues[0]?.message ?? tr("Expression Valid · 表达式有效")
    );
  }
}

type ConstraintRuleAstHistory = ConstraintRule["ast"];
