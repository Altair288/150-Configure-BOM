# Set Parameters: Providing Single Input Values and Variable Input Values for Part Parameters

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsConfigureMultipleVarCapturingInputs.html)  
> 获取日期：2026-11-12

<a id="wwID0ED1TT"></a>

<a id="wwID0EU1TT"></a>

In the **Set Parameters** step, input values are provided for the parameters governing the customizable aspects of the variant part. To generate multiple variants, single value and variable input values are collected as input to define the multiple sets of unique combinations. It is the unique combinations that will be evaluated for valid solutions which will, in turn, be used to generate variant specifications and variants.

<a id="wwID0E51TT"></a>

For example, a configurable module is defined with three parameters: ParameterA, ParameterB, and ParameterC. Specifying two values for ParameterA and only one each for ParameterB and ParameterC would result in two unique combinations. Specifying two values for ParameterA, two values for ParameterB, and only one value for ParameterC would result in four unique combinations.

<a id="wwID0ED2TT"></a>

The advanced selection logic definition determines not only the parameters displayed but also many aspects of what is displayed. These include, but are not limited to the following:

<a id="wwID0E32TT"></a>

- Number of pages displayed for collecting input parameter values

<a id="wwID0E53TT"></a>

- Inclusion of an optional page image

<a id="wwID0EA5TT"></a>

- Order of parameters

<a id="wwID0EC6TT"></a>

- Default value for input parameters

<a id="wwID0EEAUT"></a>

- Optional parameter value image

<a id="wwID0EXAUT"></a>

For more information on advanced selection logic definitions, see [Developing Advanced Selection Logic for Configurable Modules](../../index.md).

<a id="wwID0EHBUT"></a>

To provide inputs for the parameters defined by the advanced selection logic:

<a id="wwID0EACUT"></a>

1. You are presented with a number of input pages from which you can select values for the specified parameters. The parameters appear in a specific order in the input pages.

<a id="wwID0ECDUT"></a>

2. Depending upon the parameter type, you determine if the parameter value should be single input or variable input. The parameter value input dynamically changes to reflect this selection.

|  |  |
| --- | --- |
| **![\*](../../../../images/6652ad397dd1_note_16x16.png)** | Variable input parameter values are available only for Boolean, String, Integer, Real Number, and Real Number with Units parameters. |

<a id="wwID0E5EUT"></a>

3. Provide single or multiple values for each parameter as appropriate for the parameter type.

|  |  |
| --- | --- |
| **![\*](../../../../images/887c9a51d571_tip_16x16.png)** | An interval may be easier to define than specifying individual values for variable parameters of type Integer and Real Numbers. |

<a id="wwID0E2GUT"></a>

4. Make selections for the parameters displayed on the page and click **Next** to proceed to the next page or click **Cancel** to exit the process.

<a id="wwID0EIIUT"></a>

1. If you are on the last parameter page, **Next** will proceed to the “Set Generation Information” step of the “Configure Multiple Variants” process.

<a id="wwID0EOJUT"></a>

1. If you are not on the last parameter page, **Next** will proceed to the next page of parameters.

> ![\*](../../../../images/6652ad397dd1_note_16x16.png) **Note:** It is possible to define up to 256 unique combinations of parameter values in a single “Configure Multiple Variants” session. When that limit will be reached or exceeded by defining additional variable parameters, the ability to define variable parameters will be disabled.
