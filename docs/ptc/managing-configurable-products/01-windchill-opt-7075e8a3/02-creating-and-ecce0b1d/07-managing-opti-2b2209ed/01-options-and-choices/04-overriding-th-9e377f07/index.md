# Overriding the Units of Measure for Options with Numeric Values

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsOverridingTheUnitOfMeasure.html)  
> 获取日期：2026-11-12

<a id="wwID0EWIXQ"></a>

<a id="wwID0EGJXQ"></a>

You can specify different display units for entering the values for the choices with numeric values. The default units are set for the site. The default measurement system is set by the preference **Measurement system**.

<a id="wwID0EQJXQ"></a>

To override the default units for entering value for numeric choices:

<a id="wwID0EJKXQ"></a>

1. Right-click an option in the option pool and click **Edit**.

<a id="wwID0EPLXQ"></a>

2. In the **Edit** window, click **Next** to go the **Display Units** step.

<a id="wwID0E4MXQ"></a>

3. The **Display Units** table lists the measurement systems defined for the site. The default system is marked with \*. Enter the units that you want to use for the selected measurement system. For example, if the default unit for the SI measurement system is meter, you can specify to use “mm” (millimeters) when entering values for this option.

<a id="wwID0EUNXQ"></a>

Once the default unit of measure is overridden by another unit, Windchill converts existing numeric values of the choices associated with that option to its equivalent in the new unit of measure. For example, if “km” is overridden by “m”, then all numeric values previously shown in “km”, displays the equivalent numeric values in “m” using the conversion formula 1 km = 1000 m.

<a id="wwID0EGOXQ"></a>

For information about entering values in Windchill, see [Supported Unit Strings](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/typeattr/TypeMgrUnitStringsSupported.html).
