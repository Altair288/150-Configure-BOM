# Configuring Standard and Alternate Behaviors

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsFilteringDelegateConfiguringBehaviors.html)  
> 获取日期：2026-11-12

<a id="wwID0ERYLS"></a>

<a id="wwID0EFZLS"></a>

You can customize the behavior of the Standard and Alternate Option Filter by providing a configuration file for each method. A configuration file specifies the conditions for filtering a module variant, with the consideration of the following criteria:

<a id="wwID0E5ZLS"></a>

- The specified filtering type:

<a id="wwID0ED2LS"></a>

- Standard

<a id="wwID0EF3LS"></a>

- Alternate

<a id="wwID0EI4LS"></a>

- The parent/child type combinations

<a id="wwID0EK5LS"></a>

- Where the expression is assigned:

<a id="wwID0EP6LS"></a>

- On an item

<a id="wwID0ERAMS"></a>

- On a usage link

<a id="wwID0ETBMS"></a>

- On an occurrence

<a id="wwID0EWCMS"></a>

- The result of the evaluation of the assigned expression:

<a id="wwID0E2DMS"></a>

- TRUE

<a id="wwID0E4EMS"></a>

- FALSE

<a id="wwID0E6FMS"></a>

- UNDEFINED

<a id="wwID0ETGMS"></a>

The two configuration files are registered in the WT\_HOME/wt.properties file under the properties:

<a id="wwID0EQHMS"></a>

- ato.filter.strategy.1 – for the standard behavior

<a id="wwID0EVIMS"></a>

- ato.filter.strategy.2 – for the alternate behavior

<a id="wwID0EKJMS"></a>

The out-of-the-box values of the properties in the wt.properties file are as follows:

<a id="wwID0EXJMS"></a>

ato.filter.strategy.1=$(wt.home)/codebase/com/ptc/windchill/option/filter/StandardFilterStrategy.xml<br><br>ato.filter.strategy.2=$(wt.home)/codebase/com/ptc/windchill/option/filter/AlternateFilterStrategy.xml<br>

<a id="wwID0EBKMS"></a>

## Custom XML Parsers

<a id="wwID0EFKMS"></a>

The root of any Option filtering configuration file is the FilterStrategy element. Its only attribute is the “handler” whose value is the fully qualified name of the class that parses the XML file, and it produces an instance of an object FilterStrategy from the com.ptc.windchill.option.filter package. Specifically, the XML handler must implement the interface com.ptc.windchill.option.filter.FilterStrategyhandler with a single method that is defined, and passes through the root element FilterStrategy of the XML file, as shown in the following example.

<a id="wwID0E5KMS"></a>

public FilterStretegy loadfilterStrategyHandler(org.w3c.dom.Element e);

<a id="wwID0EDLMS"></a>

This attribute gives you an ability to provide your own XML format for creating custom filter strategies. However, in most situations, using the standard handler com.ptc.windchill.option.filter.DefaultFilterStrategyHandler for the OOTB XML format suffices. The standard handler is defined as:

<a id="wwID0EILMS"></a>

com.ptc.windchill.option.filter.DefaultFilterStrategyhandler

<a id="wwID0ESLMS"></a>

## Format of Standard XML Configuration Files

<a id="wwID0EWLMS"></a>

The root element, FilterStrategy, is comprised of the FilterNode, which contains expression evaluation policies for a given type of an object.

<a id="wwID0EDMMS"></a>

The FilterNode element has the following attributes that fully characterize a navigation unit node object participating in the filter process:

| Attribute | Definition and Values |
| --- | --- |
| type | The type or class type of the filterable or supporting object. |
| parentType | The type or class type of the parent object of the filterable object. |
| childType | The type or class type of the resolved child object of the filterable object. |

<a id="wwID0ETQMS"></a>

For example, in a common case, the filterable object is an instance of WTPartUsageLink. Its parent object is the parent WTPart of the usage link, and its child object is the resolved WTPart of the child WTPartMaster of the usage link. Note that you must specify at least one of the three attributes of the “FilterNode” element. The filter nodes are matched against the node objects in the order specified in the XML file. This returns the first policy that matches.

<a id="wwID0E3QMS"></a>

## Expression Policies

<a id="wwID0EARMS"></a>

Each FilterNode element must have one or two basic and/or advanced ExpressionPolicy subelements.

<a id="wwID0EJRMS"></a>

The ExpressionPolicy element has the following attributes that describe if the policy is applicable to basic or advanced expressions, and the conditions for filtering structure nodes based on the presence and the value of advanced expressions, as shown in the following table.

<table border="1">
              <tr>
                <th>
                  <div id="wwID0EQSMS">Attribute</div>
                </th>
                <th>
                  <div id="wwID0E2SMS">Definition and Values</div>
                </th>
              </tr>
              <tr>
                <td>
                  <div id="wwID0EOTMS">advanced</div>
                </td>
                <td>
                  <div id="wwID0EZTMS">Specifies if the policy is applied to advanced (if the value is TRUE), or basic (if the value is FALSE).</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div id="wwID0EIUMS">mode</div>
                </td>
                <td>
                  <div id="wwID0ETUMS">The list of conditions to filter out the node. The mode can list one or several of the following constants:</div>
                  <div>
                    <table border="1">
                      <tr>
                        <td>
                          <div id="wwID0EWVMS">Constant</div>
                        </td>
                        <td>
                          <div id="wwID0ECWMS">Description</div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div id="wwID0EQWMS">STANDARD</div>
                        </td>
                        <td>
                          <div id="wwID0E1WMS">Filter out the node when the expression value is FALSE.</div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div id="wwID0EIXMS">UNDEFINED</div>
                        </td>
                        <td>
                          <div id="wwID0ESXMS">Filter out the node if the expression value is UNDEFINED.</div>
                        </td>
                      </tr>
                    </table>
                  </div>
                </td>
              </tr>
            </table>

<a id="wwID0EDYMS"></a>

## Mode Attribute for Basic Expressions

<a id="wwID0EHYMS"></a>

The mode attributes for a basic expression are as follows:

| Attribute | Definition and Values |
| --- | --- |
| STANDARD | The standard filtering for choices (basic expressions) is different from the filtering based on advanced expressions. In the choices-based algorithm, the choices assigned to the filterable object (usage link) and the end node (child part) object are combined and then matched as a combined set against the set of user selections in the filter. |
| UNDEFINED | If you consider the set of options whose choices are assigned to the object, then the mode is UNDEFINED if and only if the filter contains an option from this set that has no user selections. |
