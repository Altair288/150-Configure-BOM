# Configuring Managed Variant Specifications

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/prodfamily/ProdFamilyVarSpecStructureTab.html)  
> 获取日期：2026-11-12

<a id="wwID0E5G6T"></a>

<a id="wwID0EPH6T"></a>

When you create a variant specification in the context of a Product Family, it is categorized as a managed variant specification. A managed variant specification is defined by meta data and option filter. For example, it has a name, number, and is saved to a folder location. When creating a managed variant specification, only meta data is defined. You can use the **Edit Option Filter** action to filter options for a managed variant specification. This allows you to create a fully defined variant specification by making selections based on assigned expression evaluations. For more information, see [Filtering Options for a Managed Variant Specification](../05-filtering-opt-d8d3f1c7/index.md#wwID0ERCAU "Filtering Options for a Managed Variant Specification"). You can filter its structure so that the object represents a specific BOM configuration that specifies the parts that are selected from the configurable module.

<a id="wwID0EDI6T"></a>

There are two methods for defining a managed variant specification’s configuration.

<a id="wwID0E3I6T"></a>

- Manually selecting module variant

<a id="wwID0E5J6T"></a>

- Filtering based on assigned expressions

<a id="wwID0ERK6T"></a>

When you configure a managed variant specification based on manual selection, you ignore selection rules from the option set. This manual selection method is useful when you want to create an experimental design and explore an alternative structure independent of existing choice selection rules. For more information, see [Configuring a Managed Variant Specification Using Manual Selection](../04-configuring-a-1784561b/index.md#wwID0EWX6T "Configuring a Managed Variant Specification Using Manual Selection").

<a id="wwID0EBL6T"></a>

When you configure a managed variant specification by filtering choices based on assigned expressions, the choices you make are checked against rules from the option set to determine what other parts are available for inclusion in the BOM configuration. For more information, see [Filtering Options for a Managed Variant Specification](../05-filtering-opt-d8d3f1c7/index.md#wwID0ERCAU "Filtering Options for a Managed Variant Specification").

<a id="wwID0ERL6T"></a>

You can use a mix of assigned expression evaluation or manual selection throughout the configurable module. For example, suppose that you want module variants in the configurable module to be selected through assigned expression evaluation. Then, for a specific module variant you use manual selection to choose a specific part that matches your requirements for the variant specification. Use the **Manual Selection** column in the configurable module structure table to quickly ascertain which modules have been configured using manual selection. The manual selection icon ![](../../../../../images/e121b42eadd6_IconManualSelectModule.png) displays in the column for those configurable modules whose child modules are manually selected.
