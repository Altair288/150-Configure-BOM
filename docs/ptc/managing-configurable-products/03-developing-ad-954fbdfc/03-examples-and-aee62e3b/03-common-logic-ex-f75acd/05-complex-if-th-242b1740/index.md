# Complex If/Then Expressions Using Case Tables

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/WCOVComplexIfThenExpresCaseTables.html)  
> 获取日期：2026-11-12

<a id="wwID0EJ2NT"></a>

<a id="wwID0EZ2NT"></a>

In many situations, a simple If/Then expression is not sufficient. For example, you may have a complex set of input conditions and multiple corresponding output values.

<a id="wwID0E52NT"></a>

In this case, the suggested approach is to establish a case table, as before, but with many more columns. Have some of the columns represent the input conditions and other columns represent the output conditions. Consider the following example:

| askMaterial | askTrim | askInlay | supportMaterial | legMaterial |
| --- | --- | --- | --- | --- |
| Oak | Walnut | White | Oak | Walnut |
| Oak | Walnut | Black | Walnut | Oak |
| Oak | Cherry | White | Oak | Walnut |
| Oak | Cherry | Black | Walnut | Oak |
| Maple | Cherry | White | Maple | Cherry |
| Maple | Cherry | Black | Cherry | Maple |
| Maple | Walnut | White | Maple | Cherry |
| Maple | Walnut | Black | Walnut | Maple |

<a id="wwID0EWMOT"></a>

In this example, a rectangular table has a top with three different material combinations: the material of the top, the material of the trim and the color of the inlay. The first three columns of this case table represent these values.

<a id="wwID0E2MOT"></a>

Based on these selections, the material for the support and the legs of the table are automatically selected – as shown by the last two columns of this case table.

<a id="wwID0EANOT"></a>

After the values of askMaterial, askTrim, and askInlay are specified by the user, the case table assigns the corresponding values for supportMaterial and legMaterial.

<a id="wwID0EFNOT"></a>

For example, if the user selects a material of Maple, a trim of Cherry and a White Inlay, the support is defined as Maple and the legs are defined as Cherry.
