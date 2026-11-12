# Enabling a Single Option Based on a User Response

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/WCOVEnabSglOptBasedOnUserResp.html)  
> 获取日期：2026-11-12

<a id="wwID0EYPJT"></a>

<a id="wwID0EJQJT"></a>

In some cases, you may want to enable or disable a single option based on a user response, which is not a yes/no question. For example, you may want to determine if the user wants the standard or deluxe package, and to enable an additional subsystem if the user selected the deluxe package.

<a id="wwID0EOQJT"></a>

To enable a single option based on a non yes/no user response:

<a id="wwID0EHRJT"></a>

1. Create a configurable module.

<a id="wwID0EJSJT"></a>

2. Attach a child part that represents the relevant option.

<a id="wwID0ELTJT"></a>

3. Add a string input parameter to the configurable module; for example, askPackage.

<a id="wwID0EAUJT"></a>

1. Define an appropriate prompt value for the string parameter.

<a id="wwID0EYUJT"></a>

- Deluxe

<a id="wwID0E3VJT"></a>

- Standard

<a id="wwID0ECXJT"></a>

4. Add a boolean non-input parameter to the configurable module; for example, useDeluxe.

<a id="wwID0EXXJT"></a>

1. Define the default expression as askPackage.equals(“Deluxe”)

<a id="wwID0E6XJT"></a>

1. Instead of defining an expression for a parameter, another option is to define the expression constraint as useDeluxe == askPackage.equals(“Deluxe”)

<a id="wwID0EYYJT"></a>

5. Set the boolean parameter useDeluxe on the **Inclusion Option** of this configurable module for the child part of this option.

<a id="wwID0ETZJT"></a>

Using this approach, if the user’s response is Deluxe, then the expression for the boolean parameter useDeluxe evaluates to true, and the child part is included in the variant part structure.
