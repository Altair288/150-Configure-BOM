# Including Two Expressions with an OR Operator

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/WCOVInclTwoExpresWithOROper.html)  
> 获取日期：2026-11-12

<a id="wwID0ELXMT"></a>

<a id="wwID0E2XMT"></a>

You may wish to evaluate two responses provided by the user to include a certain component in the variant if either of the user’s responses is equal to specific values.

<a id="wwID0EAYMT"></a>

For example, you might request the user to specify the size of a table (such as small, medium, or large) and the materials for the table top (such as wood or metal). There may also be a technical requirement that the small table or the wood table top required the use of a smaller shipping carton.

<a id="wwID0EFYMT"></a>

To include two expressions with an OR operator (||):

<a id="wwID0ECZMT"></a>

1. Create a configurable module.

<a id="wwID0EE1MT"></a>

2. Add two string input parameters to the configurable module. For example, askSize and askMaterial.

<a id="wwID0ER2MT"></a>

- Define an appropriate prompt value for each string parameters such as: **Select the desired size** and **Select the desired material**.

<a id="wwID0E43MT"></a>

- Define appropriate constraints for each parameter such as small, medium and large for the askSize parameter and wood and metal for the askMaterial parameter.

<a id="wwID0EI5MT"></a>

3. Add a part or structure of parts to the configurable module to represent the small carton.

<a id="wwID0EK6MT"></a>

4. Add a boolean non-input parameter to the configurable module. For example, useSmallCarton to represent the usage of the small carton.

<a id="wwID0EQANT"></a>

5. Define the expression for the boolean parameter as a combination of the values of the two string parameters. For example: askSize.equals(“small”)||askMaterial.equals(“wood”)

<a id="wwID0EVBNT"></a>

6. Add the boolean parameter. For example, add useSmallCarton to the **Inclusion Option** of this configurable module for the small carton part or structure of parts.

<a id="wwID0EQCNT"></a>

If the user selects the value small for the askSize parameter OR the value wood for the askMaterial parameter, then the expression is true, and the small carton part or part structure is included in the variant. If the user provides any other response, then either the askSize or the askMaterial parameter is false, and the small carton part is excluded from the variant.
