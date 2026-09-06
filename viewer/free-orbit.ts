import { Quaternion, Vector3 } from "three";

/** Rotate eye AND up in the current screen plane. No fixed world-up or pole clamp. */
export function freeOrbit(eye: Vector3, target: Vector3, up: Vector3, dx: number, dy: number) {
  const offset = eye.clone().sub(target);
  const right = up.clone().cross(offset).normalize();
  const axis = up.clone().multiplyScalar(-dx).addScaledVector(right, -dy);
  const angle = (Math.hypot(dx, dy) * Math.PI) / 360;
  if (angle === 0) return { eye: eye.clone(), up: up.clone() };
  const rotation = new Quaternion().setFromAxisAngle(axis.normalize(), angle);
  return {
    eye: offset.applyQuaternion(rotation).add(target),
    up: up.clone().applyQuaternion(rotation).normalize()
  };
}
