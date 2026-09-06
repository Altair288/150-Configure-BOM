import {
  BoxGeometry,
  BufferGeometry,
  CylinderGeometry,
  Float32BufferAttribute,
  Quaternion,
  TorusGeometry,
  Vector3
} from "three";

type Point = [number, number, number];

/** Millimetres, XY is the bicycle side plane. Each result is one selectable BOM part. */
export function bicycleGeometry(key: string): BufferGeometry | undefined {
  const pieces: BufferGeometry[] = [];
  const tube = (a: Point, b: Point, radius = 12) => {
    const start = new Vector3(...a),
      end = new Vector3(...b);
    const delta = end.clone().sub(start);
    const geometry = new CylinderGeometry(radius, radius, delta.length(), 12);
    geometry.applyQuaternion(
      new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), delta.normalize())
    );
    geometry.translate(...(start.add(end).multiplyScalar(0.5).toArray() as Point));
    pieces.push(geometry);
  };
  const ring = (
    x: number,
    y: number,
    z: number,
    radius: number,
    thickness: number,
    arc = Math.PI * 2
  ) => {
    const geometry = new TorusGeometry(radius, thickness, 10, 64, arc);
    geometry.translate(x, y, z);
    pieces.push(geometry);
  };
  const box = (center: Point, size: Point) => {
    const geometry = new BoxGeometry(...size);
    geometry.translate(...center);
    pieces.push(geometry);
  };
  const rear: Point = [-520, 0, 0],
    front: Point = [520, 0, 0];
  const bottom: Point = [-100, -80, 0],
    seat: Point = [-210, 470, 0];
  const head: Point = [320, 450, 0],
    headBottom: Point = [350, 310, 0];
  if (key === "frame") {
    tube(bottom, seat, 24);
    tube(seat, head, 23);
    tube(head, headBottom, 30);
    tube(headBottom, bottom, 29);
    for (const z of [-38, 38]) {
      tube(bottom, [-520, 0, z], 13);
      tube(seat, [-520, 0, z], 13);
    }
  } else if (key === "fork") {
    for (const z of [-42, 42]) tube([350, 330, z], [520, 0, z], 17);
    tube([350, 330, -42], [350, 330, 42], 20);
  } else if (key === "cockpit") {
    tube(head, [300, 550, 0], 17);
    tube([300, 550, 0], [385, 565, 0], 17);
    tube([385, 565, -240], [385, 565, 240], 13);
    for (const z of [-205, 205]) tube([385, 565, z - 45], [385, 565, z + 45], 19);
  } else if (key === "cockpit-flat") {
    tube(head, [300, 550, 0], 17);
    tube([300, 550, 0], [250, 590, 0], 17);
    tube([250, 590, -205], [250, 590, 205], 15);
    for (const z of [-205, 205]) tube([250, 590, z - 42], [250, 590, z + 42], 20);
  } else if (key === "cockpit-drop") {
    tube(head, [300, 550, 0], 17);
    tube([300, 550, 0], [380, 570, 0], 17);
    tube([380, 570, -215], [380, 570, 215], 13);
    for (const z of [-205, 205]) {
      tube([380, 570, z], [340, 500, z], 11);
      tube([340, 500, z], [385, 455, z], 11);
    }
  } else if (key === "cockpit-comfort") {
    tube(head, [285, 545, 0], 17);
    tube([285, 545, 0], [245, 625, 0], 16);
    tube([245, 625, -225], [245, 625, 225], 18);
    for (const z of [-190, 190]) tube([245, 625, z - 42], [245, 625, z + 42], 22);
  } else if (key === "saddle" || key === "saddle-comfort") {
    tube(seat, [-245, 610, 0], 15);
    box([-255, 630, 0], [240, 38, 135]);
  } else if (key === "saddle-sport") {
    tube(seat, [-245, 610, 0], 15);
    box([-255, 625, 0], [205, 26, 95]);
  } else if (key === "saddle-gel") {
    tube(seat, [-245, 610, 0], 15);
    box([-255, 635, 0], [220, 50, 170]);
    box([-355, 650, 0], [45, 34, 185]);
  } else if (key.endsWith("-wheel")) {
    const x = key.startsWith("front") ? front[0] : rear[0];
    ring(x, 0, 0, 310, 12);
    tube([x, 0, -45], [x, 0, 45], 24);
    for (let i = 0; i < 24; i++) {
      const angle = (i * Math.PI) / 12;
      tube([x, 0, i % 2 ? -22 : 22], [x + 303 * Math.cos(angle), 303 * Math.sin(angle), 0], 2.5);
    }
  } else if (key.endsWith("-road") || key.endsWith("-gravel") || key.endsWith("-city")) {
    ring(
      key.startsWith("front") ? 520 : -520,
      0,
      0,
      328,
      key.endsWith("gravel") ? 25 : key.endsWith("city") ? 20 : 15
    );
  } else if (key === "crank") {
    ring(-100, -80, 55, 88, 9);
    tube([-100, -80, -70], [-100, -80, 70], 22);
    tube([-100, -80, 70], [20, -190, 70], 13);
    box([20, -190, 115], [90, 24, 95]);
    tube([-100, -80, -70], [-220, 30, -70], 13);
    box([-220, 30, -115], [90, 24, 95]);
  } else if (key === "chain") {
    ring(-520, 0, 55, 48, 8);
    tube([-520, 48, 55], [-100, 8, 55], 5);
    tube([-520, -48, 55], [-100, -168, 55], 5);
  } else if (key === "brakes") {
    for (const x of [-520, 520]) {
      ring(x, 0, -48, 90, 10);
      ring(x, 0, -48, 33, 8);
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3;
        tube(
          [x + 30 * Math.cos(a), 30 * Math.sin(a), -48],
          [x + 86 * Math.cos(a + 0.2), 86 * Math.sin(a + 0.2), -48],
          5
        );
      }
      box([x + 65, 70, -48], [65, 45, 35]);
    }
  } else if (key === "rack") {
    for (const z of [-90, 90]) {
      tube([-700, 390, z], [-340, 390, z], 9);
      tube([-520, 0, z / 2], [-670, 390, z], 7);
      tube([-520, 0, z / 2], [-360, 390, z], 7);
    }
    for (const x of [-680, -570, -460, -350]) tube([x, 390, -90], [x, 390, 90], 7);
  } else if (key === "fenders" || key === "fenders-full") {
    for (const x of [-520, 520]) ring(x, 0, 0, 368, 17, Math.PI);
  } else if (key === "fenders-short") {
    for (const x of [-520, 520]) ring(x, 0, 0, 350, 10, Math.PI * 0.72);
  } else if (key === "fenders-gravel") {
    for (const x of [-520, 520]) ring(x, 0, 0, 380, 14, Math.PI * 0.88);
  } else if (key === "lights") {
    box([405, 540, 0], [55, 32, 48]);
    box([-365, 590, 0], [25, 38, 55]);
  } else return undefined;

  const positions: number[] = [],
    normals: number[] = [];
  for (const piece of pieces) {
    const geometry = piece.index ? piece.toNonIndexed() : piece;
    positions.push(...geometry.getAttribute("position").array);
    normals.push(...geometry.getAttribute("normal").array);
    if (geometry !== piece) geometry.dispose();
    piece.dispose();
  }
  const result = new BufferGeometry();
  result.setAttribute("position", new Float32BufferAttribute(positions, 3));
  result.setAttribute("normal", new Float32BufferAttribute(normals, 3));
  return result;
}
