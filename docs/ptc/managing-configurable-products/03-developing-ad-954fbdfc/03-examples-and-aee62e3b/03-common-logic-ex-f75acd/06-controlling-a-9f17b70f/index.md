# Controlling Available Options Using Case Tables

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/WCOVControlAvailOptCaseTables.html)  
> 获取日期：2026-11-12

<a id="wwID0E3NOT"></a>

<a id="wwID0ENOOT"></a>

Another common situation is when you have two options and you want to control the possible choices for the second option based on what the user selects for the first option. Consider the following example:

| askMaterial | askTrim |
| --- | --- |
| Oak | Cherry |
| Oak | Walnut |
| Maple | Cherry |
| Maple | Walnut |
| Maple | Oak |
| Walnut | Cherry |

<a id="wwID0E3UOT"></a>

In this case, if the user selects a material Oak, the only valid choices for the trim are Cherry and Walnut.

<a id="wwID0EBVOT"></a>

You can also use this technique to automatically drive, or define, the value of a related parameter. For example, if the user specifies a value for askMaterial as Walnut, then the only valid value for askTrim is Cherry.

<a id="wwID0EPVOT"></a>

If the parameter askTrim is defined as hide when driven = true on the **User Interface** tab, then the user is not required to provide a value for askTrim if askMaterial is specified as Walnut.

> ![\*](../../../../../images/6652ad397dd1_note_16x16.png) **Note:** Remember that parameters are processed by the system on a page-by-page basis. Therefore, if you want askTrim to be automatically specified by the system, you must place askTrim on a page after the page where askMaterial is specified.
