# Comparing Two String Values

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/WCOVCompareTwoStringVals.html)  
> 获取日期：2026-11-12

<a id="wwID0E3EMT"></a>

<a id="wwID0EMFMT"></a>

In many cases, you may wish to compare two string values, or to compare the value of a string parameter to a particular string. For example, you may wish to determine if the user entered the value such as Deluxe for the string parameter askSize.

<a id="wwID0E1FMT"></a>

To compare two string values:

<a id="wwID0ETGMT"></a>

- Define an expression for this parameter that evaluates the user’s response, such as: askSize.equals(“Deluxe”)

<a id="wwID0EHHMT"></a>

- If the user enters the value Deluxe, it is stored in the parameter askSize and the expression is evaluated as true.

|  |  |
| --- | --- |
| **![\*](../../../../../images/6652ad397dd1_note_16x16.png)** | You cannot use a simple equals operator (=) because string values must be evaluated using Java methods (equals). |

<a id="wwID0EHHMT-6"></a>

- In some cases, you may have assigned a string value to a parameter to make it easier to manage multiple comparison expressions in a consistent manner. In this case, the expression would be:

<a id="wwID0EPIMT"></a>

- askSize.equals(deluxeparameter)

<a id="wwID0EWIMT"></a>

- where the default value of the string parameter deluxeparameter was defined as Deluxe.

|  |  |
| --- | --- |
| **![\*](../../../../../images/6652ad397dd1_note_16x16.png)** | To evaluate a string expression that contains one or more double quotes (“), you must identify, or escape, each double quote with a backslash (\\) as shown in the following example: myname.equals(“Robert \\“Bob\\” Smith”) |
