# Using Input Pages

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsInputPages.html)  
> 获取日期：2026-11-12

<a id="wwID0EQOPS"></a>

<a id="wwID0EAPPS"></a>

Consider this information about the input pages for the “Set Parameters” step of the Configure process:

<a id="wwID0EZPPS"></a>

- The number of input pages presented depends on the number of parameters and page breaks defined for the configurable module.

<a id="wwID0E2QPS"></a>

- You can return to the previous input pages using the **Back** button and change your selections.

<a id="wwID0EBSPS"></a>

- If a parameter has constraints, the selection of the parameter is typically available from a dropdown list.

<a id="wwID0EDTPS"></a>

- If a parameter is of type Boolean without constraints, its values are presented using radio buttons for single selection.

<a id="wwID0EFUPS"></a>

- If a parameter is multiselect, the values are presented using checkboxes for multiple selections.

<a id="wwID0EHVPS"></a>

- If a parameter is not required with constraints, the **Leave unspecified** option is available for selection to defer the selection until the desired solution is selected.

<a id="wwID0ENWPS"></a>

- If a parameter has an explanation defined, the text provided for the parameter is displayed above the parameter.

<a id="wwID0EPXPS"></a>

- If a parameter has a range or unit defined, it is displayed inline and to the right of the parameter value.

<a id="wwID0ERYPS"></a>

- If a parameter has a default value defined, you can use a restore default action icon ![](../../../../../../images/03907ace3337_undo.gif) to restore the parameter to its default setting.

<a id="wwID0EJZPS"></a>

- The icon is displayed when the value specified for the parameter is other than the defined default value. The icon is always displayed inline and to the right of the parameter range or unit.

<a id="wwID0E5ZPS"></a>

- If a parameter has a helpURL defined, a help icon ![](../../../../../../images/2be2e3770aeb_IconHelp.gif) is displayed. You can click this icon to get specific help information for the parameter.

<a id="wwID0EL2PS"></a>

- If the whole parameter has imageURL defined, its image is displayed. If the parameter has enumerated values defined with the corresponding images, the image corresponding to the selected parameter value is displayed.

<a id="wwID0ER3PS"></a>

- If a parameter has a calculationExplanation defined, this value is included in the summary of input parameters.

<a id="wwID0EI4PS"></a>

For more information on advanced selection logic definitions, see [Developing Advanced Selection Logic for Configurable Modules](../../../../../03-developing-ad-954fbdfc/index.md).
