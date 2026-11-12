# Set Generation: Review Parameter Value Combinations

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsParameterValueCombinations.html)  
> 获取日期：2026-11-12

<a id="wwID0EWKWT"></a>

<a id="wwID0EHLWT"></a>

The fourth and final step of the “Configure Multiple Variants” displays a summary of the parameter value combinations defined in the “Set Parameters” step and allows you to determine which combinations should be evaluated for generation.

<a id="wwID0EMLWT"></a>

The summary of the parameter value combinations is displayed in the **Parameter Value Combinations** table. The combinations marked as “Generate” will be evaluated for valid solutions, which will be used to generate the variant specifications and the corresponding deliverables according to the instructions provided in the “Set Generation Information” step. You can select the parameter value combinations for which you want to generate variants or choose to exclude the combinations for which you do not want to generate variants. By default, all combinations are marked for generation.

<a id="wwID0EWLWT"></a>

The table includes the “Generate” column and one column for each of the parameters from the “Set Parameters” step in the same order. The default sorting is the first three variable parameters, or when no variable parameters are set, the first three parameters. Each row represents a unique combination of the parameter values defined in the “Set Parameters” step. The “Generate” column indicates if the combination in the row should or should not be generated. ![](../../../../images/0669eb8461d4_ok_circle_green.png) indicates a combination to be generated. ![](../../../../images/5068db6920de_close_circle_red.png) indicates a combination not to be generated.

<a id="wwID0EKMWT"></a>

The following actions are available from the table toolbar and from the right-click actions menu in the table rows:

| Action | Description |
| --- | --- |
| **Generate** | Sets the unique combination in the selected row to be generated (indicated by ![](../../../../images/0669eb8461d4_ok_circle_green.png)).You can also select the action for a single row from the right-click actions menu. |
| **Do Not Generate** | Sets the unique combination in the selected row not to be generated (indicated by ![](../../../../images/5068db6920de_close_circle_red.png)).You can also select the action for a single row from the right-click actions menu. |

> ![\*](../../../../images/6652ad397dd1_note_16x16.png) **Note:** One or more rows must be marked for generation.

<a id="wwID0ESRWT"></a>

To complete the **Set Generation** step:

<a id="wwID0EQSWT"></a>

1. Review the unique parameter value combinations specified in the “Set Parameters” step.

<a id="wwID0ESTWT"></a>

2. Ensure the parameter values combinations not intended for generation are marked as not be generated, and parameter value combinations intended for generation are marked as to be generated.

<a id="wwID0EUUWT"></a>

3. Select the checkboxes next to the parameter value combinations for which you want to generate multiple variants and click **Generate**.

<a id="wwID0E1VWT"></a>

4. Click **Finish** to exit the **Configure Multiple Variants** wizard and initiate the multiple variants generation process, else click **Cancel** to exit the process.

<a id="wwID0EXWWT"></a>

1. When you click **Finish**, a message is displayed confirming that the multiple variants request is submitted.

> ![\*](../../../../images/6652ad397dd1_note_16x16.png) **Note:** Status information is available in the **Requested Multiple Variants** table of the configurable module. For more information, see the “Information on Requested Multiple Variants” section in [Information Page of a Configurable Module](../../../01-windchill-opt-7075e8a3/04-setting-up-co-f8cb7439/06-information-p-97985c5a/index.md).

<a id="wwID0EMYWT"></a>

For additional information on variant generation, see [Advanced Variant Generation](../../../01-windchill-opt-7075e8a3/08-creating-and-a9cfd907/02-creating-vari-da7dff17/05-variant-part-8fe24b9d/01-advanced-varian-512cff/index.md).

> ![\*](../../../../images/6652ad397dd1_note_16x16.png) **Note:** To learn how to carry over custom modeled attributes defined for the configurable module to the variant generated from it, see documentation on Windchill customization.
