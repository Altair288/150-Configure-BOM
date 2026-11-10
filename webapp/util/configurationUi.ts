import Control from "sap/ui/core/Control";
import Item from "sap/ui/core/Item";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import FlexItemData from "sap/m/FlexItemData";
import Button from "sap/m/Button";
import Title from "sap/m/Title";
import Text from "sap/m/Text";
import Label from "sap/m/Label";
import Select from "sap/m/Select";
import ObjectStatus from "sap/m/ObjectStatus";
import SimpleForm from "sap/ui/layout/form/SimpleForm";

export type ResourceBundle = {
  getText?: (resourceKey: string, args?: string[]) => string | undefined;
};

const rawI18nKeys: Record<string, string> = {
  "Configuration Contexts": "cmContexts",
  "Configuration Context": "cmConfigurationContext",
  "Feature Model": "cmFeatureModel",
  "Product Scope": "cmProductScope",
  "Configuration Profile": "cmConfigurationProfile",
  "产品配置管理 · Product Configuration Management": "cmProductConfigurationManagement",
  "Enterprise Feature Library · 企业特征库": "cmEnterpriseFeatureLibraryTitle",
  "Enterprise Feature Library": "cmEnterpriseFeatureLibrary",
  配置边界: "cmConfigurationBoundary",
  建模进度: "cmModelingProgress",
  产品族结构: "cmProductFamilyStructure",
  "产品族 / 产品型号": "cmProductFamilyProducts",
  产品类型: "cmProductType",
  市场: "cmMarket",
  生命周期: "cmLifecycle",
  描述: "cmDescription",
  Organization: "cmOrganization",
  "Created By": "cmCreatedBy",
  "Created Date": "cmCreatedDate",
  "Last Modified": "cmLastModified",
  "Profile Name": "cmProfileName",
  "Profile Code": "cmProfileCode",
  "Configuration Mode": "cmConfigurationMode",
  "Feature Source": "cmFeatureSource",
  "Feature Structure": "cmFeatureStructure",
  "Default Behavior": "cmDefaultBehavior",
  "Allow Multi Select": "cmAllowMulti",
  "Allow Numeric Range": "cmAllowRange",
  "Allow Free Text": "cmAllowText",
  "Group / Family / Feature": "cmGroupFamilyFeature",
  "Search Feature Model": "cmSearchFeatureModel",
  "All Dimensions": "cmAllDimensions",
  Properties: "cmProperties",
  Overview: "cmOverview",
  General: "cmGeneral",
  Values: "cmValues",
  Usage: "cmUsage",
  Version: "cmVersion",
  Rules: "cmRules",
  "Business Question": "cmBusinessQuestion",
  "Value Domain": "cmValueDomain",
  "Value Code": "cmValueCode",
  "Display Value": "cmDisplayValue",
  Sequence: "cmSequence",
  Default: "cmDefault",
  Active: "cmActive",
  Dimension: "cmDimension",
  "Data Type": "cmDataType",
  "Selection Type": "cmSelectionType",
  Mandatory: "cmMandatory",
  "Default Value": "cmDefaultValue",
  Unit: "cmUnit",
  Source: "cmSource",
  "Min / Max Selection": "cmMinMaxSelection",
  "Default Selected": "cmDefaultSelected",
  "Sort Order": "cmSortOrder",
  Add: "cmAdd",
  "Add Group": "cmAddGroup",
  "Add Family": "cmAddFamily",
  "Add Feature": "cmAddFeature",
  "Reuse Feature": "cmReuseFeature",
  删除: "cmDelete",
  复制: "cmCopy",
  移动: "cmMove",
  编辑: "cmEdit",
  新建: "cmNew",
  保存: "cmSave",
  取消: "cmCancel",
  重置: "cmReset",
  发布: "cmRelease",
  停用: "cmDeactivate",
  "Preview Configuration": "cmPreviewConfiguration",
  "Create Local Feature": "cmCreateLocalFeature",
  "Reuse Existing Feature": "cmReuseExistingFeature",
  "Add Reference": "cmAddReference",
  "Search Enterprise Feature Library": "cmSearchEnterpriseFeatureLibrary",
  Draft: "cmDraft",
  Released: "cmReleased",
  Inactive: "cmInactive",
  "Read Only": "cmReadOnly",
  Editable: "cmEditable",
  Marketing: "cmMarketing",
  Engineering: "cmEngineering",
  Common: "cmCommon",
  Local: "cmLocal",
  "Enterprise Library": "cmEnterpriseLibrary",
  Single: "cmSingle",
  Multiple: "cmMultiple",
  "Value Input": "cmValueInput",
  Choice: "cmChoice",
  Characteristic: "cmCharacteristic",
  Enumeration: "cmEnumeration",
  "Multi Enumeration": "cmMultiEnumeration",
  Boolean: "cmBoolean",
  String: "cmString",
  Integer: "cmInteger",
  Decimal: "cmDecimal",
  Date: "cmDate",
  DateTime: "cmDateTime",
  Range: "cmRange",
  Reference: "cmReference",
  "Single Selection": "cmSingleSelection",
  "Multi Selection": "cmMultiSelection",
  "Boolean Selection": "cmBooleanSelection",
  "Range Input": "cmRangeInput",
  "Free Input": "cmFreeInput",
  Yes: "cmYes",
  No: "cmNo",
  Automotive: "cmAutomotive",
  Bicycle: "cmBicycle",
  "Industrial Equipment": "cmIndustrialEquipment",
  "All Categories": "cmAllCategories",
  "All Statuses": "cmAllStatuses",
  Category: "cmCategory",
  "Value Help": "cmValueHelp",
  "Category Library": "cmCategoryLibrary",
  "Search Category": "cmSearchCategory",
  Select: "cmSelect",
  "Please select a category": "cmPleaseSelectCategory",
  Status: "cmStatus",
  "Product Configuration Context": "cmConfigurationContext",
  "Product Model Group": "cmProductModelGroup",
  "Product Model": "cmProductModel",
  "Product Family": "cmProductFamily",
  "In Development": "cmInDevelopment",
  "Mixed Configuration": "cmMixedConfiguration",
  Mixed: "cmMixed",
  Hierarchical: "cmHierarchical",
  "Allow Default Value": "cmAllowDefaultValue",
  Group: "cmGroup",
  Family: "cmFamily",
  Feature: "cmFeature",
  "Data Type / Selection Type": "cmDataTypeSelection",
  导入: "cmImport",
  导出: "cmExport",
  编辑产品族: "cmEditProductFamily",
  添加产品: "cmAddProduct",
  添加产品组: "cmAddProductGroup",
  添加产品型号: "cmAddProductModel",
  移除: "cmRemove",
  "产品范围 / Context": "cmContextTab",
  "特征模型 / Feature Model": "cmFeatureModelTab",
  "Rules are managed in the next configuration modeling stage.": "cmRulesNext",
  约束规则: "cmConstraintRules",
  新建约束: "cmConstraintCreateRule",
  暂无约束规则: "cmConstraintNoRules",
  表达式: "cmConstraintExpression",
  蓝图: "cmConstraintBlueprint",
  Blueprint: "cmConstraintBlueprint",
  "AI 助手": "cmConstraintAIAssistant",
  保存规则: "cmConstraintSaveRule",
  未保存变更: "cmConstraintUnsavedChanges",
  表达式语法无效: "cmConstraintInvalidExpression",
  "当前 Context 尚无可用于约束的 Feature。": "cmConstraintNoAvailableFeature",
  "请先修正表达式语法，再保存规则。": "cmConstraintFixExpressionBeforeSave",
  校验失败: "cmConstraintValidationFailed",
  "约束规则已保存到当前 Context。": "cmConstraintRuleSaved",
  "Configuration Engineering Assistant": "cmConstraintAssistantTitle",
  等待需求: "cmConstraintWaitingForRequest",
  生成约束: "cmConstraintGenerate",
  重新生成: "cmConstraintRegenerate",
  自然语言需求: "cmConstraintNaturalLanguageRequest",
  "Mock Assistant · 生成结果需经人工审核后才会写入当前规则集。": "cmConstraintMockNotice",
  请输入需求: "cmConstraintEnterRequest",
  "分析需求…": "cmConstraintStageAnalyze",
  "识别 Feature…": "cmConstraintStageFeatures",
  "识别 Value…": "cmConstraintStageValues",
  "分析逻辑关系…": "cmConstraintStageRelationships",
  "生成约束…": "cmConstraintStageGenerate",
  "验证约束…": "cmConstraintStageValidate",
  需要人工确认: "cmConstraintNeedsConfirmation",
  请选择引用对象: "cmConstraintChooseReference",
  确认选择并重新生成: "cmConstraintConfirmAndRegenerate",
  "请先选择一个引用对象。": "cmConstraintChooseReferenceFirst",
  "Exclusion · 排斥": "cmConstraintExclusion",
  "Requirement · 要求": "cmConstraintRequirement",
  待审核: "cmConstraintPendingReview",
  应用: "cmConstraintApply",
  应用选中: "cmConstraintApplySelected",
  编辑表达式: "cmConstraintEditExpression",
  在蓝图中编辑: "cmConstraintEditBlueprint",
  忽略: "cmConstraintIgnore",
  "AI 草稿 · 尚未应用": "cmConstraintAIDraftNotApplied",
  节点库: "cmConstraintNodeLibrary",
  "拖动节点并连接端口，组合配置逻辑。": "cmConstraintPaletteIntro",
  画布: "cmConstraintCanvas",
  范围组: "cmConstraintScopeGroup",
  配置项: "cmConstraintConfigurationItem",
  特征值: "cmConstraintFeatureValue",
  逻辑: "cmConstraintLogic",
  比较条件: "cmConstraintComparisonCondition",
  "逻辑 AND": "cmConstraintLogicAnd",
  约束: "cmConstraintConstraint",
  应用约束: "cmConstraintApplyConstraint",
  "连接输出端口与输入端口，即可表达配置项之间的依赖关系。": "cmConstraintConnectPortsHint",
  蓝图结构就绪: "cmConstraintBlueprintReady",
  配置约束蓝图: "cmConstraintBlueprintTitle",
  "将当前 Constraint AST 映射为可视节点关系": "cmConstraintBlueprintTooltip",
  校验蓝图: "cmConstraintValidateBlueprint",
  适配画布: "cmConstraintFitCanvas",
  "滚轮缩放 · 拖动画布平移 · 拖动端口创建连接": "cmConstraintCanvasHelp",
  规则属性: "cmConstraintRuleProperties",
  约束表达式: "cmConstraintRuleExpression",
  "选择条件节点以编辑 Feature、操作符和值域。": "cmConstraintSelectNodeHint",
  "蓝图节点选择和连线调整直接同步到当前 Constraint AST。": "cmConstraintBlueprintSyncHint",
  "选择特征/约束节点后，可在此编辑其条件。": "cmConstraintSelectPredicateHint",
  操作符: "cmConstraintOperator",
  Operator: "cmConstraintOperator",
  条件: "cmConstraintCondition",
  动作: "cmConstraintAction",
  结果: "cmConstraintResults",
  添加结果: "cmConstraintAddResult",
  删除结果: "cmConstraintRemoveResult",
  高级表达式: "cmConstraintAdvancedExpression",
  结构化编辑: "cmConstraintStructuredEditor",
  "复杂结果可在高级表达式模式中编辑。": "cmConstraintComplexActionHint",
  "Comma-separated values": "cmConstraintCommaSeparatedValues",
  Manual: "cmConstraintManualSource",
  "AI Generated": "cmConstraintAISource",
  允许值: "cmConstraintAllowedValue",
  已停用: "cmConstraintInactive",
  表达式待验证: "cmConstraintExpressionPending",
  约束关系: "cmConstraintRuleType",
  结构化条件: "cmConstraintStructuredConditions",
  "Feature Code 与 Value Code 均来自当前 Configuration Context。": "cmConstraintContextFeatureHint",
  "+ 条件": "cmConstraintAddCondition",
  "全部满足（AND）": "cmConstraintGroupAnd",
  "满足任一（OR）": "cmConstraintGroupOr",
  "不满足以下条件（NOT）": "cmConstraintGroupNot",
  在此组中添加条件: "cmConstraintAddToGroup",
  删除条件: "cmConstraintRemoveCondition",
  "示例场景：双向互斥": "cmConstraintPreviewDemoHint",
  "加载 B 型行李架示例": "cmConstraintPreviewDemo",
  "+ AND": "cmConstraintAddAnd",
  "+ OR": "cmConstraintAddOr",
  "+ NOT": "cmConstraintAddNot",
  NOT: "cmConstraintNot",
  要求: "cmConstraintRequires",
  排斥: "cmConstraintExcludes",
  设置: "cmConstraintSet",
  限制: "cmConstraintRestrict",
  推导: "cmConstraintDerive",
  撤销: "cmConstraintUndo",
  重做: "cmConstraintRedo",
  格式化: "cmConstraintFormat",
  验证: "cmConstraintValidate",
  "Requires / 要求": "cmConstraintRequiresOption",
  "Excludes / 排斥": "cmConstraintExcludesOption",
  "Implies / 蕴含": "cmConstraintImpliesOption",
  "Derive / 推导": "cmConstraintDeriveOption",
  等于: "cmConstraintEquals",
  不等于: "cmConstraintNotEquals",
  大于: "cmConstraintGreaterThan",
  大于等于: "cmConstraintGreaterThanOrEqual",
  小于: "cmConstraintLessThan",
  小于等于: "cmConstraintLessThanOrEqual",
  属于: "cmConstraintIn",
  不属于: "cmConstraintNotIn",
  包含: "cmConstraintContains",
  开头为: "cmConstraintStartsWith",
  结尾为: "cmConstraintEndsWith",
  当: "cmConstraintWhen",
  则: "cmConstraintThen",
  "当前 Context 没有活动 Feature": "cmConstraintNoActiveFeatures",
  "Expression Valid · 表达式有效": "cmConstraintExpressionValid",
  "AI 规则已应用到当前规则集。": "cmConstraintAIApplied",
  约束蓝图编辑器加载失败: "cmConstraintBlueprintLoadFailed"
};

