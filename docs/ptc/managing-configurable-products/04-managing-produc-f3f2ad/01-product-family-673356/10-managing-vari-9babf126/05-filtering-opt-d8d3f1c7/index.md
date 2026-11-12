# Filtering Options for a Managed Variant Specification

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/prodfamily/ProdFamilySelectingChoicesForProdVariant.html)  
> 获取日期：2026-11-12

<a id="wwID0ERCAU"></a>

<a id="wwID0ECDAU"></a>

A managed variant specification is first created with metadata such as a name, description, and number. It does not initially include a configuration definition used to selected components within the assigned configurable product structure One method to create a fully defined variant specification is to make selections based on the assigned expression evaluations. To do this, you can use the **Edit Option Filter** window to make selections for each option. As you make selections, the system evaluates the rules, or assigned expressions, that have been created based on the associated option set. Choices that you make affect what other design options you can select. For example, if you select a part type that is associated with an Exclude rule that prohibits another type from being selected at the same time, then a warning is displayed if you try to select the excluded part. Filtering a configurable module based on the assigned expression evaluation is useful when you want to be certain that the resulting configuration complies with selection rules and does not result in an invalid structure with incompatible parts.

<a id="wwID0EMDAU"></a>

To filter the options for a managed variant specification based on assigned expression evaluation, use the following procedure.

<a id="wwID0EFEAU"></a>

1. Navigate to the **Structure** tab of a variant specification’s information page.

<a id="wwID0ELFAU"></a>

2. Click **Edit Option Filter** to open the **Edit Option Filter** window.

|  |  |
| --- | --- |
| **![\*](../../../../../images/6652ad397dd1_note_16x16.png)** | The system automatically filters the configurable structure based on assigned expression evaluation. However, if the structure was previously configured based on manual selection, then verify that the choice selected on the **Modules** tab is **Based on assigned expression evaluation**. |

|  |  |
| --- | --- |
| **![\*](../../../../../images/887c9a51d571_tip_16x16.png)** | The **Edit Option Filter** action is also available from following locations: • The **Actions** menu on the variant specification information page. • Right-click actions menu on a variant specification in the Product Family structure table. • Right-click actions menu on a variant specification in the matrix editor. |

<a id="wwID0EGMAU"></a>

3. Select choices for each option.

<a id="wwID0EINAU"></a>

4. Click **OK**. The window closes and the configurable module updates filtered for the parts that match your choice selections.

> ![\*](../../../../../images/6652ad397dd1_note_16x16.png) **Note:** There are a few circumstances that cause edit option filter action to be hidden: • The configurable module assigned to the variant specification does not have an assigned option set. • If user does not have the separate license entitlement for this action. • A configurable module has not been assigned to the variant specification (either inherited from the Product Family or the product model). • The [Configurable Module Support](../../../../01-windchill-opt-7075e8a3/01-enabling-func-f29c0bc6/index.md) preference is disabled for the product or library context.
