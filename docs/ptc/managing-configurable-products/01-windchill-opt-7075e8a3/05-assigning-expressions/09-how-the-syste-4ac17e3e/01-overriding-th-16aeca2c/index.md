# Overriding the Version of the Assigned Option Set

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsOptionSetVersion.html)  
> 获取日期：2026-11-12

<a id="wwID0EHW5R"></a>

<a id="wwID0EXW5R"></a>

Assigned expressions reference the choices that come from the assigned option set. If you want to use a different version of the assigned option set for assigning expressions, you can override the currently assigned version. This can be useful to you if you want to test a new version of the option set. To override the option set version, click ![](../../../../../images/551bbbdcd477_IconOptionSetSelect.png) and select a different version. To remove the override, right-click the assigned option set and click ![](../../../../../images/bb3a5fe2a610_IconOverrideTemplateUndo.gif).

<a id="wwID0EOX5R"></a>

The lifecycle of the assigned option set has an effect on how the override works. For example, if the option set B.1 is assigned to a part with the lifecycle state Released and you, as an administrator, want to update the same option set in the C.5 version, then you can override the B.1 option set with the C.5 version while testing. However, if the lifecycle is not used for assigning the option set to the part, then you can override the option set with only older versions.
