# Product Family Overview

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/prodfamily/ProdFamilyOview.html)  
> 获取日期：2026-11-12

<a id="wwID0ENJXT"></a>

<a id="wwID0E4JXT"></a>

A Product Familyis defined as a grouping of products that are similar but slightly different in order to meet certain market needs. A product is an item that a company sells. A product may have different versions called a variant specifications, such as differing sizes or differing colors.

<a id="wwID0EIKXT"></a>

A product and variant specification can be defined in many ways in Windchill, such as Product container, End Item, Variant Specification. The problem with this is that there is not a single solution that allows a company to use this data to define a Product Family.

<a id="wwID0ENKXT"></a>

A Product Family can be defined as a structure consisting of 4 types objects:

<a id="wwID0EGLXT"></a>

- Product Family is the main object that defines a product family and the root level of the product family structure.

<a id="wwID0EMMXT"></a>

- Product Model Grouping is used to define an organizational breakdown to categorize product models within the product family.

<a id="wwID0ESNXT"></a>

- Product Model the actual product defined within a product family, which can represent a product sold such as an SKU or customer-specific order, or a representative configuration used for planning and validation.

<a id="wwID0EYOXT"></a>

- Variant Specification is a different version of a product, such as a different set of options. For more information, see [Managing Variant Specifications in a Product Family](../10-managing-vari-9babf126/index.md#wwID0ERZ4T "Managing Variant Specifications in a Product Family").

<a id="wwID0E4PXT"></a>

## Product Family Relationships

<a id="wwID0EVQXT"></a>

- A Product Family can be related to a product model and product model grouping.

<a id="wwID0EBSXT"></a>

- A product Model Grouping can be related to a product model and product model grouping.

<a id="wwID0ESTXT"></a>

- A Product Model can be related to a Variant Specification.

<a id="wwID0EOUXT"></a>

![](../../../../images/529e1596c952_DataMgmtCapabilities.04.0402.1.jpg)

<a id="wwID0EEVXT"></a>

## Visibility

<a id="wwID0EMVXT"></a>

Product Families can be created and accessed using the Product Families menu from the Navigator in a Product or Library context.

<a id="wwID0EQVXT"></a>

Product Family Members exist in the context of either a Product or Library, and are created in that context’s default domain (and default folder) for access control purposes.

<a id="wwID0EUVXT"></a>

Product Families can be found in the Product Family Table on a Product or Library information page.

<a id="wwID0EYVXT"></a>

All Product Family objects can appear as search results using advanced search.

<a id="wwID0EEWXT"></a>

## Related Links
