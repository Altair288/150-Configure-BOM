# Including Options and Choices with Numeric or Boolean Values in Expressions and Conditional Rules

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsNumOptInExpress.html)  
> 获取日期：2026-11-12

<a id="wwID0EUPXQ"></a>

<a id="wwID0EEQXQ"></a>

Numeric choices can be included in logical expressions used in advanced assigned expressions and conditional rules. The next table shows some examples of using numeric options and choices in logical expressions.

| Example of logical expression | Explanation |
| --- | --- |
| WB19 | Wheel Base = 19 |
| Red + <FS22 | Color = Red + Frame Size < FS22 |
| >=WB25/<FS30 | Wheel Base >= WB25 / Frame Size <= FS30 |
| > = FS18 + <= FS28 | Frame Size >= FS18 + Frame Size <= FS28 |
| (>= FS18 + <= FS28) / (>= WB25 + <= WB35) | (Frame Size >= FS18 + Frame Size <= FS28) / (Wheel Base >= WB25 + Wheel Base <= WB35) |

<a id="wwID0E3VXQ"></a>

## Format for Using Numeric Options and Choices in Expressions

<a id="wwID0EAWXQ"></a>

The format for including numeric choices in expressions is described in the next table.

| Format | Example of Using an Abbreviated Definition | Explanation |
| --- | --- | --- |
| numeric\_choice | WB10 | Wheel Base = WB10 |
| ! numeric\_choice | ! WB10 | Wheel Base =! WB10 |
| < numeric\_choice | < WB10 | Wheel Base <WB10 |
| > numeric\_choice | WB10 | Wheel Base > WB10 |
| <= numeric\_choice | <= WB10 | Wheel Base <= WB10 |
| >= numeric\_choice | >= WB10 | Wheel Base >= WB10 |

> ![\*](../../../../../../images/6652ad397dd1_note_16x16.png) **Note:** In expression, a numeric choice is referenced by name or number, depending on how the format for using choices in expressions is configured

<a id="wwID0EZAYQ"></a>

## Numeric Choices in Conditional Rules

<a id="wwID0E4AYQ"></a>

Numeric choices can be used both in the IF and THEN portions of conditional rules. The following are some examples of using numeric choices in conditional rules:

<a id="wwID0ECBYQ"></a>

IF (Color = Red AND Wheel\_Base > Radius-24) THEN Include Choice1, Choices2

<a id="wwID0EHBYQ"></a>

IF (Size = Large) THEN Enable Wheel\_Base = Radius-52, Radius-60

<a id="wwID0ERBYQ"></a>

## Boolean Choices in Conditional Rules

<a id="wwID0EVBYQ"></a>

Boolean choices can be used both in the IF and THEN portions of conditional rules. However, when creating expressions using a boolean options, you cannot specify boolean choices directly. Instead, specify the boolean option name or number based on the preference **Choice Display Format**, and the negation character as specified in the ato.negation.operator property. The following is an example of using boolean choices in conditional rules:

<a id="wwID0ECCYQ"></a>

IF (“Is Wireless”) THEN Include (Communication = “Wireless”)<br>IF (Voltage = “+24” OR Communication = “Modem”) THEN Include (-“Is Heavy Duty”)<br>
