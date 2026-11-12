# Product Family Management Preferences

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/prodfamily/ProductFamilyManagementPreferences.html)  
> 获取日期：2026-11-12

<a id="wwID0EOZOU"></a>

<a id="wwID0E6ZOU"></a>

The following preferences are available to manage default settings related to the Product Family Management module.

| Preference | Description | Location |
| --- | --- | --- |
| **Default Type For Insert New Under Product Family** | Specify a default type or allow the user to select a type when inserting a child below a Product Family. | Preferences > Create and Edit > Product Family |
| **Default Type For Insert New Under Product Model Group** | Specify a default type or allow the user to select a type when inserting a child below a Product Model Group. | Preferences > Create and Edit > Product Family |
| **Product Family Create Default Type** | Specify a default Product Family type or allow the user to select a type when product families are created. | Preferences > Create and Edit > Product Family |
| **Default attributes layout** | Specifies attributes layout in Matrix Editor cell. | Preferences > Display > Product Family > Matrix Editor |
| **Default column width** | Specifies the default Variant Specifications columns width in pixels. | Preferences > Display > Product Family > Matrix Editor |
| Include related Product Family Members | Allows you to specify the Product Family children collected for the selected Product Family member, that will be by default added to the collection. | Preferences > Operation > Set State > Collector |
| **Configurable Structure Baseline Configuration Specification** | Allows you to define the configuration specification that determines the configurable module versions added to configurable structure baseline for managed variant specifications. Default value is Released. | Preferences > Product Family Management |
| Reset variant baseline member link attribute values during a paste operation | Allows you to provide a comma-separated list of link attribute names of variant baseline member, whose values must be reset to their default values during a paste operation. Value of an attribute is populated from the copied variant baseline member link if the relevant attribute is not included in this preference. | Preferences > Product Family Management |
| **Variant Specification Highest Maturity Life Cycle State** | Allows you to specify the highest maturity life cycle state for managed variant specifications. | Preferences > Product Family Management |
| **Product Family Structure Related Information** | Allows the user to show or hide variant baselines automatically when the Product Family structure browser or Matrix Editor is displayed initially. • **Show**: Does not automatically display the variant baselines when you open the Product Family structure browser or Matrix Editor initially. To display the variant baseline, you must click **Show** or Show > Variant Baseline on the Product Family structure tool bar. • **Show and Display Automatically**: Automatically displays the variant baseline in the Product Family structure or Matrix Editor Product Family structure pane. • **Empty**: Does not automatically display the variant baseline when you open the Product Family structure browser or Matrix Editor initially. Variant baselines are not displayed even after clicking the **Show** button in the Product Family structure tool bar. Default value is **Show and Display Automatically**. | Preferences > Structure > Related Information |
| **Configurable Module Support** | If set to Yes, displays the **Option Filter** tab on the **Edit Filter** window in Matrix Editor. | Preferences > Options and Variants |
| **Automatically Show Selected Revision in Matrix Editor** | If set to Yes, the system automatically displays the selected revision in Matrix Editor. | Preferences > Display > Product Family > Matrix Editor |
| **Automatically Show Replacement Parts in Matrix Editor** | If set to Yes, the system automatically displays the related substitute and alternate parts for the parts in the tree structure of the Matrix Editor. | Preferences > Display > Product Family > Matrix Editor |
| **Display collected objects** | Allows you to specify the way to display collected objects in the table: • **As a List** • **As a Structure** • **As a Structure with Associated Objects** Default value is **As a List**. | Preferences > Product Family Management > Update Variant Baseline Objects Collector |
| **Include dependent Parts** | Allows you to specify whether all or none of the dependent parts for the collected parts are by default added to the collection: • **All** • **None** Default value is **All**. | Preferences > Product Family Management > Update Variant Baseline Objects Collector |
| **Include replacements** | Allows you to specify the replacements that will be by default added to the collection: • **All** • **Initially Selected Only** • **None** Default value is **None**. | Preferences > Product Family Management > Update Variant Baseline Objects Collector |

<a id="wwID0ERJQU"></a>

## Search Preferences

<a id="wwID0EVJQU"></a>

The following search properties are used to determine search behavior throughout Windchill, and are also applicable to Product Family objects. For more information, see [Windchill Search Preferences](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/search/LclSrchUserPrefSet.html).

| Preference | Product Family Relevance |
| --- | --- |
| **All Applicable Object Types Search** | Specifies which product family object types are searched on a simple search page. |
| Global Search Default Types List | Specify which product family object types are included in the global search drop-down list. |
| **Advanced Search Default Types List** | Specifies the object types displayed by default on the advanced search page. Use this preference to select which product family objects types a user sees the first time they use advanced search. If the user modifies the list of default object types for advanced search, then their selections become the user’s new default view. |
