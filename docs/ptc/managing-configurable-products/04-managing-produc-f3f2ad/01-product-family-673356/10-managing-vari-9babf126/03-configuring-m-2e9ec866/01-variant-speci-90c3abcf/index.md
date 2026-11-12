# Variant Specification Structure Tab

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/prodfamily/OptionsVarSpecStructureTab.html)  
> 获取日期：2026-11-12

<a id="wwID0EHN6T"></a>

<a id="wwID0EYN6T"></a>

The **Structure** tab on a variant specification information page displays the associated configurable module. It also contains an Attributes, Visualization, and Modules tab.

<a id="wwID0ECO6T"></a>

For information about **Attributes** tab, see [Attributes Tab](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/prodstructure/PMAttributesTab.html#wwID0EMYDM "Attributes Tab").

<a id="wwID0E1O6T"></a>

## Modules Tab

<a id="wwID0E5O6T"></a>

The **Modules** tab allows you to choose whether selections for configurable modules and module variants are based assigned expression evaluation or based on manual selections that you make. By default, the child nodes of configurable modules and module variants are determined by assigned expression evaluation. However, in some instances you may have a reason to manually select which parts are included in the variant specification’s configurable module structure. For example, suppose you wished to make specific manual selections to parts within the structure to evaluate a design change proposal.

<a id="wwID0EHP6T"></a>

To modify the option filter definition, click **Edit Option Filter** from the **Structure** tab tool bar and modify the selections in the **Edit Option Filter** window. If you select **Based on manual selection** in the **Modules** tab, then the selection you make in the modules tab will override the selection made in the **Edit Option Filter** window. Later, if you decide to revert to the selection based on the assigned expression evaluation, then the choice you made in the **Edit Option Filter** window is used to determine the selected object. Use the **Manual Selection** column in the variant specification structure table to quickly ascertain which modules have been configured using manual selection. The manual selection icon ![](../../../../../../images/e121b42eadd6_IconManualSelectModule.png) displays in the column for those configurable modules whose child modules are manually selected.

<a id="wwID0EVQ6T"></a>

You can use a mix of assigned expression evaluation or manual selection throughout configurable structure. For example, suppose that you want module variants in the configurable module to be selected through assigned expression evaluation. Then, for a specific module variant you use manual selection to choose a specific part that matches your requirements for the variant specification.

<a id="wwID0EZQ6T"></a>

When you use the Copy/Paste or Save As actions on an existing managed variant specification, then the option filter and manual selections from the original object are also copied to the new variant specification when it is created.

<a id="wwID0ECR6T"></a>

## Variant Specification Tool Bar Actions

<a id="wwID0EGR6T"></a>

For information about the tool bar actions, see:

<a id="wwID0E6R6T"></a>

- [Viewing](../../../08-creating-prod-12d7a84f/01-product-family-e9a2ce/index.md#wwID0E3WZT "Product Family Structure Tab")

<a id="wwID0EJT6T"></a>

- [New Configuration Context](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/WorkingWithCADandPartStructures/DICCreateConfigContext.html)

<a id="wwID0ETU6T"></a>

- Filter: [Filter Action Sets — Parts](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/prodstructure/PMActionSetFilter.html#wwID0EBZAO "Filter Action Set - Parts"), and [Matrix Editor Tool Bar](../../../12-product-family-84175e/02-matrix-editor-tool-bar/index.md#wwID0E25GU "Matrix Editor Tool Bar").

<a id="wwID0EMW6T"></a>

- [Edit Option Filter](../../05-filtering-opt-d8d3f1c7/index.md#wwID0ERCAU "Filtering Options for a Managed Variant Specification")
