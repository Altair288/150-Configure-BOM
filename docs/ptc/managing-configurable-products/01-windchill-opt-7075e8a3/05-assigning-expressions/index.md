# Assigning Expressions

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsListBasedFiltering.html)  
> 获取日期：2026-11-12

<a id="wwID0EE4XR"></a>

<a id="wwID0EV4XR"></a>

To specify the conditions that determine whether an interchangeable or optional component is included in the product structure, you can assign expressions to a configurable module, to a part usage or to its occurrence in the product structure. The assigned expressions can be matched with the filtering criteria selected in the Option filter to produce a desired configuration of the product structure by excluding or including module variants. For more information on the Option Filter, see [Filtering a Configurable Product Structure](../07-filtering-a-c-73998438/index.md#wwID0ESRFS "Filtering a Configurable Product Structure with the Option Filter").

<a id="wwID0EF5XR"></a>

The choices used in expressions are contained in the assigned option set. The assigned option set must be present to support expression assignment and filtering. For more information on option sets, see [Working with Option Sets](../03-working-with-op-fa126a/index.md#wwID0ECFHR "Working with Option Sets").

<a id="wwID0EW5XR"></a>

Consider the following information about assigning expressions:

<a id="wwID0EP6XR"></a>

- Expressions are used to restrict the inclusion of a part to certain conditions. If a part is always included, no assignment is necessary.

<a id="wwID0ERAYR"></a>

- An expression can be assigned to a configurable module used within a configurable product structure. This enables you to include or exclude multiple parts that only apply under certain conditions.

<a id="wwID0EEBYR"></a>

You can set a preference, **Show Assigned Expressions on the Attributes Tab**, to view assigned expressions (item, usage, or occurrence expressions) on the **Attributes** tab of the part **Structure** tab. By default, the preference is set to false.

<a id="wwID0EWBYR"></a>

Assigned expressions are exported and imported when a part structure is exported or imported.
