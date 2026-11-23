import type { DataType, FeatureDefinition } from "./configuration";

export type ConstraintRuleType = "REQUIRES" | "EXCLUDES" | "IMPLIES" | "DERIVE";
export type ConstraintActionType =
  | "REQUIRE"
  | "EXCLUDE"
  | "SET"
  | "RESTRICT"
  | "DERIVE"
  /** Accepted only to read existing persisted rule ASTs; new rules use FeatureDefinition.defaultValue. */
  | "DEFAULT"
  | "RECOMMEND"
  | "ADD"
  | "REMOVE";
export type ConstraintRuleStatus = "Draft" | "Valid" | "Invalid";
export type ConstraintRuleSource = "MANUAL" | "BLUEPRINT" | "AI";
export type ConstraintLiteral = string | number | boolean;
export type ConstraintOperator =
  | "EQUALS"
  | "NOT_EQUALS"
  | "GREATER_THAN"
  | "GREATER_THAN_OR_EQUAL"
  | "LESS_THAN"
  | "LESS_THAN_OR_EQUAL"
  | "IN"
  | "NOT_IN"
  | "CONTAINS"
  | "STARTS_WITH"
  | "ENDS_WITH"
  | "ALWAYS"
  | "IS_UNSET"
  | "COUNT_AT_LEAST"
  | "COUNT_AT_MOST"
  | "COUNT_EXACTLY"
  | "STEP";

export interface ConstraintPredicate {
  type: ConstraintOperator;
  feature: string;
  value: ConstraintLiteral | ConstraintLiteral[];
}

export interface ConstraintLogicalGroup {
  type: "AND" | "OR";
  expressions: ConstraintExpression[];
}

export interface ConstraintNegation {
  type: "NOT";
  expression: ConstraintExpression;
}

export type ConstraintExpression =
  ConstraintPredicate | ConstraintLogicalGroup | ConstraintNegation;

export type ConstraintFormulaOperand =
  { kind: "FEATURE"; feature: string } | { kind: "VALUE"; value: number };

export type ConstraintFormulaOperator = "ADD" | "SUBTRACT" | "MULTIPLY" | "DIVIDE" | "MIN" | "MAX";

export interface ConstraintFormula {
  operands: ConstraintFormulaOperand[];
  operators: ConstraintFormulaOperator[];
  rounding?: { mode: "ROUND" | "FLOOR" | "CEIL"; digits: number };
  conversion?: { factor: number; fromUnit: string; toUnit: string };
}

export type ConstraintMappingRow =
  | { minimum: number; maximum: number; value: ConstraintLiteral }
  | { match: ConstraintLiteral; value: ConstraintLiteral };

export type ConstraintDerivation =
  | { kind: "CALCULATE"; formula: ConstraintFormula }
  | {
      kind: "LINK";
      formula: ConstraintFormula;
      range?: { minimumOffset: number; maximumOffset: number };
    }
  | {
      kind: "MAP";
      source: string;
      rows: ConstraintMappingRow[];
    };

export interface ConstraintAction {
  type: ConstraintActionType;
  target: ConstraintExpression;
  derivation?: ConstraintDerivation;
}

export interface ConstraintRelationship {
  source: string;
  target: string;
  type: ConstraintActionType;
}

export interface ConstraintRuleAst {
  condition: ConstraintExpression;
  actions: ConstraintAction[];
}

export interface LegacyConstraintRuleAst {
  type: ConstraintRuleType;
  when: ConstraintExpression;
  then: ConstraintExpression;
}

export interface ConstraintBlueprintLayout {
  positions: Record<string, { x: number; y: number }>;
}

export interface ConstraintRule {
  id: string;
  code: string;
  name: string;
  description: string;
  status: ConstraintRuleStatus;
  expression: string;
  ast: ConstraintRuleAst;
  blueprint: ConstraintBlueprintLayout;
  source: { type: ConstraintRuleSource; prompt?: string };
  createdBy: string;
  modifiedAt: string;
  version: number;
}

export function hasLegacyDefaultConstraintAction(rule: Pick<ConstraintRule, "ast">): boolean {
  return rule.ast.actions.some((action) => action.type === "DEFAULT");
}

export interface LegacyConstraintRule extends Omit<ConstraintRule, "ast"> {
  ruleType?: ConstraintRuleType;
  ast: LegacyConstraintRuleAst;
}

export interface ConstraintValidationIssue {
  severity: "Error" | "Warning";
  code: string;
  message: string;
  feature?: string;
}

export type ConstraintPreviewStatus =
  "not-triggered" | "satisfied" | "pending" | "conflict" | "not-applied";

export interface ConstraintActionPreview {
  type: ConstraintActionType;
  target: ConstraintExpression;
  derivation?: ConstraintDerivation;
  status: ConstraintPreviewStatus;
}

export interface ConstraintPreviewEffect extends ConstraintActionPreview {
  ruleId: string;
  code: string;
  name: string;
  description: string;
  direction: "action" | "condition";
  trigger?: ConstraintExpression;
}

export interface ConstraintRulePreview {
  ruleId: string;
  code: string;
  name: string;
  description: string;
  status: ConstraintPreviewStatus;
  actions: ConstraintActionPreview[];
}

export interface ConstraintSimulationChange {
  ruleId: string;
  code: string;
  name: string;
  feature: string;
  type: ConstraintActionType;
  value: unknown;
  previousValue: unknown;
  condition: ConstraintExpression;
  derivation?: ConstraintDerivation;
}

export interface ConstraintSimulationIssue {
  code: string;
  ruleId: string;
  name: string;
  feature: string;
  message: string;
}

export interface ConstraintConflict {
  feature: string;
  ruleIds: string[];
  rules: { id: string; code: string; name: string }[];
}

export interface ConstraintSimulation {
  values: Map<string, unknown>;
  changes: ConstraintSimulationChange[];
  recommendations: ConstraintSimulationChange[];
  conflicts: ConstraintConflict[];
  issues: ConstraintSimulationIssue[];
}

export function reconcileConstrainedSelection(
  value: unknown,
  availableValues: ReadonlySet<string> | undefined,
  selectOnlyAvailable = false
): string | string[] | undefined {
  if (value === undefined || value === null)
    return selectOnlyAvailable && availableValues?.size === 1 ? [...availableValues][0] : undefined;
  const selectedValues = (Array.isArray(value) ? value : [value]).map(String);
  if (!availableValues) return Array.isArray(value) ? selectedValues : (selectedValues[0] ?? "");
  const retainedValues = selectedValues.filter((selected) => availableValues.has(selected));
  if (
    selectOnlyAvailable &&
    !Array.isArray(value) &&
    retainedValues.length === 0 &&
    availableValues.size === 1
  )
    return [...availableValues][0];
  return Array.isArray(value) ? retainedValues : (retainedValues[0] ?? "");
}

export function appendConstraintPredicate(
  current: ConstraintExpression,
  operator: "AND" | "OR",
  addition: ConstraintPredicate
): ConstraintExpression {
  if (operator === "OR") {
    return current.type === "OR"
      ? { ...current, expressions: [...current.expressions, addition] }
      : { type: "OR", expressions: [current, addition] };
  }

  if (current.type === "AND")
    return { ...current, expressions: [...current.expressions, addition] };

  if (current.type === "OR") {
    const expressions = [...current.expressions];
    const lastIndex = expressions.length - 1;
    const last = expressions[lastIndex];
    if (!last) return { type: "AND", expressions: [current, addition] };
    expressions[lastIndex] =
      last.type === "AND"
        ? { ...last, expressions: [...last.expressions, addition] }
        : { type: "AND", expressions: [last, addition] };
    return { ...current, expressions };
  }

  return { type: "AND", expressions: [current, addition] };
}

export function removeConstraintExpressionAtPath(
  expression: ConstraintExpression,
  path: readonly (number | "expression")[]
): ConstraintExpression | undefined {
  const [part, ...remaining] = path;
  if (part === undefined) return undefined;

  if (typeof part === "number" && "expressions" in expression) {
    const child = expression.expressions[part];
    if (!child) return expression;
    const replacement = remaining.length
      ? removeConstraintExpressionAtPath(child, remaining)
      : undefined;
    const expressions = expression.expressions.flatMap((item, index) =>
      index === part ? (replacement ? [replacement] : []) : [item]
    );
    if (expressions.length === 0) return undefined;
    return expressions.length === 1 ? expressions[0] : { ...expression, expressions };
  }

  if (part === "expression" && "expression" in expression) {
    const child = remaining.length
      ? removeConstraintExpressionAtPath(expression.expression, remaining)
      : undefined;
    return child ? { ...expression, expression: child } : undefined;
  }

  return expression;
}

const operatorSymbols: Record<ConstraintOperator, string> = {
  EQUALS: "==",
  NOT_EQUALS: "!=",
  GREATER_THAN: ">",
  GREATER_THAN_OR_EQUAL: ">=",
  LESS_THAN: "<",
  LESS_THAN_OR_EQUAL: "<=",
  IN: "IN",
  NOT_IN: "NOT IN",
  CONTAINS: "CONTAINS",
  STARTS_WITH: "STARTS WITH",
  ENDS_WITH: "ENDS WITH",
  ALWAYS: "ALWAYS",
  IS_UNSET: "IS UNSET",
  COUNT_AT_LEAST: "COUNT >=",
  COUNT_AT_MOST: "COUNT <=",
  COUNT_EXACTLY: "COUNT ==",
  STEP: "STEP"
};

const actionTypes = new Set<ConstraintActionType>([
  "REQUIRE",
  "EXCLUDE",
  "SET",
  "RESTRICT",
  "DERIVE",
  "DEFAULT",
  "RECOMMEND",
  "ADD",
  "REMOVE"
]);

const operators = new Set<ConstraintOperator>([
  "EQUALS",
  "NOT_EQUALS",
  "GREATER_THAN",
  "GREATER_THAN_OR_EQUAL",
  "LESS_THAN",
  "LESS_THAN_OR_EQUAL",
  "IN",
  "NOT_IN",
  "CONTAINS",
  "STARTS_WITH",
  "ENDS_WITH",
  "ALWAYS",
  "IS_UNSET",
  "COUNT_AT_LEAST",
  "COUNT_AT_MOST",
  "COUNT_EXACTLY",
  "STEP"
]);

