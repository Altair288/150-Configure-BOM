# Syntax for Creating Advanced Expressions

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsSyntaxAdvancedExpress.html)  
> 获取日期：2026-11-12

<a id="wwID0ER24R"></a>

<a id="wwID0EB34R"></a>

An advanced expression consists of the following elements:

<a id="wwID0E134R"></a>

- Logical operators:

<a id="wwID0E644R"></a>

- “+” or “&&” – as AND

<a id="wwID0EB64R"></a>

- “/” or “||” – as OR

<a id="wwID0EDA5R"></a>

- “-” or “!” – as NOT

|  |  |
| --- | --- |
| **![\*](../../../../../images/6652ad397dd1_note_16x16.png)** | Logical operators can be configured to map to the site-specific operators by changing the properties file. For details, see [Configuring Expressions](../../11-configuring-exp-39574d/index.md#wwID0EZRAS "Configuring Expressions"). |

<a id="wwID0ELC5R"></a>

- Parenthesis for grouping logic: “(“ and “)”

<a id="wwID0END5R"></a>

- Expression members (choices)

<a id="wwID0EPE5R"></a>

- Spaces and <new line> for readability

<a id="wwID0ECF5R"></a>

Following is an example of an expression:

<a id="wwID0E2F5R"></a>

- (Red && Small) || (Blue && !Large) – This expression specifies that the part is included in the product structure if Red and Small are requested, or if Blue and not Large are requested.

<a id="wwID0ECH5R"></a>

Consider these guidelines for creating expressions:

<a id="wwID0E2H5R"></a>

- Choice names must be globally unique.

<a id="wwID0E4I5R"></a>

- An expression can use a combination of choices from the assigned option set.

<a id="wwID0E6J5R"></a>

- When including a choice, do not include the option name.

<a id="wwID0EBL5R"></a>

- If a choice name starts with a number or the name contains a space or a special character, include the name in quotes. For example, you can have an expression: “light blue” + “64GB” + “-48” / ”+48”

<a id="wwID0EXL5R"></a>

Your organization can customize the assignment of expressions to specify a particular format for defining expression or to perform site-specific validation of expressions. For more information, see [Configuring Expressions](../../11-configuring-exp-39574d/index.md#wwID0EZRAS "Configuring Expressions").
