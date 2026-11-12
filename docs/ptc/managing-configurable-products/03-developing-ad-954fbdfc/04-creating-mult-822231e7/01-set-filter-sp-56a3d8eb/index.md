# Set Filter: Specifying Expansion Criteria

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsConfigureMultipleVarFilterDefine.html)  
> 获取日期：2026-11-12

<a id="wwID0ESRTT"></a>

<a id="wwID0EDSTT"></a>

The first step of the “Configure Multiple Variants” process provides the ability to specify the expansion criteria applied to the structure. For more information about defining a configuration specification filter, see [About Configuration Specifications](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/prodstructure/PMConfigSpecAbout.html).

<a id="wwID0ETSTT"></a>

To complete the **Set Filter** step:

<a id="wwID0ERTTT"></a>

1. Select the appropriate configuration specification type from the **Choose a Type** dropdown at the top of the left pane. Different filter criteria are displayed depending on the selected type.

<a id="wwID0EXUTT"></a>

2. Select or enter the desired filter criteria in the corresponding fields in the left pane. Click **Add** at the bottom of the left pane to add the new filter to the **To Be Applied** table in the right pane.

|  |  |
| --- | --- |
| **![\*](../../../../images/6652ad397dd1_note_16x16.png)** | The configuration specification filters in the **To Be Applied** table are applied to the structure in the order from the first in the list to the last. If an object version satisfying the first configuration specification filter is located, that version is selected and the system proceeds to the next object in the structure. If an object version satisfying the first configuration specification filter is not located the system uses the second configuration specification filter, and so on until all filters are used. If there is no object version satisfying any of the configuration specification filters, the object master icon ![](../../../../images/7a7dbc36f716_mpmlink_part_master.png) is displayed indicating that the structure is not fully defined. |

<a id="wwID0EHXTT"></a>

3. Specify how you want to apply selections by choosing the appropriate setting for **Apply to top level object**, **Apply latest for unresolved dependents**, or **Hide unresolved dependents**.

<a id="wwID0EVYTT"></a>

4. When you have provided all the inputs for this step, click **Next** to proceed to the “Set Parameters” step of the “Configure Multiple Variants” process, or click **Cancel** to exit the process.
