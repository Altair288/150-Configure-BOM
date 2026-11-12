# Windchill Options and Variants Capabilities

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsOVCapabOview.html)  
> 获取日期：2026-11-12

<a id="wwID0ERHQQ"></a>

<a id="wwID0EBIQQ"></a>

Windchill offers the following capabilities to support product variability and variant generation.

<a id="wwID0EKIQQ"></a>

## Configurable Product Structure

<a id="wwID0EOIQQ"></a>

To provide capabilities to define, manage, and filter modular and overloaded product structures, Windchill parts can be defined as configurable modules with assigned expressions and advanced logic. Using configurable modules, you can designate the sections of the product that are intended to have multiple designs, which can be selected by configuring the part or by filtering the display of the product structure.

<a id="wwID0EDJQQ"></a>

## Platform-Based Products

<a id="wwID0EHJQQ"></a>

Windchill allows you to define a list of fixed options and choices to describe discrete configurations within a product family. These option definitions can be reused across multiple product families.

<a id="wwID0EWJQQ"></a>

Initially, you create definitions of options for one or several product families, and then manage these options in option sets. As designs for the optional components are defined, you can assign expressions (that use option choices) to the appropriate items in the product structure. To validate the selection logic, you can filter the product structure using the filtering criteria based on the assignments on variable components. Finally, to create a sales order, you can use the Configure action on the overloaded product structure to generate valid designs and create a variant part structure.

<a id="wwID0E6JQQ"></a>

## Parameters for Advanced Selection Logic

<a id="wwID0E2JQQ-1"></a>

For some Configure-to-order and Engineer-to-order strategies, a more sophisticated selection logic is required that allows you to select the appropriate designs or to create order-specific designs for portions of the product. Using a configurable module, you can define parameters to capture non-discrete options, for example, a length dimension or an output cooling capacity of the product. These parameters can be used to define variable constraints and case tables for the selection of parts. Parameters can also be used to call an external application to aid in the selection process.

<a id="wwID0EJKQQ"></a>

## Combining Filtering and Advanced Selection Capabilities

<a id="wwID0ENKQQ"></a>

A company may choose a Variant Design and Generation process that includes both list-based options as well as parameters for advanced selection logic, depending on the level of product configurability needed. With these capabilities combined, you can first filter an overloaded product structure to include the necessary designs of the product, and then continue to configure the order by providing user inputs based on predefined selection logic to create a variant of the product.

<a id="wwID0EWKQQ"></a>

## Variant Generation and Reuse

<a id="wwID0E1KQQ"></a>

Windchill provides the capabilities to create and update variants of the product by using the configuration process, which allows you to apply filtering criteria and selection logic to reduce an overloaded product structure to the appropriate configuration.

<a id="wwID0EJLQQ"></a>

A variant is a part structure that is created from the configurable structure. Windchill records the option choices and parameter inputs that were used to create the variant in a variant specification, and associates it with the variant. During the variant generation step, Windchill searches existing variants and allows you to reuse, update, or revise an existing variant as well as create a new variant.
