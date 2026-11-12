# Independent Assigned Expressions

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsIndepExpressions.html)  
> 获取日期：2026-11-12

<a id="wwID0EIWYR"></a>

> ![\*](../../../../images/6652ad397dd1_note_16x16.png) **Note:** Ability to create and manage independent assigned expressions is an advanced capability subject to a separate license entitlement.

<a id="wwID0ETXYR"></a>

Companies can configure assigned expressions to be iterated and revised independently from the object they are assigned to. Such expressions are referred to as independent expressions. Creating or editing an independent assigned expression does not change the iteration of the configurable module to which it is assigned. Similarly, when you modify a configurable module, the independent assigned expression associated with that module is not iterated.

<a id="wwID0EYXYR"></a>

![](../../../../images/5ccf469e7feb_IndepExpressions.png)

<a id="wwID0EGYYR"></a>

Independent expressions can be assigned to parts, part usage links, and occurrences.

> ![\*](../../../../images/6652ad397dd1_note_16x16.png) **Note:** When you revise a part to which an independent expression is assigned, the part maintains the reference to the master of the independent expression object. When you create a copy of the part with using Save As, the copy uses the latest checked in version of the independent expression.

<a id="wwID0EGZYR"></a>

To create independent expressions, you use the same user interface as for assigning dependent expressions. You can get information about the change history, effectivity, and where used information from the information page of the independent expression.

<a id="wwID0ELZYR"></a>

To assign independent expressions, you need proper access control:

<a id="wwID0EE1YR"></a>

- Create and edit access for the Independent Assigned Expression object in the default domain

<a id="wwID0EG2YR"></a>

- Modify access to the system cabinet

<a id="wwID0EZ2YR"></a>

Consider this information about independent expressions:

<a id="wwID0ES3YR"></a>

- You can submit independent expressions to change and promotion processes.

<a id="wwID0EU4YR"></a>

- Independents expressions have their own lifecycle states and effectivity.

<a id="wwID0EW5YR"></a>

- A configuration specification determines the version of the assigned independent expressions to be used for filtering a configurable structure.

<a id="wwID0EY6YR"></a>

- Assigning an independent expression to a part (or any of its usage links and occurrences) does not require the part to be checked out.

<a id="wwID0E1AZR"></a>

- Replacing a child part that has an independent expression assigned to its usage links preserves that assigned expression.

<a id="wwID0E3BZR"></a>

- When filtering a configurable product structure, you can set the configuration specification for the Option filter to determine the version of the independent expressions to evaluate and compare with the filtering criteria.

<a id="wwID0E5CZR"></a>

- When creating a copy of the part, independent expressions are also copied.

<a id="wwID0EVDZR"></a>

## Enabling Independent Expressions

<a id="wwID0EZDZR"></a>

To enable independent expressions, a site administrator must run the command-line utility:

<a id="wwID0E4DZR"></a>

windchill com.ptc.windchill.option.tools.ConvertToIndependentExpression

<a id="wwID0ECEZR"></a>

After this utility is run, all new expressions are created as independent expressions.

<a id="wwID0ELEZR"></a>

## Assigning and Editing Independent Expressions

<a id="wwID0EPEZR"></a>

When creating independent expressions, you can enter the name of the expression. Other steps for creating and editing independent expressions are the same as for dependent expressions.

> ![\*](../../../../images/6652ad397dd1_note_16x16.png) **Note:** Administrators can make the Name attribute a required attribute by modifying constraints for the Name attribute of the Independent Assigned Expression objects using the **Type and Attribute Management** utility.

<a id="wwID0EZFZR"></a>

## Viewing Independent Expressions

<a id="wwID0E4FZR"></a>

To view the information page for the independent expressions assigned to parts and part usage links, go to the part **Structure** tab, right-click a configurable module, and select **View Assigned Expression**. The system opens the information page of the latest iteration of the latest revision of the independent expression that is assigned to the item or usage link.

> ![\*](../../../../images/6652ad397dd1_note_16x16.png) **Note:** This action is also available from the folder browser page and from the search results page.

<a id="wwID0EVFZR-3"></a>

![](../../../../images/3edf6b84cdec_VIewAssignedExpress.png)![](../../../../images/7a0c52b98a58_VIewAssignedExpress2.png)

<a id="wwID0ESHZR"></a>

From the **Actions** menu on the information page, you can set the state, copy, edit, or revise the independent expression.

<a id="wwID0EAIZR"></a>

## Revising Independent Expression

<a id="wwID0EEIZR"></a>

Independent expressions can be revised as other Windchill objects. The **Revise** action is available from the **Actions** menu on the expression information page, and from the **Affected Object** table on the change task.

<a id="wwID0E1IZR"></a>

## Deleting Independent Expressions

<a id="wwID0E5IZR"></a>

Use **Delete** from the information page of an independent expression to delete the latest revision of the expression, including all of it iterations within the selected revision (for example, C.1, C.2, C.3). When you delete a revision, previous revisions remain intact. For example, if you delete the C revision, the expression goes back to the latest iteration of the previous revision (for example, B.3).

<a id="wwID0EHJZR"></a>

This action is available only if the expression has more than one revision. At least one version of the independent expression must remain if it is referenced by an item, a usage link, or an occurrence. The expression can only be deleted completely if the object that references it is deleted.

> ![\*](../../../../images/6652ad397dd1_note_16x16.png) **Note:** The **Delete** action is available only to the Option Managers who are members of the Platform Structures license group.
