# Creating Textual, Numeric, and Boolean Options

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsCreate.html)  
> 获取日期：2026-11-12

<a id="wwID0E4JWQ"></a>

<a id="wwID0ENKWQ"></a>

Option Managers can create options for the option pool in a product or library context. You can create multiple options in one action.

|  |  |
| --- | --- |
| **![\*](../../../../../../images/64df1bdad6a0_warning_16x16.png)** | If you disable the Object Initialization Rules for options or modify the Object Initialization Rules not to use autonumbering, you will be unable to create options. |

<a id="wwID0EOLWQ"></a>

To create options:

<a id="wwID0EHMWQ"></a>

1. Under a product or library, click **Details**, and then click the **Option Pool** tab.

<a id="wwID0ERNWQ"></a>

2. Click the **Design Option** or **Sales Option** tab in the right pane.

<a id="wwID0E2OWQ"></a>

3. Click the **New Option**![](../../../../../../images/b7fdeb6a24f0_IconOptionNew.gif) icon from the toolbar of the **Options** table.

<a id="wwID0ELQWQ"></a>

4. For **Data Type**, select string, numeric, or boolean options to create the option of the corresponding data type.

|  |  |
| --- | --- |
| **![\*](../../../../../../images/6652ad397dd1_note_16x16.png)** | Ability to select numeric and boolean as the Data Type for an option is an advanced capability subject to a separate license entitlement. |

<a id="wwID0E1RWQ"></a>

1. When you create a boolean option, two choices, **Yes** and **No**, are created automatically for that option. This indicates whether a choice can be included (Yes) or not (No) for that option while evaluating filters in the **Option Filter** tab when editing a filter. When viewing the choices in the product structure browser and in the information page of the Option Pool, Option Set, and variant specification, the choice names are appended with the corresponding option name, such as ”<<Option Name>> — Yes” and “<<Option Name>> — No”, for easy identification.

|  |  |
| --- | --- |
| **![\*](../../../../../../images/6652ad397dd1_note_16x16.png)** | • You cannot rename or delete the boolean option choices. When you delete the boolean option, the boolean option choices are automatically deleted.• When creating a conditional rule on an Option Pool or Option Set, you can specify boolean option by name or number. For more information, see [Managing Conditional Rules for the Option Set](../../../../03-working-with-op-fa126a/02-workflow-for-82e49141/06-managing-choi-7e5b8398/04-managing-cond-57999c02/index.md#wwID0EVFQR "Managing Conditional Rules for the Option Set").• In the **Selected Choices** view of the **Option Filter** window, for filtering product structure you can specify a boolean option by name or number based on the preference **Choice Display Format** by selecting the appropriate value from the **Rule and Expression Format** drop-down menu. However, you cannot specify a boolean choice for filtering the product structure. In this view, you can select and add choices to the option filter definition by selecting them in the textual entry field in the choice panel. However, for boolean options, you cannot select one single choice. Both the boolean option choices (Yes and No) are automatically selected together to use for the option filter evaluation. |

<a id="wwID0E1XWQ"></a>

5. Type the name for the option.

<a id="wwID0E3YWQ"></a>

6. If the option is required, click the checkbox under the **Required** column.

<a id="wwID0EC1WQ"></a>

7. If the option allows multiple choices, clear the checkmark under **Single Selection**. If the option can only have one choice selectable, select the checkmark under **Single Selection**.

|  |  |
| --- | --- |
| **![\*](../../../../../../images/6652ad397dd1_note_16x16.png)** | The **Single Selection** check box is not available for the boolean options, since the boolean options are created as single select options by default. |

|  |  |
| --- | --- |
| **![\*](../../../../../../images/6652ad397dd1_note_16x16.png)** | Options with numeric values are **Single Selection** by default. |

<a id="wwID0EK4WQ"></a>

8. If creating an option with numeric values, select the **Quantity of Measure** from a drop-down list.

|  |  |
| --- | --- |
| **![\*](../../../../../../images/6652ad397dd1_note_16x16.png)** | If you need a Quantity of Measure that does not require units, you can use the Count Quantity of Measure that is available out-of-the-box. |

<a id="wwID0EP6WQ"></a>

9. To add more options, click ![](../../../../../../images/95a4c9475784_IconAdd.gif). When finished creating options, click **OK**. The options are added to the **Options** table.

<a id="wwID0EBBXQ"></a>

10. To delete options, select a row and click ![](../../../../../../images/22aa5ed232d8_IconDelete.gif).

<a id="wwID0E2BXQ"></a>

After you have added options, you can define possible choices for these options and organize options in groups. You can edit an option by right-clicking it and selecting **Edit**.
