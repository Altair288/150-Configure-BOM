import { Document } from "@chili3d/app-document";
import {
  EditableShapeNode,
  FolderNode,
  GroupNode,
  Material,
  Mesh,
  MeshNode,
  NodeUtils,
  NodeSelectionHandler,
  ObservableCollection,
  type IDocument,
  type IApplication,
  type IEventHandler,
  type INode,
  type INodeLinkedList,
  type IView,
  Plane,
  ShapeTypes,
  SubshapeSelectionHandler,
  VisualNode,
  type VisualShapeData
} from "@chili3d/core";
import { ThreeVisulFactory } from "@chili3d/three-factory";
import { ThreeView } from "@chili3d/three-view";
import { ThreeVisual } from "@chili3d/three-visual";
import { initWasm, OccShapeConverter } from "@chili3d/wasm";
import {
  AxesHelper,
  EdgesGeometry,
  LineBasicMaterial,
  LineSegments,
  Mesh as ThreeMesh,
  Object3D,
  Vector3
} from "three";
import { bicycleGeometry } from "../webapp/model/bicycle";
import { freeOrbit } from "./free-orbit";

export type PreviewSelectionMode = "part" | "face" | "edge" | "vertex";
export type PreviewShadingMode = "shaded" | "shaded-edges" | "edges";

export interface PreviewNode {
  id: string;
  number: string;
  name: string;
  materialId: string;
  quantity: number;
  unit: string;
  lifecycle: string;
  changeStatus: string;
  state: string;
  kind: string;
  visualState: string;
  visible: boolean;
  geometryKey?: string;
  color?: number;
  children?: PreviewNode[];
}

export interface ChiliPreviewOptions {
  onNodeSelected?: (nodeId: string | undefined) => void;
  onModelLoaded?: (nodes: PreviewNode[]) => void;
  onStateChanged?: (state: {
    selectionMode: PreviewSelectionMode;
    shadingMode: PreviewShadingMode;
    cameraType: "perspective" | "orthographic";
    axesVisible: boolean;
  }) => void;
  onError?: (message: string) => void;
}

interface PreviewApplication {
  documents: Set<IDocument>;
  views: ObservableCollection<IView>;
  visualFactory: ThreeVisulFactory;
  activeView?: IView;
}

interface ModelNodeInput extends PreviewNode {
  children?: ModelNodeInput[];
}

export default class ChiliPreviewHost {
  private readonly application: PreviewApplication;
  private readonly document: IDocument;
  private readonly visual: ThreeVisual;
  private readonly view: ThreeView;
  private readonly converter = new OccShapeConverter();
  private readonly nodeById = new Map<string, INode>();
  private readonly materials = new Map<string, Material>();
  private readonly edgeOverlays = new Map<string, LineSegments>();
  private selectionHandler: IEventHandler;
  private wasmReady?: Promise<void>;
  private currentNodeId?: string;
  private selectionMode: PreviewSelectionMode = "part";
  private shadingMode: PreviewShadingMode = "shaded-edges";
  private axesVisible = true;
  private disposed = false;
  private suppressSelectionEvent = false;
  private navigation:
    { mode: "pan" | "orbit"; pointerId: number; x: number; y: number } | undefined;

  constructor(
    private readonly host: HTMLElement,
    private readonly options: ChiliPreviewOptions = {}
  ) {
    this.application = {
      documents: new Set<IDocument>(),
      views: new ObservableCollection<IView>(),
      visualFactory: new ThreeVisulFactory((document) => new NodeSelectionHandler(document, false))
    };

    this.document = new Document(this.application as unknown as IApplication, "CAD Preview");
    this.visual = this.document.visual as ThreeVisual;
    this.view = this.visual.createView("CAD Preview", Plane.XY) as ThreeView;
    this.application.activeView = this.view;
    this.selectionHandler = this.visual.eventHandler;

    this.view.setDom(host);
    this.prepareHost();
    this.bindEvents();
    this.document.selection.onNodeChanged.sub(this.handleNodeSelection);
    this.document.selection.onShapeChanged.sub(this.handleShapeSelection);
  }

