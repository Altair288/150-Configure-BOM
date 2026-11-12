# Where Used Information for a Choice

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsWhereAssigned.html)  
> 获取日期：2026-11-12

<a id="wwID0ELQ4Q"></a>

<a id="wwID0E2Q4Q"></a>

You can view the objects to which a choice is assigned on the **Where Used** tab.

<a id="wwID0EYR4Q"></a>

1. Select a choice from a tree view in the left pane of the **Option Pool** tab or from the **Structure** tab of the option set information page.

<a id="wwID0ECT4Q"></a>

2. Select the **Where Used** tab in the right pane. The following information is available under the **Where Used** tab:

<a id="wwID0EPU4Q"></a>

- The **Assigned to Following Objects** table shows all items where the choice is used in an expression. The table includes all parent/child items with the usage links that have assigned expressions that use the selected choice.

<a id="wwID0EWV4Q"></a>

- If a choice is used in a conditional rule in the If or Then statement, then it is listed in the **Used in the Following Option Sets** table.

<a id="wwID0E3W4Q"></a>

- The **Assigned to Following Objects** table shows parts, part usages, and CAD documents to which the choice is assigned. You can filter the table and choose the types of objects you want to see in the table. The default is set to **All**.

|  |  |
| --- | --- |
| **![\*](../../../../../../images/6652ad397dd1_note_16x16.png)** | When viewing the Where Used information for an option set, the table shows the objects that use that option set. |

<a id="wwID0EAZ4Q"></a>

- If a choice is included in options sets, the options sets that use this choice are listed in the **Used in the Following Option Sets** table.

<a id="wwID0EG14Q"></a>

- If a choice is included in choice rules, the rules that reference this choice are listed in the **Used in the Following Choice Rules** table. The table lists the rule number, the rule type, the option pool in which the rule is defined, and the rule definition.
