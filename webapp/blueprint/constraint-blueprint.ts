import { html } from "lit";
import { ClassicPreset, GetSchemes, NodeEditor } from "rete";
import { AreaExtensions, AreaPlugin } from "rete-area-plugin";
import { ConnectionPlugin, Presets as ConnectionPresets } from "rete-connection-plugin";
import {
  ContextMenuPlugin,
  Presets as ContextMenuPresets,
  type ContextMenuExtra
} from "rete-context-menu-plugin";
import { Presets as ScopesPresets, ScopesPlugin } from "rete-scopes-plugin";
import { LitArea2D, LitPlugin, Presets as LitPresets } from "@retejs/lit-plugin";
import { DOMSocketPosition } from "rete-render-utils";
import { constraintMockRules } from "./constraint-mock-rules";
import type { ConstraintMockNode, ConstraintNodeKind } from "./constraint-mock-rules";
import type {
  ConstraintActionType,
  ConstraintBlueprintLayout,
  ConstraintExpression,
  ConstraintPredicate,
  ConstraintRuleAst
} from "../model/constraintRules";

type PaletteNodeKind = "source" | "condition" | "logic" | "action";

type BlueprintSemantic =
  | {
      role: "predicate";
      side: "when" | "then";
      predicate: ConstraintPredicate;
      actionType?: ConstraintActionType;
    }
  | { role: "logic"; side: "when" | "then"; operator: "AND" | "OR" | "NOT" }
  | { role: "action"; index: number; actionType: ConstraintActionType };

export interface BlueprintPredicateSelection {
  id: string;
  side: "when" | "then";
  predicate: ConstraintPredicate;
  actionType?: ConstraintActionType;
}

class BlueprintNode extends ClassicPreset.Node {
  public width = 248;
  public height = 154;
  public parent?: string;
  public semantic?: BlueprintSemantic;

  public constructor(
    label: string,
    public readonly kind: ConstraintNodeKind
  ) {
    super(label);
  }

  public clone(): BlueprintNode {
    const clone = new BlueprintNode(`${this.label} · 副本`, this.kind);
    clone.width = this.width;
    clone.height = this.height;
    clone.parent = this.parent;
    clone.semantic = this.semantic ? structuredClone(this.semantic) : undefined;

    for (const [key, input] of Object.entries(this.inputs)) {
      if (input) clone.addInput(key, new ClassicPreset.Input(input.socket, input.label));
    }
    for (const [key, output] of Object.entries(this.outputs)) {
      if (output) clone.addOutput(key, new ClassicPreset.Output(output.socket, output.label));
    }
    for (const [key, control] of Object.entries(this.controls)) {
      if (!(control instanceof ClassicPreset.InputControl)) continue;
      if (control.type === "number") {
        clone.addControl(
          key,
          new ClassicPreset.InputControl("number", {
            initial: typeof control.value === "number" ? control.value : undefined,
            readonly: control.readonly
          })
        );
      } else {
        clone.addControl(
          key,
          new ClassicPreset.InputControl("text", {
            initial: typeof control.value === "string" ? control.value : undefined,
            readonly: control.readonly
          })
        );
      }
    }
    return clone;
  }
}

type Schemes = GetSchemes<
  BlueprintNode,
  ClassicPreset.Connection<BlueprintNode, BlueprintNode> & { isLoop?: boolean }
>;
type AreaExtra = LitArea2D<Schemes> | ContextMenuExtra;

class StableSocketPosition extends DOMSocketPosition<Schemes, LitArea2D<Schemes>> {
  public override async calculatePosition(
    nodeId: string,
    side: "input" | "output",
    key: string,
    element: HTMLElement
  ): Promise<{ x: number; y: number } | null> {
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
    );

    const view = this.area?.nodeViews.get(nodeId);
    if (!view) return null;
    const nodeRect = view.element.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    const scaleX = nodeRect.width / (view.element.offsetWidth || nodeRect.width);
    const scaleY = nodeRect.height / (view.element.offsetHeight || nodeRect.height);
    const socket = element.querySelector<HTMLElement>("rete-socket");
    const visibleSocket = socket?.shadowRoot?.querySelector<HTMLElement>(".styles");
    const visibleSocketRect = visibleSocket?.getBoundingClientRect();
    const diameter = visibleSocketRect
      ? visibleSocketRect.width / scaleX
      : elementRect.width / scaleX;

