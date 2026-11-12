# Evaluating Expressions During the Option Filtering

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsUnderstandFilteringWithExpressions.html)  
> 获取日期：2026-11-12

<a id="wwID0EF5HS"></a>

<a id="wwID0EV5HS"></a>

Two kinds of expressions are considered when filtering the usage link: expressions on the usage link and expressions on the child part of the usage link. If an expression on the child part exists, it is always used for filtering the configurable child part. If the part is non-configurable, then the expression is considered (and can be assigned using the user interface) only if the preference Allow Assignment of Expressions to Non-Configurable Items is set to true.

<a id="wwID0ED6HS"></a>

The usage link is filtered out if either one of the two kinds of expressions (in the case, when both kinds are present) evaluates to FALSE.

<a id="wwID0EM6HS"></a>

## Evaluations of Boolean Expressions

<a id="wwID0EQ6HS"></a>

During the filtering, the system evaluates the assigned expressions by comparing them with the selections made in the Option Filter. If some choices are selected for an option, then these selected choices are assigned the value true, while the unselected choices are assigned the value false. These values are substituted into the expression, and the expression is evaluated. The short-circuit evaluation of a Boolean expression determines the value of the expression even if some variables of the expression are undefined. Consider the following examples.

<a id="wwID0ECAIS"></a>

## Case 1

<a id="wwID0EGAIS"></a>

The expression is RED && LARGE

<a id="wwID0EOAIS"></a>

If the value of the variable RED or LARGE is FALSE, then the value of the entire expression is FALSE irrespective of the value of the other variable.

<a id="wwID0EJBIS"></a>

## Case 2

<a id="wwID0ENBIS"></a>

The expression is RED||LARGE

<a id="wwID0EVBIS"></a>

If the value of the variable RED or LARGE is TRUE, then the value of the entire expression is TRUE irrespective of the value of the other variable.

<a id="wwID0EPCIS"></a>

## General Case

<a id="wwID0ETCIS"></a>

These examples can be extended to the general case of Boolean expressions because they can be decomposed into nested conjunctions/disjunctions/negations. For example, consider this expression:

<a id="wwID0EXCIS"></a>

(X || Y) && (Z && W) && (V || W)

<a id="wwID0E5CIS"></a>

If the value of the variable Z is FALSE, then the entire Boolean expression evaluates to FALSE regardless of the values of the variables X, Y, W, V.

<a id="wwID0EUDIS"></a>

## Additional Uses Cases for Filtering

<a id="wwID0EYDIS"></a>

There are additional use cases to consider when filtering a configurable structure:

<a id="wwID0EREIS"></a>

- A product structure can have both basic and advanced expressions assigned to different module variants. Option filtering behaves as follows:

<a id="wwID0EWFIS"></a>

- In the case of basic expressions, the filter considers the union of the selections on item and on the usage link. If at least one expression evaluates to TRUE, the module variant is not filtered out.

<a id="wwID0EYGIS"></a>

- In the case of advanced expressions, only if both the expression on the item and the expression on the usage link of that item must evaluate to TRUE, then the module variant is not filtered out.

<a id="wwID0E2HIS"></a>

- An expression is assigned to both the usage link and to the occurrences of the module variant in the configured product structure. The Option Filter first evaluates the expression assigned to the usage link, and then the expression assigned to its occurrences, in the following order:

<a id="wwID0EAJIS"></a>

- If the assigned expression evaluates to FALSE, the module variant is filtered out, including all its occurrences.

<a id="wwID0ECKIS"></a>

- If the assigned expression valuates to TRUE, then the Option Filter evaluates the expression assigned to occurrences. If it is FALSE, an occurrence is filtered out.
