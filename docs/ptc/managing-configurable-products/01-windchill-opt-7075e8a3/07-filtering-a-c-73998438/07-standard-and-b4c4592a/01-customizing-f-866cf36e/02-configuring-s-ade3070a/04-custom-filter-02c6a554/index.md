# Custom Filtering Configuration File Example

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsFilteringDelegateCustomConfigurationFileExample.html)  
> 获取日期：2026-11-12

<a id="wwID0EQENS"></a>

<a id="wwID0EAFNS"></a>

In this scenario, a user defined the subtypes of a WTPart (ABCPart, CBSPart, and NBCPart), a subtype FOXPartUsageLink of WTPartUsageLink, and created the following configuration file.

<a id="wwID0EFFNS"></a>

<?xml version="1.0" encoding="UTF-8"?><br><FilterStrategy handler="com.ptc.windchill.option.filter.DefaultFilterStrategyHandler"><br><br><FilterNode type="wt.option.ExpressionAssignable" parentType="wt.part.ABCPart" childType="wt.part.ABCPart"><br> <ExpressionPolicy advanced="true" mode="STANDARD,UNDEFINED"/><br></FilterNode><br><br><FilterNode parentType="wt.part.CBSPart" childType="wt.part.NBCPart"><br> <ExpressionPolicy advanced="true" mode="STANDARD,UNDEFINED "/><br></FilterNode><br><br><FilterNode type="wt.part.ABCPart"><br> <ExpressionPolicy advanced="true" mode="STANDARD "/><br> </FilterNode><br><br><FilterMissingExpression type="wt.part.FOXPartUsageLink"/><br> <FilterMissingExpression type="wt.part.PartUsesOccurrence" parentType=”wt.part.CBSPart” childType=”wt.part.NBCPart”/><br><br></FilterStrategy>

<a id="wwID0EKFNS"></a>

The configuration file defines the filtering algorithm with basic and advanced expressions as follows. For basic expressions, the choices are collected and matched against the choice in the filter only for the supporting child part of the usage link, if they are of types ABCPart or NBCPart. Choices from usage links and child parts of other types are ignored. There are four policies for the advanced expressions. In the order of appearance in the file, they mean the following:

<a id="wwID0ECGNS"></a>

- If the parent and child part of the usage link are of type ABCPart, filter out the usage link if the expression evaluates to FALSE or UNDEFINED.

<a id="wwID0EEHNS"></a>

- If the parent and child part of the usage link are of types CBSPart and NBCPart, respectively, filter out the usage link if the expression evaluates to FALSE or UNDEFINED.

<a id="wwID0EGINS"></a>

- If the item (child) part is of type ABCPart, filter out the usage link if the expression evaluates to FALSE.

<a id="wwID0EIJNS"></a>

- If the usage link is of the type FOXPartUsageLink, filter out the usage link if neither the usage link nor its child part has a basic or advanced expression assigned.

<a id="wwID0EKKNS"></a>

- If an occurrence for a usage link between the parts of the types CBSPart and NBCPart does not have an expression assigned, filter out the occurrence.
