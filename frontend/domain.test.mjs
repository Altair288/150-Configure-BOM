import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import test from "node:test";

// Node 24 strips types; resolve the same extensionless TS imports as the bundler.
registerHooks({
  resolve(specifier, context, nextResolve) {
    try {
      return nextResolve(specifier, context);
    } catch (error) {
      if (specifier.startsWith(".") && !/\.[a-z]+$/i.test(specifier))
        return nextResolve(`${specifier}.ts`, context);
      throw error;
    }
  }
});
const { initialConfiguration, materials, templates } =
  await import("./features/product-configurator/mock/catalog.ts");
const { resolveConfiguration } = await import("./features/product-configurator/engine/resolve.ts");
const { bomAssembler } = await import("./features/product-configurator/engine/bomAssembler.ts");
const { store } = await import("./features/product-configurator/model/store.ts");
const { bicycleGeometry } = await import("../viewer/bicycle-geometry.ts");
const flatten = (nodes) => nodes.flatMap((n) => [n, ...flatten(n.children ?? [])]);

test("three templates resolve and assemble only their material BOMs", () => {
  for (const template of templates) {
    const config = initialConfiguration(template.id);
    const resolution = resolveConfiguration(config);
    assert.equal(resolution.valid, true, template.id);
    const bom = bomAssembler(config, true);
    assert.equal(bom.nodes[0].number, "BIKE-100");
    assert.equal(bom.partCount, { standard: 12, commuter: 14, explore: 11 }[template.id]);
    const nodes = flatten(bom.nodes);
    assert.equal(new Set(nodes.map((n) => n.id)).size, nodes.length);
    assert.ok(nodes.every((n) => n.state !== "未选用" && n.rule));
    assert.equal(
      nodes.some((n) => n.number === "FR-102"),
      template.id === "explore"
    );
    assert.equal(
      nodes.some((n) => n.number === "AC-403"),
      template.id === "commuter"
    );
  }
});
test("Gravel conflict blocks generation and the declared recommendation repairs it", () => {
  const config = initialConfiguration("explore");
  config.overrides = { WHEEL_TYPE: "ROAD", WHEEL_SIZE: "700x28C" };
  const resolution = resolveConfiguration(config);
  assert.equal(resolution.valid, false);
  const conflict = resolution.rules.find((r) => r.rule.id === "RULE-003");
  assert.equal(conflict.status, "Conflict");
  assert.throws(() => bomAssembler(config, true));
  Object.assign(config.overrides, conflict.rule.fix);
  assert.equal(resolveConfiguration(config).valid, true);
});
test("schema-valid but unavailable material is explicit NO_MATCH", () => {
  const config = initialConfiguration();
  config.overrides = { FRAME_MATERIAL: "STEEL" };
  assert.equal(resolveConfiguration(config).matches[0].status, "NO_MATCH");
  assert.throws(() => bomAssembler(config, true));
});
test("multiple candidates require an eligible explicit decision", () => {
  const config = initialConfiguration();
  config.overrides = { FRAME_STYLE: "COMFORT" };
  assert.equal(resolveConfiguration(config).matches[0].status, "AMBIGUOUS");
  config.decisions.FRAME = "FR-100";
  assert.equal(resolveConfiguration(config).valid, false);
  config.decisions.FRAME = "FR-600";
  const bom = bomAssembler(config);
  assert.ok(flatten(bom.nodes).some((n) => n.number === "FR-106"));
  assert.ok(!flatten(bom.nodes).some((n) => n.number === "FR-105"));
});
test("warnings need explicit acceptance and technical requirements retain provenance", () => {
  const config = initialConfiguration("standard");
  assert.throws(() => bomAssembler(config));
  assert.ok(bomAssembler(config, true));
  config.overrides = { LIGHT: true };
  const requirement = resolveConfiguration(config).requirements.find((r) => r.feature === "LIGHT");
  assert.equal(requirement.source, "technical");
  assert.ok(bomAssembler(config));
});
test("configuration edits invalidate generated BOM and stale candidate decisions", () => {
  store.template("commuter");
  store.generate(false);
  assert.ok(store.getSnapshot().generated);
  store.technical("FRAME_STYLE", "COMFORT");
  store.decide("FRAME", "FR-500");
  assert.equal(store.getSnapshot().generated, undefined);
  store.technical("FRAME_STYLE", "SPORT");
  assert.deepEqual(store.getSnapshot().configuration.decisions, {});
});
test("every geometric material has a valid viewer mapping, including light and 35C tires", () => {
  for (const material of materials.filter((m) => m.geometryKey)) {
    const geometry = bicycleGeometry(material.geometryKey);
    assert.ok(geometry, material.code);
    assert.ok(Array.from(geometry.attributes.position.array).every(Number.isFinite));
    geometry.dispose();
  }
});
