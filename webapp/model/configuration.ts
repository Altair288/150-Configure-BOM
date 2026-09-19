/** Configuration vocabulary only. Definitions are immutable once referenced at a version. */
export type Dimension = "Marketing" | "Engineering" | "Common";
export type DataType =
  | "Boolean"
  | "String"
  | "Integer"
  | "Decimal"
  | "Date"
  | "DateTime"
  | "Enumeration"
  | "Multi Enumeration"
  | "Range"
  | "Reference";
export const dataTypes: DataType[] = [
  "Boolean",
  "String",
  "Integer",
  "Decimal",
  "Date",
  "DateTime",
  "Enumeration",
  "Multi Enumeration",
  "Range",
  "Reference"
];
export const dimensions: Dimension[] = ["Marketing", "Engineering", "Common"];
export interface Named {
  id: string;
  code: string;
  name: string;
  description: string;
}
export interface ConfigurationContext extends Named {
  category: string;
  productFamilyId: string;
  profileId: string;
  status: "Draft" | "Released" | "Inactive";
  version: number;
  owner: string;
  organization: string;
  createdBy: string;
  createdDate: string;
  modified: string;
}
export type ProductFamily = Named;
export interface ProductModel extends Named {
  familyId: string;
  group: string;
  productType: string;
  market: string;
  status: string;
}
export interface ProductModelGroup extends Named {
  familyId: string;
  sort: number;
}
export interface ConfigurationProfile extends Named {
  configurationMode: string;
  featureSourceMode: string;
  featureStructureMode: string;
  defaultBehavior: string;
  allowMulti: boolean;
  allowRange: boolean;
  allowText: boolean;
}
export interface FeatureGroup extends Named {
  contextId: string;
  dimension: Dimension;
  sort: number;
}
export interface FeatureFamily extends Named {
  groupId: string;
  displayName: string;
  businessQuestion: string;
  dimension: Dimension;
  selectionMode: "Single" | "Multiple" | "Value Input";
  mandatory: boolean;
  sourceType: "Local" | "Enterprise Library";
  sort: number;
  active: boolean;
  minSelections: number;
  maxSelections: number;
}
export interface FeatureValue {
  id: string;
  code: string;
  value: string;
  description: string;
  sort: number;
  defaultValue: boolean;
  active: boolean;
}
export interface ValueDomain {
  values: FeatureValue[];
  minimum?: number;
  maximum?: number;
  step?: number;
  maxLength?: number;
  pattern?: string;
  minimumDate?: string;
  maximumDate?: string;
  referenceTarget?: string;
}
export interface FeatureDefinition extends Named {
  version: number;
  sourceType: "Local" | "Enterprise Library";
  dimension: Dimension;
  dataType: DataType;
  kind: "Choice" | "Characteristic";
  unit: string;
  selectionType: string;
  mandatory: boolean;
  defaultValue: string;
  minSelections: number;
  maxSelections: number;
  active: boolean;
  domain: ValueDomain;
  modified: string;
}
export interface FeatureReference {
  id: string;
  familyId: string;
  featureDefinitionId: string;
  definitionVersion: number;
}
export interface ContextRevision {
  contextId: string;
  version: number;
  date: string;
  action: string;
  snapshot: string;
}
export interface ConfigurationStore {
  schemaVersion: 1;
  contexts: ConfigurationContext[];
  productFamilies: ProductFamily[];
  products: ProductModel[];
  /** Optional for backward compatibility with v1 workspaces created before groups were persisted. */
  productGroups?: ProductModelGroup[];
  profiles: ConfigurationProfile[];
  groups: FeatureGroup[];
  families: FeatureFamily[];
  definitions: FeatureDefinition[];
  references: FeatureReference[];
  revisions: ContextRevision[];
}
export const storageKey = "plm.configuration-vocabulary.v1";
export const uid = (prefix: string): string => `${prefix}-${crypto.randomUUID()}`;
export const today = (): string => new Date().toISOString().slice(0, 10);
export function resolveDefinition(
  store: ConfigurationStore,
  ref: FeatureReference
): FeatureDefinition {
  const definition = store.definitions.find(
    (d) => d.id === ref.featureDefinitionId && d.version === ref.definitionVersion
  );
  if (!definition) throw new Error("特征引用的定义版本不存在");
  return definition;
}
export function latestDefinitions(store: ConfigurationStore): FeatureDefinition[] {
  return store.definitions.filter(
    (d) => !store.definitions.some((other) => other.id === d.id && other.version > d.version)
  );
}
export function contextReferences(
  store: ConfigurationStore,
  contextId: string
): FeatureReference[] {
  const groups = new Set(store.groups.filter((g) => g.contextId === contextId).map((g) => g.id));
  const families = new Set(store.families.filter((f) => groups.has(f.groupId)).map((f) => f.id));
  return store.references.filter((r) => families.has(r.familyId));
}
export function definitionUsage(store: ConfigurationStore, id: string): ConfigurationContext[] {
  return store.contexts.filter((c) =>
    contextReferences(store, c.id).some((r) => r.featureDefinitionId === id)
  );
}
function validDate(text: string, dateTime: boolean): boolean {
  if (!(dateTime ? /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/ : /^\d{4}-\d{2}-\d{2}$/).test(text))
    return false;
  const [year, month, day] = text.slice(0, 10).split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day &&
    !Number.isNaN(Date.parse(text))
  );
}
export function validateDefinition(d: FeatureDefinition): string[] {
  const errors: string[] = [];
  if (!d.code?.trim() || !d.name?.trim()) errors.push("名称和编码不能为空");
  if (!dataTypes.includes(d.dataType)) errors.push("不支持的数据类型");
  if (!dimensions.includes(d.dimension)) errors.push("请选择有效维度");
  if (!Number.isInteger(d.version) || d.version < 1) errors.push("版本必须是正整数");
  if (!["Local", "Enterprise Library"].includes(d.sourceType)) errors.push("特征来源无效");
  if (!["Choice", "Characteristic"].includes(d.kind)) errors.push("特征模式无效");
  if (typeof d.active !== "boolean" || typeof d.mandatory !== "boolean")
    errors.push("Active / Mandatory 必须为布尔值");
  const selection =
    d.dataType === "Boolean"
      ? "Boolean Selection"
      : d.dataType === "Multi Enumeration"
        ? "Multi Selection"
        : ["Enumeration", "Reference"].includes(d.dataType)
          ? "Single Selection"
          : d.dataType === "Range"
            ? "Range Input"
            : "Free Input";
  if (d.selectionType !== selection) errors.push(`${d.dataType} 应使用 ${selection}`);
  if (d.kind === "Choice" && d.dataType !== "Enumeration")
    errors.push("Choice 模式使用 Enumeration 值");
  if (d.kind === "Choice" && d.defaultValue && d.defaultValue !== d.code)
    errors.push("Choice 的默认值需填写其自身编码，留空表示不默认选中");
  if (!d.domain || !Array.isArray(d.domain.values)) return [...errors, "值域格式错误"];
  const { minimum, maximum, step, maxLength, pattern, minimumDate, maximumDate } = d.domain;
  if ([minimum, maximum, step, maxLength].some((n) => n !== undefined && !Number.isFinite(n)))
    errors.push("数值必须是有限数字");
  if (minimum !== undefined && maximum !== undefined && minimum > maximum)
    errors.push("最小值不能大于最大值");
  if (step !== undefined && step <= 0) errors.push("步长必须大于 0");
  if (maxLength !== undefined && (!Number.isInteger(maxLength) || maxLength < 1))
    errors.push("最大长度必须为正整数");
  if (
    d.dataType === "Integer" &&
    [minimum, maximum, step].some((n) => n !== undefined && !Number.isInteger(n))
  )
    errors.push("Integer 的边界和步长必须为整数");
  if (pattern) {
    try {
      new RegExp(pattern);
    } catch {
      errors.push("字符串格式表达式无效");
    }
  }
  if (minimumDate && maximumDate && minimumDate > maximumDate)
    errors.push("起始日期不能晚于结束日期");
  if (
    [minimumDate, maximumDate].some(
      (value) => value && !validDate(value, d.dataType === "DateTime")
    )
  )
    errors.push("日期边界格式无效");
  if (
    !Number.isInteger(d.minSelections) ||
    !Number.isInteger(d.maxSelections) ||
    d.minSelections < 0 ||
    d.maxSelections < Math.max(1, d.minSelections)
  )
    errors.push("选择数量范围无效");
  const codes = d.domain.values.map((v) => v.code.trim().toUpperCase());
  if (codes.some((c) => !c) || new Set(codes).size !== codes.length)
    errors.push("允许值编码不能为空或重复");
  if (d.domain.values.some((v) => !v.value.trim())) errors.push("允许值显示名称不能为空");
  if (d.domain.values.some((v) => !Number.isInteger(v.sort) || v.sort < 0))
    errors.push("Sequence 必须为非负整数");
  if (d.domain.values.some((v) => v.defaultValue && !v.active)) errors.push("停用值不能作为默认值");
  if (d.dataType === "Enumeration" && d.domain.values.filter((v) => v.defaultValue).length > 1)
    errors.push("单选值域只能有一个默认值");
  if (d.defaultValue && d.kind !== "Choice")
    errors.push(
      ...validateValue(
        d,
        d.dataType === "Multi Enumeration"
          ? d.defaultValue.split(",").map((v) => v.trim())
          : d.defaultValue,
        false
      )
    );
  const defaults = d.domain.values.filter((v) => v.defaultValue);
  if (
    d.dataType === "Multi Enumeration" &&
    defaults.length &&
    (defaults.length < d.minSelections || defaults.length > d.maxSelections)
  )
    errors.push("默认值数量超出选择范围");
  return errors;
}
/** Checks only the value's own domain, never relationships between features. */
export function validateValue(
  d: FeatureDefinition,
  value: unknown,
  mandatory = d.mandatory
): string[] {
  if (
    value === undefined ||
    value === "" ||
    value === null ||
    (Array.isArray(value) && !value.length)
  )
    return mandatory ? ["此项为必填项"] : [];
  const text = String(value);
  if (d.dataType === "Boolean")
    return [true, false, "true", "false"].includes(value as boolean | string)
      ? []
      : ["请选择 Yes 或 No"];
  if (["Enumeration", "Multi Enumeration", "Reference"].includes(d.dataType)) {
    const values = Array.isArray(value) ? value : [text];
    const allowed = d.domain.values.filter((v) => v.active).map((v) => v.code);
    if (values.some((v) => !allowed.includes(String(v)))) return ["包含不在允许值域中的值"];
    if (
      d.dataType === "Multi Enumeration" &&
      (values.length < d.minSelections || values.length > d.maxSelections)
    )
      return [`请选择 ${d.minSelections}–${d.maxSelections} 项`];
    return [];
  }
  if (["Integer", "Decimal", "Range"].includes(d.dataType)) {
    const entries = d.dataType === "Range" ? text.split("~").map((s) => s.trim()) : [text];
    if (d.dataType === "Range" && entries.length !== 2) return ["请输入 起始值 ~ 结束值"];
    const numbers = entries.map(Number);
    if (entries.some((s) => !s) || numbers.some((n) => !Number.isFinite(n)))
      return ["请输入有效数字"];
    if (d.dataType === "Integer" && numbers.some((n) => !Number.isInteger(n)))
      return ["请输入整数"];
    if (numbers.length === 2 && numbers[0] > numbers[1]) return ["范围起始值不能大于结束值"];
    if (
      numbers.some(
        (n) =>
          (d.domain.minimum !== undefined && n < d.domain.minimum) ||
          (d.domain.maximum !== undefined && n > d.domain.maximum)
      )
    )
      return ["超出允许的数值范围"];
    const step = d.domain.step;
    if (
      step &&
      numbers.some(
        (n) =>
          Math.abs(
            (n - (d.domain.minimum ?? 0)) / step - Math.round((n - (d.domain.minimum ?? 0)) / step)
          ) > 1e-7
      )
    )
      return [`数值需符合步长 ${step}`];
  }
  if (d.dataType === "String") {
    if (d.domain.maxLength && text.length > d.domain.maxLength)
      return [`最多 ${d.domain.maxLength} 个字符`];
    if (d.domain.pattern && !new RegExp(d.domain.pattern).test(text))
      return ["不符合字符串格式要求"];
  }
  if (["Date", "DateTime"].includes(d.dataType)) {
    if (!validDate(text, d.dataType === "DateTime")) return ["日期格式无效"];
    if (
      (d.domain.minimumDate && text < d.domain.minimumDate) ||
      (d.domain.maximumDate && text > d.domain.maximumDate)
    )
      return ["日期超出允许范围"];
  }
  return [];
}
export function validateStore(s: ConfigurationStore): string[] {
  const errors: string[] = [];
  if (!s || s.schemaVersion !== 1) return ["不支持的工作区文件版本"];
  for (const key of [
    "contexts",
    "productFamilies",
    "products",
    "profiles",
    "groups",
    "families",
    "definitions",
    "references",
    "revisions"
  ] as const) {
    if (!Array.isArray(s[key])) return [`缺少 ${key} 数据集合`];
  }
  const stringFields: [unknown[], string[]][] = [
    [
      s.contexts,
      [
        "id",
        "code",
        "name",
        "description",
        "category",
        "productFamilyId",
        "profileId",
        "owner",
        "organization",
        "createdBy",
        "createdDate",
        "modified"
      ]
    ],
    [s.productFamilies, ["id", "code", "name", "description"]],
    [
      s.products,
      ["id", "code", "name", "description", "familyId", "group", "market", "status", "productType"]
    ],
    [
      s.profiles,
      [
        "id",
        "code",
        "name",
        "description",
        "configurationMode",
        "featureSourceMode",
        "featureStructureMode",
        "defaultBehavior"
      ]
    ],
    [s.groups, ["id", "code", "name", "description", "contextId", "dimension"]],
    [
      s.families,
      [
        "id",
        "code",
        "name",
        "description",
        "groupId",
        "displayName",
        "businessQuestion",
        "dimension",
        "selectionMode",
        "sourceType"
      ]
    ],
    [
      s.definitions,
      [
        "id",
        "code",
        "name",
        "description",
        "sourceType",
        "dimension",
        "dataType",
        "kind",
        "unit",
        "selectionType",
        "defaultValue",
        "modified"
      ]
    ],
    [s.references, ["id", "familyId", "featureDefinitionId"]],
    [s.revisions, ["contextId", "date", "action", "snapshot"]]
  ];
  if (s.productGroups !== undefined) {
    if (!Array.isArray(s.productGroups)) return ["缺少 productGroups 数据集合"];
    stringFields.push([s.productGroups, ["id", "code", "name", "description", "familyId"]]);
  }
  if (
    stringFields.some(([rows, keys]) =>
      rows.some(
        (row) =>
          !row || keys.some((key) => typeof (row as Record<string, unknown>)[key] !== "string")
      )
    )
  )
    return ["对象字段缺失或类型无效"];
  if (
    s.definitions.some(
      (d) =>
        !d.domain ||
        !Array.isArray(d.domain.values) ||
        d.domain.values.some(
          (v) =>
            !v ||
            [v.id, v.code, v.value, v.description].some((x) => typeof x !== "string") ||
            typeof v.active !== "boolean" ||
            typeof v.defaultValue !== "boolean"
        )
    )
  )
    return ["特征值域结构无效"];
  if (!s.contexts.length) errors.push("工作区至少需要一个 Context");
  for (const records of [
    s.contexts,
    s.productFamilies,
    s.products,
    s.profiles,
    s.groups,
    s.families
  ]) {
    const ids = records.map((r) => r.id);
    if (new Set(ids).size !== ids.length) errors.push("存在重复对象 ID");
    if (records.some((r) => !r.id || !r.code?.trim() || !r.name?.trim()))
      errors.push("对象 ID、编码和名称不能为空");
  }
  const uniqueCodes = (records: Named[], label: string): void => {
    if (new Set(records.map((r) => r.code.toUpperCase())).size !== records.length)
      errors.push(`${label}编码重复`);
  };
  uniqueCodes(s.contexts, "Context ");
  uniqueCodes(latestDefinitions(s), "Feature ");
  if (new Set(s.definitions.map((d) => `${d.id}@${d.version}`)).size !== s.definitions.length)
    errors.push("特征定义版本重复");
  for (const c of s.contexts) {
    if (
      !s.productFamilies.some((f) => f.id === c.productFamilyId) ||
      !s.profiles.some((p) => p.id === c.profileId)
    )
      errors.push("Context 缺少产品族或 Profile");
    if (!["Draft", "Released", "Inactive"].includes(c.status)) errors.push("Context 状态无效");
    if (
      ![
        "Automotive",
        "Bicycle",
        "Aircraft",
        "High-speed Rail",
        "Marine",
        "Industrial Equipment",
        "HVAC",
        "Automation",
        "Energy Equipment",
        "Consumer Electronics",
        "Industrial Electronics",
        "Diagnostic Equipment",
        "Surgical Equipment",
        "Earthmoving Equipment",
        "Lifting Equipment"
      ].includes(c.category)
    )
      errors.push("Context 分类无效");
    if (!Number.isInteger(c.version) || c.version < 1) errors.push("Context 版本无效");
    uniqueCodes(
      s.products.filter((p) => p.familyId === c.productFamilyId),
      "Product "
    );
    uniqueCodes(
      s.groups.filter((g) => g.contextId === c.id),
      "Group "
    );
  }
  for (const p of s.products)
    if (!s.productFamilies.some((f) => f.id === p.familyId)) errors.push("产品所属产品族不存在");
  if (s.productGroups) {
    for (const group of s.productGroups) {
      if (!s.productFamilies.some((f) => f.id === group.familyId))
        errors.push("产品模型组所属产品族不存在");
      if (!Number.isInteger(group.sort) || group.sort < 0) errors.push("产品模型组排序无效");
    }
    for (const family of s.productFamilies) {
      uniqueCodes(
        s.productGroups.filter((group) => group.familyId === family.id),
        "Product Model Group "
      );
    }
  }
  for (const g of s.groups) {
    if (!dimensions.includes(g.dimension) || !Number.isInteger(g.sort) || g.sort < 0)
      errors.push("Group 维度或排序无效");
    if (!s.contexts.some((c) => c.id === g.contextId)) errors.push("Group 所属 Context 不存在");
    uniqueCodes(
      s.families.filter((f) => f.groupId === g.id),
      "Family "
    );
  }
  for (const f of s.families) {
    if (
      !dimensions.includes(f.dimension) ||
      !["Single", "Multiple", "Value Input"].includes(f.selectionMode) ||
      !["Local", "Enterprise Library"].includes(f.sourceType) ||
      typeof f.mandatory !== "boolean" ||
      typeof f.active !== "boolean" ||
      !Number.isInteger(f.sort) ||
      f.sort < 0
    )
      errors.push("Family 属性格式无效");
    if (!s.groups.some((g) => g.id === f.groupId)) errors.push("Family 所属 Group 不存在");
    if (!f.businessQuestion?.trim()) errors.push(`${f.name}: 业务问题不能为空`);
    if (
      !Number.isInteger(f.minSelections) ||
      !Number.isInteger(f.maxSelections) ||
      f.minSelections < 0 ||
      f.maxSelections < Math.max(1, f.minSelections)
    )
      errors.push(`${f.name}: 选择数量范围无效`);
  }
  for (const p of s.profiles) {
    if (
      !["Engineering Configuration", "Sales Configuration", "Mixed Configuration"].includes(
        p.configurationMode
      ) ||
      !["Local Features", "Enterprise Feature Library", "Mixed"].includes(p.featureSourceMode) ||
      !["Hierarchical", "Flat"].includes(p.featureStructureMode) ||
      !["No Default", "Allow Default Value", "Auto Select Single Value"].includes(
        p.defaultBehavior
      ) ||
      [p.allowMulti, p.allowRange, p.allowText].some((v) => typeof v !== "boolean")
    )
      errors.push("Profile 行为定义无效");
  }
  for (const d of s.definitions)
    errors.push(...validateDefinition(d).map((e) => `${d.name}: ${e}`));
  if (new Set(s.references.map((r) => r.id)).size !== s.references.length)
    errors.push("引用 ID 重复");
  if (
    new Set(s.references.map((r) => `${r.familyId}/${r.featureDefinitionId}`)).size !==
    s.references.length
  )
    errors.push("同一 Family 不能重复引用同一特征");
  for (const r of s.references) {
    if (!s.families.some((f) => f.id === r.familyId)) errors.push("引用所属 Family 不存在");
    try {
      resolveDefinition(s, r);
    } catch {
      errors.push("引用的特征版本不存在");
    }
  }
  return [...new Set(errors)];
}
/** Release readiness describes vocabulary completeness, not configuration rules. */
export function validateContext(store: ConfigurationStore, contextId: string): string[] {
  const context = store.contexts.find((c) => c.id === contextId);
  if (!context) return ["Context 不存在"];
  const profile = store.profiles.find((p) => p.id === context.profileId)!;
  const groups = store.groups.filter((g) => g.contextId === contextId);
  const families = store.families.filter((f) => f.active && groups.some((g) => g.id === f.groupId));
  const errors: string[] = [];
  if (!store.products.some((p) => p.familyId === context.productFamilyId))
    errors.push("产品范围中至少需要一个产品");
  if (!families.length) errors.push("至少需要一个有效配置问题");
  for (const family of families) {
    const definitions = store.references
      .filter((r) => r.familyId === family.id)
      .map((r) => resolveDefinition(store, r))
      .filter((d) => d.active);
    if (!definitions.length) errors.push(`${family.name}: 尚无有效特征`);
    const choices = definitions.filter((d) => d.kind === "Choice");
    if (choices.length && choices.length !== definitions.length)
      errors.push(`${family.name}: 请将 Choice 与 Typed Characteristic 分开建模`);
    if (choices.length && family.selectionMode === "Value Input")
      errors.push(`${family.name}: Choice 应使用 Single 或 Multiple`);
    if (family.selectionMode === "Single" && choices.filter((d) => d.defaultValue).length > 1)
      errors.push(`${family.name}: 单选问题不能默认选中多个 Choice`);
    if (family.selectionMode === "Multiple" && !profile.allowMulti)
      errors.push(`${family.name}: Profile 不允许多选`);
    for (const d of definitions) {
      if (
        d.kind !== "Choice" &&
        ["Enumeration", "Multi Enumeration", "Reference"].includes(d.dataType) &&
        !d.domain.values.some((v) => v.active)
      )
        errors.push(`${d.name}: 请定义有效的允许值`);
      if (
        (profile.featureSourceMode === "Local Features" && d.sourceType !== "Local") ||
        (profile.featureSourceMode === "Enterprise Feature Library" &&
          d.sourceType !== "Enterprise Library")
      )
        errors.push(`${d.name}: 特征来源与 Profile 不一致`);
      if (
        (!profile.allowMulti && d.dataType === "Multi Enumeration") ||
        (!profile.allowRange && d.dataType === "Range") ||
        (!profile.allowText && d.dataType === "String")
      )
        errors.push(`${d.name}: 输入类型与 Profile 不一致`);
    }
  }
  return errors;
}
export function publishDefinition(
  s: ConfigurationStore,
  definition: FeatureDefinition
): FeatureDefinition {
  const next = structuredClone(definition);
  next.version =
    Math.max(0, ...s.definitions.filter((d) => d.id === next.id).map((d) => d.version)) + 1;
  next.modified = today();
  s.definitions.push(next);
  return next;
}
export function copyContext(
  s: ConfigurationStore,
  sourceId: string,
  code: string,
  name: string
): ConfigurationContext {
  const original = s.contexts.find((c) => c.id === sourceId)!;
  const context = {
    ...structuredClone(original),
    id: uid("ctx"),
    code,
    name,
    version: 1,
    status: "Draft" as const,
    createdDate: today(),
    modified: today()
  };
  const productFamily = {
    ...structuredClone(s.productFamilies.find((f) => f.id === original.productFamilyId)!),
    id: uid("pf"),
    code: `${code}-PF`
  };
  const profile = {
    ...structuredClone(s.profiles.find((p) => p.id === original.profileId)!),
    id: uid("profile"),
    code: `${code}-PROFILE`
  };
  context.productFamilyId = productFamily.id;
  context.profileId = profile.id;
  s.productFamilies.push(productFamily);
  s.profiles.push(profile);
  s.contexts.push(context);
  s.products.push(
    ...s.products
      .filter((p) => p.familyId === original.productFamilyId)
      .map((p) => ({ ...p, id: uid("product"), familyId: productFamily.id }))
  );
  const copiedProductGroups = (s.productGroups ?? [])
    .filter((group) => group.familyId === original.productFamilyId)
    .map((group) => ({ ...group, id: uid("product-group"), familyId: productFamily.id }));
  if (copiedProductGroups.length)
    s.productGroups = [...(s.productGroups ?? []), ...copiedProductGroups];
  const localMap = new Map<string, string>();
  for (const group of s.groups.filter((g) => g.contextId === sourceId)) {
    const groupId = uid("group");
    s.groups.push({ ...group, id: groupId, contextId: context.id });
    for (const family of s.families.filter((f) => f.groupId === group.id)) {
      const familyId = uid("family");
      s.families.push({ ...family, id: familyId, groupId });
      for (const ref of s.references.filter((r) => r.familyId === family.id)) {
        const d = resolveDefinition(s, ref);
        let definitionId = d.id;
        if (d.sourceType === "Local") {
          definitionId = localMap.get(d.id) ?? uid("def");
          if (!localMap.has(d.id))
            s.definitions.push({
              ...structuredClone(d),
              id: definitionId,
              code: `${code}_${d.code}`,
              version: 1
            });
          localMap.set(d.id, definitionId);
        }
        s.references.push({
          ...ref,
          id: uid("ref"),
          familyId,
          featureDefinitionId: definitionId,
          definitionVersion: d.sourceType === "Local" ? 1 : d.version
        });
      }
    }
  }
  return context;
}
export function createSeed(): ConfigurationStore {
  const s: ConfigurationStore = {
    schemaVersion: 1,
    contexts: [],
    productFamilies: [],
    products: [],
    productGroups: [],
    profiles: [],
    groups: [],
    families: [],
    definitions: [],
    references: [],
    revisions: []
  };
  const seeds = [
    ["SUV", "SUV Series", "Automotive"],
    ["SEDAN", "Sedan Series", "Automotive"],
    ["EV", "EV Platform", "Automotive"],
    ["ROAD", "Road Bike", "Bicycle"],
    ["MTB", "MTB", "Bicycle"],
    ["GRAVEL", "Gravel Bike", "Bicycle"],
    ["HVAC", "HVAC", "Industrial Equipment"]
  ];
  for (const [key, name, category] of seeds) {
    s.productFamilies.push({
      id: `pf-${key}`,
      code: `PF-${key}`,
      name,
      description: `${name} 产品族`
    });
    s.profiles.push({
      id: `profile-${key}`,
      code: `PRF-${key}-001`,
      name: `${name} Configuration Profile`,
      description: "产品族配置行为定义",
      configurationMode: "Mixed Configuration",
      featureSourceMode: "Mixed",
      featureStructureMode: "Hierarchical",
      defaultBehavior: "Allow Default Value",
      allowMulti: true,
      allowRange: true,
      allowText: true
    });
    s.contexts.push({
      id: `ctx-${key}`,
      code: `CTX-${key}-001`,
      name: `${name} Configuration`,
      description:
        key === "SUV"
          ? "面向全球市场的 SUV 产品配置边界。统一营销选型与工程特征词汇，支持跨产品族复用。"
          : `${name} 产品范围与配置特征模型`,
      category,
      productFamilyId: `pf-${key}`,
      profileId: `profile-${key}`,
      status: key === "SEDAN" ? "Released" : key === "GRAVEL" ? "Inactive" : "Draft",
      version: 1,
      owner: "Alex Chen",
      organization: "Product Engineering",
      createdBy: "Configuration Admin",
      createdDate: "2026-09-01",
      modified: "2026-09-17"
    });
    const models =
      key === "SUV"
        ? [
            ["Standard CN", "China Market", "CN"],
            ["Premium CN", "China Market", "CN"],
            ["Standard JP", "Japan Market", "JP"],
            ["Premium JP", "Japan Market", "JP"],
            ["Offroad Global", "Global", "Global"],
            ["Luxury Global", "Global", "Global"]
          ]
        : [["Standard", "Global", "Global"]];
    models.forEach(([model, group, market], i) =>
      s.products.push({
        id: `${key}-${i}`,
        familyId: `pf-${key}`,
        code: `${key}-${String(i + 1).padStart(3, "0")}`,
        name: `${key === "SUV" ? key : name} ${model}`,
        group,
        market,
        productType: "Product Model",
        status: "In Development",
        description: "配置目标产品"
      })
    );
    for (const group of [...new Set(models.map(([, group]) => group))]) {
      s.productGroups!.push({
        id: `${key}-group-${group.replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase()}`,
        familyId: `pf-${key}`,
        code: `${key}-${group.replace(/[^a-zA-Z0-9]+/g, "-").toUpperCase()}`,
        name: group,
        description: `${group} 产品模型组`,
        sort: s.productGroups!.filter((item) => item.familyId === `pf-${key}`).length + 1
      });
    }
  }
  const define = (
    code: string,
    name: string,
    type: DataType,
    dimension: Dimension,
    values: string[] = [],
    local = false,
    domain: Partial<ValueDomain> = {},
    unit = ""
  ): FeatureDefinition => {
    const d: FeatureDefinition = {
      id: `def-${code}`,
      code,
      name,
      description: `${name} 的允许值与输入规范`,
      dataType: type,
      dimension,
      sourceType: local ? "Local" : "Enterprise Library",
      version: 1,
      kind: "Characteristic",
      unit,
      selectionType:
        type === "Boolean"
          ? "Boolean Selection"
          : type === "Multi Enumeration"
            ? "Multi Selection"
            : ["Enumeration", "Reference"].includes(type)
              ? "Single Selection"
              : type === "Range"
                ? "Range Input"
                : "Free Input",
      mandatory: true,
      defaultValue: "",
      minSelections: 0,
      maxSelections: type === "Multi Enumeration" ? 5 : 1,
      active: true,
      modified: "2026-09-17",
      domain: {
        values: values.map((value, i) => ({
          id: `${code}-${i}`,
          code: value.replace(/[^a-zA-Z0-9]/g, "_").toUpperCase(),
          value,
          description: "",
          sort: i + 1,
          defaultValue: false,
          active: true
        })),
        ...domain
      }
    };
    s.definitions.push(d);
    return d;
  };
  const seat = define("SEAT_MATERIAL", "Seat Material", "Enumeration", "Marketing", [
    "Fabric",
    "Leather",
    "Nappa Leather"
  ]);
  const wheel = define("WHEEL_SIZE", "Wheel Size", "Enumeration", "Engineering", [
    "18 inch",
    "19 inch",
    "20 inch",
    "21 inch"
  ]);
  const drive = define("DRIVE_TYPE", "Drive Type", "Enumeration", "Engineering", [
    "FWD",
    "AWD",
    "4WD"
  ]);
  const region = define("VEHICLE_REGION", "Vehicle Region", "Enumeration", "Common", [
    "China",
    "Japan",
    "Europe",
    "Global"
  ]);
  define(
    "VOLTAGE",
    "Voltage",
    "Integer",
    "Engineering",
    [],
    false,
    { minimum: 12, maximum: 800, step: 1 },
    "V"
  );
  define("COLOR", "Color", "Enumeration", "Marketing", [
    "Arctic White",
    "Graphite",
    "Midnight Blue"
  ]);
  define("MATERIAL", "Material", "Enumeration", "Engineering", ["Steel", "Aluminum", "Composite"]);
  define("SEAT_TYPE", "Seat Type", "Enumeration", "Marketing", ["Standard", "Sport", "Comfort"]);
  const group = (context: string, code: string, name: string, dimension: Dimension): string => {
    const id = `${context}-${code}`;
    s.groups.push({
      id,
      contextId: `ctx-${context}`,
      code,
      name,
      dimension,
      sort: s.groups.length + 1,
      description: `${name} 配置问题分组`
    });
    return id;
  };
  const family = (
    groupId: string,
    code: string,
    name: string,
    question: string,
    definitions: FeatureDefinition[],
    mode: FeatureFamily["selectionMode"] = "Single"
  ): void => {
    const id = `${groupId}-${code}`;
    s.families.push({
      id,
      groupId,
      code,
      name,
      displayName: name,
      description: question,
      businessQuestion: question,
      dimension: definitions[0].dimension,
      selectionMode: mode,
      mandatory: true,
      sourceType: definitions.every((d) => d.sourceType === "Enterprise Library")
        ? "Enterprise Library"
        : "Local",
      sort: s.families.length + 1,
      active: true,
      minSelections: 0,
      maxSelections: mode === "Multiple" ? 5 : 1
    });
    definitions.forEach((d) =>
      s.references.push({
        id: `${id}-${d.id}`,
        familyId: id,
        featureDefinitionId: d.id,
        definitionVersion: d.version
      })
    );
  };
  const interior = group("SUV", "INTERIOR", "Interior", "Marketing");
  family(interior, "FAM_SEAT", "Seat Material", "What material should the seats use?", [seat]);
  const driver = define(
    "DRIVER_ADJUST",
    "Adjustable Driver Seat",
    "Boolean",
    "Engineering",
    [],
    true
  );
  driver.mandatory = false;
  const steering = define(
    "STEERING_ADJUST",
    "Adjustable Steering",
    "Boolean",
    "Engineering",
    [],
    true
  );
  steering.mandatory = false;
  family(
    interior,
    "FAM_CONVENIENCE",
    "Convenience",
    "Which convenience features are required?",
    [driver, steering],
    "Value Input"
  );
  s.families[s.families.length - 1].mandatory = false;
  family(
    interior,
    "FAM_THEME",
    "Interior Theme",
    "How should the interior theme be named?",
    [
      define("INTERIOR_THEME", "Interior Theme", "String", "Marketing", [], true, { maxLength: 50 })
    ],
    "Value Input"
  );
  const exterior = group("SUV", "EXTERIOR", "Exterior", "Engineering");
  family(exterior, "FAM_WHEEL_SIZE", "Wheel Size", "Which wheel size should this vehicle use?", [
    wheel
  ]);
  const choices = ["Steel", "Aluminum", "Forged Aluminum"].map((name, i) => {
    const d = define(
      `WHEEL_${["STEEL", "AL", "FORGED"][i]}`,
      `${name} Wheel`,
      "Enumeration",
      "Engineering",
      [],
      true
    );
    d.kind = "Choice";
    return d;
  });
  family(
    exterior,
    "FAM_WHEEL_MATERIAL",
    "Wheel Material",
    "Which wheel material should this vehicle use?",
    choices
  );
  const power = group("SUV", "POWERTRAIN", "Powertrain", "Engineering");
  family(power, "FAM_DRIVE", "Drive Type", "Which drive type is required?", [drive]);
  family(
    power,
    "FAM_BATTERY",
    "Battery Capacity",
    "What is the required battery capacity?",
    [
      define(
        "BATTERY_CAPACITY",
        "Battery Capacity",
        "Decimal",
        "Engineering",
        [],
        true,
        { minimum: 40, maximum: 150, step: 5 },
        "kWh"
      )
    ],
    "Value Input"
  );
  const market = group("SUV", "MARKET", "Market", "Common");
  family(market, "FAM_REGION", "Region", "Which market is the product intended for?", [region]);
  family(market, "FAM_TRIM", "Trim Level", "Which trim level is offered?", [
    define(
      "TRIM_LEVEL",
      "Trim Level",
      "Enumeration",
      "Marketing",
      ["Standard", "Premium", "Luxury"],
      true
    )
  ]);
  family(
    market,
    "FAM_PACKAGE",
    "Packages",
    "Which optional packages are requested?",
    [
      define(
        "PACKAGES",
        "Packages",
        "Multi Enumeration",
        "Marketing",
        ["Offroad Package", "Winter Package", "Comfort Package"],
        true
      )
    ],
    "Multiple"
  );
  const engineering = group("SUV", "ENGINEERING", "Engineering Parameters", "Engineering");
  family(
    engineering,
    "FAM_DATE",
    "Production Date",
    "When is production planned?",
    [
      define("PRODUCTION_DATE", "Production Date", "Date", "Engineering", [], true, {
        minimumDate: "2026-01-01",
        maximumDate: "2030-12-31"
      })
    ],
    "Value Input"
  );
  family(
    engineering,
    "FAM_TIME",
    "Delivery Window",
    "When does the delivery window start?",
    [define("DELIVERY_TIME", "Delivery Start", "DateTime", "Common", [], true)],
    "Value Input"
  );
  family(
    engineering,
    "FAM_TEMP",
    "Operating Temperature",
    "What operating temperature range is required?",
    [
      define(
        "TEMPERATURE",
        "Operating Temperature",
        "Range",
        "Engineering",
        [],
        true,
        { minimum: -40, maximum: 80, step: 1 },
        "°C"
      )
    ],
    "Value Input"
  );
  family(
    engineering,
    "FAM_SEATS",
    "Seat Count",
    "How many seats are required?",
    [
      define("SEAT_COUNT", "Seat Count", "Integer", "Engineering", [], true, {
        minimum: 2,
        maximum: 9,
        step: 1
      })
    ],
    "Value Input"
  );
  family(engineering, "FAM_PLATFORM", "Platform", "Which platform catalog entry is used?", [
    define(
      "PLATFORM",
      "Platform Reference",
      "Reference",
      "Engineering",
      ["PLATFORM-A", "PLATFORM-B"],
      true,
      { referenceTarget: "Product Platform Catalog" }
    )
  ]);
  for (const key of ["SEDAN", "EV", "ROAD", "MTB", "GRAVEL", "HVAC"]) {
    const g = group(key, "GENERAL", "General", "Common");
    family(g, "FAM_REGION", "Region", "Which market is the product intended for?", [region]);
    if (["SEDAN", "EV"].includes(key))
      family(g, "FAM_DRIVE", "Drive Type", "Which drive type is required?", [drive]);
    if (key === "MTB")
      family(
        g,
        "FAM_TRAVEL",
        "Bicycle Fork Travel",
        "What front fork travel is required?",
        [
          define(
            "MTB_FORK_TRAVEL",
            "Bicycle Fork Travel",
            "Integer",
            "Engineering",
            [],
            true,
            { minimum: 80, maximum: 200, step: 10 },
            "mm"
          )
        ],
        "Value Input"
      );
  }
  return s;
}
