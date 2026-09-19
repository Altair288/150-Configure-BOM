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
  definitionUsage
} from "../webapp/model/configuration.ts";

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

test("optional false is a valid boolean and FWD plus Offroad are independently valid", () => {
  const store = createSeed();
  const bool = store.definitions.find((d) => d.code === "DRIVER_ADJUST");
  assert.deepEqual(validateValue(bool, false, true), []);
  assert.deepEqual(validateValue(bool, "", false), []);
  assert.ok(validateValue(bool, "", true).length);
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
