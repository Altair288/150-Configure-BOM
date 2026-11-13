/* global structuredClone */
import test from "node:test";
import assert from "node:assert/strict";
import {
  createSeed,
  validateStore,
  validateDefinition,
  validateValue,
  resolveDefinition,
  publishDefinition,
  copyContext,
  contextReferences,
  definitionUsage,
  ensureConstraintSampleFeatures,
  ensureChineseSUVMockData
} from "../webapp/model/configuration.ts";
import {
  appendConstraintPredicate,
  activeConstraintEffects,
  constraintEffectAllowedValues,
  reconcileConstrainedSelection,
  createConstraintRule,
  createConstraintRuleSamples,
  constraintOperatorsFor,
  formatConstraintExpression,
  normalizeConstraintConditionForDesigner,
  previewConstraintRules,
  migrateLegacyConstraintRuleAst,
  parseConstraintExpression,
  validateConstraintRule
} from "../webapp/model/constraintRules.ts";

test("seed vocabulary has valid links and all ten data types", () => {
  const store = createSeed();
  assert.deepEqual(validateStore(store), []);
  assert.equal(new Set(store.definitions.map((d) => d.dataType)).size, 10);
  assert.equal(definitionUsage(store, "def-VEHICLE_REGION").length, 7);
});

test("SUV seed uses detailed Chinese feature-model data", () => {
  const store = createSeed();
  const context = store.contexts.find((item) => item.id === "ctx-SUV");
  const features = contextReferences(store, "ctx-SUV").map((reference) =>
    resolveDefinition(store, reference)
  );
  const products = store.products.filter((product) => product.familyId === context.productFamilyId);

  assert.equal(context.name, "SUV 系列配置");
  assert.ok(features.length >= 50);
  assert.ok(features.every((feature) => /[\u4e00-\u9fff]/.test(feature.name)));
  assert.ok(products.every((product) => product.productType === "Product Model"));
  assert.ok(products.every((product) => product.status === "In Development"));
  assert.deepEqual(
    products.map((product) => product.market),
    ["CN", "CN", "JP", "JP", "Global", "Global"]
  );
  assert.ok(
    store.groups.some((group) => group.contextId === context.id && group.name === "安全与驾驶辅助")
  );
  assert.ok(
    store.groups.some((group) => group.contextId === context.id && group.name === "底盘与操控")
  );
  assert.equal(features.find((feature) => feature.code === "SUV_BODY_COLOR").name, "车身颜色");
  assert.deepEqual(
    features
      .find((feature) => feature.code === "SUV_BODY_COLOR")
      .domain.values.map((value) => value.value),
    ["雪山白", "曜石黑", "星河灰", "远峰蓝", "赤霞橙"]
  );
  assert.equal(features.find((feature) => feature.code === "SUNROOF_TYPE").name, "天窗类型");
  assert.equal(
    features.find((feature) => feature.code === "SUNROOF_TYPE").domain.values[1].value,
    "全景天窗"
  );
  assert.equal(
    features.find((feature) => feature.code === "PLATFORM").domain.referenceTarget,
    "整车平台目录"
  );
});

