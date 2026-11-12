# Creating Multiple Variant Structures Using the Configure Multiple Variants Process for Advanced Selection Logic

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsConfigureMultipleVariantsProcess.html)  
> 获取日期：2026-11-12

<a id="wwID0EVETT"></a>

<a id="wwID0EGFTT"></a>

The configure process for multiple variants with Advanced Logic Selection is a multi-step process to gather variable aspects of the configurable module structure by using the selection logic and part structure filters relevant to a configurable module along with generation instructions. Each unique combination of the variable input will be evaluated for valid variant solutions. The instructions determine the variant specification and variant generation actions applied to each valid solution.

> ![\*](../../../images/6652ad397dd1_note_16x16.png) **Note:** Ability to configure multiple variants for advanced logic selection is an advanced capability subject to a separate license entitlement.

<a id="wwID0EGGTT"></a>

The **Configure Multiple Variants** action is available from the **Actions** menu of a configurable part information page in the Product and Library contexts.

|  |  |
| --- | --- |
| **![\*](../../../images/887c9a51d571_tip_16x16.png)** | You can also initiate the **Configure Multiple Variants** action using the right-click actions menu on configurable parts in: • The “Folder Contents” table in the Folder browser. • The “Search Results” table in Advanced Search. |

|  |  |
| --- | --- |
| **![\*](../../../images/64df1bdad6a0_warning_16x16.png)** | It is recommended that you do not use Refresh (F5) during the process, as this can produce a processing error. |

<a id="wwID0EZKTT"></a>

The action opens the **Configure Multiple Variants** wizard that allows you to define the configuration specification, without filters, and to gather information required to generate the resulting variant specifications and corresponding variants in a single interaction. The created variant specifications and variants are equivalent to those defined through the “Configure” process for the same configurable module.

<a id="wwID0EDLTT"></a>

The “Configure Multiple Variants” process contains the following four steps:

<a id="wwID0E3LTT"></a>

1. [Set Filter](01-set-filter-sp-56a3d8eb/index.md#wwID0ESRTT "Set Filter: Specifying Expansion Criteria")

<a id="wwID0EGNTT"></a>

2. [Set Parameters](02-set-parameter-1ba12f82/index.md#wwID0ED1TT "Set Parameters: Providing Single Input Values and Variable Input Values for Part Parameters")

<a id="wwID0EQOTT"></a>

3. [Set Generation Information](03-set-generatio-0c1e20bd/index.md#wwID0EBMVT "Set Generation Information: Specifying Actions and Attributes for Variant Specifications and Module Variants")

<a id="wwID0E1PTT"></a>

4. [Set Generation](04-set-generatio-7c75e055/index.md#wwID0EWKWT "Set Generation: Review Parameter Value Combinations")

<a id="wwID0EVQTT"></a>

Upon successful completion of the “Configure Multiple Variants” process, a **Requested Multiple Variants** table provides the status on the generation process.
