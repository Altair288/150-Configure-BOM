# Migrated Objects

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsMigratedObjects.html)  
> 获取日期：2026-11-12

<a id="wwID0EIUVS"></a>

<a id="wwID0EYUVS"></a>

The following Options and Variants objects are created after a migration.

| Windchill Object | Object and Class | Description |
| --- | --- | --- |
| wt.filter.DesignationGroup | Group com.ptc.windchill.option.model.Group | DesignationGroup migrated to Group object used in NavigationFilterTemplate of Option type |
| wt.iba.definition.AbstractAttributeDefinition IBA definition (StringDefinition, BooleanDefinition) - Option | Option com.ptc.windchill.option.model.Option | • AbstractAttributeDefinition migrated to Option used in NavigationFilterTemplate of Option type • AbstractAttributeDefinition used to add options in NavigationFilterTemplate are treated as Option in system for option set |
| IBA value (StringValue, BooleanValue) - Choice | Choice com.ptc.windchill.option.model.Choice | • IBA value migrated to Choice object used in NavigationFilterTemplate of Option type • IBA value used to add option values in NavigationFilterTemplate are treated as Choice in system for option set |
| wt.filter.NavigationFilterTemplate | Option Set com.ptc.windchill.option.model.OptionSet | NavigationFilterTemplate of option type migrated to OptionSet object |
| wt.filter.RegisteredNFTLink | RegisterOptionSetLink com.ptc.windchill.option.model.RegisteredOptionSetLink | RegisteredNFTLink used to register NavigationFilterTemplate to Organization/Site context migrated to RegisteredOptionSetLink to register OptionSet to OptionSetAssignable |
| wt.filter.NavigationFilter (only "options" type) | com.ptc.windchill.option.model .ATONavigationFilter | NavigationFilterTemplate to ATONavigationFilter |
