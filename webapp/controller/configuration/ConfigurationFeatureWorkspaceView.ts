import Control from "sap/ui/core/Control";
import Icon from "sap/ui/core/Icon";
import JSONModel from "sap/ui/model/json/JSONModel";
import VBox from "sap/m/VBox";
import HBox from "sap/m/HBox";
import Button from "sap/m/Button";
import Label from "sap/m/Label";
import Input from "sap/m/Input";
import TextArea from "sap/m/TextArea";
import CheckBox from "sap/m/CheckBox";
import SearchField from "sap/m/SearchField";
import Toolbar from "sap/m/OverflowToolbar";
import ToolbarSpacer from "sap/m/ToolbarSpacer";
import ObjectIdentifier from "sap/m/ObjectIdentifier";
import IconTabBar from "sap/m/IconTabBar";
import IconTabFilter from "sap/m/IconTabFilter";
import MessageStrip from "sap/m/MessageStrip";
import ScrollContainer from "sap/m/ScrollContainer";
import TreeTable from "sap/ui/table/TreeTable";
import TreeColumn from "sap/ui/table/Column";
import Fixed from "sap/ui/table/rowmodes/Fixed";
import MenuButton from "sap/m/MenuButton";
import Menu from "sap/m/Menu";
import MenuItem from "sap/m/MenuItem";
import ObjectPageHeader from "sap/uxap/ObjectPageHeader";
import {
  contextReferences,
  dataTypes,
  dimensions,
  resolveDefinition
} from "../../model/configuration";
import type {
  FeatureDefinition,
  FeatureFamily,
  FeatureGroup
} from "../../model/configuration";
import { button, form, grow, select, status, title, tr, txt } from "../../util/configurationUi";
import type { FeatureWorkspaceOptions, Field, Selection, TreeNode, Values } from "./types";
import ConfigurationFeatureContentView from "./ConfigurationFeatureContentView";

export default class ConfigurationFeatureWorkspaceView {
  private readonly options: FeatureWorkspaceOptions;
  private readonly contentView: ConfigurationFeatureContentView;
  private tree?: TreeTable;
  private editor?: VBox;
  private inspector?: VBox;

  public constructor(options: FeatureWorkspaceOptions) {
    this.options = options;
    this.contentView = new ConfigurationFeatureContentView({
      store: options.store,
      contextVersion: options.context.version,
      canEdit: options.canEdit,
      commit: options.commit,
      onEditDomain: options.onEditDomain
    });
  }

