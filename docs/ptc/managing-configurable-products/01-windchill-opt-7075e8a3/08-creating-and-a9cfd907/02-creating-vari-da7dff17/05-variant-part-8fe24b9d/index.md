# Variant Part Step: Generating a Variant

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsRequestDeliver.html)  
> 获取日期：2026-11-12

<a id="wwID0ERQQS"></a>

<a id="wwID0EBRQS"></a>

The final step of the part configuration process allows you to generate a module variant or a product variant. In this step you can reuse, update, or revise an existing matching variant part found by the system, or create a new variant part.

> ![\*](../../../../../images/6652ad397dd1_note_16x16.png) **Note:** Alternatively, you can request to generate a variant from the information page of a variant specification by choosing **Request Deliverables** from the **Actions** menu.

<a id="wwID0EZSQS"></a>

1. Review the **Module Variants** table for existing variants that may be appropriate to reuse, update or revise. If a variant is appropriate, select one of these actions on the variant part:

<a id="wwID0ECUQS"></a>

- **Use Selected Module Variant**—Available for matching variants; select this option to reuse that variant part and associate it to the variant specification.

<a id="wwID0EHVQS"></a>

- **Update Selected Module Variant**—Available for variants checked out to you; select this option to regenerate the variant part and associate it to the variant specification.

<a id="wwID0EMWQS"></a>

- **Revise Selected Module Variant**—Available for checked in variants; select this option to revise the selected variant, generate the variant part and associate it to the variant specification.

|  |  |
| --- | --- |
| **![\*](../../../../../images/6652ad397dd1_note_16x16.png)** | **Revise Selected Module Variant** is not available when the property wt.generic.variantLinkBehaviorOnRevise is set to nocopy. The **Allow revise of non-latest revisions** preference available under the **Revise** node determines the revisions available for revision. |

<a id="wwID0EOYQS"></a>

- When none of the existing variants are appropriate, select the following action to generate a new variant.

<a id="wwID0EDZQS"></a>

- **Create New Module Variant**—Create a module variant if the variant specification does not have an associated variant part or the associated variants are not appropriate.

<a id="wwID0EJ1QS"></a>

2. To complete the configuration process, click **Finish**.

> ![\*](../../../../../images/6652ad397dd1_note_16x16.png) **Note:** To learn how to carry over custom modeled attributes defined for the configurable module to the variant generated from it, see documentation on Windchill customization.
