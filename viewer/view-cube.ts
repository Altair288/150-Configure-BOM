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

export type ViewCubeCameraType = "perspective" | "orthographic";
export type ViewCubeShadingMode = "shaded" | "shaded-edges" | "edges";
export type ViewCubeLightingMode = "studio" | "key" | "soft";

export interface ViewCubeState {
  cameraType: ViewCubeCameraType;
  shadingMode: ViewCubeShadingMode;
  lightingMode: ViewCubeLightingMode;
}

export interface ViewCubeOptions {
  onSelect: (direction: Vector3) => void;
  onFit?: () => void;
  onCameraType?: (type: ViewCubeCameraType) => void;
  onShadingMode?: (mode: ViewCubeShadingMode) => void;
  onLightingMode?: (mode: ViewCubeLightingMode) => void;
}

type ViewCubeMenuGroup = "cameraType" | "shadingMode" | "lightingMode";

export class ViewCube {
  private readonly element: HTMLElement;
  private readonly regions = cubeRegions();
  private readonly menuButton: HTMLButtonElement;
  private readonly menu: HTMLDivElement;
  private menuState: ViewCubeState = {
    cameraType: "perspective",
    shadingMode: "shaded-edges",
    lightingMode: "studio"
  };
  private readonly surfaces: {
    region: CubeRegion;
    group: SVGGElement;
    polygon: SVGPolygonElement;
    label?: SVGTextElement;
  }[];
  private readonly handleDocumentPointerDown = (event: PointerEvent): void => {
    if (event.target instanceof Node && !this.element.contains(event.target)) this.closeMenu();
  };