test("SUV mock migration is idempotent and preserves custom edits and other contexts", () => {
  const legacy = createSeed();
  const addedFeatureCodes = new Set(
    legacy.definitions
      .filter((definition) => definition.code.startsWith("SUV_"))
      .map((definition) => definition.code)
  );
  const addedFeatureIds = new Set(
    legacy.definitions
      .filter((definition) => addedFeatureCodes.has(definition.code))
      .map((definition) => definition.id)
  );
  const addedFamilyIds = new Set(
    legacy.references
      .filter((reference) => addedFeatureIds.has(reference.featureDefinitionId))
      .map((reference) => reference.familyId)
  );
  legacy.references = legacy.references.filter(
    (reference) => !addedFamilyIds.has(reference.familyId)
  );
  legacy.families = legacy.families.filter((family) => !addedFamilyIds.has(family.id));
  legacy.definitions = legacy.definitions.filter(
    (definition) => !addedFeatureCodes.has(definition.code)
  );
  legacy.groups = legacy.groups.filter(
    (group) => !["CHASSIS", "SAFETY", "COMFORT"].includes(group.code)
  );

  const suvReferences = contextReferences(legacy, "ctx-SUV");
  const suvDefinitionIds = new Set(suvReferences.map((reference) => reference.featureDefinitionId));
  for (const reference of suvReferences) {
    if (
      legacy.definitions.some(
        (definition) => definition.id === reference.featureDefinitionId && definition.version === 1
      )
    )
      reference.definitionVersion = 1;
  }
  legacy.definitions = legacy.definitions.filter(
    (definition) => !suvDefinitionIds.has(definition.id) || definition.version === 1
  );
  legacy.contexts.find((context) => context.id === "ctx-SUV").name = "SUV Series Configuration";
  legacy.groups.find((group) => group.id === "SUV-INTERIOR").name = "Interior";
  const seatFamily = legacy.families.find((family) => family.id === "SUV-INTERIOR-FAM_SEAT");
  seatFamily.name = "Seat Material";
  seatFamily.displayName = "Seat Material";
  seatFamily.description = "What material should the seats use?";
  seatFamily.businessQuestion = "What material should the seats use?";
  const sunroofReference = suvReferences.find(
    (reference) => resolveDefinition(legacy, reference).code === "SUNROOF_TYPE"
  );
  resolveDefinition(legacy, sunroofReference).name = "自定义天窗名称";

  const migrated = ensureChineseSUVMockData(legacy);
  const migratedAgain = ensureChineseSUVMockData(migrated);
  const driveReference = contextReferences(migrated, "ctx-SUV").find(
    (reference) => resolveDefinition(migrated, reference).code === "DRIVE_TYPE"
  );
  const sedanDrive = contextReferences(migrated, "ctx-SEDAN").find(
    (reference) => resolveDefinition(migrated, reference).code === "DRIVE_TYPE"
  );

  assert.equal(migrated.contexts.find((context) => context.id === "ctx-SUV").name, "SUV 系列配置");
  assert.equal(resolveDefinition(migrated, driveReference).name, "驱动形式");
  assert.equal(resolveDefinition(migrated, sedanDrive).name, "Drive Type");
  assert.equal(
    resolveDefinition(
      migrated,
      contextReferences(migrated, "ctx-SUV").find(
        (reference) => resolveDefinition(migrated, reference).code === "SUV_BODY_COLOR"
      )
    ).name,
    "车身颜色"
  );
  assert.equal(
    resolveDefinition(
      migrated,
      contextReferences(migrated, "ctx-SUV").find(
        (reference) => resolveDefinition(migrated, reference).code === "SUNROOF_TYPE"
      )
    ).name,
    "自定义天窗名称"
  );
  assert.deepEqual(migratedAgain, migrated);
  assert.deepEqual(validateStore(migrated), []);
});

test("publishing a reusable definition never changes existing references", () => {
  const store = createSeed();
  const ref = store.references.find((r) => r.featureDefinitionId === "def-DRIVE_TYPE");
  const original = structuredClone(resolveDefinition(store, ref));
  const edited = structuredClone(original);
  edited.name = "Drive Type revised";
  edited.domain.values.pop();
  const next = publishDefinition(store, edited);
  assert.equal(next.version, original.version + 1);
  assert.deepEqual(resolveDefinition(store, ref), original);
  ref.definitionVersion = next.version;
  assert.equal(resolveDefinition(store, ref).name, "Drive Type revised");
  assert.deepEqual(validateStore(store), []);
});

