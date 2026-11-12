# Evaluation of Advanced Expressions

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsFilteringDelegateConfiguringAdvancedExpressions.html)  
> 获取日期：2026-11-12

<a id="wwID0EDFLS"></a>

<a id="wwID0EXFLS"></a>

## Selection Status of Choices

<a id="wwID0E2FLS"></a>

An expression assigned to objects, such as parts and part usage links, is a Boolean expression. The status of the choice selections in the expression operands that use Boolean values is defined as follows:

<a id="wwID0EUGLS"></a>

- If an option has a choice selected in the Options filter, then the selected choices are assigned the value TRUE. Unselected choices are assigned the value FALSE.

<a id="wwID0EWHLS"></a>

- If an option has no choices selected by the user in the Options filter, then the choices are considered UNDEFINED.

<a id="wwID0EOILS"></a>

## Short-circuit Evaluation of Expressions

<a id="wwID0ESILS"></a>

The expressions are evaluated according to the following truth tables for the three basic logical operators:

| Operator | A | !A (NOT A) | Definition and Values |
| --- | --- | --- | --- |
| AND | TRUE | FALSE | • If the value of one of the two operands is FALSE, the result is FALSE irrespective of the value of the other operand (TRUE, FALSE, or UNDEFINED). • If the value of one of the operands is TRUE, the result coincides with the value of the other operand. |
| OR | FALSE | TRUE | • If the value of one of the two operands is TRUE, the result is TRUE, regardless of the value of the other operand (TRUE, FALSE, or UNDEFINED). • If the value of one of the operands is FALSE, the result coincides with the value of the other operand. |
| NOT | UNDEFINED | UNDEFINED |  |

<a id="wwID0EJULS"></a>

## Evaluation Modes of Advanced Expressions

<a id="wwID0ENULS"></a>

An expression assignable object (such as a part, a part usage link, or occurrence) can have its assigned advanced expression in the following modes:

| Mode | Definition and Values |
| --- | --- |
| UNDEFINED | The object is assigned an advanced expression that cannot be evaluated. The result of computation is UNDEFINED. |
| DEFINED | The object is assigned an advanced expression that evaluates to a Boolean value – TRUE or FALSE. |
