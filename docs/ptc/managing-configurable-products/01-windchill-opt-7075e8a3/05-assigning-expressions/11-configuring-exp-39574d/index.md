# Configuring Expressions

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsCustomizingOperands.html)  
> 获取日期：2026-11-12

<a id="wwID0EZRAS"></a>

<a id="wwID0ENSAS"></a>

## Mapping Operators Used In Expressions

<a id="wwID0ERSAS"></a>

You can map the characters used for logical operators that appear in the user interface to the internal characters for logical operators ("&&", "||", "!") that are stored in the database.

<a id="wwID0EVSAS"></a>

To specify custom logical operators in expressions, set the following values in the properties WT\_HOME\\codebase\\wt.properties file:

<a id="wwID0ESTAS"></a>

- ato.conjunction.operator

<a id="wwID0EWUAS"></a>

- ato.disjunction.operator

<a id="wwID0E1VAS"></a>

- ato.negation.operator

<a id="wwID0EJSAS-4"></a>

The Load file uses AND (logical AND), OR (logical OR), and ! (Logical NOT) operators for loading expressions and is not configurable.

<a id="wwID0EPWAS"></a>

Out-of-the box values are:

<a id="wwID0EHXAS"></a>

- For AND: ato.conjunction.operator=+

<a id="wwID0EMYAS"></a>

- For OR: ato.disjunction.operator=/

<a id="wwID0ERZAS"></a>

- For NOT: ato.negation.operator= -

<a id="wwID0EG1AS"></a>

You can specify your own values for AND, OR, or NOT by providing your own symbols after “=”. When defining expressions, these symbols are used to denote the conjunction (logical AND), the disjunction (logical OR), and the negation (logical NOT) operators. For example:

<a id="wwID0EK1AS"></a>

-red + -(green / white / -blue)

<a id="wwID0EV1AS"></a>

## Using the Expression Converter To Support Site-specific Formats

<a id="wwID0EZ1AS"></a>

Sites can customize the format for entering and displaying expressions using an expression converter available with Windchill.

<a id="wwID0EJ2AS"></a>

To specify a custom expression format converter:

<a id="wwID0EC3AS"></a>

1. Create a class implementing com.ptc.wpcfg.logic.ExpressionFormatConverter that defines the following three methods:

<a id="wwID0EL4AS"></a>

- Method for converting the subexpression from custom to out-of-the-box

<a id="wwID0E34AS"></a>

public String toInternalSubexpressionFormat(String externalSubexpressionString)

<a id="wwID0EB5AS"></a>

- The argument externalSubexpressionString represents a subexpression string in an external (custom) format used when entering expressions in the expression definition user interface. The custom format is used when assigning expressions to part usage links and parts, and when specifying expressions for a conditional rule.

<a id="wwID0EK5AS"></a>

- The method returns a subexpression string in an internal out-of-the-box format where the operands are choice names if they represent valid Java identifiers, and quoted choice names if they are not valid Java identifiers. The logical conjunction AND, disjunction OR, and negation NOT operators must conform to the definitions specified in ato.conjunction.operator, ato.disjunction.operator, and ato.negation.operator properties in the wt.properties file, respectively. The out-of-the-box values are: “+” for the conjunction, “/” for the disjunction, and “-“ for the negation operators.

<a id="wwID0EQ6AS"></a>

- Methods for converting the subexpression from out-of-the-box to custom

<a id="wwID0EBABS"></a>

public String toExternalSubexpressionFormat(String internalSubexpressionString)

<a id="wwID0ELABS"></a>

- The argument internalSubexpressionString represents a subexpression string in an internal out-of-the-box format. The method returns the subexpression String in the external (custom format). This format is used in the expression definition user interface.

<a id="wwID0EFBBS"></a>

- Method for the custom display of expressions

<a id="wwID0EWBBS"></a>

public String toExternalExpressionFormat (String \[\] internalSubexpressionStrings)

<a id="wwID0E2BBS"></a>

- The argument internalSubexpressionStrings is an array of subexpression strings in internal out-of-the-box format in the same order as in the expression definition user interface. The method returns the entire expression String in the external (custom) format. This format will be used when displaying the expression in the assigned expression columns in the product structure browser, in the rule definition columns in various conditional rule tables, and in the conditional rule information pages. In the implementation of this method, you can use the toExternalSubexpressionFormat(String) method to convert subexpressions into the custom format.

<a id="wwID0E1CBS"></a>

2. Register the full path to the expression converter class under the property ato.expression.converter in the wt.properties file. For example:

<a id="wwID0ETDBS"></a>

ato.expression.converter=ext.customer.expr.format.CustomExpressionFormatConverter.
