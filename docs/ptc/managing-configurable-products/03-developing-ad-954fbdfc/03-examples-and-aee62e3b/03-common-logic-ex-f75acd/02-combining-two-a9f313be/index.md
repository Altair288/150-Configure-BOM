# Combining Two Expressions with an AND Operator

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/WCOVCombTwoExpresWithAndOper.html)  
> 获取日期：2026-11-12

<a id="wwID0EZKMT"></a>

<a id="wwID0EKLMT"></a>

You may wish to evaluate two responses provided by the user to include a certain component in the variant only if the user’s responses are equal to specific values.

<a id="wwID0EPLMT"></a>

For example, you might request the user to specify the size of a table, such as small, medium, or large, and the materials for the table top, such as wood or metal. And there might be a technical requirement that the large table with the metal table top requires an additional support member for safety reasons.

<a id="wwID0EULMT"></a>

To combine two expressions using an AND operator (&&):

<a id="wwID0ENMMT"></a>

1. Create a configurable module.

<a id="wwID0EPNMT"></a>

2. Add two string input parameters to the configurable module. For example, askSize and askMaterial.

<a id="wwID0E3OMT"></a>

- Define an appropriate prompt value for each string parameters such as Select the desired size and Select the desired material.

<a id="wwID0EHQMT"></a>

- Define appropriate constraints for each parameter such as small, medium and large for the askSize parameter and wood and metal for the askMaterial parameter.

<a id="wwID0ESRMT"></a>

3. Add a part or structure of parts to the configurable module to represent the additional support.

<a id="wwID0EUSMT"></a>

4. Add a boolean non-input parameter to the configurable module. For example:useExtraSupport to represent the usage of the additional support.

<a id="wwID0E1TMT"></a>

5. Define the expression for the boolean parameter as a combination of the values of the two string parameters. For example: askSize.equals(“large”) && askMaterial.equals(“metal”)

<a id="wwID0EAVMT"></a>

6. Add the boolean parameter. For example, add useExtraSupport to the **Inclusion Option** of this configurable module for the additional support part or structure of parts.

<a id="wwID0E2VMT"></a>

If the user selects the value large for the askSize parameter and the value metal for the askMaterial parameter, then the expression is true, and the additional support part or part structure is included in the variant. If the user provides any other response, then either the askSize or the askMaterial parameter is false and the extra support part is excluded from the variant.
