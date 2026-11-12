# Filtering Occurrences with Assigned Expressions

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsFilterOccurrences.html)  
> 获取日期：2026-11-12

<a id="wwID0EKLIS"></a>

<a id="wwID0E1LIS"></a>

The Option filtering delegate filters occurrences in the part structure tree and in the **Occurrences** table.

> ![\*](../../../../images/6652ad397dd1_note_16x16.png) **Note:** The Option filtering delegate filters occurrences in the part structure tree only if the tree is in the “occurrence” mode (that is, the **Show Occurrences** menu option was selected).

<a id="wwID0EENIS"></a>

You can assign basic or advanced expressions to an occurrence. The logic for filtering occurrences is the same as for filtering usage links. The only difference is that when filtering usage links, the system combines expressions assigned to the usage link with those assigned to the child part. When filtering occurrences, the Option filter relies only on the expressions assigned to the occurrence.

<a id="wwID0EJNIS"></a>

Companies can configure the standard and alternate filtering behavior for occurrences. In particular, you can define certain special filtering policies for occurrences.

<a id="wwID0EONIS"></a>

The out-of-the-box behavior filters out the occurrences if the advanced expression evaluates to False (or if a basic expression cannot be matched against the choices selected in the filter).

<a id="wwID0ETNIS"></a>

The out-of-the-box alternate behavior filters out the occurrence if one of these conditions is true:

<a id="wwID0EMOIS"></a>

- The advanced expression evaluates to False

<a id="wwID0EPPIS"></a>

- The advanced expression cannot be evaluated

<a id="wwID0ERQIS"></a>

- The basic expression cannot be matched against the choices selected in the Options filter

<a id="wwID0ETRIS"></a>

- The basic expression contains choices of an option that has not been selected in the Options filter

<a id="wwID0EHSIS"></a>

A filtering policy for occurrences can be defined within the FilterNode tag as follows:

<a id="wwID0ERSIS"></a>

<FilterNode type="wt.part.PartUsesOccurrence" parentType=”<type of the parent type of the usage link of the occurrence>” childType=”<type of the child type of the usagelink of the occurrence>”>

<a id="wwID0EXSIS"></a>

The “parentType” and “childType” of the FilterNode element refer to the type of the parent part and the type of the resolved child part of the usage link for which the occurrence is defined.

<a id="wwID0E3SIS"></a>

For example, to apply the out-of-the-box alternate filtering logic for occurrences whose usage link connects parts of types ABCPart and CBSPart, define the following policy:

<a id="wwID0EBTIS"></a>

<FilterNode type="wt.part.PartUsesOccurrence" parentType=”wt.part.ABCPart” childType=”wt.part.CBSPart”><br><ExpressionPolicy advanced="true" mode="STANDARD,UNDEFINED"/><br></FilterNode>

<a id="wwID0EHTIS"></a>

You can also describe the occurrences to be filtered if they are missing an expression. The meaning of the attributes “type”, “partType” and “childType” of the “FilterMissingExpression”, are the same as those of the “FilterNode” element. For example, the following policy specifies that occurrences whose usage link connects the parts of types ABCPart and CBSPart will be filtered out if they do not have an expression assigned:

<a id="wwID0EMTIS"></a>

<FilterMissingExpression type="wt.part.PartUsesOccurrence" parentType=”wt.part.ABCPart” childType=”wt.part.CBSPart”/>

<a id="wwID0ESTIS"></a>

Note that an occurrence is subordinate to its usage link—it exists only in the context of its usage link. Therefore, an occurrence of a given usage link is filtered by the Option filtering delegate only after its usage link has been examined by the Option filtering delegate and has been retained in the filtering process. If all occurrences of a usage link are filtered out, this also filters out the usage links. As a result, all corresponding usage links and occurrence nodes are removed from the part structure tree.
