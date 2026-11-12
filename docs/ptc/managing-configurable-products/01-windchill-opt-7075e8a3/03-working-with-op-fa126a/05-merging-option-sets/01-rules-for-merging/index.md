# Rules for Merging

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsMergeRules.html)  
> 获取日期：2026-11-12

<a id="wwID0ETOTR"></a>

<a id="wwID0EDPTR"></a>

An option belongs to an option set if one or more of its choices are members of that option set. You can merge the choices for options that belong to a lower-level option set but not the choices for options that belong to a top-level option set. Choices are merged and ordered according to the following rules:

<a id="wwID0E3PTR"></a>

- If an option does not belong to the top-level option set, but it belongs to a single lower-level option set, all the choices for that option that are members of the lower-level option set are merged with the top-level option set. While merging, the order defined in the lower-level option set is retained for the choices and options. Options from the lower-level option set are placed after options from the top-level option set.

<a id="wwID0E5QTR"></a>

- If an option does not belong to the top-level option set, but it belongs to multiple lower-level option sets, the choices for that option that are common members of the lower-level option sets are merged with the top-level option set. While merging, the order defined in the lower-level option set is retained for the choices and options. Options from the lower-level option sets are placed after options from the top-level option set.

<a id="wwID0EBSTR"></a>

- If date effectivity is enabled for a merged choice that is used in more than one of the option sets that were merged:

<a id="wwID0EGTTR"></a>

- The start date is set to the earliest date assigned to the choice in any of the originating option sets.

<a id="wwID0EIUTR"></a>

- The end date is set to the latest date assigned to the choice in any of the originating option sets.

<a id="wwID0E3UTR"></a>

The following table illustrates how these rules are applied.

| Option | Top-level Option Set | Lower-level Option Set 1 | Lower-level Option Set 2 | Merged Top-level Option Set |
| --- | --- | --- | --- | --- |
| Option A | Choice A1 Choice A2 Choice A3 | - - - | - - - | Choice A1 Choice A2 Choice A3 |
| Option B | Choice B1 - - Choice B4 | Choice B1 Choice B2 - Choice B4 | Choice B1 - Choice B3 - | Choice B1 - - Choice B4 |
| Option C | - - - | - - - | Choice C1 Choice C2 Choice C3 | Choice C1 Choice C2 Choice C3 |
| Option D | - - - | Choice D1: 2016-09-01 2016-12-31 Choice D2 - | Choice D1: 2016-10-01 2017-01-31 - Choice D3 | Choice D1: 2016-09-01 2017-01-31 - - |

<a id="wwID0EREUR"></a>

If a choice, belonging to a lower-level option set, is a part of the THEN statement of a rule but not a part of the merged option set, the rule executes but the choice is not displayed. If that choice is further used in the IF statement of a dependant rule, that rule also executes.

<a id="wwID0EWEUR"></a>

The following table describes the condition using an example wherein English is the choice missing in the merged option set.

| Rule Definition | Rule Execution |
| --- | --- |
| Country (single select) = Canada –> Language (single select) = English | If you select Canada, English is selected by default but not displayed. German and Spanish are displayed but disabled. |
| Language (single select) = English –> Color (multi select) = Blue | As English is the default selection, Blue is selected but disabled. Green and Red are available for selection. |
