# Selecting One Option from a Set of Several Possible Options

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/WCOVSelOneOptFrmSevOpts.html)  
> 获取日期：2026-11-12

<a id="wwID0EXDKT"></a>

<a id="wwID0EHEKT"></a>

You may want to select a single option from a set of several possible options, based on the user’s response. For example, a remote power generation system can be available with three different communications and monitoring systems—modem, wired internet, and wireless internet, and you want to enable the correct system based on the user’s response.

<a id="wwID0EMEKT"></a>

To select a single option from a set of possible options:

<a id="wwID0EFFKT"></a>

1. Create a configurable module.

<a id="wwID0EHGKT"></a>

2. Attach a child part for each of the relevant options.

<a id="wwID0EJHKT"></a>

3. Add a string input parameter to the configurable module; for example, askComms.

<a id="wwID0ESIKT"></a>

- Define an appropriate prompt value for the string parameter.

<a id="wwID0EUJKT"></a>

- Define a set of constraints for the string parameter, such as:

<a id="wwID0EZKKT"></a>

- Internet (Wireless)

<a id="wwID0E2LKT"></a>

- Internet (Wired)

<a id="wwID0E4MKT"></a>

- Modem

<a id="wwID0EQNKT"></a>

![](../../../../../images/83b1ff8d8a8c_WCOVEditParamAskComms.png)

<a id="wwID0ENOKT"></a>

4. Add three boolean non-input parameters to the configurable module, such as:

<a id="wwID0ESPKT"></a>

- useWireless— to represent the usage of the Internet (Wireless) system

<a id="wwID0EXQKT"></a>

- useWired— to represent the usage of the Internet (Wired) system

<a id="wwID0E3RKT"></a>

- useModem— to represent the usage of the Modem system

<a id="wwID0ERSKT"></a>

![](../../../../../images/03f5ecb4e614_WCOVProdStrucExpl1.png)

<a id="wwID0E4SKT"></a>

1. In this example, the user’s response is captured in the parameter askComms that is constrained to three possible values. Based on the user’s response, one of the boolean parameters is set to True by the case table constraint that enables the corresponding subassembly.

<a id="wwID0EKTKT"></a>

![](../../../../../images/734239c0910f_WCOVProdStrucExpl2.png)