test("context copy isolates local definitions, products and profile but reuses enterprise IDs", () => {
  const store = createSeed();
  const original = contextReferences(store, "ctx-SUV");
  const copy = copyContext(store, "ctx-SUV", "CTX-COPY", "SUV copy");
  assert.equal(copy.status, "Draft");
  assert.notEqual(copy.profileId, "profile-SUV");
  assert.notEqual(copy.productFamilyId, "pf-SUV");
  const copied = contextReferences(store, copy.id);
  assert.equal(copied.length, original.length);
  for (let i = 0; i < original.length; i++) {
    const source = resolveDefinition(store, original[i]);
    assert.equal(
      copied[i].featureDefinitionId === source.id,
      source.sourceType === "Enterprise Library"
    );
  }
  assert.deepEqual(validateStore(store), []);
});

test("imports reject broken references, duplicate codes and invalid profile shapes", () => {
  const store = createSeed();
  store.references[0].definitionVersion = 900;
  assert.ok(validateStore(store).includes("引用的特征版本不存在"));
  store.references[0].definitionVersion = 1;
  store.contexts[1].code = store.contexts[0].code;
  assert.ok(validateStore(store).some((e) => e.includes("Context 编码重复")));
  delete store.profiles[0].featureSourceMode;
  assert.ok(validateStore(store).includes("对象字段缺失或类型无效"));
  assert.ok(validateStore(null).length);
});

test("numeric domain checks bounds, integer values, ranges and step without float drift", () => {
  const store = createSeed();
  const battery = store.definitions.find((d) => d.code === "BATTERY_CAPACITY");
  assert.deepEqual(validateValue(battery, 50), []);
  assert.ok(validateValue(battery, 42).length);
  assert.ok(validateValue(battery, 155).length);
  const integer = store.definitions.find((d) => d.code === "SEAT_COUNT");
  assert.ok(validateValue(integer, 3.5).length);
  const range = store.definitions.find((d) => d.code === "TEMPERATURE");
  assert.deepEqual(validateValue(range, "-20 ~ 60"), []);
  assert.ok(validateValue(range, "60 ~ -20").length);
  assert.ok(validateValue(range, "~").length);
  battery.domain = { values: [], minimum: 0, maximum: 1, step: 0.1 };
  assert.deepEqual(validateValue(battery, 0.3), []);
});

test("enum defaults, inactive values, date boundaries and string patterns are validated", () => {
  const store = createSeed();
  const drive = store.definitions.find((d) => d.code === "DRIVE_TYPE");
  drive.domain.values[0].defaultValue = true;
  drive.domain.values[1].defaultValue = true;
  assert.ok(validateDefinition(drive).some((e) => e.includes("一个默认值")));
  drive.domain.values[0].active = false;
  assert.ok(validateValue(drive, "FWD").length);
  const date = store.definitions.find((d) => d.code === "PRODUCTION_DATE");
  assert.ok(validateValue(date, "2026-02-31").length);
  assert.ok(validateValue(date, "2025-12-31").length);
  assert.deepEqual(validateValue(date, "2028-02-29"), []);
  const theme = store.definitions.find((d) => d.code === "INTERIOR_THEME");
  theme.domain.pattern = "^[A-Z]+$";
  assert.deepEqual(validateValue(theme, "SPORT"), []);
  assert.ok(validateValue(theme, "sport").length);
  theme.domain.pattern = "[";
  assert.ok(validateDefinition(theme).some((e) => e.includes("表达式无效")));
});

