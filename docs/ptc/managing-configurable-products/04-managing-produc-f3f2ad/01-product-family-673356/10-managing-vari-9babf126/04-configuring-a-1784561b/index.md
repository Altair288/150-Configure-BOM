# Configuring a Managed Variant Specification Using Manual Selection

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/prodfamily/ProdFamilyVarSpecAdHocConfig.html)  
> 获取日期：2026-11-12

<a id="wwID0EWX6T"></a>

<a id="wwID0EGY6T"></a>

When a managed variant specification is first created, it is not associated with a product configuration. Managed variant specifications are created in the context of a Product Family to represent a configured bill of materials for a version of a product model. For example, suppose a product model for a radio has a configurable module assigned that has multiple power options. A variant specification can be created that represents a specific version of the product model where the configurable module is filtered to only include power options based on the locale where it will be sold. One method of choosing which parts are included in the configured bill of materials is to make manual selections that ignore any selection rules (assigned expressions) that have been created in the option set. To make manual selections, use the **Modules** tab on the **Structure** tab of a variant specification’s information page.

<a id="wwID0EVY6T"></a>

The **Modules** tab presents two alternatives for selecting module variants and parts to include in the configuration.

<a id="wwID0ESZ6T"></a>

- **Based on manual selection**

<a id="wwID0EW16T"></a>

- **Based on assigned expression evaluation**

<a id="wwID0EVY6T-4"></a>

By default module selection is based on the assigned expression evaluation. To perform manual selections, use the following procedure.

<a id="wwID0E626T"></a>

1. Navigate to the **Structure** tab on information page of the variant specification that you want to configure.

<a id="wwID0EF46T"></a>

2. Select a configurable module from the part structure table. You can manually configure the entire structure by choosing the parent configurable module. Alternatively, you can select a child configurable module to manually configure only that portion of the structure.

<a id="wwID0EH56T"></a>

3. On the **Modules** tab, select the option **Based on manual selection**.

<a id="wwID0ER66T"></a>

4. In the table below the **Based on manual selection** option, select the configurable modules and module variants (parts) that you want to include in the configurable structure. The part structure table updates to reflect your selections.

|  |  |
| --- | --- |
| **![\*](../../../../../images/887c9a51d571_tip_16x16.png)** | If you change the selection method to **Based on assigned expression evaluation** and later revert your selection to manual selection, the structure automatically updates with your previous manual selections. |

<a id="wwID0EJBAU"></a>

The system remembers your selections. If you are satisfied with the configuration, then you do not need to take any further action.

<a id="wwID0EOBAU"></a>

For more information about working with the **Modules** tab, see [Variant Specification Structure Tab](../03-configuring-m-2e9ec866/01-variant-speci-90c3abcf/index.md#wwID0EHN6T "Variant Specification Structure Tab").