  constructor(host: HTMLElement, options: ViewCubeOptions) {
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
      group.addEventListener("click", () => {
        options.onSelect(region.normal.clone());
        this.closeMenu();
      });
      group.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          options.onSelect(region.normal.clone());
          this.closeMenu();
        }
      });
      svg.append(group);
      return { region, group, polygon, label };
    });
    this.menuButton = this.createMenuButton();
    this.menu = this.createMenu(options);
    this.element.append(svg, this.menuButton, this.menu);
    document.addEventListener("pointerdown", this.handleDocumentPointerDown);
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

  updateState(state: Partial<ViewCubeState>): void {
    this.menuState = { ...this.menuState, ...state };
    this.updateMenuChecks();
  }

  private createMenuButton(): HTMLButtonElement {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "cadViewCubeMenuButton";
    button.setAttribute("aria-label", "视图设置菜单");
    button.setAttribute("aria-haspopup", "menu");
    button.setAttribute("aria-expanded", "false");
    const ns = "http://www.w3.org/2000/svg";
    const glyph = document.createElementNS(ns, "svg");
    glyph.classList.add("cadViewCubeMenuIcon");
    glyph.setAttribute("viewBox", "0 0 24 24");
    glyph.setAttribute("aria-hidden", "true");
    glyph.setAttribute("focusable", "false");
    const top = document.createElementNS(ns, "polygon");
    top.setAttribute("points", "12,2.5 20,6.7 12,11 4,6.7");
    top.setAttribute("class", "cadViewCubeIconTop");
    const left = document.createElementNS(ns, "polygon");
    left.setAttribute("points", "4,6.7 12,11 12,21 4,16.7");
    left.setAttribute("class", "cadViewCubeIconLeft");
    const right = document.createElementNS(ns, "polygon");
    right.setAttribute("points", "12,11 20,6.7 20,16.7 12,21");
    right.setAttribute("class", "cadViewCubeIconRight");
    glyph.append(top, left, right);
    const arrow = document.createElement("span");
    arrow.className = "cadViewCubeMenuArrow";
    arrow.textContent = "▾";
    arrow.setAttribute("aria-hidden", "true");
    button.append(glyph, arrow);
    button.addEventListener("click", () => this.toggleMenu());
    return button;
  }

  private createMenu(options: ViewCubeOptions): HTMLDivElement {
    const menu = document.createElement("div");
    menu.className = "cadViewCubeMenu";
    menu.setAttribute("role", "menu");
    menu.setAttribute("aria-label", "视图设置");
    menu.hidden = true;
    menu.append(
      this.createSubmenu("六面标准视图", (submenu) => {
        this.regions
          .filter((region) => !region.corner)
          .forEach((region) => {
            submenu.append(
              this.createActionItem(region.name, undefined, undefined, () => {
                options.onSelect(region.normal.clone());
              })
            );
          });
      }),
      this.createSubmenu("等轴测视图", (submenu) => {
        this.regions
          .filter((region) => region.corner)
          .forEach((region) => {
            const index = this.regions.indexOf(region);
            submenu.append(
              this.createActionItem(region.name, undefined, undefined, () => {
                options.onSelect(this.regions[index].normal.clone());
              })
            );
          });
      }),
      this.createMenuSeparator(),
      this.createSubmenu("投影方案", (submenu) => {
        submenu.append(
          this.createActionItem("透视投影", "cameraType", "perspective", () => {
            options.onCameraType?.("perspective");
          }),
          this.createActionItem("正交投影", "cameraType", "orthographic", () => {
            options.onCameraType?.("orthographic");
          })
        );
      }),
      this.createSubmenu("光照效果", (submenu) => {
        submenu.append(
          this.createActionItem("工作室光照", "lightingMode", "studio", () => {
            options.onLightingMode?.("studio");
          }),
          this.createActionItem("主光照", "lightingMode", "key", () => {
            options.onLightingMode?.("key");
          }),
          this.createActionItem("柔和光照", "lightingMode", "soft", () => {
            options.onLightingMode?.("soft");
          })
        );
      }),
      this.createSubmenu("显示方式", (submenu) => {
        submenu.append(
          this.createActionItem("着色", "shadingMode", "shaded", () => {
            options.onShadingMode?.("shaded");
          }),
          this.createActionItem("着色加边线", "shadingMode", "shaded-edges", () => {
            options.onShadingMode?.("shaded-edges");
          }),
          this.createActionItem("边线", "shadingMode", "edges", () => {
            options.onShadingMode?.("edges");
          })
        );
      }),
      this.createMenuSeparator(),
      this.createActionItem("适合窗口", undefined, undefined, () => options.onFit?.())
    );
    this.updateMenuChecks(menu);
    menu.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        this.closeMenu();
        this.menuButton.focus();
      }
    });
    return menu;
  }

  private createSubmenu(
    label: string,
    populate: (submenu: HTMLDivElement) => void
  ): HTMLDivElement {
    const wrapper = document.createElement("div");
    wrapper.className = "cadViewCubeMenuItemWrap";
    const button = this.createMenuItem(label);
    button.setAttribute("aria-haspopup", "menu");
    button.setAttribute("aria-expanded", "false");
    const arrow = document.createElement("span");
    arrow.className = "cadViewCubeSubmenuArrow";
    arrow.textContent = "▸";
    arrow.setAttribute("aria-hidden", "true");
    button.append(arrow);
    const submenu = document.createElement("div");
    submenu.className = "cadViewCubeSubmenu";
    submenu.setAttribute("role", "menu");
    submenu.setAttribute("aria-label", label);
    populate(submenu);
    button.addEventListener("click", () => {
      const open = wrapper.classList.toggle("open");
      button.setAttribute("aria-expanded", String(open));
    });
    wrapper.append(button, submenu);
    return wrapper;
  }

  private createActionItem(
    label: string,
    group: ViewCubeMenuGroup | undefined,
    key: string | undefined,
    action: () => void
  ): HTMLButtonElement {
    const button = this.createMenuItem(label);
    if (group && key) {
      button.dataset.menuGroup = group;
      button.dataset.menuKey = key;
      button.setAttribute("role", "menuitemradio");
      button.setAttribute("aria-checked", "false");
      const check = document.createElement("span");
      check.className = "cadViewCubeMenuCheck";
      check.setAttribute("aria-hidden", "true");
      button.append(check);
    }
    button.addEventListener("click", () => {
      action();
      if (group && key) {
        this.menuState[group] = key as never;
        this.updateMenuChecks();
      }
      this.closeMenu();
    });
    return button;
  }

  private createMenuItem(label: string): HTMLButtonElement {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "cadViewCubeMenuItem";
    button.setAttribute("role", "menuitem");
    const text = document.createElement("span");
    text.textContent = label;
    button.append(text);
    return button;
  }

  private createMenuSeparator(): HTMLDivElement {
    const separator = document.createElement("div");
    separator.className = "cadViewCubeMenuSeparator";
    separator.setAttribute("role", "separator");
    return separator;
  }

  private toggleMenu(): void {
    const open = this.menu.hidden;
    this.menu.hidden = !open;
    this.menuButton.setAttribute("aria-expanded", String(open));
    if (!open) this.closeSubmenus();
  }

  private closeMenu(): void {
    this.menu.hidden = true;
    this.menuButton.setAttribute("aria-expanded", "false");
    this.closeSubmenus();
  }

  private closeSubmenus(): void {
    this.menu.querySelectorAll<HTMLElement>(".cadViewCubeMenuItemWrap.open").forEach((wrapper) => {
      wrapper.classList.remove("open");
      wrapper.querySelector(".cadViewCubeMenuItem")?.setAttribute("aria-expanded", "false");
    });
  }

  private updateMenuChecks(menu = this.menu): void {
    menu.querySelectorAll<HTMLButtonElement>("[data-menu-group]").forEach((button) => {
      const group = button.dataset.menuGroup as ViewCubeMenuGroup;
      const selected = this.menuState[group] === button.dataset.menuKey;
      button.classList.toggle("selected", selected);
      button.setAttribute("aria-checked", String(selected));
      const check = button.querySelector<HTMLElement>(".cadViewCubeMenuCheck");
      if (check) check.textContent = selected ? "✓" : "";
    });
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
    document.removeEventListener("pointerdown", this.handleDocumentPointerDown);
    this.element.remove();
  }
}
