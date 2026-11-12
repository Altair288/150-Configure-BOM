# Setting up Configurable Product Structures

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsConfigProdStructures.html)  
> 获取日期：2026-11-12

<a id="wwID0E3GVR"></a>

<a id="wwID0EMHVR"></a>

When developing a product family that supports multiple configurations, you can use an “overloaded” product structure that includes all possible components that may be included in the supported design variations. You can then filter the overloaded product structure based on the expressions assigned to parts and their usage. The resulting filtered product structure represents a configuration that meets specific product requirements (for example, those derived from a sales order).

> ![\*](../../../images/6652ad397dd1_note_16x16.png) **Note:** An overloaded product structure supporting multiple configurations also applies to developing a product family.

<a id="wwID0ENIVR"></a>

To build in variability within the product structure, for example, when several interchangeable design solutions are supported for a module, the product structure must include configurable modules that are later replaced by one or several interchangeable parts selected using option choice filtering. When a custom-built part is required, a configurable module can capture designs that are defined using advanced selection logic.

> ![\*](../../../images/6652ad397dd1_note_16x16.png) **Note:** You can designate the top-level part of the configurable product structure as a configurable product by setting it as an end item.

<a id="wwID0ENJVR"></a>

To create a configurable product structure:

<a id="wwID0EKKVR"></a>

1. Create an overloaded product structure. Include configurable modules where variation is required. For information on how to create configurable modules, see [Creating a Configurable Module](03-creating-a-co-7ef0adc1/index.md#wwID0EF6VR "Creating a Configurable Module").

<a id="wwID0EWLVR"></a>

2. (optional) Set the top—level part of the configurable structure as an end item. For details, see [Creating a Configurable Product](02-creating-a-co-dcb5c1e5/index.md#wwID0EOTVR "Creating a Configurable Product").

<a id="wwID0ECNVR"></a>

3. Add interchangeable child parts that support variations for configurable modules (assembly components that will replace the configurable module in a resulting variant structure).

<a id="wwID0EEOVR"></a>

4. Add configurable modules for customizable components that will use advanced selection logic.
