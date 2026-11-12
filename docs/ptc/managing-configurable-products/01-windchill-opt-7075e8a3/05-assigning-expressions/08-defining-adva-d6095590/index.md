# Defining Advanced Expressions

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsDefiningAdvancedExpressions.html)  
> 获取日期：2026-11-12

<a id="wwID0EVO4R"></a>

<a id="wwID0EFP4R"></a>

You can use advanced expressions to define the logic by using choices, operators, and functions. To assign advanced expressions to a part or usage link of a configurable module, you use the **Assign Advanced Expression** window.

|  |  |
| --- | --- |
| **![\*](../../../../images/887c9a51d571_tip_16x16.png)** | The toggle icon ![](../../../../images/8c0f04b223f8_IconOptionRulesEdit.gif), if present, indicates that you can toggle between the **Assign Basic Expression** and the **Assign Advanced Expression** window. |

<a id="wwID0E3Q4R"></a>

Follow these steps to define expressions using **Assign Advanced Expression** window:

<a id="wwID0EZR4R"></a>

1. The **Assign Advanced Expression** window shows the expressions currently assigned. Each row in the table contains a subexpression. All subexpressions cumulatively specify the conditions when the part is applicable in the product structure. By default, rows containing subexpressions are connected by the logical operator OR. The assigned option set is indicated at the top of the window.

<a id="wwID0EDT4R"></a>

2. Enter an expression and its description.

<a id="wwID0EFU4R"></a>

3. To add another subexpression, click ![](../../../../images/95a4c9475784_IconAdd.gif). A new row is added to the table. Add additional expressions, as needed.

<a id="wwID0EPV4R"></a>

4. When finished, click **OK**. The system performs the following actions:

<a id="wwID0EYW4R"></a>

- Validates that the entered expressions are syntactically correct.

<a id="wwID0E1X4R"></a>

- Verifies that the choice names are valid and that these choices are members of the assigned option set.

<a id="wwID0EMY4R"></a>

1. The expressions you assigned can be viewed in the tree view on the **Structure** tab and in the **Uses** table by adding the appropriate column to the table.
