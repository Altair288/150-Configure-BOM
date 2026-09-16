import { Quaternion, Vector3 } from "three";

export interface CubeRegion {
  name: string;
  normal: Vector3;
  vertices: Vector3[];
  corner: boolean;
}

/** A truncated cube: six octagonal faces and eight triangular corner targets. Z is up. */
export function cubeRegions(): CubeRegion[] {
  const regions: CubeRegion[] = [];
  const names = [
    ["Left", "Right"],
    ["Front", "Back"],
    ["Bottom", "Top"]
  ];
  for (let axis = 0; axis < 3; axis++)
    for (const sign of [-1, 1]) {
      const normal = new Vector3().setComponent(axis, sign);
      const u = (axis + 1) % 3,
        v = (axis + 2) % 3;
      const points = [
        [-1, -0.55],
        [-0.55, -1],
        [0.55, -1],
        [1, -0.55],
        [1, 0.55],
        [0.55, 1],
        [-0.55, 1],
        [-1, 0.55]
      ];
      regions.push({
        name: names[axis][sign === 1 ? 1 : 0],
        normal,
        corner: false,
        vertices: points.map(([a, b]) => normal.clone().setComponent(u, a).setComponent(v, b))
      });
    }
  for (const x of [-1, 1])
    for (const y of [-1, 1])
      for (const z of [-1, 1]) {
        regions.push({
          name: `${z > 0 ? "Top" : "Bottom"} ${y > 0 ? "Back" : "Front"} ${x > 0 ? "Right" : "Left"}`,
          normal: new Vector3(x, y, z).normalize(),
          corner: true,
          vertices: [
            new Vector3(x * 0.55, y, z),
            new Vector3(x, y * 0.55, z),
            new Vector3(x, y, z * 0.55)
          ]
        });
      }
  return regions;
}

export function cubeUp(direction: Vector3): Vector3 {
  const reference = Math.abs(direction.z) > 0.999 ? new Vector3(0, 1, 0) : new Vector3(0, 0, 1);
  return reference.addScaledVector(direction, -reference.dot(direction)).normalize();
}

export class ViewCube {
  private readonly element: HTMLElement;
  private readonly regions = cubeRegions();
  private readonly surfaces: {
    region: CubeRegion;
    group: SVGGElement;
    polygon: SVGPolygonElement;
    label?: SVGTextElement;
  }[];

  constructor(host: HTMLElement, onSelect: (direction: Vector3) => void) {
    this.element = document.createElement("section");
    this.element.className = "cadViewCube";
    this.element.setAttribute("aria-label", "视图立方体：六面与八个顶点");
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 160 160");
    svg.setAttribute("role", "group");
    svg.setAttribute("aria-label", "点击面或顶点切换视角");
    this.surfaces = this.regions.map((region) => {
      const group = document.createElementNS(ns, "g");
      group.setAttribute("role", "button");
      group.setAttribute("tabindex", "0");
      group.setAttribute("aria-label", region.name + (region.corner ? " 等轴测视图" : " 视图"));
      const title = document.createElementNS(ns, "title");
      title.textContent = region.name;
      const polygon = document.createElementNS(ns, "polygon");
      group.append(title, polygon);
      const label = region.corner ? undefined : document.createElementNS(ns, "text");
      if (label) {
        label.textContent = region.name;
        label.setAttribute("text-anchor", "middle");
        label.setAttribute("dominant-baseline", "central");
        group.append(label);
      }
      group.addEventListener("click", () => onSelect(region.normal.clone()));
      group.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(region.normal.clone());
        }
      });
      svg.append(group);
      return { region, group, polygon, label };
    });
    // Also expose hidden/back-facing targets through an accessible selector.
    const select = document.createElement("select");
    select.setAttribute("aria-label", "标准视图：六面与八个顶点");
    select.add(new Option("标准视图", ""));
    this.regions.forEach((r, i) => select.add(new Option(r.name, String(i))));
    select.addEventListener("change", () => {
      if (select.value !== "") onSelect(this.regions[Number(select.value)].normal.clone());
      select.value = "";
    });
    this.element.append(svg, select);
    // Cube interactions must never start part selection, orbit or wheel zoom.
    for (const name of [
      "pointerdown",
      "pointermove",
      "pointerup",
      "pointerout",
      "wheel",
      "contextmenu"
    ]) {
      this.element.addEventListener(name, (event) => {
        event.stopPropagation();
        if (name === "contextmenu") event.preventDefault();
      });
    }
    host.append(this.element);
  }

  update(quaternion: Quaternion): void {
    const inverse = quaternion.clone().invert();
    for (const { region, group, polygon, label } of this.surfaces) {
      const facing = region.normal.clone().applyQuaternion(inverse).z;
      group.style.display = facing > 0.001 ? "" : "none";
      if (facing <= 0.001) continue;
      const points = region.vertices.map((vertex) => vertex.clone().applyQuaternion(inverse));
      polygon.setAttribute(
        "points",
        points.map((p) => `${80 + p.x * 43},${80 - p.y * 43}`).join(" ")
      );
      polygon.setAttribute("fill", region.corner ? "#e1e7ed" : `hsl(210 15% ${94 + facing * 5}%)`);
      if (label) {
        const center = region.normal.clone().applyQuaternion(inverse);
        // Project the face-local text basis exactly as we project its polygon.
        // Glyphs now tilt, rotate and foreshorten with the face instead of billboarding.
        const faceUp = cubeUp(region.normal);
        const right = faceUp.clone().cross(region.normal).applyQuaternion(inverse);
        const up = faceUp.applyQuaternion(inverse);
        label.setAttribute(
          "transform",
          `matrix(${right.x} ${-right.y} ${-up.x} ${up.y} ${80 + center.x * 43} ${80 - center.y * 43})`
        );
      }
    }
  }

  destroy(): void {
    this.element.remove();
  }
}