    if (!scaleX || !scaleY || !Number.isFinite(diameter)) return null;
    return {
      x:
        (elementRect.left + elementRect.width / 2 - nodeRect.left) / scaleX +
        (side === "output" ? diameter / 2 : -diameter / 2),
      y: visibleSocketRect
        ? (visibleSocketRect.top + visibleSocketRect.height / 2 - nodeRect.top) / scaleY
        : (elementRect.top + elementRect.height / 2 - nodeRect.top) / scaleY
    };
  }
}

const nodeAccents: Record<ConstraintNodeKind, string> = {
  source: "#087f8c",
  condition: "#b7791f",
  logic: "#7056ad",
  action: "#2f7954",
  scope: "#477596"
};

function createNodeStyles(kind: ConstraintNodeKind): () => string {
  return () => `
    :host(.cmBlueprintNode) {
      --node-accent: ${nodeAccents[kind]};
      --socket-size: 16px;
      --socket-margin: 4px;
      --node-color: rgba(255, 255, 255, 0.86);
      --node-color-hover: rgba(255, 255, 255, 0.96);
      --node-color-selected: rgba(255, 255, 255, 0.96);
      display: block;
      box-sizing: border-box;
      background: rgba(255, 255, 255, 0.86);
      border: 1px solid #b8c6d3;
      border-radius: 8px;
      box-shadow: 0 3px 12px rgba(31, 49, 65, 0.10);
      padding-bottom: 5px;
      line-height: 1.35;
      font-family: "72", Arial, sans-serif;
      backdrop-filter: blur(3px);
      transition: border-color 120ms ease, box-shadow 120ms ease, background-color 120ms ease;
    }

    :host(.cmBlueprintNode:hover) {
      background: rgba(255, 255, 255, 0.96);
      border-color: #93a6b8;
      box-shadow: 0 5px 16px rgba(31, 49, 65, 0.16);
    }

    :host(.cmBlueprintNode.selected) {
      background: rgba(255, 255, 255, 0.96);
      border-color: #0a6ed1;
      box-shadow: 0 0 0 2px rgba(10, 110, 209, 0.16), 0 5px 16px rgba(31, 49, 65, 0.14);
    }

    :host(.cmBlueprintNode--scope) {
      background: rgba(224, 239, 250, 0.34);
      border: 1px dashed rgba(56, 112, 158, 0.58);
      box-shadow: none;
      backdrop-filter: none;
    }

    :host(.cmBlueprintNode--scope:hover) {
      background: rgba(224, 239, 250, 0.42);
      border-color: rgba(56, 112, 158, 0.72);
      box-shadow: none;
    }

    :host(.cmBlueprintNode) .title {
      display: flex;
      align-items: center;
      gap: 9px;
      padding: 9px 11px;
      border-bottom: 1px solid rgba(124, 145, 164, 0.22);
      color: #203344;
      font-family: "72", Arial, sans-serif;
      font-size: 15px;
      font-weight: 600;
    }

    :host(.cmBlueprintNode) .title::before {
      content: "";
      flex: 0 0 9px;
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: var(--node-accent);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--node-accent) 16%, transparent);
    }

    :host(.cmBlueprintNode) .input-title,
    :host(.cmBlueprintNode) .output-title {
      color: #536678;
      font-family: "72", Arial, sans-serif;
      font-size: 12px;
      font-weight: 500;
      line-height: var(--socket-size);
    }

    :host(.cmBlueprintNode) rete-socket {
      --socket-size: 16px !important;
      --socket-margin: 4px !important;
      --socket-color: var(--node-accent) !important;
      --border-width: 1px !important;
      --hover-border-width: 2px !important;
      --multiple-border-color: #c58a22 !important;
    }

    :host(.cmBlueprintNode) .input-control { z-index: 1; }
  `;
}

const socket = new ClassicPreset.Socket("configuration-value");