let activeI18nBundle: ResourceBundle | undefined;

export function setI18nBundle(bundle: ResourceBundle | undefined): void {
  activeI18nBundle = bundle;
}

export function setI18nModel(model: ResourceModel): void {
  const bundle = model.getResourceBundle();
  if (bundle instanceof Promise) {
    void bundle.then((loaded) => setI18nBundle(loaded));
    return;
  }
  setI18nBundle(bundle as ResourceBundle | undefined);
}

export function tr(text: string): string {
  const key = rawI18nKeys[text];
  if (!key) return text;
  try {
    return activeI18nBundle?.getText?.(key) ?? text;
  } catch {
    return text;
  }
}

export function trFormat(key: string, args: Array<string | number>, fallback = key): string {
  try {
    return activeI18nBundle?.getText?.(key, args.map(String)) ?? fallback;
  } catch {
    return fallback;
  }
}

export const txt = (text: string): Text => new Text({ text: tr(text), wrapping: true });

export const button = (text: string, press: () => void, icon?: string): Button =>
  new Button({ text: tr(text), icon, press, type: "Transparent" });

export const title = (text: string): Title => new Title({ text: tr(text), level: "H3" });

export const grow = (control: Control): Control =>
  control.setLayoutData(new FlexItemData({ growFactor: 1, shrinkFactor: 1, baseSize: "0%" }));

export const select = (
  options: string[],
  value: string,
  change?: (value: string) => void
): Select =>
  new Select({
    width: "100%",
    selectedKey: value,
    items: options.map((option) => new Item({ key: option, text: tr(option) })),
    change: (event) => change?.(event.getSource().getSelectedKey())
  });

export const status = (text: string): ObjectStatus =>
  new ObjectStatus({
    text: tr(text),
    state: text === "Released" ? "Success" : text === "Draft" ? "Information" : "None"
  });

export const form = (pairs: [string, string | Control][]): SimpleForm =>
  new SimpleForm({
    editable: false,
    layout: "ResponsiveGridLayout",
    columnsL: 2,
    columnsM: 2,
    labelSpanL: 3,
    labelSpanM: 3,
    content: pairs.flatMap(([label, value]) => [
      new Label({ text: tr(label) }),
      typeof value === "string" ? txt(value || "—") : value
    ])
  });