test("features use data types directly and discrete choices belong to one feature domain", () => {
  const store = createSeed();
  const functional = store.definitions.find((d) => d.code === "STEERING_ADJUST");
  assert.equal(functional.dataType, "Boolean");
  assert.equal("featureMode" in functional, false);
  assert.deepEqual(validateValue(functional, false, true), []);
  const convenienceFamily = store.families.find((family) => family.code === "FAM_CONVENIENCE");
  const convenienceDefinitions = store.references
    .filter((reference) => reference.familyId === convenienceFamily.id)
    .map((reference) =>
      store.definitions.find((definition) => definition.id === reference.featureDefinitionId)
    );
  assert.deepEqual(
    convenienceDefinitions.map((definition) => definition.dataType),
    ["Boolean", "Enumeration", "Decimal", "Boolean", "Boolean"]
  );
  assert.ok(convenienceDefinitions.some((definition) => definition.code === "HEATED_STEERING"));
  assert.ok(convenienceDefinitions.some((definition) => definition.code === "HEATED_SEAT"));
  const wheelFamily = store.families.find((family) => family.code === "FAM_WHEEL_MATERIAL");
  const wheelFeatures = store.references.filter(
    (reference) => reference.familyId === wheelFamily.id
  );
  assert.equal(wheelFeatures.length, 1);
  assert.equal(
    store.definitions.find((definition) => definition.id === wheelFeatures[0].featureDefinitionId)
      .domain.values.length,
    3
  );
  assert.equal("selectionGroups" in store, false);
  assert.deepEqual(
    validateValue(
      store.definitions.find((d) => d.code === "DRIVE_TYPE"),
      "FWD"
    ),
    []
  );
  assert.deepEqual(
    validateValue(
      store.definitions.find((d) => d.code === "PACKAGES"),
      ["OFFROAD_PACKAGE"]
    ),
    []
  );
});

test("constraint AST parses and formats nested AND OR NOT without string-based synchronization", () => {
  const expression =
    'TRIM_LEVEL == "PREMIUM" AND NOT (VEHICLE_REGION == "JAPAN" OR ROOF_RACK == "TYPE_B") => DRIVE_TYPE IN ("AWD", "4WD")';
  const ast = parseConstraintExpression(expression);
  assert.equal(ast.condition.type, "AND");
  assert.equal(ast.actions[0].type, "REQUIRE");
  assert.equal(ast.actions[0].target.type, "IN");
  assert.equal(
    formatConstraintExpression(ast),
    'WHEN TRIM_LEVEL == "PREMIUM" AND NOT (VEHICLE_REGION == "JAPAN" OR ROOF_RACK == "TYPE_B") THEN REQUIRE DRIVE_TYPE IN ("AWD", "4WD")'
  );

  const store = createSeed();
  const features = contextReferences(store, "ctx-SUV").map((reference) =>
    resolveDefinition(store, reference)
  );
  const samples = createConstraintRuleSamples(features);
  for (const rule of samples)
    assert.deepEqual(parseConstraintExpression(formatConstraintExpression(rule.ast)), rule.ast);
  assert.match(samples[0].expression, /^WHEN .* THEN REQUIRE /);
  assert.match(samples[1].expression, /^WHEN .* THEN EXCLUDE /);
  assert.equal(samples[3].ast.actions.length, 2);
  assert.match(samples[3].expression, / AND REQUIRE /);
  assert.deepEqual(parseConstraintExpression(samples[3].expression), samples[3].ast);

  const migrated = migrateLegacyConstraintRuleAst({
    type: "EXCLUDES",
    when: { type: "EQUALS", feature: "SUNROOF_TYPE", value: "PANORAMIC" },
    then: { type: "NOT_EQUALS", feature: "ROOF_RACK", value: "TYPE_B" }
  });
  assert.equal(migrated.actions[0].type, "EXCLUDE");
  assert.deepEqual(migrated.actions[0].target, {
    type: "EQUALS",
    feature: "ROOF_RACK",
    value: "TYPE_B"
  });
});

