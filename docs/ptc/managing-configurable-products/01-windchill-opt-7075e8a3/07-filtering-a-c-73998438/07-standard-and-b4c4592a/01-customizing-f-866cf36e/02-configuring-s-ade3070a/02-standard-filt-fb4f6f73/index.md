# Standard Filtering Configuration File Example

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsFilteringDelegateStandardConfigurationFileExample.html)  
> 获取日期：2026-11-12

<a id="wwID0EIBNS"></a>

<a id="wwID0EYBNS"></a>

The out-of-the-box file for configuring the standard Option filtering behavior is as follows:

<a id="wwID0E4BNS"></a>

<?xml version="1.0" encoding="UTF-8"?><br><FilterStrategy handler="com.ptc.windchill.option.filter.DefaultFilterStrategyHandler"><br><FilterNode type="wt.option.ExpressionAssignable"><br><ExpressionPolicy advanced="true" mode="STANDARD"/><br></FilterNode><br><FilterNode type="wt.option.ChoiceMappable"><br><ExpressionPolicy advanced="false" mode="STANDARD"/><br></FilterNode><br></FilterStrategy>

<a id="wwID0EDCNS"></a>

Note that the Option filtering delegate provides customization hooks to help various types of customers (including PTC teams supporting other products such as MPMLink or Arbortext) define which navigation unit objects they consider filterable or supporting in the filtering process. The filtering expression policies will be applied after this determination is made to further restrict the set of objects for which basic or advanced expressions will be retrieved.

<a id="wwID0EHCNS"></a>

The policy above means that we shall extract choices for all ChoiceMappable objects. The customization hooks will narrow these objects down. For example, the Option teams has an additional requirement that the filterable implements a GenericizableUsageLink whose parent’s Genericizable has the type “generic”, etc. This type of restriction cannot be added to the configuration file because MPMLink does not have this condition. It is not possible to extract expressions for all expression assignable objects because the mode is STANDARD, the node is filtered out only when the expression on a filterable (e.g. WTPartUsageLink) or a supporting object (e.g. WTPart) evaluates to FALSE.
