# Update Baseline Objects Window

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/prodfamily/ProdFamilyUpdateBaselineObjUI.html)  
> 获取日期：2026-11-12

<a id="wwID0E4OFU"></a>

<a id="wwID0ESPFU"></a>

Opens the **Update Baseline Objects** window, where you can update variant baseline members by selecting a variant specification revision. To update the variant baseline members, use the following procedure:

> ![\*](../../../../../../images/6652ad397dd1_note_16x16.png) **Note:** In the Product Family structure, this action is available only for the managed variant specifications that are associated with a variant baseline.

<a id="wwID0ELRFU"></a>

1. Select a variant specification associated with a variant baseline. The **Target Variant Baselines** field displays the details of the targeted variant baseline that is updated.

<a id="wwID0ERSFU"></a>

2. Select new revisions of the initially selected objects.

<a id="wwID0ETTFU"></a>

3. Collect either all or none of the dependent parts. To selectively exclude objects to be updated as required, click the **Exclude selected objects** ![](../../../../../../images/a2a4c20dd5e3_IconExcludeSelectedObj.png) icon. You can also control part collection by using the **Include dependent Parts** and **Include replacements** preferences. For more information on these preferences, see [Product Family Management Preferences](../../../13-product-famil-9fdce8c5/02-product-famil-d963a369/index.md#wwID0EOZOU "Product Family Management Preferences").

<a id="wwID0ETVFU"></a>

4. Select the **Preserve Existing Revisions** check box to preserve existing revisions of variant baseline objects that are already assigned to the variant baseline.

<a id="wwID0EZWFU"></a>

5. Verify updates in the **Preview Updates** step. You can update or populate variant baseline member link attribute values in this step. You can also selectively exclude objects from the available updates list. The baseline member link attributes with the required value constraint are not automatically displayed in this step. You must manually include these attributes using the **Customize** view functionality.

<a id="wwID0EDYFU"></a>

6. Click **Finish** to apply updates.

<a id="wwID0E1YFU"></a>

As a result, existing variant baseline members are updated and new variant baseline members are assigned as appropriate.
