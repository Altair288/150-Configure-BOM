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
  ensureConstraintSampleFeatures
} from "../webapp/model/configuration.ts";
import {
  appendConstraintPredicate,
  activeConstraintEffects,
  reconcileConstrainedSelection,
  createConstraintRule,
  createConstraintRuleSamples,
  constraintOperatorsFor,
  formatConstraintExpression,
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

test("publishing a reusable definition never changes existing references", () => {
  const store = createSeed();
  const ref = store.references.find((r) => r.featureDefinitionId === "def-DRIVE_TYPE");
  const original = structuredClone(resolveDefinition(store, ref));
  const edited = structuredClone(original);
  edited.name = "Drive Type revised";
  edited.domain.values.pop();
  const next = publishDefinition(store, edited);
  assert.equal(next.version, 2);
  assert.deepEqual(resolveDefinition(store, ref), original);
  ref.definitionVersion = 2;
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
