import Button from "sap/m/Button";
import FlexItemData from "sap/m/FlexItemData";
import HBox from "sap/m/HBox";
import Input from "sap/m/Input";
import Label from "sap/m/Label";
import MessageStrip from "sap/m/MessageStrip";
import MessageToast from "sap/m/MessageToast";
import ObjectStatus from "sap/m/ObjectStatus";
import OverflowToolbar from "sap/m/OverflowToolbar";
import Select from "sap/m/Select";
import type { Select$ChangeEvent } from "sap/m/Select";
import Text from "sap/m/Text";
import Title from "sap/m/Title";
import ToolbarSpacer from "sap/m/ToolbarSpacer";
import Item from "sap/ui/core/Item";
import VBox from "sap/m/VBox";
import JSONModel from "sap/ui/model/json/JSONModel";
import { constraintMockRules } from "../../blueprint/constraint-mock-rules";

type NodeKind = "source" | "condition" | "logic" | "action";

let blueprintBundleLoading: Promise<void> | undefined;

function loadBlueprintBundle(): Promise<void> {
  if (window.ConfigurationBlueprint) return Promise.resolve();
  if (!blueprintBundleLoading) {
    blueprintBundleLoading = new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = new URL("vendor/constraint-blueprint.js", document.baseURI).toString();
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("约束蓝图编辑器加载失败"));
      document.head.appendChild(script);
    }).catch((error: unknown) => {
      blueprintBundleLoading = undefined;
      throw error;
    });
  }
  return blueprintBundleLoading;
}

interface BlueprintEditorHandle {
  addNode: (kind: NodeKind) => void;
  addScope: () => void;
  fit: () => void;
  setExample: (id: string) => void;
  validate: () => { nodes: number; connections: number };
  destroy: () => void;
}

export default class ConfigurationRuleWorkspaceView {
  private readonly graphHost: VBox;
  private readonly rulesModel = new JSONModel({
    examples: constraintMockRules,
    selectedRuleId: constraintMockRules[0].id,
    currentRule: constraintMockRules[0],
    ruleName: constraintMockRules[0].title
  });
  private editor?: BlueprintEditorHandle;
  private validationStatus?: ObjectStatus;

  public constructor(private readonly contextName: string) {
    this.graphHost = new VBox({
      width: "100%",
      height: "100%",
      fitContainer: true
    }).addStyleClass("cmBlueprintCanvasHost");
    this.graphHost.addEventDelegate({
      onAfterRendering: () => this.mountEditor(),
      onBeforeRendering: () => this.disposeEditor()
    });
  }

  public build(): VBox {
    const editorColumn = this.buildEditorColumn();
    editorColumn.setLayoutData(
      new FlexItemData({ growFactor: 1, shrinkFactor: 1, baseSize: "0%" })
    );

    const workspace = new VBox({
      width: "100%",
      height: "100%",
      fitContainer: true,
      items: [editorColumn]
    }).addStyleClass("cmRuleWorkspace");
    workspace.setModel(this.rulesModel, "rules");
    return workspace;
  }

  public disposeWorkspace(): void {
    this.disposeEditor();
  }

  private disposeEditor(): void {
    this.editor?.destroy();
    this.editor = undefined;
  }

  private buildPalette(): VBox {
    const palette = new VBox({
      width: "13rem",
      items: [
        new Title({ text: "节点库", level: "H5" }),
        new Text({ text: "拖动节点并连接端口，组合配置逻辑。" }).addStyleClass(
          "cmBlueprintPaletteIntro"
        ),
        new Label({ text: "画布" }).addStyleClass("cmBlueprintSectionLabel"),
        new Button({
          text: "范围组",
          icon: "sap-icon://group-2",
          width: "100%",
          type: "Transparent",
          press: () => this.editor?.addScope()
        }).addStyleClass("cmBlueprintPaletteButton cmBlueprintScopeButton"),
        new Label({ text: "配置项" }).addStyleClass("cmBlueprintSectionLabel"),
        this.paletteButton("特征值", "sap-icon://tag", "source"),
        new Label({ text: "逻辑" }).addStyleClass("cmBlueprintSectionLabel"),
        this.paletteButton("比较条件", "sap-icon://compare", "condition"),
        this.paletteButton("逻辑 AND", "sap-icon://combine", "logic"),
        new Label({ text: "约束" }).addStyleClass("cmBlueprintSectionLabel"),
        this.paletteButton("应用约束", "sap-icon://action", "action"),
        new MessageStrip({
          text: "连接输出端口与输入端口，即可表达配置项之间的依赖关系。",
          type: "Information",
          showIcon: true,
          showCloseButton: false
        }).addStyleClass("cmBlueprintPaletteNote")
      ]
    }).addStyleClass("cmBlueprintPalette");
    return palette;
  }

