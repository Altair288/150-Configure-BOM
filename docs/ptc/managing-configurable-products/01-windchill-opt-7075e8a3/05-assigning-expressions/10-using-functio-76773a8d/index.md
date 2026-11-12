# Using Functions in Advanced Expressions

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsUsingFunctInExpressions.html)  
> 获取日期：2026-11-12

<a id="wwID0EGY5R"></a>

<a id="wwID0EWY5R"></a>

This topic explains different ways of defining functions used in expressions assigned to usage links and parts, and evaluated during the Option filtering process by the Option filtering delegate. The next sections cover the following aspects:

<a id="wwID0EPZ5R"></a>

- Different ways to specify an alias for a function to reduce the size and enable reuse of expressions

<a id="wwID0ER15R"></a>

- Information on how the implementor of the functions can get access to the objects of the filtering framework: the Option navigation filter, navigation criteria, option set, effectivity date, objects being filtered or involved in the filtering process (such as parts, usage links, and data associated with them).

<a id="wwID0EI25R"></a>

## Overview of the Function Definition and Its Use in Expressions

<a id="wwID0EM25R"></a>

Define a Java class with a public static method (a function) taking arguments that you want to pass to the function. The only variable arguments that you can pass to the functions are Choices (specifically, their selection status true if selected, and false if not selected) and the object of type com.ptc.windchill.option.model.ATONavigationBean provided and populated by the filtering framework at runtime (described in a later section). Once defined, the public static method of the Java class can be used in the expression in a number of different ways using the following formats:

<a id="wwID0ER35R"></a>

- Using the full class path to the method

<a id="wwID0ET45R"></a>

- Using the ClassName.MethodName() format if the corresponding import for the class is defined

<a id="wwID0EZ55R"></a>

- Using the MethodName() format () if the corresponding static import for the class is defined

<a id="wwID0E665R"></a>

- Using the MethodAbbreviation() if the abbreviation (or alias) is defined for the method

<a id="wwID0EFB6R"></a>

- Using the macro if the macro is defined

<a id="wwID0EXB6R"></a>

In the following sections, you can find examples of constructing some sample functions and expressions with these functions for each of the afore-mentioned situations. You can write functions to take advantage of the variable ATONavigationBean object that provides access to the current NavigationCriteria, ATONavigationFilter, effectivity date of the Option filter, the option set of the Option filter, choices selected in the Option filter, the selection status for all choices in the OptionSet, the current NavigationUnit with the Filterable node (for example, WTPartUsageLink) and supporting nodes (for example, child WTPart of the usage link). In particular, this allows the use of other objects (such as attribute values on parts, usage links, and usage occurrences) in the filtering decisions.

<a id="wwID0EAC6R"></a>

## Function Definition

<a id="wwID0EEC6R"></a>

To define a function, write a Java class with a public static method with the desired arguments.

<a id="wwID0ENC6R"></a>

Java Code:

<a id="wwID0ESC6R"></a>

![](../../../../images/f006f84b2515_Java1.png)

<a id="wwID0E5C6R"></a>

Explanation:

<a id="wwID0ECD6R"></a>

This is an example of a static Boolean function that takes four Boolean arguments and returns a value as determined from the following truth table (T means true, F means FALSE):

<a id="wwID0EGD6R"></a>

Truth Table:

| x1 | x2 | x3 | x4 | Return |
| --- | --- | --- | --- | --- |
| T | F | T | F | T |
| T | T | F | F | T |
| F | T | F | T | T |
| F | F | T | T | T |

<a id="wwID0EQN6R"></a>

All other combinations of x1, x2, x3, and x4 produce the FALSE value (F).

<a id="wwID0EUN6R"></a>

To arrive at the corresponding expression for each row, substitute the name of the parameter for T (for example, x1), the negation of the parameter for F (! x1), and concatenate these results with conjunction operators (&&). For example, the first row results in the following expression:

<a id="wwID0EYN6R"></a>

x1 && ! x2 && x3 && ! x4

<a id="wwID0E6N6R"></a>

Then, you concatenate row Boolean expressions with the disjunction operators (||) to arrive at the expression representing the truth table.

> ![\*](../../../../images/6652ad397dd1_note_16x16.png) **Note:** If you use the same choice repeatedly in the expression, you can benefit from introducing a function and using it in the expression, as explained next.

<a id="wwID0ECP6R"></a>

The function can return any type (for example, any of the number primitive such as int, double, float) and then can be compared with the constant of the same type to produce a Boolean expression as in the following example.

<a id="wwID0EGP6R"></a>

![](../../../../images/c2e8e8a3aa36_Java2.png)

<a id="wwID0ESP6R"></a>

These kinds of functions allow you to filter out those configurations that exceed the total cost specified. Another approach is to pass the cost integer as another parameter to the function, and do comparison inside the function itself. This results in returning a Boolean from the function.

<a id="wwID0E2P6R"></a>

## Use in Expressions

<a id="wwID0E6P6R"></a>

