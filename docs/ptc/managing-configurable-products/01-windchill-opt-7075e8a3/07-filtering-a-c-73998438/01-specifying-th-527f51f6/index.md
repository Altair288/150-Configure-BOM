# Specifying the Filtering Criteria for the Option Filter

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsFilteringSpecify.html)  
> 获取日期：2026-11-12

<a id="wwID0EY4FS"></a>

<a id="wwID0EI5FS"></a>

To specify filtering criteria and to apply them to the product structure:

<a id="wwID0EB6FS"></a>

1. Go to the **Structure** page for the top-level part of the structure that you want to filter.

<a id="wwID0EHAGS"></a>

2. Click **Edit Filter** from the toolbar.

<a id="wwID0ENBGS"></a>

3. In the **Edit Filter** window, click the **Option Filter** tab.

|  |  |
| --- | --- |
| **![\*](../../../../images/887c9a51d571_tip_16x16.png)** | The assigned option set is listed at the top of the window under the filter tabs. |

|  |  |
| --- | --- |
| **![\*](../../../../images/6652ad397dd1_note_16x16.png)** | • Groups, options, and choices in the **Option Filter** window are displayed by default in the same order as defined by Option Manager. • Different sorting can be applied to the options and choices. To return to the default display order set by the Option Manager, use the **Sort by Default Order** table column action. This action is available only on the last user-defined sorting column of the table for an option set. For more information about this action, see [Managing the Option Set](../../03-working-with-op-fa126a/02-workflow-for-82e49141/05-managing-the-op-3c36f1/index.md#wwID0EZ3JR "Managing the Option Set"). |

<a id="wwID0EGHGS"></a>

4. Before you start selecting choices, the actions located in the top-right corner of the window can be used:

<a id="wwID0ELIGS"></a>

- Disable rule checking by selecting **Disable Rule Checking**.

|  |  |
| --- | --- |
| **![\*](../../../../images/6652ad397dd1_note_16x16.png)** | The **Disable Rule Checking** action disables system checks for choice rules, choice date effectivity, and for the Minimum Required and Maximum Allowed child parts. This allows a filtered configurable structure that may not comply with the choice rules and the constraint on the number of the child parts. This action also changes the currently selected choices to the user selected status. Enabling the rule checking restores the selected choices to the set selected at the initial display and enables system checks for choice rules, choice date effectivity, and for the Minimum Required and Maximum Allowed child parts.. |

<a id="wwID0EQKGS"></a>

- Override the current version of the assigned option set by clicking ![](../../../../images/551bbbdcd477_IconOptionSetSelect.png) to select the latest version of a specific revision.

<a id="wwID0E2LGS"></a>

- View the assigned option set by clicking ![](../../../../images/d371d2ffb4ed_IconInfoPage.gif) provides information on the Option Set.

<a id="wwID0EFNGS"></a>

- Set the Option Filter configuration specification by clicking ![](../../../../images/c385848e77f9_IconSetConfigSpec.png). For more information, see [Specifying the Configuration Specification for the Option Filter](01-specifying-th-49668ccf/index.md#wwID0E6MHS "Specifying the Configuration Specification for the Option Filter").

<a id="wwID0E2OGS"></a>

5. Select the **Design Option** tab.

|  |  |
| --- | --- |
| **![\*](../../../../images/6652ad397dd1_note_16x16.png)** | Depending upon the type of option defined, options are displayed in different tabs. By default, the **Design Option** tab is displayed. For more information, see [Enabling or Disabling Sales and Design Subtypes](../../02-creating-and-ecce0b1d/04-enabling-or-d-bf274673/index.md#wwID0EPHSQ "Enabling or Disabling Sales and Design Subtypes"), [Creating a New Option Subtype](../../02-creating-and-ecce0b1d/05-creating-a-ne-91df4e4c/index.md#wwID0ENUSQ "Creating a New Option Subtype"), and [Customizing the Display Name of the Option Type](../../02-creating-and-ecce0b1d/06-customizing-t-2e39a40f/index.md#wwID0ERDTQ "Customizing the Display Name of the Option Type"). |

<a id="wwID0E5RGS"></a>

6. The **Design Option** tab lists the options included in the option set. Previously selected choices are listed in the **Choices** column. Specify the filtering criteria by selecting the appropriate choices:

<a id="wwID0ELTGS"></a>

1. Click an option, and all choices defined for this option appear in the right pane of the window.

<a id="wwID0ENUGS"></a>

1. In the right pane, click the choices that you want to include in the filtering criteria. The selected choice and any rule driven selected choices are added to the left pane of the window. The **Selection Status** column can be used to identify user selected choices and rule driven selected choices.

|  |  |
| --- | --- |
| **![\*](../../../../images/887c9a51d571_tip_16x16.png)** | You can locate a specific option or choice by using the **Search in table** feature. For more information about this feature, see [Searching within Tables](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/search/LclSrchSearchInTables.html). |

|  |  |
| --- | --- |
| **![\*](../../../../images/887c9a51d571_tip_16x16.png)** | You can filter the table by selecting **Options with Choices Selected** and **Options without Choices Selected** from the pull-down list at the top of the table. Alternatively, you can view all options available. |

<a id="wwID0ECYGS"></a>

7. When finished, click **OK**. When you close the **Edit Filter** window, the filtering criteria are applied to the product structure and the page is refreshed.

<a id="wwID0E4YGS"></a>

Rules affect which choices are selectable, and what choices are selected automatically. For more information, see [Effect of Rules on Choice Selection](../05-effect-of-rul-e22ab0c4/index.md#wwID0E11IS "Effect of Rules on Choice Selection").

<a id="wwID0ERZGS"></a>

## Overriding the Version of the Option Set

<a id="wwID0EVZGS"></a>

The assigned option set is a version-controlled object; therefore, when an option set is assigned, it is the specific version of the option that is assigned. If you want to try out a different version of the assigned option set when defining filtering criteria, you can temporarily override the currently assigned option set by selecting another version. This override does not affect other users of the option set.

> ![\*](../../../../images/6652ad397dd1_note_16x16.png) **Note:** The ability to override is available to Product Managers, Options Managers, and product members.

<a id="wwID0ET1GS"></a>

To override the option set version, click ![](../../../../images/551bbbdcd477_IconOptionSetSelect.png) and select another version from the **Override Option Set Revision** window. To remove the override, click the **Undo Option Set Override** ![](../../../../images/7af1c6602d66_IconUndoOptionSetOverride.gif) icon. This restores the assigned option set version.

<a id="wwID0EV2GS"></a>

## Viewing and Selecting Boolean Choices using Textual Entry for Option Filter

<a id="wwID0EZ2GS"></a>

In the **Option Filter** tab, click the ![](../../../../images/30f5d2109560_Icon_DisplaySelectedChoices.png) **Display Selected Choices** icon to view a summary of the choices selected in the current Option Filter. This switches the display of the options table to the **Selected Choices** table. The “No” choices are displayed with the negation character that you specified in the ato.negation.operator property in the wt.properties file. To perform any management actions on choices, expand the right-hand panel available In the **Display Selected Choices** view, which is collapsed by default.

<a id="wwID0E53GS"></a>

You can select and add choices to the Option Filter definition by using the textual entry field that becomes available within the choice panel. You can specify a boolean option by name or number based on the **Choice Display Format** preference by selecting the appropriate value from the **Rule and Expression Format** drop-down menu. For boolean options, both the boolean option choices, Yes and No, are automatically selected together for Option Filter evaluation. To add the choices to the **Selected Choices** table, click **Add**.

<a id="wwID0ET4GS"></a>

To remove one or more choices from the **Selected Choices** table, right-click a choice and select **Remove**. This action is also available in the table toolbar. However, you cannot use this action to remove a choice that is included by a rule.

<a id="wwID0EF5GS"></a>

## Viewing the User Selected and Rule Driven Choices

<a id="wwID0EJ5GS"></a>

When rule checking is enabled, user selection of a choice can drive the selection of one or more choices based on the system evaluation of the defined rules. User of the Option Filter can use the **Selection Status** column to better understand whether a choice was manually selected by a user or automatically selected by a rule. This status provides information about the choices that are directly selected by the user and the choices, selection of which is driven by rules.

<a id="wwID0ES5GS"></a>

## Using Saved Filter or Variant Specification Option Filter

<a id="wwID0EW5GS"></a>

A previously saved filter or variant specification applies the saved selected choices without applying the current option set definitions or rule definitions. To update a saved filter or variant specification, it must be edited using the corresponding action.

<a id="wwID0E15GS"></a>

## Editing Saved Filter or Variant Specification Option Filter

<a id="wwID0E55GS"></a>

When editing a saved filter or a variant specification where rules or option set definitions have changed, the previously selected choices can change due to the administrative changes. Depending on these administrative changes, the following scenarios can take place:

<a id="wwID0EW6GS"></a>

- Rule driven selected choices may change based upon the same user selected choices.

<a id="wwID0EYAHS"></a>

- User selected choices may become rule driven selected choices as a result of the choices selected earlier in the saved order.

<a id="wwID0E1BHS"></a>

- As a result of the choices selected earlier in the saved order, the previously selected choices may no longer be considered a valid combination, as defined by the rules.

<a id="wwID0EMCHS"></a>

The **Selection Status** column displays the following statuses of the choices:

<a id="wwID0EJDHS"></a>

- **User Selected**

<a id="wwID0ENEHS"></a>

- **Rule Driven**

<a id="wwID0EBFHS"></a>

The preference **Selection Status Display Format** available under the **Options and Variants** node controls the display of the choices in the **Selected Choices** table. You can set this preference to any of the following values:

<a id="wwID0EGGHS"></a>

- **User selected only**: Selecting this value displays only the choices that are selected by user.

<a id="wwID0ELHHS"></a>

- **Rule driven only**: Selecting this value displays choices that are driven by rules.

<a id="wwID0EQIHS"></a>

- **Both**: Selecting this value displays both, choices that are selected by user and choices that are driven by rules.

<a id="wwID0EFJHS"></a>

The default value is **User selected only**.
