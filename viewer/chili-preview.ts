import { Document } from "@chili3d/app-document";
import {
  EditableShapeNode,
  FolderNode,
  GroupNode,
  Material,
  Matrix4,
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
import { Box3, Object3D, Plane as ThreePlane, Vector3 } from "three";

export type PreviewSelectionMode = "part" | "face" | "edge" | "vertex";

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
  children?: PreviewNode[];
}

export interface PreviewMeasurement {
  width: number;
  height: number;
  depth: number;
  text: string;
}

export interface ChiliPreviewOptions {
  onNodeSelected?: (nodeId: string | undefined) => void;
  onModelLoaded?: (nodes: PreviewNode[]) => void;
  onMeasure?: (measurement: PreviewMeasurement | undefined) => void;
  onStateChanged?: (state: {
    exploded: boolean;
    sectioned: boolean;
    selectionMode: PreviewSelectionMode;
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
  private readonly originalTransforms = new Map<string, Matrix4>();
  private readonly explodeOffsets = new Map<string, Vector3>();
  private readonly materials = new Map<string, Material>();
  private selectionHandler: IEventHandler;
  private wasmReady?: Promise<void>;
  private currentNodeId?: string;
  private selectionMode: PreviewSelectionMode = "part";
  private exploded = false;
  private sectioned = false;
  private leafIndex = 0;
  private disposed = false;
  private suppressSelectionEvent = false;

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
    this.leafIndex = 0;
    this.nodeById.clear();
    this.originalTransforms.clear();
    this.explodeOffsets.clear();

    const root = this.document.modelManager.rootNode;
    nodes.forEach((node) => this.addPreviewNode(node, root));
    this.document.visual.update();
    this.view.cameraController.fitContent();
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
      this.originalTransforms.clear();
      this.explodeOffsets.clear();
      this.leafIndex = 0;
      this.document.modelManager.rootNode.add(importedNode);
      this.document.visual.update();
      this.view.cameraController.fitContent();
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

  toggleExploded(): boolean {
    this.ensureActive();
    this.exploded = !this.exploded;

    this.nodeById.forEach((node, nodeId) => {
      if (!(node instanceof VisualNode)) return;
      const original = this.originalTransforms.get(nodeId);
      const offset = this.explodeOffsets.get(nodeId);
      if (!original || !offset) return;

      node.transform = this.exploded
        ? Matrix4.fromTranslation(offset.x, offset.y, offset.z).multiply(original)
        : original.clone();
    });

    this.document.visual.update();
    this.emitStateChanged();
    return this.exploded;
  }

  toggleSection(): boolean {
    this.ensureActive();
    this.sectioned = !this.sectioned;
    this.applySectionPlane();
    this.emitStateChanged();
    return this.sectioned;
  }

  measureSelected(): PreviewMeasurement | undefined {
    this.ensureActive();
    const selectedNodes = this.document.selection.getSelectedVisualNodes();
    const box = new Box3();

    selectedNodes.forEach((node) => {
      const visual = this.visual.context.getVisual(node);
      if (visual instanceof Object3D) {
        box.expandByObject(visual);
      }
    });

    if (box.isEmpty()) {
      this.options.onMeasure?.(undefined);
      return undefined;
    }

    const size = box.getSize(new Vector3());
    const measurement = {
      width: Number(size.x.toFixed(1)),
      height: Number(size.y.toFixed(1)),
      depth: Number(size.z.toFixed(1)),
      text: `${size.x.toFixed(1)} x ${size.y.toFixed(1)} x ${size.z.toFixed(1)} mm`
    };
    this.options.onMeasure?.(measurement);
    return measurement;
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
      mesh: this.createBoxMesh()
    });
    const offset = this.previewOffset(this.leafIndex++);
    meshNode.transform = Matrix4.fromTranslation(offset.x, offset.y, offset.z);
    meshNode.visible = input.visible !== false;
    this.nodeById.set(input.id, meshNode);
    this.originalTransforms.set(input.id, meshNode.transform.clone());
    this.explodeOffsets.set(input.id, new Vector3(offset.x * 0.42, offset.y * 0.42, 40));
    parent.add(meshNode);
    return meshNode;
  }

  private materialFor(input: PreviewNode): Material {
    const key = input.lifecycle || input.kind || "default";
    const existing = this.materials.get(key);
    if (existing) return existing;

    const color =
      input.lifecycle === "Design"
        ? 0xf0a04b
        : input.lifecycle === "Production"
          ? 0xd24445
          : 0x4c7e9f;
    const material = new Material({ document: this.document, name: key, color });
    this.materials.set(key, material);
    this.document.modelManager.materials.push(material);
    return material;
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

  private previewOffset(index: number): { x: number; y: number; z: number } {
    const layout = [
      { x: -150, y: 0, z: 18 },
      { x: -60, y: 0, z: 28 },
      { x: 40, y: 0, z: 22 },
      { x: 140, y: 0, z: 20 },
      { x: -105, y: 70, z: 46 },
      { x: 0, y: 70, z: 42 },
      { x: 105, y: 70, z: 38 },
      { x: 0, y: -70, z: 16 }
    ];
    return layout[index % layout.length];
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
    if (node instanceof VisualNode && !this.originalTransforms.has(node.id)) {
      const offset = this.previewOffset(this.leafIndex++);
      this.originalTransforms.set(node.id, node.transform.clone());
      this.explodeOffsets.set(node.id, new Vector3(offset.x * 0.42, offset.y * 0.42, 40));
    }
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
    this.exploded = false;
    this.sectioned = false;
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
  }

  private unbindEvents(): void {
    this.host.removeEventListener("pointerdown", this.handlePointerDown);
    this.host.removeEventListener("pointermove", this.handlePointerMove);
    this.host.removeEventListener("pointerup", this.handlePointerUp);
    this.host.removeEventListener("pointerout", this.handlePointerOut);
    this.host.removeEventListener("wheel", this.handleWheel);
  }

  private readonly handlePointerDown = (event: PointerEvent): void => {
    event.preventDefault();
    this.application.activeView = this.view;
    this.dispatch("pointerDown", event);
  };

  private readonly handlePointerMove = (event: PointerEvent): void => {
    event.preventDefault();
    this.dispatch("pointerMove", event);
  };

  private readonly handlePointerUp = (event: PointerEvent): void => {
    event.preventDefault();
    this.dispatch("pointerUp", event);
  };

  private readonly handlePointerOut = (event: PointerEvent): void => {
    this.dispatch("pointerOut", event);
  };

  private readonly handleWheel = (event: WheelEvent): void => {
    event.preventDefault();
    this.dispatch("mouseWheel", event);
  };

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

  private applySectionPlane(): void {
    this.view.renderer.localClippingEnabled = this.sectioned;
    const plane = new ThreePlane(new Vector3(1, 0, 0), 0);
    this.visual.context.visualShapes.traverse((object) => {
      const material = (object as unknown as { material?: unknown }).material;
      if (!material) return;
      const materials = Array.isArray(material) ? material : [material];
      materials.forEach((item) => {
        (item as { clippingPlanes?: ThreePlane[] }).clippingPlanes = this.sectioned ? [plane] : [];
        (item as { clipShadows?: boolean }).clipShadows = this.sectioned;
        (item as { needsUpdate?: boolean }).needsUpdate = true;
      });
    });
    this.view.update();
  }

  private emitStateChanged(): void {
    this.options.onStateChanged?.({
      exploded: this.exploded,
      sectioned: this.sectioned,
      selectionMode: this.selectionMode
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
