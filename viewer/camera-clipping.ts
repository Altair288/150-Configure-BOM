import { Box3, OrthographicCamera, PerspectiveCamera, Vector3 } from "three";

function depths(camera: PerspectiveCamera | OrthographicCamera, bounds: Box3, forward: Vector3) {
  let closest = Infinity,
    furthest = -Infinity;
  for (const x of [bounds.min.x, bounds.max.x])
    for (const y of [bounds.min.y, bounds.max.y])
      for (const z of [bounds.min.z, bounds.max.z]) {
        const depth = new Vector3(x, y, z).sub(camera.position).dot(forward);
        closest = Math.min(closest, depth);
        furthest = Math.max(furthest, depth);
      }
  return { closest, furthest };
}

/** Clipping must never translate the orbit target.
 * Orthographic projection can cover signed depths without moving the eye.
 * Perspective protects the focused part, while retaining the assembly's far range.
 */
export function cameraClipping(
  camera: PerspectiveCamera | OrthographicCamera,
  bounds: Box3,
  focusBounds: Box3 = bounds
): { retreat: Vector3; near: number; far: number } | undefined {
  if (bounds.isEmpty()) return undefined;
  const size = bounds.getSize(new Vector3()).length();
  if (!Number.isFinite(size) || size === 0) return undefined;
  const forward = camera.getWorldDirection(new Vector3());
  const scene = depths(camera, bounds, forward);
  const sceneMargin = Math.max(size * 0.01, 0.001);
  if (camera instanceof OrthographicCamera) {
    return {
      retreat: new Vector3(),
      near: scene.closest - sceneMargin,
      far: scene.furthest + sceneMargin
    };
  }
  const focus = focusBounds.isEmpty() ? bounds : focusBounds;
  const focusSize = focus.getSize(new Vector3()).length();
  const margin = Math.max(focusSize * 0.01, 0.00001);
  const { closest } = depths(camera, focus, forward);
  const retreatDistance = Math.max(0, margin - closest);
  return {
    retreat: forward.multiplyScalar(-retreatDistance),
    near: Math.max(focusSize * 1e-6, Math.min(margin * 0.1, (closest + retreatDistance) * 0.5)),
    far: Math.max(margin * 2, scene.furthest + retreatDistance + sceneMargin)
  };
}
