import type { DataType, FeatureDefinition } from "./configuration";

export type ConstraintRuleType = "REQUIRES" | "EXCLUDES" | "IMPLIES" | "DERIVE";
export type ConstraintActionType = "REQUIRE" | "EXCLUDE" | "SET" | "RESTRICT" | "DERIVE";
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
  | "ENDS_WITH";

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

export interface ConstraintAction {
  type: ConstraintActionType;
  target: ConstraintExpression;
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
  ENDS_WITH: "ENDS WITH"
};

const actionTypes = new Set<ConstraintActionType>([
  "REQUIRE",
  "EXCLUDE",
  "SET",
  "RESTRICT",
  "DERIVE"
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
  "ENDS_WITH"
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isLiteral(value: unknown): value is ConstraintLiteral {
  return typeof value === "string" || typeof value === "number" || typeof value === "boolean";
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
      isConstraintExpression(action.target)
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
    const value = Array.isArray(expression.value)
      ? `(${expression.value.map(formatLiteral).join(", ")})`
      : formatLiteral(expression.value);
    text = `${expression.feature} ${operatorSymbols[expression.type]} ${value}`;
  } else {
    text = "";
  }
  return conditionPrecedence(expression) < parentPrecedence ? `(${text})` : text;
}

export function formatConstraintCondition(expression: ConstraintExpression): string {
  return formatCondition(expression);
}

export function formatConstraintExpression(ast: ConstraintRuleAst): string {
  const actions = ast.actions
    .map((action) => `${action.type} ${formatCondition(action.target)}`)
    .join(" AND ");
  return `WHEN ${formatCondition(ast.condition)} THEN ${actions}`;
}

interface Token {
  value: string;
  position: number;
}

const tokenPattern =
  /\s*(=>|:=|>=|<=|!=|==|>|<|\(|\)|,|;|STARTS\s+WITH\b|ENDS\s+WITH\b|NOT\s+IN\b|WHEN\b|THEN\b|REQUIRES\b|EXCLUDES\b|IMPLIES\b|REQUIRE\b|EXCLUDE\b|RESTRICT\b|DERIVE\b|SET\b|AND\b|OR\b|NOT\b|CONTAINS\b|IN\b|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|-?\d+(?:\.\d+)?|true\b|false\b|[A-Za-z_][A-Za-z0-9_]*)/iy;

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
  const targetPredicates = collectPredicates(target);
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
      if (!action || !actionTypes.has(action))
        throw new Error("THEN 后必须包含 REQUIRE、EXCLUDE、SET、RESTRICT 或 DERIVE 动作");
      actions.push({ type: action, target: this.parseOr() });
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
    const operatorToken = this.take()?.value.toUpperCase();
    const operator = this.parseOperator(operatorToken);
    if (!operator) throw new Error(`Feature ${feature.value} 后缺少有效操作符`);
    const value =
      operator === "IN" || operator === "NOT_IN" ? this.parseValueList() : this.parseLiteral();
    return { type: operator, feature: feature.value, value };
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
      "ENDS WITH": "ENDS_WITH"
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
    if (/^-?\d+(?:\.\d+)?$/.test(token.value)) return Number(token.value);
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

  private peek(): Token | undefined {
    return this.tokens[this.index];
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

function collectPredicates(expression: ConstraintExpression): ConstraintPredicate[] {
  if ("expressions" in expression) return expression.expressions.flatMap(collectPredicates);
  if ("expression" in expression) return collectPredicates(expression.expression);
  return [expression];
}

export function constraintOperatorsFor(
  dataType: DataType,
  actionType?: ConstraintActionType
): ConstraintOperator[] {
  if (actionType === "SET" || actionType === "DERIVE") return ["EQUALS"];
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
    allowed = ["EQUALS", "NOT_EQUALS", "IN", "NOT_IN", "CONTAINS"];
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
  for (const predicate of collectPredicates(expression)) {
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
    if (Array.isArray(predicate.value) && predicate.type !== "IN" && predicate.type !== "NOT_IN") {
      issues.push({
        severity: "Error",
        code: "LIST_OPERATOR_REQUIRED",
        feature: feature.code,
        message: "A list of values requires the IN or NOT IN operator"
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
  for (const action of rule.ast.actions)
    validateExpression(action.target, featureByCode, issues, action.type);

  const edges = new Map<string, Set<string>>();
  for (const existing of [...rules.filter((item) => item.id !== rule.id), rule]) {
    const sources = collectPredicates(existing.ast.condition).map((predicate) => predicate.feature);
    const targets = existing.ast.actions.flatMap((action) =>
      collectPredicates(action.target).map((predicate) => predicate.feature)
    );
    for (const source of sources) {
      const outgoing = edges.get(source) ?? new Set<string>();
      targets.forEach((target) => outgoing.add(target));
      edges.set(source, outgoing);
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

function predicate(
  type: ConstraintOperator,
  feature: string,
  value: ConstraintLiteral | ConstraintLiteral[]
): ConstraintPredicate {
  return { type, feature, value };
}

export function createConstraintRuleSamples(features: FeatureDefinition[]): ConstraintRule[] {
  const codes = new Set(features.map((feature) => feature.code));
  const samples: Array<Parameters<typeof createConstraintRule>[0]> = [
    {
      id: "rule-sunroof-interior",
      code: "CR-001",
      name: "全景天窗内饰约束",
      description: "选择全景天窗时必须使用高级内饰。",
      ast: {
        condition: predicate("EQUALS", "SUNROOF_TYPE", "PANORAMIC"),
        actions: [{ type: "REQUIRE", target: predicate("EQUALS", "INTERIOR_PACKAGE", "PREMIUM") }]
      }
    },
    {
      id: "rule-sunroof-roof-rack",
      code: "CR-002",
      name: "天窗与行李架互斥",
      description: "全景天窗不能搭配 B 型车顶行李架。",
      ast: {
        condition: predicate("EQUALS", "SUNROOF_TYPE", "PANORAMIC"),
        actions: [{ type: "EXCLUDE", target: predicate("EQUALS", "ROOF_RACK", "TYPE_B") }]
      }
    },
    {
      id: "rule-awd-battery",
      code: "CR-003",
      name: "四驱电池容量要求",
      description: "全轮驱动车型至少需要 80 kWh 电池容量。",
      ast: {
        condition: predicate("EQUALS", "DRIVE_TYPE", "AWD"),
        actions: [
          { type: "RESTRICT", target: predicate("GREATER_THAN_OR_EQUAL", "BATTERY_CAPACITY", 80) }
        ]
      }
    },
    {
      id: "rule-winter-kit",
      code: "CR-004",
      name: "冬季套件",
      description: "选择冬季套件时需要加热方向盘和加热座椅。",
      ast: {
        condition: predicate("EQUALS", "WINTER_PACKAGE", true),
        actions: [
          { type: "REQUIRE", target: predicate("EQUALS", "HEATED_STEERING", true) },
          { type: "REQUIRE", target: predicate("EQUALS", "HEATED_SEAT", true) }
        ]
      }
    },
    {
      id: "rule-complex-market",
      code: "CR-005",
      name: "高配市场组合约束",
      description: "Premium 车型在非日本市场可使用 AWD 或 4WD。",
      ast: {
        condition: {
          type: "AND",
          expressions: [
            predicate("EQUALS", "TRIM_LEVEL", "PREMIUM"),
            {
              type: "NOT",
              expression: {
                type: "OR",
                expressions: [
                  predicate("EQUALS", "VEHICLE_REGION", "JAPAN"),
                  predicate("EQUALS", "ROOF_RACK", "TYPE_B")
                ]
              }
            }
          ]
        },
        actions: [
          {
            type: "REQUIRE",
            target: {
              type: "IN",
              feature: "DRIVE_TYPE",
              value: ["AWD", "4WD"]
            }
          }
        ]
      }
    }
  ];
  const rules = samples
    .filter((sample) => {
      const referenced = [
        ...collectPredicates(sample.ast.condition),
        ...sample.ast.actions.flatMap((action) => collectPredicates(action.target))
      ];
      return referenced.every((item) => codes.has(item.feature));
    })
    .map((sample) => createConstraintRule(sample));
  return rules.filter(
    (rule) =>
      !validateConstraintRule(rule, rules, features).some((issue) => issue.severity === "Error")
  );
}
