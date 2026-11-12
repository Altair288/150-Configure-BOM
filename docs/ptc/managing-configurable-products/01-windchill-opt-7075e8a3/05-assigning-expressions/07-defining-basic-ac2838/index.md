# Defining Basic Expressions

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsDefiningBasicExpressions.html)  
> 获取日期：2026-11-12

<a id="wwID0EF23R"></a>

<a id="wwID0EV23R"></a>

Basic expressions represent the choices that you can assign to parts and part usage links. The choices that are available for assignment come from the assigned option set.

<a id="wwID0E123R"></a>

To assign basic expressions to a part or a usage link of a configurable module, you use the **Assign Basic Expression** window. In this window, you select the choices that specify when a part should be included in the product structure.

<a id="wwID0EE33R"></a>

Follow these steps to define expressions using **Assign Basic Expression** window:

<a id="wwID0EB43R"></a>

1. The **Assign Basic Expression** window lists the options and choices from the assigned option set. The assigned option set is indicated at the top of the window.

|  |  |
| --- | --- |
| **![\*](../../../../images/6652ad397dd1_note_16x16.png)** | The **Assign Basic Expression** window does not display the merged choices that were added from a lower-level option set. If you wish to assign expressions to those choices, you need to remove them from the merged option set. For more information on removing the merged choices, see [Removing Merged Choices and Rules](../../03-working-with-op-fa126a/05-merging-option-sets/03-removing-merg-b3cafce6/index.md#wwID0E2EVR "Removing Merged Choices and Rules"). |

<a id="wwID0ER63R"></a>

2. If the assigned option set was created with **Allow Date Effectivity for Choices** set to **Yes**, the effectivity date field is available in the **Assign Basic Expression** window. Once the effectivity date is selected, only the choices that are within their effectivity range are available for selection.

|  |  |
| --- | --- |
| **![\*](../../../../images/6652ad397dd1_note_16x16.png)** | For more information on the settings of the option set, see [Creating an Option Set](../../03-working-with-op-fa126a/02-workflow-for-82e49141/01-creating-an-option-set/index.md#wwID0EZNIR "Creating an Option Set"). |

<a id="wwID0EEC4R"></a>

3. To assign choices, select the **Design Option** or **Sales Option** tab.

<a id="wwID0EOD4R"></a>

4. The **Design Option** tab lists the options with their choices that are included in the option set. Select an option whose choices you want to select for assignment. The choices defined for this option appear in the right pane of the window. Click the choices that you want to select.

|  |  |
| --- | --- |
| **![\*](../../../../images/887c9a51d571_tip_16x16.png)** | You can filter the table by selecting **Options with Choices Selected** and **Options without Choices Selected** from the pull-down list at the top of the table. Alternatively, you can view all options available. |

<a id="wwID0EYF4R"></a>

5. If the assigned option set was created with **Allow Assignment of Exclude Choices** set to **Yes**, you can assign exclude choices. To do this, select a checkbox in the **Exclude** column. The excluded choices are added to the Summary section with the ≠ sign.

|  |  |
| --- | --- |
| **![\*](../../../../images/6652ad397dd1_note_16x16.png)** | Either all or none of the choices from the same option can be set as exclude choices. Designating one choice as an exclude choice selects all other choices from the same option. |

<a id="wwID0EAI4R"></a>

6. When finished selecting choices, click **OK** to complete the assignment of the basic expressions. The expressions you assigned can be viewed in the tree view and in the **Uses** table by adding the appropriate column to the table.

<a id="wwID0E6I4R"></a>

## Tips for Using the Assign Basic Expression User Interface

<a id="wwID0EXJ4R"></a>

- If options are organized by groups, you can filter the list by selecting a group from the drop-down list on the toolbar of the **Assign Basic Expression** window.

<a id="wwID0E4K4R"></a>

- You can view the information page for the assigned option set by clicking ![](../../../../images/d371d2ffb4ed_IconInfoPage.gif).

<a id="wwID0EGM4R"></a>

- You can click “+” or “—” next to the option name to expand or collapse option choices.

<a id="wwID0EIN4R"></a>

- If you want to remove all selections, click ![](../../../../images/c83724697809_IconMarkupClear.gif) at the top of the window.
