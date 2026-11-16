import type { ConstraintRelationship } from "../../model/constraintRules";
import type ObjectPageLayout from "sap/uxap/ObjectPageLayout";

interface RelationshipAnchor {
  element: HTMLElement;
  form: HTMLElement;
}

export interface ConstraintRelationshipSpan {
  key: string;
  top: number;
  bottom: number;
  lane: number;
}

interface RelationshipLayout extends ConstraintRelationshipSpan {
  relation: ConstraintRelationship;
  upperX: number;
  lowerX: number;
  formRight: number;
}

const svgNamespace = "http://www.w3.org/2000/svg";
const trackRightInset = 12;
const trackGap = 11;
const laneClearance = 8;
const cornerRadius = 7;
const stickyRelationshipHeaderClass = "cmConstraintRelationshipStickyHeader";

function relationshipKey(relation: ConstraintRelationship): string {
  return JSON.stringify([relation.source, relation.target, relation.type]);
}

function formatCoordinate(value: number): string {
  return String(Number(value.toFixed(2)));
}

export function assignConstraintRelationshipLanes(spans: ConstraintRelationshipSpan[]): number {
  const laneEnds: number[] = [];
  const ordered = [...spans].sort(
    (left, right) =>
      left.top - right.top || right.bottom - left.bottom || left.key.localeCompare(right.key)
  );
  for (const span of ordered) {
    let lane = laneEnds.findIndex((end) => end + laneClearance < span.top);
    if (lane < 0) lane = laneEnds.length;
    laneEnds[lane] = span.bottom;
    span.lane = lane;
  }
  return laneEnds.length;
}

export default class ConstraintRelationshipOverlay {
  private relationships: ConstraintRelationship[] = [];
  private scrollRoot?: HTMLElement;
  private svg?: SVGSVGElement;
  private scrollDelegate?: ReturnType<ObjectPageLayout["getScrollDelegate"]>;
  private mutationObserver?: MutationObserver;
  private resizeObserver?: ResizeObserver;
  private readonly resizeTargets = new Set<Element>();
  private readonly paths = new Map<string, SVGPathElement>();
  private readonly relationshipsByKey = new Map<string, ConstraintRelationship>();
  private readonly stickyHeaders = new Set<HTMLElement>();
  private animationFrame?: number;
  private hoveredFeature?: string;
  private focusedFeature?: string;
  private disposed = false;
  private readonly objectPage: ObjectPageLayout;

  public constructor(objectPage: ObjectPageLayout) {
    this.objectPage = objectPage;
  }

  public setRelationships(relationships: readonly ConstraintRelationship[]): void {
    const next = [
      ...new Map(
        relationships.map((relation) => [relationshipKey(relation), { ...relation }])
      ).values()
    ];
    if (
      next.length === this.relationships.length &&
      next.every(
        (relation, index) =>
          relationshipKey(relation) === relationshipKey(this.relationships[index])
      )
    )
      return;

    this.relationships = next;
    this.relationshipsByKey.clear();
    next.forEach((relation) => this.relationshipsByKey.set(relationshipKey(relation), relation));
    this.scheduleLayout();
  }

  public beforeRendering(): void {
    this.detachDom();
  }

  public afterRendering(): void {
    if (this.disposed) return;
    this.detachDom();

    const pageDom = this.objectPage.getDomRef();
    if (!(pageDom instanceof HTMLElement)) return;
    const scrollDelegate = this.objectPage.getScrollDelegate();
    const scrollRoot = pageDom.querySelector<HTMLElement>(".sapUxAPObjectPageWrapper");
    if (!scrollRoot || !scrollDelegate) return;

    this.scrollRoot = scrollRoot;
    this.scrollDelegate = scrollDelegate;

    const svg = document.createElementNS(svgNamespace, "svg");
    svg.classList.add("cmConstraintRelationshipOverlay");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    this.svg = svg;
    scrollRoot.appendChild(svg);
    scrollRoot.addEventListener("scroll", this.handleScroll, { passive: true });
    scrollRoot.addEventListener("pointerover", this.handlePointerOver);
    scrollRoot.addEventListener("pointerout", this.handlePointerOut);
    scrollRoot.addEventListener("focusin", this.handleFocusIn);
    scrollRoot.addEventListener("focusout", this.handleFocusOut);

    if (typeof ResizeObserver !== "undefined")
      this.resizeObserver = new ResizeObserver(this.handleResize);
    if (typeof MutationObserver !== "undefined") {
      this.mutationObserver = new MutationObserver(this.handleMutations);
      this.mutationObserver.observe(scrollRoot, {
        attributes: true,
        attributeFilter: ["class", "style", "hidden", "aria-expanded"],
        childList: true,
        subtree: true
      });
    }

    this.refreshResizeTargets();
    this.scheduleLayout();
  }

