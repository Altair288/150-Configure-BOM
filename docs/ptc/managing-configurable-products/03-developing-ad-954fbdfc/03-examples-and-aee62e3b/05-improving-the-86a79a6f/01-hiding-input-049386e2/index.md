# Hiding Input Parameters When Users Do Make a Selection

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/WCOVHideInputParamsNoChoice.html)  
> 获取日期：2026-11-12

<a id="wwID0EVWRT"></a>

<a id="wwID0EGXRT"></a>

In some cases, you may want to define or drive the value of one input parameter based on the value of another input parameter. To do this, you need to define a case table to constrain the values of the second parameter. Consider the following case table example.

| askMaterial | askTrim |
| --- | --- |
| Oak | Cherry |
| Walnut | Maple |
| Cherry | Walnut |

<a id="wwID0EN2RT"></a>

In this case, regardless of the value selected by the user for askMaterial, only one possible value exists for askTrim. Therefore, as soon as askMaterial has been defined, askTrim is assigned by this case table.

<a id="wwID0ED3RT"></a>

If the parameter askTrim is defined as: hide when driven = true (on its **User Interface** tab), then the user would not be required to provide a value for askTrim once the value of askMaterial is specified.

|  |  |
| --- | --- |
| **![\*](../../../../../images/887c9a51d571_tip_16x16.png)** | Remember that parameters are processed by the system on a page-by-page basis. Therefore, if you want the system to automatically specify the parameter askTrim, you must place askTrim on a page after the page where askMaterial is specified. |
