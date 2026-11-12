# Using the Property ato.alternate.expression.format to Control the Display of Expressions

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsPropertyExpressionDisplay.html)  
> 获取日期：2026-11-12

<a id="wwID0EG1BS"></a>

<a id="wwID0EW1BS"></a>

This section describes the use of the ato.alternate.expression.format property to control the display of expressions in assigned expressions, aliases, and conditional rules.

<a id="wwID0EE2BS"></a>

## Controlling the Read-only Display of Assigned Expressions

<a id="wwID0EI2BS"></a>

Administrators can configure the read-only display of assigned expressions by setting the ato.alternate.expression.format property in wt.properties file. This property setting is site-wide, and it affects the user interfaces that show assigned expressions, choice rues, and aliases.

<a id="wwID0EV2BS"></a>

If this property is set to true, then the format is the following:

<a id="wwID0ES3BS"></a>

- The site-configured character for the OR operator (the default is “/”) is displayed between subexpressions rather than the localized word “OR”.

<a id="wwID0EU4BS"></a>

- For multiple subexpressions, the square brackets \{ "\[" and "\]" \} around the subexpressions of the advanced expression are replaced by the parentheses \{ "(" and ")" \}.

<a id="wwID0EG5BS"></a>

The format refers to the display of subexpressions only in terms of choices.

<a id="wwID0EK5BS"></a>

If the property is set to false, advanced expressions are displayed using the default format.

<a id="wwID0EZ5BS"></a>

## Controlling the Read-only Display of Expressions in Conditional Rules

<a id="wwID0ER6BS"></a>

- The display of the **If** part of the conditional rule appears as follows:

<a id="wwID0E1ACS"></a>

- The site-configured character for the OR operator (the default is “/”) is displayed between subexpressions rather than the localized word “OR”.

<a id="wwID0E3BCS"></a>

- For multiple subexpressions, the square brackets \{ "\[" and "\]" \} around the subexpressions of the advanced expression are replaced by the parentheses \{ "(" and ")" \}.

<a id="wwID0EOCCS"></a>

- Subexpressions are displayed only in terms of choices.

<a id="wwID0EDDCS"></a>

- The display of the **Then** part of the conditional rule shows only choices without options.

<a id="wwID0EZDCS"></a>

For example, if the property is not set, the display of expressions is as follows:

<a id="wwID0E5DCS"></a>

\[(option1 = choice1a / option1 = choice1b) + option2 = choice2a\] OR \[-(option3 = choice3a) + option4 >= choice4a\] --> Include ( opion5 = choice5a, option6 = choice6a)

<a id="wwID0EDECS"></a>

If the property is set to true, the display of expressions appears as follows:

<a id="wwID0EMECS"></a>

((choice1a / choice1b) + choice2a) / (-choice3a + >= choice4a) --> Include ( choice5a, choice6a)

<a id="wwID0EWECS"></a>

## Controlling the Read-only Display of Include, Enable, and Exclude Rules

<a id="wwID0E1ECS"></a>

If the property is defined and set to true, choice rules display only choices, not options.

<a id="wwID0EDFCS"></a>

For example, if the property is not set, the default display of an exclude rule is as follows:

<a id="wwID0EHFCS"></a>

option1 = choice1a; option2 = choice2a, choice2b; option3 = choice3a

<a id="wwID0EMFCS"></a>

If the property is set to true, the display of an exclude rule is as follows:

<a id="wwID0EVFCS"></a>

choice1a; choice2a, choice2b; choice3a

<a id="wwID0E6FCS"></a>

## Controlling the Read-only Display of Aliases

<a id="wwID0EDGCS"></a>

If the property is defined and set to true, aliases show only choices, not options.

<a id="wwID0EMGCS"></a>

If the property is not defined or is set to false, the default format is used.

<a id="wwID0EVGCS"></a>

For example, if the option is set to false, the display format is as following: (option1 = choice1a / option1 = choice1b) + option2 = choice2a + -(option3 = choice3a) + option4 >= choice4a

<a id="wwID0EBHCS"></a>

If the option is set to true, the display format is as following: (choice1a / choice1b) + choice2a / (-choice3a + >= choice4a)