  public build(): VBox {
    const addMenu = new Menu({
      items: [
        new MenuItem({
          text: tr("Add Group"),
          icon: "sap-icon://folder-blank",
          press: () => this.options.onEditGroup()
        }),
        new MenuItem({
          text: tr("Add Family"),
          icon: "sap-icon://question-mark",
          press: () => this.options.onEditFamily()
        }),
        new MenuItem({
          text: tr("Add Feature"),
          icon: "sap-icon://action-settings",
          press: () => this.options.onAddFeature()
        }),
        new MenuItem({
          text: tr("Reuse Feature"),
          icon: "sap-icon://chain-link",
          press: () => this.options.onReuseFeature()
        })
      ]
    });
    this.tree = new TreeTable({
      width: "100%",
      rowMode: new Fixed({ rowCount: 18, rowContentHeight: 36 }),
      selectionMode: "Single",
      selectionBehavior: "RowOnly",
      enableSelectAll: false,
      columns: [
        new TreeColumn({
          label: new Label({ text: tr("Group / Family / Feature") }),
          template: new HBox({
            alignItems: "Center",
            items: [
              new Icon({ src: "{icon}", size: ".875rem", color: "#5c7081" }).addStyleClass(
                "sapUiTinyMarginEnd"
              ),
              new ObjectIdentifier({ title: "{name}", text: "{type}" })
            ]
          }),
          width: "100%",
          showSortMenuEntry: true,
          showFilterMenuEntry: true
        })
      ],
      rowSelectionChange: (event) => {
        if (event.getParameter("userInteraction") === false) return;
        const row = event.getParameter("rowContext");
        if (!row) return;
        this.options.onSelection({
          id: row.getProperty("id") as string,
          kind: row.getProperty("kind") as Selection["kind"]
        });
        this.renderSelected();
      }
    });
    this.populateTree();
    const treePanel = new VBox({
      width: "21rem",
      height: "100%",
      fitContainer: true,
      items: [
        new Toolbar({
          content: [
            title("Feature Model"),
            new ToolbarSpacer(),
            button("", () => this.tree?.expandToLevel(3), "sap-icon://expand-all").setTooltip(
              "展开全部"
            ),
            button("", () => this.tree?.collapseAll(), "sap-icon://collapse-all").setTooltip(
              "折叠全部"
            )
          ]
        }),
        new SearchField({
          placeholder: tr("Search Feature Model"),
          value: this.options.treeSearch,
          liveChange: (event) => {
            this.options.onTreeSearchChanged(event.getParameter("newValue") ?? "");
            this.populateTree();
          }
        }),
        select(["All Dimensions", ...dimensions], this.options.dimensionFilter, (value) => {
          this.options.onDimensionChanged(value);
          this.populateTree();
        }),
        grow(this.tree),
        txt("Group › Family › Feature · 链接图标表示企业引用").addStyleClass("cmTreeLegend")
      ]
    }).addStyleClass("cmModelTree");
    this.editor = new VBox({ width: "100%" }).addStyleClass("cmEditorContent");
    this.inspector = new VBox({ width: "19rem", height: "100%", fitContainer: true }).addStyleClass(
      "cmInspector"
    );
    const workspace = new VBox({
      height: "100%",
      fitContainer: true,
      items: [
        new Toolbar({
          content: [
            new MenuButton({ text: tr("Add"), icon: "sap-icon://add", menu: addMenu }),
            button("删除", () => this.options.onDeleteNode(), "sap-icon://delete"),
            button("复制", () => this.options.onCopyNode(), "sap-icon://copy"),
            button("移动", () => this.options.onMoveNode(), "sap-icon://move"),
            new ToolbarSpacer(),
            button(
              "企业特征库",
              () => this.options.onOpenLibrary(),
              "sap-icon://collections-management"
            ),
            new Button({
              text: tr("Preview Configuration"),
              icon: "sap-icon://inspect",
              type: "Emphasized",
              press: () => this.options.onPreview()
            })
          ]
        }),
        grow(
          new HBox({
            height: "100%",
            fitContainer: true,
            items: [
              treePanel,
              grow(
                new ScrollContainer({
                  vertical: true,
                  horizontal: false,
                  height: "100%",
                  content: [this.editor]
                })
              ),
              this.inspector
            ]
          }).addStyleClass("cmModelColumns")
        )
      ]
    });
    if (!this.options.getSelection() || !this.nodeExists(this.options.getSelection())) {
      const first = this.options.store.families.find((family) =>
        this.options.store.groups.some(
          (group) => group.id === family.groupId && group.contextId === this.options.context.id
        )
      );
      const group = this.options.store.groups.find(
        (item) => item.contextId === this.options.context.id
      );
      this.options.onSelection(
        first
          ? { kind: "family", id: first.id }
          : group
            ? { kind: "group", id: group.id }
            : undefined
      );
    }
    this.renderSelected();
    const count =
      this.options.store.groups.length +
      this.options.store.families.length +
      this.options.store.references.length;
    for (let index = 0; index < count; index++) {
      if (this.tree?.getContextByIndex(index)?.getProperty("id") === this.options.getSelection()?.id) {
        this.tree.setSelectedIndex(index);
        break;
      }
    }
    return workspace;
  }

  private nodeExists(selection?: Selection): boolean {
    if (!selection) return false;
    return selection.kind === "group"
      ? this.options.store.groups.some(
          (group) => group.id === selection.id && group.contextId === this.options.context.id
        )
      : selection.kind === "family"
        ? this.options.store.families.some(
            (family) =>
              family.id === selection.id &&
              this.options.store.groups.some(
                (group) => group.id === family.groupId && group.contextId === this.options.context.id
              )
          )
        : contextReferences(this.options.store, this.options.context.id).some(
            (reference) => reference.id === selection.id
          );
  }

