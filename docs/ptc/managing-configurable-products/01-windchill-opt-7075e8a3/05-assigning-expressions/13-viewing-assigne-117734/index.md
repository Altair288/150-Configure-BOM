# Viewing Assigned Expressions

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsViewingAssignedExpressions.html)  
> 获取日期：2026-11-12

<a id="wwID0ESLBS"></a>

<a id="wwID0EDMBS"></a>

You can view expressions assigned to parts and usage links of configurable modules in several places in the user interface.

<a id="wwID0EMMBS"></a>

## Viewing Assigned Expressions in the Tree View and Uses Table

<a id="wwID0EQMBS"></a>

You can view expressions assigned to parts and usage links of configurable parts on the **Structure** tab of the information page of a configurable module.

<a id="wwID0EZMBS"></a>

To view this information in the tables, add the following columns to the table view:

<a id="wwID0ERNBS"></a>

- **Assigned Item Expressions**—View expressions assigned to parts or configurable parts.

<a id="wwID0EWOBS"></a>

- **Assigned Usage Expressions**—View expressions assigned to usage links of configurable parts.

<a id="wwID0ELPBS"></a>

To add these columns to the structure tree view, edit the table view by using Views > Manage Structure Views from the **Viewing** action toolbar.

<a id="wwID0EDQBS"></a>

To add these columns to the **Uses** table, edit the table view using the table edit icon, and then click **Manage Table Views**.

> ![\*](../../../../images/6652ad397dd1_note_16x16.png) **Note:** The information in the columns is read-only.

<a id="wwID0EPRBS"></a>

## Viewing Expressions Assigned To a Part

<a id="wwID0ETRBS"></a>

You can view expressions assigned to a part in the **Assigned Basic Expression Choices** or **Assigned Advanced Expressions** table, depending on the type of expressions that is supported for this product. To view the tables, go to the part information page, add a new tab, and click Customize > General > Assigned Expressions.

<a id="wwID0EZSBS"></a>

## Syntax for Displaying Expressions in Tables

<a id="wwID0ERTBS"></a>

- If there is only one expression assigned to the item, the format is as follows:

<a id="wwID0ECUBS"></a>

(ChoiceA || ChoiceB) && !ChoiceC

<a id="wwID0E3UBS"></a>

- If multiple expressions are assigned to the item, each expression is surrounded by brackets with OR included between expressions:

<a id="wwID0ENVBS"></a>

\[<expression1>\] OR \[<expression2>\] OR \[<expression3>\]<br>\[(ChoiceA || ChoiceB) && !ChoiceC\] OR \[ChoiceD\] OR \[ChoiceE || ChoiceF\]

<a id="wwID0EDWBS"></a>

- If the choices used in the assignment are no longer included in the assigned option set, the expression is shown with a strikethrough.

<a id="wwID0E1WBS"></a>

## Viewing Assigned Expressions on the Attributes Tab of the Part Information Page

<a id="wwID0E5WBS"></a>

If the **Show Assigned Expressions on the Attributes Tab** preference is set to **Yes**, you can view the assigned expressions on the **Attributes** tab of the part information page. To do that, select the parent part in the part structure tree view and click the **Attributes** tab. The **Attributes** tab shows expressions assigned to the part, part usage links, and occurrences. To set this preference, you must be a site administrator.

|  |  |
| --- | --- |
| **![\*](../../../../images/64df1bdad6a0_warning_16x16.png)** | It is not recommended to alter the layout of these attributes for the part and part usage objects from the **Type and Attribute Management** utility. |

|  |  |
| --- | --- |
| **![\*](../../../../images/887c9a51d571_tip_16x16.png)** | If the object selected in the tree is not an occurrence or if the occurrence display is not enabled, expressions assigned to occurrences are not listed. |
