import assert from "node:assert/strict";
import test from "node:test";
import { PerspectiveCamera, OrthographicCamera, Vector3 } from "three";
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

test("oblique initial up hint produces the same orbit as actual screen up in both camera types", () => {
  for (const camera of [new PerspectiveCamera(), new OrthographicCamera()]) {
    const target = new Vector3(15, -20, 30);
    const eye = new Vector3(1500, 1500, 1500);
    const hint = new Vector3(0, 0, 1);
    camera.position.copy(eye);
    camera.up.copy(hint);
    camera.lookAt(target);
    const screenUp = new Vector3(0, 1, 0).applyQuaternion(camera.quaternion);
    const orbit = freeOrbit(eye, target, hint, 90, 0);
    const expected = freeOrbit(eye, target, screenUp, 90, 0);
    assert.ok(orbit.eye.distanceTo(expected.eye) < 1e-8);
    assert.ok(orbit.up.distanceTo(screenUp) < 1e-8, "horizontal drag must not roll screen up");
    assert.ok(Math.abs(orbit.up.dot(orbit.eye.clone().sub(target))) < 1e-8);
  }
});

test("parallel up hint has a finite orthogonal fallback", () => {
  const orbit = freeOrbit(new Vector3(0, 0, 10), new Vector3(), new Vector3(0, 0, 1), 20, 30);
  assert.ok(Math.abs(orbit.up.length() - 1) < 1e-8);
  assert.ok(Math.abs(orbit.up.dot(orbit.eye)) < 1e-8);
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