const formulaSymbols: Record<ConstraintFormulaOperator, string> = {
  ADD: "+",
  SUBTRACT: "-",
  MULTIPLY: "*",
  DIVIDE: "/",
  MIN: "MIN",
  MAX: "MAX"
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isLiteral(value: unknown): value is ConstraintLiteral {
  return typeof value === "string" || typeof value === "number" || typeof value === "boolean";
}

function isConstraintDerivation(value: unknown): value is ConstraintDerivation {
  if (!isRecord(value)) return false;
  if (value.kind === "MAP")
    return (
      typeof value.source === "string" &&
      Array.isArray(value.rows) &&
      value.rows.every(
        (row) =>
          isRecord(row) &&
          ((typeof row.minimum === "number" && typeof row.maximum === "number") ||
            isLiteral(row.match)) &&
          isLiteral(row.value)
      )
    );
  if ((value.kind !== "CALCULATE" && value.kind !== "LINK") || !isRecord(value.formula))
    return false;
  const formula = value.formula;
  return (
    Array.isArray(formula.operands) &&
    formula.operands.every(
      (operand) =>
        isRecord(operand) &&
        ((operand.kind === "FEATURE" && typeof operand.feature === "string") ||
          (operand.kind === "VALUE" && typeof operand.value === "number"))
    ) &&
    Array.isArray(formula.operators) &&
    formula.operators.every(
      (operator) => typeof operator === "string" && Object.hasOwn(formulaSymbols, operator)
    ) &&
    (formula.rounding === undefined ||
      (isRecord(formula.rounding) &&
        ["ROUND", "FLOOR", "CEIL"].includes(String(formula.rounding.mode)) &&
        typeof formula.rounding.digits === "number")) &&
    (formula.conversion === undefined ||
      (isRecord(formula.conversion) &&
        typeof formula.conversion.factor === "number" &&
        typeof formula.conversion.fromUnit === "string" &&
        typeof formula.conversion.toUnit === "string")) &&
    (value.range === undefined ||
      (value.kind === "LINK" &&
        isRecord(value.range) &&
        typeof value.range.minimumOffset === "number" &&
        typeof value.range.maximumOffset === "number"))
  );
}

export function isConstraintExpression(value: unknown): value is ConstraintExpression {
  if (!isRecord(value) || typeof value.type !== "string") return false;
  if (value.type === "NOT") return isConstraintExpression(value.expression);
  if (value.type === "AND" || value.type === "OR")
    return Array.isArray(value.expressions) && value.expressions.every(isConstraintExpression);
  return (
    operators.has(value.type as ConstraintOperator) &&
    typeof value.feature === "string" &&
    (isLiteral(value.value) || (Array.isArray(value.value) && value.value.every(isLiteral)))
  );
}

export function isConstraintRuleAst(value: unknown): value is ConstraintRuleAst {
  if (!isRecord(value) || !isConstraintExpression(value.condition) || !Array.isArray(value.actions))
    return false;
  return value.actions.every(
    (action) =>
      isRecord(action) &&
      actionTypes.has(action.type as ConstraintActionType) &&
      isConstraintExpression(action.target) &&
      (action.derivation === undefined ||
        (isConstraintDerivation(action.derivation) &&
          (action.derivation.kind === "LINK" && action.derivation.range
            ? action.type === "RESTRICT"
            : action.type === "DERIVE")))
  );
}

export function isLegacyConstraintRuleAst(value: unknown): value is LegacyConstraintRuleAst {
  return (
    isRecord(value) &&
    ["REQUIRES", "EXCLUDES", "IMPLIES", "DERIVE"].includes(String(value.type)) &&
    isConstraintExpression(value.when) &&
    isConstraintExpression(value.then)
  );
}

function quote(value: string): string {
  return `"${value.replaceAll("\\", "\\\\").replaceAll('"', '\\"')}"`;
}

function formatLiteral(value: ConstraintLiteral): string {
  return typeof value === "string" ? quote(value) : String(value);
}

function conditionPrecedence(expression: ConstraintExpression): number {
  if (expression.type === "OR") return 1;
  if (expression.type === "AND") return 2;
  if (expression.type === "NOT") return 3;
  return 4;
}

function formatCondition(expression: ConstraintExpression, parentPrecedence = 0): string {
  let text: string;
  if (expression.type === "AND" || expression.type === "OR") {
    text = expression.expressions
      .map((child) => formatCondition(child, conditionPrecedence(expression)))
      .join(` ${expression.type} `);
  } else if (expression.type === "NOT") {
    text = `NOT ${formatCondition(expression.expression, conditionPrecedence(expression))}`;
  } else if ("feature" in expression) {
    if (expression.type === "IS_UNSET") text = `${expression.feature} IS UNSET`;
    else if (expression.type === "ALWAYS") text = `${expression.feature} ALWAYS`;
    else {
      const value = Array.isArray(expression.value)
        ? `(${expression.value.map(formatLiteral).join(", ")})`
        : formatLiteral(expression.value);
      text = `${expression.feature} ${operatorSymbols[expression.type]} ${value}`;
    }
  } else {
    text = "";
  }
  return conditionPrecedence(expression) < parentPrecedence ? `(${text})` : text;
}

export function formatConstraintCondition(expression: ConstraintExpression): string {
  return formatCondition(expression);
}

export function normalizeConstraintConditionForDesigner(
  expression: ConstraintExpression
): ConstraintExpression {
  const inverseOperators: Partial<Record<ConstraintOperator, ConstraintOperator>> = {
    EQUALS: "NOT_EQUALS",
    NOT_EQUALS: "EQUALS",
    GREATER_THAN: "LESS_THAN_OR_EQUAL",
    GREATER_THAN_OR_EQUAL: "LESS_THAN",
    LESS_THAN: "GREATER_THAN_OR_EQUAL",
    LESS_THAN_OR_EQUAL: "GREATER_THAN",
    IN: "NOT_IN",
    NOT_IN: "IN"
  };

  const normalize = (current: ConstraintExpression, negated = false): ConstraintExpression => {
    if ("feature" in current) {
      if (!negated) return structuredClone(current);
      const inverse = inverseOperators[current.type];
      return inverse ? { ...current, type: inverse } : { type: "NOT", expression: current };
    }

    if (current.type === "NOT") return normalize(current.expression, !negated);

    const type =
      negated && current.type === "AND"
        ? "OR"
        : negated && current.type === "OR"
          ? "AND"
          : current.type;
    const expressions = current.expressions.flatMap((child) => {
      const normalized = normalize(child, negated);
      return "expressions" in normalized && normalized.type === type
        ? normalized.expressions
        : [normalized];
    });
    return {
      type,
      expressions
    };
  };

  return normalize(expression);
}

export function formatConstraintExpression(ast: ConstraintRuleAst): string {
  const actions = ast.actions.map(formatConstraintAction).join(" AND ");
  return `WHEN ${formatCondition(ast.condition)} THEN ${actions}`;
}

function formatConstraintAction(action: ConstraintAction): string {
  return action.derivation
    ? formatDerivation(action)
    : `${action.type} ${formatCondition(action.target)}`;
}

function formatDerivation(action: ConstraintAction): string {
  const derivation = action.derivation;
  if (!derivation || !("feature" in action.target))
    throw new Error("Derived actions must target one feature");
  if (derivation.kind === "MAP") {
    const rows = derivation.rows
      .map((row) =>
        "match" in row
          ? `MATCH(${formatLiteral(row.match)}, ${formatLiteral(row.value)})`
          : `RANGE(${row.minimum}, ${row.maximum}, ${formatLiteral(row.value)})`
      )
      .join(", ");
    return `DERIVE ${action.target.feature} USING MAP(${derivation.source}${rows ? `, ${rows}` : ""})`;
  }
  const { formula } = derivation;
  const operands = formula.operands.map((operand) =>
    operand.kind === "FEATURE" ? operand.feature : String(operand.value)
  );
  const calculation = operands
    .map((operand, index) =>
      index === 0 ? operand : `${formulaSymbols[formula.operators[index - 1]]} ${operand}`
    )
    .join(" ");
  const rounding = formula.rounding
    ? ` ROUND(${formula.rounding.mode}, ${formula.rounding.digits})`
    : "";
  const conversion = formula.conversion
    ? ` CONVERT(${formula.conversion.factor}, ${quote(formula.conversion.fromUnit)}, ${quote(formula.conversion.toUnit)})`
    : "";
  const range =
    derivation.kind === "LINK" && derivation.range
      ? ` RANGE(${derivation.range.minimumOffset}, ${derivation.range.maximumOffset})`
      : "";
  return `${action.type} ${action.target.feature} USING ${derivation.kind}(${calculation})${rounding}${conversion}${range}`;
}

interface Token {
  value: string;
  position: number;
}

const tokenPattern =
  /\s*(=>|:=|>=|<=|!=|==|>|<|\(|\)|,|;|STARTS\s+WITH\b|ENDS\s+WITH\b|NOT\s+IN\b|WHEN\b|THEN\b|REQUIRES\b|EXCLUDES\b|IMPLIES\b|REQUIRE\b|EXCLUDE\b|RESTRICT\b|DERIVE\b|DEFAULT\b|RECOMMEND\b|REMOVE\b|ADD\b|SET\b|AND\b|OR\b|NOT\b|CONTAINS\b|IN\b|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|-?\d+(?:\.\d+)?(?:e[+-]?\d+)?|\+|-|\*|\/|true\b|false\b|[A-Za-z_][A-Za-z0-9_]*)/iy;

function tokenize(source: string): Token[] {
  const tokens: Token[] = [];
  let position = 0;
  while (position < source.length) {
    tokenPattern.lastIndex = position;
    const match = tokenPattern.exec(source);
    if (!match) {
      if (!source.slice(position).trim()) break;
      throw new Error(`无法识别位置 ${position + 1} 附近的表达式内容`);
    }
    tokens.push({ value: match[1], position });
    position = tokenPattern.lastIndex;
  }
  return tokens;
}

function legacyActionType(
  ruleType: ConstraintRuleType,
  target: ConstraintExpression
): ConstraintActionType {
  if (ruleType === "REQUIRES") return "REQUIRE";
  if (ruleType === "EXCLUDES") return "EXCLUDE";
  if (ruleType === "DERIVE") return "DERIVE";
  const targetPredicates = collectConstraintPredicates(target);
  return targetPredicates.some((predicate) =>
    ["GREATER_THAN", "GREATER_THAN_OR_EQUAL", "LESS_THAN", "LESS_THAN_OR_EQUAL"].includes(
      predicate.type
    )
  )
    ? "RESTRICT"
    : "REQUIRE";
}

function invertExclusionTarget(expression: ConstraintExpression): ConstraintExpression {
  if ("expressions" in expression)
    return { ...expression, expressions: expression.expressions.map(invertExclusionTarget) };
  if ("expression" in expression)
    return { ...expression, expression: invertExclusionTarget(expression.expression) };
  if (expression.type === "NOT_EQUALS") return { ...expression, type: "EQUALS" };
  if (expression.type === "NOT_IN") return { ...expression, type: "IN" };
  return structuredClone(expression);
}

function legacyActions(
  ruleType: ConstraintRuleType,
  target: ConstraintExpression
): ConstraintAction[] {
  if ("expressions" in target && target.type === "AND")
    return target.expressions.flatMap((child) => legacyActions(ruleType, child));
  const normalizedTarget =
    ruleType === "EXCLUDES" ? invertExclusionTarget(target) : structuredClone(target);
  return [{ type: legacyActionType(ruleType, target), target: normalizedTarget }];
}

export function migrateLegacyConstraintRuleAst(ast: LegacyConstraintRuleAst): ConstraintRuleAst {
  return {
    condition: structuredClone(ast.when),
    actions: legacyActions(ast.type, ast.then)
  };
}

class ConstraintExpressionParser {
  private index = 0;
  private readonly tokens: Token[];

  public constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  public parse(): ConstraintRuleAst {
    if (this.accept("WHEN")) return this.parseRule();
    return this.parseLegacyRule();
  }

  private parseRule(): ConstraintRuleAst {
    const condition = this.parseOr();
    this.expect("THEN");
    const actions: ConstraintAction[] = [];
    do {
      const action = this.take()?.value.toUpperCase() as ConstraintActionType | undefined;
      if (!action || !actionTypes.has(action)) throw new Error("THEN 后必须包含有效的结果动作");
      actions.push(
        (action === "DERIVE" || action === "RESTRICT") &&
          this.peek(1)?.value.toUpperCase() === "USING"
          ? this.parseDerivedAction(action)
          : { type: action, target: this.parseOr() }
      );
      if (!this.acceptActionSeparator()) break;
    } while (this.peek());
    if (!actions.length) throw new Error("至少需要添加一个结果动作");
    if (this.peek()) throw new Error(`表达式末尾存在多余内容：${this.peek()?.value}`);
    return { condition, actions };
  }

  private parseLegacyRule(): ConstraintRuleAst {
    const when = this.parseOr();
    const relation = this.take()?.value.toUpperCase();
    const type: ConstraintRuleType | undefined =
      relation === "REQUIRES" ||
      relation === "IMPLIES" ||
      relation === "EXCLUDES" ||
      relation === "DERIVE"
        ? relation
        : relation === "=>"
          ? "IMPLIES"
          : relation === ":="
            ? "DERIVE"
            : undefined;
    if (!type) throw new Error("请使用 WHEN … THEN … 定义条件与结果");
    const then = this.parseOr();
    if (this.peek()) throw new Error(`表达式末尾存在多余内容：${this.peek()?.value}`);
    return migrateLegacyConstraintRuleAst({ type, when, then });
  }

  private parseOr(): ConstraintExpression {
    const expressions = [this.parseAnd()];
    while (this.accept("OR")) expressions.push(this.parseAnd());
    return expressions.length === 1 ? expressions[0] : { type: "OR", expressions };
  }

  private parseAnd(): ConstraintExpression {
    const expressions = [this.parseUnary()];
    while (this.peek()?.value.toUpperCase() === "AND" && !this.nextIsActionType()) {
      this.index += 1;
      expressions.push(this.parseUnary());
    }
    return expressions.length === 1 ? expressions[0] : { type: "AND", expressions };
  }

  private parseUnary(): ConstraintExpression {
    if (this.accept("NOT")) return { type: "NOT", expression: this.parseUnary() };
    if (this.accept("(")) {
      const expression = this.parseOr();
      this.expect(")");
      return expression;
    }
    return this.parsePredicate();
  }

  private parsePredicate(): ConstraintPredicate {
    const feature = this.take();
    if (!feature || !/^[A-Za-z_][A-Za-z0-9_]*$/.test(feature.value))
      throw new Error("条件左侧必须是 Feature Code");
    if (this.accept("IS")) {
      this.expect("UNSET");
      return { type: "IS_UNSET", feature: feature.value, value: true };
    }
    if (this.accept("ALWAYS")) return { type: "ALWAYS", feature: feature.value, value: true };
    if (this.accept("COUNT")) {
      const comparison = this.take()?.value;
      const countOperators: Record<string, ConstraintOperator> = {
        ">=": "COUNT_AT_LEAST",
        "<=": "COUNT_AT_MOST",
        "==": "COUNT_EXACTLY"
      };
      const operator = comparison ? countOperators[comparison] : undefined;
      if (!operator) throw new Error("数量限制需要使用 >=、<= 或 ==");
      return { type: operator, feature: feature.value, value: this.parseLiteral() };
    }
    const operatorToken = this.take()?.value.toUpperCase();
    const operator = this.parseOperator(operatorToken);
    if (!operator) throw new Error(`Feature ${feature.value} 后缺少有效操作符`);
    const value =
      operator === "IN" ||
      operator === "NOT_IN" ||
      operator === "STEP" ||
      this.peek()?.value === "("
        ? this.parseValueList()
        : this.parseLiteral();
    return { type: operator, feature: feature.value, value };
  }

  private parseDerivedAction(actionType: "DERIVE" | "RESTRICT"): ConstraintAction {
    const feature = this.take()?.value;
    if (!feature || !/^[A-Za-z_][A-Za-z0-9_]*$/.test(feature))
      throw new Error("派生结果必须引用有效 Feature Code");
    this.expect("USING");
    const kind = this.take()?.value.toUpperCase();
    this.expect("(");
    let derivation: ConstraintDerivation;
    if (kind === "MAP") {
      const source = this.take()?.value;
      if (!source || !/^[A-Za-z_][A-Za-z0-9_]*$/.test(source))
        throw new Error("映射必须引用源 Feature Code");
      const rows: Extract<ConstraintDerivation, { kind: "MAP" }>["rows"] = [];
      while (this.accept(",")) {
        const exactMatch = this.accept("MATCH");
        if (!exactMatch) this.expect("RANGE");
        this.expect("(");
        const first = this.parseLiteral();
        this.expect(",");
        const second = this.parseLiteral();
        if (exactMatch) {
          this.expect(")");
          rows.push({ match: first, value: second });
          continue;
        }
        this.expect(",");
        const value = this.parseLiteral();
        this.expect(")");
        if (typeof first !== "number" || typeof second !== "number")
          throw new Error("映射区间必须使用数值边界");
        rows.push({ minimum: first, maximum: second, value });
      }
      this.expect(")");
      derivation = { kind, source, rows };
    } else if (kind === "CALCULATE" || kind === "LINK") {
      const formula: ConstraintFormula = { operands: [], operators: [] };
      const formulaOperators: Record<string, ConstraintFormulaOperator> = {
        "+": "ADD",
        "-": "SUBTRACT",
        "*": "MULTIPLY",
        "/": "DIVIDE",
        MIN: "MIN",
        MAX: "MAX"
      };
      const parseOperand = (): ConstraintFormulaOperand => {
        const token = this.take()?.value;
        if (!token) throw new Error("公式缺少操作数");
        if (/^-?\d+(?:\.\d+)?(?:e[+-]?\d+)?$/i.test(token))
          return { kind: "VALUE", value: Number(token) };
        if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(token)) return { kind: "FEATURE", feature: token };
        throw new Error(`无效的公式操作数 ${token}`);
      };
      formula.operands.push(parseOperand());
      while (this.peek() && this.peek()?.value !== ")") {
        const symbol = this.take()?.value.toUpperCase();
        const operator = symbol ? formulaOperators[symbol] : undefined;
        if (!operator) throw new Error(`无效的公式操作符 ${symbol ?? ""}`);
        formula.operators.push(operator);
        formula.operands.push(parseOperand());
      }
      this.expect(")");
      if (this.accept("ROUND")) {
        this.expect("(");
        const mode = this.take()?.value.toUpperCase();
        this.expect(",");
        const digits = this.parseLiteral();
        this.expect(")");
        if ((mode !== "ROUND" && mode !== "FLOOR" && mode !== "CEIL") || typeof digits !== "number")
          throw new Error("无效的舍入方式或小数位数");
        formula.rounding = { mode, digits };
      }
      if (this.accept("CONVERT")) {
        this.expect("(");
        const factor = this.parseLiteral();
        this.expect(",");
        const fromUnit = this.parseLiteral();
        this.expect(",");
        const toUnit = this.parseLiteral();
        this.expect(")");
        if (
          typeof factor !== "number" ||
          typeof fromUnit !== "string" ||
          typeof toUnit !== "string"
        )
          throw new Error("单位换算需要数值系数与单位名称");
        formula.conversion = { factor, fromUnit, toUnit };
      }
      if (this.accept("RANGE")) {
        this.expect("(");
        const minimumOffset = this.parseLiteral();
        this.expect(",");
        const maximumOffset = this.parseLiteral();
        this.expect(")");
        if (
          kind !== "LINK" ||
          actionType !== "RESTRICT" ||
          typeof minimumOffset !== "number" ||
          typeof maximumOffset !== "number"
        )
          throw new Error("联动范围需要数值偏移和 RESTRICT 动作");
        derivation = { kind, formula, range: { minimumOffset, maximumOffset } };
      } else {
        if (actionType !== "DERIVE") throw new Error("联动范围缺少上下限偏移");
        derivation = { kind, formula };
      }
    } else throw new Error("派生类型必须是 CALCULATE、MAP 或 LINK");
    if (kind === "MAP" && actionType !== "DERIVE") throw new Error("映射必须使用 DERIVE 动作");
    return {
      type: actionType,
      target: { type: "EQUALS", feature, value: "" },
      derivation
    };
  }

  private parseOperator(value?: string): ConstraintOperator | undefined {
    const operators: Record<string, ConstraintOperator> = {
      "==": "EQUALS",
      "=": "EQUALS",
      "!=": "NOT_EQUALS",
      ">": "GREATER_THAN",
      ">=": "GREATER_THAN_OR_EQUAL",
      "<": "LESS_THAN",
      "<=": "LESS_THAN_OR_EQUAL",
      IN: "IN",
      "NOT IN": "NOT_IN",
      CONTAINS: "CONTAINS",
      "STARTS WITH": "STARTS_WITH",
      "ENDS WITH": "ENDS_WITH",
      STEP: "STEP"
    };
    return value ? operators[value] : undefined;
  }

  private parseValueList(): ConstraintLiteral[] {
    this.expect("(");
    const values = [this.parseLiteral()];
    while (this.accept(",")) values.push(this.parseLiteral());
    this.expect(")");
    return values;
  }

  private parseLiteral(): ConstraintLiteral {
    const token = this.take();
    if (!token) throw new Error("条件缺少比较值");
    if (token.value.startsWith('"')) return JSON.parse(token.value) as string;
    if (token.value.startsWith("'")) return token.value.slice(1, -1).replaceAll("\\'", "'");
    if (token.value.toLowerCase() === "true") return true;
    if (token.value.toLowerCase() === "false") return false;
    if (/^-?\d+(?:\.\d+)?(?:e[+-]?\d+)?$/i.test(token.value)) return Number(token.value);
    throw new Error(`比较值 ${token.value} 必须是带引号的字符串、数字或布尔值`);
  }

  private expect(value: string): void {
    if (!this.accept(value)) throw new Error(`缺少 ${value}`);
  }

  private accept(value: string): boolean {
    if (this.peek()?.value.toUpperCase() !== value) return false;
    this.index += 1;
    return true;
  }

  private acceptActionSeparator(): boolean {
    if (this.accept(";")) return true;
    if (this.peek()?.value.toUpperCase() !== "AND" || !this.nextIsActionType()) return false;
    this.index += 1;
    return true;
  }

  private nextIsActionType(): boolean {
    const next = this.tokens[this.index + 1]?.value.toUpperCase();
    return !!next && actionTypes.has(next as ConstraintActionType);
  }

  private peek(offset = 0): Token | undefined {
    return this.tokens[this.index + offset];
  }

  private take(): Token | undefined {
    const token = this.peek();
    this.index += token ? 1 : 0;
    return token;
  }
}

