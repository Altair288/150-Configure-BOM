# Managing the Option Set

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsOptionsSetTab.html)  
> 获取日期：2026-11-12

<a id="wwID0EZ3JR"></a>

<a id="wwID0EJ4JR"></a>

To manage options and choices included in an option set, go to the information page of the option set and select the **Structure** tab. The **Structure** tab has two panes:

<a id="wwID0EK5JR"></a>

- The left pane shows a tree view of groups, options, and choices defined for the option set.

<a id="wwID0EM6JR"></a>

- The right pane shows the tabs that provide in-depth information on the item selected in the left pane. Depending on the item you select, some of the following tabs are available: **Attributes**, **Design Option**, **Design Choices**, **Conditional Rules**, **Include Rules**, **Exclude Rules**, **Enable Rules**, and **Where Used**.

|  |  |
| --- | --- |
| **![\*](../../../../../images/6652ad397dd1_note_16x16.png)** | Different types of options can be defined in the Option Pool. Each type is displayed in a separate tab. By default, the **Design Option** tab is selected. For more information, see [Enabling or Disabling Sales and Design Subtypes](../../../02-creating-and-ecce0b1d/04-enabling-or-d-bf274673/index.md#wwID0EPHSQ "Enabling or Disabling Sales and Design Subtypes"), [Creating a New Option Subtype](../../../02-creating-and-ecce0b1d/05-creating-a-ne-91df4e4c/index.md#wwID0ENUSQ "Creating a New Option Subtype"), and [Customizing the Display Name of the Option Type](../../../02-creating-and-ecce0b1d/06-customizing-t-2e39a40f/index.md#wwID0ERDTQ "Customizing the Display Name of the Option Type"). |

<a id="wwID0EADKR"></a>

## Tree View of an Option Set

<a id="wwID0EEDKR"></a>

The tree view of the option set provides a hierarchical representation of the groups (if they are defined), options, and choices included in the option set. You can click an option to expand it and view the associated choices.

> ![\*](../../../../../images/6652ad397dd1_note_16x16.png) **Note:** If both the Sales and Design option types are used at your site, you can filter the tree view by selecting **Sales Option** or **Design Option** from a drop-down list.

<a id="wwID0ELEKR"></a>

The next table lists the item types appearing in a tree view table (left pane).

| Item type | Description | Available actions |
| --- | --- | --- |
| Option Set | A top-level item in the tree view | Expanding the Option Set displays the options and groups included in the Option Set. Right-click the Option Set to view information of the Option Set with additional actions. Selection of the Option Set displays the **Design Option**, **Conditional Rules**, **Include Rules**, **Exclude Rules**, and **Enable Rules** tabs in the right pane. |
| Group | A user-defined collection of options. A group is inherited from an option pool when options are added to the option set. | Expanding a group displays the options included in the group. Right-click the group to view information for the group. Selection of a group displays the **Attributes** and **Design Option** tabs in the right pane. |
| Option | A list of options included in the option set | Expanding an option displays the choices defined in this option. Right-clicking an option displays the **View Information** action. Selection of an option displays the **Attributes**, **Design Choice**, and **Where Used** tabs in the right pane. |
| Choice | Choices associated with the selected option | By right-clicking a choice, the **View Information**, **Copy**, **New Include Rule**, **New Enable Rule**, and **Set Effectivities** actions are displayed. Selection of a choice displays the **Attributes** and **Where Used** tabs in the right pane. |

<a id="wwID0EJNKR"></a>

The Option Set tree contains the following actions for viewing and modifying Option Set information:

<table border="1">
              <tr>
                <th>
                  <div id="wwID0EMOKR">Action</div>
                </th>
                <th>
                  <div id="wwID0EYOKR">Description</div>
                </th>
              </tr>
              <tr>
                <td>
                  <div id="wwID0EKPKR"><span>Manage Choices</span></div>
                </td>
                <td>
                  <div id="wwID0EXPKR">Provides the ability to select options and choices for inclusion in or to deselect for removal from the Option Set. For more information, see <span><a href="02-managing-choi-cf09467c/index.md#wwID0EL1LR">Managing Choices in the Option Set</a></span>.</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div id="wwID0EQQKR"><span>Preview</span></div>
                </td>
                <td>
                  <div id="wwID0E4QKR">Preview the Option Filter with the current Option Set definition.</div>
                </td>
              </tr>
              <tr>
                <td><div><div id="wwID0ELRKR"><img src="../../../../../images/a47d9214ec4f_IconExpandAll.gif" alt="" /> <span>Expand All</span></div></div></td>
                <td>
                  <div id="wwID0E6RKR">Expands all hierarchy levels for the Option Set.</div>
                </td>
              </tr>
              <tr>
                <td><div><div id="wwID0ENSKR"><img src="../../../../../images/98bb7f881844_IconCollapseAll.gif" alt="" /> <span>Collapse All</span></div></div></td>
                <td>
                  <div id="wwID0EBTKR">Collapses all hierarchy level for the Option Set.</div>
                </td>
              </tr>
              <tr>
                <td><div><div id="wwID0EPTKR"><img src="../../../../../images/b24e970aab59_Icon_enable_order.png" alt="" /> <span>Enable Ordering</span></div></div></td>
                <td>
                  <div id="wwID0EDUKR">This action is available when the <span>Group-Dependent Ordering</span> preference is set to <span>No</span> for Option Sets having one or more groups.</div>
                  <div id="wwID0EQUKR">This action allows the ordering of option and choices independent of groups. When the Option Manager clicks this action, the <span>Manage Choices</span> action becomes hidden and the <span>Move Up</span> and <span>Move Down</span> actions are available.</div>
                  <div id="wwID0EBVKR">Selecting the <span>Enable Ordering</span> action hides the group node from the option set tree structure.</div>
                </td>
              </tr>
              <tr>
                <td><div><div id="wwID0EVVKR"><img src="../../../../../images/9cec35cd9938_Icon_disable_order.png" alt="" /> <span>Disable Ordering</span></div></div></td>
                <td>
                  <div id="wwID0EKWKR">This action is available when the <span>Group-Dependent Ordering</span> preference is set to <span>No</span> for Option Sets having one or more groups.</div>
                  <div id="wwID0EXWKR">When using the <span>Disable Ordering</span> action, the <span>Manage Choices</span> action becomes available for the group as table column view. However, the <span>Move Up</span>and <span>Move Down</span> actions are hidden.</div>
                </td>
              </tr>
              <tr>
                <td><div><div id="wwID0EXXKR"><img src="../../../../../images/2903d63b22b7_Icon_Move_Up.png" alt="" /> <span>Move Up</span></div></div></td>
                <td>
                  <div id="wwID0ENYKR">Moves the selected Option Set member up in the default order. For more information, see the “Managing Ordering for Options and Choices” section below.</div>
                </td>
              </tr>
              <tr>
                <td><div><div id="wwID0E3YKR"><img src="../../../../../images/e59afc7d2081_Icon_Move_Down.png" alt="" /> <span>Move Down</span></div></div></td>
                <td>
                  <div id="wwID0ERZKR">Moves the selected Option Set member down in the default order. For more information, For more information, see the “Managing Ordering for Options and Choices” section below.</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div id="wwID0EA1KR"><span>Export List to File</span></div>
                </td>
                <td>
                  <div id="wwID0EO1KR">Exports the information in the Option Set to a file that can be accessed offline in programs such as Microsoft Excel.</div>
                </td>
              </tr>
              <tr>
                <td><div><div id="wwID0E41KR"><img src="../../../../../images/f13e59610d09_Icon_option_set_default_sort.png" alt="" /> <span>Sort by Default Order</span></div></div></td>
                <td>
                  <div id="wwID0ES2KR">Sets the default sort order that is defined by the Option Manager on the option set.</div>
                  <div>
                    <table>
                      <tr>
                        <td>
                          <div id="wwID0EE3KR"><span><img src="../../../../../images/6652ad397dd1_note_16x16.png" alt="*" width="16" height="16" /></span> </div>
                        </td>
                        <td>
                          <div id="wwID0EN3KR">This action is available only on the last user-defined sorted column of the table for an option set.</div>
                        </td>
                      </tr>
                    </table>
                  </div>
                </td>
              </tr>
            </table>

<a id="wwID0EV3KR"></a>

## Managing Ordering for Options and Choices

<a id="wwID0EZ3KR"></a>

When the Option Set is sorted in default order, Option Manager can control the order in which options and choices are presented in the **Option Filter** window for an option set. The **Group-Dependent Ordering** preference, available under the **Options and Variants** node, provides the ability limit ordering dependent on group assignments or independent of group assignments. When groups are defined and ordering is allowed independent of grouping, the Option Manager must use the **Enable Ordering** action to modify the order. To modify the order, the Option Manager can use the **Move Up** and **Move Down** actions.

|  |  |
| --- | --- |
| **![\*](../../../../../images/887c9a51d571_tip_16x16.png)** | The **Sort by Default Order** action is disabled when the tree is sorted by any other column than the default order. To define the default order, you must first sort on default order. |

> ![\*](../../../../../images/6652ad397dd1_note_16x16.png) **Note:** • Only users with the required authorization to edit the option set, typically the Option Manager, can manage option set ordering. • When moving Option Set members, the Option Manager can select multiple items by holding the Ctrl button on the keyboard and selecting the required objects before using **Move Up** or **Move Down** actions.

<a id="wwID0EZ3KR-15"></a>

Ordering defined by Option Manager is retained when switching between different preference modes and views.

<a id="wwID0EGCLR"></a>

## Toolbar Actions

<a id="wwID0EKCLR"></a>

You can perform the following actions using toolbar actions located in the left pane:

<a id="wwID0EDDLR"></a>

- Check for duplicate choices by clicking ![](../../../../../images/752aff5f4494_Exp_IconVerifyTable.gif)

<a id="wwID0ELELR"></a>

- Add choices to the option set by clicking ![](../../../../../images/7437e2571708_IconMgdCollectionNew.gif)

<a id="wwID0ETFLR"></a>

- Preview the choices included in the option set by clicking ![](../../../../../images/9fc678ff8f12_IconPreview.gif)
