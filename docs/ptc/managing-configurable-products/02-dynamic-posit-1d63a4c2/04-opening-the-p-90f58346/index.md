# Opening the Platform Structure in a CAD Application

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsOpenInCAD.html)  
> 获取日期：2026-11-12

<a id="wwID0EKF3S"></a>

<a id="wwID0E5F3S"></a>

This section provides details about opening the configured product structure in a CAD application to continue with the design work.

<a id="wwID0EDG3S"></a>

Refer the video for more details. To view the video in a larger window, click on the video title. This opens the video in YouTube in a new tab.

<a id="wwID0EIG3S"></a>

<a id="wwID0EYG3S"></a>

## Pre-requisite

<a id="wwID0E3G3S"></a>

When opening the configured structure in a CAD application, the top-level product structure that is being positioned by the platform architect must not have a CAD associated with it, to be able to build the location and persist it when the design context is created. CAD models must not be associated to the configurable upper-level product structure. The first association of CAD models must be at the module variant level. This enables the system to derive the positioning of each module variant from the positioning architecture.

<a id="wwID0EFH3S"></a>

## Working with the Configuration and Design Contexts

<a id="wwID0EJH3S"></a>

After you have built a dynamically positioned representation for a configured product, you can open the CAD model in a CAD application using the same positioning as the representation. This is useful if you want to analyze the design or explore new design options.

<a id="wwID0ENH3S"></a>

To open the positioned CAD model in a CAD application, you must first create a configuration context for the configured product. From the **Structure** tab for the configuration context, select the **Open In CAD Tool** action from the toolbar actions. This creates a design context from the configuration context and pass the dynamic positioning information to the design context during the process. For more information, see [Creating a Configuration Context](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/WorkingWithCADandPartStructures/DICCreateConfigContext.html) and [Creating a Design Context from a Part Structure](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/WorkingWithCADandPartStructures/DICDesignContextCreate.html).

> ![\*](../../../images/6652ad397dd1_note_16x16.png) **Note:** • The system will allow the creation of a design context even if the positioned representation for the configuration context contains partially positioned modules.• When you update the positioning architecture, the dynamic positioning is regenerated accordingly in the configuration context. To update the design context with the regenerated dynamic positioning information, you can use the **New/Update** action available in the configuration context structure toolbar.
