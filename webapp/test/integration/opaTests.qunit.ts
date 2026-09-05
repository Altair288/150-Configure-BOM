interface TestAssert {
  ok(value: unknown, message?: string): void;
}

interface QUnitApi {
  module(name: string): void;
  test(name: string, callback: (assert: TestAssert) => void): void;
}

const qunit = (globalThis as typeof globalThis & { QUnit: QUnitApi }).QUnit;

qunit.module("Application integration");

qunit.test("application integration entry point is available", (assert) => {
  assert.ok(document.getElementById("content"), "the UI5 application host can be mounted");
});
