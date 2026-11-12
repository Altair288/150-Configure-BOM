# Developing Advanced Selection Logic for Configurable Modules

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsAdvSelLogicOview.html)  
> 获取日期：2026-11-12

<a id="wwID0EPM3S"></a>

<a id="wwID0E6M3S"></a>

**Advanced selection logic** is a method of generating product variants in Windchill based on the guided user input. Advanced selection logic can be created for a configurable module, which represents a configurable component in the Windchill product structure.

<a id="wwID0EJN3S"></a>

Advanced selection logic uses parameters and constraints to help the user define customizable aspects of the configurable module during the Configure process. The resulting user inputs are captured in a variant specification, also known as a standalone variant specification. Based on the variant specification, Windchill can generate a variant part (also referred to as a deliverable). During the variant generation process, the system searches for existing parts that meet the selections captured in the variant specification, and includes them in the variant product structure.

<a id="wwID0EON3S"></a>

Typically, the logic for the configurable module is created, edited, and tested using the Part Structure Browser.

<a id="wwID0ETN3S"></a>

To create a variant specification and generate a variant, use the **Configure** action from the configurable module’s information page. For more information on configuring a part, see [Creating Variant Structures Using the Configure Process](../01-windchill-opt-7075e8a3/08-creating-and-a9cfd907/02-creating-vari-da7dff17/index.md#wwID0EPGOS "Creating Variant Structures Using the Configure Process").

<a id="wwID0EHO3S"></a>

To create multiple variant specifications and generate the corresponding variants in a single interaction, use the **Configure Multiple Variants** action from the configurable module’s information page. For more information, see [Creating Multiple Variant Structures Using the Configure Multiple Variants Process for Advanced Selection Logic](04-creating-mult-822231e7/index.md).

> ![\*](../../images/6652ad397dd1_note_16x16.png) **Note:** Ability to configure multiple variants for advanced logic selection is an advanced capability subject to a separate license entitlement.

> ![\*](../../images/6652ad397dd1_note_16x16.png) **Note:** • To enter and display the formulae and advanced logic expressions in a format that is consistent with Microsoft Excel, set the ato.expression.rendering.context=com.ptc.wpcfg.logic.XLSExpressionRenderingContext property in the WT\_HOME/codebase/wt.properties file. • If you plan to define advanced selection logic for a configurable module or use a deliverable generation process, the configurable module cannot be a child of a standard part.

<a id="wwID0E4S3S"></a>

The visibility of the advance logic feature is controlled using the **Advanced Logic** preference. By default, this preference is set to **No**. To enable the use of the advance logic feature, set the **Advanced Logic** preference to **Yes** in **Preference Management**.

<a id="wwID0EXT3S"></a>

Using advance logic feature, a user can generate advance logic reports for a configurable part by navigating to Actions > Advanced Logic. Reports available under **Advanced Logic** option are as follows:

<a id="wwID0EGV3S"></a>

- View Logic

<a id="wwID0EXV3S"></a>

- Lists the logic reports of all parts of the structure. The top part of the report presents the list of parts in the structures. Clicking on the configurable part link directs the user to the logic report of the selected part.

<a id="wwID0EMW3S"></a>

- Validate Logic

<a id="wwID0E4W3S"></a>

- Shows the elements of the logic for the given part: information on the parameters, constraints, child part components, and breakdown into pages of parameters in the Configure Wizard.

<a id="wwID0ESX3S"></a>

- Logic BOM

<a id="wwID0EDY3S"></a>

- Consists of two panels: the part structure navigation panel and the logic information panel. The navigation panel presents the tree view of the part structure. Clicking on a configurable part node link displays the logic report for the selected part.
