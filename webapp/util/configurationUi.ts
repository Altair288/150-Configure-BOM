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

export type ResourceBundle = { getText?: (resourceKey: string) => string | undefined };

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
  "Rules are managed in the next configuration modeling stage.": "cmRulesNext"
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