function createPaletteNode(kind: PaletteNodeKind, ordinal: number): BlueprintNode {
  const defaults: Record<PaletteNodeKind, string> = {
    source: "特征值",
    condition: "比较条件",
    logic: "逻辑 AND",
    action: "应用约束"
  };
  const normalizedKind: ConstraintNodeKind = kind === "condition" ? "condition" : kind;
  const node = new BlueprintNode(`${defaults[kind]} ${ordinal}`, normalizedKind);

  if (kind === "source") {
    node.addControl(
      "feature",
      new ClassicPreset.InputControl("text", { initial: "SUV 特征 · 配置项", readonly: true })
    );
    node.addOutput("value", new ClassicPreset.Output(socket, "当前值"));
  } else if (kind === "condition") {
    node.addInput("value", new ClassicPreset.Input(socket, "输入值"));
    node.addControl(
      "comparison",
      new ClassicPreset.InputControl("text", { initial: "选择比较条件", readonly: true })
    );
    node.addOutput("matched", new ClassicPreset.Output(socket, "符合"));
  } else if (kind === "logic") {
    node.addInput("left", new ClassicPreset.Input(socket, "条件 A"));
    node.addInput("right", new ClassicPreset.Input(socket, "条件 B"));
    node.addOutput("result", new ClassicPreset.Output(socket, "全部满足"));
  } else {
    node.addInput("condition", new ClassicPreset.Input(socket, "满足条件时"));
    node.addControl(
      "effect",
      new ClassicPreset.InputControl("text", { initial: "设置或校验配置值", readonly: true })
    );
  }

  return node;
}

function createRuleNode(spec: ConstraintMockNode): BlueprintNode {
  const node = new BlueprintNode(spec.title, spec.kind);
  node.id = spec.id;
  node.parent = spec.parent;
  if (spec.kind === "scope") {
    node.width = 480;
    node.height = 320;
    return node;
  }
  const inputs = spec.inputs ?? [];
  node.width = 268;
  node.height = 108 + Math.max(inputs.length, spec.kind === "action" ? 0 : 1) * 28;

  inputs.forEach((label, index) => {
    node.addInput(`in${index}`, new ClassicPreset.Input(socket, label));
  });
  if (spec.detail) {
    node.addControl(
      "detail",
      new ClassicPreset.InputControl("text", { initial: spec.detail, readonly: true })
    );
    node.height += 32;
  }
  if (spec.kind !== "action")
    node.addOutput("out", new ClassicPreset.Output(socket, spec.output ?? "结果"));

  return node;
}

class BlueprintEditor {
  private readonly editor = new NodeEditor<Schemes>();
  private readonly area: AreaPlugin<Schemes, AreaExtra>;
  private readonly scopes: ScopesPlugin<Schemes>;
  private readonly ready: Promise<void>;
  private destroyed = false;
  private initializing = false;
  private addedNodeCount = 0;
  private scopeCount = 0;
  private semanticNodeCount = 0;
  private currentConstraintAst?: ConstraintRuleAst;
  private onBlueprintChange?: (ast: ConstraintRuleAst, layout: ConstraintBlueprintLayout) => void;
  private onPredicateSelection?: (selection: BlueprintPredicateSelection | undefined) => void;
  private readonly preventBrowserContextMenu = (event: MouseEvent): void => event.preventDefault();

