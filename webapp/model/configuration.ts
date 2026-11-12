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
  sourceType: "Local" | "Enterprise Library";
  sort: number;
  active: boolean;
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
  unit: string;
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
export const storageKey = "plm.configuration-vocabulary.v2";
export const uid = (prefix: string): string => `${prefix}-${crypto.randomUUID()}`;
export const today = (): string => new Date().toISOString().slice(0, 10);

/** Upgrades workspaces saved by the earlier Feature Mode / Selection Group model. */
export function normalizeFeatureModelStore(input: unknown): ConfigurationStore {
  const store = structuredClone(input) as ConfigurationStore & {
    definitions: Array<FeatureDefinition & { featureMode?: string; defaultSelected?: boolean }>;
    selectionGroups?: Array<{
      id: string;
      familyId: string;
      code: string;
      name: string;
      description: string;
      featureReferenceIds: string[];
      minSelections: number;
      maxSelections: number;
      active: boolean;
    }>;
  };
  const legacyReferences = [...store.references];
  const legacyDefinitions = [...store.definitions];
  const convertedDefinitionIds = new Set<string>();

  for (const selectionGroup of store.selectionGroups ?? []) {
    const memberReferences = selectionGroup.featureReferenceIds
      .map((id) => legacyReferences.find((reference) => reference.id === id))
      .filter(
        (reference): reference is FeatureReference =>
          !!reference && reference.familyId === selectionGroup.familyId
      );
    const members = memberReferences
      .map((reference) => ({
        reference,
        definition: legacyDefinitions.find(
          (definition) =>
            definition.id === reference.featureDefinitionId &&
            definition.version === reference.definitionVersion
        )
      }))
      .filter(
        (
          item
        ): item is {
          reference: FeatureReference;
          definition: FeatureDefinition & { featureMode?: string; defaultSelected?: boolean };
        } => !!item.definition
      );
    if (!members.length) continue;

    const family = store.families.find((item) => item.id === selectionGroup.familyId);
    const values = members.map(({ definition }, index) => ({
      id: uid("value"),
      code: definition.code,
      value: definition.name,
      description: definition.description,
      sort: index + 1,
      defaultValue: definition.defaultSelected ?? definition.defaultValue === "true",
      active: definition.active
    }));
    const minimum = Math.min(selectionGroup.minSelections, values.length);
    const maximum = Math.max(1, Math.min(selectionGroup.maxSelections, values.length));
    const multi = maximum > 1;
    const converted: FeatureDefinition = {
      id: uid("def"),
      code: `MIG_${selectionGroup.id.replace(/[^a-zA-Z0-9]+/g, "_").toUpperCase()}`,
      name: family?.displayName || family?.name || selectionGroup.name,
      description: selectionGroup.description || family?.description || "",
      version: 1,
      sourceType: members.every(({ definition }) => definition.sourceType === "Enterprise Library")
        ? "Enterprise Library"
        : "Local",
      dimension: members[0].definition.dimension,
      dataType: multi ? "Multi Enumeration" : "Enumeration",
      unit: "",
      mandatory: minimum > 0,
      defaultValue: "",
      minSelections: minimum,
      maxSelections: multi ? maximum : 1,
      active: selectionGroup.active && members.some(({ definition }) => definition.active),
      domain: { values },
      modified: today()
    };
    store.definitions.push(converted);
    const memberIds = new Set(memberReferences.map((reference) => reference.id));
    store.references = store.references.filter((reference) => !memberIds.has(reference.id));
    store.references.push({
      id: uid("ref"),
      familyId: selectionGroup.familyId,
      featureDefinitionId: converted.id,
      definitionVersion: converted.version
    });
    members.forEach(({ definition }) => convertedDefinitionIds.add(definition.id));
  }
  delete store.selectionGroups;
  store.definitions = store.definitions.filter(
    (definition) =>
      !convertedDefinitionIds.has(definition.id) ||
      store.references.some((reference) => reference.featureDefinitionId === definition.id)
  );
  store.definitions = store.definitions.map((rawDefinition) => {
    const definition = rawDefinition as FeatureDefinition & {
      featureMode?: string;
      defaultSelected?: boolean;
    };
    const { featureMode, defaultSelected, ...rest } = definition;
    const legacyFunctional = featureMode === "Functional Option";
    const dataType = definition.dataType ?? (legacyFunctional ? "Boolean" : "Enumeration");
    const domain = definition.domain ?? { values: [] };
    return {
      ...rest,
      dataType,
      unit: definition.unit ?? "",
      mandatory: legacyFunctional ? false : (definition.mandatory ?? true),
      defaultValue: definition.defaultValue || (defaultSelected ? "true" : ""),
      minSelections: dataType === "Multi Enumeration" ? (definition.minSelections ?? 0) : 0,
      maxSelections:
        dataType === "Multi Enumeration"
          ? (definition.maxSelections ?? Math.max(1, domain.values.length))
          : 1,
      domain
    };
  });
  return store;
}
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
  if (typeof d.active !== "boolean" || typeof d.mandatory !== "boolean")
    errors.push("Active / Mandatory 必须为布尔值");
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
  if (
    d.dataType === "Multi Enumeration" &&
    (!Number.isInteger(d.minSelections) ||
      !Number.isInteger(d.maxSelections) ||
      d.minSelections < 0 ||
      d.maxSelections < Math.max(1, d.minSelections))
  )
    errors.push("多选数量范围无效");
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
  const codes = d.domain.values.map((v) => v.code.trim().toUpperCase());
  if (codes.some((c) => !c) || new Set(codes).size !== codes.length)
    errors.push("允许值编码不能为空或重复");
  if (d.domain.values.some((v) => !v.value.trim())) errors.push("允许值显示名称不能为空");
  if (d.domain.values.some((v) => !Number.isInteger(v.sort) || v.sort < 0))
    errors.push("Sequence 必须为非负整数");
  if (d.domain.values.some((v) => v.defaultValue && !v.active)) errors.push("停用值不能作为默认值");
  if (d.dataType === "Enumeration" && d.domain.values.filter((v) => v.defaultValue).length > 1)
    errors.push("单选值域只能有一个默认值");
  if (d.defaultValue)
    errors.push(
      ...validateValue(
        d,
        d.dataType === "Multi Enumeration"
          ? d.defaultValue.split(",").map((v) => v.trim())
          : d.defaultValue,
        false
      )
    );
  if (
    d.dataType === "Multi Enumeration" &&
    d.domain.values.some((value) => value.defaultValue) &&
    (d.domain.values.filter((value) => value.defaultValue).length < d.minSelections ||
      d.domain.values.filter((value) => value.defaultValue).length > d.maxSelections)
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
  const domain = d.domain;
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
  if (["Enumeration", "Multi Enumeration", "Reference"].includes(d.dataType ?? "")) {
    const values = Array.isArray(value) ? value : [text];
    const allowed = domain.values.filter((v) => v.active).map((v) => v.code);
    if (values.some((v) => !allowed.includes(String(v)))) return ["包含不在允许值域中的值"];
    if (
      d.dataType === "Multi Enumeration" &&
      (values.length < d.minSelections || values.length > d.maxSelections)
    )
      return [`请选择 ${d.minSelections}–${d.maxSelections} 项`];
    return [];
  }
  if (["Integer", "Decimal", "Range"].includes(d.dataType ?? "")) {
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
          (domain.minimum !== undefined && n < domain.minimum) ||
          (domain.maximum !== undefined && n > domain.maximum)
      )
    )
      return ["超出允许的数值范围"];
    const step = domain.step;
    if (
      step &&
      numbers.some(
        (n) =>
          Math.abs(
            (n - (domain.minimum ?? 0)) / step - Math.round((n - (domain.minimum ?? 0)) / step)
          ) > 1e-7
      )
    )
      return [`数值需符合步长 ${step}`];
  }
  if (d.dataType === "String") {
    if (domain.maxLength && text.length > domain.maxLength)
      return [`最多 ${domain.maxLength} 个字符`];
    if (domain.pattern && !new RegExp(domain.pattern).test(text)) return ["不符合字符串格式要求"];
  }
  if (["Date", "DateTime"].includes(d.dataType ?? "")) {
    if (!validDate(text, d.dataType === "DateTime")) return ["日期格式无效"];
    if (
      (domain.minimumDate && text < domain.minimumDate) ||
      (domain.maximumDate && text > domain.maximumDate)
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
        "unit",
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
      !["Local", "Enterprise Library"].includes(f.sourceType) ||
      typeof f.active !== "boolean" ||
      !Number.isInteger(f.sort) ||
      f.sort < 0
    )
      errors.push("Family 属性格式无效");
    if (!s.groups.some((g) => g.id === f.groupId)) errors.push("Family 所属 Group 不存在");
    if (!f.businessQuestion?.trim()) errors.push(`${f.name}: 业务问题不能为空`);
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
    for (const d of definitions) {
      if (
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
        const referenceId = uid("ref");
        s.references.push({
          ...ref,
          id: referenceId,
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
    ["HVAC", "HVAC", "Industrial Equipment"],
    ["CROSSOVER", "Crossover Platform", "Automotive"],
    ["LUXSEDAN", "Luxury Sedan", "Automotive"],
    ["COMPACT", "Compact Car", "Automotive"],
    ["VAN", "Commercial Van", "Automotive"],
    ["EBIKE", "Urban E-Bike", "Bicycle"],
    ["FOLDING", "Folding Bike", "Bicycle"],
    ["TOURING", "Touring Bike", "Bicycle"],
    ["REGIONALJET", "Regional Jet", "Aircraft"],
    ["CARGO", "Cargo Aircraft", "Aircraft"],
    ["BUSINESSJET", "Business Jet", "Aircraft"],
    ["HELICOPTER", "Utility Helicopter", "Aircraft"],
    ["HSR", "High-speed Rail", "High-speed Rail"],
    ["METRO", "Metro Rail", "High-speed Rail"],
    ["INTERCITY", "Intercity Rail", "High-speed Rail"],
    ["PUMPS", "Industrial Pump Systems", "Industrial Equipment"],
    ["ROBOTICS", "Robotics Platform", "Industrial Equipment"],
    ["PACKAGING", "Packaging Line", "Industrial Equipment"],
    ["CHILLER", "Process Chiller", "HVAC"],
    ["HEATPUMP", "Heat Pump Series", "HVAC"],
    ["FACTORYAUTO", "Factory Automation", "Automation"],
    ["PLC", "PLC Control Platform", "Automation"],
    ["SOLAR", "Solar Inverter", "Energy Equipment"],
    ["BATTERY", "Battery Storage", "Energy Equipment"],
    ["SMARTPHONE", "Smartphone Platform", "Consumer Electronics"],
    ["DISPLAY", "Display Products", "Consumer Electronics"],
    ["INDUSTRIALPC", "Industrial Computer", "Industrial Electronics"],
    ["DIAGNOSTIC", "Diagnostic Equipment", "Diagnostic Equipment"],
    ["SURGICAL", "Surgical Equipment", "Surgical Equipment"],
    ["EARTHMOVE", "Earthmoving Equipment", "Earthmoving Equipment"],
    ["LIFTING", "Lifting Equipment", "Lifting Equipment"]
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
      unit,
      mandatory: true,
      defaultValue: "",
      minSelections: 0,
      maxSelections: type === "Multi Enumeration" ? Math.max(1, values.length) : 1,
      active: true,
      modified: "2026-09-17",
      domain: {
        values: values.map((value, i) => ({
          id: `${code}-${i}`,
          code: /^[a-zA-Z0-9 _-]+$/.test(value)
            ? value.replace(/[^a-zA-Z0-9]/g, "_").toUpperCase()
            : `${code}_V${i + 1}`,
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
    definitions: FeatureDefinition[]
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
      sourceType: definitions.every((d) => d.sourceType === "Enterprise Library")
        ? "Enterprise Library"
        : "Local",
      sort: s.families.length + 1,
      active: true
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
    "Driver Seat Adjustment",
    "Enumeration",
    "Engineering",
    ["Manual", "4-way Electric", "8-way Electric"],
    true
  );
  const steering = define(
    "STEERING_ADJUST",
    "Adjustable Steering",
    "Boolean",
    "Engineering",
    [],
    true
  );
  steering.mandatory = false;
  const steeringRange = define(
    "STEERING_RANGE",
    "Steering Adjustment Range",
    "Decimal",
    "Engineering",
    [],
    true,
    { minimum: 0, maximum: 120, step: 1 },
    "mm"
  );
  const heatedSteering = define(
    "HEATED_STEERING",
    "Heated Steering",
    "Boolean",
    "Engineering",
    [],
    true
  );
  const heatedSeat = define("HEATED_SEAT", "Heated Seat", "Boolean", "Engineering", [], true);
  family(interior, "FAM_CONVENIENCE", "Convenience", "Which convenience features are required?", [
    steering,
    driver,
    steeringRange,
    heatedSteering,
    heatedSeat
  ]);
  family(interior, "FAM_THEME", "Interior Theme", "How should the interior theme be named?", [
    define("INTERIOR_THEME", "Interior Theme", "String", "Marketing", [], true, { maxLength: 50 })
  ]);
  family(
    interior,
    "FAM_INTERIOR_PACKAGE",
    "Interior Package",
    "Which interior package is required?",
    [
      define(
        "INTERIOR_PACKAGE",
        "Interior Package",
        "Enumeration",
        "Marketing",
        ["Standard", "Premium", "Luxury"],
        true
      )
    ]
  );
  const exterior = group("SUV", "EXTERIOR", "Exterior", "Engineering");
  family(exterior, "FAM_SUNROOF", "Sunroof Type", "Which sunroof configuration is required?", [
    define(
      "SUNROOF_TYPE",
      "Sunroof Type",
      "Enumeration",
      "Engineering",
      ["Standard", "Panoramic"],
      true
    )
  ]);
  family(exterior, "FAM_ROOF_RACK", "Roof Rack", "Which roof rack is installed?", [
    define("ROOF_RACK", "Roof Rack", "Enumeration", "Engineering", ["Type A", "Type B"], true)
  ]);
  family(exterior, "FAM_WHEEL_SIZE", "Wheel Size", "Which wheel size should this vehicle use?", [
    wheel
  ]);
  const wheelMaterial = define(
    "WHEEL_MATERIAL",
    "Wheel Material",
    "Enumeration",
    "Engineering",
    ["Steel", "Aluminum", "Forged Aluminum"],
    true
  );
  family(
    exterior,
    "FAM_WHEEL_MATERIAL",
    "Wheel Material",
    "Which wheel material should this vehicle use?",
    [wheelMaterial]
  );
  const power = group("SUV", "POWERTRAIN", "Powertrain", "Engineering");
  family(power, "FAM_DRIVE", "Drive Type", "Which drive type is required?", [drive]);
  family(power, "FAM_BATTERY", "Battery Capacity", "What is the required battery capacity?", [
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
  ]);
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
  family(market, "FAM_PACKAGE", "Packages", "Which optional packages are requested?", [
    define(
      "PACKAGES",
      "Packages",
      "Multi Enumeration",
      "Marketing",
      ["Offroad Package", "Winter Package", "Comfort Package"],
      true
    ),
    define("WINTER_PACKAGE", "Winter Package", "Boolean", "Marketing", [], true)
  ]);
  const engineering = group("SUV", "ENGINEERING", "Engineering Parameters", "Engineering");
  family(engineering, "FAM_DATE", "Production Date", "When is production planned?", [
    define("PRODUCTION_DATE", "Production Date", "Date", "Engineering", [], true, {
      minimumDate: "2026-01-01",
      maximumDate: "2030-12-31"
    })
  ]);
  family(engineering, "FAM_TIME", "Delivery Window", "When does the delivery window start?", [
    define("DELIVERY_TIME", "Delivery Start", "DateTime", "Common", [], true)
  ]);
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
    ]
  );
  family(engineering, "FAM_SEATS", "Seat Count", "How many seats are required?", [
    define("SEAT_COUNT", "Seat Count", "Integer", "Engineering", [], true, {
      minimum: 2,
      maximum: 9,
      step: 1
    })
  ]);
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
      family(g, "FAM_TRAVEL", "Bicycle Fork Travel", "What front fork travel is required?", [
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
      ]);
  }
  return ensureChineseSUVMockData(s);
}

export function ensureChineseSUVMockData(store: ConfigurationStore): ConfigurationStore {
  const context = store.contexts.find((item) => item.id === "ctx-SUV");
  if (!context) return store;

  const next = structuredClone(store);
  let changed = false;
  const contextCopy = next.contexts.find((item) => item.id === context.id)!;
  const setIfSeedValue = <T extends object, K extends keyof T>(
    record: T,
    field: K,
    previous: T[K],
    localized: T[K]
  ): void => {
    if (record[field] !== previous) return;
    record[field] = localized;
    changed = true;
  };

  setIfSeedValue(contextCopy, "name", "SUV Series Configuration", "SUV 系列配置");
  setIfSeedValue(contextCopy, "owner", "Alex Chen", "产品配置团队");
  setIfSeedValue(contextCopy, "organization", "Product Engineering", "产品工程部");
  setIfSeedValue(contextCopy, "createdBy", "Configuration Admin", "配置管理员");

  const productFamily = next.productFamilies.find(
    (item) => item.id === contextCopy.productFamilyId
  );
  if (productFamily) {
    setIfSeedValue(productFamily, "name", "SUV Series", "SUV 系列");
    setIfSeedValue(productFamily, "description", "SUV Series 产品族", "SUV 系列产品族");
  }
  const profile = next.profiles.find((item) => item.id === contextCopy.profileId);
  if (profile)
    setIfSeedValue(profile, "name", "SUV Series Configuration Profile", "SUV 系列配置档案");

  const productLabels: Record<string, string> = {
    "SUV Standard CN": "SUV 标准版（中国）",
    "SUV Premium CN": "SUV 高配版（中国）",
    "SUV Standard JP": "SUV 标准版（日本）",
    "SUV Premium JP": "SUV 高配版（日本）",
    "SUV Offroad Global": "SUV 越野版（全球）",
    "SUV Luxury Global": "SUV 尊享版（全球）"
  };
  const productGroups: Record<string, string> = {
    "China Market": "中国市场",
    "Japan Market": "日本市场",
    Global: "全球市场"
  };
  for (const product of next.products.filter(
    (item) => item.familyId === contextCopy.productFamilyId
  )) {
    const localizedName = productLabels[product.name];
    if (localizedName) {
      product.name = localizedName;
      changed = true;
    }
    const localizedGroup = productGroups[product.group];
    if (localizedGroup) {
      product.group = localizedGroup;
      changed = true;
    }
  }
  for (const group of (next.productGroups ?? []).filter(
    (item) => item.familyId === contextCopy.productFamilyId
  )) {
    const localizedName = productGroups[group.name];
    if (!localizedName) continue;
    group.name = localizedName;
    group.description = `${localizedName}车型组`;
    changed = true;
  }

  const groupLabels: Record<string, { previous: string; name: string }> = {
    INTERIOR: { previous: "Interior", name: "内饰与座舱" },
    EXTERIOR: { previous: "Exterior", name: "外观与车身" },
    POWERTRAIN: { previous: "Powertrain", name: "动力与电池" },
    MARKET: { previous: "Market", name: "市场与版本" },
    ENGINEERING: { previous: "Engineering Parameters", name: "工程参数" }
  };
  const suvGroups = next.groups.filter((item) => item.contextId === contextCopy.id);
  for (const group of suvGroups) {
    const localization = groupLabels[group.code];
    if (!localization) continue;
    setIfSeedValue(group, "name", localization.previous, localization.name);
    setIfSeedValue(
      group,
      "description",
      `${localization.previous} 配置问题分组`,
      `${localization.name}配置问题分组`
    );
  }

  const familyLabels: Record<
    string,
    { previous: string; name: string; previousQuestion: string; question: string }
  > = {
    FAM_SEAT: {
      previous: "Seat Material",
      name: "座椅材质",
      previousQuestion: "What material should the seats use?",
      question: "选择座椅面料与材质。"
    },
    FAM_CONVENIENCE: {
      previous: "Convenience",
      name: "座椅与便捷功能",
      previousQuestion: "Which convenience features are required?",
      question: "选择方向盘调节、座椅加热等便捷配置。"
    },
    FAM_THEME: {
      previous: "Interior Theme",
      name: "座舱主题",
      previousQuestion: "How should the interior theme be named?",
      question: "填写座舱主题或内饰风格名称。"
    },
    FAM_INTERIOR_PACKAGE: {
      previous: "Interior Package",
      name: "内饰套装",
      previousQuestion: "Which interior package is required?",
      question: "选择车辆对应的内饰配置等级。"
    },
    FAM_SUNROOF: {
      previous: "Sunroof Type",
      name: "天窗配置",
      previousQuestion: "Which sunroof configuration is required?",
      question: "选择普通天窗或全景天窗。"
    },
    FAM_ROOF_RACK: {
      previous: "Roof Rack",
      name: "车顶行李架",
      previousQuestion: "Which roof rack is installed?",
      question: "选择适配车型的车顶行李架。"
    },
    FAM_WHEEL_SIZE: {
      previous: "Wheel Size",
      name: "轮毂尺寸",
      previousQuestion: "Which wheel size should this vehicle use?",
      question: "选择整车匹配的轮毂尺寸。"
    },
    FAM_WHEEL_MATERIAL: {
      previous: "Wheel Material",
      name: "轮毂材质",
      previousQuestion: "Which wheel material should this vehicle use?",
      question: "选择轮毂制造材质。"
    },
    FAM_DRIVE: {
      previous: "Drive Type",
      name: "驱动形式",
      previousQuestion: "Which drive type is required?",
      question: "选择前驱或四驱形式。"
    },
    FAM_BATTERY: {
      previous: "Battery Capacity",
      name: "动力电池容量",
      previousQuestion: "What is the required battery capacity?",
      question: "填写动力电池容量，单位为 kWh。"
    },
    FAM_REGION: {
      previous: "Region",
      name: "销售区域",
      previousQuestion: "Which market is the product intended for?",
      question: "选择该车型面向的销售区域。"
    },
    FAM_TRIM: {
      previous: "Trim Level",
      name: "车型配置等级",
      previousQuestion: "Which trim level is offered?",
      question: "选择车型的配置等级。"
    },
    FAM_PACKAGE: {
      previous: "Packages",
      name: "选装套件",
      previousQuestion: "Which optional packages are requested?",
      question: "选择可选的冬季、越野或舒适套件。"
    },
    FAM_DATE: {
      previous: "Production Date",
      name: "计划生产日期",
      previousQuestion: "When is production planned?",
      question: "选择计划投产日期。"
    },
    FAM_TIME: {
      previous: "Delivery Window",
      name: "预计交付时间",
      previousQuestion: "When does the delivery window start?",
      question: "填写预计交付开始时间。"
    },
    FAM_TEMP: {
      previous: "Operating Temperature",
      name: "工作温度范围",
      previousQuestion: "What operating temperature range is required?",
      question: "填写车辆或部件的工作温度范围。"
    },
    FAM_SEATS: {
      previous: "Seat Count",
      name: "座椅数量",
      previousQuestion: "How many seats are required?",
      question: "选择整车座椅数量。"
    },
    FAM_PLATFORM: {
      previous: "Platform",
      name: "整车平台",
      previousQuestion: "Which platform catalog entry is used?",
      question: "选择车型使用的整车平台。"
    }
  };
  const suvFamilyIds = new Set<string>();
  for (const family of next.families.filter((item) =>
    suvGroups.some((group) => group.id === item.groupId)
  )) {
    suvFamilyIds.add(family.id);
    const localization = familyLabels[family.code];
    if (!localization) continue;
    setIfSeedValue(family, "name", localization.previous, localization.name);
    setIfSeedValue(family, "displayName", localization.previous, localization.name);
    setIfSeedValue(family, "description", localization.previousQuestion, localization.question);
    setIfSeedValue(
      family,
      "businessQuestion",
      localization.previousQuestion,
      localization.question
    );
  }

  const featureLabels: Record<
    string,
    {
      previous: string;
      name: string;
      description: string;
      values?: Record<string, string>;
      referenceTarget?: { previous: string; value: string };
    }
  > = {
    SEAT_MATERIAL: {
      previous: "Seat Material",
      name: "座椅材质",
      description: "定义座椅面料与表面材质。",
      values: { Fabric: "织物", Leather: "真皮", "Nappa Leather": "纳帕真皮" }
    },
    DRIVER_ADJUST: {
      previous: "Driver Seat Adjustment",
      name: "主驾座椅调节",
      description: "定义主驾驶座椅的电动调节范围。",
      values: {
        Manual: "手动调节",
        "4-way Electric": "4 向电动调节",
        "8-way Electric": "8 向电动调节"
      }
    },
    STEERING_ADJUST: {
      previous: "Adjustable Steering",
      name: "方向盘调节",
      description: "配置方向盘位置调节功能。"
    },
    STEERING_RANGE: {
      previous: "Steering Adjustment Range",
      name: "方向盘调节范围",
      description: "定义方向盘可调节距离，单位为 mm。"
    },
    HEATED_STEERING: {
      previous: "Heated Steering",
      name: "方向盘加热",
      description: "配置方向盘加热功能。"
    },
    HEATED_SEAT: {
      previous: "Heated Seat",
      name: "座椅加热",
      description: "配置前排座椅加热功能。"
    },
    INTERIOR_THEME: {
      previous: "Interior Theme",
      name: "座舱主题",
      description: "填写座舱颜色或装饰风格主题。"
    },
    INTERIOR_PACKAGE: {
      previous: "Interior Package",
      name: "内饰套装",
      description: "选择车辆的内饰配置等级。",
      values: { Standard: "标准内饰", Premium: "高级内饰", Luxury: "尊享内饰" }
    },
    SUNROOF_TYPE: {
      previous: "Sunroof Type",
      name: "天窗类型",
      description: "选择车顶天窗结构。",
      values: { Standard: "普通天窗", Panoramic: "全景天窗" }
    },
    ROOF_RACK: {
      previous: "Roof Rack",
      name: "车顶行李架",
      description: "选择车顶行李架规格。",
      values: { "Type A": "标准型行李架", "Type B": "加强型行李架" }
    },
    WHEEL_SIZE: {
      previous: "Wheel Size",
      name: "轮毂尺寸",
      description: "选择车辆轮毂尺寸。",
      values: {
        "18 inch": "18 英寸",
        "19 inch": "19 英寸",
        "20 inch": "20 英寸",
        "21 inch": "21 英寸"
      }
    },
    WHEEL_MATERIAL: {
      previous: "Wheel Material",
      name: "轮毂材质",
      description: "选择轮毂的制造材质。",
      values: { Steel: "钢制", Aluminum: "铝合金", "Forged Aluminum": "锻造铝合金" }
    },
    DRIVE_TYPE: {
      previous: "Drive Type",
      name: "驱动形式",
      description: "定义车辆的驱动轮与四驱形式。",
      values: { FWD: "前轮驱动", AWD: "智能四轮驱动", "4WD": "机械四轮驱动" }
    },
    BATTERY_CAPACITY: {
      previous: "Battery Capacity",
      name: "动力电池容量",
      description: "定义动力电池可用容量，单位为 kWh。"
    },
    VEHICLE_REGION: {
      previous: "Vehicle Region",
      name: "销售区域",
      description: "定义车型适用的销售区域。",
      values: { China: "中国", Japan: "日本", Europe: "欧洲", Global: "全球" }
    },
    TRIM_LEVEL: {
      previous: "Trim Level",
      name: "车型配置等级",
      description: "定义整车配置等级。",
      values: { Standard: "标准版", Premium: "高配版", Luxury: "尊享版" }
    },
    PACKAGES: {
      previous: "Packages",
      name: "选装套件",
      description: "定义可供选择的整车选装套件。",
      values: {
        "Offroad Package": "越野套件",
        "Winter Package": "冬季套件",
        "Comfort Package": "舒适套件"
      }
    },
    WINTER_PACKAGE: {
      previous: "Winter Package",
      name: "冬季套件",
      description: "配置面向低温环境的冬季套件。"
    },
    PRODUCTION_DATE: {
      previous: "Production Date",
      name: "计划生产日期",
      description: "定义车型的计划生产日期。"
    },
    DELIVERY_TIME: {
      previous: "Delivery Start",
      name: "预计交付时间",
      description: "定义计划交付窗口的开始时间。"
    },
    TEMPERATURE: {
      previous: "Operating Temperature",
      name: "工作温度范围",
      description: "定义车辆或部件允许的工作温度，单位为 °C。"
    },
    SEAT_COUNT: {
      previous: "Seat Count",
      name: "座椅数量",
      description: "定义整车可乘坐人数。"
    },
    PLATFORM: {
      previous: "Platform Reference",
      name: "整车平台",
      description: "选择车型关联的整车平台目录项。",
      referenceTarget: { previous: "Product Platform Catalog", value: "整车平台目录" },
      values: { "PLATFORM-A": "平台 A", "PLATFORM-B": "平台 B" }
    }
  };
  const localizedVersions = new Map<string, number>();
  for (const reference of next.references.filter((item) => suvFamilyIds.has(item.familyId))) {
    const versionKey = `${reference.featureDefinitionId}@${reference.definitionVersion}`;
    const alreadyLocalizedVersion = localizedVersions.get(versionKey);
    if (alreadyLocalizedVersion !== undefined) {
      reference.definitionVersion = alreadyLocalizedVersion;
      changed = true;
      continue;
    }
    const definition = resolveDefinition(next, reference);
    const localization = featureLabels[definition.code];
    if (!localization) continue;

    const localizedDefinition = structuredClone(definition);
    let definitionChanged = false;
    if (localizedDefinition.name === localization.previous) {
      localizedDefinition.name = localization.name;
      definitionChanged = true;
    }
    if (localizedDefinition.description === `${localization.previous} 的允许值与输入规范`) {
      localizedDefinition.description = localization.description;
      definitionChanged = true;
    }
    if (localization.values) {
      for (const value of localizedDefinition.domain.values) {
        const localizedValue = localization.values[value.value];
        if (!localizedValue) continue;
        value.value = localizedValue;
        if (!value.description) value.description = `${localizedValue}选项`;
        definitionChanged = true;
      }
    }
    if (
      localization.referenceTarget &&
      localizedDefinition.domain.referenceTarget === localization.referenceTarget.previous
    ) {
      localizedDefinition.domain.referenceTarget = localization.referenceTarget.value;
      definitionChanged = true;
    }
    if (!definitionChanged) continue;

    localizedDefinition.sourceType = "Local";
    localizedDefinition.version =
      Math.max(
        0,
        ...next.definitions
          .filter((item) => item.id === localizedDefinition.id)
          .map((item) => item.version)
      ) + 1;
    localizedDefinition.modified = today();
    next.definitions.push(localizedDefinition);
    reference.definitionVersion = localizedDefinition.version;
    localizedVersions.set(versionKey, localizedDefinition.version);
    changed = true;
  }

  const addGroup = (
    code: string,
    name: string,
    dimension: Dimension,
    description: string
  ): string => {
    const existing = next.groups.find(
      (item) => item.contextId === contextCopy.id && item.code === code
    );
    if (existing) return existing.id;
    const id = `SUV-${code}`;
    next.groups.push({
      id: next.groups.some((item) => item.id === id) ? uid("group") : id,
      contextId: contextCopy.id,
      code,
      name,
      description,
      dimension,
      sort:
        Math.max(
          0,
          ...next.groups
            .filter((item) => item.contextId === contextCopy.id)
            .map((item) => item.sort)
        ) + 1
    });
    changed = true;
    return next.groups.at(-1)!.id;
  };

  const chassisGroup = addGroup(
    "CHASSIS",
    "底盘与操控",
    "Engineering",
    "定义车辆底盘、悬架与操控配置。"
  );
  const safetyGroup = addGroup(
    "SAFETY",
    "安全与驾驶辅助",
    "Common",
    "定义主动安全、被动安全与泊车辅助配置。"
  );
  const comfortGroup = addGroup(
    "COMFORT",
    "舒适与便利配置",
    "Marketing",
    "定义座舱舒适性与日常便利功能。"
  );

  interface SUVFeatureSeed {
    groupCode: string;
    familyCode: string;
    familyName: string;
    question: string;
    featureCode: string;
    featureName: string;
    featureDescription: string;
    dataType: DataType;
    dimension: Dimension;
    values?: string[];
    valueDescriptions?: string[];
    domain?: Partial<ValueDomain>;
    unit?: string;
    mandatory?: boolean;
  }
  const featureSeeds: SUVFeatureSeed[] = [
    {
      groupCode: "INTERIOR",
      familyCode: "FAM_SEAT_COLOR",
      familyName: "座椅配色",
      question: "选择座椅面料的主色调。",
      featureCode: "SUV_SEAT_COLOR",
      featureName: "座椅颜色",
      featureDescription: "定义前排与后排座椅的主色调。",
      dataType: "Enumeration",
      dimension: "Marketing",
      values: ["曜石黑", "暖沙米", "云杉棕", "黑棕双色"],
      valueDescriptions: [
        "沉稳深色座舱搭配。",
        "明亮浅色座舱搭配。",
        "温暖棕色座舱搭配。",
        "双色拼接座舱搭配。"
      ]
    },
    {
      groupCode: "INTERIOR",
      familyCode: "FAM_SEAT_VENTILATION",
      familyName: "座椅通风",
      question: "是否配置前排座椅通风功能？",
      featureCode: "SUV_SEAT_VENTILATION",
      featureName: "前排座椅通风",
      featureDescription: "配置前排座椅通风，改善高温环境下的乘坐体验。",
      dataType: "Boolean",
      dimension: "Engineering",
      mandatory: false
    },
    {
      groupCode: "INTERIOR",
      familyCode: "FAM_SEAT_MASSAGE",
      familyName: "座椅按摩",
      question: "是否为前排座椅配置按摩功能？",
      featureCode: "SUV_SEAT_MASSAGE",
      featureName: "前排座椅按摩",
      featureDescription: "配置前排座椅按摩功能。",
      dataType: "Boolean",
      dimension: "Engineering",
      mandatory: false
    },
    {
      groupCode: "INTERIOR",
      familyCode: "FAM_REAR_SEAT_LAYOUT",
      familyName: "后排座椅布局",
      question: "选择后排座椅与第三排的布局方案。",
      featureCode: "SUV_REAR_SEAT_LAYOUT",
      featureName: "后排座椅布局",
      featureDescription: "定义第二、第三排座椅的空间布局。",
      dataType: "Enumeration",
      dimension: "Engineering",
      values: ["五座两排", "七座三排", "六座独立座椅"],
      valueDescriptions: [
        "两排座椅，提供宽敞后备厢空间。",
        "三排座椅，满足多人乘坐需求。",
        "第二排独立座椅，提升舒适性。"
      ]
    },
    {
      groupCode: "INTERIOR",
      familyCode: "FAM_DASHBOARD_TRIM",
      familyName: "仪表台饰板",
      question: "选择仪表台与中控区域的饰板材质。",
      featureCode: "SUV_DASHBOARD_TRIM",
      featureName: "仪表台饰板",
      featureDescription: "定义仪表台和中控饰板的表面材质与视觉效果。",
      dataType: "Enumeration",
      dimension: "Marketing",
      values: ["软质搪塑", "哑光木纹", "拉丝金属", "皮革包覆"],
      valueDescriptions: [
        "耐用易清洁的软质表面。",
        "自然纹理的哑光装饰。",
        "细腻金属拉丝效果。",
        "高级触感的皮革包覆。"
      ]
    },
    {
      groupCode: "INTERIOR",
      familyCode: "FAM_AMBIENT_LIGHTING",
      familyName: "座舱氛围灯",
      question: "选择座舱氛围灯配置。",
      featureCode: "SUV_AMBIENT_LIGHTING",
      featureName: "座舱氛围灯",
      featureDescription: "定义座舱氛围灯的颜色与调节能力。",
      dataType: "Enumeration",
      dimension: "Marketing",
      values: ["无氛围灯", "单色氛围灯", "多色氛围灯"],
      valueDescriptions: [
        "不配置独立氛围灯。",
        "提供固定颜色的座舱照明。",
        "支持多种颜色与亮度调节。"
      ]
    },
    {
      groupCode: "INTERIOR",
      familyCode: "FAM_CABIN_AIR",
      familyName: "座舱空气净化",
      question: "选择座舱空气过滤与净化方案。",
      featureCode: "SUV_CABIN_AIR_SYSTEM",
      featureName: "座舱空气系统",
      featureDescription: "定义座舱空气过滤、净化与异味管理能力。",
      dataType: "Enumeration",
      dimension: "Engineering",
      values: ["标准空调滤芯", "高效复合滤芯", "负离子净化系统"],
      valueDescriptions: ["基础颗粒物过滤。", "加强颗粒物与异味过滤。", "增加座舱空气净化功能。"]
    },
    {
      groupCode: "INTERIOR",
      familyCode: "FAM_AUDIO_SYSTEM",
      familyName: "音响系统",
      question: "选择车载扬声器与音响配置。",
      featureCode: "SUV_AUDIO_SYSTEM",
      featureName: "音响系统",
      featureDescription: "定义扬声器数量及车载音响等级。",
      dataType: "Enumeration",
      dimension: "Marketing",
      values: ["6 扬声器标准音响", "10 扬声器环绕音响", "14 扬声器高级音响"],
      valueDescriptions: ["满足日常听音需求。", "提升环绕声场表现。", "提供高规格座舱音响体验。"]
    },
    {
      groupCode: "EXTERIOR",
      familyCode: "FAM_BODY_COLOR",
      familyName: "车身颜色",
      question: "选择车身主色。",
      featureCode: "SUV_BODY_COLOR",
      featureName: "车身颜色",
      featureDescription: "定义车身外观主色及喷涂方案。",
      dataType: "Enumeration",
      dimension: "Marketing",
      values: ["雪山白", "曜石黑", "星河灰", "远峰蓝", "赤霞橙"],
      valueDescriptions: [
        "珍珠白金属漆。",
        "深色金属漆。",
        "中性灰金属漆。",
        "低饱和蓝色金属漆。",
        "高辨识度橙色金属漆。"
      ]
    },
    {
      groupCode: "EXTERIOR",
      familyCode: "FAM_ROOF_COLOR",
      familyName: "车顶颜色",
      question: "选择车顶颜色或双色车身方案。",
      featureCode: "SUV_ROOF_COLOR",
      featureName: "车顶颜色",
      featureDescription: "定义车顶是否采用与车身不同的颜色。",
      dataType: "Enumeration",
      dimension: "Marketing",
      values: ["同色车顶", "曜石黑车顶", "全景天窗黑顶"],
      valueDescriptions: [
        "车顶与车身颜色一致。",
        "采用黑色双色车顶。",
        "采用全景天窗玻璃黑顶效果。"
      ]
    },
    {
      groupCode: "EXTERIOR",
      familyCode: "FAM_HEADLAMP",
      familyName: "前照灯",
      question: "选择前照灯光源与照明能力。",
      featureCode: "SUV_HEADLAMP_TYPE",
      featureName: "前照灯类型",
      featureDescription: "定义前照灯光源、远近光与自适应照明能力。",
      dataType: "Enumeration",
      dimension: "Engineering",
      values: ["LED 前照灯", "矩阵式 LED 前照灯", "自适应矩阵前照灯"],
      valueDescriptions: [
        "基础 LED 远近光照明。",
        "支持分区控制的矩阵照明。",
        "支持随动与自适应远光控制。"
      ]
    },
    {
      groupCode: "EXTERIOR",
      familyCode: "FAM_EXTERIOR_TRIM",
      familyName: "外观饰件",
      question: "选择外观饰件与保险杠装饰方案。",
      featureCode: "SUV_EXTERIOR_TRIM",
      featureName: "外观饰件方案",
      featureDescription: "定义车身下护板、窗框与保险杠饰件组合。",
      dataType: "Enumeration",
      dimension: "Marketing",
      values: ["车身同色饰件", "亮银饰件", "越野黑色饰件"],
      valueDescriptions: [
        "与车身颜色协调的基础饰件。",
        "采用亮银色装饰条。",
        "采用耐刮擦的黑色越野饰件。"
      ]
    },
    {
      groupCode: "EXTERIOR",
      familyCode: "FAM_TOW_HITCH",
      familyName: "拖车装置",
      question: "是否配置拖车钩及拖曳接口？",
      featureCode: "SUV_TOW_HITCH",
      featureName: "拖车装置",
      featureDescription: "配置拖车钩及对应的车身安装接口。",
      dataType: "Boolean",
      dimension: "Engineering",
      mandatory: false
    },
    {
      groupCode: "EXTERIOR",
      familyCode: "FAM_TIRE_SPEC",
      familyName: "轮胎规格",
      question: "选择轮胎类型与使用场景。",
      featureCode: "SUV_TIRE_SPEC",
      featureName: "轮胎规格",
      featureDescription: "定义轮胎宽度、扁平比与路面适用场景。",
      dataType: "Enumeration",
      dimension: "Engineering",
      values: ["公路舒适胎", "全季节轮胎", "全地形越野胎"],
      valueDescriptions: [
        "适用于城市与铺装道路。",
        "兼顾多季节道路条件。",
        "适用于非铺装及轻度越野路面。"
      ]
    },
    {
      groupCode: "POWERTRAIN",
      familyCode: "FAM_POWERTRAIN_TYPE",
      familyName: "动力系统类型",
      question: "选择整车动力来源。",
      featureCode: "SUV_POWERTRAIN_TYPE",
      featureName: "动力系统类型",
      featureDescription: "定义燃油、混合动力或纯电动力方案。",
      dataType: "Enumeration",
      dimension: "Engineering",
      values: ["燃油动力", "油电混合动力", "插电式混合动力", "纯电动力"],
      valueDescriptions: [
        "由燃油发动机提供动力。",
        "发动机与电机协同驱动。",
        "支持外接充电的混合动力方案。",
        "由动力电池与电机驱动。"
      ]
    },
    {
      groupCode: "POWERTRAIN",
      familyCode: "FAM_ENGINE_DISPLACEMENT",
      familyName: "发动机排量",
      question: "填写发动机排量；纯电车型可留空。",
      featureCode: "SUV_ENGINE_DISPLACEMENT",
      featureName: "发动机排量",
      featureDescription: "定义发动机排量范围，单位为 L。",
      dataType: "Decimal",
      dimension: "Engineering",
      domain: { minimum: 0, maximum: 5, step: 0.1 },
      unit: "L",
      mandatory: false
    },
    {
      groupCode: "POWERTRAIN",
      familyCode: "FAM_MAX_POWER",
      familyName: "最大功率",
      question: "填写整车或系统最大功率。",
      featureCode: "SUV_MAX_POWER",
      featureName: "最大功率",
      featureDescription: "定义动力系统峰值功率，单位为 kW。",
      dataType: "Integer",
      dimension: "Engineering",
      domain: { minimum: 80, maximum: 500, step: 10 },
      unit: "kW"
    },
    {
      groupCode: "POWERTRAIN",
      familyCode: "FAM_TRANSMISSION",
      familyName: "变速与传动",
      question: "选择变速箱或电驱传动方案。",
      featureCode: "SUV_TRANSMISSION_TYPE",
      featureName: "传动系统类型",
      featureDescription: "定义发动机车型的变速箱或纯电车型的传动形式。",
      dataType: "Enumeration",
      dimension: "Engineering",
      values: ["6 速手动变速箱", "8 速自动变速箱", "9 速自动变速箱", "单速电驱"],
      valueDescriptions: [
        "手动换挡传动方案。",
        "适用于多种动力配置的自动变速方案。",
        "提供更宽速比范围的自动变速方案。",
        "纯电车型单速减速传动方案。"
      ]
    },
    {
      groupCode: "CHASSIS",
      familyCode: "FAM_SUSPENSION",
      familyName: "悬架系统",
      question: "选择悬架结构与调节能力。",
      featureCode: "SUV_SUSPENSION_TYPE",
      featureName: "悬架类型",
      featureDescription: "定义车辆悬架结构及车身高度调节能力。",
      dataType: "Enumeration",
      dimension: "Engineering",
      values: ["舒适型悬架", "运动型悬架", "自适应空气悬架"],
      valueDescriptions: [
        "偏向日常舒适性的悬架调校。",
        "偏向操控支撑的悬架调校。",
        "支持车身高度与阻尼调节。"
      ]
    },
    {
      groupCode: "CHASSIS",
      familyCode: "FAM_BRAKE_SYSTEM",
      familyName: "制动系统",
      question: "选择制动器与制动控制方案。",
      featureCode: "SUV_BRAKE_SYSTEM",
      featureName: "制动系统",
      featureDescription: "定义制动器规格与制动控制配置。",
      dataType: "Enumeration",
      dimension: "Engineering",
      values: ["标准制动系统", "增强型制动系统", "高性能制动系统"],
      valueDescriptions: [
        "满足常规道路制动需求。",
        "提升连续制动热稳定性。",
        "适用于高功率与高负载车型。"
      ]
    },
    {
      groupCode: "CHASSIS",
      familyCode: "FAM_GROUND_CLEARANCE",
      familyName: "最小离地间隙",
      question: "填写车辆最小离地间隙。",
      featureCode: "SUV_GROUND_CLEARANCE",
      featureName: "最小离地间隙",
      featureDescription: "定义车辆底盘最低点至地面的距离，单位为 mm。",
      dataType: "Integer",
      dimension: "Engineering",
      domain: { minimum: 140, maximum: 280, step: 5 },
      unit: "mm"
    },
    {
      groupCode: "CHASSIS",
      familyCode: "FAM_WHEELBASE",
      familyName: "轴距",
      question: "填写前后轴中心之间的轴距。",
      featureCode: "SUV_WHEELBASE",
      featureName: "轴距",
      featureDescription: "定义车辆前后轴中心距离，单位为 mm。",
      dataType: "Integer",
      dimension: "Engineering",
      domain: { minimum: 2500, maximum: 3300, step: 10 },
      unit: "mm"
    },
    {
      groupCode: "SAFETY",
      familyCode: "FAM_AIRBAG_COUNT",
      familyName: "安全气囊",
      question: "填写整车安全气囊数量。",
      featureCode: "SUV_AIRBAG_COUNT",
      featureName: "安全气囊数量",
      featureDescription: "定义整车配置的安全气囊数量。",
      dataType: "Integer",
      dimension: "Engineering",
      domain: { minimum: 2, maximum: 12, step: 2 }
    },
    {
      groupCode: "SAFETY",
      familyCode: "FAM_ADAS_PACKAGE",
      familyName: "驾驶辅助等级",
      question: "选择主动驾驶辅助功能组合。",
      featureCode: "SUV_ADAS_PACKAGE",
      featureName: "驾驶辅助等级",
      featureDescription: "定义车辆主动驾驶辅助与安全功能组合。",
      dataType: "Enumeration",
      dimension: "Common",
      values: ["基础安全辅助", "高速领航辅助", "全场景驾驶辅助"],
      valueDescriptions: [
        "包含基础主动安全功能。",
        "增加高速公路辅助驾驶功能。",
        "覆盖更多道路与泊车辅助场景。"
      ]
    },
    {
      groupCode: "SAFETY",
      familyCode: "FAM_BLIND_SPOT",
      familyName: "盲区监测",
      question: "是否配置盲区监测与变道预警？",
      featureCode: "SUV_BLIND_SPOT_MONITOR",
      featureName: "盲区监测",
      featureDescription: "配置车辆侧后方盲区监测与变道预警。",
      dataType: "Boolean",
      dimension: "Engineering",
      mandatory: false
    },
    {
      groupCode: "SAFETY",
      familyCode: "FAM_AUTOMATIC_BRAKING",
      familyName: "自动紧急制动",
      question: "是否配置自动紧急制动功能？",
      featureCode: "SUV_AUTOMATIC_EMERGENCY_BRAKE",
      featureName: "自动紧急制动",
      featureDescription: "配置前向碰撞预警与自动紧急制动。",
      dataType: "Boolean",
      dimension: "Engineering",
      mandatory: false
    },
    {
      groupCode: "SAFETY",
      familyCode: "FAM_PARKING_ASSIST",
      familyName: "泊车辅助",
      question: "选择倒车影像与泊车辅助能力。",
      featureCode: "SUV_PARKING_ASSIST",
      featureName: "泊车辅助系统",
      featureDescription: "定义影像辅助与全景泊车视野能力。",
      dataType: "Enumeration",
      dimension: "Engineering",
      values: ["倒车影像", "360° 全景影像", "全景影像与透明底盘"],
      valueDescriptions: [
        "提供车尾倒车视野。",
        "提供车辆周边全景视野。",
        "增加车辆底部透视辅助视图。"
      ]
    },
    {
      groupCode: "COMFORT",
      familyCode: "FAM_POWER_TAILGATE",
      familyName: "电动尾门",
      question: "是否配置电动尾门及高度记忆？",
      featureCode: "SUV_POWER_TAILGATE",
      featureName: "电动尾门",
      featureDescription: "配置电动开启、关闭与尾门高度记忆功能。",
      dataType: "Boolean",
      dimension: "Engineering",
      mandatory: false
    },
    {
      groupCode: "COMFORT",
      familyCode: "FAM_KEYLESS_ENTRY",
      familyName: "无钥匙进入",
      question: "是否配置无钥匙进入与启动功能？",
      featureCode: "SUV_KEYLESS_ENTRY",
      featureName: "无钥匙进入",
      featureDescription: "配置门把手感应解锁与无钥匙启动功能。",
      dataType: "Boolean",
      dimension: "Engineering",
      mandatory: false
    },
    {
      groupCode: "COMFORT",
      familyCode: "FAM_WIRELESS_CHARGING",
      familyName: "无线充电",
      question: "是否配置前排手机无线充电？",
      featureCode: "SUV_WIRELESS_CHARGING",
      featureName: "手机无线充电",
      featureDescription: "配置前排中央区域的手机无线充电模块。",
      dataType: "Boolean",
      dimension: "Engineering",
      mandatory: false
    },
    {
      groupCode: "MARKET",
      familyCode: "FAM_EMISSION_STANDARD",
      familyName: "排放标准",
      question: "选择车型需要满足的排放标准。",
      featureCode: "SUV_EMISSION_STANDARD",
      featureName: "排放标准",
      featureDescription: "定义车辆注册与销售地区适用的排放标准。",
      dataType: "Enumeration",
      dimension: "Common",
      values: ["国六 b", "欧六 e", "零排放"],
      valueDescriptions: [
        "满足中国国六 b 阶段排放要求。",
        "满足欧洲欧六 e 阶段排放要求。",
        "适用于纯电车型的零尾气排放。"
      ]
    },
    {
      groupCode: "MARKET",
      familyCode: "FAM_VEHICLE_RANGE",
      familyName: "续航里程",
      question: "填写车型目标综合续航里程。",
      featureCode: "SUV_VEHICLE_RANGE",
      featureName: "综合续航里程",
      featureDescription: "定义整车目标综合续航里程，单位为 km。",
      dataType: "Integer",
      dimension: "Engineering",
      domain: { minimum: 300, maximum: 1000, step: 10 },
      unit: "km"
    }
  ];

  const groupIds = new Map(
    next.groups
      .filter((item) => item.contextId === contextCopy.id)
      .map((item) => [item.code, item.id])
  );
  groupIds.set("CHASSIS", chassisGroup);
  groupIds.set("SAFETY", safetyGroup);
  groupIds.set("COMFORT", comfortGroup);
  for (const seed of featureSeeds) {
    const groupId = groupIds.get(seed.groupCode);
    if (
      !groupId ||
      next.families.some((item) => item.groupId === groupId && item.code === seed.familyCode)
    )
      continue;

    const familyId = `${groupId}-${seed.familyCode}`;
    const familyIdIsUsed = next.families.some((item) => item.id === familyId);
    const resolvedFamilyId = familyIdIsUsed ? uid("family") : familyId;
    const latestDefinition = next.definitions
      .filter((item) => item.code === seed.featureCode)
      .sort((a, b) => b.version - a.version)[0];
    const definition =
      latestDefinition ??
      ({
        id: `def-${seed.featureCode}`,
        code: seed.featureCode,
        name: seed.featureName,
        description: seed.featureDescription,
        version: 1,
        sourceType: "Local",
        dimension: seed.dimension,
        dataType: seed.dataType,
        unit: seed.unit ?? "",
        mandatory: seed.mandatory ?? true,
        defaultValue: "",
        minSelections: 0,
        maxSelections:
          seed.dataType === "Multi Enumeration" ? Math.max(1, seed.values?.length ?? 0) : 1,
        active: true,
        domain: {
          ...(seed.domain ?? {}),
          values: (seed.values ?? []).map((value, index) => ({
            id: `${seed.featureCode}-${index}`,
            code: `${seed.featureCode}_V${index + 1}`,
            value,
            description: seed.valueDescriptions?.[index] ?? `${value}配置选项`,
            sort: index + 1,
            defaultValue: false,
            active: true
          }))
        },
        modified: "2026-09-17"
      } satisfies FeatureDefinition);

    if (!latestDefinition) next.definitions.push(definition);
    next.families.push({
      id: resolvedFamilyId,
      groupId,
      code: seed.familyCode,
      name: seed.familyName,
      displayName: seed.familyName,
      description: seed.question,
      businessQuestion: seed.question,
      dimension: seed.dimension,
      sourceType: "Local",
      sort:
        Math.max(
          0,
          ...next.families.filter((item) => item.groupId === groupId).map((item) => item.sort)
        ) + 1,
      active: true
    });
    next.references.push({
      id: `${resolvedFamilyId}-${definition.id}`,
      familyId: resolvedFamilyId,
      featureDefinitionId: definition.id,
      definitionVersion: definition.version
    });
    changed = true;
  }

  const productGroupLabels: Record<string, string> = {
    "China Market": "中国市场",
    "Japan Market": "日本市场",
    Global: "全球市场"
  };
  for (const productGroup of (next.productGroups ?? []).filter(
    (item) => item.familyId === contextCopy.productFamilyId
  )) {
    const localizedName = productGroupLabels[productGroup.name];
    if (!localizedName) continue;
    productGroup.name = localizedName;
    productGroup.description = `${localizedName}车型组`;
    changed = true;
  }

  if (!changed) return store;
  const errors = validateStore(next);
  if (errors.length) throw new Error(`SUV 中文演示数据迁移失败：${errors.join("；")}`);
  return next;
}

const constraintSampleFeatureCodes = new Set([
  "SUNROOF_TYPE",
  "INTERIOR_PACKAGE",
  "ROOF_RACK",
  "WINTER_PACKAGE",
  "HEATED_STEERING",
  "HEATED_SEAT"
]);

export function ensureConstraintSampleFeatures(store: ConfigurationStore): ConfigurationStore {
  if (!store.contexts.some((context) => context.id === "ctx-SUV")) return store;
  const seed = createSeed();
  const sampleFamilies = seed.families.filter((family) =>
    seed.references
      .filter((reference) => reference.familyId === family.id)
      .some((reference) =>
        constraintSampleFeatureCodes.has(
          seed.definitions.find((definition) => definition.id === reference.featureDefinitionId)
            ?.code ?? ""
        )
      )
  );
  let next: ConfigurationStore | undefined;

  for (const family of sampleFamilies) {
    const seedGroup = seed.groups.find((group) => group.id === family.groupId);
    if (!seedGroup) continue;
    const familyReferences = seed.references.filter(
      (reference) => reference.familyId === family.id
    );
    const missingFeatures = familyReferences.some((reference) => {
      const definition = seed.definitions.find((item) => item.id === reference.featureDefinitionId);
      if (!definition || !constraintSampleFeatureCodes.has(definition.code)) return false;
      const existing = (next ?? store).definitions.some((item) => item.code === definition.code);
      const existingReference = (next ?? store).references.some(
        (item) => item.familyId === family.id && item.featureDefinitionId === definition.id
      );
      return !existing || !existingReference;
    });
    if (!missingFeatures) continue;
    next ??= structuredClone(store);
    if (!next.groups.some((group) => group.id === seedGroup.id))
      next.groups.push(structuredClone(seedGroup));
    if (!next.families.some((item) => item.id === family.id))
      next.families.push(structuredClone(family));

    for (const reference of familyReferences) {
      const definition = seed.definitions.find((item) => item.id === reference.featureDefinitionId);
      if (!definition || !constraintSampleFeatureCodes.has(definition.code)) continue;
      let existingDefinition = next.definitions.find((item) => item.code === definition.code);
      if (!existingDefinition) {
        existingDefinition = structuredClone(definition);
        next.definitions.push(existingDefinition);
      }
      if (
        next.references.some(
          (item) =>
            item.familyId === family.id && item.featureDefinitionId === existingDefinition?.id
        )
      )
        continue;
      next.references.push({
        id: `${family.id}-${existingDefinition.id}`,
        familyId: family.id,
        featureDefinitionId: existingDefinition.id,
        definitionVersion: existingDefinition.version
      });
    }
  }

  return next && validateStore(next).length === 0 ? next : store;
}

export function ensureLoadTestContexts(
  store: ConfigurationStore,
  minimumContexts = 30
): ConfigurationStore {
  if (store.contexts.length >= minimumContexts) return store;
  const seed = createSeed();
  const existingIds = new Set(store.contexts.map((context) => context.id));
  const additions = seed.contexts
    .filter((context) => !existingIds.has(context.id))
    .slice(0, minimumContexts - store.contexts.length);
  if (!additions.length) return store;
  const familyIds = new Set(additions.map((context) => context.productFamilyId));
  const profileIds = new Set(additions.map((context) => context.profileId));
  const next = structuredClone(store);
  next.productGroups = [...(next.productGroups ?? [])];
  next.contexts.push(...additions);
  next.productFamilies.push(
    ...seed.productFamilies.filter(
      (family) =>
        familyIds.has(family.id) && !next.productFamilies.some((item) => item.id === family.id)
    )
  );
  next.profiles.push(
    ...seed.profiles.filter(
      (profile) =>
        profileIds.has(profile.id) && !next.profiles.some((item) => item.id === profile.id)
    )
  );
  next.products.push(
    ...seed.products.filter(
      (product) =>
        familyIds.has(product.familyId) && !next.products.some((item) => item.id === product.id)
    )
  );
  next.productGroups.push(
    ...(seed.productGroups ?? []).filter(
      (group) =>
        familyIds.has(group.familyId) && !next.productGroups!.some((item) => item.id === group.id)
    )
  );
  return validateStore(next).length ? store : next;
}
