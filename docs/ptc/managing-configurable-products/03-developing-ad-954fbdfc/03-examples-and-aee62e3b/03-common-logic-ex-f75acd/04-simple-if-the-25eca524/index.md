# Simple If/Then Expressions Using Case Tables

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/WCOVIfThenExpresUsingCaseTables.html)  
> 获取日期：2026-11-12

<a id="wwID0E3DNT"></a>

<a id="wwID0EMENT"></a>

One of the most common logic expressions is the If/Then statement. For example, you might want to ask the user to select a color for the exterior of a product and then automatically select a complimentary interior color. A case table is a set of conditions arranged in rows where each row represents a single If/Then expression.

<a id="wwID0ERENT"></a>

To use a simple conditional expression using case table:

<a id="wwID0EKFNT"></a>

1. Create a configurable module.

<a id="wwID0EMGNT"></a>

2. Define a string input parameter. For example, exteriorColor.

<a id="wwID0EVHNT"></a>

- Establish a prompt expression, for example, “Select the desired exterior color”.

<a id="wwID0EXINT"></a>

- Establish the valid exterior color values for this parameter’s constraint using values such as:

<a id="wwID0E3JNT"></a>

- Red

<a id="wwID0E5KNT"></a>

- White

<a id="wwID0EAMNT"></a>

- Blue

<a id="wwID0EENNT"></a>

3. Define a second non-input string parameter. For example, driveInteriorFromExterior.

<a id="wwID0ENONT"></a>

- Establish the valid interior color values for this parameter’s constraint using values such as:

<a id="wwID0ESPNT"></a>

- Black

<a id="wwID0EUQNT"></a>

- Brown

<a id="wwID0EWRNT"></a>

- Gray

<a id="wwID0E2SNT"></a>

4. Define a case table, for example, pickInteriorColor, to automatically select the interior color based on the user’s exterior color selection such as:

<a id="wwID0EEUNT"></a>

- Add both parameters, exteriorColor and driveInteriorFromExterior, to the case table.

<a id="wwID0EOVNT"></a>

- Ensure that the case table contains the following values:

| exteriorColor | driveInteriorFromExterior |
| --- | --- |
| Red | Black |
| White | Brown |
| Blue | Gray |

<a id="wwID0EB1NT"></a>

1. In this case, once the user selects the first parameter exteriorColor the system automatically assigns the second parameter driveInteriorFromExterior the value from the case table. In essence, each row of the case table represents a simple If/Then statement, such as:

<a id="wwID0EO1NT"></a>

1. If exteriorColor = Red, then driveInteriorFromExterior = Black
