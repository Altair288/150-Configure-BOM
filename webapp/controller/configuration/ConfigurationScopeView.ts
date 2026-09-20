import Control from "sap/ui/core/Control";
import JSONModel from "sap/ui/model/json/JSONModel";
import VBox from "sap/m/VBox";
import HBox from "sap/m/HBox";
import Button from "sap/m/Button";
import Input from "sap/m/Input";
import Select from "sap/m/Select";
import Label from "sap/m/Label";
import Text from "sap/m/Text";
import Item from "sap/ui/core/Item";
import Toolbar from "sap/m/OverflowToolbar";
import ToolbarSpacer from "sap/m/ToolbarSpacer";
import TreeTable from "sap/ui/table/TreeTable";
import TreeColumn from "sap/ui/table/Column";
import Auto from "sap/ui/table/rowmodes/Auto";
import type {
  ConfigurationContext,
  ConfigurationProfile,
  ConfigurationStore
} from "../../model/configuration";
import { button, grow, status, title, tr, txt } from "../../util/configurationUi";

type ScopeRow = {
  name: string;
  code: string;
  type: string;
  market: string;
  status: string;
  description?: string;
  editable?: boolean;
  id?: string;
  children?: ScopeRow[];
};

export interface ConfigurationScopeOptions {
  store: ConfigurationStore;
  context: ConfigurationContext;
  profile: ConfigurationProfile;
  profileOpen: boolean;
  scopeEditMode: boolean;
  canEdit: () => boolean;
  onScopeEditModeChanged: (value: boolean) => void;
  onProductSelected: (id: string | undefined) => void;
  onProductGroupSelected: (id: string | undefined, name: string | undefined) => void;
  onEditProductFamily: () => void;
  onEditProductGroup: () => void;
  onEditProduct: () => void;
  onRemoveProduct: () => void;
  onOpenProfile: () => void;
  onToggleFullscreen: () => void;
  onMainFullscreenButtonCreated: (button: Button) => void;
  commit: (change: (next: ConfigurationStore) => void, message?: string) => boolean;
}

export default class ConfigurationScopeView {
  private readonly options: ConfigurationScopeOptions;
  private scopeTree?: TreeTable;
  private scopeModel?: JSONModel;
  private scopeEditSnapshot?: ScopeRow[];
  private scopeEditMode: boolean;
  private scopeEditButton?: Button;
  private scopeSaveButton?: Button;
  private scopeCancelButton?: Button;

  public constructor(options: ConfigurationScopeOptions) {
    this.options = options;
    this.scopeEditMode = options.scopeEditMode;
  }

