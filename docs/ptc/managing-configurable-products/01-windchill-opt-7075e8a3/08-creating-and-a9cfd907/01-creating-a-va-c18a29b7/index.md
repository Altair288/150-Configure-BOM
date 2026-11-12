# Creating a Variant Specification for an Option Set

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsVarSpecOptionSet.html)  
> 获取日期：2026-11-12

<a id="wwID0EH2NS"></a>

<a id="wwID0E22NS"></a>

You can create a new standalone variant specification in the context of an option set instead of a configurable module. This allows it to be used for any configurable module associated with the option set version using the **New Variant Specification** action available in the **Saved Filters** menu from the Part Structure Browser.

> ![\*](../../../../images/6652ad397dd1_note_16x16.png) **Note:** • The **New Variant Specification** action is available in Part Structure Browser only when you have the appropriate license. • The **New Variant Specification** action is available in the Process Plan Browser if you have installed MPMLink. • This action is available only when the com.ptc.windchill.option.variantspec.allowOptionSetVariantSpecificationCreate property is set to True. To create a variant specification or a managed option filter for an option set, when this property is enabled, ensure that the configurable modules property is enabled and the top level of the part structure is a configurable module. Variant specifications for configurable modules are not impacted by this property.

<a id="wwID0E5AOS"></a>

In the **New Variant Specification** window:

<a id="wwID0E2BOS"></a>

1. Provide the details for type, organizational identifier (available only when the **Expose Organization** preference is enabled), number, name, and location attributes for the new variant specification. This window also displays read-only details of the associated option set. Click **Next** in this window to move to the next step.

<a id="wwID0EFDOS"></a>

2. Define the filtering criteria for the variant specification. For more information, see [Editing a Structure Filter](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/prodstructure/PMFilterEdit.html). The details in the **Option Filter** tab of this window are pre-populated with the details from the current filter.

<a id="wwID0EGEOS"></a>

After successfully creating the new standalone variant specification ![](../../../../images/30093fec7fca_Icon_NewStandalone.png) or the managed option filter ![](../../../../images/e6cd54f8c1a0_Icon_ManagedOptionFilter.png) associated with the option set, the variant specification filter appears in the **Folder Contents** table. The variant specification filter is applied to your current structure, and the recently used variant specifications now show the details of this newly created variant specification.

<a id="wwID0E5EOS"></a>

To view the details of this new standalone variant specification on the information page of the associated option set, add a new tab and select Customize > Related Objects > Variant Specifications.