In the following examples, it is assumed that we have choices RED, GREEN, BLUE, WHITE from the COLOR option; UK, US, MX from the COUNTRY option; PLASTIC, STEEL, WOOD from the MATERIAL option; and SMALL, MEDIUM, LARGE, X\_LARGE from the SIZE option. We also use choices hasHD\_TV, hasBLUERAY, hasWI\_FI.

<a id="wwID0ENR6R"></a>

## Using the Full Class Path to the Method

<a id="wwID0ERR6R"></a>

In this case, you use the full class path plus the method name to specify the function. As arguments to the function in this example, you pass choice names. The following examples illustrate this approach:

<a id="wwID0EJS6R"></a>

- com.ptc.ext.BooleanTableFunction.evaluate(RED, UK, PLASTIC, LARGE)

<a id="wwID0E4S6R"></a>

- BLUE && com.ptc.ext.BooleanTableFunction.evaluate(GREEN, US, STEEL, SMALL) || MEDIUM

<a id="wwID0EAU6R"></a>

- com.ptc.ext.CostFunction.getCost(hasHD\_TV, hasBLUERAY, hasWI\_FI)> 100

<a id="wwID0E1U6R"></a>

## Using the Import Declarations

<a id="wwID0E5U6R"></a>

The classes to be imported can be specified in the properties file WT\_HOME/codebase/ com/ptc/wpcfg/exparser/LookUpService.properties as follows:

<a id="wwID0E2V6R"></a>

- exparser.import.1=com.ptc.ext.BooleanTableFunction

<a id="wwID0E6W6R"></a>

- exparser.import.2=com.ptc.ext.CostFunction

<a id="wwID0ETX6R"></a>

In this case you can omit the package path when specifying the function in the expression:

<a id="wwID0ELY6R"></a>

- BooleanTableFunction.evaluate(RED, UK, PLASTIC, LARGE)

<a id="wwID0EPZ6R"></a>

- BLUE && BooleanTableFunction.evaluate(GREEN, US, STEEL, SMALL) || MEDIUM

<a id="wwID0ET16R"></a>

- CostFunction.getCost(hasHD\_TV, hasBLUERAY, hasWI\_FI)> 100

<a id="wwID0EN26R"></a>

## Using Static Import Declarations

<a id="wwID0ER26R"></a>

In this case, you first specify the static import declarations in the properties file WT\_HOME/codebase/ com/ptc/wpcfg/exparser/LookUpService.properties as follows:

<a id="wwID0E126R"></a>

exparser.static.import.1=com.ptc.ext.BooleanTableFunction

<a id="wwID0EB36R"></a>

exparser.static.import.2=com.ptc.ext.CostFunction

<a id="wwID0EI36R"></a>

In this case, you can omit both the package path and the class name (leaving only the method name) when specifying the function in the expression:

<a id="wwID0EA46R"></a>

- evaluate(RED, UK, PLASTIC, LARGE)

<a id="wwID0EE56R"></a>

- BLUE && evaluate(GREEN, US, STEEL, SMALL) || MEDIUM

<a id="wwID0EI66R"></a>

- getCost(hasHD\_TV, hasBLUERAY, hasWI\_FI) > 100

<a id="wwID0ECAAS"></a>

## Using Abbreviations (aliases) for Methods

<a id="wwID0EGAAS"></a>

In this case, you define the mapping between an abbreviation for a method and the full path to the method in the properties file WT\_HOME/codebase/ com/ptc/wpcfg/exparser/LookUpService.properties as follows:

<a id="wwID0EKAAS"></a>

exparser.abbreviation.1=EVAL=com.ptc.ext.BooleanTableFunction.evaluate

<a id="wwID0ERAAS"></a>

exparser.abbreviation.2=COST=com.ptc.ext.CostFunction.getCost

<a id="wwID0EYAAS"></a>

Then, you can use these aliases to access the function in expression:

<a id="wwID0EQBAS"></a>

- EVAL(RED, UK, PLASTIC, LARGE)

<a id="wwID0EUCAS"></a>

- BLUE && EVAL(GREEN, US, STEEL, SMALL) || MEDIUM

<a id="wwID0EYDAS"></a>

- COST(hasHD\_TV, hasBLUERAY, hasWI\_FI) > 100

<a id="wwID0EREAS"></a>

## Using Macros

<a id="wwID0EVEAS"></a>

Unlike the abbreviations that provide aliases for the full function path of a single function, a macro is an alias for an expression fragment. It is useful when an expression fragment is used repeatedly on numerous objects such as usage links and parts. Import, static import, and abbreviation declaration are resolved on-the-fly during the expression parsing. Macro fragments are first substituted for macros in the expression, and then the expression is parsed. As other parser properties, macro mappings are defined in the WT\_HOME/codebase/com/ptc/wpcfg/exparser/LookUpService.properties as follows:

<a id="wwID0E5EAS"></a>

exparser.macro.1=EVALUATE=com.ptc.ext.BooleanTableFunction.evaluate(GREEN, US, STEEL, SMALL)

<a id="wwID0EFFAS"></a>

exparser.macro.2=GET\_COST= com.ptc.ext.CostFunction.getCost(hasHD\_TV, hasBLUERAY, hasWI\_FI)

