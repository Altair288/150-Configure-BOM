import { Quaternion, Vector3 } from "three";

/** Rotate eye AND up in the current screen plane. No fixed world-up or pole clamp. */
export function freeOrbit(eye: Vector3, target: Vector3, up: Vector3, dx: number, dy: number) {
  const offset = eye.clone().sub(target);
  const forward = offset.clone().normalize();
  // Camera.up is a lookAt hint, not necessarily perpendicular to the view.
  // Using it directly introduces roll until a preset happens to align the axes.
  const right = up.clone().cross(forward).normalize();
  if (right.lengthSq() < 1e-12) {
    right
      .crossVectors(
        Math.abs(forward.z) < 0.9 ? new Vector3(0, 0, 1) : new Vector3(0, 1, 0),
        forward
      )
      .normalize();
  }
  const screenUp = forward.clone().cross(right).normalize();
  const axis = screenUp.clone().multiplyScalar(-dx).addScaledVector(right, -dy);
  const angle = (Math.hypot(dx, dy) * Math.PI) / 360;
  if (angle === 0) return { eye: eye.clone(), up: screenUp };
  const rotation = new Quaternion().setFromAxisAngle(axis.normalize(), angle);
  return {
    eye: offset.applyQuaternion(rotation).add(target),
    up: screenUp.applyQuaternion(rotation).normalize()
  };
}
