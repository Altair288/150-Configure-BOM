# Reconfiguring a Variant Specification

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsReconfigure.html)  
> 获取日期：2026-11-12

<a id="wwID0EMOSS"></a>

<a id="wwID0E3OSS"></a>

You can reconfigure a variant specification by specifying different filtering criteria and providing different inputs for the parameters during the Configure process. For more information on the Configure process, see [Creating Variant Structures Using the Configure Process](../../02-creating-vari-da7dff17/index.md).

> ![\*](../../../../../images/6652ad397dd1_note_16x16.png) **Note:** When reconfiguring a variant specification, the system uses the latest iteration of the configurable module only when **Apply to top level object** is selected; otherwise, it uses the part iteration associated with the variant specification.

<a id="wwID0EMQSS"></a>

To reconfigure a variant specification:

<a id="wwID0EFRSS"></a>

1. Go to the information page of the variant specification and click Actions > Reconfigure.

<a id="wwID0EGSSS"></a>

1. The **Reconfigure** window is displayed.

<a id="wwID0EATSS"></a>

2. In the **Set Filter** step, change the selections as needed and click **Next** to move to the next page. For more information, see [Set Filter Step: Specifying Expansion Criteria and Applying Filters](../../02-creating-vari-da7dff17/01-set-filter-st-14e2fbbf/index.md).

<a id="wwID0EUUSS"></a>

3. In the **Set Parameters** step, change the selections as needed and click **Next** to move to the next page. For more information, see [Set Parameters Step: Providing Inputs for Part Parameters](../../02-creating-vari-da7dff17/02-set-parameter-ecbe0bf0/index.md) and [Using Input Pages](../../02-creating-vari-da7dff17/02-set-parameter-ecbe0bf0/01-using-input-pages/index.md).

|  |  |
| --- | --- |
| **![\*](../../../../../images/6652ad397dd1_note_16x16.png)** | You can save the selections you made on each page and continue with the reconfiguration process by clicking the **Save** button. |

<a id="wwID0ERXSS"></a>

4. In the **Preview** step, choose an appropriate action:

<a id="wwID0E1YSS"></a>

- **Go to selected Variant Specification information page**—Click **Finish** to close the window and go to the information page of the existing variant specification you selected.

<a id="wwID0ED1SS"></a>

- **Go to selected Module Variant information page**—Click **Finish** to close the window and go to the information page of the existing variant part you selected.

<a id="wwID0EM2SS"></a>

- **Create a new Variant Specification**—Click **Next** to complete the modification of the variant specification and request deliverables, if needed. You can change the description of the variant specification before proceeding to the next step.

|  |  |
| --- | --- |
| **![\*](../../../../../images/64df1bdad6a0_warning_16x16.png)** | It is recommended that you do not use Refresh (F5) during the configure and reconfigure process, as this can produce a processing error. |