  private populateTree(): void {
    if (!this.tree) return;
    const nodes: TreeNode[] = this.options.store.groups
      .filter((group) => group.contextId === this.options.context.id)
      .sort((a, b) => a.sort - b.sort)
      .map((group) => ({
        ...group,
        kind: "group",
        icon: "sap-icon://folder-blank",
        type: `Group · ${group.dimension}`,
        source: "",
        children: this.options.store.families
          .filter((family) => family.groupId === group.id)
          .sort((a, b) => a.sort - b.sort)
          .map((family) => ({
            ...family,
            kind: "family",
            icon: "sap-icon://question-mark",
            type: `Family · ${family.dimension}${family.active ? "" : " · Inactive"}`,
            source: family.sourceType,
            children: this.options.store.references
              .filter((reference) => reference.familyId === family.id)
              .map((reference) => {
                const definition = resolveDefinition(this.options.store, reference);
                return {
                  id: reference.id,
                  kind: "feature",
                  name: definition.name,
                  icon:
                    definition.sourceType === "Enterprise Library"
                      ? "sap-icon://chain-link"
                      : "sap-icon://action-settings",
                  code: definition.code,
                  dimension: definition.dimension,
                  source: definition.sourceType,
                  type: `${definition.kind === "Choice" ? "Choice" : definition.dataType} · V${definition.version}${definition.active ? "" : " · Inactive"}`,
                  children: []
                };
              })
          }))
      }));
    const matches = (node: TreeNode): boolean =>
      `${node.name} ${node.code}`.toLowerCase().includes(this.options.treeSearch.toLowerCase()) &&
      (this.options.dimensionFilter === "All Dimensions" ||
        node.dimension === this.options.dimensionFilter);
    const filter = (rows: TreeNode[], inherited = false): TreeNode[] =>
      rows.flatMap((node) => {
        const match = inherited || matches(node);
        const children = filter(
          node.children,
          match && this.options.dimensionFilter === "All Dimensions"
        );
        return match || children.length ? [{ ...node, children }] : [];
      });
    const filtered = filter(nodes);
    const rows =
      this.options.profile.featureStructureMode === "Flat"
        ? filtered.flatMap((group) => group.children.flatMap((family) => family.children))
        : filtered;
    this.tree.setModel(new JSONModel({ rows }));
    this.tree.bindRows({ path: "/rows", parameters: { arrayNames: ["children"] } });
    this.tree.expandToLevel(3);
  }

  private selectedFamily(selection = this.options.getSelection()): FeatureFamily | undefined {
    if (selection?.kind === "family")
      return this.options.store.families.find((family) => family.id === selection.id);
    if (selection?.kind === "feature") {
      const reference = this.options.store.references.find((item) => item.id === selection.id);
      return this.options.store.families.find((family) => family.id === reference?.familyId);
    }
    return undefined;
  }

  private selectedGroup(selection = this.options.getSelection()): FeatureGroup | undefined {
    const id =
      selection?.kind === "group" ? selection.id : this.selectedFamily(selection)?.groupId;
    return this.options.store.groups.find((group) => group.id === id);
  }

  private renderSelected(): void {
    if (!this.editor || !this.inspector) return;
    this.editor.destroyItems();
    this.inspector.destroyItems();
    const selection = this.options.getSelection();
    if (!selection || !this.nodeExists(selection)) {
      this.editor.addItem(
        new MessageStrip({
          text: "创建 Group，再定义 Family 业务问题，最后添加本地特征或引用企业特征。",
          showIcon: true
        })
      );
      return;
    }
    const reference =
      selection.kind === "feature"
        ? this.options.store.references.find((item) => item.id === selection.id)
        : undefined;
    const definition = reference ? resolveDefinition(this.options.store, reference) : undefined;
    const family = this.selectedFamily(selection);
    const group = this.selectedGroup(selection);
    const record = (definition ?? (selection.kind === "family" ? family : group))!;
    this.editor.addItem(
      txt(
        `${this.options.context.name}  /  ${group?.name ?? ""}${family ? `  /  ${family.name}` : ""}`
      ).addStyleClass("cmBreadcrumb")
    );
    this.editor.addItem(
      new ObjectPageHeader({
        objectTitle: record.name,
        objectSubtitle: record.code,
        isObjectTitleAlwaysVisible: true,
        isObjectSubtitleAlwaysVisible: true
      })
    );
    this.editor.addItem(
      new HBox({
        wrap: "Wrap",
        items: [
          status(record.dimension),
          status(
            selection.kind === "group"
              ? "组织分组"
              : definition
                ? `${definition.kind} · ${definition.dataType}`
                : "配置问题 / Family"
          ),
          ...(definition
            ? [status(definition.sourceType), status(`V${definition.version}`)]
            : family
              ? [status(family.selectionMode), status(family.mandatory ? "Mandatory" : "Optional")]
              : [])
        ]
      }).addStyleClass("cmObjectTags")
    );
    const tabs = new IconTabBar({
      expandable: false,
      applyContentPadding: false,
      selectedKey: this.options.editorTab,
      select: (event) =>
        this.options.onEditorTabChanged(event.getParameter("key") ?? "general"),
      items: [
        new IconTabFilter({
          key: "general",
          text: tr("General"),
          content: [this.generalContent(selection, definition, family, group)]
        }),
        new IconTabFilter({
          key: "values",
          text: tr("Values"),
          content: [this.contentView.valuesContent(definition, family)]
        }),
        new IconTabFilter({
          key: "usage",
          text: tr("Usage"),
          content: [this.contentView.usageContent(definition)]
        }),
        new IconTabFilter({
          key: "version",
          text: tr("Version"),
          content: [this.contentView.versionContent(definition, reference)]
        }),
        new IconTabFilter({
          key: "rules",
          text: tr("Rules"),
          content: [
            new MessageStrip({
              text: tr("Rules are managed in the next configuration modeling stage."),
              type: "Information",
              showIcon: true
            }).addStyleClass("sapUiSmallMargin")
          ]
        })
      ]
    });
    this.editor.addItem(tabs);
    this.buildInspector(selection, record, definition, family, group);
  }