  public constructor(
    private readonly host: HTMLElement,
    initialRuleId = constraintMockRules[0].id
  ) {
    this.host.addEventListener("contextmenu", this.preventBrowserContextMenu);
    this.area = new AreaPlugin<Schemes, AreaExtra>(host);
    this.area.area.content.holder.classList.add("cmBlueprintArea");
    const renderer = new LitPlugin<Schemes, AreaExtra>();
    const socketPositionWatcher = new StableSocketPosition();
    renderer.addPreset(LitPresets.contextMenu.setup<Schemes, ContextMenuExtra>());
    renderer.addPreset(
      LitPresets.classic.setup<Schemes, LitArea2D<Schemes>>({
        socketPositionWatcher,
        customize: {
          node: (context) => {
            const node = context.payload as BlueprintNode;
            return ({ emit }) =>
              html`<rete-node
                class="cmBlueprintNode cmBlueprintNode--${node.kind}"
                .data=${node}
                .styles=${createNodeStyles(node.kind)}
                .emit=${emit}
              ></rete-node>`;
          }
        }
      })
    );
    const connections = new ConnectionPlugin<Schemes, AreaExtra>();
    connections.addPreset(ConnectionPresets.classic.setup());
    this.scopes = new ScopesPlugin<Schemes>();
    this.scopes.addPreset(ScopesPresets.classic.setup());
    const contextMenuPreset = ContextMenuPresets.classic.setup<Schemes>([
      ["配置项", [["特征值", () => this.createPaletteNode("source")]]],
      ["判断", [["比较条件", () => this.createPaletteNode("condition")]]],
      ["逻辑", [["逻辑 AND", () => this.createPaletteNode("logic")]]],
      ["约束", [["应用约束", () => this.createPaletteNode("action")]]],
      ["范围", [["范围组", () => this.createScopeNode()]]]
    ]);
    const contextMenu = new ContextMenuPlugin<Schemes>({
      items: (context, plugin) => {
        const menu = contextMenuPreset(context, plugin);
        if (context === "root") return menu;
        return {
          ...menu,
          list: menu.list.map((item) => {
            if (item.key !== "delete")
              return { ...item, label: item.key === "clone" ? "克隆节点" : item.label };
            const scopeNode = "source" in context || context.kind !== "scope" ? undefined : context;
            return {
              ...item,
              label: "删除节点",
              handler: async () => {
                if (scopeNode) {
                  this.editor
                    .getNodes()
                    .filter((node) => node.parent === scopeNode.id)
                    .forEach((node) => {
                      node.parent = scopeNode.parent;
                    });
                }
                await item.handler();
                if (scopeNode?.parent) await this.scopes.update(scopeNode.parent);
              }
            };
          })
        };
      }
    });
    contextMenu.addPipe((context) => {
      if (context.type !== "contextmenu") return context;
      const event = this.contextMenuPointerEvent(context.data.event);
      return { ...context, data: { ...context.data, event } };
    });
    this.editor.use(this.area);
    this.area.use(renderer);
    this.area.use(connections);
    this.area.use(this.scopes);
    this.area.use(contextMenu);
    this.editor.addPipe((context) => {
      if (
        !this.initializing &&
        (context.type === "connectioncreated" ||
          context.type === "connectionremoved" ||
          context.type === "noderemoved")
      )
        queueMicrotask(() => this.notifyBlueprintChange());
      return context;
    });
    AreaExtensions.selectableNodes(this.area, AreaExtensions.selector(), {
      accumulating: AreaExtensions.accumulateOnCtrl()
    });
    this.area.addPipe((context) => {
      if (context.type === "nodepicked") {
        const node = this.editor.getNode(context.data.id) as BlueprintNode | undefined;
        this.onPredicateSelection?.(
          node?.semantic?.role === "predicate"
            ? {
                id: node.id,
                side: node.semantic.side,
                predicate: structuredClone(node.semantic.predicate),
                actionType: node.semantic.actionType
              }
            : undefined
        );
      }
      if (context.type === "translated" || context.type === "zoomed") this.updateGrid();
      return context;
    });
    this.updateGrid();
    this.ready = this.renderExample(initialRuleId);
  }

  public addNode(kind: PaletteNodeKind): void {
    const node = this.createPaletteNode(kind);
    const ordinal = this.addedNodeCount;
    void this.ready.then(async () => {
      if (this.destroyed) return;
      await this.editor.addNode(node);
      await this.area.translate(node.id, {
        x: 180 + ((ordinal - 1) % 3) * 345,
        y: 100 + Math.floor((ordinal - 1) / 3) * 230
      });
    });
  }

  public addScope(): void {
    const scope = this.createScopeNode();
    void this.ready.then(async () => {
      if (this.destroyed) return;
      await this.editor.addNode(scope);
      await this.area.translate(scope.id, this.viewportCenter());
    });
  }

  public setExample(ruleId: string): void {
    void this.ready.then(() => this.renderExample(ruleId));
  }

  public loadConstraintAST(
    ast: ConstraintRuleAst,
    layout?: ConstraintBlueprintLayout,
    featureLabels: Record<string, string> = {}
  ): void {
    void this.ready.then(() => this.renderConstraintAST(ast, layout, featureLabels));
  }

