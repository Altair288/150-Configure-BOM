# Previewing an Option Set

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsSetPreview.html)  
> 获取日期：2026-11-12

<a id="wwID0EA6MR"></a>

<a id="wwID0EQ6MR"></a>

After you added choices to the option set, you can preview the option set to verify its content and to test choice rules during the choice selection.

<a id="wwID0EJANR"></a>

1. Go to the information page of the option set and click the **Structure** tab.

<a id="wwID0EPBNR"></a>

2. Click the toolbar action ![](../../../../../../images/9fc678ff8f12_IconPreview.gif).

<a id="wwID0EZCNR"></a>

3. The **Preview** window opens. Before previewing the option set, you can specify the configuration specification for choice rules by clicking the ![](../../../../../../images/06eb2f327a1d_IconConfigSpecEdit.png) icon at the top-right corner of the window. Specify the configuration specification criteria in the **Set Configuration Specifications for Option Filter** window.

|  |  |
| --- | --- |
| **![\*](../../../../../../images/6652ad397dd1_note_16x16.png)** | Ability to set the configuration specification for the option filter is an advanced capability subject to a separate license entitlement. For details, see [Specifying the Configuration Specification for the Option Filter](../../../../07-filtering-a-c-73998438/01-specifying-th-527f51f6/01-specifying-th-49668ccf/index.md#wwID0E6MHS "Specifying the Configuration Specification for the Option Filter"). |

<a id="wwID0EPFNR"></a>

4. Select the **Design Option** or **Sales Option** tab to review the selections.

<a id="wwID0EZGNR"></a>

5. The **Design Option** or the **Sales Option** tab lists the options and choices included in the option set. To validate the rules that govern the relationship among the choices, start selecting choices. To select choices, click the option for which you want to make selections, and the choices available for this option appear in the right pane of the window. If you want to test the choices without using the rules, you can disable rule checking by selecting **Disable Rule Checking**.

<a id="wwID0EHINR"></a>

6. If the option set supports the assignment of exclude choices, you can select the exclude choices in the Exclude column.

|  |  |
| --- | --- |
| **![\*](../../../../../../images/6652ad397dd1_note_16x16.png)** | Either all or none of the choices from the same option can be set as exclude choices. Designating one choice as an exclude choice selects all other choices from the same option to be used as exclude choices. |

<a id="wwID0EDKNR"></a>

7. When finished previewing the option set, click **Close**.

<a id="wwID0EALNR"></a>

## Effect of Choice Selection and Rules Causing Choices to be Enabled, Disabled, or Unselected

<a id="wwID0EELNR"></a>

When you select a choice that triggers a rule or has an effectivity date specified, this can result in disabling or unselecting previously selected choices. When such conflict is detected, the system issues an error message.

<a id="wwID0EILNR"></a>

Selecting a choice can also trigger a rule that enables the choices that were previously disabled.

<a id="wwID0EMLNR"></a>

To determine whether a choice should be reselected automatically once it is enabled, the system evaluates all factors that have effect on the choice selection. Based on that evaluation, the system adds or removes a checkmark next to the choice. Some of the deciding factors are:

<a id="wwID0EEMNR"></a>

- Is the choice controlled by a rule, and the source choice of that rule is selected?

<a id="wwID0EGNNR"></a>

- Is the choice enabled or disabled by an effectivity date?

<a id="wwID0EIONR"></a>

- Is the choice enabled or disabled by a rule, but is turned on/off by an effectivity date?
