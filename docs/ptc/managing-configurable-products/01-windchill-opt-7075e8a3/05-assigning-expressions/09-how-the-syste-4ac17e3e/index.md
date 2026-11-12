# How the System Determines the Assigned Option Set When Assigning Expressions

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsAssignedOptionSetDetermine.html)  
> 获取日期：2026-11-12

<a id="wwID0E1M5R"></a>

<a id="wwID0ELN5R"></a>

To determine which option set to use when assigning expressions directly on a configurable module or part:

<a id="wwID0EEO5R"></a>

- The system uses the option set assigned directly to the given configurable module.

<a id="wwID0EGP5R"></a>

- If there is no option set assigned directly to the configurable module, the system uses the option asset assigned to the product or library container to which this configurable module belongs.

<a id="wwID0EZP5R"></a>

To determine which option set to use when assigning expressions to a usage link of a configurable module:

<a id="wwID0ESQ5R"></a>

- The system uses the option set assigned directly to the parent configurable module for the given usage link.

<a id="wwID0EUR5R"></a>

- If there is no option set assigned directly to that parent configurable module, the system uses the option set assigned to the product or library container to which the parent configurable module belongs.

<a id="wwID0EWS5R"></a>

- If there is no option set assigned to the container for the parent configurable module, the system uses the option set assigned directly to the root configurable module in the product structure tree.

|  |  |
| --- | --- |
| **![\*](../../../../images/6652ad397dd1_note_16x16.png)** | The next figure shows what is considered a root configurable module in the product structure.![](../../../../images/e042dc67aeef_root_part.png) |

<a id="wwID0EBV5R"></a>

- If there is no option set assigned directly to the root configurable module in the product structure tree, the system uses the option set assigned to the product or library container to which this configurable module belongs.