test("WYSIWYG condition projection applies De Morgan without changing rule semantics", () => {
  const store = createSeed();
  const features = contextReferences(store, "ctx-SUV").map((reference) =>
    resolveDefinition(store, reference)
  );
  const expression = {
    type: "AND",
    expressions: [
      { type: "EQUALS", feature: "TRIM_LEVEL", value: "PREMIUM" },
      {
        type: "NOT",
        expression: {
          type: "OR",
          expressions: [
            { type: "EQUALS", feature: "VEHICLE_REGION", value: "JAPAN" },
            { type: "EQUALS", feature: "ROOF_RACK", value: "TYPE_B" }
          ]
        }
      }
    ]
  };
  const projected = normalizeConstraintConditionForDesigner(expression);
  assert.deepEqual(projected, {
    type: "AND",
    expressions: [
      { type: "EQUALS", feature: "TRIM_LEVEL", value: "PREMIUM" },
      { type: "NOT_EQUALS", feature: "VEHICLE_REGION", value: "JAPAN" },
      { type: "NOT_EQUALS", feature: "ROOF_RACK", value: "TYPE_B" }
    ]
  });

  for (const region of ["CHINA", "JAPAN", "EUROPE"]) {
    for (const roofRack of ["TYPE_A", "TYPE_B"]) {
      const values = new Map([
        ["TRIM_LEVEL", "PREMIUM"],
        ["VEHICLE_REGION", region],
        ["ROOF_RACK", roofRack]
      ]);
      const toRule = (condition) => ({
        id: "designer-condition",
        code: "CR-DESIGNER",
        name: "Designer condition",
        description: "",
        status: "Draft",
        expression: "",
        ast: {
          condition,
          actions: [
            {
              type: "REQUIRE",
              target: { type: "IN", feature: "DRIVE_TYPE", value: ["AWD", "4WD"] }
            }
          ]
        },
        blueprint: { positions: {} },
        source: { type: "MANUAL" },
        createdBy: "test",
        modifiedAt: "",
        version: 1
      });

      assert.equal(
        activeConstraintEffects([toRule(expression)], features, values).length,
        activeConstraintEffects([toRule(projected)], features, values).length,
        `condition projection must preserve truth for ${region} / ${roofRack}`
      );
    }
  }
});

test("adding AND and OR clauses follows normal precedence without nesting every click", () => {
  const clause = (feature) => ({ type: "EQUALS", feature, value: true });
  let condition = clause("A");
  condition = appendConstraintPredicate(condition, "AND", clause("B"));
  condition = appendConstraintPredicate(condition, "OR", clause("C"));
  condition = appendConstraintPredicate(condition, "AND", clause("D"));
  condition = appendConstraintPredicate(condition, "OR", clause("E"));
  condition = appendConstraintPredicate(condition, "AND", clause("F"));

  assert.deepEqual(condition, {
    type: "OR",
    expressions: [
      { type: "AND", expressions: [clause("A"), clause("B")] },
      { type: "AND", expressions: [clause("C"), clause("D")] },
      { type: "AND", expressions: [clause("E"), clause("F")] }
    ]
  });
  const ruleExpression = formatConstraintExpression({
    condition,
    actions: [{ type: "REQUIRE", target: clause("RESULT") }]
  });
  assert.deepEqual(parseConstraintExpression(ruleExpression).condition, condition);
});

test("constraint seeds use current context features and respect value domains", () => {
  const store = createSeed();
  const features = contextReferences(store, "ctx-SUV").map((reference) =>
    resolveDefinition(store, reference)
  );
  const rules = createConstraintRuleSamples(features);
  assert.equal(rules.length, 5);
  assert.deepEqual(
    rules.flatMap((rule) => validateConstraintRule(rule, rules, features)),
    []
  );
  assert.equal(rules[0].ast.actions[0].type, "REQUIRE");
  assert.match(rules[0].expression, /SUNROOF_TYPE == "PANORAMIC"/);
  assert.match(rules[0].expression, /INTERIOR_PACKAGE == "PREMIUM"/);
});

