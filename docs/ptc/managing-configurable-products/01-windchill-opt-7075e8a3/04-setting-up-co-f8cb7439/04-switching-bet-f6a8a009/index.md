# Switching Between a Standard Part and a Configurable Module

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsPartConfigSwitch.html)  
> 获取日期：2026-11-12

<a id="wwID0E3LWR"></a>

<a id="wwID0EMMWR"></a>

You can change an existing part from a standard part to a configurable module, and vice versa. When you switch a part from a configurable module to a standard part, the part no longer supports special features available for configurable modules, such as the expression assignment or advanced selection logic.

|  |  |
| --- | --- |
| **![\*](../../../../images/887c9a51d571_tip_16x16.png)** | You can also use **Save As** to create a copy of the standard part, and then change the copied part to configurable. |

<a id="wwID0ETNWR"></a>

To switch the part between a standard and a configurable module:

<a id="wwID0EMOWR"></a>

1. Right-click the part and click **Edit Common Attributes**.

<a id="wwID0ESPWR"></a>

2. In the **Edit Common Attributes** window, change the selection of the attribute **Configurable Module**.

|  |  |
| --- | --- |
| **![\*](../../../../images/887c9a51d571_tip_16x16.png)** | If you changed the part from standard to configurable, you can also specify if it should be collapsible by setting the **Collapsible** attribute. If the part is defined as collapsible, then when generating a variant, it is replaced by its child standard part, and the quantity of standard parts is adjusted accordingly. |

<a id="wwID0E3RWR"></a>

3. Click **OK** to finish the editing process and check in the part.

<a id="wwID0EXSWR"></a>

## Restrictions on Changing a Configurable Module to a Standard Part

<a id="wwID0E2SWR"></a>

When you try to change a configurable module to a standard part, the system performs the following checks on all versions of the part:

<a id="wwID0EUTWR"></a>

- If the selected part has related variant specifications

<a id="wwID0EWUWR"></a>

- If the selected part has related variant parts

<a id="wwID0EYVWR"></a>

- If the selected part has related configurable CAD documents (configurable modules or configurable products)

<a id="wwID0E1WWR"></a>

- If the selected part has a logical reference to other configurable modules

<a id="wwID0ETSWR-2"></a>

If the part has associations with any of the listed objects, the system prevents you from switching the part to standard, and issues an error message. The same restrictions apply to a configurable product.