  private generalContent(
    selection: Selection,
    definition?: FeatureDefinition,
    family?: FeatureFamily,
    group?: FeatureGroup
  ): Control {
    const fields: [string, string | Control][] = [
      ["Description", (definition ?? (selection.kind === "family" ? family : group))!.description]
    ];
    if (selection.kind === "group")
      fields.push(
        ["Dimension", group!.dimension],
        ["Sort Order", String(group!.sort)],
        ["Purpose", "只负责组织业务问题，不参与配置取值"]
      );
    else if (definition)
      fields.push(
        ["Mode", definition.kind === "Choice" ? "A · Feature as Choice" : "B · Typed Characteristic"],
        ["Data Type", definition.dataType],
        ["Selection Type", definition.selectionType],
        ["Mandatory", definition.mandatory ? "Yes" : "No"],
        ["Source", definition.sourceType],
        ["Unit", definition.unit],
        ["Default", definition.defaultValue],
        ["Min / Max Selection", `${definition.minSelections} / ${definition.maxSelections}`],
        ["Active", definition.active ? "Yes" : "No"]
      );
    else if (family)
      fields.push(
        ["Display Name", family.displayName],
        ["Business Question", family.businessQuestion],
        ["Dimension", family.dimension],
        ["Selection Mode", family.selectionMode],
        ["Mandatory", family.mandatory ? "Yes" : "No"],
        ["Source", family.sourceType],
        ["Min / Max Selection", `${family.minSelections} / ${family.maxSelections}`],
        ["Sort Order", String(family.sort)],
        ["Active", family.active ? "Yes" : "No"]
      );
    return new VBox({
      items: [
        new Toolbar({
          content: [
            title(selection.kind === "family" ? "Business Question" : "Overview"),
            new ToolbarSpacer(),
            button("编辑完整属性", () =>
              selection.kind === "group"
                ? this.options.onEditGroup(group)
                : selection.kind === "family"
                  ? this.options.onEditFamily(family)
                  : this.options.onEditDefinition(definition!)
            )
          ]
        }),
        form(fields)
      ]
    });
  }