export function parseConstraintExpression(source: string): ConstraintRuleAst {
  if (!source.trim()) throw new Error("表达式不能为空");
  return new ConstraintExpressionParser(tokenize(source)).parse();
}

export function createConstraintRule(input: {
  id: string;
  code: string;
  name: string;
  description?: string;
  ast: ConstraintRuleAst;
  source?: ConstraintRule["source"];
  createdBy?: string;
  modifiedAt?: string;
  version?: number;
  blueprint?: ConstraintBlueprintLayout;
}): ConstraintRule {
  return {
    id: input.id,
    code: input.code,
    name: input.name,
    description: input.description ?? "",
    status: "Draft",
    expression: formatConstraintExpression(input.ast),
    ast: structuredClone(input.ast),
    blueprint: input.blueprint ?? { positions: {} },
    source: input.source ?? { type: "MANUAL" },
    createdBy: input.createdBy ?? "Configuration Engineer",
    modifiedAt: input.modifiedAt ?? new Date().toISOString(),
    version: input.version ?? 1
  };
}

export type ConstraintRuleInput = Parameters<typeof createConstraintRule>[0];

export function collectConstraintPredicates(
  expression: ConstraintExpression
): ConstraintPredicate[] {
  if ("expressions" in expression)
    return expression.expressions.flatMap(collectConstraintPredicates);
  if ("expression" in expression) return collectConstraintPredicates(expression.expression);
  return [expression];
}

