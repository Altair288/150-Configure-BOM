import assert from "node:assert/strict";
import test from "node:test";
import { cubeRegions, cubeUp } from "./view-cube.ts";

test("cube exposes six axial views and eight distinct isometric views", () => {
  const regions = cubeRegions();
  assert.equal(regions.filter((r) => !r.corner).length, 6);
  assert.equal(regions.filter((r) => r.corner).length, 8);
  assert.equal(new Set(regions.map((r) => r.normal.toArray().join())).size, 14);
  for (const region of regions) {
    const up = cubeUp(region.normal);
    assert.ok(Math.abs(region.normal.dot(up)) < 1e-10);
    assert.ok(Math.abs(up.length() - 1) < 1e-10);
    assert.equal(region.vertices.length, region.corner ? 3 : 8);
  }
});

test("cube has no gaps: every clickable surface edge is shared by exactly two regions", () => {
  const edges = new Map();
  for (const region of cubeRegions()) {
    region.vertices.forEach((vertex, i) => {
      const key = [
        vertex.toArray().join(),
        region.vertices[(i + 1) % region.vertices.length].toArray().join()
      ]
        .sort()
        .join("|");
      edges.set(key, (edges.get(key) ?? 0) + 1);
    });
  }
  for (const count of edges.values()) assert.equal(count, 2);
});
