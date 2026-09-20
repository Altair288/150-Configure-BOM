import BaseController from "./BaseController";
import Localization from "sap/base/i18n/Localization";
import Control from "sap/ui/core/Control";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import VBox from "sap/m/VBox";
import HBox from "sap/m/HBox";
import Button from "sap/m/Button";
import Title from "sap/m/Title";
import Label from "sap/m/Label";
import Input from "sap/m/Input";
import CheckBox from "sap/m/CheckBox";
import SearchField from "sap/m/SearchField";
import Toolbar from "sap/m/OverflowToolbar";
import ToolbarSpacer from "sap/m/ToolbarSpacer";
import IconTabBar from "sap/m/IconTabBar";
import IconTabFilter from "sap/m/IconTabFilter";
import MessageStrip from "sap/m/MessageStrip";
import MessageBox from "sap/m/MessageBox";
import MessageToast from "sap/m/MessageToast";
import Dialog from "sap/m/Dialog";
import Page from "sap/m/Page";
import List from "sap/m/List";
import StandardListItem from "sap/m/StandardListItem";
import Table from "sap/m/Table";
import Column from "sap/m/Column";
import ColumnListItem from "sap/m/ColumnListItem";
import FlexibleColumnLayout from "sap/f/FlexibleColumnLayout";
import FlexibleColumnLayoutData from "sap/f/FlexibleColumnLayoutData";
import FlexibleColumnLayoutDataForDesktop from "sap/f/FlexibleColumnLayoutDataForDesktop";
import DynamicPage from "sap/f/DynamicPage";
import DynamicPageTitle from "sap/f/DynamicPageTitle";
import DynamicPageHeader from "sap/f/DynamicPageHeader";
import ConfigurationContextListView from "./configuration/ConfigurationContextListView";
import ConfigurationCategoryValueHelp from "./configuration/ConfigurationCategoryValueHelp";
import ConfigurationDialogService from "./configuration/ConfigurationDialogService";
import ConfigurationFeatureLibraryView from "./configuration/ConfigurationFeatureLibraryView";
import ConfigurationFeatureWorkspaceView from "./configuration/ConfigurationFeatureWorkspaceView";
import ConfigurationPreviewDialog from "./configuration/ConfigurationPreviewDialog";
import ConfigurationScopeView from "./configuration/ConfigurationScopeView";
import type { Field, Selection, Values } from "./configuration/types";
import {
  button,
  form,
  grow,
  setI18nBundle,
  status,
  title,
  tr,
  txt
} from "../util/configurationUi";
import {
  createSeed,
  storageKey,
  uid,
  today,
  dataTypes,
  dimensions,
  validateStore,
  validateContext,
  validateDefinition,
  resolveDefinition,
  latestDefinitions,
  definitionUsage,
  contextReferences,
  copyContext,
  publishDefinition
} from "../model/configuration";
import type {
  ConfigurationStore,
  ConfigurationContext,
  ConfigurationProfile,
  FeatureGroup,
  FeatureFamily,
  FeatureDefinition,
  FeatureReference,
  ProductModel,
  ProductModelGroup,
  Named
} from "../model/configuration";

let activeI18nModel: ResourceModel | undefined;

export default class ConfigurationController extends BaseController {
  private store!: ConfigurationStore;
  private readonly dialogService = new ConfigurationDialogService(() => this.getView());
  private readonly categoryValueHelp = new ConfigurationCategoryValueHelp(() => this.getView());
  private readonly onLocalizationChangedBound = (): void => this.onLocalizationChanged();
  private contextId = "ctx-SUV";
  private mode: "context" | "features" = "context";
  private libraryMode = false;
  private selection?: Selection;
  private selectedProduct?: string;
  private selectedLibrary?: string;
  private readonly selectedContextIds = new Set<string>();
  private contextSearch = "";
  private category = "All Categories";
  private contextStatus = "All Statuses";
  private treeSearch = "";
  private dimensionFilter = "All Dimensions";
  private mainLayout?: FlexibleColumnLayout;
  private librarySearch = "";
  private editorTab = "general";
  private profileOpen = false;
  private profileFullscreen = false;
  private profileFullscreenButton?: Button;
  private mainFullscreen = false;
  private mainFullscreenButton?: Button;
  private scopeEditMode = false;
  private selectedProductGroup?: string;
  private selectedProductGroupName?: string;