test("constraint preview reports triggered REQUIRE and EXCLUDE conflicts without changing selections", () => {
  const store = createSeed();
  const features = contextReferences(store, "ctx-SUV").map((reference) =>
    resolveDefinition(store, reference)
  );
  const rules = createConstraintRuleSamples(features).slice(0, 2);
  const conflictingValues = new Map([
    ["SUNROOF_TYPE", "PANORAMIC"],
    ["INTERIOR_PACKAGE", "STANDARD"],
    ["ROOF_RACK", "TYPE_B"]
  ]);
  const conflicts = previewConstraintRules(rules, features, conflictingValues);

  assert.deepEqual(
    conflicts.map((rule) => rule.status),
    ["conflict", "conflict"]
  );
  assert.deepEqual(
    conflicts.map((rule) => rule.actions[0].status),
    ["conflict", "conflict"]
  );
  assert.equal(conflictingValues.get("INTERIOR_PACKAGE"), "STANDARD");

  const activeEffects = activeConstraintEffects(
    rules,
    features,
    new Map([["SUNROOF_TYPE", "PANORAMIC"]])
  );
  assert.deepEqual(
    activeEffects.map((effect) => effect.status),
    ["pending", "satisfied"]
  );
  assert.deepEqual(
    activeEffects.map((effect) => effect.direction),
    ["action", "action"]
  );

  const reverseExclusion = activeConstraintEffects(
    [rules[1]],
    features,
    new Map([["ROOF_RACK", "TYPE_B"]])
  );
  assert.equal(reverseExclusion.length, 1);
  assert.equal(reverseExclusion[0].direction, "condition");
  assert.equal(reverseExclusion[0].status, "satisfied");
  assert.deepEqual(reverseExclusion[0].target, {
    type: "EQUALS",
    feature: "SUNROOF_TYPE",
    value: "PANORAMIC"
  });

  const bidirectionalConflict = activeConstraintEffects(
    [rules[1]],
    features,
    new Map([
      ["SUNROOF_TYPE", "PANORAMIC"],
      ["ROOF_RACK", "TYPE_B"]
    ])
  );
  assert.deepEqual(
    bidirectionalConflict.map((effect) => [effect.direction, effect.status]),
    [
      ["action", "conflict"],
      ["condition", "conflict"]
    ]
  );

  const validValues = new Map([
    ["SUNROOF_TYPE", "PANORAMIC"],
    ["INTERIOR_PACKAGE", "PREMIUM"],
    ["ROOF_RACK", "TYPE_A"]
  ]);
  assert.deepEqual(
    previewConstraintRules(rules, features, validValues).map((rule) => rule.status),
    ["satisfied", "satisfied"]
  );
  assert.deepEqual(
    activeConstraintEffects(rules, features, validValues).map((effect) => effect.status),
    ["satisfied", "satisfied"]
  );
});

test("constraint preview auto-selects unique forced values and clears ambiguous selections", () => {
  const allowed = new Set(["PREMIUM"]);
  assert.equal(reconcileConstrainedSelection("STANDARD", allowed, true), "PREMIUM");
  assert.equal(reconcileConstrainedSelection(undefined, allowed, true), "PREMIUM");
  assert.equal(reconcileConstrainedSelection("PREMIUM", allowed, true), "PREMIUM");
  assert.equal(reconcileConstrainedSelection("STANDARD", new Set(["PREMIUM", "LUXURY"]), true), "");
  assert.deepEqual(reconcileConstrainedSelection(["A", "B", "C"], new Set(["A", "C"]), true), [
    "A",
    "C"
  ]);
  assert.equal(reconcileConstrainedSelection("STANDARD", undefined, true), "STANDARD");
});

test("constraint effects expose the same allowed choices to preview and WYSIWYG forms", () => {
  const store = createSeed();
  const features = contextReferences(store, "ctx-SUV").map((reference) =>
    resolveDefinition(store, reference)
  );
  const effect = (type, feature, operator, value, direction = "action") => ({
    ruleId: "allowed-values",
    code: "CR-ALLOWED",
    name: "Allowed values",
    description: "",
    type,
    target: { type: operator, feature, value },
    status: "pending",
    direction
  });
  const drive = features.find((feature) => feature.code === "DRIVE_TYPE");
  const roofRack = features.find((feature) => feature.code === "ROOF_RACK");
  const sunroof = features.find((feature) => feature.code === "SUNROOF_TYPE");

  assert.deepEqual(
    [
      ...constraintEffectAllowedValues(effect("REQUIRE", "DRIVE_TYPE", "IN", ["AWD", "4WD"]), drive)
    ],
    ["AWD", "4WD"]
  );
  assert.deepEqual(
    [
      ...constraintEffectAllowedValues(effect("EXCLUDE", "ROOF_RACK", "EQUALS", "TYPE_B"), roofRack)
    ],
    ["TYPE_A"]
  );
  assert.deepEqual(
    [
      ...constraintEffectAllowedValues(
        effect("EXCLUDE", "SUNROOF_TYPE", "EQUALS", "PANORAMIC", "condition"),
        sunroof
      )
    ],
    ["STANDARD"]
  );
});

