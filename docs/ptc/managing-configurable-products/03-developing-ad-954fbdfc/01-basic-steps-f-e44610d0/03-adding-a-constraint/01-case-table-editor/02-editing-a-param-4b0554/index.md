# Editing a Parameter Formula

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsCaseTableEditor_ParamFormula.html)  
> 获取日期：2026-11-12

<a id="wwID0EA1DT"></a>

<a id="wwID0EU1DT"></a>

Using a formula in a case table you can derive the permissible values for a parameter. This provides the ability to determine values based on other information. A formula can be simple or complex, utilizing nesting of other formula or other case table parameters within the calculations.

> ![\*](../../../../../../images/6652ad397dd1_note_16x16.png) **Note:** • To enter and display the formulae and advanced logic expressions in a format that is consistent with Microsoft Excel, set the ato.expression.rendering.context=com.ptc.wpcfg.logic.XLSExpressionRenderingContext property in the WT\_HOME/codebase/wt.properties file. • The ability to designate a parameter for allowing formula is available only when the **Enable Advanced Case Tables** preference is enabled. For more information, see [Selecting Case Table Parameters](../03-selecting-cas-7943f856/index.md#wwID0EEEET "Selecting Case Table Parameters").

<a id="wwID0EI6DT"></a>

1. Specify the formula in the text entry area.

|  |  |
| --- | --- |
| **![\*](../../../../../../images/6652ad397dd1_note_16x16.png)** | To define the formula, use the actions located above the text entry area. The **Validate** action provides the syntax validation feedback without saving the formula. |

<a id="wwID0EJBET"></a>

2. Click **OK** to save the formula for the permissible parameter value.

> ![\*](../../../../../../images/6652ad397dd1_note_16x16.png) **Note:** Clicking **OK** also validates the syntax and saves the well-formed formula.

<a id="wwID0EU1DT-4"></a>

For more information on the use of formulas, see [Using Numeric Operators and Functions in Advanced Logic](../../../07-using-numeric-34971aaf/index.md#wwID0E6GGT "Using Numeric Operators and Functions in Advanced Logic").
