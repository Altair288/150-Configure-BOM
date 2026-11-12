# Removing Merged Choices and Rules

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsRemoveMerge.html)  
> 获取日期：2026-11-12

<a id="wwID0E2EVR"></a>

<a id="wwID0ELFVR"></a>

If you wish to add or remove the choices or rules from a merged option set, PTC recommends that you unmerge the option set before making modifications. You can merge the option sets after the modifications are made.

<a id="wwID0EQFVR"></a>

To unmerge, on the part information page of the top-level product, click Actions > Remove Merged Items.

<a id="wwID0EFGVR"></a>

The action removes the merged choices and local rules that were added from a lower-level option set. However, it does not remove the local rules that were created in the top-level option set after the merge. If any top-level local rules refer to the lower-level choices that are removed, those local rules remain invalid until the choices are merged back.
