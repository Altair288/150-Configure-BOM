import assert from "node:assert/strict";
import test from "node:test";
import { Box3, OrthographicCamera, PerspectiveCamera, Vector3 } from "three";
import { cameraClipping } from "./camera-clipping.ts";

const bounds = new Box3(new Vector3(-500, -300, -200), new Vector3(500, 300, 200));

for (const type of ["orthographic", "perspective"]) {
  test(`${type}: deep zoom, rotation and distant views keep every corner within the depth range`, () => {
    for (const eye of [new Vector3(0, 0, 20), new Vector3(50, 30, 70), new Vector3(0, 0, 100000)]) {
      const camera =
        type === "orthographic"
          ? new OrthographicCamera(-30, 30, 20, -20, 0.1, 1000)
          : new PerspectiveCamera(50, 1.5, 0.1, 1000);
      camera.position.copy(eye);
      camera.lookAt(new Vector3());
      const sample = new Vector3(100, 80, 0);
      camera.updateMatrixWorld(true);
      const before = sample.clone().project(camera);
      const result = cameraClipping(camera, bounds);
      assert.ok(result);
      camera.position.add(result.retreat);
      camera.near = result.near;
      camera.far = result.far;
      camera.updateProjectionMatrix();
      camera.updateMatrixWorld(true);
      for (const x of [bounds.min.x, bounds.max.x])
        for (const y of [bounds.min.y, bounds.max.y])
          for (const z of [bounds.min.z, bounds.max.z]) {
            const projected = new Vector3(x, y, z).project(camera);
            assert.ok(
              projected.z > -1 && projected.z < 1,
              `clipped corner at depth ${projected.z}`
            );
          }
      if (type === "orthographic") {
        const after = sample.clone().project(camera);
        assert.ok(Math.abs(before.x - after.x) < 1e-8);
        assert.ok(Math.abs(before.y - after.y) < 1e-8);
      }
      assert.ok(camera.far > camera.near);
      if (type === "perspective") assert.ok(camera.near > 0);
      else assert.equal(result.retreat.lengthSq(), 0);
    }
  });
}

test("empty scenes do not change the camera", () => {
  assert.equal(cameraClipping(new PerspectiveCamera(), new Box3()), undefined);
});

test("a small fastener in a large assembly keeps its orbit center and close-up scale", () => {
  const assembly = new Box3(new Vector3(-10000, -10000, -10000), new Vector3(10000, 10000, 10000));
  const target = new Vector3(3000, 2000, 1000);
  const nut = new Box3(target.clone().addScalar(-5), target.clone().addScalar(5));
  for (const camera of [new PerspectiveCamera(), new OrthographicCamera(-10, 10, 10, -10)]) {
    for (let angle = 0; angle < Math.PI * 2; angle += 0.2) {
      camera.position.copy(target).add(new Vector3(Math.cos(angle) * 30, Math.sin(angle) * 30, 10));
      camera.lookAt(target);
      const before = camera.position.clone();
      const clipping = cameraClipping(camera, assembly, nut);
      assert.ok(clipping);
      assert.equal(
        clipping.retreat.lengthSq(),
        0,
        "assembly must not push the camera away from the nut"
      );
      camera.position.add(clipping.retreat);
      camera.lookAt(target);
      camera.near = clipping.near;
      camera.far = clipping.far;
      camera.updateProjectionMatrix();
      camera.updateMatrixWorld(true);
      const center = target.clone().project(camera);
      assert.ok(Math.abs(center.x) < 1e-8 && Math.abs(center.y) < 1e-8);
      assert.ok(center.z > -1 && center.z < 1);
      assert.ok(camera.position.distanceTo(before) < 1e-8);
    }
  }
});
