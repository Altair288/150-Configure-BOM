# Managing Local Rule Changes for the Option Set

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsMangocalRuleChangesForTheOptionSet.html)  
> 获取日期：2026-11-12

<a id="wwID0EYEJR"></a>

<a id="wwID0EJFJR"></a>

There are two scenarios for managing changes to the local rules within the option set:

<a id="wwID0ECGJR"></a>

- If the option set is defined with the **Manage Local Rule Changes Independently from the Option Set** attribute set to **No**, local rules are iterated but they cannot be revised. When a local rule is edited, both the local rule and the option set are iterated. In addition, removing a rule iterates the option set.

<a id="wwID0E3GJR"></a>

- If the option set is defined with the **Manage Local Rule Changes Independently from the Option Set** attribute set to **Yes**, local rules are managed independently of the option set revisions. If a rule is edited, it is iterated without changing the iteration of the option set. You can also revise local rules independently of the option set. Removing a rule iterates the option set.

|  |  |
| --- | --- |
| **![\*](../../../../../images/6652ad397dd1_note_16x16.png)** | Ability to revise local rules and manage them independently is an advanced capability subject to a separate license entitlement. |