export function constraintRelationshipsForRule(
  rule: Pick<ConstraintRule, "ast">
): ConstraintRelationship[] {
  const sources = [
    ...new Set(
      collectConstraintPredicates(rule.ast.condition)
        .filter((predicate) => predicate.type !== "ALWAYS")
        .map((predicate) => predicate.feature)
    )
  ];
  const relationships = new Map<string, ConstraintRelationship>();

  for (const action of rule.ast.actions) {
    const targets = new Set(
      collectConstraintPredicates(action.target).map((predicate) => predicate.feature)
    );
    const derivedSources =
      action.derivation?.kind === "MAP"
        ? [action.derivation.source]
        : action.derivation
          ? action.derivation.formula.operands.flatMap((operand) =>
              operand.kind === "FEATURE" ? [operand.feature] : []
            )
          : [];
    for (const source of new Set([...sources, ...derivedSources])) {
      for (const target of targets) {
        if (source === target) continue;
        const relation = { source, target, type: action.type };
        relationships.set(JSON.stringify([source, target, action.type]), relation);
      }
    }
  }

  return [...relationships.values()];
}

export function constraintOperatorsFor(
  dataType: DataType,
  actionType?: ConstraintActionType
): ConstraintOperator[] {
  if (
    actionType === "SET" ||
    actionType === "DERIVE" ||
    actionType === "RECOMMEND" ||
    actionType === "ADD" ||
    actionType === "REMOVE"
  )
    return ["EQUALS"];
  let allowed: ConstraintOperator[];
  if (["Integer", "Decimal", "Range", "Date", "DateTime"].includes(dataType))
    allowed = [
      "EQUALS",
      "NOT_EQUALS",
      "GREATER_THAN",
      "GREATER_THAN_OR_EQUAL",
      "LESS_THAN",
      "LESS_THAN_OR_EQUAL"
    ];
  else if (["Enumeration", "Reference"].includes(dataType))
    allowed = ["EQUALS", "NOT_EQUALS", "IN", "NOT_IN"];
  else if (dataType === "Multi Enumeration")
    allowed = [
      "EQUALS",
      "NOT_EQUALS",
      "IN",
      "NOT_IN",
      "CONTAINS",
      ...(actionType === "RESTRICT"
        ? (["COUNT_AT_LEAST", "COUNT_AT_MOST", "COUNT_EXACTLY"] as const)
        : [])
    ];
  else if (dataType === "String")
    allowed = ["EQUALS", "NOT_EQUALS", "CONTAINS", "STARTS_WITH", "ENDS_WITH"];
  else allowed = ["EQUALS", "NOT_EQUALS"];

  return actionType === "EXCLUDE"
    ? allowed.filter((operator) => operator === "EQUALS" || operator === "IN")
    : allowed;
}

function validateFeatureValue(feature: FeatureDefinition, value: ConstraintLiteral): string[] {
  if (feature.dataType === "Boolean")
    return typeof value === "boolean" ? [] : ["Boolean features require true or false"];
  if (["Enumeration", "Multi Enumeration", "Reference"].includes(feature.dataType)) {
    const allowed = feature.domain.values.filter((item) => item.active).map((item) => item.code);
    return allowed.includes(String(value)) ? [] : [`${String(value)} is not an allowed value`];
  }
  if (["Integer", "Decimal", "Range"].includes(feature.dataType)) {
    if (typeof value !== "number" || !Number.isFinite(value))
      return ["A finite number is required"];
    if (feature.dataType === "Integer" && !Number.isInteger(value))
      return ["An integer is required"];
    if (
      (feature.domain.minimum !== undefined && value < feature.domain.minimum) ||
      (feature.domain.maximum !== undefined && value > feature.domain.maximum)
    )
      return ["Value is outside the feature range"];
    const { minimum, step } = feature.domain;
    if (
      step &&
      Math.abs((value - (minimum ?? 0)) / step - Math.round((value - (minimum ?? 0)) / step)) > 1e-7
    )
      return [`Value must follow step ${step}`];
  }
  if (feature.dataType === "String") {
    if (typeof value !== "string") return ["A string value is required"];
    if (feature.domain.maxLength && value.length > feature.domain.maxLength)
      return [`Value exceeds ${feature.domain.maxLength} characters`];
    if (feature.domain.pattern && !new RegExp(feature.domain.pattern).test(value))
      return ["Value does not match the feature pattern"];
  }
  if (feature.dataType === "Date" || feature.dataType === "DateTime") {
    if (typeof value !== "string" || Number.isNaN(Date.parse(value)))
      return ["A valid date is required"];
    if (
      (feature.domain.minimumDate && value < feature.domain.minimumDate) ||
      (feature.domain.maximumDate && value > feature.domain.maximumDate)
    )
      return ["Date is outside the feature range"];
  }
  return [];
}

function hasCycle(edges: Map<string, Set<string>>): boolean {
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const visit = (feature: string): boolean => {
    if (visiting.has(feature)) return true;
    if (visited.has(feature)) return false;
    visiting.add(feature);
    for (const target of edges.get(feature) ?? []) if (visit(target)) return true;
    visiting.delete(feature);
    visited.add(feature);
    return false;
  };
  return [...edges.keys()].some(visit);
}

function validateExpression(
  expression: ConstraintExpression,
  features: Map<string, FeatureDefinition>,
  issues: ConstraintValidationIssue[],
  actionType?: ConstraintActionType
): void {
  for (const predicate of collectConstraintPredicates(expression)) {
    const feature = features.get(predicate.feature);
    if (!feature) {
      issues.push({
        severity: "Error",
        code: "FEATURE_NOT_FOUND",
        feature: predicate.feature,
        message: `Feature ${predicate.feature} does not exist in this Configuration Context`
      });
      continue;
    }
    if (!feature.active) {
      issues.push({
        severity: "Error",
        code: "FEATURE_INACTIVE",
        feature: feature.code,
        message: `Feature ${feature.code} is inactive in this Configuration Context`
      });
      continue;
    }
    if (predicate.type === "IS_UNSET" || predicate.type === "ALWAYS") {
      if (actionType || predicate.value !== true)
        issues.push({
          severity: "Error",
          code: "INVALID_CONDITION",
          feature: feature.code,
          message: "This operator is only available as a condition"
        });
      continue;
    }
    if (predicate.type === "STEP") {
      const value = predicate.value;
      if (
        actionType !== "RESTRICT" ||
        !["Integer", "Decimal"].includes(feature.dataType) ||
        !Array.isArray(value) ||
        value.length !== 2 ||
        value.some((entry) => typeof entry !== "number" || !Number.isFinite(entry)) ||
        typeof value[1] !== "number" ||
        value[1] <= 0 ||
        (feature.dataType === "Integer" && value.some((entry) => !Number.isInteger(entry)))
      )
        issues.push({
          severity: "Error",
          code: "INVALID_STEP",
          feature: feature.code,
          message: "Numeric step requires a finite base and a positive step"
        });
      continue;
    }
    if (
      predicate.type === "COUNT_AT_LEAST" ||
      predicate.type === "COUNT_AT_MOST" ||
      predicate.type === "COUNT_EXACTLY"
    ) {
      if (
        actionType !== "RESTRICT" ||
        feature.dataType !== "Multi Enumeration" ||
        typeof predicate.value !== "number" ||
        !Number.isInteger(predicate.value) ||
        predicate.value < 0
      )
        issues.push({
          severity: "Error",
          code: "INVALID_COUNT",
          feature: feature.code,
          message: "Selection count requires a non-negative integer and a multi-select feature"
        });
      continue;
    }
    if (!constraintOperatorsFor(feature.dataType, actionType).includes(predicate.type)) {
      issues.push({
        severity: "Error",
        code: "OPERATOR_NOT_SUPPORTED",
        feature: feature.code,
        message: `Operator ${operatorSymbols[predicate.type]} cannot be used with ${feature.dataType}`
      });
      continue;
    }
    if (
      (predicate.type === "IN" || predicate.type === "NOT_IN") &&
      (!Array.isArray(predicate.value) || predicate.value.length === 0)
    ) {
      issues.push({
        severity: "Error",
        code: "IN_REQUIRES_LIST",
        feature: feature.code,
        message: `Operator ${operatorSymbols[predicate.type]} requires a list of values`
      });
      continue;
    }
    const multiAssignment =
      feature.dataType === "Multi Enumeration" &&
      predicate.type === "EQUALS" &&
      (actionType === "SET" || actionType === "RECOMMEND");
    if (
      Array.isArray(predicate.value) &&
      predicate.type !== "IN" &&
      predicate.type !== "NOT_IN" &&
      !multiAssignment
    ) {
      issues.push({
        severity: "Error",
        code: "LIST_OPERATOR_REQUIRED",
        feature: feature.code,
        message: "A list of values requires the IN or NOT IN operator"
      });
      continue;
    }
    if (multiAssignment && Array.isArray(predicate.value) && !predicate.value.length) {
      issues.push({
        severity: "Error",
        code: "VALUE_NOT_ALLOWED",
        feature: feature.code,
        message: "A multi-select assignment requires at least one value"
      });
      continue;
    }
    if (
      multiAssignment &&
      Array.isArray(predicate.value) &&
      (predicate.value.length < feature.minSelections ||
        predicate.value.length > feature.maxSelections ||
        new Set(predicate.value).size !== predicate.value.length)
    ) {
      issues.push({
        severity: "Error",
        code: "VALUE_NOT_ALLOWED",
        feature: feature.code,
        message: "Multi-select assignment is outside the feature selection range"
      });
      continue;
    }
    const values = Array.isArray(predicate.value) ? predicate.value : [predicate.value];
    for (const value of values) {
      const valueIssues = validateFeatureValue(feature, value);
      valueIssues.forEach((message) =>
        issues.push({
          severity: "Error",
          code: "VALUE_NOT_ALLOWED",
          feature: feature.code,
          message: `Value ${formatLiteral(value)} is not allowed by ${feature.name}: ${message}`
        })
      );
    }
  }
}