  public exportConstraintAST(): ConstraintRuleAst | undefined {
    const actionNodes = this.editor
      .getNodes()
      .map((node) => node as BlueprintNode)
      .filter((node) => node.semantic?.role === "action")
      .sort((left, right) => {
        const leftIndex = left.semantic?.role === "action" ? left.semantic.index : 0;
        const rightIndex = right.semantic?.role === "action" ? right.semantic.index : 0;
        return leftIndex - rightIndex;
      });
    if (!actionNodes.length)
      return this.currentConstraintAst ? structuredClone(this.currentConstraintAst) : undefined;
    const connections = this.editor.getConnections();
    const conditionRoots = actionNodes.map(
      (node) => connections.find((connection) => connection.target === node.id)?.source
    );
    if (conditionRoots.some((id) => !id) || new Set(conditionRoots).size !== 1)
      return this.currentConstraintAst ? structuredClone(this.currentConstraintAst) : undefined;
    const conditionRoot = conditionRoots[0];
    if (!conditionRoot)
      return this.currentConstraintAst ? structuredClone(this.currentConstraintAst) : undefined;
    const condition = this.exportExpressionNode(conditionRoot, "when");
    if (!condition)
      return this.currentConstraintAst ? structuredClone(this.currentConstraintAst) : undefined;
    const actions = actionNodes.map((node) => {
      if (node.semantic?.role !== "action") return undefined;
      const targetRoot = connections.find((connection) => connection.source === node.id)?.target;
      const target = targetRoot ? this.exportExpressionNode(targetRoot, "then") : undefined;
      return target ? { type: node.semantic.actionType, target } : undefined;
    });
    if (actions.some((action) => !action))
      return this.currentConstraintAst ? structuredClone(this.currentConstraintAst) : undefined;
    return {
      condition,
      actions: actions.filter((action): action is NonNullable<typeof action> => !!action)
    };
  }

  public exportConstraintBlueprint(): ConstraintBlueprintLayout {
    return {
      positions: Object.fromEntries(
        this.editor.getNodes().flatMap((node) => {
          const position = this.area.nodeViews.get(node.id)?.position;
          return position ? [[node.id, { x: position.x, y: position.y }]] : [];
        })
      )
    };
  }

  public setOnBlueprintChange(
    handler: (ast: ConstraintRuleAst, layout: ConstraintBlueprintLayout) => void
  ): void {
    this.onBlueprintChange = handler;
  }

  public setOnPredicateSelection(
    handler: (selection: BlueprintPredicateSelection | undefined) => void
  ): void {
    this.onPredicateSelection = handler;
  }

  public updatePredicate(id: string, predicate: ConstraintPredicate): void {
    const node = this.editor.getNode(id) as BlueprintNode | undefined;
    if (!node || node.semantic?.role !== "predicate") return;
    node.semantic = { ...node.semantic, predicate: structuredClone(predicate) };
    node.label = `${predicate.feature} · ${predicate.type.replaceAll("_", " ")}`;
    const detail = node.controls.detail;
    if (detail instanceof ClassicPreset.InputControl) {
      const value = Array.isArray(predicate.value)
        ? predicate.value.join(", ")
        : String(predicate.value);
      detail.setValue(value);
    }
    void this.area.update("node", node.id);
    this.notifyBlueprintChange();
    this.onPredicateSelection?.({
      id: node.id,
      side: node.semantic.side,
      predicate: structuredClone(predicate),
      actionType: node.semantic.actionType
    });
  }

