import {
  createConstraintRuleSamples,
  formatConstraintExpression,
  isConstraintRuleAst,
  isLegacyConstraintRuleAst,
  migrateLegacyConstraintRuleAst,
  validateConstraintRule
} from "../model/constraintRules";
import type {
  ConstraintRule,
  ConstraintRuleSource,
  ConstraintRuleStatus
} from "../model/constraintRules";
import type { FeatureDefinition } from "../model/configuration";

interface PersistedConstraintRules {
  schemaVersion: 2;
  contexts: Record<string, ConstraintRule[]>;
}

interface LegacyPersistedConstraintRules {
  schemaVersion: 1;
  contexts: Record<string, unknown[]>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isContextMap(value: unknown): value is Record<string, unknown[]> {
  return isRecord(value) && Object.values(value).every((rules) => Array.isArray(rules));
}

function parsePersistedRules(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new Error("本地约束规则数据无法解析", { cause: error });
  }
}

function normalizeRule(value: unknown): ConstraintRule {
  if (!isRecord(value)) throw new Error("本地约束规则记录格式无效");
  const ast = isConstraintRuleAst(value.ast)
    ? structuredClone(value.ast)
    : isLegacyConstraintRuleAst(value.ast)
      ? migrateLegacyConstraintRuleAst(value.ast)
      : undefined;
  if (!ast) throw new Error(`规则 ${String(value.code ?? "")} 的 Constraint AST 格式不受支持`);
  if (
    typeof value.id !== "string" ||
    typeof value.code !== "string" ||
    typeof value.name !== "string"
  )
    throw new Error("本地约束规则缺少 ID、编码或名称");
  const status: ConstraintRuleStatus =
    value.status === "Valid" || value.status === "Invalid" ? value.status : "Draft";
  const rawSource = isRecord(value.source) ? value.source : {};
  const sourceType: ConstraintRuleSource =
    rawSource.type === "AI" || rawSource.type === "BLUEPRINT" ? rawSource.type : "MANUAL";
  const rawBlueprint = isRecord(value.blueprint) ? value.blueprint : {};
  const positions = isRecord(rawBlueprint.positions)
    ? (rawBlueprint.positions as ConstraintRule["blueprint"]["positions"])
    : {};
  return {
    id: value.id,
    code: value.code,
    name: value.name,
    description: typeof value.description === "string" ? value.description : "",
    status,
    expression: formatConstraintExpression(ast),
    ast,
    blueprint: { positions },
    source: {
      type: sourceType,
      ...(typeof rawSource.prompt === "string" ? { prompt: rawSource.prompt } : {})
    },
    createdBy: typeof value.createdBy === "string" ? value.createdBy : "Configuration Engineer",
    modifiedAt: typeof value.modifiedAt === "string" ? value.modifiedAt : new Date().toISOString(),
    version:
      typeof value.version === "number" && Number.isInteger(value.version) ? value.version : 1
  };
}

function isPersistedConstraintRules(value: unknown): value is PersistedConstraintRules {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const candidate = value as { schemaVersion?: unknown; contexts?: unknown };
  if (candidate.schemaVersion !== 2 || !isContextMap(candidate.contexts)) return false;
  return true;
}

function isLegacyPersistedConstraintRules(value: unknown): value is LegacyPersistedConstraintRules {
  return isRecord(value) && value.schemaVersion === 1 && isContextMap(value.contexts);
}

export interface ConstraintRuleStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

const STORAGE_KEY = "plm.configuration-constraint-rules.v2";
const LEGACY_STORAGE_KEY = "plm.configuration-constraint-rules.v1";

export class ConstraintRuleRepository {
  private readonly storage?: ConstraintRuleStorage;
  private readonly storageFailure?: unknown;

  public constructor(storage?: ConstraintRuleStorage) {
    if (storage) {
      this.storage = storage;
      return;
    }
    try {
      this.storage = globalThis.localStorage;
    } catch (error) {
      this.storageFailure = error;
    }
  }

  public list(contextId: string, features: FeatureDefinition[]): ConstraintRule[] {
    const stored = this.read().contexts[contextId];
    if (stored) return structuredClone(stored);
    return createConstraintRuleSamples(features);
  }

  public save(
    contextId: string,
    rule: ConstraintRule,
    features: FeatureDefinition[]
  ): ConstraintRule {
    const [saved] = this.saveMany(contextId, [rule], features);
    if (!saved) throw new Error("No constraint rule was saved");
    return saved;
  }

  public saveMany(
    contextId: string,
    candidates: ConstraintRule[],
    features: FeatureDefinition[]
  ): ConstraintRule[] {
    if (!candidates.length) return [];
    const current = this.list(contextId, features);
    const candidateIds = new Set<string>();
    const normalized: ConstraintRule[] = candidates.map((rule) => {
      if (candidateIds.has(rule.id)) throw new Error(`Duplicate rule ID ${rule.id}`);
      candidateIds.add(rule.id);
      const existing = current.find((item) => item.id === rule.id);
      return {
        ...structuredClone(rule),
        expression: formatConstraintExpression(rule.ast),
        status: "Draft",
        version: existing ? existing.version + 1 : Math.max(1, rule.version),
        modifiedAt: new Date().toISOString()
      };
    });
    const rules = [...current.filter((item) => !candidateIds.has(item.id)), ...normalized];
    const codes = new Set<string>();
    for (const rule of rules) {
      const code = rule.code.toLocaleLowerCase();
      if (codes.has(code)) throw new Error(`规则编码 ${rule.code} 已存在`);
      codes.add(code);
    }

    for (const rule of normalized) {
      const errors = validateConstraintRule(rule, rules, features).filter(
        (issue) => issue.severity === "Error"
      );
      if (errors.length) throw new Error(errors.map((issue) => issue.message).join("\n"));
      rule.status = "Valid";
    }

    this.writeContext(contextId, rules);
    return structuredClone(normalized);
  }

  public remove(contextId: string, ruleId: string, features: FeatureDefinition[]): void {
    this.writeContext(
      contextId,
      this.list(contextId, features).filter((rule) => rule.id !== ruleId)
    );
  }

  private read(): PersistedConstraintRules {
    const raw = this.storage?.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = parsePersistedRules(raw);
      if (!isPersistedConstraintRules(parsed)) throw new Error("本地约束规则数据格式不受支持");
      return {
        schemaVersion: 2,
        contexts: Object.fromEntries(
          Object.entries(parsed.contexts).map(([contextId, rules]) => [
            contextId,
            rules.map(normalizeRule)
          ])
        )
      };
    }
    const legacyRaw = this.storage?.getItem(LEGACY_STORAGE_KEY);
    if (!legacyRaw) return { schemaVersion: 2, contexts: {} };
    const legacy = parsePersistedRules(legacyRaw);
    if (!isLegacyPersistedConstraintRules(legacy))
      throw new Error("旧版本地约束规则数据格式不受支持");
    return {
      schemaVersion: 2,
      contexts: Object.fromEntries(
        Object.entries(legacy.contexts).map(([contextId, rules]) => [
          contextId,
          rules.map(normalizeRule)
        ])
      )
    };
  }

  private writeContext(contextId: string, rules: ConstraintRule[]): void {
    if (!this.storage) {
      const detail = this.storageFailure ? `：${String(this.storageFailure)}` : "";
      throw new Error(`当前环境无法访问浏览器本地存储，约束规则未保存${detail}`);
    }
    const state = this.read();
    state.contexts[contextId] = structuredClone(rules);
    this.storage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
}
