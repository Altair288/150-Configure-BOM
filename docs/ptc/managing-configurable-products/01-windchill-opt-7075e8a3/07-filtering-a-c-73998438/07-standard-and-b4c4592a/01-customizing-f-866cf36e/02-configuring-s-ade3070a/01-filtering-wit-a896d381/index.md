# Filtering with Missing Expressions

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsFilteringWithMissingExpressions.html)  
> 获取日期：2026-11-12

<a id="wwID0ER5MS"></a>

<a id="wwID0EF6MS"></a>

One can also specify case where an object of a navigation unit can be filtered if it is missing an expression. The corresponding element has the following form:

<a id="wwID0EL6MS"></a>

<FilterMissingExpression type="filterable or occurrence" parentType=”start node of the navigation unit” childType=”end node of the navigation unit”/>

<a id="wwID0EV6MS"></a>

In most common situations a filterable object is a link between the resolved parent (“start”) and child (“end”) nodes of a structure such as WTPartUsageLink between a parent part and a resolved child part in the standard ATO case. The expression is considered missing from a navigation unit (parent + link + child) if neither the filterable object nor the end unit have an expression – basic or advanced. For example, the following policy specifies that if a usage link connects the parts of types ABCPart and CBSPart then it will be filtered out if neither the child CBSPart nor the usage link have an expression assigned:

<a id="wwID0E16MS"></a>

<FilterMissingExpression type="wt.part.WTPartUsageLink" parentType=”wt.part.ABCPart” childType=”wt.part.CBSPart”/>

<a id="wwID0EEANS"></a>

Similar “missing expression” policies can be defined for an occurrence. For example, the following policy specifies that occurrences whose usage link connects the parts of types ABCPart and CBSPart will be filtered out if they do not have an expression assigned:

<a id="wwID0EJANS"></a>

<FilterMissingExpression type="wt.part.PartUsesOccurrence" parentType=”wt.part.ABCPart” childType=”wt.part.CBSPart”/>
