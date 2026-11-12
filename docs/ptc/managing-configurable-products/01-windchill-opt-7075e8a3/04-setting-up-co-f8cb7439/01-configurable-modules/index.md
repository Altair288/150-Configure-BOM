# Configurable Modules

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsConfigPartOview.html)  
> 获取日期：2026-11-12

<a id="wwID0EJPVR"></a>

<a id="wwID0EZPVR"></a>

You can include a configurable module in the product structure as a way to build in variability in the product. In the process of configuration, a configurable module is replaced with an interchangeable part or a customized variant.

<a id="wwID0E5PVR"></a>

Configurable modules support two configuration approaches:

<a id="wwID0EXQVR"></a>

- List-based option selection and filtering – You can associate a configurable module with several interchangeable child parts, and then use options and choices to define the conditions under which a child part is included. When you apply the Option Filter, a child part that meets the filtering criteria is included in product structure while the parts that do not meet the filtering criteria are excluded.

<a id="wwID0EZRVR"></a>

- Advanced selection logic – If a desired variant is best described by a more complex logic that requires a user’s input, you can develop a logic for a configurable module and define parameters and constraints to guide the user in the configuration process.

<a id="wwID0E5PVR-2"></a>

Regardless of the approach you take, the configurable module enables you to capture user inputs in a variant specification, and generate a variant with a tailored BOM structure and the corresponding part numbers.

<a id="wwID0ENSVR"></a>

You can export a configurable module with all its information, including assigned expressions, options sets, and logic references. To export a configurable module, go to the **Folders** page and select **Export** from the right-click menu.
