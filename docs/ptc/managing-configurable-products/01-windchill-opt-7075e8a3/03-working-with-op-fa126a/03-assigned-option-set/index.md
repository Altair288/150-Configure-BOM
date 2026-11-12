# Assigned Option Set

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsAssignedOptionSet.html)  
> 获取日期：2026-11-12

<a id="wwID0EEMRR"></a>

<a id="wwID0EUMRR"></a>

An option set can be assigned to:

<a id="wwID0ENNRR"></a>

- product or library container

<a id="wwID0EPORR"></a>

- configurable product

<a id="wwID0ERPRR"></a>

- configurable module

<a id="wwID0EEQRR"></a>

Rules for assigning an option set:

<a id="wwID0E4QRR"></a>

- When assigning an option set, you can select an option set from any context to which you have access.

<a id="wwID0E6RRR"></a>

- Only one option set can be assigned to an object.

<a id="wwID0EWSRR"></a>

## Assigning an Option Set to a Product or Library Container

<a id="wwID0E1SRR"></a>

In order for an option set to be used for choice assignment and filtering the product structure, it must be assigned to a product or library container where the configurable product structure resides. You can assign an option set to a product or library from the **Details** page of the product or library container. For detailed steps, see [Assigning an Option Set to an Object](01-assigning-an-bf00a57c/index.md#wwID0EVWRR "Assigning an Option Set to an Object").

<a id="wwID0ESTRR"></a>

## Assigning an Option Set to a Configurable Module

<a id="wwID0EWTRR"></a>

In addition to assigning an option set to the product or library, you can assign an option set to a configurable product or a configurable module. A configurable product, for example a car, can have different option sets assigned to its functional modules, in addition to the option set that is assigned to the top-level configurable product. These assigned option sets are not associated with each other: you define and assign them based on the configuration needs for the specific functional module or technology. Options included in these option sets can come from the same or different options pools, allowing you to reuse definitions from other products or libraries.

<a id="wwID0E2TRR"></a>

To assign an option set to configurable module, you need to access the information page of the object, and then follow the steps described in [Assigning an Option Set to an Object](01-assigning-an-bf00a57c/index.md#wwID0EVWRR "Assigning an Option Set to an Object").

<a id="wwID0EKURR"></a>

If a configurable module has the option set assigned to it directly in addition to the container, the options in the assigned option set can be linked to the parameters defined in the advanced selection logic for that configurable module. For more information on linking parameters and options, see [Linking Advanced Logic Parameters with Options](../../../03-developing-ad-954fbdfc/01-basic-steps-f-e44610d0/04-linking-advan-d78b6547/index.md#wwID0E4JFT "Linking Advanced Logic Parameters with Options").

<a id="wwID0E5URR"></a>

## Viewing the Assigned Option Set

<a id="wwID0ECVRR"></a>

To view the option set assigned to an object or to assign an option set, go to that object’s information page, add a new tab, and select Customize > General > Assigned Option Set to view the **Assigned Option Set** table. If the option set is not assigned to the part directly, the system checks if an inherited option set is available, and if one is found, lists it as the assigned option set.
