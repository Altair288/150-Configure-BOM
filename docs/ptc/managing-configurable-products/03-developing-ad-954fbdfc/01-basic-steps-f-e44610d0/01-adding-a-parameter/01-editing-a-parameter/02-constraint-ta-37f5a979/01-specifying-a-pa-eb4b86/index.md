# Specifying a Parameter Range

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/ExpParameterRangeSpecify.html)  
> 获取日期：2026-11-12

<a id="wwID0EZH6S"></a>

<a id="wwID0ENI6S"></a>

When you add or edit a parameter, you can specify a range of possible values for the parameter. A range allows you to ensure that the parameter value falls within a specific range of values. Within this range there is a defined minimum and maximum value.

<a id="wwID0ERI6S"></a>

To specify a range for a parameter:

<a id="wwID0EJJ6S"></a>

1. Open a configurable module in the Part Structure Browser, and select the **Parameters** tab.

<a id="wwID0EPK6S"></a>

2. If you are defining a new parameter, click the new parameter icon ![](../../../../../../../images/0c9813ba64b2_Exp_IconAddParameter.gif). If you are editing an existing parameter, select that parameter in the table and then click the edit parameter icon ![](../../../../../../../images/9dbb36b32ff3_IconEdit.gif).

<a id="wwID0ECM6S"></a>

3. From the **Edit Parameter** window, click the **Constraint** tab.

<a id="wwID0EMN6S"></a>

4. From the **Constraint** tab, select **Range**. The window is refreshed to show a minimum and maximum value.

<a id="wwID0EWO6S"></a>

5. Enter the minimum or maximum value for the range.

<a id="wwID0EYP6S"></a>

6. Click **Finish**.

<a id="wwID0EOQ6S"></a>

As an alternative to specifying a value, parameters of type Integer and Real Number allow specifying a range for the parameter value in the case table:

> ![\*](../../../../../../../images/6652ad397dd1_note_16x16.png) **Note:** **Specify Range** is available in the case table only when the **Enable Advanced Case Tables** preference is disabled.For information about specifying a parameter range when this preference is enabled, see [Editing a Case Table Parameter](../../../../03-adding-a-constraint/01-case-table-editor/01-editing-a-cas-3b3804f7/index.md#wwID0ELNDT "Editing a Case Table Parameter").

<a id="wwID0E1S6S"></a>

1. Specify the parameter value that must be greater than or equal to a specific minimum value, or has no minimum value.

<a id="wwID0E3T6S"></a>

2. Specify the parameter value that must be less than or equal to a specific maximum value, or has no maximum value.

<a id="wwID0E5U6S"></a>

3. Optionally indicate when the value is valid for a specific step value.

<a id="wwID0EAW6S"></a>

4. Click **OK**.

<a id="wwID0EWW6S"></a>

Specifying parameter range applies only a specific case table parameter value. The parameter constraint applies to the parameter itself. For more details about specifying the parameter constraints, see [Constraint Tab of the Edit Parameter Window](../index.md#wwID0EOR5S "Constraint Tab of the Edit Parameter Window").
