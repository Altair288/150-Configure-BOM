import Control from "sap/ui/core/Control";
import JSONModel from "sap/ui/model/json/JSONModel";
import VBox from "sap/m/VBox";
import HBox from "sap/m/HBox";
import Toolbar from "sap/m/OverflowToolbar";
import ToolbarSpacer from "sap/m/ToolbarSpacer";
import SearchField from "sap/m/SearchField";
import Tree from "sap/m/Tree";
import StandardTreeItem from "sap/m/StandardTreeItem";
import DragDropInfo from "sap/ui/core/dnd/DragDropInfo";
import Event from "sap/ui/base/Event";
import type { ConfigurationStore } from "../../model/configuration";
import { button, grow, select, title, tr, txt } from "../../util/configurationUi";

type Commit = (change: (next: ConfigurationStore) => void, message?: string) => boolean;

export interface ConfigurationContextListOptions {
  store: ConfigurationStore;
  contextSearch: string;
  category: string;
  contextStatus: string;
  selectedContextIds: Set<string>;
  onContextSearchChanged: (value: string) => void;
  onCategoryChanged: (value: string) => void;
  onStatusChanged: (value: string) => void;
  onOpenContext: (item?: Control) => void;
  commit: Commit;
}

type ContextTreeRow = {
  kind: "category" | "context";
  id: string;
  name: string;
  code: string;
  nodeText: string;
  icon: string;
  statusText: string;
  statusState: string;
  children: ContextTreeRow[];
};

export default class ConfigurationContextListView {
  private readonly options: ConfigurationContextListOptions;
  private tree?: Tree;
  private syncingSelection = false;

  public constructor(options: ConfigurationContextListOptions) {
    this.options = options;
  }

  public build(): VBox {
    this.tree = new Tree({
      width: "100%",
      mode: "MultiSelect",
      includeItemInSelection: false,
      rememberSelections: true,
      selectionChange: (event) => this.onSelection(event),
      itemPress: (event) =>
        this.options.onOpenContext(event.getParameter("listItem") as Control | undefined),
      toggleOpenState: () => window.setTimeout(() => this.syncSelection(), 0)
    });
    this.tree.addDragDropConfig(
      new DragDropInfo({
        sourceAggregation: "items",
        targetAggregation: "items",
        dropPosition: "Between",
        drop: (event) => this.onDrop(event)
      })
    );
    this.populate();
    return new VBox({
      height: "100%",
      fitContainer: true,
      items: [
        new Toolbar({
          content: [
            title("Configuration Contexts"),
            new ToolbarSpacer(),
            button("新建", () => this.options.onOpenContext(), "sap-icon://add")
          ]
        }),
        new SearchField({
          value: this.options.contextSearch,
          placeholder: "搜索名称 / 编码 / 产品族",
          liveChange: (event) => {
            this.options.onContextSearchChanged(event.getParameter("newValue") ?? "");
            this.populate();
          }
        }).addStyleClass("sapUiTinyMargin"),
        new HBox({
          items: [
            grow(
              select(
                [
                  "All Categories",
                  "Automotive",
                  "Bicycle",
                  "Aircraft",
                  "High-speed Rail",
                  "Industrial Equipment",
                  "HVAC",
                  "Automation"
                ],
                this.options.category,
                (value) => {
                  this.options.onCategoryChanged(value);
                  this.populate();
                }
              )
            ),
            grow(
              select(["All Statuses", "Draft", "Released", "Inactive"], this.options.contextStatus, (value) => {
                this.options.onStatusChanged(value);
                this.populate();
              })
            )
          ]
        }).addStyleClass("cmFilterRow"),
        grow(this.tree),
        new Toolbar({
          content: [
            txt(`${this.options.store.contexts.length} 个上下文`),
            new ToolbarSpacer(),
            txt("Product Scope")
          ]
        })
      ]
    }).addStyleClass("cmContextList");
  }

