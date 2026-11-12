# Validating Expressions

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsValidateExpressions.html)  
> 获取日期：2026-11-12

<a id="wwID0ENEBS"></a>

<a id="wwID0E5EBS"></a>

When you create an expression, the system validates the expression to make sure:

<a id="wwID0EXFBS"></a>

- The expression is syntactically correct

<a id="wwID0EZGBS"></a>

- The choices used in the expression exist in the assigned option set

<a id="wwID0E2HBS"></a>

- The expression contains a valid alias as defined in the Option Manager

<a id="wwID0EOIBS"></a>

If an error is found, the expression is not saved.

<a id="wwID0EXIBS"></a>

## Site-specific Validation

<a id="wwID0E2IBS"></a>

Companies can create their own method for validating assigned expressions, which are used on Part, PartUsageLink, PartUsageOccurances, and ExpressionAlias objects. To do this, you must implement a method “validate” in the interface com.ptc.windchill.option.expression.ExpressionValidator, and then set a Windchill property com.ptc.windchill.option.expression.ExpressionValidator=ext.custom.CustomValidator.

> ![\*](../../../../images/6652ad397dd1_note_16x16.png) **Note:** Ability to assign advanced expressions and validate with customized validation is an advanced capability subject to a separate license entitlement.
