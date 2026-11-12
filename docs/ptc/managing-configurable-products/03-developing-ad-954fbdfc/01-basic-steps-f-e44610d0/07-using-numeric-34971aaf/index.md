# Using Numeric Operators and Functions in Advanced Logic

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsNumericOperators.html)  
> 获取日期：2026-11-12

<a id="wwID0E6GGT"></a>

<a id="wwID0ETHGT"></a>

Parameters can be defined for several different types. This section provides examples for using operators and functions on numeric parameters in advanced logic.

<a id="wwID0E3HGT"></a>

## Operators for Numeric Parameters

<a id="wwID0EAIGT"></a>

Parameters may be defined for Integer or Real numeric types. While these types correspond to the Windchill type definitions to which the parameter can be mapped, these are internally mapped to the Java primitive types of long and double, respectively, enabling their use in any valid Java expression as long and double variables.

<a id="wwID0EJIGT"></a>

The expressions can be defined from:

<a id="wwID0ECJGT"></a>

- The **Expression** field of a parameter defining an actual or default value of the parameter. For additional information on use of expressions in parameters, see [Information Tab of the Edit Parameter Window](../01-adding-a-parameter/01-editing-a-parameter/01-information-t-33602fc6/index.md#wwID0ESX4S "Information Tab of the Edit Parameter Window").

<a id="wwID0ESKGT"></a>

- A constraint of type **Expression** requires the expression to evaluate to a Boolean. For additional information on constraint types of expressions, see [Expression Editor](../03-adding-a-constraint/02-expression-editor/index.md#wwID0ELPET "Expression Editor").

<a id="wwID0ECMGT"></a>

- Expressions can also be used in advanced case table. For additional information on advanced case tables, see [Case Table Editor](../03-adding-a-constraint/01-case-table-editor/index.md#wwID0EZYCT "Case Table Editor").

<a id="wwID0EENGT"></a>

## Arithmetic Operators

<a id="wwID0EINGT"></a>

Arithmetic operators can be used with numeric parameters in expressions. These include the binary addition (+), subtraction (-), multiplication (\*), and division (/) operators. For example, the following are the examples of expression constraints:

<a id="wwID0EBOGT"></a>

- 2 \* a – 3 \* b == c / d + e / 3

<a id="wwID0EFPGT"></a>

- A == 2.5 \* B / C – D / 7.5

<a id="wwID0EINGT-2"></a>

Single entry or unary operators - and + can also be used (+A is equivalent to A).

<a id="wwID0EOQGT"></a>

- A == -B + 2 \* C

<a id="wwID0ESRGT"></a>

- D = +A – (-C)

<a id="wwID0EINGT-4"></a>

The modulo (%) operator can be used to compute the remainder from the division of the first argument by the second argument:

<a id="wwID0EANGT-2"></a>

A == B % 7

<a id="wwID0EPSGT"></a>

## Relational Operators

<a id="wwID0ETSGT"></a>

Relational operators are used for comparing numeric sub-expressions in expression constraints that must evaluate to Boolean. These include the following operators:

<a id="wwID0EMTGT"></a>

- equal to (==)

<a id="wwID0EOUGT"></a>

- greater than (>)

<a id="wwID0EQVGT"></a>

- less than (<)

<a id="wwID0ESWGT"></a>

- greater than or equal to (>=)

<a id="wwID0EUXGT"></a>

- less than or equal to (<=)

<a id="wwID0EWYGT"></a>

- not equal (!=)

> ![\*](../../../../images/6652ad397dd1_note_16x16.png) **Note:** The "equal to" operator must be written as “==”, and not as “=”.

<a id="wwID0ETSGT-3"></a>

When the left or right side of the expression with the “==” operator contains a single expression, then the expression is treated as an assignment (=). For example, in the following expression constraints:

<a id="wwID0EX1GT"></a>

- A == 2 \* B + 3 \* C

<a id="wwID0E22GT"></a>

- B / 4 - C / 3 == A

<a id="wwID0ETSGT-5"></a>

Once the values of the parameters B and C are known, then the value of the parameter A will be computed according to the formulae. In the above examples, parameter A should be defined as a non-input parameter, so that its value is computed by the formula rather than entered by the user and then computed by the formula. This also means that the input order is important where B and C are defined prior to the appearance of A. If defined in any other order where parameter A is assigned its value before the parameters B and C, then the expression is treated as a Boolean expression where the value of the parameter A is compared with the value of the formula evaluated based on the values of B and C.

> ![\*](../../../../images/6652ad397dd1_note_16x16.png) **Note:** When both sides contain more than a single parameter, all parameters must be known before the expression constraints can be evaluated.

<a id="wwID0EP4GT"></a>

## Referencing Methods or Expression Fragments for Numeric Parameters in Functions

<a id="wwID0ET4GT"></a>

Numeric parameters can also be used as arguments in OOTB, standard Java, and user-defined functions. The following sections provide alternatives for referencing a method or an expression fragment.

<a id="wwID0EX4GT"></a>

In the examples below, consider D\_1, D\_2, D\_3, D\_4, D\_5, and D\_6 as Real (Java double) parameters while P\_1, P\_2, P\_3, and P\_4 as Integer (Java long) parameters. Additionally, GeomFunctions is the name of the user-defined class, from the package ext.geom, containing geometric functions.

<a id="wwID0EJ5GT"></a>

## Using the Full Class Path to the Method

<a id="wwID0EN5GT"></a>

The fully-qualified name (<package path>.<class name>.<method name>) can be used to specify the function passing the parameters as arguments. The following examples illustrate this approach:

<a id="wwID0EK6GT"></a>

- D\_1 == java.lang.Math.cos(D\_2) + java.lang.Math.sin(D\_3)

<a id="wwID0EOAHT"></a>

- P\_1 == java.lang.StrictMath.addExact(P\_2, P\_3)

<a id="wwID0ESBHT"></a>

- D\_4 == ext.geom.GeomFunctions.area(D\_5, D\_6)

<a id="wwID0ELCHT"></a>

## Using the Import Declarations

<a id="wwID0EPCHT"></a>

The classes to be imported can be specified in the WT\_HOME/codebase/com/ptc/wpcfg/exparser/LookUpService.properties file as follows:

<a id="wwID0EYCHT"></a>

exparser.import.1=java.lang.Math<br> exparser.import.2=java.lang.StrictMath<br> exparser.import.3=ext.geom.GeomFunctions

<a id="wwID0EPCHT-4"></a>

When the above import declarations are used, the package path can be omitted when specifying the function in the expressions:

<a id="wwID0ESDHT"></a>

- D\_1 == Math.exp(D\_2)

<a id="wwID0EWEHT"></a>

- P\_1 == StrictMath.round(D\_3)

<a id="wwID0E1FHT"></a>

- D\_3 == ext.geom.GeomFunctions.volume(D\_4, D\_5, D\_6)

<a id="wwID0ETGHT"></a>

## Using the Static Import Declarations

<a id="wwID0EXGHT"></a>

Static import declarations can first be specified in the WT\_HOME/codebase/com/ptc/wpcfg/exparser/LookUpService.properties file as follows:

<a id="wwID0EAHHT"></a>

exparser.static.import.1=java.lang.Math<br>exparser.static.import.2=ext.geom.GeomFunctions

<a id="wwID0EXGHT-4"></a>

Both the package path and the class name can be omitted, leaving only the method name, when specifying the function in the expression when using static import declarations:

<a id="wwID0E1HHT"></a>

- D\_1 == exp(D\_2)

<a id="wwID0E5IHT"></a>

- P\_1 == round(D\_3)

<a id="wwID0ECKHT"></a>

- D\_3 == ext.geom.GeomFunctions.volume(D\_4, D\_5, D\_6)

<a id="wwID0EXGHT-6"></a>

If a method with the same name exists in multiple classes registered in the static imports, an exception error is displayed. For example, java.lang.Math and java.lang.StrictMath have many method names in common. Registering both classes as static imports will lead to error conditions when using such common methods in formulae.

<a id="wwID0EELHT"></a>

## Using Abbreviations (Aliases) for Methods

<a id="wwID0EILHT"></a>

Mapping between an abbreviation for a method and the full path to the method can be defined in the WT\_HOME/codebase/com/ptc/wpcfg/exparser/LookUpService.properties file as follows:

<a id="wwID0ERLHT"></a>

exparser.abbreviation.1=SURFACE\_AREA=ext.geom.GeomFunctions.area<br>exparser.abbreviation.2=ARC\_TAN=java.lang.StrictMath.atan

<a id="wwID0EILHT-4"></a>

Once the mapping between an abbreviation for a method and its full path are defined, you can use these aliases to access the function in expression:

<a id="wwID0ELMHT"></a>

- D\_1 == ARC\_TAN(D\_2)

<a id="wwID0EPNHT"></a>

- D\_3 == SURFACE\_AREA(D\_4, D\_5)

<a id="wwID0EILHT-6"></a>

This technique is useful if you want to redefine a method from a Java class to be the same as the name of a function in a different application such as Microsoft Excel. When setting the ato.expression.rendering.context=com.ptc.wpcfg.logic.XLSExpressionRenderingContext property in the WT\_HOME/wt.properties file, then the system adds appropriate aliases to provide access to most numeric, text, and logical functions by the names used in Microsoft Excel application. The numeric functions include ABS, ACOS, ASIN, ATAN, CEILING, COS, DEGREES, FLOOR, INT, LN, LOG, MAX, MIN, MOD, POWER, RADIANS, ROUND, ROUNDDOWN, ROUNDUP, SIN, SQRT, TAN, ACOSH, ASINH, ATANH, COMBIN, COSH, EXP, FACT, LOG10, SIGN, SINH, TANH.

<a id="wwID0EROHT"></a>

## Using Macros

<a id="wwID0EVOHT"></a>

While an abbreviation provides an aliase for the full function path of a single function, a macro is an alias for an expression fragment. It is useful when an expression fragment is used repeatedly in multiple expression. Import, static import, and abbreviation declaration are resolved on-the-fly when an expression is parsed. Macro fragments are first substituted for macros in the expression, and then the expression is parsed. As other parser properties, macro mappings are defined in the WT\_HOME/codebase/com/ptc/wpcfg/exparser/LookUpService.properties file as follows:

<a id="wwID0E5OHT"></a>

exparser.macro.1=AREA=SURFACE\_AREA(D\_2, D\_3)<br>exparser.macro.2=SUM=java.lang.StrictMath.addExact(P\_2, P\_3)

<a id="wwID0EVOHT-4"></a>

Then, you can use the macros in the following expressions:

<a id="wwID0EYPHT"></a>

- D\_1 == AREA + 10.2

<a id="wwID0E3QHT"></a>

- P\_1 == SUM + P\_4
