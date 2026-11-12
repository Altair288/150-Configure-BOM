# Using Revise with Configurable Modules and Variants

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsVariantRevise.html)  
> 获取日期：2026-11-12

<a id="wwID0ESTUS"></a>

<a id="wwID0EGUUS"></a>

Produce variants represent a specific configuration, as captured by a variant specification, of a configurable product structure. This section describes the additional consideration on how the association between them is managed when either the variant specification or the variant is revised.

> ![\*](../../../../images/6652ad397dd1_note_16x16.png) **Note:** • The roles (configurable module or variant part) can be revised in any order or as a part of a single change notice. • The association between a configurable module and a variant is not copied to the resulting new copy after using the **Copy** or **Save As** action.

<a id="wwID0EWXUS"></a>

To control the propagation of a generic part (configurable module) to variant links, the following properties can be configured in the wt.properties file:

<a id="wwID0ETYUS"></a>

- wt.generic.variantLinkBehaviorOnRevise (String property)

<a id="wwID0EYZUS"></a>

- com.ptc.wpcfg.variants.move.latest.revision.link (Boolean property)

<a id="wwID0ES1US"></a>

## Revising Configurable Modules

<a id="wwID0EW1US"></a>

When a configurable module is revised and the default configuration is used, the new revision is associated with the same variants as the previous revision of the configurable module.

<a id="wwID0E11US"></a>

An optional configuration allows only the latest revision of the variant to be carried forward to the new revision of the configurable module when the configurable module is revised. For example, revision A of the configurable module has one variant having both revisions A and B. When the configurable module is revised to revision B, then it is associated with only revision B of the variant as it is the latest revision.

<a id="wwID0E51US"></a>

The com.ptc.wpcfg.variants.move.latest.revision.link property controls this configuration. When the property is not set or is set to false, the default behavior is provided. When the property is set to true, the optional behavior is provided.

<a id="wwID0EH2US"></a>

This property is also used when revising the variant. For additional information, see the “Revising Variants” section below.

<a id="wwID0EQ2US"></a>

## Revising Variants

<a id="wwID0EU2US"></a>

When revising variants, the outcome is influenced by two separate configuration settings. One setting controls whether the associations are moved, copied, or not carried forward to the new revision, while the other setting controls whether associations moved or copied are limited to the latest. The property controlling the operation to copy, move, or ignore the association to the configurable module is evaluated first, followed by the property limiting the operation to the latest is evaluated.

<a id="wwID0EY2US"></a>

The property wt.generic.variantLinkBehaviorOnRevise, in the wt.properties file, can be configured using any of the following values:

<a id="wwID0EZ3US"></a>

- copy: When this value is specified or the property is not set, the new revision of the variant is associated to the same configurable module as its predecessor revision and the predecessor revision retains its associations.

<a id="wwID0EB5US"></a>

- When com.ptc.wpcfg.variants.move.latest.revision.link is set to false or the property is not defined, the new variant revision will be associated to all the same revisions of the configurable module as its predecessor revision, the predecessor revision retains its associations.

<a id="wwID0EL6US"></a>

- When com.ptc.wpcfg.variants.move.latest.revision.link is set to true, the new variant revision will be associated to only the latest revision of the configuration module from its predecessor revision, the predecessor revision retains its associations.

<a id="wwID0EWAVS"></a>

- move: When this value is specified, the new revision of the variant is associated to the same configurable module as its predecessor revision, but the predecessor revision no longer retains these associations.

<a id="wwID0E5BVS"></a>

- When com.ptc.wpcfg.variants.move.latest.revision.link is set to false or the property is not defined, the new variant revision will be associated to all the same revisions of the configurable module as its predecessor revision, the predecessor revision does not retain its associations.

<a id="wwID0EIDVS"></a>

- When com.ptc.wpcfg.variants.move.latest.revision.link is set to true, the new variant revision will be associated to only the latest revision of the configuration module from its predecessor revision, the predecessor revision does not retain its associations.

<a id="wwID0ETEVS"></a>

- nocopy: When this value is specified, the new revision of the variant is not associated to the configurable module. The com.ptc.wpcfg.variants.move.latest.revision.link property does not apply when nocopy is used.
