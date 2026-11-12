# Viewing Information About an Option

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsInfoPage.html)  
> 获取日期：2026-11-12

<a id="wwID0E2CYQ"></a>

<a id="wwID0ELDYQ"></a>

To view information about an option, go to the tree view table in the left pane (of an option pool or an option set), locate the option, and click ![](../../../../../../images/d371d2ffb4ed_IconInfoPage.gif). The Details tab of the option information page contains information about the option such as when it was created and modified, its description, and the product or library context in which it was created.

<a id="wwID0EYDYQ"></a>

The **Details** tab shows the **Choices** table that lists all choices defined for the option. From the **Choices** table you can add new choices by clicking ![](../../../../../../images/033cd2fc380c_IconChoiceNew.gif), or delete selected choices by clicking ![](../../../../../../images/22aa5ed232d8_IconDelete.gif).

<a id="wwID0EYEYQ"></a>

The following actions are available from the **Actions** menu:

| Action | Description |
| --- | --- |
| **Edit** | Edit the option attributes. For more information, see [Editing an Option](../07-editing-an-option/index.md#wwID0EKSYQ "Editing an Option"). |
| **Delete** | Delete the option from the option pool. For more information, see [Deleting an Option](../08-deleting-an-option/index.md#wwID0E24YQ "Deleting an Option"). |
| **New Choice** | Add a new choice to the option. |
| **Rename** | Rename the option. For more information, see [Renaming an Option](../09-renaming-an-option/index.md#wwID0EKGZQ "Renaming an Option"). |

<a id="wwID0EBMYQ"></a>

## Information Page for an Option with Numeric Values

<a id="wwID0EFMYQ"></a>

You can add the **Display Units** table to the information page of a numeric option by adding a new tab and clicking Customize > General > Display Units. The **Display Units** table lists the measurement system, the default units for the supported measurement systems, the units that were selected to override the defaults.

<a id="wwID0EINYQ"></a>

The **Choices** table lists the choices defined for this option. For numeric choices, it also lists the choice value with the corresponding unit of measure.

<a id="wwID0EWNYQ"></a>

## Where Used Table

<a id="wwID0E1NYQ"></a>

An option may be referenced by a parameter used in the advanced selection logic of a configurable module.

<a id="wwID0E5NYQ"></a>

To view configurable modules that reference this option:

<a id="wwID0EWOYQ"></a>

1. In the tree view on the **Option Pool** page or the **Structure** page of an option set, select an option to get information on.

<a id="wwID0EAQYQ"></a>

2. Click the **Where Used** tab in the right pane. The **Where Used** tab shows the **Referenced as a parameter by the following parts** table with a list of configurable modules that use the selected option.

<a id="wwID0E5QYQ"></a>

The **Referenced as a parameter by the following parts** table is also available on the information page of the option. You can also show it as a separate tab on the options information page by choosing Customize > Where Used.