  public dispose(): void {
    this.disposed = true;
    this.relationships = [];
    this.relationshipsByKey.clear();
    this.detachDom();
  }

  private readonly handleScroll: EventListener = () => this.scheduleLayout();
  private readonly handleResize: ResizeObserverCallback = () => this.scheduleLayout();
  private readonly handlePointerOver: EventListener = (event) => {
    if (!(event instanceof PointerEvent)) return;
    const feature = this.featureCodeFromTarget(event.target);
    if (!feature || feature === this.hoveredFeature) return;
    this.hoveredFeature = feature;
    this.updatePathHighlighting();
  };
  private readonly handlePointerOut: EventListener = (event) => {
    if (!(event instanceof PointerEvent)) return;
    const feature = this.featureCodeFromTarget(event.target);
    if (!feature || feature !== this.hoveredFeature) return;
    const nextFeature = this.featureCodeFromTarget(event.relatedTarget);
    if (nextFeature === feature) return;
    this.hoveredFeature = nextFeature;
    this.updatePathHighlighting();
  };
  private readonly handleFocusIn: EventListener = (event) => {
    if (!(event instanceof FocusEvent)) return;
    const feature = this.featureCodeFromTarget(event.target);
    if (!feature || feature === this.focusedFeature) return;
    this.focusedFeature = feature;
    this.updatePathHighlighting();
  };
  private readonly handleFocusOut: EventListener = (event) => {
    if (!(event instanceof FocusEvent)) return;
    const feature = this.featureCodeFromTarget(event.target);
    if (!feature || feature !== this.focusedFeature) return;
    this.focusedFeature = this.featureCodeFromTarget(event.relatedTarget);
    this.updatePathHighlighting();
  };
  private readonly handleMutations: MutationCallback = (records) => {
    if (records.every(({ target }) => this.svg?.contains(target))) return;
    this.refreshResizeTargets();
    this.scheduleLayout();
  };

  private scheduleLayout(): void {
    if (
      this.disposed ||
      !this.scrollRoot ||
      !this.svg ||
      !this.scrollDelegate ||
      this.animationFrame !== undefined
    )
      return;

    this.animationFrame = requestAnimationFrame(() => {
      this.animationFrame = undefined;
      this.layout();
    });
  }

  private layout(): void {
    const scrollRoot = this.scrollRoot;
    const svg = this.svg;
    if (!scrollRoot || !svg || !this.scrollDelegate) return;

    const width = Math.max(scrollRoot.clientWidth, 1);
    const height = Math.ceil(this.getContentHeight(scrollRoot));
    svg.setAttribute("width", String(width));
    svg.setAttribute("height", String(height));
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.style.width = `${width}px`;
    svg.style.height = `${height}px`;

    this.updateStickyHeaders(scrollRoot);
    const svgRect = svg.getBoundingClientRect();
    const layouts = this.getRelationshipLayouts(scrollRoot, svgRect);
    assignConstraintRelationshipLanes(layouts);
    this.renderPaths(layouts);
  }