  loadBom(nodes: PreviewNode[]): void {
    this.ensureActive();
    this.clearDocumentNodes();
    this.nodeById.clear();

    const root = this.document.modelManager.rootNode;
    nodes.forEach((node) => this.addPreviewNode(node, root));
    this.document.visual.update();
    this.view.cameraController.fitContent();
    this.syncEdgeOverlays();
    this.setShadingMode(this.shadingMode);
    this.currentNodeId = nodes[0]?.id;
    this.emitModelLoaded(nodes);
  }

  async loadFile(file: File): Promise<void> {
    this.ensureActive();

    try {
      await this.ensureWasm();
      const importedNode = await this.convertFile(file);
      if (!importedNode) {
        throw new Error(`Unsupported model format: ${file.name}`);
      }

      if (
        importedNode instanceof FolderNode &&
        (!importedNode.name || importedNode.name === "undefined")
      ) {
        importedNode.name = file.name;
      }

      this.clearDocumentNodes();
      this.nodeById.clear();
      this.document.modelManager.rootNode.add(importedNode);
      this.document.visual.update();
      this.view.cameraController.fitContent();
      this.syncEdgeOverlays();
      this.setShadingMode(this.shadingMode);
      this.emitModelLoaded(this.readDocumentNodes());
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.options.onError?.(message);
    }
  }

  selectNode(nodeId: string): void {
    this.ensureActive();
    const node = this.nodeById.get(nodeId);
    if (!node) return;

    const selectedNodes =
      node instanceof VisualNode
        ? [node]
        : NodeUtils.findNodes(node as INodeLinkedList).filter(
            (candidate): candidate is VisualNode => candidate instanceof VisualNode
          );

    this.suppressSelectionEvent = true;
    this.document.selection.setSelectedNodes(selectedNodes, false);
    this.suppressSelectionEvent = false;
    this.currentNodeId = nodeId;
    this.options.onNodeSelected?.(nodeId);
  }

  setNodeVisibility(nodeId: string, visible: boolean): boolean {
    this.ensureActive();
    const node = this.nodeById.get(nodeId);
    if (!node) return false;

    node.visible = visible;
    this.document.visual.update();
    return node.visible;
  }

  setSelectionMode(mode: PreviewSelectionMode): void {
    this.ensureActive();
    this.selectionHandler.dispose();
    this.selectionMode = mode;

    if (mode === "part") {
      this.selectionHandler = new NodeSelectionHandler(this.document, false);
    } else {
      const shapeType = ShapeTypes[mode];
      this.selectionHandler = new SubshapeSelectionHandler(this.document, shapeType, false);
    }

    this.visual.eventHandler = this.selectionHandler;
    this.document.selection.clearSelection();
    this.emitStateChanged();
  }

  setShadingMode(mode: PreviewShadingMode): void {
    this.ensureActive();
    this.shadingMode = mode;
    this.view.mode =
      mode === "shaded" ? "solid" : mode === "edges" ? "wireframe" : "solidAndWireframe";
    const showEdges = mode !== "shaded";
    this.edgeOverlays.forEach((edge) => {
      edge.visible = showEdges;
    });
    this.view.update();
    this.emitStateChanged();
  }

  setCameraType(type: "perspective" | "orthographic"): void {
    this.ensureActive();
    this.view.cameraController.cameraType = type;
    this.view.cameraController.fitContent();
    this.view.update();
    this.emitStateChanged();
  }

  setAxesVisible(visible: boolean): boolean {
    this.ensureActive();
    this.axesVisible = visible;
    const axes = this.visual.scene.children.find(
      (child): child is AxesHelper => child instanceof AxesHelper
    );
    if (axes) axes.visible = visible;
    this.view.update();
    this.emitStateChanged();
    return visible;
  }

  fit(): void {
    this.ensureActive();
    this.view.cameraController.fitContent();
    this.view.update();
  }

