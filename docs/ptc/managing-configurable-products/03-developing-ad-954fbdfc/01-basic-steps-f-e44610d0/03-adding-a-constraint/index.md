# Adding a Constraint

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/ExpConstraintAdd.html)  
> 获取日期：2026-11-12

<a id="wwID0E4NCT"></a>

<a id="wwID0EROCT"></a>

Adding a constraint allows you to specify a condition for a configurable module. A constraint can be simple, consisting of only one part, or can be more complex, consisting of multiple parts.

<a id="wwID0EVOCT"></a>

To add a constraint:

<a id="wwID0E5OCT"></a>

1. In the Part Structure Browser, select the configurable module for which you want to add a constraint.

<a id="wwID0EPPCT"></a>

2. Click the **Constraints** tab.

<a id="wwID0EEQCT"></a>

3. From the tool bar, select Actions > New, and select any of the following constraint types:

<a id="wwID0EYRCT"></a>

- **Case Table**

<a id="wwID0E3SCT"></a>

- **Expression**

<a id="wwID0EAUCT"></a>

- **External Application**

<a id="wwID0EEQCT-5"></a>

1. Or you can click the corresponding icons on the tool bar.

<a id="wwID0EGVCT"></a>

4. Define the constraint in the corresponding window. Specify the name and description for the selected constraint type.

<a id="wwID0EYVCT"></a>

5. (Optional) Enter any identifying alert text. The **Alert** shows this message if the constraint is violated. A violation of the constraint produces an automatically generated message, which lists the expression that defines the constraint when no alert is specified. For an **Expression** constraint type, the expression can be entered directly in the **Expression** field or by using the selections available in the **Expression Editor** to form the expression.

|  |  |
| --- | --- |
| **![\*](../../../../images/887c9a51d571_tip_16x16.png)** | You can also add constraints within the same configurable module using copy and paste. This functionality is not available for copying constraints from one configurable module to another. |

<a id="wwID0EQXCT"></a>

For the **Case Table** constraint type, select the parameters to be used in the case table. For more information, see [Selecting Case Table Parameters](01-case-table-editor/03-selecting-cas-7943f856/index.md#wwID0EEEET "Selecting Case Table Parameters").
