# Set Filter Step: Specifying Expansion Criteria and Applying Filters

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsConfigureFilterDefine.html)  
> 获取日期：2026-11-12

<a id="wwID0ETOOS"></a>

<a id="wwID0EEPOS"></a>

The first step of the configuration process allows you to specify the filtering criteria that are applied to the part structure. For more information about defining a configuration specification filter, see [About Configuration Specifications](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/prodstructure/PMConfigSpecAbout.html).

<a id="wwID0EUPOS"></a>

The Option Filter is available if an option set is assigned to this part or product (or a corresponding context).

<a id="wwID0EZPOS"></a>

To complete the Set Filter step:

<a id="wwID0ESQOS"></a>

1. Select the appropriate configuration specification type from the **Choose a Type** dropdown at the top of the left pane. Different filter criteria are displayed depending on the selected type.

<a id="wwID0EYROS"></a>

2. Select or enter the desired filter criteria in the corresponding fields in the left pane. Click **Add** at the bottom of the left pane to add the new filter to the **To Be Applied** table in the right pane.

|  |  |
| --- | --- |
| **![\*](../../../../../images/6652ad397dd1_note_16x16.png)** | The configuration specification filters in the **To Be Applied** table are applied to the structure in the order from the first in the list to the last. If an object version satisfying the first configuration specification filter is located, that version is selected and the system proceeds to the next object in the structure. If an object version satisfying the first configuration specification filter is not located the system uses the second configuration specification filter, and so on until all filters are used. If there is no object version satisfying any of the configuration specification filters, the object master icon ![](../../../../../images/7a7dbc36f716_mpmlink_part_master.png) is displayed indicating that the structure is not fully defined. |

<a id="wwID0EIUOS"></a>

3. Specify how you want to apply selections by choosing the appropriate setting for **Apply to top level object**, **Apply latest for unresolved dependents**, or **Hide unresolved dependents**.

<a id="wwID0EWVOS"></a>

4. Specify the filtering criteria. For information on how to select criteria for the Option Filter, see [Specifying the Filtering Criteria for the Option Filter](../../../07-filtering-a-c-73998438/01-specifying-th-527f51f6/index.md).

<a id="wwID0ECXOS"></a>

5. After you have made all your selections on this page, you can save them and continue with the configuration process. To save the settings, click the **Save** button. If the variant specification has not yet been created, you are placed in the Variant Specification step, allowing you to specify the name of the variant specification. To return back to where you were in the configuration process, click **Continue**.

<a id="wwID0EMYOS"></a>

6. When finished providing inputs for this step, click **Next** to go to the next step of the configuration process, or click **Finish** to save the variant specification with the specified inputs and exit from the configuration process.
