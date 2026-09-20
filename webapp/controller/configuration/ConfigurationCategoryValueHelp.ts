import Control from "sap/ui/core/Control";
import JSONModel from "sap/ui/model/json/JSONModel";
import VBox from "sap/m/VBox";
import HBox from "sap/m/HBox";
import Button from "sap/m/Button";
import CheckBox from "sap/m/CheckBox";
import Dialog from "sap/m/Dialog";
import Label from "sap/m/Label";
import MessageToast from "sap/m/MessageToast";
import SearchField from "sap/m/SearchField";
import Toolbar from "sap/m/OverflowToolbar";
import ToolbarSpacer from "sap/m/ToolbarSpacer";
import Auto from "sap/ui/table/rowmodes/Auto";
import TreeTable from "sap/ui/table/TreeTable";
import TreeColumn from "sap/ui/table/Column";
import { button, grow, select, tr, txt } from "../../util/configurationUi";

type DialogHost = {
  addDependent(dependent: Control): void;
};

export default class ConfigurationCategoryValueHelp {
  private readonly getHost: () => DialogHost | undefined;

  public constructor(getHost: () => DialogHost | undefined) {
    this.getHost = getHost;
  }

  public open(setValue: (value: string) => void): void {
    const categories = [
      {
        code: "Transportation",
        name: "交通工具",
        description: "Transportation product families",
        children: [
          { code: "Automotive", name: "汽车", description: "Automotive product families" },
          { code: "Bicycle", name: "自行车", description: "Bicycle product families" },
          { code: "Aircraft", name: "飞机", description: "Aircraft product families" },
          { code: "High-speed Rail", name: "高铁", description: "High-speed rail product families" },
          { code: "Marine", name: "船舶", description: "Marine product families" }
        ]
      },
      {
        code: "Industrial Equipment",
        name: "工业设备",
        description: "Industrial equipment product families",
        children: [
          {
            code: "Industrial Equipment",
            name: "工业设备（通用）",
            description: "General industrial equipment product families"
          },
          { code: "HVAC", name: "暖通空调", description: "HVAC product families" },
          {
            code: "Automation",
            name: "自动化设备",
            description: "Industrial automation product families"
          },
          {
            code: "Energy Equipment",
            name: "能源设备",
            description: "Energy equipment product families"
          }
        ]
      },
      {
        code: "Electronics",
        name: "电子产品",
        description: "Electronics product families",
        children: [
          {
            code: "Consumer Electronics",
            name: "消费电子",
            description: "Consumer electronics product families"
          },
          {
            code: "Industrial Electronics",
            name: "工业电子",
            description: "Industrial electronics product families"
          }
        ]
      },
      {
        code: "Medical Equipment",
        name: "医疗设备",
        description: "Medical equipment product families",
        children: [
          {
            code: "Diagnostic Equipment",
            name: "诊断设备",
            description: "Diagnostic equipment product families"
          },
          {
            code: "Surgical Equipment",
            name: "手术设备",
            description: "Surgical equipment product families"
          }
        ]
      },
      {
        code: "Construction Equipment",
        name: "工程设备",
        description: "Construction equipment product families",
        children: [
          {
            code: "Earthmoving Equipment",
            name: "土方设备",
            description: "Earthmoving equipment product families"
          },
          {
            code: "Lifting Equipment",
            name: "起重设备",
            description: "Lifting equipment product families"
          }
        ]
      }
    ];
    let selected: string | undefined;
    let rootFilter = "All Categories";
    const tree = new TreeTable({
      width: "100%",
      selectionMode: "Single",
      selectionBehavior: "RowOnly",
      enableSelectAll: false,
      rowMode: new Auto({ minRowCount: 5, rowContentHeight: 34 }),
      columns: [
        new TreeColumn({
          label: new Label({ text: "Code" }),
          template: txt("{code}"),
          width: "20%",
          showSortMenuEntry: true,
          showFilterMenuEntry: true
        }),
        new TreeColumn({
          label: new Label({ text: "Category" }),
          template: txt("{name}"),
          width: "30%",
          showSortMenuEntry: true,
          showFilterMenuEntry: true
        }),
        new TreeColumn({
          label: new Label({ text: "Description" }),
          template: txt("{description}"),
          width: "50%",
          showSortMenuEntry: true,
          showFilterMenuEntry: true
        })
      ],
      rowSelectionChange: (event) => {
        const row = event.getParameter("rowContext");
        if (!row) return;
        selected = row.getProperty("level") === 0 ? undefined : (row.getProperty("code") as string);
      }
    });
    const fill = (search = ""): void => {
      const normalized = search.toLowerCase();
      const rows = categories.flatMap((category) => {
        if (rootFilter !== "All Categories" && category.code !== rootFilter) return [];
        const categoryMatch = `${category.code} ${category.name} ${category.description}`
          .toLowerCase()
          .includes(normalized);
        const children = category.children.filter(
          (child) =>
            categoryMatch ||
            `${child.code} ${child.name} ${child.description}`.toLowerCase().includes(normalized)
        );
        if (!categoryMatch && !children.length) return [];
        return [
          {
            kind: "category",
            level: 0,
            rootCode: category.code,
            code: category.code,
            name: category.name,
            description: category.description,
            children: children.map((child) => ({
              kind: "category",
              level: 1,
              rootCode: category.code,
              code: child.code,
              name: child.name,
              description: child.description,
              children: []
            }))
          }
        ];
      });
      tree.setModel(new JSONModel({ rows }));
      tree.bindRows({
        path: "/rows",
        parameters: { arrayNames: ["children"], numberOfExpandedLevels: 2 }
      });
      tree.expandToLevel(2);
    };
    fill();
    const filterPanel = new HBox({
      visible: false,
      alignItems: "Center",
      items: [
        new Label({ text: "分类范围" }).addStyleClass("sapUiTinyMarginBegin"),
        select(
          ["All Categories", ...categories.map((category) => category.code)],
          rootFilter,
          (value) => {
            rootFilter = value;
            fill();
          }
        )
      ]
    }).addStyleClass("cmValueHelpFilterBar");
    const search = new SearchField({
      width: "34rem",
      placeholder: tr("Search Category"),
      liveChange: (event) => fill(event.getParameter("newValue") ?? ""),
      search: (event) => fill(event.getParameter("query") ?? "")
    });
    const categoryToolbar = new Toolbar({
      content: [
        search,
        new Button({ text: "执行", type: "Emphasized", press: () => fill(search.getValue()) }),
        new ToolbarSpacer(),
        button("显示过滤器", () => filterPanel.setVisible(!filterPanel.getVisible())),
        button("", () => this.openColumnSettings(tree), "sap-icon://action-settings").setTooltip(
          "列设置"
        )
      ]
    });
    const categorySummary = new Toolbar({
      content: [
        txt("Category Library"),
        new ToolbarSpacer(),
        txt(`${categories.length} categories`)
      ]
    });
    const dialogBody = new VBox({
      height: "100%",
      fitContainer: true,
      items: [categoryToolbar, filterPanel, categorySummary, grow(tree)]
    }).addStyleClass("cmValueHelpBody");
    const dialog = new Dialog({
      title: tr("Category Library"),
      contentWidth: "54rem",
      contentHeight: "34rem",
      draggable: true,
      resizable: true,
      verticalScrolling: false,
      content: [dialogBody],
      beginButton: new Button({
        text: tr("Select"),
        type: "Emphasized",
        press: () => {
          if (!selected) {
            MessageToast.show(tr("Please select a category"));
            return;
          }
          setValue(selected);
          dialog.close();
        }
      }),
      endButton: button("取消", () => dialog.close()),
      afterClose: () => dialog.destroy()
    });
    this.getHost()?.addDependent(dialog);
    dialog.setDraggable(true).setResizable(true);
    dialog.addStyleClass("sapUiSizeCompact cmValueHelpDialog");
    dialog.open();
  }

  private openColumnSettings(tree: TreeTable): void {
    const labels = ["Code", "Category", "Description"];
    const checks = tree
      .getColumns()
      .map((column, index) => new CheckBox({ text: labels[index], selected: column.getVisible() }));
    const dialog = new Dialog({
      title: "列设置",
      contentWidth: "20rem",
      draggable: true,
      resizable: true,
      content: [new VBox({ items: checks }).addStyleClass("sapUiSmallMargin")],
      beginButton: new Button({
        text: tr("Select"),
        type: "Emphasized",
        press: () => {
          checks.forEach((check, index) => tree.getColumns()[index].setVisible(check.getSelected()));
          dialog.close();
        }
      }),
      endButton: button("取消", () => dialog.close()),
      afterClose: () => dialog.destroy()
    });
    this.getHost()?.addDependent(dialog);
    dialog.setDraggable(true).setResizable(true);
    dialog.addStyleClass("sapUiSizeCompact");
    dialog.open();
  }
}