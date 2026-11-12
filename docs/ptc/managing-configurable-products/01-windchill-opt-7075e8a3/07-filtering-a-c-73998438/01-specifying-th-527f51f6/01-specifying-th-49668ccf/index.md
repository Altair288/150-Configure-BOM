# Specifying the Configuration Specification for the Option Filter

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsConfigSpecRules.html)  
> 获取日期：2026-11-12

<a id="wwID0E6MHS"></a>

<a id="wwID0EPNHS"></a>

A configuration specification for the Option Filter allows you to specify the version of the choice rules, aliases, and independent assigned expressions. You can set the configuration specification for the Option Filter when performing the following tasks:

<a id="wwID0EIOHS"></a>

- Previewing an option set

<a id="wwID0EKPHS"></a>

- Using the Option Filter in the process of filtering or configuring a part structure

<a id="wwID0E5PHS"></a>

Your access to the Option Filter configuration specification and to the date effectivity settings for choices depends on your group membership and the option set setting:

<a id="wwID0EXQHS"></a>

- The ![](../../../../../images/06eb2f327a1d_IconConfigSpecEdit.png) icon is available on the top-right corner of the **Option Filter** or **Preview** window. Use ![](../../../../../images/06eb2f327a1d_IconConfigSpecEdit.png) to select the configuration specification for the Option Filter.

<a id="wwID0EPSHS"></a>

- If the **Allow Date Effectivity for Choices** attribute is set to **Yes** for the option set, you can select the date to determine the effective choices for the option set.

> ![\*](../../../../../images/6652ad397dd1_note_16x16.png) **Note:** To see a set of states in the lifecycle state drop-down list from the **Set Configuration Specifications for Option Filter** window, set the Windchill property named atoConfigSpec.lifecycle.states to a comma-separated list of the required values. For example, for this list to display **In Work**, **Released**, and **Canceled** in that order, set the property to In Work, Released, Canceled. The property must be set in <Windchill>/site.xconf and propagated to wt.properties the usual way.

<a id="wwID0EGVHS"></a>

To use the configuration specification for option filtering:

<a id="wwID0E6VHS"></a>

1. Click the ![](../../../../../images/06eb2f327a1d_IconConfigSpecEdit.png) icon (located in the top-right corner) on the **Option Filter** or **Preview** user interface.

<a id="wwID0EQXHS"></a>

2. In the **Set Configuration Specifications for Option Filter** window, specify the desired version in one of the following ways:

<a id="wwID0EZYHS"></a>

- By selecting **Latest**–Select the lifecycle state for the rules.

<a id="wwID0E6ZHS"></a>

- By selecting **Date Effectivity**–Select the date to determine the version of the choices to use. The system compares the specified date with the effectivity range defined for choices.

<a id="wwID0EF2HS"></a>

- By selecting **Unit Effectivity**–Select the context of effectivity (Traceable Part Number or Name). According to the context, select the type of effectivity (Serial Number/MSN or Lot Number/Block) to determine the version of expression alias, choice rules, and independent assigned expressions. The system compares the specified effectivity with the effectivity range defined for expressions alias, choice rules, and independent assigned expressions.

<a id="wwID0EM3HS"></a>

3. Click **OK**. The settings for the configuration specification are saved when you use Saved Filters > Save.
