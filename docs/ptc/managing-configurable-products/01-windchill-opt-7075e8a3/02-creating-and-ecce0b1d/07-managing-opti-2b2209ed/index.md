# Managing Options in the Option Pool

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsOptionPoolManage.html)  
> 获取日期：2026-11-12

<a id="wwID0EQJTQ"></a>

<a id="wwID0EAKTQ"></a>

To work with the option pool, go to the **Details** page of a product or library, and click the **Option Pool** tab. From this page, you can create and manage options and choices that belong to the option pool, and create the rules to define the choice selection logic.

<a id="wwID0EOKTQ"></a>

The **Option Pool** page has two panes:

<a id="wwID0EMLTQ"></a>

- The left pane shows a tree view of groups, options, and choices included in the option pool.

<a id="wwID0EOMTQ"></a>

- The right pane shows the tabs that provide more detailed information on the attributes and rules defined for the option set. For example, depending on the item selected, you can see some of the following tabs: **Design Option**, **Conditional Rules**, **Include Rules**, **Enable Rules**, **Exclude Rules**, **Expression Aliases**, and **Where Used**.

> ![\*](../../../../images/6652ad397dd1_note_16x16.png) **Note:** Different types of options can be defined in the Option Pool. Each type is displayed in a separate tab. By default, the **Design Option** tab is selected. For more information, see [Enabling or Disabling Sales and Design Subtypes](../04-enabling-or-d-bf274673/index.md#wwID0EPHSQ "Enabling or Disabling Sales and Design Subtypes"), [Creating a New Option Subtype](../05-creating-a-ne-91df4e4c/index.md#wwID0ENUSQ "Creating a New Option Subtype"), and [Customizing the Display Name of the Option Type](../06-customizing-t-2e39a40f/index.md#wwID0ERDTQ "Customizing the Display Name of the Option Type").

<a id="wwID0E6PTQ"></a>

## Tree View of the Option Pool

<a id="wwID0EDQTQ"></a>

The tree view of the option pool provides a hierarchical view of the groups (if they are defined) and options with choices that exist in the option pool.

| Item type | Description | Available actions |
| --- | --- | --- |
| Option Pool | A top-level item representing the container within which the option pool is created | Expanding an Option Pool displays the options and groups included in the Option Pool. By right-clicking the Option Pool, the actions **View Information**, **New Group**, and **New Option** are available. Selection of the Option Pool displays the **Design Option**, **Conditional Rules**, **Include Rules**, **Exclude Rules**, **Enable Rules**, and **Expression Aliases** tabs in the right pane. |
| group | A user-defined collection of options, allowing you to organize options within the option pool | Expanding a group displays the options included in the group. By right-clicking a group, the **View Information**, **Edit**, **Delete**, and **New Option** actions are available. Selection of the group displays the **Attributes** and **Design Option** tabs in the right pane. |
| option | A capability or feature that may have several choices | Expanding an option displays the choices defined for this option. By right-clicking an option, the actions **View Information**, **Edit**, **Delete**, **Rename**, **New Choice**, and **Assign to Group** are displayed along with the ability to create new change objects. Selection of an option displays the **Attributes**, **Design Choice**, and **Where Used** tabs in the right pane. |
| choice | Choices (allowed values) associated with the selected option | By right-clicking a choice, the actions **View Information**, **Edit**, **Copy**, **Delete**, **Rename**, **New Include Rule**, and **New Enable Rule** are displayed along with the ability to create new change objects. Selection of a choice displays the **Attributes** and **Where Used** tabs in the right pane. |

<a id="wwID0EX2TQ"></a>

The Option Pool tree contains the following actions for displaying and modifying Option Pool information:

| Action | Description |
| --- | --- |
| **Check Duplicate Choices** | Checks whether the Option Pool contains duplicate choices. |
| ![](../../../../images/a47d9214ec4f_IconExpandAll.gif) **Expand All** | Expands all the hierarchy levels for the Option Pool. |
| ![](../../../../images/98bb7f881844_IconCollapseAll.gif) **Collapse All** | Collapses all the hierarchy levels for the Option Pool. |
| **Export List to File** | Exports the information in the Option Pool to a file that can be accessed offline in programs such as Microsoft Excel. |

<a id="wwID0ERBUQ"></a>

When more than one type of option is enabled, the Option Pool tree is filtered to display a single type of option and its corresponding choice type. To change the filtered tree, select the specific types of option from a drop-down list on the upper right—hand corner of the tree pane. When an Option or Choice tab is displayed on the right pane, it matches the type selected from the list. For more information, see [Enabling or Disabling Sales and Design Subtypes](../04-enabling-or-d-bf274673/index.md#wwID0EPHSQ "Enabling or Disabling Sales and Design Subtypes").

<a id="wwID0EFCUQ"></a>

## Options for an Option Pool

<a id="wwID0EJCUQ"></a>

When the Option Pool or group is selected in the Option Pool tree, the right pane includes the options matching the selected option type. The following actions are available from this table:

| Action | Description |
| --- | --- |
| **Delete** | Deletes the option from the option pool. For more information, see [Deleting an Option](01-options-and-choices/08-deleting-an-option/index.md#wwID0E24YQ "Deleting an Option"). |
| **New Option** | Adds a new option to the selected Option Pool or group. |
| **Assign to Group** | Assigns the option to the group. For more information, see [Assigning Options to Groups](02-creating-groups-1fd8e8/01-assigning-optio-90a76b/index.md#wwID0EKH1Q "Assigning Options to Groups"). |
| **Export List to File** | Exports the options, matching the selected type, in the Option Pool or group to a file that can be accessed offline in programs such as Microsoft Excel. |

<a id="wwID0EFIUQ"></a>

For more information, see [Options and Choices](../01-options-and-choices/index.md#wwID0EEXQQ "Options and Choices").

<a id="wwID0EZIUQ"></a>

## Choices for an Option Pool

<a id="wwID0E4IUQ"></a>

When the option is selected in the Option Pool tree, the right pane includes the choices corresponding to the selected option type. The following actions are available from this table:

| Action | Description |
| --- | --- |
| **Delete** | Deletes the choice from the option in the Option Pool. |
| **New Choice** | Adds a new choice to the selected option. |
| **Copy** | Copies the selected choice to the clipboard. |
| **Export List to File** | Exports the choices for the selected options in the Option Pool to a file that can be accessed offline in programs such as Microsoft Excel. |

<a id="wwID0EDOUQ"></a>

For more information, see [Options and Choices](../01-options-and-choices/index.md#wwID0EEXQQ "Options and Choices").

<a id="wwID0EXOUQ"></a>

## Conditional Rules for an Option Pool

<a id="wwID0E2OUQ"></a>

When the Option Pool is selected in the Option Pool tree, the right pane includes the Conditional Rules for the Option Pool. The following actions are available from this table:

| Action | Description |
| --- | --- |
| **Delete** | Deletes the Conditional Rule from the Option Pool. For more information, see [Deleting a Conditional Rule](../08-defining-glob-ad1b8734/06-conditional-rules/04-deleting-a-cond-a7142d/index.md#wwID0EEBDR "Deleting a Conditional Rule"). |
| **New Conditional Rule** | Adds a new Conditional Rule to the Option Pool. |
| **Copy** | Copies the selected Conditional Rule to the clipboard. |
| **New** | Creates a new Change Notice, Change Request, Problem Report, Variance, or Promotion Request for the selected Conditional Rule. |
| **Export List to File** | Exports the Conditional Rules in the Option Pool to a file that can be accessed offline in programs such as Microsoft Excel. |

<a id="wwID0EJVUQ"></a>

For more information, see [Conditional Rules](../08-defining-glob-ad1b8734/06-conditional-rules/index.md#wwID0EMIAR "Conditional Rules").

<a id="wwID0E4VUQ"></a>

## Include Rules for an Option Pool

<a id="wwID0EBWUQ"></a>

When the Option Pool is selected in the Option Pool tree, the right pane includes the Include Rules for the Option Pool. The following actions are available from this table:

| Action | Description |
| --- | --- |
| **Delete** | Deletes the Include Rule from the Option Pool. For more information, see [Deleting an Include Rule](../08-defining-glob-ad1b8734/08-include-rules/04-deleting-an-inc-85b108/index.md#wwID0ECYFR "Deleting an Include Rule"). |
| **Copy** | Copies the selected Include Rule to the clipboard. |
| **New** | Creates a new Change Notice, Change Request, Problem Report, Variance, or Promotion Request for the selected Include Rule. |
| **Export List to File** | Exports the Include Rules in the Option Pool to a file that can be accessed offline in programs such as Microsoft Excel. |

<a id="wwID0EU2UQ"></a>

For more information, see [Include Rules](../08-defining-glob-ad1b8734/08-include-rules/index.md#wwID0ESRER "Include Rules").

<a id="wwID0EI3UQ"></a>

## Exclude Rules for an Option Pool

<a id="wwID0EM3UQ"></a>

When the Option Pool is selected in the Option Pool tree, the right pane includes the Exclude Rules for the Option Pool. The following actions are available from this table:

| Action | Description |
| --- | --- |
| **Delete** | Deletes the Exclude Rule from the Option Pool. For more information, see [Deleting an Exclude Rule](../08-defining-glob-ad1b8734/09-exclude-rules/04-deleting-an-exc-3e3caf/index.md#wwID0ELAHR "Deleting an Exclude Rule"). |
| **New Exclude Rule** | Adds a new Exclude Rule to the Option Pool. |
| **Copy** | Copies the selected Exclude Rule to the clipboard. |
| **New** | Creates a new Change Notice, Change Request, Problem Report, Variance, or Promotion Request for the selected Include Rule. |
| **Export List to File** | Exports the Exclude Rules in the Option Pool to a file that can be accessed offline in programs such as Microsoft Excel. |

<a id="wwID0E3CVQ"></a>

For more information, see [Exclude Rules](../08-defining-glob-ad1b8734/09-exclude-rules/index.md#wwID0EP3FR "Exclude Rules").

<a id="wwID0EQDVQ"></a>

## Enable Rules for an Option Pool

<a id="wwID0EUDVQ"></a>

When the Option Pool is selected in the Option Pool tree, the right pane includes the Enable Rules for the Option Pool. The following actions are available from this table:

| Action | Description |
| --- | --- |
| **Delete** | Deletes the Enable Rule from the Option Pool. For more information, see [Deleting an Enable Rule](../08-defining-glob-ad1b8734/07-enable-rules/04-deleting-an-ena-1cd193/index.md#wwID0EGNER "Deleting an Enable Rule"). |
| **Copy** | Copies the selected Enable Rule to the clipboard. |
| **New** | Creates a new Change Notice, Change Request, Problem Report, Variance, or Promotion Request for the selected Include Rule. |
| **Export List to File** | Exports the Enable Rules in the Option Pool to a file that can be accessed offline in programs such as Microsoft Excel. |

<a id="wwID0EHJVQ"></a>

For more information, see [Enable Rules](../08-defining-glob-ad1b8734/07-enable-rules/index.md#wwID0EFFDR "Enable Rules").

<a id="wwID0E2JVQ"></a>

## Expression Aliases for an Option Pool

<a id="wwID0E6JVQ"></a>

When the Option Pool is selected in the Option Pool tree, the right pane includes the Expression Aliases for the Option Pool. The following actions are available from this table:

| Action | Description |
| --- | --- |
| **Delete** | Deletes the Expression Alias from the option pool. For more information, see [Deleting Aliases](../../06-working-with-aliases/06-deleting-aliases/index.md#wwID0EKXES "Deleting Aliases"). |
| **New Expression Alias** | Adds a new Expression Alias to the Option Pool. |
| **Copy** | Copies the selected Expression Alias to the clipboard. |
| **New** | Creates a new Change Notice, Change Request, Problem Report, Variance, or Promotion Request for the selected Include Rule. |
| **Export List to File** | Exports the Expression Aliases in the Option Pool to a file that can be accessed offline in programs such as Microsoft Excel. |

<a id="wwID0EPQVQ"></a>

For more information, see [Working with Aliases](../../06-working-with-aliases/index.md#wwID0EQTCS "Working with Aliases").