function validateDerivation(
  action: ConstraintAction,
  features: Map<string, FeatureDefinition>,
  issues: ConstraintValidationIssue[]
): void {
  const derivation = action.derivation;
  if (!derivation) return;
  const target = "feature" in action.target ? action.target : undefined;
  const targetFeature = target && features.get(target.feature);
  const linkedRange = derivation.kind === "LINK" && !!derivation.range;
  if (
    action.type !== (linkedRange ? "RESTRICT" : "DERIVE") ||
    !target ||
    target.type !== "EQUALS" ||
    target.value !== "" ||
    !targetFeature ||
    !targetFeature.active
  ) {
    issues.push({
      severity: "Error",
      code: "INVALID_DERIVATION_TARGET",
      feature: target?.feature,
      message: "Derivation must target an active feature"
    });
    return;
  }
  const sourceFeature = (code: string, numeric = true): FeatureDefinition | undefined => {
    if (!code.trim()) {
      issues.push({
        severity: "Error",
        code: "DERIVATION_SOURCE_REQUIRED",
        message: "Select a source feature"
      });
      return undefined;
    }
    const feature = features.get(code);
    if (!feature || !feature.active) {
      issues.push({
        severity: "Error",
        code: feature ? "FEATURE_INACTIVE" : "FEATURE_NOT_FOUND",
        feature: code,
        message: `Feature ${code} is not active in this Configuration Context`
      });
      return undefined;
    }
    if (
      !(
        numeric
          ? ["Integer", "Decimal"]
          : ["Integer", "Decimal", "Enumeration", "Reference", "Boolean"]
      ).includes(feature.dataType)
    )
      issues.push({
        severity: "Error",
        code: "DERIVATION_REQUIRES_NUMBER",
        feature: code,
        message: `Feature ${code} must be numeric`
      });
    return feature;
  };
  if (derivation.kind === "MAP") {
    const source = sourceFeature(derivation.source, false);
    if (!derivation.rows.length)
      issues.push({
        severity: "Error",
        code: "MAP_ROWS_REQUIRED",
        feature: targetFeature.code,
        message: "At least one mapping row is required"
      });
    const numericSource = source && ["Integer", "Decimal"].includes(source.dataType);
    const ranges = derivation.rows
      .filter((row): row is Extract<ConstraintMappingRow, { minimum: number }> => "minimum" in row)
      .sort((a, b) => a.minimum - b.minimum);
    const matches = new Set<ConstraintLiteral>();
    derivation.rows.forEach((row) => {
      if ("match" in row) {
        if (numericSource || !source || validateFeatureValue(source, row.match).length)
          issues.push({
            severity: "Error",
            code: "INVALID_MAP_MATCH",
            feature: derivation.source,
            message: "Mapping match must be an active source value"
          });
        if (matches.has(row.match))
          issues.push({
            severity: "Error",
            code: "MAP_OVERLAP",
            feature: derivation.source,
            message: "Mapping matches must be unique"
          });
        matches.add(row.match);
      } else {
        if (source && !numericSource)
          issues.push({
            severity: "Error",
            code: "INVALID_MAP_MATCH",
            feature: derivation.source,
            message: "Mapping intervals require a numeric source"
          });
        if (
          !Number.isFinite(row.minimum) ||
          !Number.isFinite(row.maximum) ||
          row.minimum > row.maximum
        )
          issues.push({
            severity: "Error",
            code: "INVALID_MAP_RANGE",
            feature: derivation.source,
            message: "Mapping interval has invalid bounds"
          });
      }
      if (typeof row.value === "string" && !row.value.trim())
        issues.push({
          severity: "Error",
          code: "VALUE_NOT_ALLOWED",
          feature: targetFeature.code,
          message: "Mapping output must not be empty"
        });
      validateFeatureValue(targetFeature, row.value).forEach((message) =>
        issues.push({
          severity: "Error",
          code: "VALUE_NOT_ALLOWED",
          feature: targetFeature.code,
          message: `Mapping value is not allowed by ${targetFeature.name}: ${message}`
        })
      );
    });
    ranges.forEach((row, index) => {
      if (index > 0 && row.minimum <= ranges[index - 1].maximum)
        issues.push({
          severity: "Error",
          code: "MAP_OVERLAP",
          feature: derivation.source,
          message: "Mapping intervals must not overlap"
        });
    });
    return;
  }
  if (!["Integer", "Decimal"].includes(targetFeature.dataType))
    issues.push({
      severity: "Error",
      code: "DERIVATION_REQUIRES_NUMBER",
      feature: targetFeature.code,
      message: `Feature ${targetFeature.code} must be numeric`
    });
  const { formula } = derivation;
  if (
    derivation.kind === "LINK" &&
    derivation.range &&
    (!Number.isFinite(derivation.range.minimumOffset) ||
      !Number.isFinite(derivation.range.maximumOffset) ||
      derivation.range.minimumOffset > derivation.range.maximumOffset)
  )
    issues.push({
      severity: "Error",
      code: "INVALID_LINK_RANGE",
      feature: targetFeature.code,
      message: "Linked range offsets must be finite and ordered"
    });
  if (!formula.operands.length || formula.operators.length !== formula.operands.length - 1)
    issues.push({
      severity: "Error",
      code: "INVALID_FORMULA",
      feature: targetFeature.code,
      message: "A formula needs an operand for each operation"
    });
  for (const operand of formula.operands) {
    if (operand.kind === "FEATURE") sourceFeature(operand.feature);
    else if (!Number.isFinite(operand.value))
      issues.push({
        severity: "Error",
        code: "INVALID_FORMULA",
        feature: targetFeature.code,
        message: "Formula constants must be finite numbers"
      });
  }
  if (
    formula.rounding &&
    (!Number.isInteger(formula.rounding.digits) ||
      formula.rounding.digits < 0 ||
      formula.rounding.digits > 10)
  )
    issues.push({
      severity: "Error",
      code: "INVALID_ROUNDING",
      feature: targetFeature.code,
      message: "Rounding precision must be between 0 and 10"
    });
  if (
    formula.conversion &&
    (!Number.isFinite(formula.conversion.factor) ||
      formula.conversion.factor <= 0 ||
      !formula.conversion.fromUnit ||
      !formula.conversion.toUnit)
  )
    issues.push({
      severity: "Error",
      code: "INVALID_CONVERSION",
      feature: targetFeature.code,
      message: "Unit conversion requires units and a positive finite factor"
    });
}

export function validateConstraintRule(
  rule: ConstraintRule,
  rules: ConstraintRule[],
  featureDefinitions: FeatureDefinition[]
): ConstraintValidationIssue[] {
  const issues: ConstraintValidationIssue[] = [];
  const featureByCode = new Map(featureDefinitions.map((feature) => [feature.code, feature]));
  validateExpression(rule.ast.condition, featureByCode, issues);
  if (!rule.ast.actions.length) {
    issues.push({
      severity: "Error",
      code: "ACTION_REQUIRED",
      message: "至少需要添加一个结果动作"
    });
  }
  for (const action of rule.ast.actions) {
    if (action.type === "DEFAULT")
      issues.push({
        severity: "Error",
        code: "DEFAULT_ACTION_DEPRECATED",
        feature: "feature" in action.target ? action.target.feature : undefined,
        message: "默认值由特征模型管理，不再作为约束规则动作"
      });
    if (action.derivation) validateDerivation(action, featureByCode, issues);
    else validateExpression(action.target, featureByCode, issues, action.type);
    if (action.type === "ADD" || action.type === "REMOVE") {
      const target = "feature" in action.target ? action.target : undefined;
      const feature = target && featureByCode.get(target.feature);
      if (
        !target ||
        target.type !== "EQUALS" ||
        !feature ||
        !["Boolean", "Multi Enumeration"].includes(feature.dataType) ||
        Array.isArray(target.value) ||
        (feature.dataType === "Boolean" && target.value !== (action.type === "ADD"))
      )
        issues.push({
          severity: "Error",
          code: "INVALID_COMPONENT_ACTION",
          feature: target?.feature,
          message: "Add and remove require a Boolean or multi-select component feature"
        });
    }
  }

  const edges = new Map<string, Set<string>>();
  for (const existing of [...rules.filter((item) => item.id !== rule.id), rule]) {
    const sources = collectConstraintPredicates(existing.ast.condition)
      .filter((predicate) => predicate.type !== "ALWAYS")
      .map((predicate) => predicate.feature);
    for (const action of existing.ast.actions) {
      const targets = collectConstraintPredicates(action.target).map(
        (predicate) => predicate.feature
      );
      const derivedSources =
        action.derivation?.kind === "MAP"
          ? [action.derivation.source]
          : action.derivation
            ? action.derivation.formula.operands.flatMap((operand) =>
                operand.kind === "FEATURE" ? [operand.feature] : []
              )
            : [];
      for (const source of new Set([...sources, ...derivedSources])) {
        const outgoing = edges.get(source) ?? new Set<string>();
        targets.forEach((target) => {
          if (
            source !== target ||
            action.type === "SET" ||
            (action.derivation && derivedSources.includes(source))
          )
            outgoing.add(target);
        });
        edges.set(source, outgoing);
      }
    }
  }
  if (hasCycle(edges))
    issues.push({
      severity: "Error",
      code: "CIRCULAR_DEPENDENCY",
      message: "Circular dependency detected"
    });
  return issues;
}

type PreviewTruth = boolean | undefined;

function isPreviewValueSet(value: unknown): boolean {
  return (
    value !== undefined &&
    value !== null &&
    value !== "" &&
    !(Array.isArray(value) && !value.length)
  );
}

function normalizePreviewValue(
  value: unknown,
  feature: FeatureDefinition
): ConstraintLiteral | ConstraintLiteral[] | undefined {
  if (!isPreviewValueSet(value)) return undefined;
  if (Array.isArray(value)) {
    return value
      .map((item) => normalizePreviewScalar(item, feature))
      .filter((item): item is ConstraintLiteral => item !== undefined);
  }
  return normalizePreviewScalar(value, feature);
}

function normalizePreviewScalar(
  value: unknown,
  feature: FeatureDefinition
): ConstraintLiteral | undefined {
  if (feature.dataType === "Boolean") {
    if (typeof value === "boolean") return value;
    if (value === "true") return true;
    if (value === "false") return false;
    return undefined;
  }
  if (["Integer", "Decimal"].includes(feature.dataType)) {
    const number = typeof value === "number" ? value : Number(value);
    return Number.isFinite(number) ? number : undefined;
  }
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean")
    return value;
  return undefined;
}

function equalPreviewValues(
  left: ConstraintLiteral | ConstraintLiteral[],
  right: ConstraintLiteral | ConstraintLiteral[]
): boolean {
  if (!Array.isArray(left) && !Array.isArray(right)) return left === right;
  const leftValues = Array.isArray(left) ? left : [left];
  const rightValues = Array.isArray(right) ? right : [right];
  return (
    leftValues.length === rightValues.length &&
    leftValues.every((value) => rightValues.includes(value))
  );
}

