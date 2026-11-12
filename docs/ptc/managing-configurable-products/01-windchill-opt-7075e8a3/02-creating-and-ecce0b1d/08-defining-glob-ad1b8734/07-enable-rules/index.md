# Enable Rules

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsEnableRule.html)  
> 获取日期：2026-11-12

<a id="wwID0EFFDR"></a>

<a id="wwID0EVFDR"></a>

When you are making choice selections while filtering or configuring a part structure, enable rules control which option choices are available for selection, depending on a particular condition. An enable rule links the source choice of one option with specific target choices of other options. When the source choice is selected, the specific target choices are enabled, while the other choices, defined for these options, are disabled.

<a id="wwID0E1FDR"></a>

For example, you may have the option COUNTRY with the choices Canada, USA, Mexico, and the option LANGUAGE with the choices English, French, Spanish. You can create an enable rule which stipulates that when you select COUNTRY = Canada, only English and French are available for selection for the LANGUAGE option, while Spanish as a choice is disabled.
