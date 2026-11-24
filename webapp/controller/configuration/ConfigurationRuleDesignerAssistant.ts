import BusyIndicator from "sap/m/BusyIndicator";
import Button from "sap/m/Button";
import FlexItemData from "sap/m/FlexItemData";
import HBox from "sap/m/HBox";
import ScrollContainer from "sap/m/ScrollContainer";
import Title from "sap/m/Title";
import Text from "sap/m/Text";
import TextArea from "sap/m/TextArea";
import VBox from "sap/m/VBox";
import Control from "sap/ui/core/Control";
import type { TextArea$LiveChangeEvent } from "sap/m/TextArea";
import type { FeatureDefinition } from "../../model/configuration";
import type { ConstraintRule } from "../../model/constraintRules";
import {
  MockConstraintAIService,
  type ConstraintAISuggestion,
  type ConstraintAIStage
} from "../../service/mockConstraintAIService";
import { tr, trFormat } from "../../util/configurationUi";

interface ConfigurationRuleDesignerAssistantOptions {
  features: () => FeatureDefinition[];
  rules: () => ConstraintRule[];
  canEdit: () => boolean;
  onApplySuggestion: (suggestion: ConstraintAISuggestion, prompt: string) => boolean;
}

type ChatMessageRole = "user" | "assistant";

const stageTexts: Record<ConstraintAIStage, string> = {
  ANALYZING_REQUEST: "cmDesignerAIStageAnalyze",
  IDENTIFYING_FEATURES: "cmDesignerAIStageFeatures",
  IDENTIFYING_VALUES: "cmDesignerAIStageValues",
  ANALYZING_RELATIONSHIPS: "cmDesignerAIStageRelationships",
  GENERATING_RULES: "cmDesignerAIStageGenerate",
  VALIDATING_RULES: "cmDesignerAIStageValidate"
};

export default class ConfigurationRuleDesignerAssistant {
  private readonly options: ConfigurationRuleDesignerAssistantOptions;
  private readonly service = new MockConstraintAIService(350);
  private readonly messagesHost = new VBox({ width: "100%" }).addStyleClass(
    "cmConstraintAIChatMessages"
  );
  private readonly messageScroll = new ScrollContainer({
    width: "100%",
    height: "100%",
    horizontal: false,
    vertical: true,
    content: [this.messagesHost]
  }).addStyleClass("cmConstraintAIChatScroll");
  private readonly composer: TextArea;
  private readonly sendButton: Button;
  private readonly toggleButton: Button;
  private readonly panel: VBox;
  private panelOpen = false;
  private available = true;
  private busy = false;
  private runId = 0;

  public constructor(options: ConfigurationRuleDesignerAssistantOptions) {
    this.options = options;
    this.messageScroll.setLayoutData(
      new FlexItemData({ growFactor: 1, shrinkFactor: 1, baseSize: "0%", minHeight: "0" })
    );
    this.sendButton = new Button({
      text: tr("cmDesignerAISend"),
      icon: "sap-icon://paper-plane",
      type: "Emphasized",
      enabled: false,
      press: () => void this.submitPrompt()
    }).addStyleClass("cmConstraintAIChatSend");
    this.composer = new TextArea({
      width: "100%",
      rows: 2,
      valueLiveUpdate: true,
      placeholder: tr("cmDesignerAIPlaceholder"),
      liveChange: (event: TextArea$LiveChangeEvent) => {
        this.sendButton.setEnabled(!this.busy && !!event.getParameter("value")?.trim());
      }
    }).addStyleClass("cmConstraintAIChatComposer");
    this.toggleButton = new Button({
      icon: "sap-icon://ai",
      type: "Transparent",
      tooltip: tr("cmDesignerAIBubbleTooltip"),
      press: () => this.togglePanel()
    }).addStyleClass("cmConstraintAIToggle");
    const closeButton = new Button({
      icon: "sap-icon://decline",
      type: "Transparent",
      tooltip: tr("cmDesignerAIChatClose"),
      press: () => this.togglePanel(false)
    }).addStyleClass("cmConstraintAIChatClose");
    const header = new HBox({
      width: "100%",
      alignItems: "Center",
      justifyContent: "SpaceBetween",
      items: [
        new Title({ text: tr("cmDesignerAIChatTitle"), level: "H4" }).addStyleClass(
          "cmConstraintAIChatTitle"
        ),
        closeButton
      ]
    }).addStyleClass("cmConstraintAIChatHeader");
    header.setLayoutData(new FlexItemData({ shrinkFactor: 0 }));
    const notice = new Text({
      text: tr("cmDesignerAIMockNotice"),
      wrapping: true
    }).addStyleClass("cmConstraintAIChatNotice");
    notice.setLayoutData(new FlexItemData({ shrinkFactor: 0 }));
    const input = new VBox({
      width: "100%",
      items: [
        this.composer,
        new HBox({
          width: "100%",
          justifyContent: "End",
          items: [this.sendButton]
        })
      ]
    }).addStyleClass("cmConstraintAIChatInput");
    input.setLayoutData(new FlexItemData({ shrinkFactor: 0 }));
    this.panel = new VBox({
      height: "100%",
      fitContainer: true,
      visible: false,
      items: [header, this.messageScroll, notice, input]
    }).addStyleClass("cmConstraintAIChatPanel");
    this.appendTextMessage("assistant", tr("cmDesignerAIGreeting"));
  }

