# Merging Option Sets

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsMergeOptionSets.html)  
> 获取日期：2026-11-12

<a id="wwID0EJETR"></a>

<a id="wwID0EZETR"></a>

To support nested configurable products, Windchill provides the **Merge Option Sets** action to merge the option sets of lower-level configurable products with the option set of top-level configurable product. While merging, the order defined in the lower-level option set is retained for the choices and options. Options from the lower-level option set are placed after options from the top-level option set.

> ![\*](../../../../images/6652ad397dd1_note_16x16.png) **Note:** Ability to merge option sets is an advanced capability subject to a separate license entitlement.

<a id="wwID0E5FTR"></a>

For more information on configurable products, see [Creating a Configurable Product](../../04-setting-up-co-f8cb7439/02-creating-a-co-dcb5c1e5/index.md#wwID0EOTVR "Creating a Configurable Product").

<a id="wwID0ETGTR"></a>

## Enabling the Merge Feature

<a id="wwID0EXGTR"></a>

Use one of the following methods to enable the feature:

<a id="wwID0EPHTR"></a>

- Add the given property in the site.xconf file:

<a id="wwID0EEITR"></a>

<Property name="ato.optionset.merge.delegate" targetFile="codebase/wt.properties" value="com.ptc.windchill.option.service.DefaultOptionSetMergeDelegate"/>

<a id="wwID0E1ITR"></a>

- Add the given property in the xconfmanager utility to update the site.xconf file (Recommended method):

<a id="wwID0EPJTR"></a>

xconfmanager –s ato.optionset.merge.delegate=com.ptc.windchill.option.service.DefaultOptionSetMergeDelegate -t "codebase/wt.properties"

<a id="wwID0EVJTR"></a>

After adding the given property, ensure that you propagate the changes to the properties file using the xconfmanager utility.

<a id="wwID0EZJTR"></a>

For more information, see [Using the xconfmanager Utility](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/customization/WCCG_Oview_WCUtilities_AboutXconfmanager.html).

<a id="wwID0ENKTR"></a>

## Restrictions and Limitations

<a id="wwID0EJLTR"></a>

- Configurable products should use only one level of nesting.

<a id="wwID0ELMTR"></a>

- Only local conditional rules should be defined for the option sets that are assigned to the lower-level configurable products.

<a id="wwID0ENNTR"></a>

- Only advanced expressions should be assigned to parts, usages, and occurrences.
