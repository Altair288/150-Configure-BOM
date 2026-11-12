# Configurable Product License Entitlement

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/prodfamily/ConfigProdLicenseEnt.html)  
> 获取日期：2026-11-12

<a id="wwID0E5XQU"></a>

<a id="wwID0EOYQU"></a>

Different business strategies require different capabilities for the management of configurable product structures and variant generation. This extensive set of capabilities is available through basic capabilities using configurable products and configurable modules, options and choices, and advanced selection logic and advanced capabilities enabling a more efficient management of platform-based products across the enterprise for design and manufacturing. These advanced capabilities provide extensions and are available with separate license entitlement.

<a id="wwID0EXYQU"></a>

## Advanced Options and Variants License Entitlement

<a id="wwID0E2YQU"></a>

A Product Manager or an Option Manager with access to Option Pool can create and manage options, choices, include rules, exclude rules, enable rules, and option sets. Additional license entitlement provides the following expanded capabilities:

<a id="wwID0EUZQU"></a>

- **Conditional Rules**: Enhanced rules allowing the use of the compound IF and THEN statements to specify when certain option choices can be included, enabled, required, or disabled based on the choice selections that you specify when filtering an overloaded product structure. For information, see [Conditional Rules](../01-windchill-opt-7075e8a3/02-creating-and-ecce0b1d/08-defining-glob-ad1b8734/06-conditional-rules/index.md).

<a id="wwID0EE2QU"></a>

- **Local and Global Rule Effectivity Management**: You can revise global and local rules. You can also manage local rules independently of the Option Set, so the option set does not get iterated when a local rule is revised. For more information, see [Revising Local Rules](../01-windchill-opt-7075e8a3/03-working-with-op-fa126a/02-workflow-for-82e49141/02-managing-loca-711c6325/01-revising-local-rules/index.md).

<a id="wwID0EU3QU"></a>

- **Options and Choices with Numeric Values**: Adding numeric values to choices enables you to more efficiently read, create, and maintain complex rules and assigned expressions by capturing the intent of the rule. With these enhancements, you can use numeric values for choices and operators such as “>”, “<”, “>=”, “<=” to simplify rule writing.

<a id="wwID0E2YQU-2"></a>

Standard team memberships provide product members with Read access to options and choices, the ability to filter a configurable structure, create and manage variant specifications, and variant generation. By default, product members cannot create, edit, or delete options and options sets. With the appropriate license entitlement, these users can define basic, dependent expressions. Additional license entitlement provides the following expanded capabilities:

<a id="wwID0E64QU"></a>

- **Expression Aliases**: Reusable segments of logic. Typically, there are some common logic definitions that are reused in many places of the configuration of product. When distributing responsibility for writing assigned expressions to large teams, it is important for these expressions to be simple to read and write. You can capture these common definitions more easily as aliases and manage them globally for the product. For more information, see [Working with Aliases](../01-windchill-opt-7075e8a3/06-working-with-aliases/index.md).

<a id="wwID0EP6QU"></a>

- **Advanced Expressions**: You can assign more complex expressions to parts, part usage links, and occurrences to increase the control and flexibility of these selections. The advanced expressions can use several subexpressions and functions to describe more than one condition when a module variant can be included in the product structure. For more information, see [Defining Advanced Expressions](../01-windchill-opt-7075e8a3/05-assigning-expressions/08-defining-adva-d6095590/index.md). Advanced expressions are evaluated during the filtering of the product structure to determine the applicability of module variants. For information on filtering using expressions, see [Evaluating Expressions During the Option Filtering](../01-windchill-opt-7075e8a3/07-filtering-a-c-73998438/02-evaluating-ex-54e6b658/index.md).

<a id="wwID0EJBRU"></a>

- **Independent Basic or Advanced Expression**: Assigned expressions can be managed independently of the item to which they are assigned (a part, part usage link, or occurrence). This enables you to modify or revise expressions without iterating the object to which it is assigned. For more information, see [Independent Assigned Expressions](../01-windchill-opt-7075e8a3/05-assigning-expressions/03-independent-a-ddb86fd2/index.md).

<a id="wwID0EZCRU"></a>

- **Selecting Choices using Textual Entry**: Allows textual entry of selected choices in the Option Filter. For more information, see [Specifying the Filtering Criteria for the Option Filter](../01-windchill-opt-7075e8a3/07-filtering-a-c-73998438/01-specifying-th-527f51f6/index.md).

<a id="wwID0EJERU"></a>

- **Expanded Product Structure Filtering Flexibility**: Sometimes it is difficult to find the assigned expressions that are incompletely described in the configurable structure. With a new filter type, Standard and Alternate filter, you can select Alternate filter to view incompletely defined logic in the configurable structure. For more information, see [Standard and Alternate Option Filter](../01-windchill-opt-7075e8a3/07-filtering-a-c-73998438/07-standard-and-b4c4592a/index.md). You can also customize the out-of-the-box methods by defining your own logic for filtering the structure. For more information, see [Configuring Standard and Alternate Behaviors](../01-windchill-opt-7075e8a3/07-filtering-a-c-73998438/07-standard-and-b4c4592a/01-customizing-f-866cf36e/02-configuring-s-ade3070a/index.md).

<a id="wwID0EDGRU"></a>

- **Spreadsheet-based Module Variant Creation and Management**: Creating and maintaining multiple module variants can be cumbersome. With the spreadsheet import and export capabilities, designers can easily create the Bill of Materials for one or more module variants and load it into the system. For more information, see [Loading Data for Product Families and Options and Variants](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/WCDataLoadGuide/WCDataLoad_LoadProdFamOptVar.html).

<a id="wwID0ETHRU"></a>

- **Configure Multiple Variants Process for Advanced Selection Logic**: Generating multiple variant specifications and variants with similar advanced selection logic parameter value definitions individually can be time consuming. For more information, see [Creating Multiple Variant Structures Using the Configure Multiple Variants Process for Advanced Selection Logic](../03-developing-ad-954fbdfc/04-creating-mult-822231e7/index.md).

<a id="wwID0EYIRU"></a>

## Dynamic Positioning License Entitlement

<a id="wwID0E3IRU"></a>

Dynamic positioning enables you to configuring both what is in a structure as well as where to place it visually. It captures assembly positioning logic for use in visualizing as well as building CAD variants for the configured product. With appropriate entitlement, you can use the **Architecture Editor** to define the positioning architecture, and define locators and map them to the defined coordinate system through the **Locators** tab. For more information, see [Dynamic Positioning with Options and Variants](../02-dynamic-posit-1d63a4c2/index.md).

<a id="wwID0EYJRU"></a>

## Product Family License Entitlement

<a id="wwID0EUKRU"></a>

- **Product Families**: Define and mange product families for platform-based products. For more information, see [Managing Product Families and Configurations in Windchill](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/ccm_oview/OptionsProductFamiliesManageOview.html).

<a id="wwID0EEMRU"></a>

- **Spreadsheet-based Module Variant Creation and Management**: Creating and maintaining multiple module variants can be cumbersome. With the spreadsheet import and export capabilities, designers can easily create the Bill of Materials (BOM) for one or more module variants and load it into the system. For more information, see [BOM Table Worksheets](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/import_export_excel/ImExExportBOMTable.html).

<a id="wwID0EUNRU"></a>

- **Creating and Managing Variants within a Product Family**: Create and manage the managed variant specifications and variant baselines as well as generate variants within a product family. For more information, see [Managing Product Families and Configurations in Windchill](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/ccm_oview/OptionsProductFamiliesManageOview.html).
