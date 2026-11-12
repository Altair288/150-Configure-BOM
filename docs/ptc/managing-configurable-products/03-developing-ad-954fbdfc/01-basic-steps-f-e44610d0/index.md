# Basic Steps for Defining Advanced Selection

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsConfPartLogicDefine.html)  
> 获取日期：2026-11-12

<a id="wwID0E2Y3S"></a>

> ![\*](../../../images/6652ad397dd1_note_16x16.png) **Note:** If you plan to define advanced selection logic for a configurable module or use a deliverable generation process, the configurable module cannot be a child of a standard part.

<a id="wwID0EH13S"></a>

Once you created a configurable module, you can develop advanced selection using the Part Structure Browser.

<a id="wwID0EA23S"></a>

1. Open the configurable module in the Part Structure Browser.

<a id="wwID0EC33S"></a>

2. Define parameters using the **Parameters** tab.

<a id="wwID0EI43S"></a>

3. Define constraints for the parameters using the **Constraints** tab.

<a id="wwID0EO53S"></a>

4. After the logic is created, configure the part to generate a solution and validate the logic.

<a id="wwID0EQ63S"></a>

5. Once the logic is validated, you can create a variant with the part structure and part numbers.

|  |  |
| --- | --- |
| **![\*](../../../images/887c9a51d571_tip_16x16.png)** | If you want to reuse parameter selection from a configurable module within the same part structure below the given part, you can either use parameter equivalencies or external parameter references. For more information, see [Passing Parameter Values between Sections of a Product Structure Using Equivalencies](../03-examples-and-aee62e3b/04-creating-modu-dcf516dc/02-passing-param-5a1fc489/index.md#wwID0E54QT "Passing Parameter Values between Sections of a Product Structure Using Equivalencies") and [Passing Parameter Values between Sections of a Product Structure Using Reference IDs](../03-examples-and-aee62e3b/04-creating-modu-dcf516dc/03-passing-param-def5dbfb/index.md#wwID0ECMRT "Passing Parameter Values between Sections of a Product Structure Using Reference IDs") |