  private populate(): void {
    const tree = this.tree;
    if (!tree) return;
    const { store, category, contextStatus, contextSearch } = this.options;
    const matches = store.contexts.filter(
      (context) =>
        (category === "All Categories" || context.category === category) &&
        (contextStatus === "All Statuses" || context.status === contextStatus) &&
        `${context.name} ${context.code}`.toLowerCase().includes(contextSearch.toLowerCase())
    );
    const rows: ContextTreeRow[] = [
      "Automotive",
      "Bicycle",
      "Aircraft",
      "High-speed Rail",
      "Industrial Equipment",
      "HVAC",
      "Automation"
    ].flatMap((categoryName) => {
      const contexts = matches.filter((context) => context.category === categoryName);
      if (!contexts.length) return [];
      return [
        {
          kind: "category" as const,
          id: `category-${categoryName}`,
          name: tr(categoryName),
          code: `${contexts.length}`,
          nodeText: `${tr(categoryName)} (${contexts.length})`,
          icon: "sap-icon://folder-blank",
          statusText: "",
          statusState: "None",
          children: contexts.map((context) => ({
            kind: "context" as const,
            id: context.id,
            name: context.name,
            code: `${context.code} · V${String(context.version).padStart(2, "0")}`,
            nodeText: `${context.name} · ${context.code} · V${String(context.version).padStart(2, "0")}`,
            icon: "sap-icon://product",
            statusText: tr(context.status),
            statusState:
              context.status === "Released"
                ? "Success"
                : context.status === "Draft"
                  ? "Information"
                  : "None",
            children: []
          }))
        }
      ];
    });
    tree.setModel(new JSONModel({ rows }));
    tree.bindItems({
      path: "/rows",
      parameters: { arrayNames: ["children"], numberOfExpandedLevels: 2 },
      template: new StandardTreeItem({
        title: "{nodeText}",
        icon: "{icon}",
        type: "Active",
        press: (event) => this.options.onOpenContext(event.getSource() as Control)
      }).addStyleClass("cmContextTreeItem")
    });
    window.setTimeout(() => this.syncSelection(), 0);
  }

  private syncSelection(): void {
    if (!this.tree || this.syncingSelection) return;
    this.syncingSelection = true;
    try {
      this.tree.getItems().forEach((item) => {
        const context = item.getBindingContext();
        if (!context) return;
        const kind = context.getProperty("kind") as string;
        if (kind === "context") {
          this.tree!.setSelectedItem(
            item,
            this.options.selectedContextIds.has(context.getProperty("id") as string),
            false
          );
        } else if (kind === "category") {
          const children = (context.getProperty("children") as { id: string }[] | undefined) ?? [];
          const allSelected =
            children.length > 0 &&
            children.every((child) => this.options.selectedContextIds.has(child.id));
          this.tree!.setSelectedItem(item, allSelected, false);
        }
      });
    } finally {
      this.syncingSelection = false;
    }
  }

  private onSelection(event: Event): void {
    if (this.syncingSelection || !this.tree) return;
    const parameters = event.getParameters() as { listItem?: Control; selected?: boolean };
    const item = parameters.listItem;
    if (!item) return;
    const context = item.getBindingContext();
    if (!context) return;
    const selected = Boolean(parameters.selected);
    if (context.getProperty("kind") === "category") {
      const childIds = (
        (context.getProperty("children") as { id: string }[] | undefined) ?? []
      ).map((child) => child.id);
      this.tree.getItems().forEach((child) => {
        const id = child.getBindingContext()?.getProperty("id") as string | undefined;
        if (!id || !childIds.includes(id)) return;
        if (selected) this.options.selectedContextIds.add(id);
        else this.options.selectedContextIds.delete(id);
      });
    } else {
      const id = context.getProperty("id") as string;
      if (selected) this.options.selectedContextIds.add(id);
      else this.options.selectedContextIds.delete(id);
    }
    this.syncSelection();
  }

  private onDrop(event: Event): void {
    const parameters = event.getParameters() as {
      dragSession?: { getDragControl: () => StandardTreeItem | null };
      droppedControl?: StandardTreeItem;
    };
    const source = parameters.dragSession
      ?.getDragControl()
      ?.getBindingContext()
      ?.getProperty("id") as string | undefined;
    const target = parameters.droppedControl?.getBindingContext()?.getProperty("id") as
      | string
      | undefined;
    if (!source || !target || source === target) return;
    const from = this.options.store.contexts.findIndex((context) => context.id === source);
    const to = this.options.store.contexts.findIndex((context) => context.id === target);
    if (from < 0 || to < 0) return;
    this.options.commit((next) => {
      const [moved] = next.contexts.splice(from, 1);
      next.contexts.splice(to, 0, moved);
    }, "Context 顺序已更新");
  }
}