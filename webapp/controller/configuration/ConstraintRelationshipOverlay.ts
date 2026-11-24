import type { ConstraintRelationship } from "../../model/constraintRules";
import type ObjectPageLayout from "sap/uxap/ObjectPageLayout";

export interface RuleConstraintRelationship extends ConstraintRelationship {
  ruleId: string;
  ruleName: string;
  sourceName: string;
  targetName: string;
  typeLabel: string;
}

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
  relation: AggregatedRelationship;
  upperX: number;
  lowerX: number;
  formRight: number;
}

interface AggregatedRelationship extends ConstraintRelationship {
  ruleIds: Set<string>;
  ruleNames: Set<string>;
  sourceName: string;
  targetName: string;
  typeLabel: string;
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
  private relationships: AggregatedRelationship[] = [];
  private selectedRuleId?: string;
  private scrollRoot?: HTMLElement;
  private svg?: SVGSVGElement;
  private scrollDelegate?: ReturnType<ObjectPageLayout["getScrollDelegate"]>;
  private mutationObserver?: MutationObserver;
  private resizeObserver?: ResizeObserver;
  private readonly resizeTargets = new Set<Element>();
  private readonly paths = new Map<string, SVGPathElement>();
  private readonly hitPaths = new Map<string, SVGPathElement>();
  private readonly relationshipsByKey = new Map<string, AggregatedRelationship>();
  private readonly stickyHeaders = new Set<HTMLElement>();
  private animationFrame?: number;
  private relationshipTooltip?: HTMLDivElement;
  private hoveredRelationshipKey?: string;
  private disposed = false;
  private readonly objectPage: ObjectPageLayout;

  public constructor(objectPage: ObjectPageLayout) {
    this.objectPage = objectPage;
  }

