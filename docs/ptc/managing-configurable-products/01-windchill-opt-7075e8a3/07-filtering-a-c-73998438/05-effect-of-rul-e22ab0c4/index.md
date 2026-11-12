# Effect of Rules on Choice Selection

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsEffectOfRules.html)  
> 获取日期：2026-11-12

<a id="wwID0E11IS"></a>

<a id="wwID0EK2IS"></a>

The option choices are subject to the rules defined in the assigned option set. As a result, when you select filtering criteria, some of your selections may cause other choices to be automatically selected, enabled, or disabled.

<a id="wwID0EP2IS"></a>

If the assigned option set has rules defined, then:

<a id="wwID0EI3IS"></a>

- Selecting a choice that is included in an include rule automatically selects all associated choices.

<a id="wwID0EK4IS"></a>

- Selecting a choice that is included in an exclude rule automatically disables incompatible choices.

<a id="wwID0EM5IS"></a>

- Selecting a choice that is included in an enable rule makes only certain choices available for selection, while disabling other choices from the same option.

<a id="wwID0E65IS"></a>

Rules that govern the choice selection are evaluated by the system in the following order of processing:

<a id="wwID0EY6IS"></a>

- Exclude rule (global or set-specific) – Excludes incompatible choices.

<a id="wwID0E1AJS"></a>

- Effectivity date (set-specific) – Excludes choices that are not within effectivity range.

<a id="wwID0E4BJS"></a>

- Include rule (global or set-specific) – Includes related target choices after the source choice is selected.

<a id="wwID0EQCJS"></a>

Selection conflicts are handled in the following way:

<a id="wwID0EJDJS"></a>

- For single-choice options:

<a id="wwID0EOEJS"></a>

- A choice selected as a result of an include rule deselects any choice that may have been previously selected for the single-choice option.

<a id="wwID0EQFJS"></a>

- A single-choice selection cannot be deselected if the choice is a target choice for an include rule.

<a id="wwID0ETGJS"></a>

- All target choices of an include rule are ignored if selecting them creates a conflict with an exclude rule.

<a id="wwID0EVHJS"></a>

- If choices are part of an include rule, selecting an effectivity date can make one of the choices unavailable and thus invalidate the include rule. An error message informs you that the selected effectivity date causes a target choice to be deselected.

<a id="wwID0EMIJS"></a>

## Effect of Choice Selection and Rules Causing Choices to be Enabled, Disabled, or Unselected

<a id="wwID0EQIJS"></a>

When you select a choice that triggers a rule or has an effectivity date specified, this can result in disabling or unselecting previously selected choices. When such conflict is detected, the system issues an error message.

<a id="wwID0EUIJS"></a>

Selecting a choice can also trigger a rule that enables the choices that were previously disabled.

<a id="wwID0EYIJS"></a>

To determine whether a choice should be reselected automatically once it is enabled, the system evaluates all factors that have effect on the choice selection. Based on that evaluation, the system adds or removes a checkmark next to the choice. Some of the deciding factors are:

<a id="wwID0EQJJS"></a>

- Is the choice controlled by a rule, and the source choice of that rule is selected?

<a id="wwID0ESKJS"></a>

- Is the choice enabled or disabled by an effectivity date?

<a id="wwID0EULJS"></a>

- Is the choice enabled or disabled by a rule, but is turned on/off by an effectivity date?

<a id="wwID0ELMJS"></a>

## Disabling Rule Checking

<a id="wwID0EPMJS"></a>

If you want to disable the effect of rules on the choice selection, select **Disable Rule Checking** in the **Edit Filter** window.

<a id="wwID0E3MJS"></a>

Consider the following consequences of disabling the rule checking:

<a id="wwID0EVNJS"></a>

- The system skips the verification step for the Minimum Required and Maximum Allowed child parts, allowing you to create a variant part that violates the constraint on the number of the child parts.

<a id="wwID0EXOJS"></a>

- All rules as well as effectivity settings are disabled, and all choices from the assigned option set are now available for selection.
