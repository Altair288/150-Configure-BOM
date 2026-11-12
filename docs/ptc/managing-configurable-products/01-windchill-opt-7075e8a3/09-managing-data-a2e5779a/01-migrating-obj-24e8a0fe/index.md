# Migrating Objects from Windchill 9.1 to Windchill 10.0 or Later

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsDataMigrate.html)  
> 获取日期：2026-11-12

<a id="wwID0EGHVS"></a>

<a id="wwID0EWHVS"></a>

After the system migration from Windchill 9.1 to 10.0, NavigationFilterTemplate is available as the OptionSet object in Windchill 10.0. Navigation Filter Templates are migrated from the source system to the target system such that they are available in respective target contexts. Prior to Windchill 10.0, Navigation Filter Templates can be defined only at the organization and site context level. However, in Windchill 10.0 they can be defined and updated only at the product or library context.

<a id="wwID0E2HVS"></a>

Navigation Filter Templates are migrated to the organization or site context of the target system, and are also registered to the product, library, organization, and site context. After the migration to the target system, the option sets can be used “as is” for filtering product structures. However, to take advantage of the new Windchill 10.0 capabilities and to be able to edit the migrated option sets, an Administrator must move these option sets to a shared product or library context, or to specific context where they will be used.

<a id="wwID0EAIVS"></a>

Data migration for options and variants is a two-step process:

<a id="wwID0EZIVS"></a>

1. Perform standard Windchill upgrade for 10.0. This migrates 9.1 Filter Templates and options to 10.0 objects. The migrated objects remain in the same context as before the migration, Organization or Site.

<a id="wwID0E2JVS"></a>

2. Find the migrated objects and move them to the appropriate context. There are two ways to move migrated objects to products and libraries:

<a id="wwID0EALVS"></a>

- Move objects manually – see [Manually Moving Migrated Objects to Products and Libraries](03-manually-movi-39bb177f/index.md#wwID0E2UXS "Manually Moving Migrated Objects to Products and Libraries")

<a id="wwID0ELMVS"></a>

- Move objects automatically – see [Moving Objects Using WinDU and WinRU](04-moving-object-b9b05d69/index.md#wwID0EF4XS "Moving Objects Using WinDU and WinRU")

<a id="wwID0EXNVS"></a>

3. Add the Option Manager Role to the product or library.

<a id="wwID0EZOVS"></a>

4. Add any users or groups to the product or library.

<a id="wwID0EQPVS"></a>

## Moving Migrated Objects to Appropriate Contexts

<a id="wwID0EUPVS"></a>

After an upgrade has been performed, the Site or Organization Administrator can move the migrated option sets (formerly known as Navigation Filter Template) to the appropriate contexts. If the option sets are intended to be used across multiple products, it is advisable to create a shared library or product context that has access to multiple products and move these option sets in that context.

<a id="wwID0EZPVS"></a>

After the objects are moved to the appropriate context, the users who were previously members of the Navigation Filter Template Creator group must be assigned by the Product or Library Manager to the Option Manager role appropriately, in the respective product or library context.

<a id="wwID0ECQVS"></a>

## Notes to the Administrator

<a id="wwID0EGQVS"></a>

There are some important points that administrator needs to know while using this utility:

<a id="wwID0E6QVS"></a>

- The administrator should identify appropriate product/library contexts where the objects can be moved.

<a id="wwID0EBSVS"></a>

- ACL must be set up for these contexts for the options and variants objects and for the administrator.

<a id="wwID0EDTVS"></a>

- The administrator needs to consider the type of scenarios for migrating data.
