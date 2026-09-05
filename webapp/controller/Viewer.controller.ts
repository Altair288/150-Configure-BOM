import VBox from "sap/m/VBox";
import JSONModel from "sap/ui/model/json/JSONModel";

import type { BomNode } from "../model/types";
import type { ChiliPreviewHost } from "../types/chili-preview";
import BaseController from "./BaseController";

export default class ViewerController extends BaseController {
  private chiliPreview?: ChiliPreviewHost;

  public onAfterRendering(): void {
    if (this.chiliPreview) return;

    const host = (this.byId("viewerHost") as VBox).getDomRef() as HTMLElement | null;
    const PreviewConstructor = window.ChiliCadPreview;
    if (!host || !PreviewConstructor) return;

    this.chiliPreview = new PreviewConstructor(host, {
      onNodeSelected: (nodeId) => {
        this.getModel<JSONModel>("bom").setProperty("/selectedNodeId", nodeId);
      }
    });
    this.chiliPreview.loadBom(this.getModel<JSONModel>("bom").getProperty("/nodes") as BomNode[]);
  }

  public onExit(): void {
    this.chiliPreview?.destroy();
    this.chiliPreview = undefined;
  }
}