<a id="wwID0EMFAS"></a>

Then, the last two expressions assume the form:

<a id="wwID0EEGAS"></a>

- BLUE && EVALUATE || MEDIUM

<a id="wwID0EIHAS"></a>

- GET\_COST > 100

<a id="wwID0E3HAS"></a>

The macros are useful to denote the ATONavigationBean that contains information about navigation criteria and the structural objects being filtered.

<a id="wwID0EKIAS"></a>

## Accessing Current Filtering Information

<a id="wwID0EOIAS"></a>

The object com.ptc.windchill.option.model.ATONavigationBean is a wrapper bean over instances of the ATONavigationFilter and the current NavigationUnit provided by the filtering framework. Apart from the filter and the navigation unit, the bean defines the methods for obtaining the NavigationCriteria, effectivity date of the Option filter, the OptionSet, the choices selected in the Option filter and the selection status for all choices in the OptionSet grouped by the option.

<a id="wwID0ELJAS"></a>

public ATONavigationFilter getFilter();

<a id="wwID0ESJAS"></a>

public NavigationUnit getNavigationUnit();

<a id="wwID0EZJAS"></a>

public NavigationCriteria getNavigationCriteria();

<a id="wwID0EAKAS"></a>

public Timestamp getFilterEffectivityDate();

<a id="wwID0EHKAS"></a>

public OptionSet getFilterOptionSet();

<a id="wwID0EOKAS"></a>

public Map<String, Set<String>> getFilterChoiceMap();

<a id="wwID0EVKAS"></a>

public Map<String, Boolean> getFilterSelectedChoiceMap();

<a id="wwID0EBLAS"></a>

## Using ATONavigationBean in Expressions

<a id="wwID0EFLAS"></a>

To use the bean, you must first define a function that takes it as one of its parameters. As an example, built-in class is available to you – com.ptc.windchill.option.filter.NavigationUtils that provides methods (functions) for comparing the filter effectivity dates with the fixed upper and/or lower timestamp bounds.

<a id="wwID0EOLAS"></a>

public static boolean afterDate(ATONavigationBean beanOfActivity, String after)

<a id="wwID0EVLAS"></a>

public static boolean beforeDate(ATONavigationBean beanOfActivity, String before)

<a id="wwID0E3LAS"></a>

public static boolean betweenDate(ATONavigationBean beanOfActivity, String after, String before)

<a id="wwID0EDMAS"></a>

There are three other methods that take an additional String argument to specify the date pattern (useful for non-American locales). When specifying the concrete object in the expression, you need to pass an empty object of type ATONavigationBean as returned by the static method ATONavigationBean.newATONavigationBean(). It is convenient to use a macro for denoting the bean provided by this fragment. The filtering framework populates the bean with the ATONavigationFilter and the NavigationUnit, giving you access to the current filtering data.

<a id="wwID0E4MAS"></a>

First of all, define a macro for an instance of the ATONavigationBean and abbreviations for the methods of NavigationUtils in the file LookUpService.properties as follows:

<a id="wwID0EONAS"></a>

exparser.macro.1=EFFECTIVITY\_INFO= com.ptc.windchill.option.model.ATONavigationBean.newATONavigationBean()

<a id="wwID0EVNAS"></a>

exparser.abbreviation.1=BEFORE= com.ptc.windchill.option.filter.NavigationUtils.beforeDate

<a id="wwID0E3NAS"></a>

exparser.abbreviation.2=AFTER= com.ptc.windchill.option.filter.NavigationUtils.afterDate

<a id="wwID0EDOAS"></a>

exparser.abbreviation.3=BETWEEN= com.ptc.windchill.option.filter.NavigationUtils.betweenDates

<a id="wwID0EKOAS"></a>

Now you can define an expression that depends on which time interval the effectivity date falls in:

<a id="wwID0EOOAS"></a>

RED && SMALL && BEFORE(EFFECTIVITY\_INFO, “05/05/2005”) ||

<a id="wwID0EVOAS"></a>

GREEN && LARGE && BETWEEN(EFFECTIVITY\_INFO, “05/05/2005”, “06/06/2006”) ||

<a id="wwID0E3OAS"></a>

BLUE && MEDIUM && BETWEEN(EFFECTIVITY\_INFO, “06/06/2006”, “07/07/2007”) ||

<a id="wwID0EDPAS"></a>

WHITE && X\_LARGE && AFTER(EFFECTIVITY\_INFO, “07/07/2007”)

<a id="wwID0EKPAS"></a>

This expression effectively takes on four different forms, as specified in each row, based on the four different disjoint time intervals:

<a id="wwID0EOPAS"></a>

RED && SMALL - if effectivity date is before **05/05/2005**

<a id="wwID0E1PAS"></a>

GREEN && LARGE - if effectivity date is between **05/05/2005** and **06/06/2006**

<a id="wwID0EKQAS"></a>

BLUE && MEDIUM - if effectivity date is between **06/06/2006** and **07/07/2007**

<a id="wwID0E1QAS"></a>

WHITE && X\_LARGE - if effectivity date is after **07/07/2007**
