# Basic and Advanced Expressions

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsBasicAdvancedExpressions.html)  
> 获取日期：2026-11-12

<a id="wwID0ECEYR"></a>

<a id="wwID0EXEYR"></a>

With the Platform Structures module installed, you can create two types of expressions – basic and advanced. A basic expression represents the option choices that you select from a list of the choices included in the assigned options set.

<a id="wwID0E3EYR"></a>

An advanced expression defines a logic by using choices, operators, and functions. For example, an advanced expression can be:

<a id="wwID0EBFYR"></a>

\[Country = Canada && Language = French\] OR \[Country = Switzerland && Language = German\]

<a id="wwID0EHFYR"></a>

Without a license for Platform Structures, you can create only basic expressions.

<a id="wwID0EMFYR"></a>

A Windchill preference controls what type of expression is allowed for a particular context. For details about the preference, see [Supported Expressions](../02-supported-expressions/index.md#wwID0E6MYR "Supported Expressions").

> ![\*](../../../../images/6652ad397dd1_note_16x16.png) **Note:** Ability to create or modify advanced expression is an advanced capability subject to a separate license entitlement.

<a id="wwID0ECHYR"></a>

The following example illustrates the difference between basic and advanced expressions. Suppose that we have two options:

<a id="wwID0E2HYR"></a>

- COLOR with choices Red, Blue, Green

<a id="wwID0EDJYR"></a>

- SIZE with choices Small, Medium, Large

<a id="wwID0E3JYR"></a>

A basic expression that specifies COLOR=Red,Blue; SIZE=Small,Medium is assigned to an item. This means that when you select Red or Blue and Small or Medium in the Option filter, the item is included in the product structure. For other selections in the Option filter, the item is not included.

<a id="wwID0EWKYR"></a>

Using basic expressions, you cannot express the logic with the conditions combined by OR. For example, Red and Small, OR Blue and Medium. A more complex logic can be defined using advanced expressions. For information on advanced expressions, see [Defining Advanced Expressions](../08-defining-adva-d6095590/index.md#wwID0EVO4R "Defining Advanced Expressions").

<a id="wwID0E2LYR"></a>

## Switching Between Basic and Advanced Expressions

<a id="wwID0E6LYR"></a>

Only one type of expression (basic or advanced) can be assigned to an item. If the Supported Expressions preference is set to support both types of expressions, and an item already has assigned expressions, adding a different expression type causes the previous assignments to be removed. If the system detects this type of conflict, it issues a warning and asks you if you want to continue with adding a different type of expression.
