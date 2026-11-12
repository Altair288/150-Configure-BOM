# Enabling a Single Option Based on a Yes/No Response

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/WCOVEnabSglOptYesNoResp.html)  
> 获取日期：2026-11-12

<a id="wwID0E2HJT"></a>

<a id="wwID0ELIJT"></a>

In many situations, you may want to enable or disable a single option based on a user response to a yes/no question. For example, you may want to determine whether the user wants a particular option package.

<a id="wwID0EQIJT"></a>

To enable a single feature based on a yes/no user response:

<a id="wwID0EJJJT"></a>

1. Create a configurable module.

<a id="wwID0ELKJT"></a>

2. Attach a child part that represents the relevant option.

<a id="wwID0ENLJT"></a>

3. Add a boolean input parameter to the configurable module.

<a id="wwID0EPMJT"></a>

4. Define an appropriate prompt value for this parameter.

<a id="wwID0ERNJT"></a>

5. Add this boolean parameter to the **Inclusion Option** of this configurable module for the child part.

<a id="wwID0EIOJT"></a>

The following figure shows an example of this technique where the HardDriveGP and DVDROMDrive are or are not included by the value of the boolean parameters secondHardDrive and needDVDROMDrive, respectively.

<a id="wwID0EYOJT"></a>

![](../../../../../images/482789f01451_WCOVEmergStopOptAskEStopParam.png)
