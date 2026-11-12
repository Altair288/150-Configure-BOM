# New Variant Baseline Window

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/prodfamily/ProdFamilyNewVariantBaselineWindow.html)  
> 获取日期：2026-11-12

<a id="wwID0E5FBU"></a>

<a id="wwID0EPGBU"></a>

To create a new variant baseline:

<a id="wwID0EIHBU"></a>

- Use the **New Variant Baseline** window that you can open by selecting the **New Variant Baseline** ![](../../../../../images/4f05850efa3c_Icon_NewVarBaseline.png) icon from the **Variant Baselines** table.

<a id="wwID0EYGBU-2"></a>

- Or,

<a id="wwID0E6IBU"></a>

- From the **Structure** tab of the Product Family, right-click a managed variant specification. This action is available in the **Structure** tab only for managed variant specifications that are not a part of any variant baseline.

<a id="wwID0E2JBU"></a>

The **New Variant Baseline** window has two steps, **Set Attributes** and **Select Variant Specifications**.

<a id="wwID0EBLBU"></a>

1. On the **Set Attributes** step, perform the following:

<a id="wwID0EKMBU"></a>

1. Select a type if multiple types of variant baselines are defined in your system.

<a id="wwID0EMNBU"></a>

1. Provide a name and description.

<a id="wwID0EOOBU"></a>

1. Specify whether the variant baseline is protected.

<a id="wwID0E6OBU"></a>

1. Setting the **Protected** field to **Yes** prevents any component parts from being deleted that are included in the variant baseline’s objects or the associated variant specification. To delete a part that is a baseline member of the variant baseline or the associated variant specification, it must be removed from the baseline objects, or the variant baseline must be deleted. The **Protected** field selection can be changed in the **Edit Variant Baseline** window.

<a id="wwID0EFQBU"></a>

1. Select a context folder location where the variant baseline object is saved. By default, it is saved in the root folder of the product family’s Product or Library context.

<a id="wwID0EIRBU"></a>

2. On the **Select Variant Specifications** step, perform the following:

<a id="wwID0ERSBU"></a>

1. In the **Select Variant Specifications** table, select the rows for the variant specifications you want to add. Optionally, select a revision. If no revision is selected, the latest revision is used. The **Select Variant Specifications** table displays variant specifications that occupy a descendent node from the location where you launched the **New Variant Baseline** window.

|  |  |
| --- | --- |
| **![\*](../../../../../images/6652ad397dd1_note_16x16.png)** | When you launch the **New Variant Baseline** window using the icon, the **Select Variant Specifications** is empty (not pre-populated with variant specifications). When you launch the **New Variant Baseline** window by right-clicking a managed variant specification from the **Structure** tab of the Product Family, the system automatically populates the variant specifications in the **Select Variant Specifications** table. |

<a id="wwID0EOVBU"></a>

1. Click **Finish**. A message confirms that the variant baseline creation was successful.
