# Prototype Management Using Variant Baselines

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/prodfamily/ProdFamilyManagingVariantBaselines.html)  
> 获取日期：2026-11-12

<a id="wwID0EX4AU"></a>

<a id="wwID0EI5AU"></a>

Variant baselines are used to capture specific revisions of component parts (non-configurable parts) that are used to define and validate the configuration of variant specification structure throughout the construction of a prototype. Variant baselines can be managed through a project as a “subject of deliverable”. The status of baseline objects that are the parts comprising the variant specification, can be tracked in the variant baseline with the Status column as they proceed through the prototype process. Unlike other baselines in Windchill, a variant baseline’s components can be updated to reflect design changes for a baseline object in the earlier stages of prototype development. Once the baseline object’s status reaches In Assembly, then its association to the variant baseline is locked.

<a id="wwID0EN5AU"></a>

The following steps generally outline the business process for establishing a variant baseline that you can use to build a prototype.

<a id="wwID0EG6AU"></a>

1. The Product Family manager determines that the design of a variant specification’s component parts have progressed to a stage where testing and validation can be performed. The engineer captures the variant specification configuration by adding it to a variant baseline.

<a id="wwID0EIABU"></a>

2. The Product Family manager manually adds the component parts that make up the variant specification to the baseline by adding them to the **Baseline Objects** table.

<a id="wwID0EOBBU"></a>

3. A variant baseline can be referenced in a project as a “subject of deliverable”. The prototype development can be managed through the project work flows and tasks.

<a id="wwID0EQCBU"></a>

4. A separate revision of a variant specification can be created and associated with a new variant baseline. This allows design engineers and prototype engineers to independently iterate the revisions of the module variants, and the revision added to the variant baseline can be updated (iterated) as design changes are discovered during prototype validation.

<a id="wwID0ESDBU"></a>

5. The manufacturing or prototype engineer updates the **Status** column in the **Baseline Objects** table for each part as it passes through the various stages of the prototype development process. Variant specifications and baseline objects can be added, removed, or replaced with different revisions if required changes are discovered during the development of the prototype. At a certain stage in the prototype’s development, baseline objects are locked and cannot be changed, so that the configuration can be preserved to reflect the actual parts that are included in the prototype build.

<a id="wwID0E3EBU"></a>

6. Upon completion of validation of the prototype, if the variant specification is slated to be released to manufacturing, then the revision in the variant baseline can be copied and pasted under the appropriate product model in the Product Family structure.
