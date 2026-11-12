# Options and Choices with Numeric Values

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsNumericOptionsChoices.html)  
> 获取日期：2026-11-12

<a id="wwID0EU2VQ"></a>

<a id="wwID0EF3VQ"></a>

Options and choices with numeric values enable you to add numeric values to expressions to improve the efficiency of maintaining rules, assigned expressions, and aliases.

> ![\*](../../../../../../images/6652ad397dd1_note_16x16.png) **Note:** Actions to create, edit, or delete options and choices with numeric values are advanced capabilities subject to a separate license entitlement.

<a id="wwID0EK4VQ"></a>

## Options with Numeric Values

<a id="wwID0EO4VQ"></a>

Options with numeric values expand the choice behavior to allow you to enter the value that can be used in choice rules and assignments. For example, the option Wheel\_Base can have choices: 18 inch, 20 inch, 2 inch, 26 inch, 28 inch, 3 inch, 32 inch. For options without numeric values, a rule to consider all choices less than 26 inches can be as follows: Wheel\_Base=18inch/20inch/24inch. If a new Wheel\_Base choice of 19 inch were added to the option, some rules would need to be updated to include 19 inch.

<a id="wwID0EX4VQ"></a>

Instead, using options with numeric values, you can create and maintain rules more efficiently by defining a numeric value for the choices. For example, for options with numeric values, the same Wheel\_Base rule is Wheel\_Base < 26 inch. Additionally, if a 19 inch wheel choice is added in the future, this Wheel\_Base rule does not need to be modified.

<a id="wwID0E24VQ"></a>

Consider this information about options with numeric values:

<a id="wwID0ET5VQ"></a>

- An option with numeric values has an additional required attribute, **Quantity of Measure**. For example: length, mass, and so on.

<a id="wwID0EZ6VQ"></a>

- An option with numeric values is always **Single Selection**.

<a id="wwID0E6AWQ"></a>

- Choices for options with numeric values have an additional attribute Value.

<a id="wwID0ERBWQ"></a>

Options with numeric values are identified by the ![](../../../../../../images/3d146c96dd75_IconOptionNumeric.png) icon, and their choices by the ![](../../../../../../images/2af01d766830_IconChoiceNumeric.png) icon.

<a id="wwID0EJCWQ"></a>

## Choices with Values

<a id="wwID0ENCWQ"></a>

Consider this information for choices of an option with numeric values:

<a id="wwID0EFDWQ"></a>

- A choice of an option with numeric values has the same attributes as a textual choice, plus an additional required attribute, **Value**.

<a id="wwID0ELEWQ"></a>

- A choice value can be expressed as an integer or a real number. For example, 1 or 1.1.

<a id="wwID0ENFWQ"></a>

- All choices have the same unit of measure as the option they belong to.

<a id="wwID0EEGWQ"></a>

## Updating Options and Choices Using Windchill Load Files

<a id="wwID0EIGWQ"></a>

You can use the Windchill loader to convert existing options and choices from string-based to those with numeric values. Using a loader, you can specify attributes that you want to define or change, including the Data Type and Value for options and choices with numeric values.

|  |  |
| --- | --- |
| **![\*](../../../../../../images/887c9a51d571_tip_16x16.png)** | You can also use this method to correct errors in the existing options and choices. |

<a id="wwID0EHHWQ"></a>

For details, see [Using Load Files to Update Options and Choices](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/WCDataLoadGuide/WCDataLoad_OptionsLoadFilesToUpdateOptionsAndChoices.html).