test("constraint preview keeps missing requirements pending and evaluates numeric restrictions", () => {
  const store = createSeed();
  const features = contextReferences(store, "ctx-SUV").map((reference) =>
    resolveDefinition(store, reference)
  );
  const rules = createConstraintRuleSamples(features);
  const missingTarget = previewConstraintRules(
    [rules[0]],
    features,
    new Map([["SUNROOF_TYPE", "PANORAMIC"]])
  );
  assert.equal(missingTarget[0].status, "pending");
  assert.equal(missingTarget[0].actions[0].status, "pending");

  const restrictedBattery = previewConstraintRules(
    [rules[2]],
    features,
    new Map([
      ["DRIVE_TYPE", "AWD"],
      ["BATTERY_CAPACITY", "40"]
    ])
  );
  assert.equal(restrictedBattery[0].status, "conflict");
  assert.equal(restrictedBattery[0].actions[0].status, "conflict");
  assert.equal(
    activeConstraintEffects(
      [rules[2]],
      features,
      new Map([
        ["DRIVE_TYPE", "AWD"],
        ["BATTERY_CAPACITY", "40"]
      ])
    )[0].status,
    "conflict"
  );
  const validBattery = previewConstraintRules(
    [rules[2]],
    features,
    new Map([
      ["DRIVE_TYPE", "AWD"],
      ["BATTERY_CAPACITY", "80"]
    ])
  );
  assert.equal(validBattery[0].status, "satisfied");
});

test("constraint preview never auto-applies SET actions", () => {
  const store = createSeed();
  const features = contextReferences(store, "ctx-SUV").map((reference) =>
    resolveDefinition(store, reference)
  );
  const rule = createConstraintRule({
    id: "preview-set",
    code: "CR-PREVIEW-SET",
    name: "Preview set action",
    ast: {
      condition: { type: "EQUALS", feature: "SUNROOF_TYPE", value: "PANORAMIC" },
      actions: [
        {
          type: "SET",
          target: { type: "EQUALS", feature: "INTERIOR_PACKAGE", value: "PREMIUM" }
        }
      ]
    }
  });
  const values = new Map([
    ["SUNROOF_TYPE", "PANORAMIC"],
    ["INTERIOR_PACKAGE", "STANDARD"]
  ]);
  const [preview] = previewConstraintRules([rule], features, values);

  assert.equal(preview.status, "not-applied");
  assert.equal(preview.actions[0].status, "not-applied");
  assert.equal(values.get("INTERIOR_PACKAGE"), "STANDARD");
});

test("constraint operators follow feature data types and selected action semantics", () => {
  assert.deepEqual(constraintOperatorsFor("Boolean"), ["EQUALS", "NOT_EQUALS"]);
  assert.deepEqual(constraintOperatorsFor("Enumeration"), ["EQUALS", "NOT_EQUALS", "IN", "NOT_IN"]);
  assert.deepEqual(constraintOperatorsFor("Integer"), [
    "EQUALS",
    "NOT_EQUALS",
    "GREATER_THAN",
    "GREATER_THAN_OR_EQUAL",
    "LESS_THAN",
    "LESS_THAN_OR_EQUAL"
  ]);
  assert.ok(constraintOperatorsFor("String").includes("ENDS_WITH"));
  assert.deepEqual(constraintOperatorsFor("Integer", "SET"), ["EQUALS"]);
  assert.deepEqual(constraintOperatorsFor("Enumeration", "EXCLUDE"), ["EQUALS", "IN"]);
});

