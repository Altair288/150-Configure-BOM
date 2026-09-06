import assert from "node:assert/strict";
import test from "node:test";
import { Vector3 } from "three";
import { freeOrbit } from "./free-orbit.ts";

test("vertical orbit crosses both poles and completes 360 degrees", () => {
  const target = new Vector3(30, 20, 10);
  const initial = target.clone().add(new Vector3(0, 0, 100));
  let eye = initial.clone(),
    up = new Vector3(0, 1, 0);
  for (let i = 0; i < 720; i++) {
    ({ eye, up } = freeOrbit(eye, target, up, 0, 1));
    assert.ok(Math.abs(eye.distanceTo(target) - 100) < 1e-8);
    assert.ok(Math.abs(up.dot(eye.clone().sub(target))) < 1e-8);
    if (i === 359) assert.ok(up.y < -0.999, "up must invert, not clamp at the pole");
  }
  assert.ok(eye.distanceTo(initial) < 1e-8);
  assert.ok(up.distanceTo(new Vector3(0, 1, 0)) < 1e-8);
});

test("horizontal orbit follows camera up instead of world Z; mixed drag is reversible", () => {
  const target = new Vector3();
  const eye = new Vector3(0, 0, 100),
    up = new Vector3(0, 1, 0);
  const horizontal = freeOrbit(eye, target, up, 180, 0);
  assert.ok(Math.abs(horizontal.eye.x) > 99, "horizontal drag must move a Z-facing camera");
  const rotated = freeOrbit(eye, target, up, 127, -253);
  const restored = freeOrbit(rotated.eye, target, rotated.up, -127, 253);
  assert.ok(restored.eye.distanceTo(eye) < 1e-8);
  assert.ok(restored.up.distanceTo(up) < 1e-8);
});
