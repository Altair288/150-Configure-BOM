# Variant Specification Information Page

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OVVariantSpecInfoPage.html)  
> 获取日期：2026-11-12

<a id="wwID0E5FRS"></a>

<a id="wwID0ESGRS"></a>

To access the information page of a variant specification, locate the variant specification in the **Folder Contents** table and click ![](../../../../images/d371d2ffb4ed_IconInfoPage.gif). From the information page, you can perform actions on the variant specification as well as view attributes and additional information.

<a id="wwID0EHHRS"></a>

## Actions

<a id="wwID0ELHRS"></a>

Information pages contain a list of applicable actions in a menu just below the object identification line. See [Common Actions](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/commonactions/CommonActionsRef.html) for a list of common actions available in Windchill. The availability of these actions depends on the status of the variant specification, as well as your access to it. For more information about status indicators, see [Object Status](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/objectoview/ObjectOviewStatusIndicators.html).

<a id="wwID0EEIRS"></a>

The following actions may be of particular interest for this object.

<table border="1"><tr><th><div id="wwID0EOJRS">Action</div></th><th><div id="wwID0E2JRS">Description</div></th></tr><tr><td><div id="wwID0ENKRS"><span>Edit</span></div></td><td><div id="wwID0E1KRS">Allows you to change the description for the variant specification. You must check out the variant specification before editing. When finished editing, you can check it back in.</div></td></tr><tr><td><div id="wwID0EDLRS"><span>Save As</span></div></td><td><div id="wwID0ERLRS">Creates a copy of the variant specification.</div></td></tr><tr><td><div id="wwID0EAMRS"><span>Preview</span></div></td><td><div id="wwID0EOMRS">Allows you to preview a variant specification to review the choice selections and other settings.</div></td></tr><tr><td><div id="wwID0E4MRS"><span>Reconfigure</span></div></td><td><div id="wwID0ELNRS">Allows you to reconfigure the variant specification by redefining user inputs, and to reselect a solution from available variant solutions.</div></td></tr><tr><td><div id="wwID0E1NRS"><span>Request Deliverables</span></div></td><td><div id="wwID0EIORS">Creates deliverables for the variant specification.</div><div id="wwID0EMORS">When all requested deliverables are completed, you are notified by email with a link to the variant specification.</div><div><table><tr><td><div id="wwID0E4ORS"><span><img src="../../../../images/6652ad397dd1_note_16x16.png" alt="*" width="16" height="16" /></span> </div></td><td><div id="wwID0EBPRS">An email is sent regardless of whether the requested deliverables were created successfully or not.</div></td></tr></table></div></td></tr><tr><td><div id="wwID0ELPRS"><span>View Variant Solution</span></div></td><td><div id="wwID0EZPRS">Lists the filtered structure that includes only the parts included in the variant, with the quantities and parameter values selected for each part.</div></td></tr><tr><td><div id="wwID0EHQRS"><span>Compare Information</span></div></td><td><div id="wwID0EUQRS">Compares two variant specifications.</div></td></tr><tr><td><div id="wwID0ECRRS"><span>Compare Variant Solution</span></div></td><td><div id="wwID0EPRRS">Compares solutions of two variant specifications.</div></td></tr><tr><td><div id="wwID0E5RRS"><span>Subscribe</span></div></td><td><div id="wwID0EMSRS">Enables individuals or groups to receive email notifications when certain events or actions occur on a variant specification.</div></td></tr><tr><td><div id="wwID0E2SRS"><span>Set State</span></div></td><td><div id="wwID0EJTRS">Allows you to release a variant specification. As a result, one more object called configurable structure baseline is created. For more information, see <span><a href="05-capturing-the-c1554391/index.md#wwID0EW4SS">Capturing the Configuration of a Variant Specification</a></span>.</div><div><table><tr><td><div id="wwID0EIURS"><span><img src="../../../../images/6652ad397dd1_note_16x16.png" alt="*" width="16" height="16" /></span> </div></td><td><div id="wwID0ERURS">The configurable structure baseline is used only for managed variant specifications.</div></td></tr></table></div></td></tr></table>

<a id="wwID0E5URS"></a>

## Tables

<a id="wwID0ECVRS"></a>

You can customize the tabs that appear on each object information page to display the information most useful to you.

> ![\*](../../../../images/6652ad397dd1_note_16x16.png) **Note:** Administrators may have modified the tabs that are viewable to you.

| Table | Description |
| --- | --- |
| **Selected Choices** | The table is displayed by default in the **Details** tab of the variant specification information page. To add this table to another tab, click Customize > General > Selected Choices.This table captures the choices that were selected for this variant specification during the part configuration process. For each selected choice, the table lists the option name and the group to which it belongs. |
| **Completed Deliverables** | To show this information, add a new tab and select Customize > Related Objects > Deliverables.This table lists the deliverables created from the variant specification. From this table, you can add a deliverable by associating an existing part to the variant specification, and you can also delete deliverables. For more information, see [Managing Deliverables](../04-managing-deliverables/index.md#wwID0EEWTS "Managing Deliverables"). |
| **Requested Deliverables** | To show this information, add a new tab and select Customize > Related Objects > Deliverables.This table lists any existing requests made on the system to create a variant part from this variant specification. Once the request is processed and the deliverable is created, the request is deleted by the system. |
| **Matching Variant Specifications** | To show this information, add a new tab and select Customize > Related Objects > Matching Variant Specifications.This table shows the matching variant specifications and variant parts that exist for this variant specification. This table is read-only. |
