import RuleEngine from "../../domain/configurator/RuleEngine";

interface TestAssert {
  strictEqual(actual: unknown, expected: unknown): void;
  deepEqual(actual: unknown, expected: unknown): void;
}

interface QUnitApi {
  module(name: string): void;
  test(name: string, callback: (assert: TestAssert) => void): void;
}

const qunit = (globalThis as typeof globalThis & { QUnit: QUnitApi }).QUnit;

qunit.module("RuleEngine");

qunit.test("forces 8AT and comfort options for a 2.0T leather configuration", (assert) => {
  const evaluation = new RuleEngine().evaluate({
    engine: "2.0T",
    gearbox: "7DCT",
    seatMaterial: "Leather"
  });

  assert.strictEqual(evaluation.gearbox, "8AT");
  assert.deepEqual(evaluation.enabledOptions, [
    "PERFORMANCE_EXHAUST",
    "SEAT_HEATING",
    "SEAT_VENTILATION"
  ]);
});

qunit.test("does not add leather-only options for fabric seats", (assert) => {
  const evaluation = new RuleEngine().evaluate({
    engine: "1.5T",
    gearbox: "7DCT",
    seatMaterial: "Fabric"
  });

  assert.strictEqual(evaluation.gearbox, "7DCT");
  assert.deepEqual(evaluation.enabledOptions, []);
});
