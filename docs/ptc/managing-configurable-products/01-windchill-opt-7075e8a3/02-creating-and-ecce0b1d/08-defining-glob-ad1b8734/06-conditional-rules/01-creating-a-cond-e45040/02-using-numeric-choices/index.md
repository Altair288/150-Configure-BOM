# Using Numeric Choices

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsUsingNumChoicesInCondlRules.html)  
> 获取日期：2026-11-12

<a id="wwID0ED3BR"></a>

<a id="wwID0ET3BR"></a>

Consider the following information about using numeric choices in expressions:

<a id="wwID0EM4BR"></a>

- You can use numeric choices in expressions for conditional rules, advanced assigned expressions, and aliases. You can use the following operators with numeric choices:

<a id="wwID0ER5BR"></a>

- AND

<a id="wwID0ET6BR"></a>

- OR

<a id="wwID0EVACR"></a>

- !

<a id="wwID0EXBCR"></a>

- <

<a id="wwID0EZCCR"></a>

- >

<a id="wwID0E2DCR"></a>

- <=

<a id="wwID0E4ECR"></a>

- >=

<a id="wwID0EAGCR"></a>

- Numeric choices can be referenced by either name or number.

<a id="wwID0ECHCR"></a>

- You can build more complex expressions by combining elemental expressions, as shown in the following example:

<a id="wwID0ETHCR"></a>

Frame Size >= FS18 + Frame Size <= FS28) / (Wheel Base >= WB25 + Wheel Base <= WB35
