# Defining Part Parameters Using Another Configurable Module

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsPartParamRefPartEx.html)  
> 获取日期：2026-11-12

<a id="wwID0E24BT"></a>

<a id="wwID0EM5BT"></a>

You can create a logic reference between two configurable modules and map selected parameters, so that the parameters of the **driven part** obtain their values from the **driving part**. A logic reference is created in the driven part, pointing to the driving part.

<a id="wwID0E35BT"></a>

Not all parameters in the driven part come from the referenced part – only those constrained by an expression that maps its values to the values of the referenced part’s parameters. The names of the mapped parameters do not have to match. For example, you can relate parameter color in one configurable module to the parameter ext\_color in another configurable module. The syntax for the expression is the following:

<a id="wwID0EK6BT"></a>

<name of driven parameter> == <Name of logic reference>.<name of driving parameter>

<a id="wwID0EKACT"></a>

## Example: Mapping Parameter Values between Two Configurable Modules

<a id="wwID0EOACT"></a>

The following example illustrates how parameters color and material defined for the part TOP can get their values from similar parameters defined for the configurable module EXT.

<a id="wwID0EDBCT"></a>

To associate parameter values, do the following:

<a id="wwID0E3BCT"></a>

1. Make sure the EXT part has the parameters whose values you want to reference. If they do not yet exist, open the part in the Part Structure Browser and create the parameters, for example ext\_color and ext\_material. When defining these parameters, you may want to include a page break after these parameters, so they are listed separately during the part configuration process. Additionally, if you want to be able to select multiple values for each parameter, enable multi-selection by setting the multi-select property on the **User Interface** tab of the **Edit Parameter** window.

<a id="wwID0ESDCT"></a>

2. Add a logic reference from the part TOP to another configurable module, EXT. Enter the name for the logic reference, for example, EXTREF.

<a id="wwID0EAFCT"></a>

3. Open the TOP part in the Part Structure Browser.

<a id="wwID0EGGCT"></a>

4. Open the **Parameters** tab and create two parameters, color and material. If you want to be able to select multiple values for each parameter, enable multi-selection.

<a id="wwID0EUHCT"></a>

5. Constrain the values for these parameters by referencing parameters from the part EXT. To do this, click the **Constraints** tab in the Part Structure Browse.

<a id="wwID0E5ICT"></a>

6. For each parameter, specify an expression that determines parameter value based on the referenced parameter. For example, to determine the color values based on the values of the parameter ext\_color of the part EXT, create this expression:

<a id="wwID0E2JCT"></a>

1. color == EXTREF.ext\_color

<a id="wwID0ECKCT"></a>

1. Similarly, specify the expression for the material.

<a id="wwID0ELKCT"></a>

1. material== EXTREF.ext\_material

<a id="wwID0EDLCT"></a>

7. To validate the logic, use the **Configure** action to configure the part EXT and then the part TOP. Notice that when you select values for the ext\_color and ext\_material for the EXT part, these values are available for selection when you configure the part TOP. For example, if you defined color\_ext for EXT as red and green, these two choices are available for you to select when you define color for the part TOP.
