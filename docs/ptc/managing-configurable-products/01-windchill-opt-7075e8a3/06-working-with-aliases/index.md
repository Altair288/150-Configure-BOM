# Working with Aliases

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsAliases.html)  
> 获取日期：2026-11-12

<a id="wwID0EQTCS"></a>

<a id="wwID0EAUCS"></a>

Aliases represent logical statements that can be used when authoring conditional rules, advanced assigned expressions, and other aliases.

<a id="wwID0EFUCS"></a>

Aliases allow you to efficiently manage reusable segments of logic. Typically, there are some common definitions that are reused in the configuration of the product. You can capture these common definitions as aliases and manage them globally for the product. For example, you can create an alias SmallTires and define it as 28IN/30IN/32IN/36IN/48IN by referencing the selected choices from the option TIRE. Next time you create an expression for a conditional rule or for an assigned expression, you can include the alias SmallTires instead of listing all acceptable tire choices.

> ![\*](../../../images/6652ad397dd1_note_16x16.png) **Note:** Ability to create and manage aliases is an advanced capability subject to a separate license entitlement.

<a id="wwID0EWVCS"></a>

Aliases provide you with these benefits:

<a id="wwID0EPWCS"></a>

- You can efficiently create expressions by including aliases in them, eliminating the need to retype long strings. This also increases the accuracy and consistency of the configuration logic.

<a id="wwID0ESXCS"></a>

- Because aliases are globally managed for a product or library context, you can easily update the alias if the logic changes. This way, you need not update the changed logic in individual assigned expressions or conditional rules.

<a id="wwID0EUYCS"></a>

- As the logic evolves, an alias can have multiple revisions. You can also apply the date effectivity to the use of the alias versions in advanced expressions and conditional rules.

<a id="wwID0EWZCS"></a>

- Aliases improve the readability of an expression.

<a id="wwID0EH1CS"></a>

- For example, you have a conditional rule:

<a id="wwID0EM1CS"></a>

IF ((HP=45HP/55HP/65HP/85HP and DIFF=IVT/CVT) and Tires=28IN/30IN/32IN/36IN/48IN) THEN Enable Country=CANADA/BELGIUM/FRANCE/MONACO/CH/LUXENBOURG

<a id="wwID0ER1CS"></a>

- If you define an alias MidPowerTrain to represent HP=45HP/55HP/65HP/85HP and DIFF=IVT/CVT, and SmallTires to represent Tires=28IN/30IN/32IN/36IN/48IN, then this conditional rule is simplified as follows:

<a id="wwID0EG2CS"></a>

IF (MidPowerTrain and SmallTires) Then Enable CANADA/BELGIUM/FRANCE/MONACO/CH/LUXENBOURG

<a id="wwID0E32CS"></a>

- For complex logic, you can use nested aliases.

<a id="wwID0ET3CS"></a>

## Using Aliases in Logical Expressions

<a id="wwID0EX3CS"></a>

Aliases can be used in logical expressions that are part of advanced expressions, conditional rules, or other aliases. Logical expressions can refer to aliases by their name or number, depending on the user configuration.

<a id="wwID0E23CS"></a>

When an alias is included in a logical expression, the system validates that the alias exists and that the alias is not calling itself. In addition, companies can plug in site-specific validation.

<a id="wwID0E63CS"></a>

If an alias has multiple revisions, the configuration specification is used to determine the proper revision of aliases to use in the evaluation of conditional rules and advanced assigned expressions.

<a id="wwID0EI4CS"></a>

## Including Aliases in Advanced Assigned Expressions

<a id="wwID0EM4CS"></a>

Aliases can be referenced in expressions by their name or number, depending on the user configuration. You can assign advanced expressions with aliases to parts and part usage links.

<a id="wwID0EV4CS"></a>

## Including Aliases in Conditional Rules

<a id="wwID0EZ4CS"></a>

You can include aliases in the logical expressions in the IF part of a conditional rule. Aliases can be referenced by the name or number, depending on the user configuration. Your configuration specification determines the version of the alias to be included in the rule.

<a id="wwID0EC5CS"></a>

## Filtering Configurable Products with Aliases

<a id="wwID0EG5CS"></a>

When you are filtering a product structure using the Option filter, the filtering logic evaluates the assigned advanced expressions and compares them with the selection criteria. The system evaluates the alias first, and then evaluates the rest of the expression.

<a id="wwID0EK5CS"></a>

Conditional rules that are set up for defining the filtering criteria can also include aliases in its expressions. These aliases are evaluated as part of the logic of the IF statement of the conditional rule.

<a id="wwID0ET5CS"></a>

## Importing and Exporting Aliases

<a id="wwID0EX5CS"></a>

You can import and export aliases, conditional rules with aliases, and part structures with advanced expressions that contain aliases.

<a id="wwID0EA6CS"></a>

## ESI Downstream Publishing

<a id="wwID0EE6CS"></a>

You can publish aliases, conditional rules with aliases, and part structures with advanced expressions that contain aliases to the ESI system.
