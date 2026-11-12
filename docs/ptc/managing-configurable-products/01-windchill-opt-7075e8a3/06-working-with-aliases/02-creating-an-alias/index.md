# Creating an Alias

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OPtionsCreatingAliases.html)  
> 获取日期：2026-11-12

<a id="wwID0EBMDS"></a>

<a id="wwID0ERMDS"></a>

Aliases are defined within an option pool. Aliases are referenced in expressions by the name or number. Consider these guidelines for creating aliases:

<a id="wwID0EKNDS"></a>

- An expression that defines an alias can include textual and numeric choices, and other aliases.

<a id="wwID0EMODS"></a>

- An alias can include AND, OR, and NOT logical operators.

<a id="wwID0E1PDS"></a>

- Choices used in aliases can be referenced by their names or numbers.

<a id="wwID0ENQDS"></a>

To create an alias:

<a id="wwID0EGRDS"></a>

1. Go to the **Option Pool** tab of the product or library.

<a id="wwID0EMSDS"></a>

2. Click the top-level node in the option pool tree.

<a id="wwID0EOTDS"></a>

3. Click the **Expression Aliases** tab.

<a id="wwID0EUUDS"></a>

4. Click the ![](../../../../images/7de5dd6bf026_IconAliasExpressionCreate.png) and enter the name and description for the alias. For example, you can enter EuropeanCountry. Click **Next**.

<a id="wwID0EGWDS"></a>

5. In the **Expression** box, enter the definition for the alias by referencing the choices defined in the option pool. For example, you can enter Germany/France/UK/Italy for the expression, where Germany, France, UK, Italy are the choices defined for the option Country.

<a id="wwID0EYXDS"></a>

6. Provide a description for the expression.

<a id="wwID0E1YDS"></a>

7. You can validate the choices referenced in the expression by clicking **Validate**. The standard validation checks for syntax errors and checks if the choices referenced in the alias exist.

|  |  |
| --- | --- |
| **![\*](../../../../images/6652ad397dd1_note_16x16.png)** | If you have implemented a site-specific validation, clicking **Validate** performs standard and site-specific validation. |

<a id="wwID0E61DS"></a>

8. Click **Finish** to create the alias. The alias is added to the **Expression Aliases** table.