  private updateStickyHeaders(scrollRoot: HTMLElement): void {
    const rootRect = scrollRoot.getBoundingClientRect();
    const stickyTitle =
      this.objectPage.getDomRef()?.querySelector<HTMLElement>(".sapUxAPObjectPageHeaderTitle");
    const stickyBoundary = Math.max(
      rootRect.top,
      stickyTitle?.getBoundingClientRect().bottom ?? rootRect.top
    );
    const nextStickyHeaders = new Set<HTMLElement>();

    scrollRoot
      .querySelectorAll<HTMLElement>(".sapUxAPObjectPageSubSectionHeader")
      .forEach((header) => {
        if (getComputedStyle(header).position !== "sticky") return;
        const rect = header.getBoundingClientRect();
        if (rect.top <= stickyBoundary + 1 && rect.bottom > stickyBoundary)
          nextStickyHeaders.add(header);
      });

    for (const header of this.stickyHeaders)
      if (!nextStickyHeaders.has(header)) header.classList.remove(stickyRelationshipHeaderClass);
    this.stickyHeaders.clear();
    for (const header of nextStickyHeaders) {
      header.classList.add(stickyRelationshipHeaderClass);
      this.stickyHeaders.add(header);
    }
  }

  private getRelationshipLayouts(scrollRoot: HTMLElement, svgRect: DOMRect): RelationshipLayout[] {
    const anchors = new Map<string, RelationshipAnchor>();
    scrollRoot.querySelectorAll<HTMLElement>("[data-constraint-feature]").forEach((element) => {
      const featureCode = element.getAttribute("data-constraint-feature");
      const form = element.closest<HTMLElement>(".cmConstraintDesignerForm");
      if (featureCode && form && !anchors.has(featureCode))
        anchors.set(featureCode, { element, form });
    });

    const layouts: RelationshipLayout[] = [];
    for (const relation of this.relationships) {
      const source = anchors.get(relation.source);
      const target = anchors.get(relation.target);
      if (!source || !target) continue;

      const sourceRect = source.element.getBoundingClientRect();
      const targetRect = target.element.getBoundingClientRect();
      if (!sourceRect.width || !sourceRect.height || !targetRect.width || !targetRect.height)
        continue;

      const sourceY = (sourceRect.top + sourceRect.bottom) / 2 - svgRect.top;
      const targetY = (targetRect.top + targetRect.bottom) / 2 - svgRect.top;
      if (Math.abs(sourceY - targetY) < 1) continue;
      const upperRect = sourceY < targetY ? sourceRect : targetRect;
      const lowerRect = sourceY < targetY ? targetRect : sourceRect;
      layouts.push({
        key: relationshipKey(relation),
        relation,
        upperX: upperRect.right - svgRect.left,
        lowerX: lowerRect.right - svgRect.left,
        formRight:
          Math.max(
            source.form.getBoundingClientRect().right,
            target.form.getBoundingClientRect().right
          ) - svgRect.left,
        top: Math.min(sourceY, targetY),
        bottom: Math.max(sourceY, targetY),
        lane: 0
      });
    }

    return layouts;
  }

  private renderPaths(layouts: RelationshipLayout[]): void {
    const svg = this.svg;
    if (!svg) return;

    const activeKeys = new Set<string>();
    for (const layout of layouts) {
      activeKeys.add(layout.key);
      let path = this.paths.get(layout.key);
      if (!path) {
        path = document.createElementNS(svgNamespace, "path");
        path.classList.add(
          "cmConstraintRelationshipOverlayPath",
          `cmConstraintRelationshipOverlayPath--${layout.relation.type.toLowerCase()}`
        );
        svg.appendChild(path);
        this.paths.set(layout.key, path);
      }
      const pathData = this.pathForLayout(layout);
      if (path.getAttribute("d") !== pathData) path.setAttribute("d", pathData);
    }

    for (const [key, path] of this.paths) {
      if (activeKeys.has(key)) continue;
      path.remove();
      this.paths.delete(key);
    }
    this.updatePathHighlighting();
  }

  private pathForLayout(layout: RelationshipLayout): string {
    const railX = layout.formRight + trackRightInset + layout.lane * trackGap;
    const radius = Math.max(
      0,
      Math.min(
        cornerRadius,
        (layout.bottom - layout.top) / 2,
        (railX - Math.max(layout.upperX, layout.lowerX)) / 2
      )
    );
    const roundedTrackX = railX - radius;
    return [
      `M ${formatCoordinate(layout.upperX)} ${formatCoordinate(layout.top)}`,
      `H ${formatCoordinate(roundedTrackX)}`,
      `Q ${formatCoordinate(railX)} ${formatCoordinate(layout.top)} ${formatCoordinate(railX)} ${formatCoordinate(layout.top + radius)}`,
      `V ${formatCoordinate(layout.bottom - radius)}`,
      `Q ${formatCoordinate(railX)} ${formatCoordinate(layout.bottom)} ${formatCoordinate(roundedTrackX)} ${formatCoordinate(layout.bottom)}`,
      `H ${formatCoordinate(layout.lowerX)}`
    ].join(" ");
  }

