# Defining a Default Baseline

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/WCOVDefineDefaultBaseline.html)  
> 获取日期：2026-11-12

<a id="wwID0EG2ST"></a>

<a id="wwID0EW2ST"></a>

Once the design and testing of a configurable product structure is completed, it should be reviewed by appropriate personnel and released for use by others. It is very important that all of the components in the product structure remain synchronized with the logic expressions contained in the various configurable modules.

<a id="wwID0E22ST"></a>

To define a default baseline:

<a id="wwID0EU3ST"></a>

1. Create a managed baseline using the Product Structure Browser that contains the topmost configurable module in the structure and all of the other objects in the configurable product structure.

<a id="wwID0EX4ST"></a>

2. Promote the topmost configurable module to an appropriate release level and use the managed baseline to identify the dependent objects in the configurable product structure.

<a id="wwID0EK5ST"></a>

Once the topmost configurable module has been promoted, the managed baseline is designated as the default baseline for that revision of that configurable module.