  private async renderConstraintAST(
    ast: ConstraintRuleAst,
    layout: ConstraintBlueprintLayout = { positions: {} },
    featureLabels: Record<string, string> = {}
  ): Promise<void> {
    if (this.destroyed) return;
    this.initializing = true;
    this.currentConstraintAst = structuredClone(ast);
    await this.editor.clear();
    this.semanticNodeCount = 0;
    const positions = { ...layout.positions };
    positions["constraint-condition"] ??= positions["constraint-when"];
    positions["constraint-action-node-0"] ??= positions["constraint-relation"];
    positions["constraint-result-0"] ??= positions["constraint-then"];
    const constraintLayout = { positions };
    const position = (id: string, fallback: { x: number; y: number }) =>
      constraintLayout.positions[id] ?? fallback;
    const scope = new BlueprintNode("约束范围", "scope");
    scope.id = "constraint-scope";
    scope.width = 1120;
    scope.height = Math.max(360, ast.actions.length * 190 + 120);
    await this.editor.addNode(scope);
    await this.area.translate(scope.id, position(scope.id, { x: 0, y: 0 }));

    const conditionRoot = await this.createExpressionNode(
      ast.condition,
      "when",
      "condition",
      scope.id,
      120,
      120 + Math.max(0, ast.actions.length - 1) * 80,
      constraintLayout,
      featureLabels
    );
    const conditionNode = this.editor.getNode(conditionRoot);
    for (let index = 0; index < ast.actions.length; index += 1) {
      const action = ast.actions[index];
      const y = 120 + index * 190;
      const actionNode = new BlueprintNode(action.type, "action");
      actionNode.id = `constraint-action-node-${index}`;
      actionNode.parent = scope.id;
      actionNode.semantic = { role: "action", index, actionType: action.type };
      actionNode.addInput("condition", new ClassicPreset.Input(socket, "条件成立"));
      actionNode.addOutput("target", new ClassicPreset.Output(socket, "应用结果"));
      actionNode.addControl(
        "detail",
        new ClassicPreset.InputControl("text", {
          initial: action.type,
          readonly: true
        })
      );
      actionNode.width = 220;
      actionNode.height = 116;
      await this.editor.addNode(actionNode);
      await this.area.translate(actionNode.id, position(actionNode.id, { x: 500, y }));

      const targetRoot = await this.createExpressionNode(
        action.target,
        "then",
        `result-${index}`,
        scope.id,
        850,
        y,
        constraintLayout,
        featureLabels,
        action.type
      );
      const targetNode = this.editor.getNode(targetRoot);
      if (conditionNode && targetNode) {
        await this.editor.addConnection(
          new ClassicPreset.Connection(conditionNode, "out", actionNode, "condition")
        );
        await this.editor.addConnection(
          new ClassicPreset.Connection(actionNode, "target", targetNode, "in")
        );
      }
    }
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
    );
    await this.scopes.update(scope.id);
    this.initializing = false;
    if (!this.destroyed)
      await AreaExtensions.zoomAt(this.area, this.editor.getNodes(), { scale: 0.8 });
  }

  private async createExpressionNode(
    expression: ConstraintExpression,
    side: "when" | "then",
    path: string,
    parentId: string,
    x: number,
    y: number,
    layout: ConstraintBlueprintLayout,
    featureLabels: Record<string, string>,
    actionType?: ConstraintActionType
  ): Promise<string> {
    const id = `constraint-${path}`;
    if ("feature" in expression) {
      const featureLabel = featureLabels[expression.feature] ?? expression.feature;
      const values = Array.isArray(expression.value)
        ? expression.value.join(", ")
        : String(expression.value);
      const operator = expression.type.replaceAll("_", " ");
      const node = new BlueprintNode(
        `${featureLabel} · ${operator}`,
        side === "when" ? "source" : "action"
      );
      node.id = id;
      node.parent = parentId;
      node.semantic = {
        role: "predicate",
        side,
        predicate: structuredClone(expression),
        actionType
      };
      node.addControl(
        "detail",
        new ClassicPreset.InputControl("text", { initial: values, readonly: true })
      );
      if (side === "when") node.addOutput("out", new ClassicPreset.Output(socket, "条件"));
      else node.addInput("in", new ClassicPreset.Input(socket, "满足时"));
      await this.editor.addNode(node);
      await this.area.translate(node.id, layout.positions[id] ?? { x, y });
      return node.id;
    }

    const children = "expressions" in expression ? expression.expressions : [expression.expression];
    const operator = "expressions" in expression ? expression.type : "NOT";
    const node = new BlueprintNode(`逻辑 · ${operator}`, "logic");
    node.id = id;
    node.parent = parentId;
    node.semantic = { role: "logic", side, operator };
    if (side === "when") {
      children.forEach((_, index) =>
        node.addInput(`in${index}`, new ClassicPreset.Input(socket, `条件 ${index + 1}`))
      );
      node.addOutput("out", new ClassicPreset.Output(socket, "结果"));
    } else {
      node.addInput("in", new ClassicPreset.Input(socket, "满足时"));
      children.forEach((_, index) =>
        node.addOutput(`out${index}`, new ClassicPreset.Output(socket, `结果 ${index + 1}`))
      );
    }
    node.width = 220;
    node.height = 108 + Math.max(children.length, 1) * 28;
    await this.editor.addNode(node);
    await this.area.translate(node.id, layout.positions[id] ?? { x, y });

    const direction = side === "when" ? -330 : 330;
    const childIds = await Promise.all(
      children.map((child, index) =>
        this.createExpressionNode(
          child,
          side,
          `${path}-${index}`,
          parentId,
          x + direction,
          y + (index - (children.length - 1) / 2) * 150,
          layout,
          featureLabels,
          actionType
        )
      )
    );
    for (let index = 0; index < childIds.length; index += 1) {
      const childNode = this.editor.getNode(childIds[index]);
      if (!childNode) continue;
      const connection =
        side === "when"
          ? new ClassicPreset.Connection(childNode, "out", node, `in${index}`)
          : new ClassicPreset.Connection(node, `out${index}`, childNode, "in");
      await this.editor.addConnection(connection);
    }
    return node.id;
  }

  private exportExpressionNode(
    nodeId: string,
    side: "when" | "then"
  ): ConstraintExpression | undefined {
    const node = this.editor.getNode(nodeId) as BlueprintNode | undefined;
    if (!node?.semantic) return undefined;
    if (node.semantic.role === "predicate") return structuredClone(node.semantic.predicate);
    if (node.semantic.role !== "logic") return undefined;
    const connections = this.editor.getConnections();
    const childIds =
      side === "when"
        ? connections
            .filter((connection) => connection.target === node.id)
            .map((connection) => connection.source)
        : connections
            .filter((connection) => connection.source === node.id)
            .map((connection) => connection.target);
    const children = childIds
      .map((childId) => this.exportExpressionNode(childId, side))
      .filter((child): child is ConstraintExpression => !!child);
    if (!children.length) return undefined;
    return node.semantic.operator === "NOT"
      ? { type: "NOT", expression: children[0] }
      : { type: node.semantic.operator, expressions: children };
  }

  private notifyBlueprintChange(): void {
    const ast = this.exportConstraintAST();
    if (!ast) return;
    this.currentConstraintAst = structuredClone(ast);
    this.onBlueprintChange?.(structuredClone(ast), this.exportConstraintBlueprint());
  }

  public fit(): void {
    void this.ready.then(async () => {
      if (!this.destroyed)
        await AreaExtensions.zoomAt(this.area, this.editor.getNodes(), { scale: 0.8 });
    });
  }

  public validate(): { nodes: number; connections: number } {
    return {
      nodes: this.editor.getNodes().length,
      connections: this.editor.getConnections().length
    };
  }

  public destroy(): void {
    this.destroyed = true;
    this.host.removeEventListener("contextmenu", this.preventBrowserContextMenu);
    this.area.destroy();
    this.host.replaceChildren();
  }

  private async renderExample(ruleId: string): Promise<void> {
    if (this.destroyed) return;
    const rule =
      constraintMockRules.find((example) => example.id === ruleId) ?? constraintMockRules[0];
    await this.editor.clear();
    const nodes = new Map<string, BlueprintNode>();

    for (const spec of rule.nodes) {
      const node = createRuleNode(spec);
      nodes.set(spec.id, node);
      await this.editor.addNode(node);
      await this.area.translate(node.id, spec.position);
    }
    for (const connection of rule.connections) {
      const from = nodes.get(connection.from);
      const to = nodes.get(connection.to);
      if (!from || !to) continue;
      await this.editor.addConnection(
        new ClassicPreset.Connection(from, "out", to, `in${connection.input}`)
      );
    }

    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
    );
    await Promise.all(
      [...nodes.values()]
        .filter((node) => node.kind === "scope")
        .map((node) => this.scopes.update(node.id))
    );
    if (!this.destroyed)
      await AreaExtensions.zoomAt(this.area, [...nodes.values()], { scale: 0.8 });
  }

  private createPaletteNode(kind: PaletteNodeKind): BlueprintNode {
    this.addedNodeCount += 1;
    return createPaletteNode(kind, this.addedNodeCount);
  }

  private createScopeNode(): BlueprintNode {
    this.scopeCount += 1;
    const node = new BlueprintNode(`范围组 ${this.scopeCount}`, "scope");
    node.width = 480;
    node.height = 320;
    return node;
  }

  private viewportCenter(): { x: number; y: number } {
    const { x, y, k } = this.area.area.transform;
    return {
      x: (this.host.clientWidth / 2 - x) / k,
      y: (this.host.clientHeight / 2 - y) / k
    };
  }

  private contextMenuPointerEvent(event: MouseEvent): MouseEvent {
    event.preventDefault();
    event.stopPropagation();
    let fixedContainingBlock: HTMLElement | undefined;
    for (let ancestor = this.host.parentElement; ancestor; ancestor = ancestor.parentElement) {
      const style = getComputedStyle(ancestor);
      const willChange = style.willChange.split(",").map((value) => value.trim());
      if (
        style.transform !== "none" ||
        style.perspective !== "none" ||
        style.filter !== "none" ||
        style.backdropFilter !== "none" ||
        willChange.some((value) => ["transform", "perspective", "filter"].includes(value)) ||
        /\b(layout|paint|strict|content)\b/.test(style.contain)
      ) {
        fixedContainingBlock = ancestor;
        break;
      }
    }
    const rect = fixedContainingBlock?.getBoundingClientRect();
    const clientX = event.clientX + 8;
    const clientY = event.clientY;
    return new MouseEvent("contextmenu", {
      bubbles: event.bubbles,
      cancelable: event.cancelable,
      clientX: clientX - (rect?.left ?? 0),
      clientY: clientY - (rect?.top ?? 0),
      button: event.button,
      buttons: event.buttons,
      ctrlKey: event.ctrlKey,
      shiftKey: event.shiftKey,
      altKey: event.altKey,
      metaKey: event.metaKey
    });
  }

  private updateGrid(): void {
    const { x, y, k } = this.area.area.transform;
    const minorSize = 24 * k;
    const majorSize = 120 * k;
    const modulo = (value: number, size: number): number => ((value % size) + size) % size;
    this.host.style.setProperty("--cmBlueprintGridMinorSize", `${minorSize}px`);
    this.host.style.setProperty("--cmBlueprintGridMajorSize", `${majorSize}px`);
    this.host.style.setProperty("--cmBlueprintGridMinorOffsetX", `${modulo(x, minorSize)}px`);
    this.host.style.setProperty("--cmBlueprintGridMinorOffsetY", `${modulo(y, minorSize)}px`);
    this.host.style.setProperty(
      "--cmBlueprintGridMajorOffsetX",
      `${modulo(x + minorSize / 2, majorSize)}px`
    );
    this.host.style.setProperty(
      "--cmBlueprintGridMajorOffsetY",
      `${modulo(y + minorSize / 2, majorSize)}px`
    );
  }
}