  zoomIn(): void {
    this.ensureActive();
    this.view.cameraController.zoom(this.view.width / 2, this.view.height / 2, -5);
    this.view.update();
  }

  zoomOut(): void {
    this.ensureActive();
    this.view.cameraController.zoom(this.view.width / 2, this.view.height / 2, 5);
    this.view.update();
  }

  clearSelection(): void {
    this.ensureActive();
    this.document.selection.clearSelection();
    this.currentNodeId = undefined;
    this.options.onNodeSelected?.(undefined);
  }

  destroy(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.unbindEvents();
    this.document.selection.onNodeChanged.remove(this.handleNodeSelection);
    this.document.selection.onShapeChanged.remove(this.handleShapeSelection);
    this.selectionHandler.dispose();
    this.edgeOverlays.forEach((edge) => {
      edge.geometry.dispose();
      (edge.material as LineBasicMaterial).dispose();
      edge.removeFromParent();
    });
    this.edgeOverlays.clear();
    this.view.renderer.dispose();
    this.view.renderer.domElement.remove();
    this.application.views.remove(this.view);
    (this.view as unknown as { _isClosed: boolean })._isClosed = true;
    this.view.dispose();
    this.document.dispose();
    this.application.documents.delete(this.document);
  }

  private addPreviewNode(input: ModelNodeInput, parent: INodeLinkedList): INode {
    const isGroup = input.kind !== "Part" || (input.children?.length ?? 0) > 0;
    if (isGroup) {
      const group = new GroupNode({ document: this.document, name: input.name, id: input.id });
      group.visible = input.visible !== false;
      this.nodeById.set(input.id, group);
      parent.add(group);
      input.children?.forEach((child) => this.addPreviewNode(child, group));
      return group;
    }

    const material = this.materialFor(input);
    const meshNode = new MeshNode({
      document: this.document,
      name: input.name,
      id: input.id,
      materialId: material.id,
      mesh: this.createBicycleMesh(input)
    });
    meshNode.visible = input.visible !== false;
    this.nodeById.set(input.id, meshNode);
    parent.add(meshNode);
    return meshNode;
  }

  private materialFor(input: PreviewNode): Material {
    const key = `${input.lifecycle || input.kind || "default"}:${input.color ?? "default"}`;
    const existing = this.materials.get(key);
    if (existing) return existing;

    const color =
      input.color ??
      (input.lifecycle === "Design"
        ? 0xf0a04b
        : input.lifecycle === "Production"
          ? 0xd24445
          : 0x4c7e9f);
    const material = new Material({ document: this.document, name: key, color });
    this.materials.set(key, material);
    this.document.modelManager.materials.push(material);
    return material;
  }

  private createBicycleMesh(input: ModelNodeInput): Mesh {
    const geometry = bicycleGeometry(input.geometryKey ?? this.geometryKeyFor(input));
    if (geometry) {
      const position = geometry.getAttribute("position");
      const normal = geometry.getAttribute("normal");
      const index = geometry.index;
      const mesh = new Mesh({
        meshType: "surface",
        position: new Float32Array(position.array as ArrayLike<number>),
        normal: normal ? new Float32Array(normal.array as ArrayLike<number>) : undefined,
        index: index ? new Uint32Array(index.array as ArrayLike<number>) : undefined
      });
      geometry.dispose();
      return mesh;
    }

    return this.createBoxMesh();
  }

  private geometryKeyFor(input: ModelNodeInput): string {
    const key = `${input.number} ${input.name}`.toLowerCase();
    if (key.includes("frame") || key.includes("车架")) return "frame";
    if (key.includes("fork") || key.includes("前叉")) return "fork";
    if (key.includes("cockpit") || key.includes("handle") || key.includes("车把")) return "cockpit";
    if (key.includes("saddle") || key.includes("座垫") || key.includes("坐垫")) return "saddle";
    if (key.includes("front") || key.includes("前轮")) return "front-road";
    if (key.includes("rear") || key.includes("后轮")) return "rear-road";
    if (key.includes("crank") || key.includes("牙盘")) return "crank";
    if (key.includes("chain") || key.includes("链条")) return "chain";
    if (key.includes("brake") || key.includes("碟刹")) return "brakes";
    if (key.includes("rack") || key.includes("货架")) return "rack";
    if (key.includes("light") || key.includes("灯")) return "lights";
    if (key.includes("fender") || key.includes("挡泥板")) return "fenders";
    return "frame";
  }