  private buildEditorColumn(): VBox {
    const palette = this.buildPalette();
    const inspector = this.buildInspector();
    const floatingPanels = new HBox({
      width: "100%",
      height: "100%",
      fitContainer: true,
      justifyContent: "SpaceBetween",
      alignItems: "Start",
      items: [palette, inspector]
    }).addStyleClass("cmBlueprintFloatingLayer");

    this.validationStatus = new ObjectStatus({ text: "蓝图结构就绪", state: "Success" });
    const workspaceToolbar = new OverflowToolbar({
      content: [
        new Title({
          text: "配置约束蓝图",
          level: "H4",
          tooltip: "将配置项连接成可读、可维护的规则"
        }).addStyleClass("cmBlueprintPageTitle"),
        new Text({ text: `${this.contextName} / 配置约束` }).addStyleClass(
          "cmBlueprintCanvasCrumb"
        ),
        new ToolbarSpacer(),
        new ObjectStatus({ text: "草稿", state: "Information" }),
        new Button({
          text: "校验蓝图",
          icon: "sap-icon://validate",
          press: () => this.validate()
        }),
        new Button({ text: "保存草稿", icon: "sap-icon://save", enabled: false }),
        this.validationStatus,
        new Button({
          text: "适配画布",
          icon: "sap-icon://resize",
          press: () => this.editor?.fit()
        })
      ]
    }).addStyleClass("cmBlueprintWorkspaceToolbar");

    const canvasFooter = new HBox({
      width: "100%",
      items: [
        new Text({ text: "滚轮缩放 · 拖动画布平移 · 拖动端口创建连接" }),
        new ToolbarSpacer(),
        new Text({ text: "Rete.js · 交互原型" })
      ]
    }).addStyleClass("cmBlueprintCanvasFooter");

    const canvasFrame = new VBox({
      width: "100%",
      height: "100%",
      fitContainer: true,
      items: [this.graphHost, floatingPanels]
    }).addStyleClass("cmBlueprintCanvasFrame");

    const column = new VBox({
      width: "100%",
      height: "100%",
      fitContainer: true,
      items: [workspaceToolbar, canvasFrame, canvasFooter]
    }).addStyleClass("cmBlueprintEditorColumn");
    return column;
  }

  private buildInspector(): VBox {
    const inspector = new VBox({
      width: "17rem",
      items: [
        new OverflowToolbar({
          content: [
            new Title({ text: "规则属性", level: "H5" }),
            new ToolbarSpacer(),
            new ObjectStatus({ text: "未发布", state: "Warning" })
          ]
        }).addStyleClass("cmBlueprintInspectorToolbar"),
        new VBox({
          items: [
            new Label({ text: "SUV 约束示例 · 15 类" }),
            new Select({
              width: "100%",
              selectedKey: "{rules>/selectedRuleId}",
              items: {
                path: "rules>/examples",
                template: new Item({ key: "{rules>id}", text: "{rules>title}" })
              },
              change: (event: Select$ChangeEvent) => this.onRuleExampleChange(event)
            }),
            new Label({ text: "关系类型" }),
            new Text({ text: "{rules>/currentRule/category}" }).addStyleClass(
              "cmBlueprintInspectorCategory"
            ),
            new Label({ text: "规则名称" }),
            new Input({ value: "{rules>/ruleName}" }),
            new Label({ text: "业务场景" }),
            new Text({ text: "{rules>/currentRule/summary}" }).addStyleClass(
              "cmBlueprintInspectorExpression"
            ),
            new Label({ text: "标准公式" }),
            new Text({ text: "{rules>/currentRule/formula}" }).addStyleClass(
              "cmBlueprintInspectorExpression"
            ),
            new Label({ text: "冲突处理" }),
            new Select({
              width: "100%",
              selectedKey: "error",
              items: [
                new Item({ key: "error", text: "阻止配置提交" }),
                new Item({ key: "warning", text: "提示并允许继续" })
              ]
            }),
            new Label({ text: "说明" }),
            new Text({ text: "示例仅用于交互原型，尚未连接保存或约束执行服务。" })
          ]
        }).addStyleClass("cmBlueprintInspectorForm"),
        new MessageStrip({
          text: "示例规则仅用于交互原型，当前尚未连接配置数据与持久化。",
          type: "Information",
          showIcon: true,
          showCloseButton: false
        }).addStyleClass("cmBlueprintInspectorNote")
      ]
    }).addStyleClass("cmBlueprintInspector");
    inspector.setLayoutData(new FlexItemData({ growFactor: 0, shrinkFactor: 0 }));
    return inspector;
  }

  private paletteButton(text: string, icon: string, kind: NodeKind): Button {
    return new Button({
      text,
      icon,
      width: "100%",
      type: "Transparent",
      press: () => this.editor?.addNode(kind)
    }).addStyleClass("cmBlueprintPaletteButton");
  }

  private onRuleExampleChange(event: Select$ChangeEvent): void {
    const rule = constraintMockRules.find(
      (example) => example.id === event.getSource().getSelectedKey()
    );
    if (!rule) return;
    this.rulesModel.setProperty("/selectedRuleId", rule.id);
    this.rulesModel.setProperty("/currentRule", rule);
    this.rulesModel.setProperty("/ruleName", rule.title);
    this.editor?.setExample(rule.id);
  }

  private async mountEditor(): Promise<void> {
    const domRef = this.graphHost.getDomRef();
    if (!domRef || this.editor) return;
    const host = domRef as HTMLElement;
    try {
      await loadBlueprintBundle();
      if (this.graphHost.getDomRef() !== domRef || this.editor || !window.ConfigurationBlueprint)
        return;
      this.editor = window.ConfigurationBlueprint.mount(
        host,
        this.rulesModel.getProperty("/selectedRuleId") as string
      );
    } catch (error) {
      MessageToast.show(error instanceof Error ? error.message : "约束蓝图编辑器加载失败");
    }
  }

  private validate(): void {
    if (!this.editor) return;
    const { nodes, connections } = this.editor.validate();
    const valid = nodes > 1 && connections > 0;
    this.validationStatus?.setText(valid ? `基础校验通过 · ${nodes} 个节点` : "尚无有效连接");
    this.validationStatus?.setState(valid ? "Success" : "Warning");
    MessageToast.show(
      valid ? `蓝图结构有效，共 ${connections} 条连接。` : "请先连接节点，再校验蓝图。"
    );
    this.editor.fit();
  }
}
