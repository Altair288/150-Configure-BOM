# Using Actions in the Conditional Rule

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsRequriesAction.html)  
> 获取日期：2026-11-12

<a id="wwID0EQGBR"></a>

<a id="wwID0EEHBR"></a>

## Specifying the Actions for the Rule

<a id="wwID0EIHBR"></a>

When creating a conditional rule, you can specify the following actions for the **Then** section of the conditional rule:

<a id="wwID0EFIBR"></a>

- **Include** – If the expressions in the **If** section are evaluated to TRUE, then include the choices listed in the **Then** section.

<a id="wwID0ESJBR"></a>

- **Disable** – If the expressions in the **If** section are evaluated to TRUE, then disable the choices listed in the **Then** section.

<a id="wwID0E6KBR"></a>

- **Enable** – If the expressions in the **If** section are evaluated to TRUE, then enable the choices listed in the **Then** section.

<a id="wwID0EMMBR"></a>

- **Requires** – If the expressions in the **If** section are evaluated to TRUE, then you must select at least one of the choices in the **Then** section.

<a id="wwID0EZNBR"></a>

- **Requires Single Select** – If the expressions in the **If** section are evaluated to TRUE, then you must select only one choice in the **Then** section.

|  |  |
| --- | --- |
| **![\*](../../../../../../../images/6652ad397dd1_note_16x16.png)** | The **Requires Single Select** conditional rule is another form of **Requires** rule, with the only difference to select only one choice from the group instead of requiring all choices. |

<a id="wwID0E5PBR"></a>

## Using the Requires Action

<a id="wwID0ECQBR"></a>

The **Requires** action stipulates that when the **If** section of the conditional rule evaluates to TRUE, then at least one choice listed in the **Then** section of the rule must be selected. If the system determines that only one choice from the list is eligible for selection, that choice is selected automatically to satisfy the **Requires** action.

<a id="wwID0EXQBR"></a>

If the **Validate for Required Choices** preference is set to **Yes**, the system validates that the **Required** options, **Requires** conditional rules, and **Requires Single Select** conditional rules must be applied when specifying filtering criteria in the **Option Filter** window. In this case, at least one choice must be selected when using the **Requires** action, and only one choice must be selected when using the **Requires Single Select** action. If the **Requires** or **Requires Single Select** action is not satisfied, an error message appears.

<a id="wwID0EESBR"></a>

This preference does not affect the validation of **Configure** and **Reconfigure** actions when defining option filter, as for these actions, the **Required** options and conditional rules are always enforced.

<a id="wwID0E1SBR"></a>

## Considerations for the **Then** Section of the Conditional Rule

<a id="wwID0EDTBR"></a>

Consider the following information about the **Then** section of conditional rules:

<a id="wwID0EAUBR"></a>

- The various actions for a conditional rule are treated as if they are they are combined using “AND”.

<a id="wwID0ECVBR"></a>

- The various choices for the **Include** action of a conditional rule are treated as if they are combined using “AND”

<a id="wwID0EIWBR"></a>

- The various choices for the **Enable** action of a conditional rule are treated as if they are combined using “AND”.

<a id="wwID0EOXBR"></a>

- The various choices for the **Disable** action of a conditional rule are treated as if they are combined using “AND”.

<a id="wwID0EUYBR"></a>

- The various choices for the **Requires** action of a conditional rule are treated as if they are separated by “OR”.

<a id="wwID0E1ZBR"></a>

- The various choices for the **Requires Single Select** action of a conditional rule are treated as if they are separated by “OR”.

> ![\*](../../../../../../../images/6652ad397dd1_note_16x16.png) **Note:** If you specify multiple actions of the same kind (for example, several outcomes using the **Requires** action), these actions are not combined and they appear separately in the THEN section of the rule. This behavior applies to all actions.
