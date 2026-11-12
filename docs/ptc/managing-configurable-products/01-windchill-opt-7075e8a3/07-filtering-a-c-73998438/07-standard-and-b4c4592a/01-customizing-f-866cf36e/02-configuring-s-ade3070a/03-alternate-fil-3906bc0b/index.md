# Alternate Filtering Configuration File Example

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsFilteringDelegateAlternateConfigurationFileExample.html)  
> 获取日期：2026-11-12

<a id="wwID0E5CNS"></a>

<a id="wwID0EODNS"></a>

The out-of-the-box file for configuring the alternate Option filtering behavior is as follows:

<a id="wwID0ETDNS"></a>

<?xml version="1.0" encoding="UTF-8"?><br><FilterStrategy handler="com.ptc.windchill.option.filter.DefaultFilterStrategyHandler"><br><FilterNode type="wt.option.ExpressionAssignable"><br><ExpressionPolicy advanced="true" mode="STANDARD,UNDEFINED"/><br></FilterNode><br><FilterNode type="wt.option.ChoiceMappable"><br><ExpressionPolicy advanced="false" mode="STANDARD,UNDEFINED"/><br></FilterNode><br></FilterStrategy>

<a id="wwID0EZDNS"></a>

Note that the only difference with the standard filtering mode is that a filter node will be filtered out if the expression contains an undefined choice or it evaluates to false.