  public setRelationships(
    relationships: readonly RuleConstraintRelationship[],
    selectedRuleId: string
  ): void {
    const grouped = new Map<string, AggregatedRelationship>();
    for (const {
      ruleId,
      ruleName,
      sourceName,
      targetName,
      typeLabel,
      ...relation
    } of relationships) {
      const key = relationshipKey(relation);
      const existing = grouped.get(key);
      if (existing) {
        existing.ruleIds.add(ruleId);
        existing.ruleNames.add(ruleName);
      } else {
        grouped.set(key, {
          ...relation,
          ruleIds: new Set([ruleId]),
          ruleNames: new Set([ruleName]),
          sourceName,
          targetName,
          typeLabel
        });
      }
    }
    const next = [...grouped.values()];
    if (
      selectedRuleId === this.selectedRuleId &&
      next.length === this.relationships.length &&
      next.every(
        (relation, index) => {
          const previous = this.relationships[index];
          return (
            previous !== undefined &&
            relationshipKey(relation) === relationshipKey(previous) &&
            relation.ruleIds.size === previous.ruleIds.size &&
            [...relation.ruleIds].every((ruleId) => previous.ruleIds.has(ruleId)) &&
            relation.ruleNames.size === previous.ruleNames.size &&
            [...relation.ruleNames].every((ruleName) => previous.ruleNames.has(ruleName)) &&
            relation.sourceName === previous.sourceName &&
            relation.targetName === previous.targetName &&
            relation.typeLabel === previous.typeLabel
          );
        }
      )
    )
      return;

    this.relationships = next;
    this.selectedRuleId = selectedRuleId;
    this.relationshipsByKey.clear();
    next.forEach((relation) => this.relationshipsByKey.set(relationshipKey(relation), relation));
    const hoveredRelationship = this.hoveredRelationshipKey
      ? this.relationshipsByKey.get(this.hoveredRelationshipKey)
      : undefined;
    if (!hoveredRelationship) this.hideRelationshipTooltip();
    else if (this.relationshipTooltip)
      this.relationshipTooltip.textContent = this.relationshipTooltipText(hoveredRelationship);
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
    this.relationshipTooltip = document.createElement("div");
    this.relationshipTooltip.className = "cmConstraintRelationshipTooltip";
    this.relationshipTooltip.setAttribute("role", "tooltip");
    this.relationshipTooltip.hidden = true;
    document.body.appendChild(this.relationshipTooltip);
    svg.addEventListener("pointerover", this.handleRelationshipPointerOver);
    svg.addEventListener("pointermove", this.handleRelationshipPointerMove);
    svg.addEventListener("pointerout", this.handleRelationshipPointerOut);
    scrollRoot.addEventListener("scroll", this.handleScroll, { passive: true });

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

  private readonly handleScroll: EventListener = () => {
    this.hideRelationshipTooltip();
    this.scheduleLayout();
  };
  private readonly handleResize: ResizeObserverCallback = () => {
    this.hideRelationshipTooltip();
    this.scheduleLayout();
  };
  private readonly handleRelationshipPointerOver: EventListener = (event) => {
    if (!(event instanceof PointerEvent) || event.pointerType === "touch") return;
    const key = this.relationshipKeyFromTarget(event.target);
    const relation = key ? this.relationshipsByKey.get(key) : undefined;
    if (!key || !relation) return;
    this.showRelationshipTooltip(key, relation, event);
  };
  private readonly handleRelationshipPointerMove: EventListener = (event) => {
    if (!(event instanceof PointerEvent) || event.pointerType === "touch") return;
    const key = this.relationshipKeyFromTarget(event.target);
    if (!key) {
      this.hideRelationshipTooltip();
      return;
    }
    const relation = this.relationshipsByKey.get(key);
    if (!relation) {
      this.hideRelationshipTooltip();
      return;
    }
    this.showRelationshipTooltip(key, relation, event);
  };
  private readonly handleRelationshipPointerOut: EventListener = (event) => {
    if (!(event instanceof PointerEvent)) return;
    const key = this.relationshipKeyFromTarget(event.target);
    if (!key) return;
    const nextKey = this.relationshipKeyFromTarget(event.relatedTarget);
    if (nextKey === key) return;
    this.hideRelationshipTooltip();
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
    const stickyTitle = this.objectPage
      .getDomRef()
      ?.querySelector<HTMLElement>(".sapUxAPObjectPageHeaderTitle");
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
      let hitPath = this.hitPaths.get(layout.key);
      if (!hitPath) {
        hitPath = document.createElementNS(svgNamespace, "path");
        hitPath.classList.add("cmConstraintRelationshipOverlayHitArea");
        hitPath.setAttribute("data-relationship-key", layout.key);
        hitPath.setAttribute("aria-hidden", "true");
        hitPath.setAttribute("focusable", "false");
        svg.appendChild(hitPath);
        this.hitPaths.set(layout.key, hitPath);
      }

      let path = this.paths.get(layout.key);
      if (!path) {
        path = document.createElementNS(svgNamespace, "path");
        path.classList.add(
          "cmConstraintRelationshipOverlayPath",
          `cmConstraintRelationshipOverlayPath--${layout.relation.type.toLowerCase()}`
        );
        path.setAttribute("data-relationship-key", layout.key);
        path.setAttribute("aria-label", this.relationshipTooltipText(layout.relation));
        svg.appendChild(path);
        this.paths.set(layout.key, path);
      }
      const tooltipText = this.relationshipTooltipText(layout.relation);
      if (path.getAttribute("aria-label") !== tooltipText)
        path.setAttribute("aria-label", tooltipText);
      const pathData = this.pathForLayout(layout);
      if (hitPath.getAttribute("d") !== pathData) hitPath.setAttribute("d", pathData);
      if (path.getAttribute("d") !== pathData) path.setAttribute("d", pathData);
    }

    for (const [key, hitPath] of this.hitPaths) {
      if (activeKeys.has(key)) continue;
      hitPath.remove();
      this.hitPaths.delete(key);
    }
    for (const [key, path] of this.paths) {
      if (activeKeys.has(key)) continue;
      if (this.hoveredRelationshipKey === key) this.hideRelationshipTooltip();
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

  private updatePathHighlighting(): void {
    for (const [key, path] of this.paths) {
      const relation = this.relationshipsByKey.get(key);
      const selected =
        relation !== undefined && relation.ruleIds.has(this.selectedRuleId ?? "");
      path.classList.toggle("cmConstraintRelationshipOverlayPath--selected", selected);
    }
  }

  private relationshipKeyFromTarget(target: EventTarget | null): string | undefined {
    if (!(target instanceof Element)) return undefined;
    const path = target.closest<SVGPathElement>("path[data-relationship-key]");
    if (!path || path.ownerSVGElement !== this.svg) return undefined;
    return path.getAttribute("data-relationship-key") ?? undefined;
  }

  private relationshipTooltipText(relation: AggregatedRelationship): string {
    const ruleNames = [...relation.ruleNames].join(" · ");
    const description = `${relation.sourceName} → ${relation.typeLabel} → ${relation.targetName}`;
    return ruleNames ? `${ruleNames}\n${description}` : description;
  }

  private showRelationshipTooltip(
    key: string,
    relation: AggregatedRelationship,
    event: PointerEvent
  ): void {
    const tooltip = this.relationshipTooltip;
    if (!tooltip) return;
    tooltip.textContent = this.relationshipTooltipText(relation);
    this.setHoveredRelationship(key);
    tooltip.hidden = false;
    tooltip.style.left = `${event.clientX + 14}px`;
    tooltip.style.top = `${event.clientY + 14}px`;
    const bounds = tooltip.getBoundingClientRect();
    tooltip.style.left = `${Math.max(
      8,
      Math.min(event.clientX + 14, window.innerWidth - bounds.width - 8)
    )}px`;
    tooltip.style.top = `${Math.max(
      8,
      Math.min(event.clientY + 14, window.innerHeight - bounds.height - 8)
    )}px`;
  }

  private setHoveredRelationship(key?: string): void {
    if (this.hoveredRelationshipKey === key) return;
    if (this.hoveredRelationshipKey)
      this.paths
        .get(this.hoveredRelationshipKey)
        ?.classList.remove("cmConstraintRelationshipOverlayPath--hovered");
    this.hoveredRelationshipKey = key;
    if (key)
      this.paths.get(key)?.classList.add("cmConstraintRelationshipOverlayPath--hovered");
  }

  private hideRelationshipTooltip(): void {
    if (this.relationshipTooltip) this.relationshipTooltip.hidden = true;
    this.setHoveredRelationship();
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
    this.svg?.removeEventListener("pointerover", this.handleRelationshipPointerOver);
    this.svg?.removeEventListener("pointermove", this.handleRelationshipPointerMove);
    this.svg?.removeEventListener("pointerout", this.handleRelationshipPointerOut);
    this.scrollRoot?.removeEventListener("scroll", this.handleScroll);
    this.mutationObserver?.disconnect();
    this.mutationObserver = undefined;
    this.resizeObserver?.disconnect();
    this.resizeObserver = undefined;
    this.resizeTargets.clear();
    for (const header of this.stickyHeaders) header.classList.remove(stickyRelationshipHeaderClass);
    this.stickyHeaders.clear();
    this.svg?.remove();
    this.svg = undefined;
    this.relationshipTooltip?.remove();
    this.relationshipTooltip = undefined;
    this.paths.clear();
    this.hitPaths.clear();
    this.scrollRoot = undefined;
    this.scrollDelegate = undefined;
    this.hoveredRelationshipKey = undefined;
  }
}