  public build(): Control {
    const products = this.options.store.products.filter(
      (product) => product.familyId === this.options.context.productFamilyId
    );
    const productFamily = this.options.store.productFamilies.find(
      (family) => family.id === this.options.context.productFamilyId
    )!;
    const rows: ScopeRow[] = [];
    const persistedGroups = (this.options.store.productGroups ?? []).filter(
      (group) => group.familyId === productFamily.id
    );
    const groupNames = [
      ...new Set([
        ...persistedGroups.map((group) => group.name),
        ...products.map((product) => product.group || "Ungrouped")
      ])
    ];
    for (const groupName of groupNames) {
      const groupDefinition = persistedGroups.find((group) => group.name === groupName);
      rows.push({
        id: groupDefinition?.id ?? `derived-group-${productFamily.id}-${groupName}`,
        name: groupName,
        code: groupDefinition?.code ?? "",
        type: "Product Model Group",
        market: "",
        status: "",
        editable: false,
        children: products
          .filter((product) => (product.group || "Ungrouped") === groupName)
          .map((product) => ({
            ...product,
            type: product.productType,
            editable: true,
            children: []
          }))
      });
    }
    const marketOptions = [
      ...new Set([
        "Global",
        "CN",
        "JP",
        ...products.map((product) => product.market).filter(Boolean)
      ])
    ];
    const lifecycleOptions = ["In Development", "Released", "Retired"];
    const scopeCell = (key: string, canEdit = true, options?: string[]): Control => {
      const items: Control[] = [
        grow(
          new Text({
            text: `{${key}}`,
            wrapping: false,
            visible: canEdit ? "{= !${/scopeEditMode} || !${editable}}" : "{= true}"
          })
        )
      ];
      if (canEdit) {
        items.push(
          options
            ? grow(
                new Select({
                  selectedKey: `{${key}}`,
                  visible: "{= ${/scopeEditMode} && ${editable}}",
                  width: "100%",
                  items: options.map((option) => new Item({ key: option, text: option }))
                })
              )
            : grow(
                new Input({
                  value: `{${key}}`,
                  visible: "{= ${/scopeEditMode} && ${editable}}",
                  width: "100%"
                })
              )
        );
      }
      return new HBox({ width: "100%", alignItems: "Center", items });
    };
    const tree = new TreeTable({
      width: "100%",
      rowMode: new Auto({ minRowCount: 5, rowContentHeight: 40 }),
      selectionMode: "Single",
      selectionBehavior: "RowOnly",
      enableSelectAll: false,
      columns: [
        new TreeColumn({
          label: new Label({ text: tr("产品族 / 产品型号") }),
          template: new HBox({
            alignItems: "Center",
            items: [
              grow(
                new Text({
                  text: "{name}",
                  wrapping: false,
                  visible: "{= !${/scopeEditMode} || !${editable}}"
                })
              ),
              grow(
                new Input({
                  value: "{name}",
                  visible: "{= ${/scopeEditMode} && ${editable}}"
                })
              )
            ]
          }),
          width: "28%",
          showSortMenuEntry: true,
          showFilterMenuEntry: true
        }),
        new TreeColumn({
          label: new Label({ text: "编码" }),
          template: scopeCell("code"),
          width: "14%",
          showSortMenuEntry: true,
          showFilterMenuEntry: true
        }),
        ...[
          ["type", "产品类型", "13%"],
          ["market", "市场", "12%"],
          ["status", "生命周期", "13%"],
          ["description", "描述", "20%"]
        ].map(
          ([key, label, width]) =>
            new TreeColumn({
              label: new Label({ text: label }),
              template:
                key === "type"
                  ? scopeCell(key, false)
                  : key === "market"
                    ? scopeCell(key, true, marketOptions)
                    : key === "status"
                      ? scopeCell(key, true, lifecycleOptions)
                      : scopeCell(key),
              width,
              showSortMenuEntry: true,
              showFilterMenuEntry: true
            })
        )
      ],
      rowSelectionChange: (event) => {
        const row = event.getParameter("rowContext")?.getObject() as
          { id?: string; name?: string; type?: string } | undefined;
        this.options.onProductSelected(row?.type === "Product Model" ? row.id : undefined);
        this.options.onProductGroupSelected(
          row?.type === "Product Model Group" &&
            this.options.store.productGroups?.some((group) => group.id === row.id)
            ? row.id
            : undefined,
          row?.type === "Product Model Group" ? row.name : undefined
        );
      }
    });
    const scopeModel = new JSONModel({
      scopeEditMode: this.scopeEditMode,
      rows: [
        {
          name: productFamily.name,
          code: productFamily.code,
          type: "Product Family",
          market: "",
          status: "",
          editable: false,
          children: rows
        }
      ]
    });
    tree.setModel(scopeModel);
    this.scopeModel = scopeModel;
    tree.bindRows({ path: "/rows", parameters: { arrayNames: ["children"] } });
    tree.expandToLevel(3);
    this.scopeTree = tree;
    const editButton = new Button({
      text: "编辑行",
      icon: "sap-icon://edit",
      visible: !this.scopeEditMode,
      press: () => this.toggleEdit()
    });
    const saveButton = new Button({
      text: "保存",
      icon: "sap-icon://save",
      type: "Emphasized",
      visible: this.scopeEditMode,
      press: () => this.saveEdits()
    });
    const cancelButton = new Button({
      text: "取消",
      visible: this.scopeEditMode,
      press: () => this.cancelEdits()
    });
    this.scopeEditButton = editButton;
    this.scopeSaveButton = saveButton;
    this.scopeCancelButton = cancelButton;
    const mainFullscreenButton = new Button({
      icon: "sap-icon://full-screen",
      tooltip: "全屏主体内容",
      type: "Transparent",
      visible: !this.options.profileOpen,
      press: () => this.options.onToggleFullscreen()
    });
    this.options.onMainFullscreenButtonCreated(mainFullscreenButton);
    const treeWorkArea = new VBox({
      height: "100%",
      fitContainer: true,
      items: [
        new Toolbar({
          content: [
            title(`产品族结构 (${products.length})`),
            new ToolbarSpacer(),
            button("编辑产品族", () => this.options.onEditProductFamily()),
            button(
              "添加产品组",
              () => this.options.onEditProductGroup(),
              "sap-icon://folder-blank"
            ),
            button("添加产品型号", () => this.options.onEditProduct(), "sap-icon://add"),
            editButton,
            saveButton,
            cancelButton,
            mainFullscreenButton,
            button("移除", () => this.options.onRemoveProduct(), "sap-icon://delete")
          ]
        }),
        grow(tree),
        new Toolbar({
          content: [
            title("Configuration Profile"),
            status(this.options.profile.configurationMode),
            txt(
              `${this.options.profile.featureSourceMode} · ${this.options.profile.featureStructureMode}`
            ),
            new ToolbarSpacer(),
            button("查看 Profile", () => this.options.onOpenProfile(), "sap-icon://inspect")
          ]
        })
      ]
    }).addStyleClass("cmScopeContent");
    return new HBox({
      height: "100%",
      fitContainer: true,
      items: [grow(treeWorkArea)]
    }).addStyleClass("cmScopeLayout");
  }

