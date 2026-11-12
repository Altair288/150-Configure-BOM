# Equivalency Tab of the Edit Parameter Window

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsEditParamEquivTab.html)  
> 获取日期：2026-11-12

<a id="wwID0EYX6S"></a>

<a id="wwID0EIY6S"></a>

This tab allows you to specify an equivalency between this parameter and the parameters of any child configurable modules.

> ![\*](../../../../../../images/6652ad397dd1_note_16x16.png) **Note:** This tab is only enabled if the configurable module has child configurable modules.

<a id="wwID0EMZ6S"></a>

An equivalency is used to define a bidirectional equality between two parameters. For example, if an equivalency is established between two integer parameters (width and length), then if either of the parameters (width or length) is assigned a value, the other parameter is automatically assigned the same value.

<a id="wwID0ERZ6S"></a>

An equivalency, such as X == Y , is not the same as an assignment, such as X == a + b. This is because when the value of either parameter in an equivalency is changed, the value of the other parameter will also be changed in the same manner.

<a id="wwID0EA16S"></a>

Equivalencies are most commonly used to pass information between parameters of different parts of the product structure, such as between a parent configurable module and a child configurable module.

<a id="wwID0EF16S"></a>

The table displayed on this tab allows you to specify one or more rows. The following columns are displayed:

| Field | Description |
| --- | --- |
| **Descendent** | Specifies whether the equivalency applies to the child configurable module or to all child configurable modules. The desired child configurable module can be selected from the drop-down list. |
| **Parameter** | Specifies the equivalent parameter in the child part. The drop-down list displays all parameters selectable for the defined configurable module. |
| **Value** | Indicates if the equivalency represents an actual or default value. |