  public onInit(): void {
    Localization.attachChange(this.onLocalizationChangedBound);
    activeI18nModel = this.getModel<ResourceModel>("i18n");
    const bundle = activeI18nModel?.getResourceBundle();
    if (bundle instanceof Promise)
      void bundle.then((loaded) => {
        setI18nBundle(loaded);
        this.render();
      });
    else
      setI18nBundle(
        bundle as { getText?: (resourceKey: string) => string | undefined } | undefined
      );
    this.store = createSeed();
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as ConfigurationStore;
        if (validateStore(parsed).length) throw new Error();
        this.store = parsed;
      } catch {
        MessageBox.warning(
          "本地建模数据无法读取，已打开示例工作区。原始数据未覆盖；可通过导入恢复有效备份。"
        );
      }
    }
    this.getRouter().getRoute("configuration")?.attachPatternMatched(this.openContext, this);
    this.getRouter().getRoute("featureLibrary")?.attachPatternMatched(this.openLibrary, this);
    // ResourceModel may finish its locale bundle just after the controller is created.
    window.setTimeout(() => this.onLocalizationChanged(), 300);
  }
  public onExit(): void {
    Localization.detachChange(this.onLocalizationChangedBound);
    this.getRouter().getRoute("configuration")?.detachPatternMatched(this.openContext, this);
    this.getRouter().getRoute("featureLibrary")?.detachPatternMatched(this.openLibrary, this);
  }
  private onLocalizationChanged(): void {
    const bundle = activeI18nModel?.getResourceBundle();
    if (bundle instanceof Promise)
      void bundle.then((loaded) => {
        setI18nBundle(loaded);
        this.render();
      });
    else {
      setI18nBundle(
        bundle as { getText?: (resourceKey: string) => string | undefined } | undefined
      );
      this.render();
    }
  }
  private openContext(): void {
    this.libraryMode = false;
    this.render();
  }
  private openLibrary(): void {
    this.libraryMode = true;
    this.render();
  }
  private currentContext(): ConfigurationContext {
    return this.store.contexts.find((c) => c.id === this.contextId) ?? this.store.contexts[0];
  }
  private currentProfile(): ConfigurationProfile {
    return this.store.profiles.find((p) => p.id === this.currentContext().profileId)!;
  }
  private canEdit(): boolean {
    if (this.currentContext().status === "Draft") return true;
    MessageToast.show("当前上下文为只读状态，请先创建新的草稿版本。", {
      duration: 3500
    });
    return false;
  }
  private commit(
    change: (next: ConfigurationStore) => void,
    message = "已保存到本地建模工作区"
  ): boolean {
    try {
      const next = structuredClone(this.store);
      change(next);
      const errors = validateStore(next);
      if (errors.length) {
        MessageBox.error(errors.slice(0, 12).join("\n"));
        return false;
      }
      const context = next.contexts.find((c) => c.id === this.contextId);
      if (context && !this.libraryMode) context.modified = today();
      localStorage.setItem(storageKey, JSON.stringify(next));
      this.store = next;
      this.render();
      MessageToast.show(message);
      return true;
    } catch (error) {
      MessageBox.error(
        `保存失败，修改尚未应用：${error instanceof Error ? error.message : String(error)}`
      );
      return false;
    }
  }
  private render(): void {
    this.contextId = this.currentContext().id;
    this.profileOpen = false;
    this.profileFullscreen = false;
    this.mainFullscreen = false;
    this.profileFullscreenButton = undefined;
    this.mainFullscreenButton = undefined;
    this.mainLayout = undefined;
    const root = this.byId("workspace") as VBox;
    root.destroyItems();
    root.addItem(
      new Toolbar({
        content: [
          title(
            this.libraryMode
              ? "企业特征库 · Enterprise Feature Library"
              : "产品配置管理 · Product Configuration Management"
          ),
          new ToolbarSpacer(),
          status("本地建模工作区"),
          button("导入", () => this.importWorkspace(), "sap-icon://upload"),
          button("导出", () => this.exportWorkspace(), "sap-icon://download")
        ]
      }).addStyleClass("cmTopbar")
    );
    if (this.libraryMode) {
      this.renderLibrary(root);
      return;
    }
    const begin = new Page({
      showHeader: false,
      enableScrolling: false,
      content: [this.buildContextList()]
    });
    const mid = new Page({
      showHeader: false,
      enableScrolling: false,
      content: [this.buildContextWorkspace()]
    });
    const layout = new FlexibleColumnLayout({
      layout: "TwoColumnsMidExpanded",
      beginColumnPages: [begin],
      midColumnPages: [mid],
      endColumnPages: []
    });
    this.mainLayout = layout;
    layout.setLayoutData(
      new FlexibleColumnLayoutData({
        desktopLayoutData: new FlexibleColumnLayoutDataForDesktop({
          twoColumnsMidExpanded: "23/77/0",
          threeColumnsMidExpanded: "23/57/20",
          threeColumnsEndExpanded: "23/57/20"
        })
      })
    );
    root.addItem(
      grow(
        new VBox({ height: "100%", fitContainer: true, items: [layout] }).addStyleClass(
          "cmLayoutHost"
        )
      )
    );
  }
  private buildContextList(): VBox {
    return new ConfigurationContextListView({
      store: this.store,
      contextSearch: this.contextSearch,
      category: this.category,
      contextStatus: this.contextStatus,
      selectedContextIds: this.selectedContextIds,
      onContextSearchChanged: (value) => {
        this.contextSearch = value;
      },
      onCategoryChanged: (value) => {
        this.category = value;
      },
      onStatusChanged: (value) => {
        this.contextStatus = value;
      },
      onOpenContext: (item) => (item ? this.openContextFromItem(item) : this.editContext(true)),
      commit: (change, message) => this.commit(change, message)
    }).build();
  }
  private openContextFromItem(item?: Control): void {
    const context = item?.getBindingContext();
    if (!context || context.getProperty("kind") !== "context") return;
    this.contextId = context.getProperty("id") as string;
    this.selection = undefined;
    this.selectedProduct = undefined;
    this.render();
  }
  private buildContextWorkspace(): Control {
    const c = this.currentContext();
    const heading = new VBox({
      items: [
        new Title({ text: c.name, level: "H2" }),
        txt(
          `${c.code} · ${this.store.productFamilies.find((f) => f.id === c.productFamilyId)?.name ?? ""} · V${String(c.version).padStart(2, "0")} · ${c.status}`
        )
      ]
    });
    const titleActions = [
      button("编辑", () => this.editContext(false), "sap-icon://edit"),
      button("复制", () => this.duplicateContext(), "sap-icon://copy"),
      button("版本", () => this.contextVersions(), "sap-icon://history"),
      button(
        c.status === "Draft" ? "发布" : c.status === "Inactive" ? "恢复草稿" : "新建版本",
        () => this.transitionContext()
      ),
      button("停用", () => this.deactivateContext())
    ];
    const header = new HBox({
      width: "100%",
      items: [
        grow(
          form([
            [
              "Product Family",
              this.store.productFamilies.find((f) => f.id === c.productFamilyId)?.name ?? ""
            ],
            ["Organization", c.organization],
            ["Created By", c.createdBy],
            ["Last Modified", c.modified],
            ["Description", c.description]
          ])
        )
      ]
    }).addStyleClass("cmDynamicHeaderContent cmContextMetadataOnly");
    const contentHost = new VBox({
      height: "100%",
      fitContainer: true,
      items: [grow(this.mode === "context" ? this.buildScope() : this.buildFeatureWorkspace())]
    }).addStyleClass("cmDynamicPageContentHost");
    const tabs = new IconTabBar({
      expandable: false,
      headerMode: "Inline",
      applyContentPadding: false,
      selectedKey: this.mode,
      items: [
        new IconTabFilter({
          key: "context",
          text: tr("产品范围 / Context")
        }),
        new IconTabFilter({
          key: "features",
          text: tr("特征模型 / Feature Model"),
          count: String(contextReferences(this.store, c.id).length)
        })
      ],
      select: (e) => {
        this.mode = e.getParameter("key") as "context" | "features";
        contentHost.destroyItems();
        contentHost.addItem(
          grow(this.mode === "context" ? this.buildScope() : this.buildFeatureWorkspace())
        );
      }
    }).addStyleClass("cmMainTabs");
    const contentSurface = new VBox({
      fitContainer: true,
      items: [grow(contentHost)]
    }).addStyleClass("cmContentSurface");
    const page = new DynamicPage({
      fitContent: false,
      headerExpanded: true,
      toggleHeaderOnTitleClick: this.mode !== "features",
      stickySubheaderProvider: tabs.getId(),
      title: new DynamicPageTitle({ heading, actions: titleActions }),
      header: new DynamicPageHeader({ pinnable: true, content: [header] }),
      content: new VBox({
        height: "100%",
        fitContainer: true,
        items: [tabs, contentSurface]
      }).addStyleClass("cmDynamicPageContent")
    }).addStyleClass("cmWorkspace cmContextDynamicPage sapUiNoContentPadding");
    return page;
  }
  private buildScope(): Control {
    return new ConfigurationScopeView({
      store: this.store,
      context: this.currentContext(),
      profile: this.currentProfile(),
      profileOpen: this.profileOpen,
      scopeEditMode: this.scopeEditMode,
      canEdit: () => this.canEdit(),
      onScopeEditModeChanged: (value) => {
        this.scopeEditMode = value;
      },
      onProductSelected: (id) => {
        this.selectedProduct = id;
      },
      onProductGroupSelected: (id, name) => {
        this.selectedProductGroup = id;
        this.selectedProductGroupName = name;
      },
      onEditProductFamily: () => this.editProductFamily(),
      onEditProductGroup: () => this.editProductGroup(),
      onEditProduct: () => this.editProduct(),
      onRemoveProduct: () => this.removeProduct(),
      onOpenProfile: () => this.openProfilePanel(),
      onToggleFullscreen: () => this.toggleMainFullscreen(),
      onMainFullscreenButtonCreated: (button) => {
        this.mainFullscreenButton = button;
      },
      commit: (change, message) => this.commit(change, message)
    }).build();
  }
  private openProfilePanel(): void {
    if (!this.mainLayout) return;
    this.profileOpen = true;
    this.mainFullscreen = false;
    this.profileFullscreen = false;
    this.mainFullscreenButton?.setVisible(false);
    this.mainFullscreenButton?.setIcon("sap-icon://full-screen");
    this.mainFullscreenButton?.setTooltip("全屏主体内容");
    this.profileFullscreenButton?.setIcon("sap-icon://full-screen");
    this.profileFullscreenButton?.setTooltip("全屏 Profile");
    if (!this.mainLayout.getEndColumnPages().length)
      this.mainLayout.addEndColumnPage(this.buildProfilePage());
    this.mainLayout.setLayout("ThreeColumnsMidExpanded");
  }
  private closeProfilePanel(): void {
    this.profileOpen = false;
    this.profileFullscreen = false;
    this.mainFullscreen = false;
    this.mainFullscreenButton?.setVisible(true);
    this.mainFullscreenButton?.setIcon("sap-icon://full-screen");
    this.mainFullscreenButton?.setTooltip("全屏主体内容");
    this.mainLayout?.setLayout("TwoColumnsMidExpanded");
  }
  private toggleMainFullscreen(): void {
    if (!this.mainLayout || this.profileOpen) return;
    this.mainFullscreen = !this.mainFullscreen;
    this.mainFullscreenButton?.setIcon(
      this.mainFullscreen ? "sap-icon://exit-full-screen" : "sap-icon://full-screen"
    );
    this.mainFullscreenButton?.setTooltip(
      this.mainFullscreen ? "退出主体内容全屏" : "全屏主体内容"
    );
    this.mainLayout.setLayout(
      this.mainFullscreen ? "MidColumnFullScreen" : "TwoColumnsMidExpanded"
    );
  }
  private toggleProfileFullscreen(): void {
    if (!this.mainLayout) return;
    this.profileFullscreen = !this.profileFullscreen;
    this.profileFullscreenButton?.setIcon(
      this.profileFullscreen ? "sap-icon://exit-full-screen" : "sap-icon://full-screen"
    );
    this.profileFullscreenButton?.setTooltip(
      this.profileFullscreen ? "退出 Profile 全屏" : "全屏 Profile"
    );
    this.mainLayout.setLayout(
      this.profileFullscreen ? "EndColumnFullScreen" : "ThreeColumnsMidExpanded"
    );
  }
  private buildProfilePage(): Page {
    const profile = this.currentProfile();
    const fullscreenButton = new Button({
      icon: "sap-icon://full-screen",
      tooltip: "全屏 Profile",
      type: "Transparent",
      press: () => this.toggleProfileFullscreen()
    });
    this.profileFullscreenButton = fullscreenButton;
    return new Page({
      showHeader: true,
      title: tr("Configuration Profile"),
      headerContent: [
        fullscreenButton,
        new Button({
          icon: "sap-icon://decline",
          tooltip: "关闭 Profile",
          type: "Transparent",
          press: () => this.closeProfilePanel()
        })
      ],
      enableScrolling: false,
      content: [
        new VBox({
          height: "100%",
          fitContainer: true,
          items: [
            grow(
              new VBox({
                items: [
                  form([
                    ["Profile Name", profile.name],
                    ["Profile Code", profile.code],
                    ["配置维度", profile.configurationMode],
                    ["特征来源", profile.featureSourceMode],
                    ["Feature Structure", profile.featureStructureMode],
                    ["Default Behavior", profile.defaultBehavior]
                  ])
                ]
              }).addStyleClass("cmProfileDetails")
            ),
            new Toolbar({
              content: [
                new Button({
                  text: "编辑 Profile",
                  type: "Emphasized",
                  press: () => this.editProfile()
                })
              ]
            })
          ]
        }).addStyleClass("cmProfileInspector")
      ]
    }).addStyleClass("cmProfilePage");
  }
  private editDialog(
    name: string,
    fields: Field[],
    save: (values: Values) => boolean,
    extra?: Control
  ): void {
    this.dialogService.openEditDialog(name, fields, save, extra);
  }
  private namedFields(record: Named): Field[] {
    return this.dialogService.namedFields(record);
  }
  private openCategoryValueHelp(setValue: (value: string) => void): void {
    this.categoryValueHelp.open(setValue);
  }
  private editContext(create: boolean): void {
    if (!create && !this.canEdit()) return;
    const c = create
      ? {
          ...this.currentContext(),
          id: uid("ctx"),
          name: "",
          code: "",
          description: "",
          status: "Draft" as const,
          version: 1,
          createdDate: today(),
          modified: today()
        }
      : this.currentContext();
    this.editDialog(
      create ? "新建配置上下文" : "编辑配置上下文",
      [
        ...this.namedFields(c),
        {
          key: "category",
          label: "Category",
          value: c.category,
          valueHelp: (setValue) => this.openCategoryValueHelp(setValue)
        },
        {
          key: "productFamilyName",
          label: "Product Family",
          value: create
            ? ""
            : this.store.productFamilies.find((f) => f.id === c.productFamilyId)!.name,
          required: true
        },
        { key: "owner", label: "Owner", value: c.owner, required: true },
        { key: "organization", label: "Organization", value: c.organization, required: true }
      ],
      (values) =>
        this.commit(
          (s) => {
            if (create) {
              const pfId = uid("pf"),
                profileId = uid("profile");
              s.productFamilies.push({
                id: pfId,
                code: `${values.code}-PF`,
                name: String(values.productFamilyName),
                description: ""
              });
              s.profiles.push({
                ...this.currentProfile(),
                id: profileId,
                code: `${values.code}-PROFILE`,
                name: `${values.name} Profile`
              });
              s.contexts.push({
                ...c,
                ...values,
                productFamilyId: pfId,
                profileId
              } as ConfigurationContext);
            } else {
              Object.assign(
                s.contexts.find((x) => x.id === c.id)!,
                values
              );
              s.productFamilies.find((f) => f.id === c.productFamilyId)!.name = String(
                values.productFamilyName
              );
            }
          },
          create ? "已创建配置上下文，可在列表中选择" : undefined
        )
    );
  }
  private duplicateContext(): void {
    this.editDialog(
      "复制 Context · 企业特征保留引用，本地特征独立复制",
      [
        {
          key: "name",
          label: "新名称",
          value: `${this.currentContext().name} Copy`,
          required: true
        },
        {
          key: "code",
          label: "新编码",
          value: `${this.currentContext().code}-COPY`,
          required: true
        }
      ],
      (v) =>
        this.commit((s) => {
          copyContext(s, this.currentContext().id, String(v.code), String(v.name));
        }, "上下文及其产品范围、Profile、特征模型已复制")
    );
  }
  private deactivateContext(): void {
    MessageBox.confirm(`停用 ${this.currentContext().name}？停用后保留数据并设为只读。`, {
      onClose: (action) => {
        if (action === MessageBox.Action.OK)
          this.commit((s) => {
            s.contexts.find((c) => c.id === this.currentContext().id)!.status = "Inactive";
          });
      }
    });
  }
  private transitionContext(): void {
    const draft = this.currentContext().status === "Draft";
    if (draft) {
      const errors = validateContext(this.store, this.currentContext().id);
      if (errors.length) {
        MessageBox.error(`词汇模型尚未完整：\n${errors.join("\n")}`);
        return;
      }
    }
    MessageBox.confirm(
      draft
        ? "发布当前词汇模型版本？发布后只读，可通过新建版本继续编辑。"
        : "从当前配置范围与词汇模型创建新的草稿版本？",
      {
        onClose: (action) => {
          if (action !== MessageBox.Action.OK) return;
          this.commit((s) => {
            const c = s.contexts.find((x) => x.id === this.currentContext().id)!;
            s.revisions.push({
              contextId: c.id,
              version: c.version,
              date: today(),
              action: draft ? "Released" : "New Draft",
              snapshot: JSON.stringify({
                context: c,
                profile: this.currentProfile(),
                products: s.products.filter((p) => p.familyId === c.productFamilyId),
                productGroups: (s.productGroups ?? []).filter(
                  (group) => group.familyId === c.productFamilyId
                ),
                groups: s.groups.filter((g) => g.contextId === c.id),
                families: s.families.filter((f) =>
                  s.groups.some((g) => g.contextId === c.id && g.id === f.groupId)
                ),
                references: contextReferences(s, c.id),
                definitions: contextReferences(s, c.id).map((r) => resolveDefinition(s, r))
              })
            });
            c.status = draft ? "Released" : "Draft";
            if (!draft) c.version++;
          });
        }
      }
    );
  }
  private contextVersions(): void {
    const rows = this.store.revisions
      .filter((r) => r.contextId === this.currentContext().id)
      .reverse();
    const dialog = new Dialog({
      title: `${this.currentContext().code} · 版本记录`,
      contentWidth: "42rem",
      content: [
        new MessageStrip({
          text: `当前 V${this.currentContext().version} · ${this.currentContext().status}。发布和新建草稿时保存版本快照。`,
          showIcon: true
        }),
        new List({
          noDataText: "尚无历史版本",
          items: rows.map(
            (r) =>
              new StandardListItem({
                title: `V${r.version} · ${r.action}`,
                description: r.date,
                type: "Active",
                press: () =>
                  this.download(`${this.currentContext().code}-v${r.version}.json`, r.snapshot)
              })
          )
        })
      ],
      endButton: button("关闭", () => dialog.close()),
      afterClose: () => dialog.destroy()
    });
    this.getView()?.addDependent(dialog);
    dialog.setDraggable(true).setResizable(true);
    dialog.open();
  }
  private editProductFamily(): void {
    if (!this.canEdit()) return;
    const pf = this.store.productFamilies.find(
      (f) => f.id === this.currentContext().productFamilyId
    )!;
    this.editDialog("编辑 Product Family", this.namedFields(pf), (v) =>
      this.commit((s) =>
        Object.assign(
          s.productFamilies.find((f) => f.id === pf.id)!,
          v
        )
      )
    );
  }
  private editProductGroup(id?: string): void {
    if (!this.canEdit()) return;
    const familyId = this.currentContext().productFamilyId;
    const groups = this.store.productGroups ?? [];
    const existing = groups.find((group) => group.id === id && group.familyId === familyId);
    const group: ProductModelGroup = existing ?? {
      id: uid("product-group"),
      familyId,
      code: "",
      name: "",
      description: "",
      sort: groups.filter((item) => item.familyId === familyId).length + 1
    };
    this.editDialog(existing ? "编辑产品模型组" : "添加产品模型组", this.namedFields(group), (v) =>
      this.commit((s) => {
        const familyGroups = (s.productGroups ??= []);
        if (
          familyGroups.some(
            (item) =>
              item.id !== group.id &&
              item.familyId === familyId &&
              item.code.toUpperCase() === String(v.code).toUpperCase()
          )
        )
          throw new Error("同一产品族中产品模型组编码不能重复");
        if (
          familyGroups.some(
            (item) =>
              item.id !== group.id && item.familyId === familyId && item.name === String(v.name)
          )
        )
          throw new Error("同一产品族中产品模型组名称不能重复");
        const target = familyGroups.find((item) => item.id === group.id);
        const previousName = target?.name ?? group.name;
        if (target) Object.assign(target, v);
        else familyGroups.push({ ...group, ...v } as ProductModelGroup);
        if (target && previousName !== String(v.name))
          s.products
            .filter((product) => product.familyId === familyId && product.group === previousName)
            .forEach((product) => {
              product.group = String(v.name);
            });
      })
    );
  }
  private editProduct(id?: string): void {
    if (!this.canEdit()) return;
    const product: ProductModel = this.store.products.find((p) => p.id === id) ?? {
      id: uid("product"),
      familyId: this.currentContext().productFamilyId,
      code: "",
      name: "",
      description: "",
      group: this.selectedProductGroupName ?? "Global",
      market: "Global",
      productType: "Product Model",
      status: "In Development"
    };
    const productGroupOptions = [
      ...new Set([
        ...(this.store.productGroups ?? [])
          .filter((group) => group.familyId === product.familyId)
          .sort((a, b) => a.sort - b.sort)
          .map((group) => group.name),
        ...this.store.products
          .filter((item) => item.familyId === product.familyId)
          .map((item) => item.group)
          .filter(Boolean),
        product.group
      ])
    ];
    this.editDialog(
      id ? "编辑产品型号" : "添加产品型号",
      [
        ...this.namedFields(product),
        {
          key: "group",
          label: "Product Model Group",
          value: product.group,
          options: productGroupOptions,
          required: true
        },
        {
          key: "productType",
          label: "Product Type",
          value: product.productType,
          options: ["Product", "Product Model"]
        },
        { key: "market", label: "Market", value: product.market, required: true },
        {
          key: "status",
          label: "Lifecycle Status",
          value: product.status,
          options: ["In Development", "Released", "Retired"]
        }
      ],
      (v) =>
        this.commit((s) => {
          if (
            s.products.some(
              (p) =>
                p.id !== product.id &&
                p.familyId === product.familyId &&
                p.code.toUpperCase() === String(v.code).toUpperCase()
            )
          )
            throw new Error("同一产品族中产品编码不能重复");
          const existing = s.products.find((p) => p.id === product.id);
          if (existing) Object.assign(existing, v);
          else s.products.push({ ...product, ...v } as ProductModel);
        })
    );
  }
  private removeProduct(): void {
    if (!this.canEdit()) return;
    if (!this.selectedProduct) {
      MessageToast.show("请先选择一个产品型号");
      return;
    }
    MessageBox.confirm("从产品族中移除所选产品？", {
      onClose: (a) => {
        if (a === MessageBox.Action.OK)
          this.commit((s) => {
            s.products = s.products.filter((p) => p.id !== this.selectedProduct);
          });
      }
    });
  }
  private editProfile(): void {
    if (!this.canEdit()) return;
    const p = this.currentProfile();
    this.editDialog(
      "Configuration Profile · 模型行为",
      [
        ...this.namedFields(p),
        {
          key: "configurationMode",
          label: "Configuration Mode",
          value: p.configurationMode,
          options: ["Engineering Configuration", "Sales Configuration", "Mixed Configuration"]
        },
        {
          key: "featureSourceMode",
          label: "Feature Source",
          value: p.featureSourceMode,
          options: ["Local Features", "Enterprise Feature Library", "Mixed"]
        },
        {
          key: "featureStructureMode",
          label: "Feature Structure Mode",
          value: p.featureStructureMode,
          options: ["Hierarchical", "Flat"]
        },
        {
          key: "defaultBehavior",
          label: "Default Selection Behavior",
          value: p.defaultBehavior,
          options: ["No Default", "Allow Default Value", "Auto Select Single Value"]
        },
        { key: "allowMulti", label: "Allow Multi Select", value: p.allowMulti },
        { key: "allowRange", label: "Allow Numeric Range", value: p.allowRange },
        { key: "allowText", label: "Allow Free Text", value: p.allowText }
      ],
      (v) =>
        this.commit((s) =>
          Object.assign(
            s.profiles.find((x) => x.id === p.id)!,
            v
          )
        )
    );
  }
  private buildFeatureWorkspace(): VBox {
    return new ConfigurationFeatureWorkspaceView({
      store: this.store,
      context: this.currentContext(),
      profile: this.currentProfile(),
      getSelection: () => this.selection,
      treeSearch: this.treeSearch,
      dimensionFilter: this.dimensionFilter,
      editorTab: this.editorTab,
      onTreeSearchChanged: (value) => {
        this.treeSearch = value;
      },
      onDimensionChanged: (value) => {
        this.dimensionFilter = value;
      },
      onEditorTabChanged: (value) => {
        this.editorTab = value;
      },
      onSelection: (selection) => {
        this.selection = selection;
        this.editorTab = "general";
      },
      onEditGroup: (group) => this.editGroup(group),
      onEditFamily: (family) => this.editFamily(family),
      onAddFeature: () => this.addFeature(),
      onReuseFeature: () => this.reuseFeature(),
      onDeleteNode: () => this.deleteNode(),
      onCopyNode: () => this.copyNode(),
      onMoveNode: () => this.moveNode(),
      onOpenLibrary: () => this.getRouter().navTo("featureLibrary"),
      onPreview: () => this.preview(),
      onEditDefinition: (definition) => this.editDefinition(definition),
      onEditDomain: (definition) => this.editDomain(definition),
      saveDefinition: (definition) => this.saveDefinition(definition),
      canEdit: () => this.canEdit(),
      commit: (change, message) => this.commit(change, message)
    }).build();
  }
  private selectedFamily(): FeatureFamily | undefined {
    if (this.selection?.kind === "family")
      return this.store.families.find((f) => f.id === this.selection!.id);
    if (this.selection?.kind === "feature") {
      const ref = this.store.references.find((r) => r.id === this.selection!.id);
      return this.store.families.find((f) => f.id === ref?.familyId);
    }
    return undefined;
  }
  private selectedGroup(): FeatureGroup | undefined {
    const id =
      this.selection?.kind === "group" ? this.selection.id : this.selectedFamily()?.groupId;
    return this.store.groups.find((g) => g.id === id);
  }
  private editGroup(existing?: FeatureGroup): void {
    if (!this.canEdit()) return;
    const record: FeatureGroup = existing ?? {
      id: uid("group"),
      contextId: this.currentContext().id,
      code: "",
      name: "",
      description: "",
      dimension: "Common",
      sort: this.store.groups.filter((g) => g.contextId === this.currentContext().id).length + 1
    };
    this.editDialog(
      existing ? "编辑 Feature Group" : "Add Group",
      [
        ...this.namedFields(record),
        { key: "dimension", label: "Dimension", value: record.dimension, options: dimensions },
        { key: "sort", label: "Sort Order", value: record.sort, numeric: true }
      ],
      (v) =>
        this.commit((s) => {
          if (existing)
            Object.assign(
              s.groups.find((g) => g.id === record.id)!,
              v
            );
          else s.groups.push({ ...record, ...v } as FeatureGroup);
        })
    );
  }
  private editFamily(existing?: FeatureFamily): void {
    if (!this.canEdit()) return;
    const group = existing
      ? this.store.groups.find((g) => g.id === existing.groupId)
      : this.selectedGroup();
    if (!group) {
      MessageToast.show("请先创建或选择一个 Group");
      return;
    }
    const record: FeatureFamily = existing ?? {
      id: uid("family"),
      groupId: group.id,
      code: "",
      name: "",
      description: "",
      displayName: "",
      businessQuestion: "",
      dimension: group.dimension,
      selectionMode: "Single",
      mandatory: true,
      sourceType: "Local",
      sort: this.store.families.filter((f) => f.groupId === group.id).length + 1,
      active: true,
      minSelections: 0,
      maxSelections: 1
    };
    this.editDialog(
      existing ? "编辑 Feature Family" : `Add Family · ${group.name}`,
      [
        ...this.namedFields(record),
        { key: "displayName", label: "Display Name", value: record.displayName },
        {
          key: "businessQuestion",
          label: "Business Question",
          value: record.businessQuestion,
          required: true,
          multiline: true
        },
        { key: "dimension", label: "Dimension", value: record.dimension, options: dimensions },
        {
          key: "selectionMode",
          label: "Selection Mode",
          value: record.selectionMode,
          options: ["Single", "Multiple", "Value Input"]
        },
        { key: "mandatory", label: "Mandatory", value: record.mandatory },
        {
          key: "sourceType",
          label: "Feature Source",
          value: record.sourceType,
          options: ["Local", "Enterprise Library"]
        },
        {
          key: "minSelections",
          label: "Min Selection Count",
          value: record.minSelections,
          numeric: true
        },
        {
          key: "maxSelections",
          label: "Max Selection Count",
          value: record.maxSelections,
          numeric: true
        },
        { key: "sort", label: "Sort Order", value: record.sort, numeric: true },
        { key: "active", label: "Active", value: record.active }
      ],
      (v) =>
        this.commit((s) => {
          if (v.selectionMode === "Multiple" && !this.currentProfile().allowMulti)
            throw new Error("当前 Profile 不允许多选");
          if (existing)
            Object.assign(
              s.families.find((f) => f.id === record.id)!,
              v
            );
          else s.families.push({ ...record, ...v } as FeatureFamily);
        })
    );
  }
  private addFeature(): void {
    if (!this.canEdit()) return;
    if (!this.selectedFamily()) {
      MessageToast.show("请先选择一个 Family");
      return;
    }
    const dialog = new Dialog({
      title: "Add Feature",
      contentWidth: "30rem",
      content: [
        new VBox({
          items: [
            txt("创建当前产品族独有的特征，或引用企业公共定义。"),
            new Button({
              text: tr("Create Local Feature"),
              icon: "sap-icon://add",
              width: "100%",
              press: () => {
                dialog.close();
                this.editDefinition();
              }
            }),
            new Button({
              text: tr("Reuse Existing Feature"),
              icon: "sap-icon://chain-link",
              width: "100%",
              press: () => {
                dialog.close();
                this.reuseFeature();
              }
            })
          ]
        }).addStyleClass("sapUiMediumMargin")
      ],
      endButton: button("取消", () => dialog.close()),
      afterClose: () => dialog.destroy()
    });
    this.getView()?.addDependent(dialog);
    dialog.setDraggable(true).setResizable(true);
    dialog.open();
  }
  private definitionFields(d: FeatureDefinition): Field[] {
    return [
      ...this.namedFields(d),
      { key: "kind", label: "Feature Mode", value: d.kind, options: ["Choice", "Characteristic"] },
      { key: "dimension", label: "Dimension", value: d.dimension, options: dimensions },
      { key: "dataType", label: "Data Type", value: d.dataType, options: dataTypes },
      {
        key: "selectionType",
        label: "Selection Type",
        value: d.selectionType,
        options: [
          "Single Selection",
          "Multi Selection",
          "Boolean Selection",
          "Range Input",
          "Free Input"
        ]
      },
      { key: "mandatory", label: "Mandatory", value: d.mandatory },
      { key: "defaultValue", label: "Default Value (Code / Literal)", value: d.defaultValue },
      { key: "unit", label: "Unit", value: d.unit },
      { key: "minSelections", label: "Min Selection Count", value: d.minSelections, numeric: true },
      { key: "maxSelections", label: "Max Selection Count", value: d.maxSelections, numeric: true },
      { key: "active", label: "Active", value: d.active }
    ];
  }
  private editDefinition(existing?: FeatureDefinition): void {
    if (!this.libraryMode && !this.canEdit()) return;
    if (existing?.sourceType === "Enterprise Library" && !this.libraryMode) {
      MessageBox.information(
        "这是企业特征的版本引用。请在企业特征库中编辑定义，再在 Version 中升级引用。"
      );
      return;
    }
    if (
      !existing &&
      !this.libraryMode &&
      this.currentProfile().featureSourceMode === "Enterprise Feature Library"
    ) {
      MessageBox.information("当前 Profile 仅允许引用企业特征。");
      return;
    }
    const d: FeatureDefinition = existing ?? {
      id: uid("def"),
      code: "",
      name: "",
      description: "",
      version: 1,
      sourceType: this.libraryMode ? "Enterprise Library" : "Local",
      dimension: "Engineering",
      kind: "Characteristic",
      dataType: "Enumeration",
      selectionType: "Single Selection",
      unit: "",
      mandatory: true,
      defaultValue: "",
      minSelections: 0,
      maxSelections: 1,
      active: true,
      domain: { values: [] },
      modified: today()
    };
    this.editDialog(
      existing
        ? `编辑 ${d.name} · 保存为新定义版本`
        : this.libraryMode
          ? "新建企业特征定义"
          : "Create Local Feature",
      this.definitionFields(d),
      (v) => {
        const updated = { ...structuredClone(d), ...v } as FeatureDefinition;
        if (updated.kind === "Choice") {
          updated.dataType = "Enumeration";
          updated.selectionType = "Single Selection";
          updated.domain = { values: [] };
        }
        if (existing && existing.dataType !== updated.dataType) {
          updated.domain = { values: [] };
          updated.defaultValue = "";
        }
        return this.saveDefinition(updated, !existing);
      }
    );
  }
  private saveDefinition(d: FeatureDefinition, create = false): boolean {
    const errors = validateDefinition(d);
    if (errors.length) {
      MessageBox.error(errors.join("\n"));
      return false;
    }
    if (!this.libraryMode) {
      if (d.dataType === "Multi Enumeration" && !this.currentProfile().allowMulti) {
        MessageBox.error("当前 Profile 不允许多选");
        return false;
      }
      if (d.dataType === "Range" && !this.currentProfile().allowRange) {
        MessageBox.error("当前 Profile 不允许范围输入");
        return false;
      }
      if (d.dataType === "String" && !this.currentProfile().allowText) {
        MessageBox.error("当前 Profile 不允许自由文本");
        return false;
      }
    }
    return this.commit(
      (s) => {
        const next = create ? { ...d, version: 1, modified: today() } : publishDefinition(s, d);
        if (create) s.definitions.push(next);
        if (!this.libraryMode) {
          if (create) {
            const family = this.selectedFamily();
            if (!family) throw new Error("请先选择 Family");
            s.references.push({
              id: uid("ref"),
              familyId: family.id,
              featureDefinitionId: next.id,
              definitionVersion: next.version
            });
          } else {
            const refs = contextReferences(s, this.currentContext().id).filter(
              (r) => r.featureDefinitionId === next.id
            );
            refs.forEach((r) => {
              r.definitionVersion = next.version;
            });
          }
        }
      },
      d.sourceType === "Enterprise Library"
        ? "企业定义已保存；现有 Context 引用版本保持不变"
        : "本地特征已保存"
    );
  }
  private editDomain(d: FeatureDefinition): void {
    if (!this.libraryMode && !this.canEdit()) return;
    if (d.sourceType === "Enterprise Library" && !this.libraryMode) {
      MessageBox.information("公共值域请在企业特征库修改。已有引用保留当前版本。");
      return;
    }
    if (d.kind === "Choice") {
      this.editDefinition(d);
      return;
    }
    const draft = structuredClone(d);
    if (["Enumeration", "Multi Enumeration", "Reference"].includes(d.dataType)) {
      let selected = -1;
      const table = new Table({
        mode: "SingleSelectLeft",
        fixedLayout: false,
        columns: ["Code *", "Display Value *", "Description", "Sequence", "Default", "Active"].map(
          (t) => new Column({ header: new Label({ text: t }) })
        ),
        selectionChange: (e) => {
          selected = table.indexOfItem(e.getParameter("listItem")!);
        }
      });
      const refresh = (): void => {
        table.destroyItems();
        selected = -1;
        draft.domain.values.forEach((v) => {
          const input = (key: "code" | "value" | "description"): Input =>
            new Input({
              value: v[key],
              liveChange: (e) => {
                v[key] = e.getParameter("value") ?? "";
              }
            });
          table.addItem(
            new ColumnListItem({
              cells: [
                input("code"),
                input("value"),
                input("description"),
                new Input({
                  value: String(v.sort),
                  type: "Number",
                  width: "5rem",
                  liveChange: (e) => {
                    v.sort = Number(e.getParameter("value"));
                  }
                }),
                new CheckBox({
                  selected: v.defaultValue,
                  select: (e) => {
                    v.defaultValue = e.getParameter("selected") ?? false;
                  }
                }),
                new CheckBox({
                  selected: v.active,
                  select: (e) => {
                    v.active = e.getParameter("selected") ?? false;
                  }
                })
              ]
            })
          );
        });
      };
      refresh();
      const targetInput = new Input({
        value: draft.domain.referenceTarget || "",
        liveChange: (e) => {
          draft.domain.referenceTarget = e.getParameter("value");
        }
      });
      const dialog = new Dialog({
        title: `${d.name} · Value Domain`,
        contentWidth: "65rem",
        draggable: true,
        resizable: true,
        content: [
          ...(d.dataType === "Reference" ? [form([["Reference Catalog", targetInput]])] : []),
          new Toolbar({
            content: [
              txt("允许值编码在当前定义内唯一；停用值不会出现在预览中。"),
              new ToolbarSpacer(),
              button(
                "添加值",
                () => {
                  draft.domain.values.push({
                    id: uid("value"),
                    code: "",
                    value: "",
                    description: "",
                    sort: draft.domain.values.length + 1,
                    defaultValue: false,
                    active: true
                  });
                  refresh();
                },
                "sap-icon://add"
              ),
              button(
                "移除",
                () => {
                  if (selected < 0) {
                    MessageToast.show("请先选择允许值");
                    return;
                  }
                  draft.domain.values.splice(selected, 1);
                  refresh();
                },
                "sap-icon://delete"
              )
            ]
          }),
          table
        ],
        beginButton: new Button({
          text: "保存值域",
          type: "Emphasized",
          press: () => {
            if (this.saveDefinition(draft)) dialog.close();
          }
        }),
        endButton: button("取消", () => dialog.close()),
        afterClose: () => dialog.destroy()
      });
      this.getView()?.addDependent(dialog);
      dialog.addStyleClass("sapUiSizeCompact");
      dialog.open();
      return;
    }
    const fields: Field[] = [];
    if (["Integer", "Decimal", "Range"].includes(d.dataType))
      fields.push(
        { key: "minimum", label: "Minimum", value: d.domain.minimum ?? "" },
        { key: "maximum", label: "Maximum", value: d.domain.maximum ?? "" },
        { key: "step", label: "Step", value: d.domain.step ?? "" },
        { key: "unit", label: "Unit", value: d.unit }
      );
    if (d.dataType === "String")
      fields.push(
        { key: "maxLength", label: "Max Length", value: d.domain.maxLength ?? "" },
        { key: "pattern", label: "Pattern (Optional)", value: d.domain.pattern ?? "" }
      );
    if (["Date", "DateTime"].includes(d.dataType))
      fields.push(
        {
          key: "minimumDate",
          label:
            d.dataType === "Date"
              ? "Minimum Date · YYYY-MM-DD"
              : "Minimum DateTime · YYYY-MM-DDTHH:mm",
          value: d.domain.minimumDate ?? ""
        },
        {
          key: "maximumDate",
          label:
            d.dataType === "Date"
              ? "Maximum Date · YYYY-MM-DD"
              : "Maximum DateTime · YYYY-MM-DDTHH:mm",
          value: d.domain.maximumDate ?? ""
        }
      );
    if (d.dataType === "Boolean") {
      MessageBox.information(
        "Boolean 固定提供 Yes / No。可在完整属性中设置必填和默认值（true / false）。"
      );
      return;
    }
    this.editDialog(`${d.name} · Value Domain`, fields, (v) => {
      for (const key of ["minimum", "maximum", "step", "maxLength"] as const)
        if (key in v) draft.domain[key] = String(v[key]).trim() === "" ? undefined : Number(v[key]);
      for (const key of ["pattern", "minimumDate", "maximumDate"] as const)
        if (key in v) draft.domain[key] = String(v[key]);
      if ("unit" in v) draft.unit = String(v.unit);
      return this.saveDefinition(draft);
    });
  }
  private reuseFeature(): void {
    if (!this.canEdit()) return;
    const family = this.selectedFamily();
    if (!family) {
      MessageToast.show("请先选择一个 Family");
      return;
    }
    if (this.currentProfile().featureSourceMode === "Local Features") {
      MessageBox.information("当前 Profile 仅允许本地特征。请先调整 Feature Source。");
      return;
    }
    let selected: string | undefined;
    const list = new List({
      mode: "SingleSelectLeft",
      includeItemInSelection: true,
      selectionChange: (e) => {
        selected = e.getParameter("listItem")?.data("id") as string;
      }
    });
    const populate = (search: string): void => {
      list.destroyItems();
      selected = undefined;
      latestDefinitions(this.store)
        .filter(
          (d) =>
            d.sourceType === "Enterprise Library" &&
            d.active &&
            `${d.name} ${d.code}`.toLowerCase().includes(search.toLowerCase())
        )
        .forEach((d) => {
          const exists = this.store.references.some(
            (r) => r.familyId === family.id && r.featureDefinitionId === d.id
          );
          const item = new StandardListItem({
            title: d.name,
            description: `${d.code} · ${d.dimension} · ${d.dataType} · V${d.version}`,
            info: exists
              ? "已引用"
              : `Used by ${definitionUsage(this.store, d.id).length} Contexts`,
            icon: "sap-icon://chain-link",
            type: exists ? "Inactive" : "Active"
          });
          item.data("id", d.id);
          list.addItem(item);
        });
    };
    populate("");
    const dialog = new Dialog({
      title: `Reuse Existing Feature · ${family.name}`,
      contentWidth: "49rem",
      contentHeight: "31rem",
      content: [
        new SearchField({
          placeholder: tr("Search Enterprise Feature Library"),
          liveChange: (e) => populate(e.getParameter("newValue") ?? "")
        }),
        list
      ],
      beginButton: new Button({
        text: tr("Add Reference"),
        type: "Emphasized",
        press: () => {
          if (!selected) {
            MessageToast.show("请选择企业特征");
            return;
          }
          const d = latestDefinitions(this.store).find((x) => x.id === selected)!;
          if (
            (d.dataType === "Multi Enumeration" && !this.currentProfile().allowMulti) ||
            (d.dataType === "Range" && !this.currentProfile().allowRange) ||
            (d.dataType === "String" && !this.currentProfile().allowText)
          ) {
            MessageBox.error("此特征的数据类型不符合当前 Profile 允许的输入行为");
            return;
          }
          if (
            this.commit((s) => {
              s.references.push({
                id: uid("ref"),
                familyId: family.id,
                featureDefinitionId: d.id,
                definitionVersion: d.version
              });
            }, "已添加版本化引用，未复制企业定义")
          )
            dialog.close();
        }
      }),
      endButton: button("取消", () => dialog.close()),
      afterClose: () => dialog.destroy()
    });
    this.getView()?.addDependent(dialog);
    dialog.setDraggable(true).setResizable(true);
    dialog.addStyleClass("sapUiSizeCompact");
    dialog.open();
  }
  private deleteNode(): void {
    if (!this.canEdit()) return;
    const node = this.selection;
    if (!node) {
      MessageToast.show("请先选择节点");
      return;
    }
    MessageBox.confirm(
      node.kind === "feature"
        ? "移除此特征引用？特征定义及历史版本会保留。"
        : "删除所选节点及其下属 Family 和特征引用？",
      {
        onClose: (a) => {
          if (a !== MessageBox.Action.OK) return;
          this.commit((s) => {
            if (node.kind === "feature")
              s.references = s.references.filter((r) => r.id !== node.id);
            else {
              const ids = new Set(
                s.families
                  .filter((f) => (node.kind === "group" ? f.groupId === node.id : f.id === node.id))
                  .map((f) => f.id)
              );
              s.references = s.references.filter((r) => !ids.has(r.familyId));
              s.families = s.families.filter((f) => !ids.has(f.id));
              if (node.kind === "group") s.groups = s.groups.filter((g) => g.id !== node.id);
            }
          });
        }
      }
    );
  }
  private copyNode(): void {
    if (!this.canEdit()) return;
    const node = this.selection;
    if (!node) return;
    const record =
      node.kind === "group"
        ? this.selectedGroup()!
        : node.kind === "family"
          ? this.selectedFamily()!
          : resolveDefinition(
              this.store,
              this.store.references.find((r) => r.id === node.id)!
            );
    this.editDialog(
      "复制节点 · 企业定义继续复用，本地定义独立复制",
      [
        { key: "name", label: "新名称", value: `${record.name} Copy`, required: true },
        { key: "code", label: "新编码", value: `${record.code}_COPY`, required: true }
      ],
      (v) =>
        this.commit((s) => {
          const copyRef = (r: FeatureReference, familyId: string, rename = false): void => {
            const d = resolveDefinition(s, r);
            let id = d.id,
              version = d.version;
            if (d.sourceType === "Local") {
              id = uid("def");
              version = 1;
              s.definitions.push({
                ...structuredClone(d),
                id,
                version,
                code: rename ? String(v.code) : `${v.code}_${d.code}`,
                name: rename ? String(v.name) : d.name
              });
            } else if (rename)
              throw new Error(
                "企业特征在同一个 Family 中只能引用一次。请使用移动，或在另一个 Family 中 Reuse Feature。"
              );
            s.references.push({
              id: uid("ref"),
              familyId,
              featureDefinitionId: id,
              definitionVersion: version
            });
          };
          if (node.kind === "feature") {
            const r = s.references.find((x) => x.id === node.id)!;
            copyRef(r, r.familyId, true);
          } else {
            let groupId = this.selectedGroup()!.id;
            if (node.kind === "group") {
              groupId = uid("group");
              s.groups.push({
                ...this.selectedGroup()!,
                id: groupId,
                name: String(v.name),
                code: String(v.code)
              });
            }
            const families = s.families.filter((f) =>
              node.kind === "group" ? f.groupId === node.id : f.id === node.id
            );
            families.forEach((f) => {
              const id = uid("family");
              s.families.push({
                ...f,
                id,
                groupId,
                ...(node.kind === "family" ? { name: String(v.name), code: String(v.code) } : {})
              });
              s.references.filter((r) => r.familyId === f.id).forEach((r) => copyRef(r, id));
            });
          }
        })
    );
  }
  private moveNode(): void {
    if (!this.canEdit()) return;
    const node = this.selection;
    if (!node) return;
    if (node.kind === "group") {
      this.editGroup(this.selectedGroup());
      return;
    }
    const targets =
      node.kind === "family"
        ? this.store.groups.filter((g) => g.contextId === this.currentContext().id)
        : this.store.families.filter((f) =>
            this.store.groups.some(
              (g) => g.id === f.groupId && g.contextId === this.currentContext().id
            )
          );
    const names = targets.map((t) => `${t.code} · ${t.name}`);
    this.editDialog(
      "移动节点 · 保留定义及版本引用",
      [
        {
          key: "target",
          label: node.kind === "family" ? "目标 Group" : "目标 Family",
          value: names[0] ?? "",
          options: names
        }
      ],
      (v) =>
        this.commit((s) => {
          const target = targets[names.indexOf(String(v.target))];
          if (!target) throw new Error("请选择目标");
          if (node.kind === "family") s.families.find((f) => f.id === node.id)!.groupId = target.id;
          else s.references.find((r) => r.id === node.id)!.familyId = target.id;
        })
    );
  }
  private renderLibrary(root: VBox): void {
    new ConfigurationFeatureLibraryView({
      store: this.store,
      selectedLibrary: this.selectedLibrary,
      librarySearch: this.librarySearch,
      contextVersion: this.currentContext().version,
      getHost: () => this.getView(),
      onSelectionChanged: (id) => {
        this.selectedLibrary = id;
      },
      onSearchChanged: (value) => {
        this.librarySearch = value;
      },
      onBack: () => this.getRouter().navTo("configuration"),
      onNewDefinition: () => this.editDefinition(),
      onEditDefinition: (definition) => this.editDefinition(definition),
      onEditDomain: (definition) => this.editDomain(definition),
      canEdit: () => this.canEdit(),
      commit: (change, message) => this.commit(change, message)
    }).render(root);
  }
  private preview(): void {
    new ConfigurationPreviewDialog({
      store: this.store,
      context: this.currentContext(),
      profile: this.currentProfile(),
      getHost: () => this.getView()
    }).open();
  }
  private download(name: string, text: string): void {
    const url = URL.createObjectURL(new Blob([text], { type: "application/json;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  private exportWorkspace(): void {
    this.download(`configuration-vocabulary-${today()}.json`, JSON.stringify(this.store, null, 2));
    MessageToast.show("已导出所有上下文、企业定义和版本引用");
  }
  private importWorkspace(): void {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,application/json";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      if (file.size > 10 * 1024 * 1024) {
        MessageBox.error("工作区文件不得超过 10 MB");
        return;
      }
      try {
        const next = JSON.parse(await file.text()) as ConfigurationStore;
        const errors = validateStore(next);
        if (!next.contexts.length) errors.push("工作区至少需要一个 Context");
        if (errors.length) {
          MessageBox.error(`导入校验失败：\n${errors.slice(0, 10).join("\n")}`);
          return;
        }
        MessageBox.confirm(
          `导入 ${next.contexts.length} 个 Context、${latestDefinitions(next).length} 个特征定义，将替换当前本地建模工作区。建议先导出备份。`,
          {
            onClose: (a) => {
              if (a !== MessageBox.Action.OK) return;
              this.commit((s) => Object.assign(s, next), "工作区导入成功");
            }
          }
        );
      } catch (error) {
        MessageBox.error(
          `无法读取工作区：${error instanceof Error ? error.message : String(error)}`
        );
      }
    };
    input.click();
  }
}
