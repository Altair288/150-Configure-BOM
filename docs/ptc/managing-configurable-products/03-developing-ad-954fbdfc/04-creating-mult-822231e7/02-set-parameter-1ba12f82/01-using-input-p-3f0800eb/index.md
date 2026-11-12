# Using Input Pages with Variable Parameters

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsConfigureMultipleVarInputPages.html)  
> 获取日期：2026-11-12

<a id="wwID0EULUT"></a>

<a id="wwID0EFMUT"></a>

Consider the following information about the input pages for the “Set Parameters” step of the “Configure Multiple Variants” process:

<a id="wwID0E5MUT"></a>

- The number of input pages presented depends on the number of parameters and page breaks defined for the configurable module.

<a id="wwID0EAOUT"></a>

- You can return to the previous input pages using **Back** and change your selections.

<a id="wwID0EGPUT"></a>

- When you move from one page to the next page in the **Set Parameters** step, the number of combinations defined is compared against the maximum of 256. If the number exceeds the limit, it is required to reduce the number of variable parameters or number of values provides for the variable parameters. Once it is not possible to define a variable parameter without exceeding the maximum, the ability to set variable parameters is disabled for all subsequent pages.

<a id="wwID0EMQUT"></a>

- The **Variable Parameter** checkbox switches the parameter between single and variable input models. Selecting the checkbox allows the parameter to accept multiple values. Clearing the selected checkbox allows the parameter to accept only a single value.

<a id="wwID0EBRUT"></a>

- When you switch between disabling or enabling a parameter as variable parameter, the values selected are not retained and are reverted to default.

<a id="wwID0EWRUT"></a>

- Parameters defined to accept user input are treated as required.

<a id="wwID0EYSUT"></a>

- Parameters defined to accept multiple selection default to variable parameters.

<a id="wwID0E1TUT"></a>

- If a single input parameter is of type Boolean without constraints, its values are presented using radio buttons for single selection. The default selection for a required single input Boolean parameter is the **No** radio button. When enabled as a variable parameter, the values are presented using checkboxes for multiple selections. The default selection for a required variable Boolean parameter is the **No** checkbox.

<a id="wwID0EEVUT"></a>

- If a variable Boolean parameter is not required, the values are presented using checkboxes for the selection of either one or both checkboxes. By default, both the **Yes** and **No** checkboxes are selected for a variable Boolean parameter that is not required.

<a id="wwID0EOWUT"></a>

- If a parameter of type String is enabled as a variable parameter, each text box is presented with a checkbox. Click ![](../../../../../images/b20e634187b7_Add_ED.gif) to add a text box. The text boxes that you add are added one below the other. Select the required checkbox and click ![](../../../../../images/ae4a236e741a_IconRemove.gif) to remove a text box.

<a id="wwID0E5XUT"></a>

- If a parameter of type Integer or Real Number is enabled as a variable parameter, each text box is presented with a checkbox on the left and the “Edit Parameter Value Interval” icon ![](../../../../../images/6721c3644973_complaint_summary_edit.png) on the right. Click ![](../../../../../images/b20e634187b7_Add_ED.gif) to add a text box. The text boxes that you add are added one below the other. To remove a text box, select the corresponding checkbox and click ![](../../../../../images/ae4a236e741a_IconRemove.gif).

<a id="wwID0EEZUT"></a>

- If a parameter of type Integer or Real Number is enabled as a variable parameter, you can also set intervals for the parameter value. You can set the range and step of a parameter value in any of the following ways:

<a id="wwID0E3ZUT"></a>

- Using the **Edit Parameter Value Interval** dialog displayed beside the text box.

<a id="wwID0EC2UT"></a>

- Specifying the range and interval in the text box in any of the following formats:

<a id="wwID0EH3UT"></a>

- (1...10)1, the values are set from 2 to 9.

<a id="wwID0EJ4UT"></a>

- \[1...10\]1, the values are set from 1 to 10.

<a id="wwID0EL5UT"></a>

- (1...10\]1, the values are set from 2 to 10.

<a id="wwID0EN6UT"></a>

- \[1...10)1, the values are set from 1 to 9.

|  |  |
| --- | --- |
| **![\*](../../../../../images/6652ad397dd1_note_16x16.png)** | • The “(” or “)” parenthesis denotes that the value is excluded.• The “\[” or “\]” bracket denotes that the value is included. |

<a id="wwID0EDEVT"></a>

- If a parameter has an explanation defined, the text provided for the parameter is displayed above the parameter.

<a id="wwID0EFFVT"></a>

- If a parameter has a range or unit defined, it is displayed inline and to the right of the parameter value.

<a id="wwID0EHGVT"></a>

- If a parameter has a default value defined, you can use a restore default action icon ![](../../../../../images/03907ace3337_undo.gif) to restore the parameter to its default setting.

<a id="wwID0E6GVT"></a>

- The icon is displayed when the value specified for the parameter is other than the defined default value. The icon is always displayed inline and to the right of the parameter range or unit.

<a id="wwID0EUHVT"></a>

- If a parameter has a helpURL defined, a help icon ![](../../../../../images/2be2e3770aeb_IconHelp.gif) is displayed. You can click this icon to get specific help information for the parameter.

<a id="wwID0EBJVT"></a>

- If the whole parameter has imageURL defined, its image is displayed. If the parameter has enumerated values defined with the corresponding images, the image corresponding to the selected parameter value is displayed for single input parameters.

<a id="wwID0EHKVT"></a>

- If a parameter has a calculationExplanation defined, this value is included in the summary of input parameters.

<a id="wwID0E5KVT"></a>

For more information on advanced selection logic definitions, see [Developing Advanced Selection Logic for Configurable Modules](../../../index.md).