  private featureCodeFromTarget(target: EventTarget | null): string | undefined {
    if (!(target instanceof Element)) return undefined;
    return (
      target
        .closest<HTMLElement>("[data-constraint-feature]")
        ?.getAttribute("data-constraint-feature") ?? undefined
    );
  }

  private updatePathHighlighting(): void {
    const activeFeatures = new Set(
      [this.hoveredFeature, this.focusedFeature].filter(
        (feature): feature is string => feature !== undefined
      )
    );
    for (const [key, path] of this.paths) {
      const relation = this.relationshipsByKey.get(key);
      const highlighted =
        relation !== undefined &&
        (activeFeatures.has(relation.source) || activeFeatures.has(relation.target));
      path.classList.toggle("cmConstraintRelationshipOverlayPath--highlighted", highlighted);
    }
  }

  private getContentHeight(scrollRoot: HTMLElement): number {
    const rootRect = scrollRoot.getBoundingClientRect();
    const scrollOffset = scrollRoot.scrollTop;
    const pageContainer = scrollRoot.querySelector<HTMLElement>(".sapUxAPObjectPageContainer");
    const pageBottom = pageContainer
      ? pageContainer.getBoundingClientRect().bottom - rootRect.top + scrollOffset
      : 0;
    const sectionBottom = Array.from(
      scrollRoot.querySelectorAll<HTMLElement>(".sapUxAPObjectPageSection")
    )
      .map((section) => section.getBoundingClientRect().bottom - rootRect.top + scrollOffset)
      .reduce((max, bottom) => Math.max(max, bottom), 0);
    return Math.max(scrollRoot.clientHeight, pageBottom, sectionBottom, 1);
  }

  private refreshResizeTargets(): void {
    const scrollRoot = this.scrollRoot;
    const observer = this.resizeObserver;
    if (!scrollRoot || !observer) return;

    const nextTargets = new Set<Element>([
      scrollRoot,
      ...Array.from(
        scrollRoot.querySelectorAll(
          ".sapUxAPObjectPageContainer, .sapUxAPObjectPageSection, .sapUxAPBlockContainer, .cmConstraintDesignerForm, [data-constraint-feature]"
        )
      )
    ]);
    for (const target of this.resizeTargets) {
      if (nextTargets.has(target)) continue;
      observer.unobserve(target);
      this.resizeTargets.delete(target);
    }
    for (const target of nextTargets) {
      if (this.resizeTargets.has(target)) continue;
      observer.observe(target);
      this.resizeTargets.add(target);
    }
  }

  private detachDom(): void {
    if (this.animationFrame !== undefined) cancelAnimationFrame(this.animationFrame);
    this.animationFrame = undefined;
    this.scrollRoot?.removeEventListener("scroll", this.handleScroll);
    this.scrollRoot?.removeEventListener("pointerover", this.handlePointerOver);
    this.scrollRoot?.removeEventListener("pointerout", this.handlePointerOut);
    this.scrollRoot?.removeEventListener("focusin", this.handleFocusIn);
    this.scrollRoot?.removeEventListener("focusout", this.handleFocusOut);
    this.mutationObserver?.disconnect();
    this.mutationObserver = undefined;
    this.resizeObserver?.disconnect();
    this.resizeObserver = undefined;
    this.resizeTargets.clear();
    for (const header of this.stickyHeaders) header.classList.remove(stickyRelationshipHeaderClass);
    this.stickyHeaders.clear();
    this.svg?.remove();
    this.svg = undefined;
    this.paths.clear();
    this.scrollRoot = undefined;
    this.scrollDelegate = undefined;
    this.hoveredFeature = undefined;
    this.focusedFeature = undefined;
  }
}