  private createBoxMesh(): Mesh {
    const vertices: number[] = [];
    const normals: number[] = [];
    const indices: number[] = [];
    const half = { x: 34, y: 22, z: 12 };
    const faces = [
      {
        normal: [1, 0, 0],
        corners: [
          [half.x, -half.y, -half.z],
          [half.x, half.y, -half.z],
          [half.x, half.y, half.z],
          [half.x, -half.y, half.z]
        ]
      },
      {
        normal: [-1, 0, 0],
        corners: [
          [-half.x, half.y, -half.z],
          [-half.x, -half.y, -half.z],
          [-half.x, -half.y, half.z],
          [-half.x, half.y, half.z]
        ]
      },
      {
        normal: [0, 1, 0],
        corners: [
          [-half.x, half.y, -half.z],
          [half.x, half.y, -half.z],
          [half.x, half.y, half.z],
          [-half.x, half.y, half.z]
        ]
      },
      {
        normal: [0, -1, 0],
        corners: [
          [half.x, -half.y, -half.z],
          [-half.x, -half.y, -half.z],
          [-half.x, -half.y, half.z],
          [half.x, -half.y, half.z]
        ]
      },
      {
        normal: [0, 0, 1],
        corners: [
          [-half.x, -half.y, half.z],
          [half.x, -half.y, half.z],
          [half.x, half.y, half.z],
          [-half.x, half.y, half.z]
        ]
      },
      {
        normal: [0, 0, -1],
        corners: [
          [-half.x, half.y, -half.z],
          [half.x, half.y, -half.z],
          [half.x, -half.y, -half.z],
          [-half.x, -half.y, -half.z]
        ]
      }
    ];

    faces.forEach((face, faceIndex) => {
      const start = faceIndex * 4;
      face.corners.forEach((corner) => {
        vertices.push(...corner);
        normals.push(...face.normal);
      });
      indices.push(start, start + 1, start + 2, start, start + 2, start + 3);
    });

    return new Mesh({
      meshType: "surface",
      position: new Float32Array(vertices),
      normal: new Float32Array(normals),
      index: new Uint32Array(indices)
    });
  }

  private async convertFile(file: File): Promise<INode | undefined> {
    const extension = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
    const data = new Uint8Array(await file.arrayBuffer());

    if (extension === ".step" || extension === ".stp") {
      const result = this.converter.convertFromSTEP(this.document, data);
      return result.isOk ? result.value : undefined;
    }
    if (extension === ".iges" || extension === ".igs") {
      const result = this.converter.convertFromIGES(this.document, data);
      return result.isOk ? result.value : undefined;
    }
    if (extension === ".stl") {
      const result = this.converter.convertFromSTL(this.document, data);
      return result.isOk ? result.value : undefined;
    }
    if (extension === ".brep") {
      const shape = this.converter.convertFromBrep(await file.text());
      if (!shape.isOk) return undefined;
      const folder = new FolderNode({ document: this.document, name: file.name });
      folder.add(
        new EditableShapeNode({ document: this.document, name: file.name, shape: shape.value })
      );
      return folder;
    }

    return undefined;
  }

  private readDocumentNodes(): PreviewNode[] {
    this.nodeById.clear();
    const nodes = this.childrenOf(this.document.modelManager.rootNode).map((node) =>
      this.readNode(node)
    );
    return nodes;
  }

