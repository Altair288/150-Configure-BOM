# Assigning Expressions to Uses Occurrences

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionAssignExpressToOccurrences.html)  
> 获取日期：2026-11-12

<a id="wwID0E2L3R"></a>

<a id="wwID0EMM3R"></a>

Part occurrences can be used to control the positioning of certain parts in the product assembly. For example, for one product variant, a pump module must be located at the top of the assembly, while for another product variant the pump module must be located at the bottom of the assembly. An overloaded product structure can contain multiple occurrences of the part that can be included in the variant if certain conditions are met. If an expression is assigned to an occurrence, the Option filter evaluates it based on the specified filtering criteria, and as result includes or excludes the part.

<a id="wwID0ERM3R"></a>

You can assign basic and advanced expressions to uses occurrences. You can assign an expression to an occurrence only if the parent part has the assigned option set and the part usage has a unit value of “each”.

<a id="wwID0EWM3R"></a>

When a CAD structure is generated from the part structure, information on the expressions assigned to part occurrences is transferred to the associated CAD structures.

<a id="wwID0E2M3R"></a>

The next figure shows an occurrence table with assigned expressions.

<a id="wwID0EAN3R"></a>

![](../../../../images/a7fd07b6dfb7_OccurrenceTable.png)

<a id="wwID0EPN3R"></a>

Expressions assigned to occurrences are iterated and can be revised and behave similar to expressions assigned to usage links.

<a id="wwID0EYN3R"></a>

## Assigning Basic or Advanced Expressions to Part Occurrences

<a id="wwID0E3N3R"></a>

To assign expressions to occurrences, the following must be true:

<a id="wwID0EVO3R"></a>

- The parent part is a configurable part.

<a id="wwID0EXP3R"></a>

- The user is a member of the Platform Structures license group.

<a id="wwID0EZQ3R"></a>

- The parent part has an option set assigned.

<a id="wwID0ELR3R"></a>

To assign an expression to an occurrence:

<a id="wwID0EDS3R"></a>

1. Go to the **Structure** tab of a configurable module.

<a id="wwID0EJT3R"></a>

2. In the tree structure, click a configurable module whose occurrences you want to view.

<a id="wwID0ELU3R"></a>

3. Click the **Occurrences** tab in the right pane.

<a id="wwID0ERV3R"></a>

4. In the **Occurrences** table, right-click an occurrence of a part usage with the unit value of “each” to which you want to assign an expression, and then click **Assign Expression**.

<a id="wwID0E2W3R"></a>

5. Assign an expression as you would for usage links and parts.

<a id="wwID0ENX3R"></a>

![](../../../../images/863ba36ed199_AssignExpOccurence.png)

<a id="wwID0E2X3R"></a>

You can add the **Assigned Occurrence Expressions**, **Assigned Usage Expressions**, and **Assigned Item Expressions** columns to the table by managing the table views to view the assigned expressions in the **Occurrences** table.
