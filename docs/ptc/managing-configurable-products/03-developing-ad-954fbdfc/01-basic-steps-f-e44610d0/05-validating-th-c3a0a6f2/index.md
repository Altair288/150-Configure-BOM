# Validating the Logic for a Configurable Module

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/ExpLogicValidate.html)  
> 获取日期：2026-11-12

<a id="wwID0EPXFT"></a>

<a id="wwID0EDYFT"></a>

Validating the logic allows you to verify that the logical information entered for the top-level configurable module is correct.

> ![\*](../../../../images/6652ad397dd1_note_16x16.png) **Note:** The **Validate Logic** action is only available when the root node of the structure is a configurable module.

<a id="wwID0ECZFT"></a>

To validate the logic for a configurable module:

<a id="wwID0ELZFT"></a>

1. Open the information page of the configurable module.

<a id="wwID0E3ZFT"></a>

2. From the **Actions** menu, select Advanced Logic > Validate Logic.

<a id="wwID0ES2FT"></a>

3. The **Validate Logic** window appears, providing information on the following:

<a id="wwID0EL3FT"></a>

- Reports if it is possible to generate at least one solution.

<a id="wwID0E33FT"></a>

- Suggests locations for page breaks. Page breaks are necessary to separate the specification of the number of an optional subpart from specifications of parameters within the optional subpart.

<a id="wwID0EN4FT"></a>

- Report all constraints on parameter values that include the equality operator (==).

<a id="wwID0EE5FT"></a>

## Preference for Checking Attributes

<a id="wwID0EI5FT"></a>

Checking whether the attributes of a configurable module are in agreement with the attributes of the standard part that is associated to the configurable module as a variant, is configurable by a preference.

<a id="wwID0EM5FT"></a>

If Part Attribute Validation When Attaching a Variant is set to true (or not set), the system checks the configurable module to make sure its attributes are matching with those of the standard part. If a mismatch is found, the standard part is not attached as a variant.

<a id="wwID0EZ5FT"></a>

If Part Attribute Validation When Attaching a Variant is set to false, the attribute check is skipped, and the standard part is attached even if the attributes may not match.