  private readNode(node: INode): PreviewNode {
    this.nodeById.set(node.id, node);
    const children = node as INodeLinkedList;
    const childNodes = this.isLinkedList(children)
      ? this.childrenOf(children).map((child) => this.readNode(child))
      : [];
    const visualNode = node as VisualNode;
    const materialId =
      "materialId" in visualNode
        ? String((visualNode as unknown as { materialId: string }).materialId)
        : "";

    return {
      id: node.id,
      number: node.name,
      name: node.name,
      materialId,
      quantity: 1,
      unit: "EA",
      lifecycle: "Loaded",
      changeStatus: "",
      state: "Loaded",
      kind: childNodes.length > 0 ? "Assembly" : "Part",
      visualState: "Loaded",
      visible: node.visible,
      ...(childNodes.length > 0 ? { children: childNodes } : {})
    };
  }

  private emitModelLoaded(nodes: PreviewNode[]): void {
    this.options.onModelLoaded?.(nodes);
    if (this.currentNodeId) {
      this.options.onNodeSelected?.(this.currentNodeId);
    }
  }

  private clearDocumentNodes(): void {
    this.document.selection.clearSelection();
    const root = this.document.modelManager.rootNode;
    const children = this.childrenOf(root);
    if (children.length > 0) {
      root.remove(...children);
      children.forEach((node) => node.dispose());
    }
    this.currentNodeId = undefined;
    this.materials.clear();
  }

  private ensureWasm(): Promise<void> {
    this.wasmReady ??= initWasm().then(() => undefined);
    return this.wasmReady;
  }

  private prepareHost(): void {
    this.host.style.position = "relative";
    this.host.style.overflow = "hidden";
    this.host.style.width = "100%";
    this.host.style.height = "100%";
    this.host.style.minHeight = "18rem";
    this.view.renderer.domElement.style.display = "block";
    this.view.renderer.domElement.style.width = "100%";
    this.view.renderer.domElement.style.height = "100%";
  }

  private bindEvents(): void {
    this.host.addEventListener("pointerdown", this.handlePointerDown);
    this.host.addEventListener("pointermove", this.handlePointerMove);
    this.host.addEventListener("pointerup", this.handlePointerUp);
    this.host.addEventListener("pointerout", this.handlePointerOut);
    this.host.addEventListener("wheel", this.handleWheel, { passive: false });
    this.host.addEventListener("contextmenu", this.handleContextMenu);
  }

  private unbindEvents(): void {
    this.host.removeEventListener("pointerdown", this.handlePointerDown);
    this.host.removeEventListener("pointermove", this.handlePointerMove);
    this.host.removeEventListener("pointerup", this.handlePointerUp);
    this.host.removeEventListener("pointerout", this.handlePointerOut);
    this.host.removeEventListener("wheel", this.handleWheel);
    this.host.removeEventListener("contextmenu", this.handleContextMenu);
  }

  private readonly handlePointerDown = (event: PointerEvent): void => {
    event.preventDefault();
    this.application.activeView = this.view;
    if (event.button === 1 || event.button === 2) {
      this.navigation = {
        mode: event.button === 2 ? "orbit" : "pan",
        pointerId: event.pointerId,
        x: event.clientX,
        y: event.clientY
      };
      this.host.setPointerCapture?.(event.pointerId);
      return;
    }
    this.dispatch("pointerDown", event);
  };

  private readonly handlePointerMove = (event: PointerEvent): void => {
    event.preventDefault();
    if (this.navigation?.pointerId === event.pointerId) {
      const dx = event.clientX - this.navigation.x;
      const dy = event.clientY - this.navigation.y;
      this.navigation.x = event.clientX;
      this.navigation.y = event.clientY;

      if (this.navigation.mode === "pan") {
        this.view.cameraController.pan(dx, dy);
      } else {
        const controller = this.view.cameraController;
        const eye = new Vector3(
          controller.cameraPosition.x,
          controller.cameraPosition.y,
          controller.cameraPosition.z
        );
        const target = new Vector3(
          controller.cameraTarget.x,
          controller.cameraTarget.y,
          controller.cameraTarget.z
        );
        const up = new Vector3(controller.cameraUp.x, controller.cameraUp.y, controller.cameraUp.z);
        const result = freeOrbit(eye, target, up, dx, dy);
        controller.lookAt(result.eye, target, result.up);
      }
      this.view.update();
      return;
    }
    this.dispatch("pointerMove", event);
  };