  private walkRows(visitor: (row: ScopeRow) => void): void {
    const data = this.scopeModel?.getData() as { rows?: ScopeRow[] } | undefined;
    const walk = (rows: ScopeRow[] | undefined): void => {
      rows?.forEach((row) => {
        visitor(row);
        walk(row.children);
      });
    };
    walk(data?.rows);
  }

  private toggleEdit(): void {
    if (!this.options.canEdit() || !this.scopeModel || !this.scopeTree) return;
    this.scopeEditSnapshot = structuredClone(this.scopeModel.getProperty("/rows") as ScopeRow[]);
    this.scopeEditMode = true;
    this.options.onScopeEditModeChanged(true);
    this.scopeModel.setProperty("/scopeEditMode", true);
    this.scopeEditButton?.setVisible(false);
    this.scopeSaveButton?.setVisible(true);
    this.scopeCancelButton?.setVisible(true);
  }

  private saveEdits(): void {
    const updates: ScopeRow[] = [];
    this.walkRows((row) => {
      if (row.id && row.type === "Product Model") updates.push(row);
    });
    this.scopeEditMode = false;
    this.options.onScopeEditModeChanged(false);
    this.scopeModel?.setProperty("/scopeEditMode", false);
    if (
      !this.options.commit(
        (next) =>
          updates.forEach((row) => {
            const product = next.products.find((item) => item.id === row.id);
            if (product)
              Object.assign(product, {
                name: row.name,
                code: row.code,
                market: row.market,
                status: row.status,
                description: row.description,
                productType: "Product Model"
              });
          }),
        "产品族结构已保存"
      )
    ) {
      this.scopeEditMode = true;
      this.options.onScopeEditModeChanged(true);
      this.scopeModel?.setProperty("/scopeEditMode", true);
      this.scopeEditButton?.setVisible(false);
      this.scopeSaveButton?.setVisible(true);
      this.scopeCancelButton?.setVisible(true);
    } else {
      this.scopeEditSnapshot = undefined;
    }
  }

  private cancelEdits(): void {
    if (this.scopeModel && this.scopeEditSnapshot)
      this.scopeModel.setProperty("/rows", structuredClone(this.scopeEditSnapshot));
    this.scopeEditSnapshot = undefined;
    this.scopeEditMode = false;
    this.options.onScopeEditModeChanged(false);
    this.scopeModel?.setProperty("/scopeEditMode", false);
    this.scopeEditButton?.setVisible(true);
    this.scopeSaveButton?.setVisible(false);
    this.scopeCancelButton?.setVisible(false);
  }
}
