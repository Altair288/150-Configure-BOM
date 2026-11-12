# Restricting the Number of Child Parts

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsConfigPartChildRestr.html)  
> 获取日期：2026-11-12

<a id="wwID0EBYWR"></a>

<a id="wwID0ESYWR"></a>

You can restrict the number of child parts that are allowed for a configurable module by specifying the Minimum Required and Maximum Allowed attributes on the configurable module. If a variant solution selected for the configurable module violates the prescribed range, the system shows a warning and prevents you from creating a variant.

<a id="wwID0EXYWR"></a>

You can specify the minimum and maximum number of child parts while creating or editing the configurable module. To do this while editing:

<a id="wwID0EUZWR"></a>

1. Check out the part and click **Edit**.

<a id="wwID0E11WR"></a>

2. Change the values for **Minimum Required** and **Maximum Allowed**. Click **Finish** to close the **Edit Part** window.

<a id="wwID0EM3WR"></a>

3. Check in the part back.

<a id="wwID0ED4WR"></a>

## Disabling the Restriction on the Number of Child Parts

<a id="wwID0EH4WR"></a>

If you select **Disable Rule Checking** when using the **Option Filter** tab (during the Set Filter step of the part configuration process), the system skips the verification step for the Minimum Required and Maximum Allowed child parts, allowing you to create a variant part that violates the constraint on the number of the child parts.
