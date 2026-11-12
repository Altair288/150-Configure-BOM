# Choosing Between Two Options Based on a User Response

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/WCOVChosBetwnTwoOptUsrResp.html)  
> 获取日期：2026-11-12

<a id="wwID0EP1JT"></a>

<a id="wwID0EA2JT"></a>

Frequently, a user’s response is used to select one of the two available options. For example, you may want to select the standard-duty battery or the extended-duty battery for a particular product.

<a id="wwID0EF2JT"></a>

To choose between two options based on a user response:

<a id="wwID0E52JT"></a>

1. Create a configurable module.

<a id="wwID0EA4JT"></a>

2. Attach two child parts, one for each package option.

<a id="wwID0EC5JT"></a>

3. Add a boolean input parameter to the configurable module, for example, askExtendedDuty.

<a id="wwID0EX5JT"></a>

1. Define an appropriate prompt value for this parameter, such as: Do you want an extended duty battery?

<a id="wwID0ER6JT"></a>

4. Add this boolean parameter to the **Inclusion Option** of the configurable module for the child part that corresponds to the extended duty battery.

<a id="wwID0EXAKT"></a>

5. Add a second boolean non-input parameter, such as useStandardDuty, to the configurable module.

<a id="wwID0EMBKT"></a>

1. Define the default expression for this parameter as !askExtendedDuty

<a id="wwID0EFCKT"></a>

6. Add the second boolean parameter useStandardDuty to the **Inclusion Option** of this configurable module for the child part that corresponds to the standard duty battery.

<a id="wwID0EADKT"></a>

Using this approach, the user is presented with a single question to determine whether they want the extended duty battery or not. The user’s response is automatically used to include or not include the extended duty battery and the opposite of the user’s response is used to exclude or not exclude the standard duty battery.