export function mount(
  host: HTMLElement,
  initialRuleId = constraintMockRules[0].id
): {
  addNode: (kind: PaletteNodeKind) => void;
  addScope: () => void;
  setExample: (ruleId: string) => void;
  loadConstraintAST: (
    ast: ConstraintRuleAst,
    layout?: ConstraintBlueprintLayout,
    featureLabels?: Record<string, string>
  ) => void;
  exportConstraintAST: () => ConstraintRuleAst | undefined;
  exportConstraintBlueprint: () => ConstraintBlueprintLayout;
  setOnBlueprintChange: (
    handler: (ast: ConstraintRuleAst, layout: ConstraintBlueprintLayout) => void
  ) => void;
  setOnPredicateSelection: (
    handler: (selection: BlueprintPredicateSelection | undefined) => void
  ) => void;
  updatePredicate: (id: string, predicate: ConstraintPredicate) => void;
  fit: () => void;
  validate: () => { nodes: number; connections: number };
  destroy: () => void;
} {
  const editor = new BlueprintEditor(host, initialRuleId);
  return {
    addNode: (kind) => editor.addNode(kind),
    addScope: () => editor.addScope(),
    setExample: (ruleId) => editor.setExample(ruleId),
    loadConstraintAST: (ast, layout, featureLabels) =>
      editor.loadConstraintAST(ast, layout, featureLabels),
    exportConstraintAST: () => editor.exportConstraintAST(),
    exportConstraintBlueprint: () => editor.exportConstraintBlueprint(),
    setOnBlueprintChange: (handler) => editor.setOnBlueprintChange(handler),
    setOnPredicateSelection: (handler) => editor.setOnPredicateSelection(handler),
    updatePredicate: (id, predicate) => editor.updatePredicate(id, predicate),
    fit: () => editor.fit(),
    validate: () => editor.validate(),
    destroy: () => editor.destroy()
  };
}
