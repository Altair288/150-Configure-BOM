# Variant Baselines Tab

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/prodfamily/ProdFamilyVariantBaselinesTab.html)  
> 获取日期：2026-11-12

<a id="wwID0EVWCU"></a>

<a id="wwID0EGXCU"></a>

The **Variant Baselines** tab lists the variant baselines that have been created in a Product Family, including those that are not displayed in the Product Family structure. This is useful for referencing a variant baseline that is no longer displayed in the Product Family structure, or if display of variant baselines in product families has been disabled. A variant baseline only displays in a Product Family structure if it is associated with a variant specification in the structure and if a preference has been set to allow variant baselines to be displayed in the Product Family structure. For more information, see [Product Family Management Preferences](../../13-product-famil-9fdce8c5/02-product-famil-d963a369/index.md#wwID0EOZOU "Product Family Management Preferences").

<a id="wwID0E1XCU"></a>

To manage a variant baseline, right-click it to display the actions menu. Some of the actions are common Windchill actions. For more information, see [Actions Common Among Objects](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/commonactions/CommonActionsRef.html).

<a id="wwID0EUYCU"></a>

The following actions are of particular interest when managing variant baselines.

| Action | Description |
| --- | --- |
| **Open in Product Family Matrix Editor** | For a single baseline, the Matrix Editor displays columns for planned product variants in the Single Variant Baseline view. It automatically filters down the configurable product structure to the impacted part. This action is available only when you select a single baseline from the table. If you select more than one baselines, you can use this action only from the toolbar. In this case, Matrix Editor displays the configurable product structure in the General view. However, the variant baselines must belong to the same Product Family. |
| **Update Variant Specifications** | Allows you to update a variant specification revision being used in the variant baseline. For more information, see [Update Variant Specifications Window](../07-variant-specifi-d0d0bd/02-update-varian-cf4f7334/index.md#wwID0EA3DU "Update Variant Specifications Window"). |
| **Add Baseline Objects** ![](../../../../../images/5669a06a74e1_IconLotBaselineAdd.png) | Allows you to add parts to the variant baseline that are required to develop a prototype. For more information, see [Adding Baseline Objects](../08-baseline-objects-table/01-adding-baseline-1ccb9f/index.md#wwID0E11EU "Adding Baseline Objects"). |
| **Edit Baseline Objects** ![](../../../../../images/76994d3648f4_IconLotBaselineEdit.png) | Allows you to update the status of the part as it progresses through the prototype development stages. For more information, see [Editing Baseline Objects](../08-baseline-objects-table/03-edit-baseline-o-9db595/index.md#wwID0ERZFU "Edit Baseline Objects Window"). |