test("constraint validation reports invalid features, operators, values and cycles", () => {
  const store = createSeed();
  const features = contextReferences(store, "ctx-SUV").map((reference) =>
    resolveDefinition(store, reference)
  );
  const rules = createConstraintRuleSamples(features);
  const invalid = createConstraintRule({
    id: "invalid-expression",
    code: "CR-INVALID",
    name: "Invalid expression",
    ast: {
      condition: { type: "GREATER_THAN_OR_EQUAL", feature: "DRIVE_TYPE", value: "AWD" },
      actions: [
        {
          type: "REQUIRE",
          target: { type: "EQUALS", feature: "UNKNOWN_FEATURE", value: "X" }
        }
      ]
    }
  });
  const issues = validateConstraintRule(invalid, rules, features);
  assert.ok(issues.some((issue) => issue.code === "OPERATOR_NOT_SUPPORTED"));
  assert.ok(issues.some((issue) => issue.code === "FEATURE_NOT_FOUND"));
  assert.throws(() => parseConstraintExpression('DRIVE_TYPE == "AWD"'), /WHEN .* THEN/);
  const inactiveFeatures = features.map((feature) =>
    feature.code === "SUNROOF_TYPE" ? { ...feature, active: false } : feature
  );
  assert.ok(
    validateConstraintRule(rules[0], rules, inactiveFeatures).some(
      (issue) => issue.code === "FEATURE_INACTIVE"
    )
  );

  const circular = createConstraintRule({
    id: "circular-rule",
    code: "CR-CYCLE",
    name: "Circular rule",
    ast: {
      condition: { type: "EQUALS", feature: "BATTERY_CAPACITY", value: 80 },
      actions: [
        { type: "REQUIRE", target: { type: "EQUALS", feature: "DRIVE_TYPE", value: "AWD" } }
      ]
    }
  });
  const existing = createConstraintRule({
    id: "reverse-rule",
    code: "CR-REVERSE",
    name: "Reverse rule",
    ast: {
      condition: { type: "EQUALS", feature: "DRIVE_TYPE", value: "AWD" },
      actions: [
        {
          type: "RESTRICT",
          target: { type: "EQUALS", feature: "BATTERY_CAPACITY", value: 80 }
        }
      ]
    }
  });
  assert.ok(
    validateConstraintRule(circular, [existing], features).some(
      (issue) => issue.code === "CIRCULAR_DEPENDENCY"
    )
  );
});

test("constraint sample feature migration is additive and idempotent", () => {
  const store = createSeed();
  const sampleCodes = new Set([
    "SUNROOF_TYPE",
    "INTERIOR_PACKAGE",
    "ROOF_RACK",
    "WINTER_PACKAGE",
    "HEATED_STEERING",
    "HEATED_SEAT"
  ]);
  const removedDefinitionIds = new Set(
    store.definitions
      .filter((definition) => sampleCodes.has(definition.code))
      .map((item) => item.id)
  );
  store.definitions = store.definitions.filter(
    (definition) => !removedDefinitionIds.has(definition.id)
  );
  store.references = store.references.filter(
    (reference) => !removedDefinitionIds.has(reference.featureDefinitionId)
  );
  store.families = store.families.filter(
    (family) => !["FAM_INTERIOR_PACKAGE", "FAM_SUNROOF", "FAM_ROOF_RACK"].includes(family.code)
  );
  const migrated = ensureConstraintSampleFeatures(store);
  assert.ok(
    [...sampleCodes].every((code) => migrated.definitions.some((item) => item.code === code))
  );
  assert.deepEqual(validateStore(migrated), []);
  const repeated = ensureConstraintSampleFeatures(migrated);
  assert.equal(repeated.definitions.length, migrated.definitions.length);
  assert.equal(repeated.references.length, migrated.references.length);
});
