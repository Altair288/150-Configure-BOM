# Standard and Alternate Option Filter

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsStandardAlternateOptionFilter.html)  
> 获取日期：2026-11-12

<a id="wwID0EAZJS"></a>

> ![\*](../../../../images/6652ad397dd1_note_16x16.png) **Note:** Ability to set the filtering model is an advanced capability subject to a separate license entitlement.

<a id="wwID0EM1JS"></a>

When filtering a configurable product structure with assigned expressions, companies can choose one of the following filtering methods provided out-of-the-box:

<a id="wwID0EF2JS"></a>

- Standard filter – (Default) Shows all configurable modules, unless the assigned expression evaluates as FALSE. If the expression is undefined, the expression is evaluated as TRUE.

<a id="wwID0EH3JS"></a>

- Alternate filter – Filters out all configurable modules, unless the assigned expression evaluates as TRUE. If the expression is undefined, the expression is evaluated as FALSE.

<a id="wwID0E13JS"></a>

For example, you may have an option COLOR with choices Red, Green, Blue, and have assigned a basic expression “Red/Blue” to a usage link of a module variant.

<a id="wwID0EI5JS"></a>

- If you select Red in the Option Filter, the expression evaluates to TRUE.

<a id="wwID0EO6JS"></a>

- If you select Green in the Option Filter, the expression evaluates to FALSE.

<a id="wwID0EUAKS"></a>

- If you make no selections for the option COLOR, the expression evaluates to Undefined.

<a id="wwID0ELBKS"></a>

Out-of-the-box, the standard and alternate filtering methods differ in the way they treat expressions that evaluate to Undefined. If the assigned expression has a choice that belongs to an option for which the user did not make any choice selection in the Option Filter, then the assigned expression is undefined.

<a id="wwID0EQBKS"></a>

Evaluation of an assigned expression uses the short-circuit method:

<a id="wwID0EJCKS"></a>

- If TRUE OR X => TRUE (If the expression uses the OR operator, and at least one selection matches the assignment, the whole expression is evaluated as TRUE.)

<a id="wwID0EPDKS"></a>

- If FALSE AND X => FALSE (If the expression uses the AND operator, and at least one selection does not match the assignment, the whole expression is evaluated as FALSE.)

<a id="wwID0EGEKS"></a>

where X represents TRUE, FALSE, or Undefined.

<a id="wwID0EPEKS"></a>

## An Example of Using Standard and Alternate Filter

<a id="wwID0ETEKS"></a>

Consider an option set with the following options and choices:

<a id="wwID0ELFKS"></a>

- Color

<a id="wwID0EQGKS"></a>

- Red

<a id="wwID0ESHKS"></a>

- Blue

<a id="wwID0EUIKS"></a>

- Green

<a id="wwID0EXJKS"></a>

- Size

<a id="wwID0E3KKS"></a>

- Small

<a id="wwID0E5LKS"></a>

- Medium

<a id="wwID0EANKS"></a>

- Large

<a id="wwID0ETNKS"></a>

Suppose that a part has an assigned expression: Blue AND Medium

<a id="wwID0E2NKS"></a>

Consider the following scenarios:

<a id="wwID0ETOKS"></a>

- If you select Blue and Medium in the Option Filter, the assigned expression evaluates to TRUE.

<a id="wwID0EAQKS"></a>

- Using the Standard filter - the part is not filtered.

<a id="wwID0ECRKS"></a>

- Using the Alternate filter - the part is not filtered.

<a id="wwID0EFSKS"></a>

- If you select Red and/or Small in the Option Filter, the assigned expression evaluates to FALSE.

<a id="wwID0ESTKS"></a>

- Using the Standard filter - the part is filtered.

<a id="wwID0EUUKS"></a>

- Using the Alternate filter - the part is filtered.

<a id="wwID0EXVKS"></a>

- If you select a Color=Blue and make no selection for the Size, or you select Size=Medium and make no selection for the color, the assigned expression cannot be evaluated and is considered undefined.

<a id="wwID0EIXKS"></a>

- Using the Standard filter - the part is not filtered.

<a id="wwID0EKYKS"></a>

- Using the Alternate filter - the part is filtered.

<a id="wwID0ECZKS"></a>

## Selecting the Filtering Method

<a id="wwID0EGZKS"></a>

To select the filtering method, select **Standard** or **Alternate** from the toolbar dropdown list in the following locations:

<a id="wwID0EH1KS"></a>

- The **Option Filter** tab in the **Edit Filter** window.

<a id="wwID0ER2KS"></a>

- The **Preview** window for previewing the option set.

<a id="wwID0EX3KS"></a>

- The **Set Filter** step of the **Configure** window.

<a id="wwID0ER4KS"></a>

![](../../../../images/ab744b314cb5_StandardAlternate.png)
