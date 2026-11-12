# Managing Locator Definitions in Locators Tab

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsLocEditor.html)  
> 获取日期：2026-11-12

<a id="wwID0ELM1S"></a>

<a id="wwID0E2M1S"></a>

Within the part structure browser for a configurable product, the **Locators** tab is available that allows you to view and manage locators for a configurable module and map locators to module variant coordinate systems exposed from the CAD design.

<a id="wwID0EFN1S"></a>

Refer the video for more details. To view the video in a larger window, click on the video title. This opens the video in YouTube in a new tab.

<a id="wwID0EWN1S"></a>

## Locators Table

<a id="wwID0E1N1S"></a>

When a configurable module is selected in the part structure browser for a configurable product, the **Locators** tab displays a table that includes the module variants and locators defined for the configurable module. The **Locators** table has two main columns:

<a id="wwID0E2O1S"></a>

- **Module Variants**: For a selected configurable module, only the module variant children, also known as non-configurable parts, are displayed in the **Locators** table with a type icon and part identity (number, name, version).

<a id="wwID0EEQ1S"></a>

- **Locators**: You can add a new locator for a configurable module by clicking ![](../../../images/b1709b767c8b_Add.jpg) in the **Locators** table and providing a name. You can map a locator to a module variant coordinate system by double clicking a cell in the **Locators** column and selecting from the list of coordinate systems exposed from the CAD design.

<a id="wwID0ELR1S"></a>

![](../../../images/1be9dcc63464_DataMgmtCapabilities.04.0328.3.jpg)

<a id="wwID0E6R1S"></a>

## Visual Representation in the Locators Tab

<a id="wwID0EDS1S"></a>

When you select a module variant in the **Locators** table, a visual representation of the module variant is displayed in the visualization panel below the table. Within the visualization panel, you can update the selected module variant in the **Locators** table by using the previous and next actions displayed as up and down arrows.

<a id="wwID0EVS1S"></a>

## Creating a Locator for a Configurable Module

<a id="wwID0EZS1S"></a>

Prerequisite:

<a id="wwID0EST1S"></a>

- To create a locator for a configurable module, you must have the modify access to the configurable module.

<a id="wwID0EUU1S"></a>

- The configurable module must not be checked-out by other users.

<a id="wwID0EGV1S"></a>

To create a locator for a configurable module, follow these steps:

<a id="wwID0E6V1S"></a>

1. Click ![](../../../images/b1709b767c8b_Add.jpg) in the **Locators** table. A **New Locator** dialog opens.

|  |  |
| --- | --- |
| **![\*](../../../images/6652ad397dd1_note_16x16.png)** | • If the configurable module is checked-in and you click **New Locator** action, the configurable module is checked-out automatically.• If you cancel the **New Locator** dialog, the configurable part remains in the checked-out state. |

<a id="wwID0EY11S"></a>

2. Add a name for the locator.

<a id="wwID0E121S"></a>

3. Click **OK**. The locator is displayed as a new column in the table.

|  |  |
| --- | --- |
| **![\*](../../../images/6652ad397dd1_note_16x16.png)** | You can display the name of the ![](../../../images/b1709b767c8b_Add.jpg) **New Locator** action in the toolbar by setting the **Toolbar Action Descriptions** preference to **Yes**. By default, this preference is set to **No**. |

<a id="wwID0EJ51S"></a>

## Renaming a Locator for a Configurable Module

<a id="wwID0EN51S"></a>

Prerequisite:

<a id="wwID0EG61S"></a>

- To rename a locator for a configurable module, you must have the modify access to the configurable module.

<a id="wwID0EIA2S"></a>

- The configurable module must not be checked-out by other users.

<a id="wwID0E1A2S"></a>

To rename a locator for a configurable module, follow these steps:

<a id="wwID0ETB2S"></a>

1. In the locator column you want to rename, select the **Rename** action from the column header actions menu. A **Rename** dialog opens.

|  |  |
| --- | --- |
| **![\*](../../../images/6652ad397dd1_note_16x16.png)** | • If the configurable module is checked-in and you click **Rename** action, the configurable module is checked-out automatically.• If you cancel the **Rename** dialog, the configurable part remains in the checked-out state. |

<a id="wwID0EDG2S"></a>

2. Update the name for the locator.

<a id="wwID0EFH2S"></a>

3. Click **OK**. The name in the column header is updated.

<a id="wwID0EAI2S"></a>

## Deleting a Locator for a Configurable Module

<a id="wwID0EEI2S"></a>

Prerequisite:

<a id="wwID0E4I2S"></a>

- To delete a locator for a configurable module, you must have the modify access to the configurable module.

<a id="wwID0E6J2S"></a>

- The configurable module must not be checked-out by other users.

<a id="wwID0ERK2S"></a>

To delete a locator for a configurable module, follow these steps:

<a id="wwID0EKL2S"></a>

1. In the locator column you want to delete, select the **Delete** action from the column header actions menu. A **Delete** confirmation dialog opens.

|  |  |
| --- | --- |
| **![\*](../../../images/6652ad397dd1_note_16x16.png)** | • If the configurable module is checked-in and you click **Delete** action, the configurable module is checked-out automatically.• If you cancel the **Delete** dialog, the configurable part remains in the checked-out state. |

<a id="wwID0E1P2S"></a>

2. Click **OK**. The locator is deleted, and the column is removed from the table.

<a id="wwID0EVQ2S"></a>

## Mapping Module Variant Coordinate Systems to Locators

<a id="wwID0EZQ2S"></a>

To map the coordinate systems to a module variant, the coordinate systems must be designated as locators in the CAD design to be used in Windchill. This allows Creo View Adapters to convert the coordinate systems information and expose it to Windchill when publishing the representation and viewing the module variants. For more information, see the **Converting the Locator for the Platform Structure Visualization** section in the [Creo View Help Center](https://support.ptc.com/help/creo/view/r11.1/en/).

<a id="wwID0ELS2S"></a>

You can map a locator to a module variant coordinate system by double-clicking the intersecting cell for a module variant row and locator column in the **Locators** table. This will put the cell in edit mode, where you can select from a list of coordinate systems defined in module variant representation exposed from the CAD design.

<a id="wwID0EUS2S"></a>

![](../../../images/b5e1efaaa5d3_DataMgmtCapabilities.04.0328.6.jpg)

<a id="wwID0EDT2S"></a>

When viewing the assigned coordinate systems in the **Locators** table:

<a id="wwID0EAU2S"></a>

- If you select a cell with a selected coordinate system, the corresponding coordinate system is highlighted in the visual representation for the module variant.

|  |  |
| --- | --- |
| **![\*](../../../images/6652ad397dd1_note_16x16.png)** | You cannot select multiple cells at a time in the **Locators** table. |

<a id="wwID0EBW2S"></a>

- If you select a coordinate system in the visual representation, the cells with the same selected coordinate systems are highlighted in the **Locators** table.

<a id="wwID0EXW2S"></a>

Within the visual representation, you can select and map a coordinate system to an existing locator or a new locator. To do this, follow these steps:

<a id="wwID0EQX2S"></a>

1. In the visual representation for a module variant, right-click on a coordinate system. A right-click action menu is displayed.

<a id="wwID0ESY2S"></a>

2. Select either **Assign to new locator** action or **Assign to existing locator** action.

<a id="wwID0E6Z2S"></a>

- **Assign to new locator**: Allows you to create a new locator and map the selected coordinate system to it. When you select this action, a **New Locator** dialog box opens, where you can define the locator name. The new locator is displayed as a new column in the **Locators** table and the selected coordinate system will be mapped to the locator.

<a id="wwID0EM22S"></a>

- **Assign to existing locator**: Allows you to map the selected coordinate system to an existing locator. When hovering over the action, a list of existing locators is displayed. After selecting a locator, the coordinate system will be mapped to the locator and appear in the intersecting cell between the module variant row and locator column in the **Locators** table.

<a id="wwID0EG32S"></a>

![](../../../images/ef1146cf4b3f_DataMgmtCapabilities.04.0328.7.jpg)

> ![\*](../../../images/6652ad397dd1_note_16x16.png) **Note:** In the visual representation, if you select a locator in the action menu and the configurable module is not checked-out, the system automatically checks out the configurable module.

<a id="wwID0EV42S"></a>

## Editing the Visualization Preference from the Locator Tab

<a id="wwID0EZ42S"></a>

You can view and edit the visualization preference in the **Locators** tab by pressing Shift + P key. This opens the viewer preference window. Make changes in this window as needed and click **OK**. When the 3D view of the configurable part is rendering, a progress indicator is displayed in the visualization panel.

<a id="wwID0EG52S"></a>

![](../../../images/fc3583704452_Locators_ViewerPreferences.png)

> ![\*](../../../images/6652ad397dd1_note_16x16.png) **Note:** The **Pre-selection** functionality, available in the Creo View WebGL Preferences dialogue box and part selection, is not supported in the visualization panel on the **Locators** tab.
