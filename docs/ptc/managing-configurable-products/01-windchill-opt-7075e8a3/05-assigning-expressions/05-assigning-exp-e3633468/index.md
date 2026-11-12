# Assigning Expressions to Parts

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsAssignChoicesPart.html)  
> 获取日期：2026-11-12

<a id="wwID0E5Y2R"></a>

<a id="wwID0ETZ2R"></a>

You can assign expressions to parts or configurable modules. Consider this information for assigning expressions:

<a id="wwID0EM12R"></a>

- An option set must be assigned to the part or its context, or to the root part or its context. The context is a product or library to which this part belongs.

<a id="wwID0EO22R"></a>

- If the option set was created with **Allow Assignment of Expressions to Non-Configurable Items** set to **No**, you can assign expressions only to configurable modules. If the option set was created with **Allow Assignment of Expressions to Non-Configurable Items** set to **Yes**, then you can assign expressions to both standard parts and configurable modules.

<a id="wwID0EA42R"></a>

- You can assign advanced expressions, if advanced expressions are supported for your site and product.

<a id="wwID0ET42R"></a>

To assign expressions to a part:

<a id="wwID0EM52R"></a>

1. Go to the part information page and click **Assign Expression** from the **Actions** menu.

<a id="wwID0EW62R"></a>

2. The **Assign Basic Expression** window opens, listing the options and choices from the assigned option set. For steps for defining basic expressions, go to [Defining Basic Expressions](../07-defining-basic-ac2838/index.md#wwID0EF23R "Defining Basic Expressions").

|  |  |
| --- | --- |
| **![\*](../../../../images/6652ad397dd1_note_16x16.png)** | If the toggle ![](../../../../images/8c0f04b223f8_IconOptionRulesEdit.gif) action is available, you can toggle the window between the basic expressions and the advanced expressions. The ![](../../../../images/8c0f04b223f8_IconOptionRulesEdit.gif) icon appears if the current assignment type disagrees with the setting of the Supported Expressions preference setting, or if the preference is set to both types. |

<a id="wwID0ETC3R"></a>

3. When finished expressions, click **OK**. The expressions you assigned are listed in the **Assigned Item Expressions** column in the tree view and the **Uses** table.

|  |  |
| --- | --- |
| **![\*](../../../../images/6652ad397dd1_note_16x16.png)** | You can configure the tables to add the **Assigned Item Expressions** column. |

<a id="wwID0EVE3R"></a>

## Other Ways to Access the Assign Expression Action for Parts

<a id="wwID0EZE3R"></a>

The **Assign Expression** action (or the toolbar ![](../../../../images/8c0f04b223f8_IconOptionRulesEdit.gif) action) is also available from the following locations:

<a id="wwID0E4F3R"></a>

- As a toolbar ![](../../../../images/8c0f04b223f8_IconOptionRulesEdit.gif) action on the **Assigned Basic Expression Choices** or the **Assigned Advanced Expressions** table (accessed by adding a new tab to the part information page and selecting Customize > General > Assigned Expressions)

<a id="wwID0EFI3R"></a>

- From the **Folder Contents** table, as a row-level right-click action

<a id="wwID0ELJ3R"></a>

- From the **Search** page, as a row-level right-click action

<a id="wwID0ERK3R"></a>

- From the tree view on the **Structure** tab of the part information page, as a row-level right-click action
