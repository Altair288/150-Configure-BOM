# Numbering for Choice Rules

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsNumberingForChoiceRules.html)  
> 获取日期：2026-11-12

<a id="wwID0EKT6Q"></a>

<a id="wwID0E2T6Q"></a>

Autonumbering for choice rules is supported out-of-the box. Choice rules must have unique numbers for the site.

<a id="wwID0EAU6Q"></a>

If you want to modify the out-of-the-box OIR to allow for manual numbering of choice rules, you should not remove the usage of an OIR sequence to generate unique rule numbers. Removing the OIR sequence to generate unique rule numbers when using manual numbering causes the **Save As** action on the option set to fail because the system is unable to assign unique numbers to the copied choice rules.
