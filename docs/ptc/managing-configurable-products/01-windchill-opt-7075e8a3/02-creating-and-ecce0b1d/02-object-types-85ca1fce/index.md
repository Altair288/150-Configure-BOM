# Object Types Used in List-based Option Selection

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsObjectTypes.html)  
> 获取日期：2026-11-12

<a id="wwID0EGBRQ"></a>

<a id="wwID0EWBRQ"></a>

The following objects are used to support product configurations:

| Icon | Object | Definition | Characteristics |
| --- | --- | --- | --- |
|  | Advanced Expression | An expression that uses choices and operators to specify the conditions when a part should be included in the product structure. It can be assigned to a part or part usage link. |  |
|  | Basic Expression | Choices assigned to a part or part usage link to specify the conditions when a part should be included. |  |
| ![](../../../../images/81be253d2416_IconOption.gif) | Option | A capability of a product which may have multiple choices. | • Two types of options are available out of the box: Design and Sales. Administrators can add attributes for each type. Note: To add attributes to the Sales option type, set the instantiable setting for the Sales type to yes. • An option can be defined as Required and Single Selection. • Has a globally unique number set by the Object Initialization Rules (not controlled by the user). |
| ![](../../../../images/849f3ff05368_IconChoice.gif) | Choice | A value of an option that describes the selectable capabilities of the product. Out-of-the-box, two subtypes are supported: Sales Choice and Design Choice. Sales choices may be closely associated with sales configurator inputs and related with exclude rules or dependencies on other sales choices. Design choices are related to supported design implementations of the product. | • Administrators can add attributes for each type. To add attributes to the Sales option type, set the instantiable setting for the Sales choice to yes. • Lifecycle and change-managed object. • Effectivity can be defined for choices. • Can be linked to parameter values used in advanced selection logic. • Has a globally unique number set by the Object Initialization Rules (not controlled by the user). |
| ![](../../../../images/3c987c738e42_IconChoiceRules.gif) | Conditional Rule | Uses expressions to specify which option choices should be available for filtering. | Can be global or local. Has a globally unique number set by the Object Initialization rules (not controlled by the user). |
| ![](../../../../images/36da85ef99c9_IconSetAttribGroup.gif) | Group | A way of categorizing options around a common principle or capability to make them easier to manage. |  |
| ![](../../../../images/3c987c738e42_IconChoiceRules.gif) | Enable Rule | Makes only certain choices available for selection once a target choice is selected. | Can be global or local. Has a globally unique number set by the Object Initialization rules (not controlled by the user). |
| ![](../../../../images/3c987c738e42_IconChoiceRules.gif) | Include Rule | Associates choices that should be selected together. | Can be global or local. Has a globally unique number set by the Object Initialization rules (not controlled by the user). |
| ![](../../../../images/3c987c738e42_IconChoiceRules.gif) | Exclude Rule | Defines incompatible choices, which should not be selected together. | Can be global or local. Has a globally unique number set by the Object Initialization rules (not controlled by the user). |
| ![](../../../../images/137bc576f81f_IconOptionSet.gif) | Option Set | A collection of options, choices, and rules used to define configurations within a product family or functional module. | • Lifecycle and change-managed object. • Must be assigned to a product/library/part to be used for choice assignment and filtering. • Can have relationships defined among choices to include, exclude, or enable associated choices. |
| ![](../../../../images/2d1ec7a4fc42_iconConfigurablePart.gif) | Configurable Module | An organizing part that is included in a product structure to define one or more variations of specific product functions or capabilities. | • Lifecycle and change-managed object. • Can have choices assigned to child parts or usage of child parts, or to the part itself. • Can include an advanced selection logic for part configuration. |
