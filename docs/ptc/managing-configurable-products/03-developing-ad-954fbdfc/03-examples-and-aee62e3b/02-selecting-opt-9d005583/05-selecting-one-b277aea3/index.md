# Selecting One Option from a Set of Several Options

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/WCOVSelOneOptFrmKnownOpts.html)  
> 获取日期：2026-11-12

<a id="wwID0ELUKT"></a>

<a id="wwID0E2UKT"></a>

You may want to select a single option from a set of several possible options based on the user’s response. However, there may be so many options that a single case table with a column allocated for each option may be difficult to organize or maintain.

<a id="wwID0EAVKT"></a>

For example, a wooden table top might be available in a very large number of materials and finishes, such as Oak Veneer, Solid Oak, Solid Oak with Maple Trim, Maple Veneer, Solid Maple, Solid Maple with Oak Trim, Cherry Veneer, Solid Cherry, and Solid Cherry with Maple Trim.

<a id="wwID0EFVKT"></a>

To make this information more manageable, you can introduce an intermediary parameter to connect the case table with the boolean parameters that determine which optional subassembly should be included. With this approach, the user’s request is captured in an input parameter that is evaluated by a case table of valid options. The results, or output, of the case table is captured in a single parameter. Finally, the value for each boolean is determined by evaluating this intermediary parameter.

<a id="wwID0EKVKT"></a>

To select one option from a set of several options:

<a id="wwID0EDWKT"></a>

1. Create a configurable module.

<a id="wwID0EFXKT"></a>

2. Attach a child part for each of the relevant finishing options.

<a id="wwID0EHYKT"></a>

3. Add a string input parameter to the configurable module; for example, askFinish.

<a id="wwID0EQZKT"></a>

- Define an appropriate prompt value for the string parameter.

<a id="wwID0ES1KT"></a>

- Define a List Constraints for the string parameter with these values:

<a id="wwID0EX2KT"></a>

- Oak Veneer

<a id="wwID0EZ3KT"></a>

- Solid Oak

<a id="wwID0E24KT"></a>

- Solid Oak with Maple Trim

<a id="wwID0E65KT"></a>

4. Define a string non-input parameter that is used to match the user’s response to the correct subassembly; for example, pickFinish. This parameter operates as an intermediary between the case table and the boolean parameters.

<a id="wwID0EFALT"></a>

5. Add a boolean non-input parameter to the configurable module for each of the relevant options. For example:

<a id="wwID0EKBLT"></a>

- useOakVeneer — to represent the usage of the oak veneer material

<a id="wwID0EPCLT"></a>

- useSolidOak — to represent the usage of the solid oak material

<a id="wwID0EUDLT"></a>

- useSolidOakMaple — to represent the usage of the solid oak with maple trim material

<a id="wwID0E1ELT"></a>

6. Add a default expression to each boolean parameter that evaluates the intermediary parameter. For example:

<a id="wwID0E6FLT"></a>

- pickFinish.equals(“OakVeneer”) — for the oak veneer boolean

<a id="wwID0EEHLT"></a>

- pickFinish.equals(“SolidOak”) — for the solid oak boolean

<a id="wwID0EJILT"></a>

- pickFinish.equals(“SolidOakMaple”) — for the solid oak with maple trim boolean

<a id="wwID0EPJLT"></a>

7. Add the boolean parameter to the **Inclusion Option** of this configurable module for the relevant child part for each option, as follows:

<a id="wwID0EYKLT"></a>

- useOakVeneer — for the oak veneer finish subassembly

<a id="wwID0E4LLT"></a>

- useSolidOak — for the solid oak finish subassembly

<a id="wwID0ECNLT"></a>

- useSolidOakMaple — for the solid oak with maple trim finish subassembly

<a id="wwID0EIOLT"></a>

8. Establish a case table constraint to map the user’s responses to the correct value of the intermediary parameter. For example, consider the case table constraint pickFinish.

| askFinish | pickFinish |
| --- | --- |
| Oak Veneer | Oak Veneer |
| Solid Oak | Solid Oak |
| Solid Oak with Maple Trim | SolidOakMaple |
| Maple Veneer | Maple Veneer |
| Solid Maple | Solid Maple |
| Solid Maple with Oak Trim | SolidMapleOak |

|  |  |
| --- | --- |
| **![\*](../../../../../images/6652ad397dd1_note_16x16.png)** | For this approach to work properly, all values in the pickFinish column of the case table must be unique. |

<a id="wwID0EYVLT"></a>

1. In this approach, after the user selects a particular value, such as Oak Veneer, the case table assigns the value OakVeneer to the parameter pickFinish. The boolean parameter useOakVeneer evaluates its default expression \{pickFinish.equals(“OakVeneer”)\} as true and the subassembly for the oak veneer is included in the variant product structure.
