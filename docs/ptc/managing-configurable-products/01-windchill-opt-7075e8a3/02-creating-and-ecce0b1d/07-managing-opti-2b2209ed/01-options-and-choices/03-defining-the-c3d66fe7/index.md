# Defining the Quantity of Measure for Option with Numeric Values

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsQuantityOfMeasure.html)  
> 获取日期：2026-11-12

<a id="wwID0ELEXQ"></a>

<a id="wwID0E2EXQ"></a>

When you create a numeric option, you must specify the Quantity of Measure to be used for entering the value for its choices. The Quantity of Measure specifies what is measured, for example, length, mass, frequency. The valid selections for the Quantity of Measure are defined by your administrator using the **Type and Attribute Management** utility. For information on the out-of-the box Quantities of Measures, see [Supported Quantities of Measure](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/typeattr/TypeMgrQOMSupported.html).

<a id="wwID0EPFXQ"></a>

The unit of measure is set by the preference **Measurement system**, located under **Attribute Handling**. If the unit of Measure is length, and the measurement system is SI, then by default the length is measured in meters. Your administrator can override the default units for a specific measure by using the **Manage Quantity of Measures** utility. For example, the administrator can select mm (instead of meters) from the SI system to use with length.

<a id="wwID0EBGXQ"></a>

The Quantity of Measure is set for an option with numeric values, and then propagated to all its choices.

> ![\*](../../../../../../images/6652ad397dd1_note_16x16.png) **Note:** You cannot change the Quantity of Measure for an existing numeric option.

<a id="wwID0EBHXQ"></a>

Choice names must be unique based on your preference settings. Additionally, each choice value of an option must have a unique value to differentiate it. When creating a choice for an option with numeric values, in addition to entering the choice name, you must also enter the numeric value for the choice. You need not enter the units, as the system uses the default units for this measure. If you enter a value using different units (for example, in inches for the SI system), the value is converted to the correct units.

<a id="wwID0EGHXQ"></a>

A site administrator can define a new Quantity of Measure.

<a id="wwID0ELHXQ"></a>

Occasionally, you may need a quantity of measure that does not require units, for example when entering a value for the number of items. In such cases, you can use Count as the unitless Quantity of Measure that is available out-of-the-box.

<a id="wwID0EVHXQ"></a>

An administrator can create a new measure using the **Manage Quantity of Measures** utility from **Type and Attribute Management**. Once the new Quantity of Measure is defined, it is available for selection when creating numeric options.