  private buildInspector(
    selection: Selection,
    record: FeatureGroup | FeatureFamily | FeatureDefinition,
    definition?: FeatureDefinition,
    family?: FeatureFamily,
    group?: FeatureGroup
  ): void {
    if (!this.inspector) return;
    const locked =
      this.options.context.status !== "Draft" || definition?.sourceType === "Enterprise Library";
    const fields: Field[] = [
      ...this.namedFields(record),
      { key: "dimension", label: "Dimension", value: record.dimension, options: dimensions }
    ];
    if (definition)
      fields.push(
        { key: "dataType", label: "Data Type", value: definition.dataType, options: dataTypes },
        {
          key: "selectionType",
          label: "Selection Type",
          value: definition.selectionType,
          options: [
            "Single Selection",
            "Multi Selection",
            "Boolean Selection",
            "Range Input",
            "Free Input"
          ]
        },
        { key: "unit", label: "Unit", value: definition.unit },
        { key: "mandatory", label: "Mandatory", value: definition.mandatory },
        { key: "defaultValue", label: "Default Value", value: definition.defaultValue },
        { key: "active", label: "Active", value: definition.active }
      );
    else if (selection.kind === "family" && family)
      fields.push(
        {
          key: "businessQuestion",
          label: "Business Question",
          value: family.businessQuestion,
          required: true,
          multiline: true
        },
        { key: "mandatory", label: "Mandatory", value: family.mandatory },
        { key: "active", label: "Active", value: family.active }
      );
    const draft: Values = {};
    const controls: Control[] = [];
    const inputs: { field: Field; input: Input | TextArea }[] = [];
    for (const field of fields) {
      draft[field.key] = field.value;
      controls.push(new Label({ text: field.label, required: field.required }));
      if (field.options)
        controls.push(
          select(field.options, String(field.value), (value) => {
            draft[field.key] = value;
          }).setEnabled(!locked)
        );
      else if (typeof field.value === "boolean")
        controls.push(
          new CheckBox({
            selected: field.value,
            enabled: !locked,
            select: (event) => {
              draft[field.key] = event.getParameter("selected") ?? false;
            }
          })
        );
      else {
        const input = field.multiline
          ? new TextArea({ value: String(field.value), width: "100%", rows: 3, editable: !locked })
          : new Input({ value: String(field.value), width: "100%", editable: !locked });
        input.attachEvent("liveChange", () => {
          draft[field.key] = input.getValue();
          input.setValueState(field.required && !String(draft[field.key]).trim() ? "Error" : "None");
        });
        controls.push(input);
        inputs.push({ field, input });
      }
    }
    for (let index = 0; index < controls.length; index += 2)
      (controls[index] as Label).setLabelFor(controls[index + 1]);
    this.inspector.addItem(
      new Toolbar({
        content: [title("Properties"), new ToolbarSpacer(), status(locked ? "Read Only" : "Editable")]
      })
    );
    const box = new VBox({ items: controls }).addStyleClass("cmInspectorForm");
    if (definition) {
      box.addItem(new Label({ text: tr("Data Type / Selection Type") }));
      box.addItem(txt(`${definition.dataType} / ${definition.selectionType}`));
    }
    if (locked)
      box.addItem(
        new MessageStrip({
          text:
            definition?.sourceType === "Enterprise Library"
              ? "公共定义在企业特征库维护。此处保留版本引用。"
              : "发布 / 停用的上下文为只读。",
          showIcon: true
        })
      );
    this.inspector.addItem(grow(new ScrollContainer({ height: "100%", vertical: true, content: [box] })));
    this.inspector.addItem(
      new Toolbar({
        content: [
          new Button({
            text: "保存属性",
            enabled: !locked,
            type: "Emphasized",
            press: () => {
              let valid = true;
              inputs.forEach(({ field, input }) => {
                draft[field.key] = input.getValue().trim();
                const invalid = !!field.required && !input.getValue().trim();
                input.setValueState(invalid ? "Error" : "None");
                if (invalid) valid = false;
              });
              if (!valid) return;
              if (definition) {
                const edited = { ...structuredClone(definition), ...draft } as FeatureDefinition;
                if (edited.dataType !== definition.dataType) {
                  edited.domain = { values: [] };
                  edited.defaultValue = "";
                }
                this.options.saveDefinition(edited);
              } else
                this.options.commit((next) =>
                  Object.assign(
                    selection.kind === "group"
                      ? next.groups.find((item) => item.id === group!.id)!
                      : next.families.find((item) => item.id === family!.id)!,
                    draft
                  )
                );
            }
          }),
          button("重置", () => this.renderSelected())
        ]
      })
    );
  }

  private namedFields(record: FeatureGroup | FeatureFamily | FeatureDefinition): Field[] {
    return [
      { key: "name", label: "Name / 名称", value: record.name, required: true },
      { key: "code", label: "Code / 编码", value: record.code, required: true },
      { key: "description", label: "Description / 描述", value: record.description, multiline: true }
    ];
  }
}