function evaluatePreviewPredicate(
  predicate: ConstraintPredicate,
  features: Map<string, FeatureDefinition>,
  values: ReadonlyMap<string, unknown>
): PreviewTruth {
  const feature = features.get(predicate.feature);
  if (!feature?.active) return undefined;
  if (predicate.type === "ALWAYS") return true;
  if (predicate.type === "IS_UNSET") return !isPreviewValueSet(values.get(predicate.feature));
  if (predicate.type === "STEP") {
    const actual = normalizePreviewValue(values.get(predicate.feature), feature);
    if (
      typeof actual !== "number" ||
      !Array.isArray(predicate.value) ||
      predicate.value.length !== 2 ||
      typeof predicate.value[0] !== "number" ||
      typeof predicate.value[1] !== "number" ||
      !Number.isFinite(predicate.value[0]) ||
      !Number.isFinite(predicate.value[1]) ||
      predicate.value[1] <= 0
    )
      return undefined;
    const steps = (actual - predicate.value[0]) / predicate.value[1];
    return Math.abs(steps - Math.round(steps)) <= 1e-7;
  }
  if (
    predicate.type === "COUNT_AT_LEAST" ||
    predicate.type === "COUNT_AT_MOST" ||
    predicate.type === "COUNT_EXACTLY"
  ) {
    const selected = values.get(predicate.feature);
    if (!Array.isArray(selected) || typeof predicate.value !== "number") return undefined;
    if (predicate.type === "COUNT_AT_LEAST") return selected.length >= predicate.value;
    if (predicate.type === "COUNT_AT_MOST") return selected.length <= predicate.value;
    return selected.length === predicate.value;
  }
  const actual = normalizePreviewValue(values.get(predicate.feature), feature);
  if (actual === undefined) return undefined;

  const expected = predicate.value;
  const actualValues = Array.isArray(actual) ? actual : [actual];
  const expectedValues = Array.isArray(expected) ? expected : [expected];
  const intersects = actualValues.some((value) => expectedValues.includes(value));

  switch (predicate.type) {
    case "EQUALS":
      if (
        feature.dataType === "Multi Enumeration" &&
        Array.isArray(actual) &&
        !Array.isArray(expected)
      )
        return actual.includes(expected);
      return equalPreviewValues(actual, expected);
    case "NOT_EQUALS":
      if (
        feature.dataType === "Multi Enumeration" &&
        Array.isArray(actual) &&
        !Array.isArray(expected)
      )
        return !actual.includes(expected);
      return !equalPreviewValues(actual, expected);
    case "IN":
      return intersects;
    case "NOT_IN":
      return !intersects;
    case "CONTAINS":
      return Array.isArray(actual)
        ? actual.includes(expectedValues[0] ?? "")
        : typeof actual === "string"
          ? actual.includes(String(expectedValues[0] ?? ""))
          : false;
    case "STARTS_WITH":
      return typeof actual === "string" && actual.startsWith(String(expectedValues[0] ?? ""));
    case "ENDS_WITH":
      return typeof actual === "string" && actual.endsWith(String(expectedValues[0] ?? ""));
    case "GREATER_THAN":
    case "GREATER_THAN_OR_EQUAL":
    case "LESS_THAN":
    case "LESS_THAN_OR_EQUAL": {
      if (Array.isArray(actual) || Array.isArray(expected)) return undefined;
      if (typeof actual !== typeof expected) return undefined;
      const dateComparison = ["Date", "DateTime"].includes(feature.dataType);
      const left = dateComparison && typeof actual === "string" ? Date.parse(actual) : actual;
      const right =
        dateComparison && typeof expected === "string" ? Date.parse(expected) : expected;
      if (
        (typeof left === "number" && !Number.isFinite(left)) ||
        (typeof right === "number" && !Number.isFinite(right))
      )
        return undefined;
      if (predicate.type === "GREATER_THAN") return left > right;
      if (predicate.type === "GREATER_THAN_OR_EQUAL") return left >= right;
      if (predicate.type === "LESS_THAN") return left < right;
      return left <= right;
    }
  }
}

function evaluatePreviewExpression(
  expression: ConstraintExpression,
  features: Map<string, FeatureDefinition>,
  values: ReadonlyMap<string, unknown>
): PreviewTruth {
  if ("feature" in expression) return evaluatePreviewPredicate(expression, features, values);
  if (expression.type === "NOT") {
    const result = evaluatePreviewExpression(expression.expression, features, values);
    return result === undefined ? undefined : !result;
  }

  const results = expression.expressions.map((child) =>
    evaluatePreviewExpression(child, features, values)
  );
  if (expression.type === "AND") {
    if (results.includes(false)) return false;
    return results.includes(undefined) ? undefined : true;
  }
  if (results.includes(true)) return true;
  return results.includes(undefined) ? undefined : false;
}

function previewStatusForRule(
  condition: PreviewTruth,
  actions: ConstraintActionPreview[]
): ConstraintPreviewStatus {
  if (condition === false) return "not-triggered";
  if (condition === undefined) return "pending";
  if (actions.some((action) => action.status === "conflict")) return "conflict";
  if (actions.some((action) => action.status === "not-applied")) return "not-applied";
  if (actions.some((action) => action.status === "pending")) return "pending";
  return "satisfied";
}

function previewStatusForAction(
  type: ConstraintActionType,
  target: ConstraintExpression,
  features: Map<string, FeatureDefinition>,
  values: ReadonlyMap<string, unknown>
): ConstraintPreviewStatus {
  if (["SET", "DERIVE", "DEFAULT", "RECOMMEND", "ADD", "REMOVE"].includes(type))
    return "not-applied";
  if (type === "RESTRICT" && "feature" in target && target.type === "IN") {
    const feature = features.get(target.feature);
    const actual = values.get(target.feature);
    const allowed = target.value;
    if (
      feature?.dataType === "Multi Enumeration" &&
      Array.isArray(actual) &&
      Array.isArray(allowed)
    )
      return actual.every((value) => allowed.includes(value)) ? "satisfied" : "conflict";
  }
  const result = evaluatePreviewExpression(target, features, values);
  if (type === "EXCLUDE") return result === true ? "conflict" : "satisfied";
  if (result === undefined) return "pending";
  return result ? "satisfied" : "conflict";
}

function previewAction(
  action: ConstraintAction,
  features: Map<string, FeatureDefinition>,
  values: ReadonlyMap<string, unknown>
): ConstraintActionPreview {
  let target = action.target;
  let pending = false;
  if (
    action.type === "RESTRICT" &&
    action.derivation?.kind === "LINK" &&
    action.derivation.range &&
    "feature" in action.target
  ) {
    const errors: ConstraintValidationIssue[] = [];
    validateDerivation(action, features, errors);
    const base = errors.length
      ? undefined
      : calculateDerivation(action.derivation, features, values);
    if (!base || !("value" in base) || typeof base.value !== "number") pending = true;
    else {
      const minimum = base.value + action.derivation.range.minimumOffset;
      const maximum = base.value + action.derivation.range.maximumOffset;
      if (!Number.isFinite(minimum) || !Number.isFinite(maximum)) pending = true;
      else
        target = {
          type: "AND",
          expressions: [
            { type: "GREATER_THAN_OR_EQUAL", feature: action.target.feature, value: minimum },
            { type: "LESS_THAN_OR_EQUAL", feature: action.target.feature, value: maximum }
          ]
        };
    }
  }
  return {
    type: action.type,
    target,
    ...(action.derivation ? { derivation: structuredClone(action.derivation) } : {}),
    status: pending ? "pending" : previewStatusForAction(action.type, target, features, values)
  };
}

export function activeConstraintEffects(
  rules: ConstraintRule[],
  featureDefinitions: FeatureDefinition[],
  values: ReadonlyMap<string, unknown>
): ConstraintPreviewEffect[] {
  const features = new Map(featureDefinitions.map((feature) => [feature.code, feature]));
  const effects: ConstraintPreviewEffect[] = [];
  for (const rule of rules) {
    const conditionStatus = evaluatePreviewExpression(rule.ast.condition, features, values);
    if (conditionStatus === true)
      for (const action of rule.ast.actions)
        effects.push({
          ruleId: rule.id,
          code: rule.code,
          name: rule.name,
          description: rule.description,
          ...previewAction(action, features, values),
          direction: "action"
        });

    if (!("feature" in rule.ast.condition)) continue;
    for (const action of rule.ast.actions) {
      if (action.type !== "EXCLUDE" || !("feature" in action.target)) continue;
      if (evaluatePreviewExpression(action.target, features, values) !== true) continue;
      effects.push({
        ruleId: rule.id,
        code: rule.code,
        name: rule.name,
        description: rule.description,
        type: "EXCLUDE",
        target: rule.ast.condition,
        status: conditionStatus === true ? "conflict" : "satisfied",
        direction: "condition",
        trigger: structuredClone(action.target)
      });
    }
  }
  return effects;
}

