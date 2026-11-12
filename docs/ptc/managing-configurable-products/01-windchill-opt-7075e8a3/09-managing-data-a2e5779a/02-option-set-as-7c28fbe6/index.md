# Option Set Assignment and Customization

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsCustomize.html)  
> 获取日期：2026-11-12

<a id="wwID0ETRYS"></a>

<a id="wwID0EDSYS"></a>

The assignment of the option set to an object is governed by the out-of-the-box logic that determines which option set to use. Your organization can customize how option sets are assigned to configurable modules and configurable products, and implement its own assignment logic. For this, you can develop a delegate that overrides an out-of-the-box behavior and sets up specific criteria for selecting the option set to use for assigning choices and for filtering the product structure.

<a id="wwID0EISYS"></a>

For example, an organization may choose to use classification information on a part to determine which option set to assign to the configurable modules that belong to a particular classification node, and design a delegate that supports such logic. Once a new delegate is implemented, the option set is determined by the delegate, not by the **Assign Option Set** action in the user interface. For more information on how to customize the logic for using option sets, refer to the **Windchill Customization Guide**.

<a id="wwID0EYSYS"></a>

For the latest version of the **Windchill Customization Guide**, see the following location: [http://www.ptc.com/WCMS/files/121093/en/10\_WindchillCustomizationGuide.pdf](http://www.ptc.com/WCMS/files/121093/en/10_WindchillCustomizationGuide.pdf)
