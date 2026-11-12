# Visualizing Platform Design

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsVisPlatformDesign.html)  
> 获取日期：2026-11-12

<a id="wwID0EMA3S"></a>

<a id="wwID0EAB3S"></a>

After you define the positioning architecture and mappings between locators and module variant coordinate systems for a configurable product, you can view a dynamically positioned representation for a configured product in the **Visualization** tab within the part structure browser.

<a id="wwID0EKB3S"></a>

When viewing a configured product variant, you must apply option filters to reduce the product structure to a single module variant for each configurable node in the positioning architecture to allow the system to accurately build and position the product variant. When configured this way, the configured product can be correctly positioned and visualized, and can also be opened in the CAD system.

<a id="wwID0EPB3S"></a>

However, there are certain scenarios in which an overloaded structure (meaning that there are more than one module variant remaining for each configurable module) can still be visualized. This section covers the scenarios on how the position of a child module variant is resolved when multiple parents or children are available after applying the option filters.

<a id="wwID0EYB3S"></a>

## Resolving Child Location in Case of Parent with Multiple Module Variants

<a id="wwID0E3B3S"></a>

In a scenario where either the option filter or the architecture is not fully defined, a configurable module can contain multiple module variants in the configured structure. In this case, when resolving position for a child module variant that interfaces with a configurable module that has multiple module variant children remaining, Windchill provides a mechanism to designate and identify the default parent module variant. To designate a default module variant, create an attribute of “Integer” type on the occurrence link and refer this attribute in the **Occurrence attribute name for determining module variant priority in positioning architecture** preference. When an interface returns multiple parents, the parent with the least integer value in this attribute is then selected to resolve the resulting child location.

<a id="wwID0EJC3S"></a>

This preference is available under Visualization > Dynamic Structure node at the product, organization, site, project, and library levels.

> ![\*](../../../images/6652ad397dd1_note_16x16.png) **Note:** This preference is applicable only to the configurable products that are being positioned in the platform structure.

<a id="wwID0EZD3S"></a>

However, in case you have not specified the occurrence link attribute value for any of the parent module variants, or the default parent with the least integer value selected for resolving the child position has multiple coordinate systems, the system displays a warning message that the parent cannot be resolved. In these cases, the child is left at its default location since its position relative to the parent cannot be resolved.

<a id="wwID0ECE3S"></a>

## Resolving Locations for Multiple Variants of Same Configurable Children

<a id="wwID0EGE3S"></a>

In case of an interface where multiple child module variants each with one coordinate system are available because you have not specified a child in the **Option Filter** for that parent, all the child module variants are positioned correctly along the parent based on the defined positioning architecture.

<a id="wwID0EPE3S"></a>

In case there are multiple children and one of them has multiple coordinate systems, the position for the child module variant with a single coordinate system is resolved correctly. However, the child module variant with multiple coordinate systems is marked phantom, which means the appearance of the module variant is visually changed.