function constraintCandidateValues(
  effect: ConstraintPreviewEffect,
  feature: FeatureDefinition
): Set<string> | undefined {
  if (
    ["SET", "DERIVE", "DEFAULT", "RECOMMEND", "ADD", "REMOVE"].includes(effect.type) ||
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

export function constraintEffectAllowedValues(
  effect: ConstraintPreviewEffect,
  feature: FeatureDefinition
): Set<string> | undefined {
  if (feature.dataType === "Multi Enumeration" && effect.type === "REQUIRE") return undefined;
  return constraintCandidateValues(effect, feature);
}

export function constraintMaximumSelections(
  effects: readonly ConstraintPreviewEffect[],
  featureCode: string
): number | undefined {
  const conjuncts = (expression: ConstraintExpression): ConstraintPredicate[] =>
    "feature" in expression
      ? [expression]
      : expression.type === "AND"
        ? expression.expressions.flatMap(conjuncts)
        : [];
  const maxima = effects
    .filter((effect) => effect.type === "RESTRICT")
    .flatMap((effect) => conjuncts(effect.target))
    .filter(
      (predicate) =>
        predicate.feature === featureCode &&
        (predicate.type === "COUNT_AT_MOST" || predicate.type === "COUNT_EXACTLY") &&
        typeof predicate.value === "number" &&
        Number.isInteger(predicate.value) &&
        predicate.value >= 0
    )
    .map((predicate) => predicate.value)
    .filter((value): value is number => typeof value === "number");
  return maxima.length ? Math.min(...maxima) : undefined;
}

export function detectConstraintConflicts(
  rules: ConstraintRule[],
  featureDefinitions: FeatureDefinition[],
  values: ReadonlyMap<string, unknown>
): ConstraintConflict[] {
  const effects = activeConstraintEffects(rules, featureDefinitions, values);
  const byFeature = new Map<string, ConstraintPreviewEffect[]>();
  for (const effect of effects) {
    if (!["REQUIRE", "EXCLUDE", "RESTRICT"].includes(effect.type)) continue;
    for (const code of new Set(
      collectConstraintPredicates(effect.target).map((item) => item.feature)
    )) {
      const entries = byFeature.get(code) ?? [];
      entries.push(effect);
      byFeature.set(code, entries);
    }
  }
  const conflicts: ConstraintConflict[] = [];
  for (const [code, entries] of byFeature) {
    const feature = featureDefinitions.find((item) => item.code === code);
    if (!feature) continue;
    const allowed = entries.flatMap((effect) => {
      const set = constraintCandidateValues(effect, feature);
      return set ? [{ effect, set }] : [];
    });
    const intersectionEmpty = (sets: ReadonlyArray<{ set: Set<string> }>): boolean =>
      sets.length > 0 &&
      [...sets[0].set].every((value) => sets.slice(1).some(({ set }) => !set.has(value)));
    const contributors = new Set<ConstraintPreviewEffect>();
    const addMinimalConflict = (
      candidates: { effect: ConstraintPreviewEffect; set: Set<string> }[]
    ): void => {
      let minimal = [...candidates];
      for (const candidate of candidates) {
        const remaining = minimal.filter((item) => item !== candidate);
        if (intersectionEmpty(remaining)) minimal = remaining;
      }
      minimal.forEach(({ effect }) => contributors.add(effect));
    };
    const hard = allowed.filter(({ effect }) => effect.type !== "REQUIRE");
    const requirements = allowed.filter(({ effect }) => effect.type === "REQUIRE");
    if (feature.dataType === "Multi Enumeration") {
      for (const requirement of requirements) {
        const combined = [requirement, ...hard];
        if (intersectionEmpty(combined)) addMinimalConflict(combined);
      }
    } else if (intersectionEmpty(allowed)) addMinimalConflict(allowed);

    let minimum = -Infinity;
    let maximum = Infinity;
    let minimumInclusive = true;
    let maximumInclusive = true;
    const excluded = new Map<number, ConstraintPreviewEffect>();
    let minCount = feature.dataType === "Multi Enumeration" ? feature.minSelections : 0;
    let maxCount = Infinity;
    let lowerBound: ConstraintPreviewEffect | undefined;
    let upperBound: ConstraintPreviewEffect | undefined;
    let minCountEffect: ConstraintPreviewEffect | undefined;
    let maxCountEffect: ConstraintPreviewEffect | undefined;
    const conjuncts = (expression: ConstraintExpression): ConstraintPredicate[] =>
      "feature" in expression
        ? [expression]
        : expression.type === "AND"
          ? expression.expressions.flatMap(conjuncts)
          : [];
    for (const effect of entries) {
      for (const predicate of conjuncts(effect.target)) {
        if (predicate.feature !== code) continue;
        const value =
          typeof predicate.value === "number"
            ? predicate.value
            : ["Date", "DateTime"].includes(feature.dataType) && typeof predicate.value === "string"
              ? Date.parse(predicate.value)
              : Number.NaN;
        if (!Number.isFinite(value)) continue;
        if (effect.type === "EXCLUDE") {
          if (predicate.type === "EQUALS") excluded.set(value, effect);
          continue;
        }
        if (
          (predicate.type === "COUNT_AT_LEAST" || predicate.type === "COUNT_EXACTLY") &&
          value > minCount
        ) {
          minCount = value;
          minCountEffect = effect;
        }
        if (
          (predicate.type === "COUNT_AT_MOST" || predicate.type === "COUNT_EXACTLY") &&
          value < maxCount
        ) {
          maxCount = value;
          maxCountEffect = effect;
        }
        if (
          predicate.type === "EQUALS" ||
          predicate.type === "GREATER_THAN" ||
          predicate.type === "GREATER_THAN_OR_EQUAL"
        ) {
          const inclusive = predicate.type !== "GREATER_THAN";
          if (value > minimum) {
            minimum = value;
            minimumInclusive = inclusive;
            lowerBound = effect;
          } else if (value === minimum && !inclusive) {
            minimumInclusive = false;
            lowerBound = effect;
          }
        }
        if (
          predicate.type === "EQUALS" ||
          predicate.type === "LESS_THAN" ||
          predicate.type === "LESS_THAN_OR_EQUAL"
        ) {
          const inclusive = predicate.type !== "LESS_THAN";
          if (value < maximum) {
            maximum = value;
            maximumInclusive = inclusive;
            upperBound = effect;
          } else if (value === maximum && !inclusive) {
            maximumInclusive = false;
            upperBound = effect;
          }
        }
      }
    }
    const noNumericValue =
      minimum > maximum ||
      (minimum === maximum && (!minimumInclusive || !maximumInclusive || excluded.has(minimum)));
    if (noNumericValue) {
      if (lowerBound) contributors.add(lowerBound);
      if (upperBound) contributors.add(upperBound);
      const exclusion = excluded.get(minimum);
      if (minimum === maximum && exclusion) contributors.add(exclusion);
    }
    if (minCount > maxCount) {
      if (minCountEffect) contributors.add(minCountEffect);
      if (maxCountEffect) contributors.add(maxCountEffect);
    }
    if (feature.dataType === "Multi Enumeration") {
      const options = feature.domain.values
        .filter((value) => value.active)
        .map((value) => value.code);
      const available = options.filter((value) => hard.every(({ set }) => set.has(value)));
      if (available.length < minCount) {
        if (minCountEffect) contributors.add(minCountEffect);
        hard.forEach(({ effect }) => contributors.add(effect));
      }
      const requiredSingleValues = requirements
        .filter(({ set }) => set.size === 1)
        .map(({ set }) => [...set][0]);
      if (new Set(requiredSingleValues).size > maxCount && maxCountEffect) {
        contributors.add(maxCountEffect);
        requirements
          .filter(({ set }) => set.size === 1)
          .forEach(({ effect }) => contributors.add(effect));
      }
    }
    if (!contributors.size) continue;
    const ruleIds = [...new Set([...contributors].map((effect) => effect.ruleId))];
    conflicts.push({
      feature: code,
      ruleIds,
      rules: ruleIds.flatMap((id) => {
        const rule = rules.find((item) => item.id === id);
        return rule ? [{ id, code: rule.code, name: rule.name }] : [];
      })
    });
  }
  return conflicts;
}

interface SimulationProposal {
  rule: ConstraintRule;
  action: ConstraintAction;
  feature: FeatureDefinition;
  value: ConstraintLiteral | ConstraintLiteral[];
}

function calculateDerivation(
  derivation: ConstraintDerivation,
  features: Map<string, FeatureDefinition>,
  values: ReadonlyMap<string, unknown>
): { value: ConstraintLiteral } | { code: string; message: string } {
  if (derivation.kind === "MAP") {
    const source = features.get(derivation.source);
    const value = source && normalizePreviewValue(values.get(source.code), source);
    if (value === undefined || Array.isArray(value))
      return {
        code: "DERIVATION_INPUT_MISSING",
        message: `Missing source value: ${derivation.source}`
      };
    const row = derivation.rows.find((item) =>
      "match" in item
        ? item.match === value
        : typeof value === "number" && value >= item.minimum && value <= item.maximum
    );
    return row
      ? { value: row.value }
      : { code: "MAP_NO_MATCH", message: `No mapping interval matches ${derivation.source}` };
  }
  const { formula } = derivation;
  const operands: number[] = [];
  for (const operand of formula.operands) {
    if (operand.kind === "VALUE") operands.push(operand.value);
    else {
      const feature = features.get(operand.feature);
      const value = feature && normalizePreviewValue(values.get(operand.feature), feature);
      if (typeof value !== "number")
        return {
          code: "DERIVATION_INPUT_MISSING",
          message: `Missing numeric value: ${operand.feature}`
        };
      operands.push(value);
    }
  }
  let result = operands[0];
  if (result === undefined) return { code: "INVALID_FORMULA", message: "Formula has no operands" };
  for (let index = 0; index < formula.operators.length; index += 1) {
    const operand = operands[index + 1];
    if (operand === undefined)
      return { code: "INVALID_FORMULA", message: "Formula is missing an operand" };
    switch (formula.operators[index]) {
      case "ADD":
        result += operand;
        break;
      case "SUBTRACT":
        result -= operand;
        break;
      case "MULTIPLY":
        result *= operand;
        break;
      case "DIVIDE":
        if (operand === 0)
          return { code: "DIVISION_BY_ZERO", message: "Formula cannot divide by zero" };
        result /= operand;
        break;
      case "MIN":
        result = Math.min(result, operand);
        break;
      case "MAX":
        result = Math.max(result, operand);
        break;
    }
  }
  if (formula.conversion) result *= formula.conversion.factor;
  if (formula.rounding) {
    const scale = 10 ** formula.rounding.digits;
    const round =
      formula.rounding.mode === "FLOOR"
        ? Math.floor
        : formula.rounding.mode === "CEIL"
          ? Math.ceil
          : (value: number) => Math.sign(value) * Math.round(Math.abs(value));
    result = round(result * scale) / scale;
  }
  return Number.isFinite(result)
    ? { value: result }
    : { code: "INVALID_FORMULA_RESULT", message: "Formula produced a non-finite value" };
}

export function simulateConstraintActions(
  rules: ConstraintRule[],
  featureDefinitions: FeatureDefinition[],
  inputValues: ReadonlyMap<string, unknown>
): ConstraintSimulation {
  const features = new Map(featureDefinitions.map((feature) => [feature.code, feature]));
  const values = new Map(inputValues);
  const changes = new Map<string, ConstraintSimulationChange>();
  const issues = new Map<string, ConstraintSimulationIssue>();
  const conflicts = new Map<string, ConstraintConflict>();
  const seenValues = new Set<string>();
  let settled = false;
  const issue = (rule: ConstraintRule, feature: string, code: string, message: string): void => {
    issues.set(JSON.stringify([rule.id, feature, code]), {
      code,
      ruleId: rule.id,
      name: rule.name,
      feature,
      message
    });
  };
  const conflict = (feature: string, ruleIds: string[]): void => {
    const ids = [...new Set([...(conflicts.get(feature)?.ruleIds ?? []), ...ruleIds])];
    conflicts.set(feature, {
      feature,
      ruleIds: ids,
      rules: ids.flatMap((id) => {
        const rule = rules.find((item) => item.id === id);
        return rule ? [{ id, code: rule.code, name: rule.name }] : [];
      })
    });
  };
  const getProposals = (includeRecommendations: boolean): SimulationProposal[] => {
    const proposals: SimulationProposal[] = [];
    for (const rule of rules) {
      if (evaluatePreviewExpression(rule.ast.condition, features, values) !== true) continue;
      for (const action of rule.ast.actions) {
        if (
          !includeRecommendations &&
          action.type === "RESTRICT" &&
          action.derivation?.kind === "LINK" &&
          action.derivation.range
        ) {
          const targetCode = "feature" in action.target ? action.target.feature : "";
          const errors: ConstraintValidationIssue[] = [];
          validateDerivation(action, features, errors);
          if (errors.length) issue(rule, targetCode, errors[0].code, errors[0].message);
          else {
            const result = calculateDerivation(action.derivation, features, values);
            if ("code" in result) issue(rule, targetCode, result.code, result.message);
            else if (
              typeof result.value !== "number" ||
              !Number.isFinite(result.value + action.derivation.range.minimumOffset) ||
              !Number.isFinite(result.value + action.derivation.range.maximumOffset)
            )
              issue(rule, targetCode, "INVALID_FORMULA_RESULT", "Linked range is not finite");
          }
          continue;
        }
        if (
          !["SET", "DERIVE", "RECOMMEND", "ADD", "REMOVE"].includes(action.type) ||
          (action.type === "RECOMMEND") !== includeRecommendations
        )
          continue;
        const target = "feature" in action.target ? action.target : undefined;
        const feature = target && features.get(target.feature);
        if (!target || !feature || !feature.active || target.type !== "EQUALS") {
          issue(
            rule,
            target?.feature ?? "",
            "INVALID_ACTION_TARGET",
            "Automatic action has an invalid target"
          );
          continue;
        }
        if (
          (action.type === "ADD" || action.type === "REMOVE") &&
          (!["Boolean", "Multi Enumeration"].includes(feature.dataType) ||
            (feature.dataType === "Boolean" && target.value !== (action.type === "ADD")))
        ) {
          issue(
            rule,
            feature.code,
            "INVALID_COMPONENT_ACTION",
            "Component action has an invalid target"
          );
          continue;
        }
        const errors: ConstraintValidationIssue[] = [];
        if (action.derivation) validateDerivation(action, features, errors);
        else validateExpression(action.target, features, errors, action.type);
        if (errors.length) {
          issue(rule, feature.code, errors[0].code, errors[0].message);
          continue;
        }
        const derived = action.derivation
          ? calculateDerivation(action.derivation, features, values)
          : { value: target.value };
        if ("code" in derived) {
          issue(rule, feature.code, derived.code, derived.message);
          continue;
        }
        if (
          Array.isArray(derived.value) &&
          (feature.dataType !== "Multi Enumeration" ||
            !["SET", "RECOMMEND"].includes(action.type))
        ) {
          issue(
            rule,
            feature.code,
            "INVALID_ACTION_VALUE",
            "Automatic action requires a single value"
          );
          continue;
        }
        proposals.push({ rule, action, feature, value: derived.value });
      }
    }
    return proposals;
  };

  for (let pass = 0; pass <= rules.length + featureDefinitions.length; pass += 1) {
    issues.clear();
    conflicts.clear();
    const signature = JSON.stringify([...values.entries()]);
    if (seenValues.has(signature)) {
      const proposal = getProposals(false)[0];
      if (proposal)
        issue(
          proposal.rule,
          proposal.feature.code,
          "AUTOMATIC_CYCLE",
          "Automatic actions do not converge"
        );
      values.clear();
      inputValues.forEach((value, code) => values.set(code, value));
      changes.clear();
      settled = true;
      break;
    }
    seenValues.add(signature);
    let changed = false;
    const rollback = (code: string): void => {
      const current = values.get(code);
      const original = inputValues.get(code);
      if (JSON.stringify(current) !== JSON.stringify(original)) {
        if (inputValues.has(code)) values.set(code, original);
        else values.delete(code);
        changed = true;
      }
      for (const [key, change] of changes) if (change.feature === code) changes.delete(key);
    };
    const constraintConflicts = detectConstraintConflicts(rules, featureDefinitions, values);
    constraintConflicts.forEach((item) => {
      conflict(item.feature, item.ruleIds);
      rollback(item.feature);
    });
    const proposals = getProposals(false);
    for (const item of issues.values())
      if ([...changes.values()].some((change) => change.feature === item.feature))
        rollback(item.feature);
    const grouped = new Map<string, SimulationProposal[]>();
    for (const proposal of proposals) {
      const code = proposal.feature.code;
      const entries = grouped.get(code) ?? [];
      entries.push(proposal);
      grouped.set(code, entries);
    }
    for (const [code, allEntries] of grouped) {
      if (constraintConflicts.some((entry) => entry.feature === code)) continue;
      const current = values.get(code);
      const entries = allEntries;
      if (!entries.length) continue;
      const feature = entries[0].feature;
      const assignments = entries.filter(({ action }) => !["ADD", "REMOVE"].includes(action.type));
      const distinctAssignments = new Map(
        assignments.map((entry) => [
          JSON.stringify(
            feature.dataType === "Multi Enumeration"
              ? (Array.isArray(entry.value) ? entry.value : [entry.value]).map(String).sort()
              : entry.value
          ),
          entry.value
        ])
      );
      if (distinctAssignments.size > 1) {
        conflict(
          code,
          entries.map((entry) => entry.rule.id)
        );
        rollback(code);
        continue;
      }
      let next: unknown =
        assignments.length && feature.dataType === "Multi Enumeration"
          ? (Array.isArray(assignments[0].value)
              ? assignments[0].value
              : [assignments[0].value]
            ).map(String)
          : (assignments[0]?.value ?? current);
      const componentActions = entries.filter(({ action }) =>
        ["ADD", "REMOVE"].includes(action.type)
      );
      if (componentActions.length && feature.dataType === "Multi Enumeration") {
        const additions = new Set(
          componentActions
            .filter(({ action }) => action.type === "ADD")
            .map(({ value }) => String(value))
        );
        const removals = new Set(
          componentActions
            .filter(({ action }) => action.type === "REMOVE")
            .map(({ value }) => String(value))
        );
        if ([...additions].some((value) => removals.has(value))) {
          conflict(
            code,
            entries.map((entry) => entry.rule.id)
          );
          rollback(code);
          continue;
        }
        const selected = Array.isArray(next)
          ? next.map(String)
          : isPreviewValueSet(next)
            ? [String(next)]
            : [];
        const updated = selected.filter((value) => !removals.has(value));
        additions.forEach((value) => {
          if (!updated.includes(value)) updated.push(value);
        });
        if (assignments.length && JSON.stringify(updated) !== JSON.stringify(selected)) {
          conflict(
            code,
            entries.map((entry) => entry.rule.id)
          );
          rollback(code);
          continue;
        }
        next = updated;
      } else if (componentActions.length && feature.dataType === "Boolean") {
        const componentValues = new Set(
          componentActions.map(({ action }) => action.type === "ADD")
        );
        if (
          componentValues.size > 1 ||
          (assignments.length && assignments[0].value !== [...componentValues][0])
        ) {
          conflict(
            code,
            entries.map((entry) => entry.rule.id)
          );
          rollback(code);
          continue;
        }
        next = [...componentValues][0];
      } else if (componentActions.length) {
        entries.forEach(({ rule }) =>
          issue(
            rule,
            code,
            "INVALID_COMPONENT_ACTION",
            "Component action requires a Boolean or multi-select feature"
          )
        );
        continue;
      }
      const nextValues = Array.isArray(next) ? next : [next];
      const invalid = nextValues.flatMap((value) =>
        isLiteral(value) ? validateFeatureValue(feature, value) : ["Invalid automatic value"]
      );
      if (
        feature.dataType === "Multi Enumeration" &&
        Array.isArray(next) &&
        (next.length > feature.maxSelections ||
          (next.length > 0 && next.length < feature.minSelections))
      )
        invalid.push("Selection count is outside the feature domain");
      if (invalid.length) {
        entries.forEach(({ rule }) => issue(rule, code, "VALUE_NOT_ALLOWED", invalid.join("; ")));
        rollback(code);
        continue;
      }
      const candidateValues = new Map(values).set(code, next);
      const conflictingEffects = activeConstraintEffects(
        rules,
        featureDefinitions,
        candidateValues
      ).filter((effect) => {
        if (
          !["REQUIRE", "EXCLUDE", "RESTRICT"].includes(effect.type) ||
          effect.status !== "conflict" ||
          !collectConstraintPredicates(effect.target).some(
            (predicate) => predicate.feature === code
          )
        )
          return false;
        if (
          feature.dataType === "Multi Enumeration" &&
          effect.type === "REQUIRE" &&
          !assignments.length &&
          componentActions.length
        ) {
          const required = constraintCandidateValues(effect, feature);
          const removed = new Set(
            componentActions
              .filter(({ action }) => action.type === "REMOVE")
              .map(({ value }) => String(value))
          );
          const added = new Set(
            componentActions
              .filter(({ action }) => action.type === "ADD")
              .map(({ value }) => String(value))
          );
          if (
            required &&
            [...required].some(
              (option) =>
                !removed.has(option) && (added.has(option) || added.size < feature.maxSelections)
            )
          )
            return false;
        }
        return true;
      });
      if (conflictingEffects.length) {
        conflict(code, [
          ...entries.map((entry) => entry.rule.id),
          ...conflictingEffects.map((effect) => effect.ruleId)
        ]);
        rollback(code);
        continue;
      }
      if (JSON.stringify(current) === JSON.stringify(next)) continue;
      values.set(code, next);
      changed = true;
      for (const entry of entries)
        changes.set(JSON.stringify([entry.rule.id, code, entry.action.type]), {
          ruleId: entry.rule.id,
          code: entry.rule.code,
          name: entry.rule.name,
          feature: code,
          type: entry.action.type,
          value: structuredClone(next),
          previousValue: structuredClone(inputValues.get(code)),
          condition: structuredClone(entry.rule.ast.condition),
          ...(entry.action.derivation
            ? { derivation: structuredClone(entry.action.derivation) }
            : {})
        });
    }
    if (!changed) {
      settled = true;
      break;
    }
  }
  if (!settled) {
    const proposal = getProposals(false)[0];
    if (proposal)
      issue(
        proposal.rule,
        proposal.feature.code,
        "AUTOMATIC_CYCLE",
        "Automatic actions did not converge"
      );
    values.clear();
    inputValues.forEach((value, code) => values.set(code, value));
    changes.clear();
  }
  detectConstraintConflicts(rules, featureDefinitions, values).forEach((item) =>
    conflict(item.feature, item.ruleIds)
  );
  const recommendations = getProposals(true).map(({ rule, action, feature, value }) => ({
    ruleId: rule.id,
    code: rule.code,
    name: rule.name,
    feature: feature.code,
    type: action.type,
    value,
    previousValue: values.get(feature.code),
    condition: structuredClone(rule.ast.condition)
  }));
  return {
    values,
    changes: [...changes.values()],
    recommendations,
    conflicts: [...conflicts.values()],
    issues: [...issues.values()]
  };
}

export function previewConstraintRules(
  rules: ConstraintRule[],
  featureDefinitions: FeatureDefinition[],
  values: ReadonlyMap<string, unknown>
): ConstraintRulePreview[] {
  const features = new Map(featureDefinitions.map((feature) => [feature.code, feature]));
  return rules.map((rule) => {
    const condition = evaluatePreviewExpression(rule.ast.condition, features, values);
    const actions: ConstraintActionPreview[] =
      condition === true
        ? rule.ast.actions.map((action) => previewAction(action, features, values))
        : [];
    return {
      ruleId: rule.id,
      code: rule.code,
      name: rule.name,
      description: rule.description,
      status: previewStatusForRule(condition, actions),
      actions
    };
  });
}

export function buildConstraintRuleSamples(
  samples: ConstraintRuleInput[],
  features: FeatureDefinition[]
): ConstraintRule[] {
  const codes = new Set(features.map((feature) => feature.code));
  const rules = samples
    .filter((sample) => {
      const referenced = [
        ...collectConstraintPredicates(sample.ast.condition),
        ...sample.ast.actions.flatMap((action) => collectConstraintPredicates(action.target))
      ];
      return referenced.every((item) => codes.has(item.feature));
    })
    .map((sample) => createConstraintRule(sample));
  return rules.filter(
    (rule) =>
      !validateConstraintRule(rule, rules, features).some((issue) => issue.severity === "Error")
  );
}
