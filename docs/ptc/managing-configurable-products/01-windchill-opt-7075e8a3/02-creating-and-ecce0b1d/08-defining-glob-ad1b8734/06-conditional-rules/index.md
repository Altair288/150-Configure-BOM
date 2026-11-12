# Conditional Rules

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsConditionalRules.html)  
> 获取日期：2026-11-12

<a id="wwID0EMIAR"></a>

<a id="wwID0E3IAR"></a>

Conditional rules enable you to control the desired behavior during the choice selection process in the Option Filter. Conditional rules use the IF and THEN statements to specify when certain option choices should be included, disabled, enabled, or required based on the choice selections that the user specified in the Option Filter. For example, If Country = USA, then disable Color = Green.

> ![\*](../../../../../images/6652ad397dd1_note_16x16.png) **Note:** Ability to create and manage conditional rules is an advanced capability subject to a separate license entitlement.

<a id="wwID0EFKAR"></a>

Conditional rules consist of two parts – IF and THEN. The IF part describes the selections that trigger a certain action. The IF part contains one or more Boolean expressions that refer to option choices. Expressions are combined by an OR.

> ![\*](../../../../../images/6652ad397dd1_note_16x16.png) **Note:** Conditional rules can refer to option choices that belong to different option pools. This is different for include, exclude, and enable rules where choices must come from the same option pool.

<a id="wwID0EFLAR"></a>

The THEN part describes the action that should be applied to a set of choices when the IF expression is evaluated to TRUE. The possible actions are: Include, Disable, Enable, Requires, Requires Single Select.

<a id="wwID0EKLAR"></a>

The rules are evaluated when you specify the choice selection criteria in the **Option Filter** tab of the **Edit Filter** window.

<a id="wwID0EYLAR"></a>

The **New Conditional Rule** window (see the next figure) is used to enter the IF and THEN statements and the action, for example,

<a id="wwID0ECMAR"></a>

If (Blue + Medium) / (Green + Large), then Include Plastic

<a id="wwID0EPMAR"></a>

![](../../../../../images/08581bac7616_DataMgmtCapabilities.04.0191.1.jpg)

<a id="wwID0E5MAR"></a>

You can create conditional rules within an option pool (global rules) or within an option set (local rules). You can create, edit, and delete conditional rules from the **Conditional Rules** tab from the Option Pool or the Option Set page (see the next figure). Once created, you can see conditional rules in the **Conditional Rules** table.

<a id="wwID0EMNAR"></a>

The **Conditional Rules** table in the figure below shows the rule created using the following IF and THEN statements with the Include action:

<a id="wwID0EWNAR"></a>

If (Blue) / (Green), then Include Plastic

<a id="wwID0EDOAR"></a>

![](../../../../../images/9bf6267608ae_CondRulesTab.png)

<a id="wwID0EROAR"></a>

The effect of conditional rules is observed during the option filtering process. For example, for a conditional rule describing the following logic:

<a id="wwID0EWOAR"></a>

![](../../../../../images/70697543ffb8_CondRuleDef.png)

<a id="wwID0EEPAR"></a>

Selecting Color = Blue and Size = Medium causes Material = Plastic to be selected automatically (see the next figure).

<a id="wwID0EWPAR"></a>

![](../../../../../images/2bbb23a491c3_DataMgmtCapabilities.04.0191.4.jpg)

<a id="wwID0EJQAR"></a>

## Syntax for Creating Conditional Rules

<a id="wwID0ENQAR"></a>

Consider these guidelines for entering conditional rules:

<a id="wwID0EFRAR"></a>

- A conditional rule can have multiple expressions in the IF part. Each row in the **If** section of the window represents an expression. The OR operator is implied between the rows of expressions.

<a id="wwID0E1RAR"></a>

- For example, consider the following two expressions entered in the IF section:

<a id="wwID0ESSAR"></a>

- (Canada && French)

<a id="wwID0EWTAR"></a>

- (Switzerland && German)

<a id="wwID0EKUAR"></a>

- The two expressions are combined as the following IF statement:

<a id="wwID0EOUAR"></a>

\[Country = Canada + Language = French\] OR \[Country = Switzerland + Language = German\]

<a id="wwID0EEVAR"></a>

- The conditional rule can have multiple THEN statements.

<a id="wwID0EVVAR"></a>

- For example, for the above IF statement, the action Include = Red, Medium entered in the first row and the action Enable = Fast entered in the second row of the **Then** section, creates the following conditional rule with multiple THEN statements:

<a id="wwID0EGWAR"></a>

\[Country = Canada + Language = French\] OR \[Country = Switzerland + Language = German\] --> Include (Color = Red, Size = Medium) Enable (Speed = Fast)

<a id="wwID0EMWAR"></a>

For information on the accepted operators used for creating expressions, see [Defining Options with Advanced Expressions](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/sim_installconfig/sis10109.html).

<a id="wwID0E6WAR"></a>

## Validating Expressions

<a id="wwID0EDXAR"></a>

In addition to the standard validation performed by the system, companies can implement a custom validation. For more information, see [Validating Expressions](../../../05-assigning-expressions/12-validating-expressions/index.md#wwID0ENEBS "Validating Expressions").