  private readonly handlePointerUp = (event: PointerEvent): void => {
    event.preventDefault();
    if (this.navigation?.pointerId === event.pointerId) {
      this.host.releasePointerCapture?.(event.pointerId);
      this.navigation = undefined;
      return;
    }
    this.dispatch("pointerUp", event);
  };

  private readonly handlePointerOut = (event: PointerEvent): void => {
    this.dispatch("pointerOut", event);
  };

  private readonly handleWheel = (event: WheelEvent): void => {
    event.preventDefault();
    this.dispatch("mouseWheel", event);
  };

  private readonly handleContextMenu = (event: MouseEvent): void => {
    event.preventDefault();
  };

  private syncEdgeOverlays(): void {
    this.edgeOverlays.forEach((edge) => {
      edge.geometry.dispose();
      (edge.material as LineBasicMaterial).dispose();
      edge.removeFromParent();
    });
    this.edgeOverlays.clear();

    this.nodeById.forEach((node, nodeId) => {
      if (!(node instanceof VisualNode)) return;
      const visual = this.visual.context.getVisual(node);
      if (!(visual instanceof Object3D)) return;
      const mesh = visual.children.find((child): child is ThreeMesh => child instanceof ThreeMesh);
      if (!mesh) return;

      const edge = new LineSegments(
        new EdgesGeometry(mesh.geometry, 28),
        new LineBasicMaterial({ color: 0x243341, transparent: true, opacity: 0.75 })
      );
      edge.layers.set(1);
      edge.renderOrder = 2;
      edge.raycast = () => undefined;
      edge.visible = this.shadingMode !== "shaded";
      visual.add(edge);
      this.edgeOverlays.set(nodeId, edge);
    });
  }

  private dispatch(
    name: "pointerDown" | "pointerMove" | "pointerUp" | "pointerOut" | "mouseWheel",
    event: PointerEvent | WheelEvent
  ): void {
    if (this.visual.eventHandler.isEnabled)
      this.visual.eventHandler[name]?.(this.view, event as never);
    if (this.visual.viewHandler.isEnabled)
      this.visual.viewHandler[name]?.(this.view, event as never);
  }

  private readonly handleNodeSelection = (nodes: INode[]): void => {
    if (this.suppressSelectionEvent) return;
    const node = nodes.at(0);
    this.currentNodeId = node?.id;
    this.options.onNodeSelected?.(node?.id);
  };

  private readonly handleShapeSelection = (shapes: VisualShapeData[]): void => {
    if (this.suppressSelectionEvent) return;
    const owner = shapes.at(0)?.owner;
    const node = owner ? this.visual.context.getNode(owner) : undefined;
    this.currentNodeId = node?.id;
    this.options.onNodeSelected?.(node?.id);
  };

  private emitStateChanged(): void {
    this.options.onStateChanged?.({
      selectionMode: this.selectionMode,
      shadingMode: this.shadingMode,
      cameraType: this.view.cameraController.cameraType,
      axesVisible: this.axesVisible
    });
  }

  private childrenOf(node: INodeLinkedList): INode[] {
    const result: INode[] = [];
    let child = node.firstChild;
    while (child) {
      result.push(child);
      child = child.nextSibling;
    }
    return result;
  }

  private isLinkedList(node: INodeLinkedList): node is INodeLinkedList {
    return typeof node.firstChild !== "undefined" || typeof node.size === "function";
  }

  private ensureActive(): void {
    if (this.disposed) throw new Error("The Chili3D preview has been destroyed.");
  }
}

if (typeof window !== "undefined") {
  (window as Window & { ChiliCadPreview?: typeof ChiliPreviewHost }).ChiliCadPreview =
    ChiliPreviewHost;
}
