# Linking Advanced Logic Parameters with Options

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsParamValuesToChoices.html)  
> 获取日期：2026-11-12

<a id="wwID0E4JFT"></a>

<a id="wwID0EOKFT"></a>

In order to create some advanced expressions, you can share the value of a selected option during the Configure process with the advanced selection logic. The part must be assigned an option set either directly or through its product.

<a id="wwID0EUKFT"></a>

To link a parameter to an option, you need to add an expression to the advanced selection logic defined for this configurable module. The expression must have the following syntax:

<a id="wwID0EZKFT"></a>

<parameter\_name>==optionSet.<option\_name>

<a id="wwID0ENLFT"></a>

where:

<a id="wwID0EGMFT"></a>

- <parameter\_name>– the name of the parameter that you want to link.

<a id="wwID0EMNFT"></a>

- optionSet– this string needs to be entered exactly as given here, following the same capitalization.

<a id="wwID0EROFT"></a>

- <option\_name>—the option to which you want to link the parameter.

<a id="wwID0EIPFT"></a>

For example, you may want to link a parameter VoltageSetting to an option Voltage. When a user selects choices for the option Voltage in the Set Filter step of the Configure process, the selected choices are passed to the parameter VoltageSetting as a list of allowed values.

<a id="wwID0E5PFT"></a>

To add a link between the VoltageSetting parameter and the Voltage option:

<a id="wwID0E6QFT"></a>

1. Open a configurable module in the Part Structure Browser.

<a id="wwID0EBSFT"></a>

2. Go to the **Constraints** tab and create a constraint for the VoltageSetting parameter, selecting **Expression** as the type. Enter the name for the constraint.

<a id="wwID0EPTFT"></a>

3. Enter the following expression and click **Apply**:

<a id="wwID0EEUFT"></a>

1. VoltageSetting==optionSet.Voltage

<a id="wwID0E3UFT"></a>

4. Save your changes.

<a id="wwID0E5VFT"></a>

5. When this configurable module is evaluated in the Configure process, the selected choices of the Voltage option are shared with the VoltageSetting parameter. In addition, optionSet.Voltage may be used in other advanced logic expressions.