  public getToggleButton(): Button {
    return this.toggleButton;
  }

  public getPanel(): VBox {
    return this.panel;
  }

  public setVisible(visible: boolean): void {
    this.available = visible;
    if (!visible) {
      this.panelOpen = false;
    }
    this.panel.setVisible(visible && this.panelOpen);
    this.toggleButton.setVisible(visible);
    this.toggleButton.setType(this.panelOpen ? "Emphasized" : "Transparent");
  }

  public dispose(): void {
    this.runId += 1;
    this.available = false;
    this.panelOpen = false;
    this.panel.setVisible(false);
    this.toggleButton.setVisible(false);
  }

  private togglePanel(open = !this.panelOpen): void {
    if (open && !this.available) return;
    this.panelOpen = open;
    this.panel.setVisible(this.available && open);
    this.toggleButton.setType(open ? "Emphasized" : "Transparent");
    if (open) {
      window.requestAnimationFrame(() => {
        this.composer.focus();
        this.scrollMessagesToBottom();
      });
    }
  }

  private async submitPrompt(): Promise<void> {
    const prompt = this.composer.getValue().trim();
    if (!prompt) {
      this.appendTextMessage("assistant", tr("cmDesignerAIEmptyPrompt"));
      return;
    }
    this.composer.setValue("");
    this.sendButton.setEnabled(false);
    this.appendTextMessage("user", prompt);
    await this.generate(prompt);
  }

  private async generate(prompt: string): Promise<void> {
    if (this.busy) return;
    const runId = ++this.runId;
    this.busy = true;
    this.composer.setEnabled(false);
    this.sendButton.setEnabled(false);
    const stageText = new Text({ text: tr(stageTexts.ANALYZING_REQUEST), wrapping: true });
    const progress = new HBox({
      alignItems: "Center",
      items: [new BusyIndicator({ size: "0.75rem" }), stageText]
    }).addStyleClass("cmConstraintAIChatProgress");
    this.appendMessage("assistant", progress);

    try {
      const response = await this.service.generate(
        {
          prompt,
          features: this.options.features(),
          rules: this.options.rules()
        },
        (stage) => {
          if (runId === this.runId) stageText.setText(tr(stageTexts[stage]));
        }
      );
      if (runId !== this.runId) return;
      stageText.setText(
        trFormat(
          "cmConstraintGeneratedCount",
          [response.suggestions.length],
          `已生成 ${response.suggestions.length} 条约束建议`
        )
      );
      response.suggestions.forEach((suggestion) => this.appendSuggestion(suggestion, prompt));
    } catch (error) {
      if (runId === this.runId)
        stageText.setText(
          trFormat(
            "cmDesignerAIRequestFailed",
            [error instanceof Error ? error.message : String(error)],
            error instanceof Error ? error.message : String(error)
          )
        );
    } finally {
      if (runId === this.runId) {
        this.busy = false;
        this.composer.setEnabled(true);
        this.sendButton.setEnabled(!!this.composer.getValue().trim());
      }
    }
  }

  private appendSuggestion(suggestion: ConstraintAISuggestion, prompt: string): void {
    const applyButton = new Button({
      text: tr("cmDesignerAIApplyToDesigner"),
      icon: "sap-icon://create",
      type: "Emphasized",
      press: () => {
        if (!this.options.canEdit()) return;
        if (!this.options.onApplySuggestion(suggestion, prompt)) return;
        applyButton.setEnabled(false);
        this.appendTextMessage(
          "assistant",
          trFormat(
            "cmDesignerAIStaged",
            [suggestion.rule.name],
            `已将“${suggestion.rule.name}”载入设计器草稿，请检查后手动保存。`
          )
        );
      }
    });
    this.appendMessage(
      "assistant",
      new VBox({
        width: "100%",
        items: [
          new Text({ text: suggestion.rule.name, wrapping: true }).addStyleClass(
            "cmConstraintAIChatSuggestionTitle"
          ),
          new Text({ text: suggestion.explanation, wrapping: true }),
          new Text({ text: suggestion.rule.expression, wrapping: true }).addStyleClass(
            "cmConstraintAIChatExpression"
          ),
          applyButton
        ]
      }).addStyleClass("cmConstraintAIChatSuggestion")
    );
  }

  private appendTextMessage(role: ChatMessageRole, text: string): void {
    this.appendMessage(role, new Text({ text, wrapping: true }));
  }

  private appendMessage(role: ChatMessageRole, content: Control): void {
    const message = new VBox({ width: "auto", items: [content] }).addStyleClass(
      `cmConstraintAIChatMessage cmConstraintAIChatMessage--${role}`
    );
    this.messagesHost.addItem(
      new HBox({
        width: "100%",
        justifyContent: role === "user" ? "End" : "Start",
        items: [message]
      }).addStyleClass("cmConstraintAIChatMessageRow")
    );
    window.requestAnimationFrame(() => this.scrollMessagesToBottom());
  }

  private scrollMessagesToBottom(): void {
    const content = this.messagesHost.getDomRef();
    if (content) this.messageScroll.scrollTo(0, content.scrollHeight, 0);
  }
}
