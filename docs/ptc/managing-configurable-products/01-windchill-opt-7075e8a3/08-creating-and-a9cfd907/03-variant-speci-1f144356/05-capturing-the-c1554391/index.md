# Capturing the Configuration of a Variant Specification

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OVVariantSpecSetState.html)  
> 获取日期：2026-11-12

<a id="wwID0EW4SS"></a>

<a id="wwID0EK5SS"></a>

When a managed variant specification is set to its highest maturity state such as **Released**, the system captures the released configuration, the baseline of the upper-level configurable structure (configurable parts), in a new baseline. This allows the configurable structure to continue to be evolved without changing the configuration of the released variant specification. This baseline is referred to as configurable structure baseline and is automatically applied as the first configuration specification when viewing the structure of the variant specification. Since this baseline is internally created and managed by the system, it is not possible to access or modify its definition, nor can it be removed or reorder in the **Edit Filter** window from the **To Be Applied** list.

> ![\*](../../../../../images/6652ad397dd1_note_16x16.png) **Note:** • Only the system administrator can define the highest maturity state(s) for a managed variant specification either at the Site or at the Organization level. • The default configuration specifications of the system must be used when capturing the configurable structure baseline. • If the managed variant specification is not related to a variant baseline, the default part configuration specifications are applied after the configurable structure baseline entry. If the managed variant specification is related to a variant baseline, then the variant baseline entry appears after the configurable structure baseline entry, and the default part configuration specification appears after the variant baseline. • You cannot move a released managed variant specification to another Product Model within the Product Family structure.

<a id="wwID0EEETS"></a>

The assigned configurable module for a managed variant specification is locked when the variant specification reaches its highest maturity state (released). This ensures the released variant structure does not change based on the changes to the assigned configurable module within the Product Family.

> ![\*](../../../../../images/6652ad397dd1_note_16x16.png) **Note:** The highest maturity states for a managed variant specification are defined by the system preference called **Variant Specification Highest Maturity Life Cycle State**. For more information about this preference, see [Product Family Management Preferences](../../../../04-managing-produc-f3f2ad/01-product-family-673356/13-product-famil-9fdce8c5/02-product-famil-d963a369/index.md#wwID0EOZOU "Product Family Management Preferences").

<a id="wwID0ETFTS"></a>

When a released variant specification is revised back into the non-highest maturity state, the configurable structure baseline is no longer referenced and the assigned configurable structure is reverted to being inherited by the Product Family. In this case, the configurable structure baseline must be deleted.

> ![\*](../../../../../images/6652ad397dd1_note_16x16.png) **Note:** • If the state of the managed variant specification changes from a highest level maturity state to another highest level maturity state, then the configurable structure baseline must be deleted and recaptured. • If the managed variant specification is iterated, then the configurable structure baseline must be copied forward to a new iteration. • If the managed variant specification is revised, then the configurable structure baseline must not be copied forward to a new revision. • The configurable structure baseline must not be copied forward when performing the **Paste as Copy** action for a managed variant specification.
