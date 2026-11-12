# Moving a Choice

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsChoiceMove.html)  
> 获取日期：2026-11-12

<a id="wwID0E5D4Q"></a>

<a id="wwID0ESE4Q"></a>

A string or numeric choice can be moved from one option to another, within the same option pool, by using the **Move** action. When a choice is moved, the rules and expressions defined for that choice are not altered.

|  |  |
| --- | --- |
| **![\*](../../../../../../images/887c9a51d571_tip_16x16.png)** | After a choice is moved, it is recommended that rule definitions, alias expression, and assigned expressions using the moved choice are reviewed to ensure there is no impact from the move. |

> ![\*](../../../../../../images/6652ad397dd1_note_16x16.png) **Note:** The **Move** action is unavailable for boolean choices.

<a id="wwID0EWG4Q"></a>

A choice can only be moved when the target option does not already have a choice with the same name if the **Choice name uniqueness** preference is set to the **Option** value.

<a id="wwID0EEH4Q"></a>

The **Move** action is available from the following locations:

<a id="wwID0EFJ4Q"></a>

- From the right-click menu when selecting a choice in the tree view (left pane) on the **Option Pool** tab

<a id="wwID0ELK4Q"></a>

- From the right-click menu when selecting a choice in the **Design Choice** or **Sales Choice** (in the right pane) on the **Option Pool** tab

<a id="wwID0E1L4Q"></a>

- From the **Actions** drop-down list on the choice information page

<a id="wwID0ESM4Q"></a>

Selecting the **Move** action opens the **Move** window displaying the read-only information about the choice and the text field to specify the option name to move the choice to. The ![](../../../../../../images/ccdf31376fc9_search.gif) **Find** icon can be used to search for an option. When you click **OK** in this window, the choice is moved to the specified target option that is present within the same Option Pool.

> ![\*](../../../../../../images/6652ad397dd1_note_16x16.png) **Note:** To be able to move a choice from one option to another, ensure both the options are of the same type, (**Design** or **Sales**), belong to the same Option Pool, and are of the same format (string or numeric).

> ![\*](../../../../../../images/6652ad397dd1_note_16x16.png) **Note:** The **Move** action is an advanced capability subject to a separate license entitlement and requires appropriate authorization to modify the source option, target option, and the selected choice.
